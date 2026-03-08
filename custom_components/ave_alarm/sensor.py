"""Sensor platform for AVE Alarm — battery, GSM, power, cloud, WiFi.

Exposes only the data visible on the panel's home screen
without requiring a PIN login.
"""
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

    async_add_entities([
        AVEBatterySensor(client, entry.entry_id),
        AVEGSMSensor(client, entry.entry_id),
        AVEPowerSensor(client, entry.entry_id),
        AVECloudSensor(client, entry.entry_id),
        AVEWiFiSensor(client, entry.entry_id),
    ])


# ── Base class with common callback logic ──────────────────────────


class _AVEBaseSensor(SensorEntity):
    """Base class for AVE sensors with callback registration."""

    _attr_has_entity_name = True

    def __init__(self, client: AVEAlarmClient, entry_id: str) -> None:
        self._client = client
        self._unregister_callback = None

    async def async_added_to_hass(self) -> None:
        self._unregister_callback = self._client.register_callback(self._handle_update)

    async def async_will_remove_from_hass(self) -> None:
        if self._unregister_callback:
            self._unregister_callback()

    @callback
    def _handle_update(self) -> None:
        self.async_write_ha_state()

    @property
    def available(self) -> bool:
        return self._client.connected


# ── Battery ────────────────────────────────────────────────────────


class AVEBatterySensor(_AVEBaseSensor):
    """Battery level from device AL010 (ALA104)."""

    _attr_name = "Alarm Battery"
    _attr_device_class = SensorDeviceClass.BATTERY
    _attr_native_unit_of_measurement = "%"
    _attr_icon = "mdi:battery"

    def __init__(self, client: AVEAlarmClient, entry_id: str) -> None:
        super().__init__(client, entry_id)
        self._attr_unique_id = f"ave_alarm_{entry_id}_battery"

    @property
    def native_value(self) -> int | None:
        raw = self._client.battery_level
        if raw is None:
            return None
        # Panel sends "100%" — strip non-digits and return as int
        digits = "".join(c for c in raw if c.isdigit())
        return int(digits) if digits else None


# ── GSM ────────────────────────────────────────────────────────────


class AVEGSMSensor(_AVEBaseSensor):
    """GSM provider info from device AL015 (ALA004)."""

    _attr_name = "Alarm GSM"
    _attr_icon = "mdi:signal-cellular-3"

    def __init__(self, client: AVEAlarmClient, entry_id: str) -> None:
        super().__init__(client, entry_id)
        self._attr_unique_id = f"ave_alarm_{entry_id}_gsm"

    @property
    def native_value(self) -> str | None:
        return self._client.gsm_info

    @property
    def extra_state_attributes(self) -> dict:
        attrs = {}
        if self._client.gsm_imei:
            attrs["imei"] = self._client.gsm_imei
        if self._client.gsm_state:
            attrs["state_code"] = self._client.gsm_state
        return attrs


# ── Power ──────────────────────────────────────────────────────────


class AVEPowerSensor(_AVEBaseSensor):
    """Mains power status from power device (ALA101).

    The state code determines the icon on the panel's web UI.
    We expose the raw state code; the panel pushes a different
    code when on mains vs battery backup.
    """

    _attr_name = "Alarm Power"
    _attr_icon = "mdi:power-plug"

    def __init__(self, client: AVEAlarmClient, entry_id: str) -> None:
        super().__init__(client, entry_id)
        self._attr_unique_id = f"ave_alarm_{entry_id}_power"

    @property
    def native_value(self) -> str | None:
        return self._client.power_state


# ── Cloud ──────────────────────────────────────────────────────────


class AVECloudSensor(_AVEBaseSensor):
    """Cloud connection status from cloud device (ALA105).

    The web UI uses the state code directly to pick an icon:
    cloud_st_{state}.png
    """

    _attr_name = "Alarm Cloud"
    _attr_icon = "mdi:cloud"

    def __init__(self, client: AVEAlarmClient, entry_id: str) -> None:
        super().__init__(client, entry_id)
        self._attr_unique_id = f"ave_alarm_{entry_id}_cloud"

    @property
    def native_value(self) -> str | None:
        return self._client.cloud_state


# ── WiFi ───────────────────────────────────────────────────────────


class AVEWiFiSensor(_AVEBaseSensor):
    """WiFi status from WiFi device (ALA102)."""

    _attr_name = "Alarm WiFi"
    _attr_icon = "mdi:wifi"

    def __init__(self, client: AVEAlarmClient, entry_id: str) -> None:
        super().__init__(client, entry_id)
        self._attr_unique_id = f"ave_alarm_{entry_id}_wifi"

    @property
    def native_value(self) -> str | None:
        return self._client.wifi_state
