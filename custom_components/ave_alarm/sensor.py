"""Sensor platform for AVE AF927 Alarm — anomalies, battery, GSM, devices."""
from __future__ import annotations

import logging

from homeassistant.components.sensor import SensorEntity, SensorDeviceClass
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN
from .ave_client import AVEAlarmClient

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up AVE alarm sensors from a config entry."""
    client: AVEAlarmClient = hass.data[DOMAIN][entry.entry_id]

    entities = [
        AVEAnomalySensor(client, entry.entry_id),
        AVEBatterySensor(client, entry.entry_id),
        AVEGSMSensor(client, entry.entry_id),
        AVEPanelStateSensor(client, entry.entry_id),
        AVEDeviceMonitorSensor(client, entry.entry_id),
    ]

    async_add_entities(entities)


class AVEAnomalySensor(SensorEntity):
    """Sensor showing current anomalies from the alarm panel."""

    _attr_has_entity_name = True
    _attr_name = "Alarm Anomalies"
    _attr_icon = "mdi:alert-circle"

    def __init__(self, client: AVEAlarmClient, entry_id: str) -> None:
        """Initialize the anomaly sensor."""
        self._client = client
        self._attr_unique_id = f"ave_alarm_{entry_id}_anomalies"
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
    def native_value(self) -> str:
        """Return the number of active anomalies."""
        anomalies = self._client.anomalies
        return str(len(anomalies)) if anomalies else "0"

    @property
    def extra_state_attributes(self) -> dict:
        """Return anomaly details as attributes."""
        return {
            "anomalies": self._client.anomalies,
            "warning_count": self._client.anomaly_warning_count,
        }

    @property
    def available(self) -> bool:
        """Return availability."""
        return self._client.connected


class AVEBatterySensor(SensorEntity):
    """Sensor showing battery level."""

    _attr_has_entity_name = True
    _attr_name = "Alarm Battery"
    _attr_device_class = SensorDeviceClass.BATTERY
    _attr_native_unit_of_measurement = "%"
    _attr_icon = "mdi:battery"

    def __init__(self, client: AVEAlarmClient, entry_id: str) -> None:
        """Initialize."""
        self._client = client
        self._attr_unique_id = f"ave_alarm_{entry_id}_battery"
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
    def native_value(self) -> str | None:
        """Return battery percentage."""
        return self._client.battery_level

    @property
    def available(self) -> bool:
        """Return availability."""
        return self._client.connected


class AVEGSMSensor(SensorEntity):
    """Sensor showing GSM signal info."""

    _attr_has_entity_name = True
    _attr_name = "Alarm GSM"
    _attr_icon = "mdi:signal-cellular-3"

    def __init__(self, client: AVEAlarmClient, entry_id: str) -> None:
        """Initialize."""
        self._client = client
        self._attr_unique_id = f"ave_alarm_{entry_id}_gsm"
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
    def native_value(self) -> str | None:
        """Return GSM carrier info."""
        return self._client.gsm_info

    @property
    def extra_state_attributes(self) -> dict:
        """Return GSM details."""
        return {
            "imei": self._client.gsm_imei,
            "signal_strength": self._client.gsm_signal,
        }

    @property
    def available(self) -> bool:
        """Return availability."""
        return self._client.connected


class AVEPanelStateSensor(SensorEntity):
    """Sensor showing raw panel state code."""

    _attr_has_entity_name = True
    _attr_name = "Alarm Panel State"
    _attr_icon = "mdi:shield-home"

    def __init__(self, client: AVEAlarmClient, entry_id: str) -> None:
        """Initialize."""
        self._client = client
        self._attr_unique_id = f"ave_alarm_{entry_id}_panel_state"
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
    def native_value(self) -> str | None:
        """Return panel state code."""
        return self._client.panel_state

    @property
    def extra_state_attributes(self) -> dict:
        """Return area details."""
        return {
            "area_states": self._client.area_states,
            "panel_serial": self._client.panel_serial,
            "cloud_info": self._client.cloud_info,
        }

    @property
    def available(self) -> bool:
        """Return availability."""
        return self._client.connected


class AVEDeviceMonitorSensor(SensorEntity):
    """Sensor showing monitored device count and status flags.

    Tracks supervision, tamper, battery, alarm, and RF status
    for all devices reported by the TEST page.
    """

    _attr_has_entity_name = True
    _attr_name = "Alarm Device Monitor"
    _attr_icon = "mdi:motion-sensor"

    def __init__(self, client: AVEAlarmClient, entry_id: str) -> None:
        """Initialize."""
        self._client = client
        self._attr_unique_id = f"ave_alarm_{entry_id}_device_monitor"
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
    def native_value(self) -> str:
        """Return number of monitored devices."""
        devices = self._client.test_devices
        return str(len(devices)) if devices else "0"

    @property
    def extra_state_attributes(self) -> dict:
        """Return per-device sensor flags and measurements."""
        devices = self._client.test_devices
        measurements = self._client.test_measurements

        # Build a summary of devices with active flags
        flagged = []
        for dev in devices:
            flags = []
            if dev.get("spv") != "0":
                flags.append("supervision")
            if dev.get("bat") != "0":
                flags.append("battery")
            if dev.get("ala") != "0":
                flags.append("alarm")
            if dev.get("tam") != "0":
                flags.append("tamper")
            if dev.get("rf") != "0":
                flags.append("rf")
            if flags:
                flagged.append({
                    "tag": dev.get("tag"),
                    "name": dev.get("name"),
                    "flags": flags,
                })

        return {
            "device_count": len(devices),
            "devices": devices,
            "flagged_devices": flagged,
            "flagged_count": len(flagged),
            "measurements": measurements,
        }

    @property
    def available(self) -> bool:
        """Return availability."""
        return self._client.connected
