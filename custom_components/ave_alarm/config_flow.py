"""Config flow for AVE Alarm integration."""
from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant import config_entries
from homeassistant.data_entry_flow import FlowResult

from .const import (
    CONF_AREAS,
    CONF_HOST,
    CONF_PIN,
    CONF_PORT,
    CONF_TARGET_SN,
    DEFAULT_AREAS,
    DEFAULT_PORT,
    DEFAULT_TARGET_SN,
    DOMAIN,
)
from .ave_client import AVEAlarmClient

_LOGGER = logging.getLogger(__name__)

DATA_SCHEMA = vol.Schema(
    {
        vol.Required(CONF_HOST): str,
        vol.Optional(CONF_PORT, default=DEFAULT_PORT): int,
        vol.Required(CONF_PIN): str,
        vol.Optional(CONF_AREAS, default=DEFAULT_AREAS): str,
        vol.Optional(CONF_TARGET_SN, default=DEFAULT_TARGET_SN): str,
    }
)


class AVEAlarmConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Handle a config flow for AVE Alarm."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle the initial step."""
        errors: dict[str, str] = {}

        if user_input is not None:
            client = AVEAlarmClient(
                host=user_input[CONF_HOST],
                port=user_input[CONF_PORT],
                pin=user_input[CONF_PIN],
                target_sn=user_input.get(CONF_TARGET_SN, DEFAULT_TARGET_SN),
                areas=user_input.get(CONF_AREAS, DEFAULT_AREAS),
            )

            try:
                if await client.connect():
                    await client.disconnect()

                    await self.async_set_unique_id(
                        f"ave_alarm_{user_input[CONF_HOST]}"
                    )
                    self._abort_if_unique_id_configured()

                    return self.async_create_entry(
                        title=f"AVE Alarm ({user_input[CONF_HOST]})",
                        data=user_input,
                    )
                else:
                    errors["base"] = "cannot_connect"
            except Exception:
                _LOGGER.exception("Unexpected error during config")
                errors["base"] = "unknown"
            finally:
                await client.disconnect()

        return self.async_show_form(
            step_id="user",
            data_schema=DATA_SCHEMA,
            errors=errors,
        )
