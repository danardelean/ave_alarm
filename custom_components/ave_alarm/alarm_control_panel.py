"""Alarm control panel for AVE AF927 Alarm."""
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
    AREA_STATE_OFF,
    CONF_AREAS,
    DOMAIN,
)
from .ave_client import AVEAlarmClient

_LOGGER = logging.getLogger(__name__)

AREA_NAMES = {
    "1": "Giardino",
    "2": "Cortile",
    "3": "Garage",
    "4": "Area 4",
    "5": "Area 5",
    "6": "Area 6",
}


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up AVE alarm control panel from a config entry."""
    client: AVEAlarmClient = hass.data[DOMAIN][entry.entry_id]
    areas = entry.data.get(CONF_AREAS, "123")

    entities: list[AVEAlarmPanel] = []

    # Create a panel entity for each configured area
    for area_id in areas:
        entities.append(
            AVEAlarmPanel(
                client=client,
                area_id=area_id,
                area_name=AREA_NAMES.get(area_id, f"Area {area_id}"),
                entry_id=entry.entry_id,
            )
        )

    # Create a "global" panel that arms/disarms all configured areas
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
    _attr_supported_features = (
        AlarmControlPanelEntityFeature.ARM_AWAY
    )

    def __init__(
        self,
        client: AVEAlarmClient,
        area_id: str,
        area_name: str,
        entry_id: str,
    ) -> None:
        """Initialize the alarm panel."""
        self._client = client
        self._area_id = area_id
        self._attr_name = area_name
        self._attr_unique_id = f"ave_alarm_{entry_id}_area_{area_id}"
        self._unregister_callback = None

    async def async_added_to_hass(self) -> None:
        """Register callback when entity is added."""
        self._unregister_callback = self._client.register_callback(
            self._handle_state_update
        )

    async def async_will_remove_from_hass(self) -> None:
        """Unregister callback when entity is removed."""
        if self._unregister_callback:
            self._unregister_callback()

    @callback
    def _handle_state_update(self) -> None:
        """Handle state update from the client."""
        self.async_write_ha_state()

    @property
    def alarm_state(self) -> AlarmControlPanelState:
        """Return the state of the alarm."""
        area_st = self._client.get_area_state(self._area_id)
        if area_st == AREA_STATE_ARMED:
            return AlarmControlPanelState.ARMED_AWAY
        elif area_st == AREA_STATE_ARMING:
            return AlarmControlPanelState.ARMING
        return AlarmControlPanelState.DISARMED

    @property
    def available(self) -> bool:
        """Return True if entity is available."""
        return self._client.connected

    async def async_alarm_arm_away(self, code: str | None = None) -> None:
        """Arm the alarm area."""
        await self._client.arm(areas=self._area_id)

    async def async_alarm_disarm(self, code: str | None = None) -> None:
        """Disarm the alarm area."""
        await self._client.disarm(areas=self._area_id)


class AVEAlarmPanelGlobal(AlarmControlPanelEntity):
    """Representation of the overall AVE alarm (all configured areas)."""

    _attr_has_entity_name = True
    _attr_name = "AVE Alarm"
    _attr_supported_features = (
        AlarmControlPanelEntityFeature.ARM_AWAY
    )

    def __init__(
        self,
        client: AVEAlarmClient,
        areas: str,
        entry_id: str,
    ) -> None:
        """Initialize the global alarm panel."""
        self._client = client
        self._areas = areas
        self._attr_unique_id = f"ave_alarm_{entry_id}_global"
        self._unregister_callback = None

    async def async_added_to_hass(self) -> None:
        """Register callback when entity is added."""
        self._unregister_callback = self._client.register_callback(
            self._handle_state_update
        )

    async def async_will_remove_from_hass(self) -> None:
        """Unregister callback when entity is removed."""
        if self._unregister_callback:
            self._unregister_callback()

    @callback
    def _handle_state_update(self) -> None:
        """Handle state update from the client."""
        self.async_write_ha_state()

    @property
    def alarm_state(self) -> AlarmControlPanelState:
        """Return the state of the alarm."""
        if self._client.is_arming():
            return AlarmControlPanelState.ARMING
        if self._client.is_armed():
            return AlarmControlPanelState.ARMED_AWAY
        return AlarmControlPanelState.DISARMED

    @property
    def available(self) -> bool:
        """Return True if entity is available."""
        return self._client.connected

    async def async_alarm_arm_away(self, code: str | None = None) -> None:
        """Arm all configured areas."""
        await self._client.arm()

    async def async_alarm_disarm(self, code: str | None = None) -> None:
        """Disarm all configured areas."""
        await self._client.disarm()
