"""Constants for AVE AF927 Alarm integration."""

DOMAIN = "ave_alarm"

CONF_HOST = "host"
CONF_PORT = "port"
CONF_PIN = "pin"
CONF_AREAS = "areas"
CONF_TARGET_SN = "target_sn"

DEFAULT_PORT = 14001
DEFAULT_TARGET_SN = "1234567890"
DEFAULT_AREAS = "123"

# WebSocket commands
CMD_ARM = "C00101"
CMD_DISARM = "C00102"
CMD_AREA_SELECT = "C00102"

# Area states from WebSocket events
AREA_STATE_OFF = "0"       # Disarmed
AREA_STATE_ARMING = "1"    # Arming (exit delay active)
AREA_STATE_ARMED = "2"     # Armed

# Device IDs
DEVICE_ALARM = "AL002"
DEVICE_PANEL = "AL001"
DEVICE_GSM = "AL015"
DEVICE_BATTERY = "AL010"

# XML protocol version
PROTOCOL_VERSION = "1.0"
