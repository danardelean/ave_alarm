"""Low-level protocol utilities for AVE Alarm WebSocket communication.

Handles STX/ETX framing, XML request building, and area mask encoding.
All functions are stateless.
"""
from __future__ import annotations

import time

from .const import (
    DEFAULT_PAIRING_PASS,
    DEFAULT_PAIRING_USER,
    ETX,
    MAX_AREAS,
    PROTOCOL_VERSION,
    STX,
)

XML_DECL = '<?xml version="1.0" encoding="utf-8"?>'


# ── Area mask encoding ──────────────────────────────────────────────


def encode_area_mask(area_ids: list[int] | str) -> str:
    """Encode selected areas as a 6-character mask string.

    Each position corresponds to area 1-6. The area number is present
    if selected, '-' if not.

    Examples:
        [1, 2, 3] -> "123---"
        "123"     -> "123---"
        "2"       -> "-2----"
    """
    if isinstance(area_ids, str):
        area_ids = [int(c) for c in area_ids if c.isdigit()]
    mask = []
    for i in range(1, MAX_AREAS + 1):
        mask.append(str(i) if i in area_ids else "-")
    return "".join(mask)


# ── STX/ETX framing ────────────────────────────────────────────────


def frame(xml_str: str) -> bytes:
    """Encode an XML string for sending over WebSocket.

    The panel requires STX/ETX framing on outgoing messages (confirmed
    from the web UI's xml_send function).  Incoming messages arrive as
    raw XML without framing — see ``to_xml_str`` for reception.
    """
    return STX + xml_str.encode("utf-8") + ETX


def to_xml_str(data: bytes | str) -> str | None:
    """Convert a received WebSocket message to an XML string.

    Returns None if the data does not look like XML.
    Handles optional STX/ETX framing (strips it if present) and
    plain bytes/string input.
    """
    raw = data.encode("utf-8") if isinstance(data, str) else data
    # Strip optional STX/ETX if present (some firmware versions may use it)
    if len(raw) >= 3 and raw[0:1] == STX and raw[-1:] == ETX:
        raw = raw[1:-1]
    text = raw.decode("utf-8", errors="replace")
    # Quick check: does it start with XML declaration or a tag?
    stripped = text.lstrip()
    if stripped.startswith("<?xml") or stripped.startswith("<"):
        return text
    return None


# ── Source ID generation ────────────────────────────────────────────


def generate_source_sn() -> str:
    """Generate a source serial number (millisecond timestamp)."""
    return str(int(time.time() * 1000))


# ── XML request builders ───────────────────────────────────────────


def build_request(
    source_sn: str,
    target_sn: str,
    request_type: str,
    body: str,
    msg_id: str = "00",
) -> str:
    """Build a complete XML request string (without STX/ETX framing)."""
    return (
        f'{XML_DECL}'
        f'<Request id="{msg_id}" '
        f'source="{source_sn}" '
        f'target="{target_sn}" '
        f'protocolVersion="{PROTOCOL_VERSION}" '
        f'type="{request_type}">'
        f'{body}'
        f'</Request>'
    )


def build_pairing_body() -> str:
    """Build the PAIRING request body."""
    return (
        f'<Authentication username="{DEFAULT_PAIRING_USER}" '
        f'password="{DEFAULT_PAIRING_PASS}"/>'
    )


def build_login_body(pin: str) -> str:
    """Build the LOGIN MENU request body (TERM_CODE for arm/disarm)."""
    return (
        "<filter>USER|POWERUSER</filter>"
        "<act>LOGIN</act>"
        "<page>USER</page>"
        "<par>"
        f"<code>{pin}</code>"
        "<type>TERM_CODE</type>"
        "</par>"
    )


def build_logout_body() -> str:
    """Build the LOGOUT MENU request body."""
    return "<act>LOGOUT</act><page>USER</page><par/>"


def build_device_cmd_body(
    command: str,
    device_id: str,
    pin: str,
    areas: str,
) -> str:
    """Build a DEVICE_CMD request body for arm/disarm."""
    return (
        f"<Command>{command}</Command>"
        f"<Device>{device_id}</Device>"
        f"<Arguments>"
        f'<Argument id="PIN">{pin}</Argument>'
        f'<Argument id="AREAS">{areas}</Argument>'
        f"</Arguments>"
    )


def build_state_body(state_type: str) -> str:
    """Build a STATE request body (e.g., HOME)."""
    return f"<type>{state_type}</type>"


def build_anom_ack_body(areas: str) -> str:
    """Build an ANOM_ACK STATE request body."""
    return f"<type>ANOM_ACK</type><value>{areas}</value>"


def build_file_config_body() -> str:
    """Build a FILE CONFIGURATION request body."""
    return "<Type>CONFIGURATION</Type>"
