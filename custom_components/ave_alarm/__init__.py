"""AVE Alarm integration for Home Assistant."""
from __future__ import annotations

import logging

from homeassistant.config_entries import ConfigEntry
from homeassistant.const import Platform
from homeassistant.core import HomeAssistant

from .const import CONF_AREAS, CONF_HOST, CONF_PIN, CONF_PORT, CONF_TARGET_SN, DEFAULT_TARGET_SN, DOMAIN
from .ave_client import AVEAlarmClient

_LOGGER = logging.getLogger(__name__)

PLATFORMS = [Platform.ALARM_CONTROL_PANEL, Platform.SENSOR]


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Set up AVE Alarm from a config entry."""
    client = AVEAlarmClient(
        host=entry.data[CONF_HOST],
        port=entry.data[CONF_PORT],
        pin=entry.data[CONF_PIN],
        target_sn=entry.data.get(CONF_TARGET_SN, DEFAULT_TARGET_SN),
        areas=entry.data.get(CONF_AREAS, "123"),
    )

    if not await client.connect():
        _LOGGER.error("Failed to connect to AVE alarm panel")
        return False

    hass.data.setdefault(DOMAIN, {})
    hass.data[DOMAIN][entry.entry_id] = client

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)

    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    """Unload a config entry."""
    unload_ok = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)

    if unload_ok:
        client: AVEAlarmClient = hass.data[DOMAIN].pop(entry.entry_id)
        await client.disconnect()

    return unload_ok
