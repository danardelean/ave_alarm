# AVE AF927 Alarm — Home Assistant Integration

## Project Context

This is a custom Home Assistant integration for the AVE AF927PLUS alarm panel, reverse-engineered from the panel's web interface at `http://192.168.1.11/`.

## Architecture

- **Protocol**: XML over WebSocket at `ws://192.168.1.11:14001/`
- **Authentication**: PIN-based login via XML MENU requests
- **State tracking**: Push events from panel (AL002 device) with area states in `<Area>` elements

## Key Files

- `custom_components/ave_alarm/ave_client.py` — Core WebSocket client handling all panel communication
- `custom_components/ave_alarm/alarm_control_panel.py` — HA alarm panel entities (per-area + global)
- `custom_components/ave_alarm/sensor.py` — Sensors for anomalies, battery, GSM, panel state
- `custom_components/ave_alarm/config_flow.py` — UI-based configuration flow
- `custom_components/ave_alarm/const.py` — Constants, command codes, device IDs

## Reverse-Engineered Protocol

### WebSocket Connection
- URL: `ws://{host}:14001/`
- Source ID (`xml_my_sn`): Generated from `Date.now()` / `int(time.time() * 1000)`
- Target ID (`xml_cen_sn`): `1234567890` (panel serial, configurable)
- Panel serial: `JS27XSJSMSXRXSXSNSX9CSX7XSPS96XSX`
- Binary type: arraybuffer

### XML Message Format
```xml
<?xml version="1.0" encoding="utf-8"?>
<Request id="{id}" source="{source_sn}" target="{target_sn}" protocolVersion="1.0" type="{TYPE}">
  ...body...
</Request>
```

### ARM Flow (5 steps)
1. **LOGIN**: `type="MENU"` with `<act>LOGIN</act>`, `<code>{PIN}</code>`, `<type>TERM_CODE</type>`
2. **ANOM_ACK** (optional, only if anomalies): `type="STATE"` with `<type>ANOM_ACK</type>`, `<value>123456</value>`
3. **C00102** (area select): `type="DEVICE_CMD"` with `PIN` and `AREAS=123456`
4. **C00101** (arm execute): `type="DEVICE_CMD"` with `PIN` and `AREAS=123---` (dashes for unselected areas)
5. **LOGOUT**: `type="MENU"` with `<act>LOGOUT</act>`

### DISARM Flow (3 steps)
1. **LOGIN** (same as above)
2. **C00102** (disarm): `type="DEVICE_CMD"` with `PIN` and `AREAS=123456`
3. **LOGOUT**

### State Events
The panel pushes state events for device `AL002`:
```xml
<Event type="STATE">
  <Device>AL002</Device>
  <State>S00121</State>  <!-- S00121=disarmed, S00122=armed/arming -->
  <Areas>
    <Area id="1" st="0" />  <!-- st: 0=off, 1=arming(texit=seconds), 2=armed -->
    <Area id="2" st="0" />
    ...
  </Areas>
  <Anoms warning="0" flush_area="" ...>
    <Anom id="1"><id>AL006</id>...</Anom>
  </Anoms>
</Event>
```

### Other Devices
- `AL001`: Panel status (State code)
- `AL010`: Battery (`<Info>100%</Info>`)
- `AL015`: GSM module (`<Info>I TIM</Info>`, `<IMEI>...</IMEI>`)

### Web UI JavaScript Variables (for debugging via browser)
- `ws` — WebSocket object
- `xml_my_sn` — Current client source ID
- `xml_cen_sn` — Panel target serial (`1234567890`)
- `area_st_obj` — jQuery XML object with area states (use `.attributes` to read `id` and `st`)
- `status_area_global` — Global state code
- `web_socket_send(msg)` — Send function
- `ws_connected_flg` — Connection flag

## Areas Configuration
- Area 1: GIARDINO (Garden)
- Area 2: CORTILE (Courtyard)
- Area 3: GARAGE
- Areas 4-6: Not configured / unused

## Known Issues & TODOs
- State reading on initial connection: The panel sends area states as part of the initial event stream after WebSocket connects and a HOME state request. If states aren't populated, a LOGIN→LOGOUT cycle can force an AL002 state event.
- The ANOM_ACK step during arming is only needed when there are active anomalies (sensor tamper, low battery, etc.). The integration handles this conditionally.
- The `web_socket_send` function on the web UI wraps `ws.send()` but may do additional processing.
- Exit delay (`texit` attribute on areas with `st="1"`) is typically 88 seconds.

## Testing
- Panel IP: `192.168.1.11`
- WebSocket port: `14001`
- User: Dan Ciprian Ardelean (POWERUSER, id=2)
- Areas with permissions: `area_ins=123456`, `area_dis=123456`
