"""Binary sensor platform for AVE AF927 Alarm — wired inputs and device sensors."""
from __future__ import annotations

import logging

from homeassistant.components.binary_sensor import (
    BinarySensorDeviceClass,
    BinarySensorEntity,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN
from .ave_client import AVEAlarmClient

_LOGGER = logging.getLogger(__name__)

# Wired input states from RT_INFO_GET
# st=3 appears to mean "closed/normal", other values indicate open/triggered
INPUT_STATE_NORMAL = "3"


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up AVE alarm binary sensors from a config entry."""
    client: AVEAlarmClient = hass.data[DOMAIN][entry.entry_id]

    entities: list[BinarySensorEntity] = []

    # Power status sensor (mains power)
    entities.append(AVEPowerSensor(client, entry.entry_id))

    # WiFi online sensor
    entities.append(AVEWifiSensor(client, entry.entry_id))

    # We will dynamically add wired input and device sensors
    # once the TEST page data is loaded
    entities.append(AVEWiredInputsSensor(client, entry.entry_id))

    # Create individual sensors for each monitored device
    # These show supervision/tamper/battery/alarm/rf status
    # They will populate after start_sensor_monitoring is called

    async_add_entities(entities)


class AVEPowerSensor(BinarySensorEntity):
    """Binary sensor showing mains power status."""

    _attr_has_entity_name = True
    _attr_name = "Alarm Mains Power"
    _attr_device_class = BinarySensorDeviceClass.POWER
    _attr_icon = "mdi:power-plug"

    def __init__(self, client: AVEAlarmClient, entry_id: str) -> None:
        """Initialize."""
        self._client = client
        self._attr_unique_id = f"ave_alarm_{entry_id}_power"
        self._unregister_callback = None

    async def async_added_to_hass(self) -> None:
        """Register callback."""
        self._unregister_callback = self._client.register_callback(
            self._handle_update
        )

    async def async_will_remove_from_hass(self) -> None:
        """Unregister callback."""
        if self._unregister_callback:
            self._unregister_callback()

    @callback
    def _handle_update(self) -> None:
        """Handle state update."""
        self.async_write_ha_state()

    @property
    def is_on(self) -> bool | None:
        """Return True if on mains power."""
        if self._client.power_status is None:
            return None
        return self._client.power_status == "1"

    @property
    def available(self) -> bool:
        """Return availability."""
        return self._client.connected


class AVEWifiSensor(BinarySensorEntity):
    """Binary sensor showing WiFi online status."""

    _attr_has_entity_name = True
    _attr_name = "Alarm WiFi"
    _attr_device_class = BinarySensorDeviceClass.CONNECTIVITY
    _attr_icon = "mdi:wifi"

    def __init__(self, client: AVEAlarmClient, entry_id: str) -> None:
        """Initialize."""
        self._client = client
        self._attr_unique_id = f"ave_alarm_{entry_id}_wifi"
        self._unregister_callback = None

    async def async_added_to_hass(self) -> None:
        """Register callback."""
        self._unregister_callback = self._client.register_callback(
            self._handle_update
        )

    async def async_will_remove_from_hass(self) -> None:
        """Unregister callback."""
        if self._unregister_callback:
            self._unregister_callback()

    @callback
    def _handle_update(self) -> None:
        """Handle state update."""
        self.async_write_ha_state()

    @property
    def is_on(self) -> bool | None:
        """Return True if WiFi is online."""
        wifi = self._client.wifi_info
        if not wifi:
            return None
        return wifi.get("online") == "1"

    @property
    def extra_state_attributes(self) -> dict:
        """Return WiFi details."""
        wifi = self._client.wifi_info
        return {
            "mode": wifi.get("mode", ""),
            "signal": wifi.get("signal", ""),
        } if wifi else {}

    @property
    def available(self) -> bool:
        """Return availability."""
        return self._client.connected


class AVEWiredInputsSensor(BinarySensorEntity):
    """Binary sensor summarizing wired input states.

    ON = at least one input is triggered (not in normal state).
    Attributes contain per-input details.
    """

    _attr_has_entity_name = True
    _attr_name = "Alarm Wired Inputs"
    _attr_device_class = BinarySensorDeviceClass.PROBLEM
    _attr_icon = "mdi:electric-switch"

    def __init__(self, client: AVEAlarmClient, entry_id: str) -> None:
        """Initialize."""
        self._client = client
        self._attr_unique_id = f"ave_alarm_{entry_id}_wired_inputs"
        self._unregister_callback = None

    async def async_added_to_hass(self) -> None:
        """Register callback."""
        self._unregister_callback = self._client.register_callback(
            self._handle_update
        )

    async def async_will_remove_from_hass(self) -> None:
        """Unregister callback."""
        if self._unregister_callback:
            self._unregister_callback()

    @callback
    def _handle_update(self) -> None:
        """Handle state update."""
        self.async_write_ha_state()

    @property
    def is_on(self) -> bool | None:
        """Return True if any wired input is triggered."""
        inputs = self._client.wired_inputs
        if not inputs:
            return None
        return any(inp.get("state") != INPUT_STATE_NORMAL for inp in inputs)

    @property
    def extra_state_attributes(self) -> dict:
        """Return per-input details."""
        inputs = self._client.wired_inputs
        triggered = [
            inp for inp in inputs
            if inp.get("state") != INPUT_STATE_NORMAL
        ]
        return {
            "total_inputs": len(inputs),
            "triggered_count": len(triggered),
            "triggered_inputs": triggered,
            "inputs": inputs,
        }

    @property
    def available(self) -> bool:
        """Return availability."""
        return self._client.connected
