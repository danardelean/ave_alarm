"""WebSocket client for AVE AF927 Alarm panel."""
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
    CMD_AREA_SELECT,
    DEVICE_ALARM,
    PROTOCOL_VERSION,
)

_LOGGER = logging.getLogger(__name__)

XML_HEADER = '<?xml version="1.0" encoding="utf-8"?>'


class AVEAlarmClient:
    """Client to communicate with AVE AF927 alarm panel via WebSocket."""

    def __init__(
        self,
        host: str,
        port: int,
        pin: str,
        target_sn: str,
        areas: str,
    ) -> None:
        """Initialize the client."""
        self._host = host
        self._port = port
        self._pin = pin
        self._target_sn = target_sn
        self._areas = areas
        self._source_sn: str = ""
        self._ws: websockets.WebSocketClientProtocol | None = None
        self._connected = False
        self._area_states: dict[str, str] = {}
        self._panel_serial: str = ""
        self._panel_state: str = ""
        self._anomalies: list[dict] = []
        self._anomaly_warning_count: int = 0
        self._battery_level: str | None = None
        self._gsm_info: str | None = None
        self._gsm_imei: str | None = None
        self._callbacks: list[Callable] = []
        self._listen_task: asyncio.Task | None = None
        self._reconnect_task: asyncio.Task | None = None

    @property
    def ws_url(self) -> str:
        """Return the WebSocket URL."""
        return f"ws://{self._host}:{self._port}/"

    @property
    def connected(self) -> bool:
        """Return connection status."""
        return self._connected

    @property
    def area_states(self) -> dict[str, str]:
        """Return current area states."""
        return self._area_states

    @property
    def panel_serial(self) -> str:
        """Return panel serial number."""
        return self._panel_serial

    @property
    def panel_state(self) -> str:
        """Return panel state code."""
        return self._panel_state

    @property
    def anomalies(self) -> list[dict]:
        """Return list of current anomalies."""
        return self._anomalies

    @property
    def anomaly_warning_count(self) -> int:
        """Return anomaly warning count."""
        return self._anomaly_warning_count

    @property
    def battery_level(self) -> str | None:
        """Return battery level percentage."""
        return self._battery_level

    @property
    def gsm_info(self) -> str | None:
        """Return GSM carrier info."""
        return self._gsm_info

    @property
    def gsm_imei(self) -> str | None:
        """Return GSM IMEI."""
        return self._gsm_imei

    def register_callback(self, callback: Callable) -> Callable:
        """Register a callback for state updates. Returns unregister function."""
        self._callbacks.append(callback)
        def unregister():
            self._callbacks.remove(callback)
        return unregister

    def _notify_callbacks(self) -> None:
        """Notify all registered callbacks of state change."""
        for callback in self._callbacks:
            try:
                callback()
            except Exception:
                _LOGGER.exception("Error in callback")

    def _generate_source_sn(self) -> str:
        """Generate a source serial number (timestamp-based)."""
        return str(int(time.time() * 1000))

    def _build_request(
        self,
        request_id: str,
        request_type: str,
        body: str,
    ) -> str:
        """Build an XML request message."""
        return (
            f'{XML_HEADER}'
            f'<Request id="{request_id}" '
            f'source="{self._source_sn}" '
            f'target="{self._target_sn}" '
            f'protocolVersion="{PROTOCOL_VERSION}" '
            f'type="{request_type}">'
            f'{body}'
            f'</Request>'
        )

    async def connect(self) -> bool:
        """Connect to the alarm panel WebSocket."""
        self._source_sn = self._generate_source_sn()
        try:
            self._ws = await websockets.connect(
                self.ws_url,
                ping_interval=30,
                ping_timeout=10,
                close_timeout=5,
            )
            self._connected = True
            _LOGGER.info("Connected to AVE alarm at %s", self.ws_url)

            # Request initial state
            await self._send_state_request("HOME")

            # Start listening for events
            self._listen_task = asyncio.create_task(self._listen_loop())

            return True
        except Exception:
            _LOGGER.exception("Failed to connect to AVE alarm at %s", self.ws_url)
            self._connected = False
            return False

    async def disconnect(self) -> None:
        """Disconnect from the alarm panel."""
        self._connected = False
        if self._listen_task:
            self._listen_task.cancel()
            self._listen_task = None
        if self._reconnect_task:
            self._reconnect_task.cancel()
            self._reconnect_task = None
        if self._ws:
            await self._ws.close()
            self._ws = None
        _LOGGER.info("Disconnected from AVE alarm")

    async def _send(self, message: str) -> None:
        """Send a message via WebSocket."""
        if not self._ws or not self._connected:
            raise ConnectionError("Not connected to alarm panel")
        _LOGGER.debug("Sending: %s", message)
        await self._ws.send(message)

    async def _send_state_request(self, state_type: str) -> None:
        """Send a state request."""
        msg = self._build_request(
            "00", "STATE", f"<type>{state_type}</type>"
        )
        await self._send(msg)

    async def _send_login(self) -> None:
        """Send login request."""
        body = (
            f"<filter>USER|POWERUSER</filter>"
            f"<act>LOGIN</act>"
            f"<page>USER</page>"
            f"<par>"
            f"<code>{self._pin}</code>"
            f"<type>TERM_CODE</type>"
            f"</par>"
        )
        msg = self._build_request("widget_login_small", "MENU", body)
        await self._send(msg)

    async def _send_logout(self) -> None:
        """Send logout request."""
        body = "<act>LOGOUT</act><page>USER</page><par/>"
        msg = self._build_request("00", "MENU", body)
        await self._send(msg)

    async def _send_anom_ack(self, areas: str) -> None:
        """Send anomaly acknowledgment."""
        body = f"<type>ANOM_ACK</type><value>{areas}</value>"
        msg = self._build_request("00", "STATE", body)
        await self._send(msg)

    async def _send_device_cmd(
        self, command: str, device: str, pin: str, areas: str
    ) -> None:
        """Send a device command."""
        body = (
            f"<Command>{command}</Command>"
            f"<Device>{device}</Device>"
            f"<Arguments>"
            f'<Argument id="PIN">{pin}</Argument>'
            f'<Argument id="AREAS">{areas}</Argument>'
            f"</Arguments>"
        )
        msg = self._build_request("00", "DEVICE_CMD", body)
        await self._send(msg)

    async def arm(self, areas: str | None = None) -> bool:
        """Arm the alarm for the specified areas.

        Args:
            areas: Area string like "123" for areas 1-3.
                   Defaults to configured areas.
        """
        if areas is None:
            areas = self._areas

        # Build the full 6-digit area selection (pad with dashes)
        area_select = "123456"
        area_arm = ""
        for i in range(1, 7):
            if str(i) in areas:
                area_arm += str(i)
            else:
                area_arm += "-"

        try:
            _LOGGER.info("Arming areas: %s", areas)

            # Step 1: Login
            await self._send_login()
            await asyncio.sleep(0.5)

            # Step 2: Acknowledge anomalies (optional — only if anomalies present)
            if self._anomalies:
                _LOGGER.info(
                    "Acknowledging %d anomalies before arming",
                    len(self._anomalies),
                )
                await self._send_anom_ack(area_select)
                await asyncio.sleep(0.3)

            # Step 3: Select areas (C00102)
            await self._send_device_cmd(
                CMD_AREA_SELECT, DEVICE_ALARM, self._pin, area_select
            )
            await asyncio.sleep(0.3)

            # Step 4: Execute arm (C00101)
            await self._send_device_cmd(
                CMD_ARM, DEVICE_ALARM, self._pin, area_arm
            )
            await asyncio.sleep(0.3)

            # Step 5: Logout
            await self._send_logout()

            _LOGGER.info("Arm command sent successfully")
            return True

        except Exception:
            _LOGGER.exception("Failed to arm alarm")
            return False

    async def disarm(self, areas: str | None = None) -> bool:
        """Disarm the alarm for the specified areas.

        Args:
            areas: Area string like "123" for areas 1-3.
                   Defaults to configured areas.
        """
        if areas is None:
            areas = self._areas

        area_select = "123456"

        try:
            _LOGGER.info("Disarming areas: %s", areas)

            # Step 1: Login
            await self._send_login()
            await asyncio.sleep(0.5)

            # Step 2: Disarm (C00102)
            await self._send_device_cmd(
                CMD_AREA_SELECT, DEVICE_ALARM, self._pin, area_select
            )
            await asyncio.sleep(0.3)

            # Step 3: Logout
            await self._send_logout()

            _LOGGER.info("Disarm command sent successfully")
            return True

        except Exception:
            _LOGGER.exception("Failed to disarm alarm")
            return False

    def _parse_message(self, data: str | bytes) -> None:
        """Parse an incoming WebSocket message."""
        if isinstance(data, bytes):
            try:
                data = data.decode("utf-8")
            except UnicodeDecodeError:
                _LOGGER.debug("Received binary data (not XML)")
                return

        if not data.strip().startswith("<?xml"):
            return

        try:
            root = ET.fromstring(data.split("?>", 1)[1] if "?>" in data else data)
        except ET.ParseError:
            _LOGGER.debug("Failed to parse XML: %s", data[:200])
            return

        msg_type = root.get("type", "")
        source = root.get("source", "")

        # Store panel serial
        if source and not self._panel_serial:
            self._panel_serial = source

        # Handle STATE events
        if msg_type == "STATE":
            device = root.findtext("Device", "")
            state_code = root.findtext("State", "")
            updated = False

            if device == DEVICE_ALARM:
                # Area states
                if state_code:
                    self._panel_state = state_code
                areas_elem = root.find("Areas")
                if areas_elem is not None:
                    for area in areas_elem.findall("Area"):
                        area_id = area.get("id", "")
                        area_st = area.get("st", "")
                        if area_id and area_st != self._area_states.get(area_id):
                            self._area_states[area_id] = area_st
                            updated = True
                            _LOGGER.debug(
                                "Area %s state: %s", area_id, area_st
                            )

                # Anomalies
                anoms_elem = root.find("Anoms")
                if anoms_elem is not None:
                    self._anomaly_warning_count = int(
                        anoms_elem.get("warning", "0")
                    )
                    new_anomalies = []
                    for anom in anoms_elem.findall("Anom"):
                        anom_data = {
                            "id": anom.get("id", ""),
                            "device_id": anom.findtext("id", ""),
                            "timestamp": anom.findtext("Timestamp", ""),
                            "localdt": anom.findtext("localdt", ""),
                        }
                        new_anomalies.append(anom_data)
                    if new_anomalies != self._anomalies:
                        self._anomalies = new_anomalies
                        updated = True
                        if new_anomalies:
                            _LOGGER.warning(
                                "Alarm anomalies detected: %s", new_anomalies
                            )

            elif device == "AL010":
                # Battery level (Info field contains percentage like "100%")
                info = root.findtext("Info", "")
                if info:
                    level = info.replace("%", "").strip()
                    if level != self._battery_level:
                        self._battery_level = level
                        updated = True
                        _LOGGER.debug("Battery level: %s%%", level)

            elif device == "AL015":
                # GSM info
                info = root.findtext("Info", "")
                imei = root.findtext("IMEI", "")
                if info and info != self._gsm_info:
                    self._gsm_info = info
                    updated = True
                if imei and imei != self._gsm_imei:
                    self._gsm_imei = imei
                    updated = True

            if updated:
                self._notify_callbacks()

        # Handle LOGIN responses
        elif msg_type == "MENU":
            act = root.findtext("act", "")
            res = root.findtext("res", "")
            if act == "LOGIN":
                _LOGGER.debug("Login result: %s", res)

    async def _listen_loop(self) -> None:
        """Listen for incoming WebSocket messages."""
        while self._connected:
            try:
                if not self._ws:
                    break
                message = await self._ws.recv()
                self._parse_message(message)
            except websockets.ConnectionClosed:
                _LOGGER.warning("WebSocket connection closed")
                self._connected = False
                self._reconnect_task = asyncio.create_task(
                    self._reconnect_loop()
                )
                break
            except asyncio.CancelledError:
                break
            except Exception:
                _LOGGER.exception("Error in listen loop")
                await asyncio.sleep(1)

    async def _reconnect_loop(self) -> None:
        """Attempt to reconnect after disconnection."""
        backoff = 5
        while not self._connected:
            _LOGGER.info("Reconnecting in %d seconds...", backoff)
            await asyncio.sleep(backoff)
            if await self.connect():
                _LOGGER.info("Reconnected successfully")
                break
            backoff = min(backoff * 2, 300)

    async def poll_state(self) -> None:
        """Poll the panel for current state by sending HOME request."""
        try:
            await self._send_state_request("HOME")
        except Exception:
            _LOGGER.debug("Failed to poll state")

    def get_area_state(self, area_id: str) -> str:
        """Get the state of a specific area."""
        return self._area_states.get(area_id, AREA_STATE_OFF)

    def is_armed(self, area_id: str | None = None) -> bool:
        """Check if an area (or any configured area) is armed."""
        if area_id:
            return self.get_area_state(area_id) == AREA_STATE_ARMED
        return any(
            self._area_states.get(str(i)) == AREA_STATE_ARMED
            for i in range(1, 7)
            if str(i) in self._areas
        )

    def is_arming(self, area_id: str | None = None) -> bool:
        """Check if an area (or any configured area) is arming."""
        if area_id:
            return self.get_area_state(area_id) == AREA_STATE_ARMING
        return any(
            self._area_states.get(str(i)) == AREA_STATE_ARMING
            for i in range(1, 7)
            if str(i) in self._areas
        )
