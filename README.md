# AVE AF927 Alarm — Home Assistant Integration

A custom Home Assistant integration for the **AVE AF927PLUS** alarm panel, communicating over WebSocket with an XML-based protocol.

## Features

- **Alarm Control Panel** entities for each configured area plus a global panel
- **Sensors** for battery level, GSM provider, mains power, cloud status, and WiFi status
- Real-time state updates via WebSocket push events
- Auto-reconnect with exponential backoff
- No code required for arm/disarm (PIN is stored in configuration)
- HACS-compatible

## Protocol Overview

The AVE AF927 panel exposes a WebSocket server on port `14001`. Communication uses XML messages with the following structure:

```xml
<?xml version="1.0" encoding="utf-8"?>
<Request id="00" source="{client_id}" target="{panel_sn}" protocolVersion="1.0" type="{TYPE}">
  ...body...
</Request>
```

### Key Commands

| Action | Flow |
|--------|------|
| **Arm** | LOGIN → ANOM_ACK (optional) → C00102 (select areas) → C00101 (arm) → LOGOUT |
| **Disarm** | LOGIN → C00102 (disarm areas) → LOGOUT |
| **State** | Listen for AL002 device events with `<Area id="N" st="X" />` |

### Area State Values

| `st` value | Meaning |
|------------|---------|
| `0` | Disarmed (OFF) |
| `1` | Arming (exit delay active, `texit` attribute shows seconds remaining) |
| `2` | Armed (ON) |

### Device IDs

| Device | Purpose |
|--------|---------|
| `AL002` | Alarm areas (arm/disarm state) |
| `AL001` | Panel status |
| `AL010` | Battery (Info field = percentage) |
| `AL015` | GSM module (carrier, IMEI) |

## Installation

### HACS (Recommended)

1. Add this repository as a custom repository in HACS
2. Install "AVE AF927 Alarm"
3. Restart Home Assistant

### Manual

1. Copy the `custom_components/ave_alarm` folder into your Home Assistant `config/custom_components/` directory
2. Restart Home Assistant

## Configuration

1. Go to **Settings → Integrations → Add Integration**
2. Search for "AVE AF927 Alarm"
3. Enter:
   - **Host**: IP address of your alarm panel (e.g. `192.168.1.11`)
   - **Port**: WebSocket port (default: `14001`)
   - **PIN**: Your user PIN code
   - **Panel Serial Number**: Target SN (default: `1234567890`)
   - **Areas**: Which areas to control, e.g. `123` for areas 1-3

## Entities Created

### Alarm Control Panels
One panel entity per configured area plus a global panel for all areas:
- `alarm_control_panel.area_1` — Area 1 (e.g. Giardino)
- `alarm_control_panel.area_2` — Area 2 (e.g. Cortile)
- `alarm_control_panel.area_3` — Area 3 (e.g. Garage)
- `alarm_control_panel.ave_alarm` — Global (all configured areas)

Area names are read dynamically from the panel configuration.

### Sensors
- `sensor.alarm_battery` — Battery level percentage
- `sensor.alarm_gsm` — GSM carrier/provider info
- `sensor.alarm_power` — Mains power status (on/off)
- `sensor.alarm_cloud` — Cloud connection status
- `sensor.alarm_wifi` — WiFi connection status

## Development Notes

This integration was reverse-engineered from the AVE AF927PLUS web interface by intercepting WebSocket traffic. Key variables from the web UI:

- `xml_my_sn` — Client source ID (timestamp-based, generated at connection time)
- `xml_cen_sn` — Panel target serial number
- `area_st_obj` — jQuery XML object holding area states
- `status_area_global` — Global panel state code (`S00121` = disarmed, `S00122` = armed/arming)

## License

MIT
