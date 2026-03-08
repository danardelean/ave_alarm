"""XML message parsers for AVE Alarm panel responses and events.

Each parser function takes an ET.Element and a PanelState dataclass,
mutates the state in place, and returns True if anything changed.
"""
from __future__ import annotations

import base64
import logging
from dataclasses import dataclass, field
from xml.etree import ElementTree as ET

from .const import SUBCAT_CENTRAL

_LOGGER = logging.getLogger(__name__)

# Device subcategory codes used to identify devices in STATE events
_SUBCAT_GSM = "ALA004"
_SUBCAT_POWER = "ALA101"
_SUBCAT_WIFI = "ALA102"
_SUBCAT_BATTERY = "ALA104"
_SUBCAT_CLOUD = "ALA105"

# Subcategories we track from the configuration to build device→subcategory map
_TRACKED_SUBCATEGORIES = {
    _SUBCAT_GSM, _SUBCAT_POWER, _SUBCAT_WIFI, _SUBCAT_BATTERY, _SUBCAT_CLOUD,
}


@dataclass
class PanelState:
    """Mutable container for all panel runtime state."""

    # Configuration (from FILE CONFIGURATION)
    config_loaded: bool = False
    central_device_id: str | None = None
    area_names: dict[str, str] = field(default_factory=dict)
    area_enabled: dict[str, bool] = field(default_factory=dict)
    panel_version: str = ""

    # Map device tag (e.g. "AL010") → subcategory (e.g. "ALA104")
    device_subcategory: dict[str, str] = field(default_factory=dict)

    # Alarm state (from AL002 STATE events)
    area_states: dict[str, str] = field(default_factory=dict)
    area_exit_delays: dict[str, int] = field(default_factory=dict)
    panel_state: str = ""
    panel_serial: str = ""

    # Anomalies (from AL002 STATE events)
    anomalies: list[dict] = field(default_factory=list)
    anomaly_warning: str = "0"
    anomaly_flush_area: str = ""

    # Device info (from STATE events on individual devices)
    battery_level: str | None = None
    gsm_info: str | None = None
    gsm_imei: str | None = None
    gsm_state: str | None = None      # State code → determines signal icon
    power_state: str | None = None     # State code → determines mains/battery icon
    wifi_state: str | None = None      # State code → determines WiFi icon
    cloud_state: str | None = None     # State code → determines cloud icon


# ── Helpers ────────────────────────────────────────────────────────


def strip_xml_declaration(xml_str: str) -> str:
    """Remove <?xml ...?> declaration if present."""
    if xml_str.startswith("<?xml"):
        idx = xml_str.find("?>")
        if idx >= 0:
            return xml_str[idx + 2:]
    return xml_str


def parse_xml(xml_str: str) -> ET.Element | None:
    """Parse an XML string into an Element. Returns None on failure."""
    xml_str = strip_xml_declaration(xml_str)
    try:
        return ET.fromstring(xml_str)
    except ET.ParseError:
        _LOGGER.debug("Failed to parse XML: %s", xml_str[:200])
        return None


# ── STATE event parsing ────────────────────────────────────────────


def parse_state_event(root: ET.Element, state: PanelState) -> bool:
    """Parse a STATE event. Returns True if state was updated.

    The panel pushes STATE events for various devices. The <Device>
    tag contains the device tag (e.g. "AL002"). We look up the
    subcategory from our configuration map to determine handling.
    """
    device_tag = root.findtext("Device", "")
    state_code = root.findtext("State", "")
    updated = False

    # AL002 (central unit) — areas + anomalies
    if device_tag == "AL002" or (not device_tag and root.find("Areas") is not None):
        updated |= _parse_central_state(root, state, state_code)
        return updated

    # Look up subcategory from configuration
    subcat = state.device_subcategory.get(device_tag, "")

    if subcat == _SUBCAT_BATTERY:
        updated |= _parse_battery(root, state, state_code)
    elif subcat == _SUBCAT_GSM:
        updated |= _parse_gsm(root, state, state_code)
    elif subcat == _SUBCAT_POWER:
        if state_code and state_code != state.power_state:
            state.power_state = state_code
            updated = True
    elif subcat == _SUBCAT_WIFI:
        if state_code and state_code != state.wifi_state:
            state.wifi_state = state_code
            updated = True
    elif subcat == _SUBCAT_CLOUD:
        if state_code and state_code != state.cloud_state:
            state.cloud_state = state_code
            updated = True

    return updated


def _parse_central_state(
    root: ET.Element, state: PanelState, state_code: str
) -> bool:
    """Parse AL002 (central unit) state: areas + anomalies."""
    updated = False

    if state_code and state_code != state.panel_state:
        state.panel_state = state_code
        updated = True

    # Area states
    areas_elem = root.find("Areas")
    if areas_elem is not None:
        for area in areas_elem.findall("Area"):
            area_id = area.get("id", "")
            area_st = area.get("st", "")
            texit = area.get("texit", "0")

            if area_id:
                if area_st != state.area_states.get(area_id):
                    state.area_states[area_id] = area_st
                    updated = True
                    _LOGGER.debug(
                        "Area %s state: %s (texit=%s)", area_id, area_st, texit
                    )
                try:
                    state.area_exit_delays[area_id] = int(texit)
                except (ValueError, TypeError):
                    state.area_exit_delays[area_id] = 0

    # Anomalies
    anoms_elem = root.find("Anoms")
    if anoms_elem is not None:
        state.anomaly_warning = anoms_elem.get("warning", "0")
        state.anomaly_flush_area = anoms_elem.get("flush_area", "")

        new_anomalies = []
        for anom in anoms_elem.findall("Anom"):
            new_anomalies.append({
                "id": anom.get("id", ""),
                "device_id": anom.findtext("id", ""),
                "state": anom.findtext("State", ""),
            })
        if new_anomalies != state.anomalies:
            state.anomalies = new_anomalies
            updated = True
            if new_anomalies:
                _LOGGER.warning(
                    "Anomalies detected (%d), warning=%s",
                    len(new_anomalies), state.anomaly_warning,
                )

    return updated


def _parse_battery(root: ET.Element, state: PanelState, state_code: str) -> bool:
    """Parse battery device (ALA104) event: <Info>100%</Info>."""
    updated = False
    info = root.findtext("Info", "")
    if info:
        level = info.replace("%", "").strip()
        if level != state.battery_level:
            state.battery_level = level
            updated = True
    return updated


def _parse_gsm(root: ET.Element, state: PanelState, state_code: str) -> bool:
    """Parse GSM device (ALA004) event: <Info>provider</Info>, <IMEI>...</IMEI>."""
    updated = False
    info = root.findtext("Info", "")
    imei = root.findtext("IMEI", "")
    if info and info != state.gsm_info:
        state.gsm_info = info
        updated = True
    if imei and imei != state.gsm_imei:
        state.gsm_imei = imei
        updated = True
    if state_code and state_code != state.gsm_state:
        state.gsm_state = state_code
        updated = True
    return updated


# ── Configuration parsing ──────────────────────────────────────────


def parse_file_response(root: ET.Element, state: PanelState) -> bool:
    """Parse a FILE or PAIRING response containing configuration.

    The configuration can arrive as:
      - base64-encoded text in <File>, <Configuration>, <par>, <file>
      - direct <Configuration> XML element
    """
    # Try base64-encoded configuration in various wrapper elements
    for elem_name in ("File", "Configuration", "par", "file"):
        file_elem = root.find(elem_name)
        if file_elem is not None and file_elem.text and len(file_elem.text) > 100:
            try:
                decoded = base64.b64decode(file_elem.text)
                config_xml = decoded.decode("utf-8")
                return _parse_configuration_xml(config_xml, state)
            except Exception:
                _LOGGER.debug("Not base64 in <%s>", elem_name)

    # Try direct Configuration element
    config = root.find("Configuration")
    if config is not None:
        return _parse_configuration_element(config, state)

    # Try root with area/device info
    if root.find("Areas") is not None:
        return _parse_configuration_element(root, state)

    return False


def _parse_configuration_xml(xml_str: str, state: PanelState) -> bool:
    """Parse a configuration XML string."""
    try:
        xml_str = strip_xml_declaration(xml_str)
        config_root = ET.fromstring(xml_str)
        if config_root.tag == "Configuration":
            return _parse_configuration_element(config_root, state)
        config = config_root.find("Configuration")
        if config is not None:
            return _parse_configuration_element(config, state)
    except ET.ParseError:
        _LOGGER.debug("Failed to parse configuration XML")
    return False


def _parse_configuration_element(config: ET.Element, state: PanelState) -> bool:
    """Parse a <Configuration> element for areas and devices."""
    # Areas
    areas_elem = config.find("Areas")
    if areas_elem is not None:
        for area in areas_elem.findall("Area"):
            area_id = area.get("id", "")
            if area_id:
                state.area_names[area_id] = area.get("desc", f"Area {area_id}")
                state.area_enabled[area_id] = (
                    area.get("ena", "FALSE").upper() == "TRUE"
                )

    # Devices — find central unit + build subcategory map for tracked devices
    #
    # Configuration XML uses:
    #   <Device id="AL010" desc="Batteria" deleted="FALSE">
    #     <Subcategory>ALA104</Subcategory>
    #     ...
    #   </Device>
    #
    # The device "id" attribute (e.g. "AL010") is the same identifier
    # that appears in <Device>AL010</Device> inside STATE events.
    devices_elem = config.find("Devices")
    if devices_elem is not None:
        state.device_subcategory.clear()
        for dev in devices_elem.findall("Device"):
            dev_id = dev.get("id", "")
            subcat = dev.findtext("Subcategory", "")

            # Central unit
            if subcat == SUBCAT_CENTRAL and dev_id:
                state.central_device_id = dev_id
                _LOGGER.debug("Central unit: id=%s", dev_id)

            # Build id→subcategory map for devices we track on the home screen
            if dev_id and subcat in _TRACKED_SUBCATEGORIES:
                state.device_subcategory[dev_id] = subcat

    state.config_loaded = True
    _LOGGER.info(
        "Configuration loaded: %d areas, %d tracked devices, central=%s",
        len(state.area_names), len(state.device_subcategory),
        state.central_device_id,
    )
    return True
