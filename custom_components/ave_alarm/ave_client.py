"""WebSocket client for AVE Alarm panel.

Orchestrates the connection lifecycle and arm/disarm commands.
Protocol encoding is in ``protocol.py``, XML parsing in ``parsers.py``.

Connection flow:
  1. WebSocket connect → version handshake → PAIRING → FILE config
  2. Listen for STATE events (area states, battery, GSM, power, WiFi, cloud)
  3. Arm/disarm: LOGIN(TERM_CODE) → optional ANOM_ACK → DEVICE_CMD → LOGOUT
"""
from __future__ import annotations

import asyncio
import logging
import time
from xml.etree import ElementTree as ET
from typing import Callable

import websockets

from .const import (
    AREA_STATE_ARMED,
    AREA_STATE_ARMING,
    AREA_STATE_OFF,
    CMD_ARM,
    CMD_DISARM,
    LOGIN_INHIBITED,
    LOGIN_REFUSED,
    MAX_AREAS,
    STATE_ALARM,
)
from .parsers import (
    PanelState,
    parse_file_response,
    parse_state_event,
    parse_xml,
)
from .protocol import (
    build_anom_ack_body,
    build_device_cmd_body,
    build_file_config_body,
    build_login_body,
    build_logout_body,
    build_pairing_body,
    build_request,
    build_state_body,
    encode_area_mask,
    frame,
    generate_source_sn,
    to_xml_str,
)

_LOGGER = logging.getLogger(__name__)


class AVEAlarmClient:
    """Client to communicate with AVE Alarm panel via WebSocket."""

    def __init__(
        self,
        host: str,
        port: int,
        pin: str,
        target_sn: str,
        areas: str,
    ) -> None:
        self._host = host
        self._port = port
        self._pin = pin
        self._target_sn = target_sn
        self._areas = areas

        # Connection state
        self._source_sn: str = ""
        self._ws: websockets.WebSocketClientProtocol | None = None
        self._connected = False
        self._paired = False
        self._msg_id_counter = 0
        self._pending_requests: dict[str, asyncio.Future] = {}

        # All panel runtime state lives here
        self.state = PanelState()

        # Callbacks & background tasks
        self._callbacks: list[Callable] = []
        self._listen_task: asyncio.Task | None = None
        self._reconnect_task: asyncio.Task | None = None

    # ── Properties (delegate to self.state) ─────────────────────────

    @property
    def ws_url(self) -> str:
        return f"ws://{self._host}:{self._port}/"

    @property
    def connected(self) -> bool:
        return self._connected and self._paired

    @property
    def area_states(self) -> dict[str, str]:
        return self.state.area_states

    @property
    def area_names(self) -> dict[str, str]:
        return self.state.area_names

    @property
    def area_enabled(self) -> dict[str, bool]:
        return self.state.area_enabled

    @property
    def area_exit_delays(self) -> dict[str, int]:
        return self.state.area_exit_delays

    @property
    def panel_serial(self) -> str:
        return self.state.panel_serial

    @property
    def panel_state(self) -> str:
        return self.state.panel_state

    @property
    def panel_version(self) -> str:
        return self.state.panel_version

    @property
    def anomalies(self) -> list[dict]:
        return self.state.anomalies

    @property
    def battery_level(self) -> str | None:
        return self.state.battery_level

    @property
    def gsm_info(self) -> str | None:
        return self.state.gsm_info

    @property
    def gsm_imei(self) -> str | None:
        return self.state.gsm_imei

    @property
    def gsm_state(self) -> str | None:
        return self.state.gsm_state

    @property
    def power_state(self) -> str | None:
        return self.state.power_state

    @property
    def wifi_state(self) -> str | None:
        return self.state.wifi_state

    @property
    def cloud_state(self) -> str | None:
        return self.state.cloud_state

    # ── Callbacks ───────────────────────────────────────────────────

    def register_callback(self, callback: Callable) -> Callable:
        """Register a state-change callback. Returns an unregister fn."""
        self._callbacks.append(callback)

        def unregister() -> None:
            if callback in self._callbacks:
                self._callbacks.remove(callback)

        return unregister

    def _notify(self) -> None:
        for cb in self._callbacks:
            try:
                cb()
            except Exception:
                _LOGGER.exception("Error in state callback")

    # ── Transport ───────────────────────────────────────────────────

    def _next_msg_id(self) -> str:
        self._msg_id_counter += 1
        return f"{self._msg_id_counter:02d}"

    async def _send(self, request_type: str, body: str, msg_id: str | None = None) -> None:
        """Build, frame, and send an XML request."""
        if not self._ws:
            raise ConnectionError("Not connected")
        xml = build_request(self._source_sn, self._target_sn, request_type, body, msg_id or "00")
        _LOGGER.debug("TX: %s", xml[:200])
        await self._ws.send(frame(xml))

    async def _send_and_wait(self, request_type: str, body: str, timeout: float = 10.0) -> ET.Element | None:
        """Send a request and wait for the correlated response."""
        msg_id = self._next_msg_id()
        fut: asyncio.Future[ET.Element] = asyncio.get_event_loop().create_future()
        self._pending_requests[msg_id] = fut
        await self._send(request_type, body, msg_id)
        try:
            return await asyncio.wait_for(fut, timeout=timeout)
        except asyncio.TimeoutError:
            _LOGGER.warning("Timeout (id=%s type=%s)", msg_id, request_type)
            self._pending_requests.pop(msg_id, None)
            return None

    # ── Connection lifecycle ────────────────────────────────────────

    async def connect(self) -> bool:
        """Full handshake: WS connect → version → PAIRING → FILE config."""
        self._source_sn = generate_source_sn()
        self._msg_id_counter = 0
        self._paired = False
        self.state.config_loaded = False

        try:
            _LOGGER.info("Connecting to AVE alarm at %s", self.ws_url)
            self._ws = await websockets.connect(
                self.ws_url, ping_interval=None, ping_timeout=None, close_timeout=5,
            )
            self._connected = True

            if not await self._version_handshake():
                await self.disconnect()
                return False

            if not await self._pairing():
                await self.disconnect()
                return False
            self._paired = True

            # PAIRING response includes the configuration; fall back to
            # explicit FILE request only if it wasn't loaded.
            if not self.state.config_loaded:
                await self._load_configuration()
            await asyncio.sleep(0.5)

            self._listen_task = asyncio.create_task(self._listen_loop())
            await self._send("STATE", build_state_body("HOME"))

            _LOGGER.info(
                "Connected (version=%s central=%s areas=%d)",
                self.state.panel_version,
                self.state.central_device_id,
                len(self.state.area_names),
            )
            return True

        except Exception:
            _LOGGER.exception("Connect failed")
            self._connected = self._paired = False
            return False

    async def disconnect(self) -> None:
        self._connected = self._paired = False
        for task in (self._listen_task, self._reconnect_task):
            if task and not task.done():
                task.cancel()
        self._listen_task = self._reconnect_task = None
        for fut in self._pending_requests.values():
            if not fut.done():
                fut.cancel()
        self._pending_requests.clear()
        if self._ws:
            try:
                await self._ws.close()
            except Exception:
                pass
            self._ws = None

    async def _version_handshake(self) -> bool:
        """Receive and log the panel's raw version string."""
        try:
            raw = await asyncio.wait_for(self._ws.recv(), timeout=10.0)
            v = raw.decode("utf-8", errors="replace") if isinstance(raw, bytes) else raw
            self.state.panel_version = v.strip().strip("\x02\x03")
            _LOGGER.info("Panel version: %s", self.state.panel_version)
            return True
        except asyncio.TimeoutError:
            _LOGGER.error("Version handshake timeout")
            return False

    async def _pairing(self) -> bool:
        """Send PAIRING request and consume messages until the response arrives.

        The panel sends a burst of STATE events before the PAIRING
        Response (which contains the base64 configuration). We buffer
        early STATE events and replay them after configuration loads,
        since the device→subcategory map is needed to parse them.
        """
        pairing_id = self._next_msg_id()
        await self._send("PAIRING", build_pairing_body(), pairing_id)
        early_state_events: list[str] = []
        deadline = time.monotonic() + 15.0
        while time.monotonic() < deadline:
            try:
                raw = await asyncio.wait_for(self._ws.recv(), timeout=10.0)
                xml_str = to_xml_str(raw)
                if xml_str:
                    # Buffer STATE events that arrive before config is loaded
                    if not self.state.config_loaded:
                        root = parse_xml(xml_str)
                        if root is not None and root.tag == "Event" and root.get("type") == "STATE":
                            early_state_events.append(xml_str)
                    self._route_xml(xml_str)
                    # Check if this was our PAIRING response
                    root = parse_xml(xml_str)
                    if root is not None and root.tag == "Response" and root.get("id") == pairing_id:
                        # Replay buffered STATE events now that config is loaded
                        if early_state_events and self.state.config_loaded:
                            _LOGGER.debug("Replaying %d early STATE events", len(early_state_events))
                            for evt_xml in early_state_events:
                                self._route_xml(evt_xml)
                        _LOGGER.info("Pairing completed (config_loaded=%s)", self.state.config_loaded)
                        return True
            except asyncio.TimeoutError:
                break
        _LOGGER.error("Pairing timeout — no response received")
        return False

    async def _load_configuration(self) -> None:
        """Request FILE CONFIGURATION and consume responses until loaded."""
        await self._send("FILE", build_file_config_body())
        deadline = time.monotonic() + 10.0
        while time.monotonic() < deadline:
            try:
                raw = await asyncio.wait_for(self._ws.recv(), timeout=5.0)
                xml_str = to_xml_str(raw)
                if xml_str:
                    self._route_xml(xml_str)
                if self.state.config_loaded:
                    return
            except (asyncio.TimeoutError, Exception):
                break
        if not self.state.config_loaded:
            _LOGGER.warning("Configuration not loaded, using defaults")

    # ── Arm / Disarm ────────────────────────────────────────────────

    async def arm(self, areas: str | None = None) -> bool:
        """LOGIN → optional ANOM_ACK → DEVICE_CMD(C00101) → LOGOUT."""
        areas = areas or self._areas
        mask = encode_area_mask(areas)
        try:
            _LOGGER.info("Arming areas=%s mask=%s", areas, mask)
            if not await self._login_for_command():
                return False
            await asyncio.sleep(0.3)

            if self.state.anomalies and self.state.anomaly_warning != "1":
                flush = self.state.anomaly_flush_area or encode_area_mask(areas)
                await self._send("STATE", build_anom_ack_body(flush))
                await asyncio.sleep(0.3)

            device_id = self.state.central_device_id or "AL002"
            await self._send("DEVICE_CMD", build_device_cmd_body(CMD_ARM, device_id, self._pin, mask))
            await asyncio.sleep(0.3)
            await self._send("MENU", build_logout_body())
            return True
        except Exception:
            _LOGGER.exception("Arm failed")
            await self._safe_logout()
            return False

    async def disarm(self, areas: str | None = None) -> bool:
        """LOGIN → DEVICE_CMD(C00102) → LOGOUT."""
        areas = areas or self._areas
        mask = encode_area_mask(areas)
        try:
            _LOGGER.info("Disarming areas=%s mask=%s", areas, mask)
            if not await self._login_for_command():
                return False
            await asyncio.sleep(0.3)

            device_id = self.state.central_device_id or "AL002"
            await self._send("DEVICE_CMD", build_device_cmd_body(CMD_DISARM, device_id, self._pin, mask))
            await asyncio.sleep(0.3)
            await self._send("MENU", build_logout_body())
            return True
        except Exception:
            _LOGGER.exception("Disarm failed")
            await self._safe_logout()
            return False

    async def _login_for_command(self) -> bool:
        """Send TERM_CODE login and check result."""
        resp = await self._send_and_wait("MENU", build_login_body(self._pin))
        if resp is not None:
            res = resp.findtext("res", "")
            if res == LOGIN_REFUSED:
                _LOGGER.error("Login refused")
                return False
            if res == LOGIN_INHIBITED:
                _LOGGER.error("Login inhibited for %s s", resp.findtext("desc", ""))
                return False
        return True

    async def _safe_logout(self) -> None:
        try:
            await self._send("MENU", build_logout_body())
        except Exception:
            pass

    # ── State helpers ───────────────────────────────────────────────

    async def poll_state(self) -> None:
        try:
            await self._send("STATE", build_state_body("HOME"))
        except Exception:
            pass

    def get_area_state(self, area_id: str) -> str:
        return self.state.area_states.get(area_id, AREA_STATE_OFF)

    def get_area_exit_delay(self, area_id: str) -> int:
        return self.state.area_exit_delays.get(area_id, 0)

    def is_armed(self, area_id: str | None = None) -> bool:
        if area_id:
            return self.get_area_state(area_id) == AREA_STATE_ARMED
        return any(
            self.state.area_states.get(str(i)) == AREA_STATE_ARMED
            for i in range(1, MAX_AREAS + 1) if str(i) in self._areas
        )

    def is_arming(self, area_id: str | None = None) -> bool:
        if area_id:
            return self.get_area_state(area_id) == AREA_STATE_ARMING
        return any(
            self.state.area_states.get(str(i)) == AREA_STATE_ARMING
            for i in range(1, MAX_AREAS + 1) if str(i) in self._areas
        )

    def is_in_alarm(self) -> bool:
        return self.state.panel_state == STATE_ALARM

    # ── Message routing ─────────────────────────────────────────────

    def _parse_message(self, data: bytes | str) -> None:
        """Parse and route an incoming WebSocket message."""
        xml_str = to_xml_str(data)
        if xml_str:
            self._route_xml(xml_str)
        else:
            text = data.decode("utf-8", errors="replace") if isinstance(data, bytes) else data
            _LOGGER.debug("Non-XML message: %s", text[:200])

    def _route_xml(self, xml_str: str) -> None:
        """Parse XML and dispatch to the correct handler."""
        root = parse_xml(xml_str)
        if root is None:
            return

        tag = root.tag
        msg_type = root.get("type", "")
        source = root.get("source", "")
        msg_id = root.get("id", "")

        if source and source != self._source_sn and not self.state.panel_serial:
            self.state.panel_serial = source

        if tag == "Response":
            self._on_response(root, msg_id, msg_type)
        elif tag == "Event":
            self._on_event(root, msg_type)

    def _on_response(self, root: ET.Element, msg_id: str, msg_type: str) -> None:
        # Resolve pending future
        if msg_id in self._pending_requests:
            fut = self._pending_requests.pop(msg_id)
            if not fut.done():
                fut.set_result(root)

        # Also process the payload
        updated = False
        if msg_type in ("FILE", "PAIRING"):
            updated = parse_file_response(root, self.state)

        if updated:
            self._notify()

    def _on_event(self, root: ET.Element, msg_type: str) -> None:
        updated = False
        if msg_type == "STATE":
            updated = parse_state_event(root, self.state)
        elif msg_type == "FILE":
            updated = parse_file_response(root, self.state)
        if updated:
            self._notify()

    # ── Event loop ──────────────────────────────────────────────────

    async def _listen_loop(self) -> None:
        while self._connected:
            try:
                if not self._ws:
                    break
                self._parse_message(await self._ws.recv())
            except websockets.ConnectionClosed:
                _LOGGER.warning("WebSocket closed")
                self._connected = self._paired = False
                self._reconnect_task = asyncio.create_task(self._reconnect_loop())
                break
            except asyncio.CancelledError:
                break
            except Exception:
                _LOGGER.exception("Listen loop error")
                await asyncio.sleep(1)

    async def _reconnect_loop(self) -> None:
        backoff = 5
        while not self._connected:
            _LOGGER.info("Reconnecting in %ds…", backoff)
            await asyncio.sleep(backoff)
            try:
                if await self.connect():
                    self._notify()
                    break
            except Exception:
                pass
            backoff = min(backoff * 2, 300)
