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
        self._area_names: dict[str, str] = {}
        self._area_enabled: dict[str, bool] = {}
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
        self._rt_info_task: asyncio.Task | None = None
        # Real-time system info from RT_INFO_GET
        self._power_status: str | None = None
        self._gsm_signal: str | None = None
        self._wifi_info: dict[str, str] = {}
        self._cloud_info: dict[str, str] = {}
        self._wired_inputs: list[dict] = []
        self._outputs: list[dict] = []
        # Sensor device monitoring from TEST page
        self._test_devices: list[dict] = []
        self._test_measurements: list[dict] = []
        self._test_active: bool = False

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
    def area_names(self) -> dict[str, str]:
        """Return area names from panel configuration."""
        return self._area_names

    @property
    def area_enabled(self) -> dict[str, bool]:
        """Return area enabled states from panel configuration."""
        return self._area_enabled

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

    @property
    def gsm_signal(self) -> str | None:
        """Return GSM signal strength (0-5)."""
        return self._gsm_signal

    @property
    def power_status(self) -> str | None:
        """Return power status (1=mains, 0=battery)."""
        return self._power_status

    @property
    def wifi_info(self) -> dict[str, str]:
        """Return WiFi info (mode, online, signal)."""
        return self._wifi_info

    @property
    def cloud_info(self) -> dict[str, str]:
        """Return cloud connection info."""
        return self._cloud_info

    @property
    def wired_inputs(self) -> list[dict]:
        """Return wired input states."""
        return self._wired_inputs

    @property
    def outputs(self) -> list[dict]:
        """Return output relay states."""
        return self._outputs

    @property
    def test_devices(self) -> list[dict]:
        """Return monitored device list with sensor flags."""
        return self._test_devices

    @property
    def test_measurements(self) -> list[dict]:
        """Return last sensor measurement data."""
        return self._test_measurements

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

            # Request panel configuration (area names, devices, etc.)
            await self._send_file_configuration()

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
        self._test_active = False
        if self._rt_info_task:
            self._rt_info_task.cancel()
            self._rt_info_task = None
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

    async def _send_file_configuration(self) -> None:
        """Request the panel's FILE_CONFIGURATION XML."""
        msg = self._build_request("00", "FILE_CONFIGURATION", "")
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

    async def _send_settings_login(self) -> None:
        """Send settings login request (different from arm/disarm login)."""
        body = (
            f"<filter>POWERUSER|INST</filter>"
            f"<act>LOGIN</act>"
            f"<page>USER</page>"
            f"<par>"
            f"<code>{self._pin}</code>"
            f"<type>SETTINGS</type>"
            f"</par>"
        )
        msg = self._build_request("widget_login_small", "MENU", body)
        await self._send(msg)

    async def _send_test_init(self) -> None:
        """Initialize the TEST page for sensor monitoring."""
        body = "<act>INIT</act><page>TEST</page><par/>"
        msg = self._build_request("00", "MENU", body)
        await self._send(msg)

    async def _send_test_load(self) -> None:
        """Load the device list for sensor monitoring."""
        body = "<act>LOAD</act><page>TEST</page><par>1</par>"
        msg = self._build_request("widget_rt_info", "MENU", body)
        await self._send(msg)

    async def _send_test_start(self) -> None:
        """Start sensor monitoring mode."""
        body = "<act>START</act><page>TEST</page><par></par>"
        msg = self._build_request("widget_rt_info", "MENU", body)
        await self._send(msg)

    async def _send_test_stop(self) -> None:
        """Stop sensor monitoring mode."""
        body = "<act>STOP</act><page>TEST</page><par/>"
        msg = self._build_request("widget_rt_info", "MENU", body)
        await self._send(msg)

    async def _send_rt_info_get(self) -> None:
        """Request real-time system info (power, battery, GSM, inputs, outputs)."""
        body = "<page>UTILITY</page><act>RT_INFO_GET</act><par/>"
        msg = self._build_request("widget_rt_info", "MENU", body)
        await self._send(msg)

    async def start_sensor_monitoring(self) -> bool:
        """Start sensor monitoring via the TEST page.

        Flow: SETTINGS LOGIN → INIT TEST → LOAD TEST → START TEST
        Then begins RT_INFO_GET polling.
        """
        try:
            _LOGGER.info("Starting sensor monitoring")

            # Step 1: Settings login
            await self._send_settings_login()
            await asyncio.sleep(1.0)

            # Step 2: Init TEST page
            await self._send_test_init()
            await asyncio.sleep(0.3)

            # Step 3: Request RT_INFO_GET (system info)
            await self._send_rt_info_get()

            # Step 4: Load device list
            await self._send_test_load()
            await asyncio.sleep(0.3)

            # Step 5: Start monitoring
            await self._send_test_start()
            await asyncio.sleep(0.3)

            self._test_active = True

            # Start RT_INFO polling loop
            self._rt_info_task = asyncio.create_task(self._rt_info_poll_loop())

            _LOGGER.info("Sensor monitoring started successfully")
            return True

        except Exception:
            _LOGGER.exception("Failed to start sensor monitoring")
            return False

    async def stop_sensor_monitoring(self) -> None:
        """Stop sensor monitoring."""
        self._test_active = False
        if self._rt_info_task:
            self._rt_info_task.cancel()
            self._rt_info_task = None
        try:
            await self._send_test_stop()
            await asyncio.sleep(0.3)
            await self._send_logout()
        except Exception:
            _LOGGER.debug("Error stopping sensor monitoring")

    async def _rt_info_poll_loop(self) -> None:
        """Periodically poll RT_INFO_GET for real-time system data."""
        while self._connected and self._test_active:
            try:
                await self._send_rt_info_get()
                await asyncio.sleep(30)  # Poll every 30 seconds
            except asyncio.CancelledError:
                break
            except Exception:
                _LOGGER.debug("RT_INFO poll error, retrying in 60s")
                await asyncio.sleep(60)

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

        # Handle FILE_CONFIGURATION responses
        elif msg_type == "FILE_CONFIGURATION":
            self._parse_configuration(root)

        # Handle MENU responses (login, RT_INFO, TEST, etc.)
        elif msg_type == "MENU":
            act = root.findtext("act", "")
            res = root.findtext("res", "")
            if act == "LOGIN":
                _LOGGER.debug("Login result: %s", res)
            elif act == "RT_INFO_GET":
                self._parse_rt_info(root)
            elif act == "LOAD":
                page = root.findtext("page", "")
                if page == "TEST" and res == "LOADED":
                    self._parse_test_load(root)

    def _parse_configuration(self, root: ET.Element) -> None:
        """Parse FILE_CONFIGURATION response to extract area names and devices."""
        # The configuration may be wrapped in a Response/Configuration element
        config = root.find("Configuration")
        if config is None:
            config = root

        # Parse areas
        areas_elem = config.find("Areas")
        if areas_elem is not None:
            for area in areas_elem.findall("Area"):
                area_id = area.get("id", "")
                area_desc = area.get("desc", f"Area {area_id}")
                area_ena = area.get("ena", "FALSE").upper() == "TRUE"
                if area_id:
                    self._area_names[area_id] = area_desc
                    self._area_enabled[area_id] = area_ena
                    _LOGGER.debug(
                        "Area %s: %s (enabled=%s)",
                        area_id,
                        area_desc,
                        area_ena,
                    )

        if self._area_names:
            _LOGGER.info(
                "Loaded %d area names from panel configuration",
                len(self._area_names),
            )

    def _parse_rt_info(self, root: ET.Element) -> None:
        """Parse RT_INFO_GET response for real-time system status."""
        par = root.find("par")
        if par is None:
            return

        updated = False

        # Power status
        pow_elem = par.find("Pow")
        if pow_elem is not None:
            st = pow_elem.findtext("st", "")
            if st and st != self._power_status:
                self._power_status = st
                updated = True

        # Battery percentage (more precise than AL010 event)
        bat_elem = par.find("Bat")
        if bat_elem is not None:
            perc = bat_elem.findtext("perc", "")
            if perc and perc != self._battery_level:
                self._battery_level = perc
                updated = True

        # GSM signal strength
        gsm_elem = par.find("Gsm")
        if gsm_elem is not None:
            signal = gsm_elem.findtext("signal", "")
            if signal and signal != self._gsm_signal:
                self._gsm_signal = signal
                updated = True

        # WiFi info
        wifi_elem = par.find("Wifi")
        if wifi_elem is not None:
            new_wifi = {
                "mode": wifi_elem.findtext("mode", ""),
                "online": wifi_elem.findtext("online", ""),
                "signal": wifi_elem.findtext("signal", ""),
            }
            if new_wifi != self._wifi_info:
                self._wifi_info = new_wifi
                updated = True

        # Cloud info
        cloud_elem = par.find("Cloud")
        if cloud_elem is not None:
            new_cloud = {
                "persistent_st": cloud_elem.findtext("persistent_st", ""),
                "ondemand_st": cloud_elem.findtext("ondemand_st", ""),
            }
            if new_cloud != self._cloud_info:
                self._cloud_info = new_cloud
                updated = True

        # Wired inputs
        inputs_elem = par.find("inputs")
        if inputs_elem is not None:
            new_inputs = []
            for inp in inputs_elem.findall("input"):
                new_inputs.append({
                    "index": inp.get("n", ""),
                    "device_id": inp.get("devid", ""),
                    "label": inp.findtext("label", ""),
                    "state": inp.findtext("st", ""),
                })
            if new_inputs != self._wired_inputs:
                self._wired_inputs = new_inputs
                updated = True

        # Outputs
        outputs_elem = par.find("outputs")
        if outputs_elem is not None:
            new_outputs = []
            for out in outputs_elem.findall("output"):
                new_outputs.append({
                    "index": out.get("n", ""),
                    "device_id": out.get("devid", ""),
                    "label": out.findtext("label", ""),
                    "state": out.findtext("st", ""),
                })
            if new_outputs != self._outputs:
                self._outputs = new_outputs
                updated = True

        if updated:
            _LOGGER.debug("RT_INFO updated: power=%s, bat=%s, gsm_sig=%s",
                          self._power_status, self._battery_level,
                          self._gsm_signal)
            self._notify_callbacks()

    def _parse_test_load(self, root: ET.Element) -> None:
        """Parse TEST LOAD response for device list and sensor measurements."""
        updated = False

        # par contains device items with sensor flags
        par = root.find("par")
        if par is not None:
            new_devices = []
            for item in par.findall("item"):
                dev = {
                    "id": item.get("id", ""),
                    "idx": item.get("idx", ""),
                    "spv": item.get("spv", "0"),
                    "bat": item.get("bat", "0"),
                    "ala": item.get("ala", "0"),
                    "tam": item.get("tam", "0"),
                    "rf": item.get("rf", "0"),
                    "tag": item.findtext("tag", ""),
                    "name": item.findtext("name", ""),
                    "subcategory": item.findtext("subcategory", ""),
                    "areas": item.findtext("areas", ""),
                }
                new_devices.append(dev)
            if new_devices:
                self._test_devices = new_devices
                updated = True
                _LOGGER.info(
                    "Loaded %d devices from TEST page", len(new_devices)
                )

        # par2 contains last measurement per sensor
        par2 = root.find("par2")
        if par2 is not None:
            new_measurements = []
            for item in par2.findall("item"):
                meas_elem = item.find("meas")
                meas = {
                    "id": item.get("id", ""),
                    "name": item.get("name", ""),
                    "meas_id": meas_elem.get("id", "") if meas_elem is not None else "",
                    "value": meas_elem.get("value", "") if meas_elem is not None else "",
                    "localdt": meas_elem.get("localdt", "") if meas_elem is not None else "",
                }
                new_measurements.append(meas)
            if new_measurements:
                self._test_measurements = new_measurements
                updated = True
                _LOGGER.info(
                    "Loaded %d sensor measurements", len(new_measurements)
                )

        if updated:
            self._notify_callbacks()

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
