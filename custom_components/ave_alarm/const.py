"""Constants for AVE Alarm integration."""

DOMAIN = "ave_alarm"

# Config entry keys
CONF_HOST = "host"
CONF_PORT = "port"
CONF_PIN = "pin"
CONF_AREAS = "areas"
CONF_TARGET_SN = "target_sn"

# Defaults
DEFAULT_PORT = 14001
DEFAULT_TARGET_SN = "1234567890"
DEFAULT_AREAS = "123"
DEFAULT_PAIRING_USER = "host"
DEFAULT_PAIRING_PASS = "00000"

# Protocol
PROTOCOL_VERSION = "1.0"
STX = b"\x02"
ETX = b"\x03"

# WebSocket command codes
CMD_ARM = "C00101"
CMD_DISARM = "C00102"

# Area states from WebSocket events (st attribute on <Area>)
AREA_STATE_OFF = "0"       # Disarmed
AREA_STATE_ARMING = "1"    # Arming (exit delay active, texit=seconds)
AREA_STATE_ARMED = "2"     # Armed

# Panel global state codes (from <State> element in AL002 events)
STATE_ALARM = "S00127"

# Login response codes
LOGIN_REFUSED = "REFUSED"
LOGIN_INHIBITED = "INHIBITED"

# Login types and filters
LOGIN_TYPE_TERM_CODE = "TERM_CODE"
FILTER_USER = "USER|POWERUSER"

# Device subcategory for finding the central unit
SUBCAT_CENTRAL = "ALA001"

# Number of areas the panel supports
MAX_AREAS = 6
