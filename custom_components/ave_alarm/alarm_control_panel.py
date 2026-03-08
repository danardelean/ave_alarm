"""Alarm control panel for AVE Alarm integration.

Creates one panel entity per configured area + one global panel
that arms/disarms all configured areas together.
"""
from __future__ import annotations

import logging

from homeassistant.components.alarm_control_panel import (
    AlarmControlPanelEntity,
    AlarmControlPanelEntityFeature,
    AlarmControlPanelState,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    AREA_STATE_ARMED,
    AREA_STATE_ARMING,
    CONF_AREAS,
    DOMAIN,
    STATE_ALARM,
)
from .ave_client import AVEAlarmClient

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up AVE alarm control panel from a config entry."""
    client: AVEAlarmClient = hass.data[DOMAIN][entry.entry_id]
    areas = entry.data.get(CONF_AREAS, "123")

    entities: list[AlarmControlPanelEntity] = []

    for area_id in areas:
        area_name = client.area_names.get(area_id, f"Area {area_id}")
        entities.append(
            AVEAlarmPanel(
                client=client,
                area_id=area_id,
                area_name=area_name,
                entry_id=entry.entry_id,
            )
        )

    entities.append(
        AVEAlarmPanelGlobal(
            client=client,
            areas=areas,
            entry_id=entry.entry_id,
        )
    )

    async_add_entities(entities)


class AVEAlarmPanel(AlarmControlPanelEntity):
    """Representation of a single AVE alarm area."""

    _attr_has_entity_name = True
    _attr_supported_features = AlarmControlPanelEntityFeature.ARM_AWAY
    _attr_code_arm_required = False
    _attr_code_format = None

    def __init__(
        self,
        client: AVEAlarmClient,
        area_id: str,
        area_name: str,
        entry_id: str,
    ) -> None:
        self._client = client
        self._area_id = area_id
        self._attr_name = area_name
        self._attr_unique_id = f"ave_alarm_{entry_id}_area_{area_id}"
        self._unregister_callback = None

    async def async_added_to_hass(self) -> None:
        self._unregister_callback = self._client.register_callback(
            self._handle_state_update
        )

    async def async_will_remove_from_hass(self) -> None:
        if self._unregister_callback:
            self._unregister_callback()

    @callback
    def _handle_state_update(self) -> None:
        self.async_write_ha_state()

    @property
    def alarm_state(self) -> AlarmControlPanelState:
        area_st = self._client.get_area_state(self._area_id)
        if area_st == AREA_STATE_ARMED:
            return AlarmControlPanelState.ARMED_AWAY
        if area_st == AREA_STATE_ARMING:
            return AlarmControlPanelState.ARMING
        if self._client.panel_state == STATE_ALARM:
            return AlarmControlPanelState.TRIGGERED
        return AlarmControlPanelState.DISARMED

    @property
    def extra_state_attributes(self) -> dict:
        attrs = {}
        exit_delay = self._client.get_area_exit_delay(self._area_id)
        if exit_delay > 0:
            attrs["exit_delay"] = exit_delay
        return attrs

    @property
    def available(self) -> bool:
        return self._client.connected

    async def async_alarm_arm_away(self, code: str | None = None) -> None:
        await self._client.arm(areas=self._area_id)

    async def async_alarm_disarm(self, code: str | None = None) -> None:
        await self._client.disarm(areas=self._area_id)


class AVEAlarmPanelGlobal(AlarmControlPanelEntity):
    """Representation of the overall AVE alarm (all configured areas)."""

    _attr_has_entity_name = True
    _attr_name = "AVE Alarm"
    _attr_supported_features = AlarmControlPanelEntityFeature.ARM_AWAY
    _attr_code_arm_required = False
    _attr_code_format = None

    def __init__(
        self,
        client: AVEAlarmClient,
        areas: str,
        entry_id: str,
    ) -> None:
        self._client = client
        self._areas = areas
        self._attr_unique_id = f"ave_alarm_{entry_id}_global"
        self._unregister_callback = None

    async def async_added_to_hass(self) -> None:
        self._unregister_callback = self._client.register_callback(
            self._handle_state_update
        )

    async def async_will_remove_from_hass(self) -> None:
        if self._unregister_callback:
            self._unregister_callback()

    @callback
    def _handle_state_update(self) -> None:
        self.async_write_ha_state()

    @property
    def alarm_state(self) -> AlarmControlPanelState:
        if self._client.is_in_alarm():
            return AlarmControlPanelState.TRIGGERED
        if self._client.is_arming():
            return AlarmControlPanelState.ARMING
        if self._client.is_armed():
            return AlarmControlPanelState.ARMED_AWAY
        return AlarmControlPanelState.DISARMED

    @property
    def extra_state_attributes(self) -> dict:
        attrs = {
            "panel_state": self._client.panel_state,
            "panel_version": self._client.panel_version,
        }
        for area_id in self._areas:
            st = self._client.get_area_state(area_id)
            name = self._client.area_names.get(area_id, f"Area {area_id}")
            attrs[f"area_{area_id}"] = f"{name}: {st}"
        return attrs

    @property
    def available(self) -> bool:
        return self._client.connected

    async def async_alarm_arm_away(self, code: str | None = None) -> None:
        await self._client.arm()

    async def async_alarm_disarm(self, code: str | None = None) -> None:
        await self._client.disarm()
