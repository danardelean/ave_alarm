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

## Panel Configuration XML (`xml_file_configuration`)

The panel stores its full configuration as an XML document accessible via the `xml_file_configuration` jQuery object in the web UI. Root element: `<Configuration>` with children:

- `Central` (6), `Categories` (2), `Commands` (5), `Users` (2), `Devices` (129), `Scenes` (5), `Rooms` (32), `Expositions` (9), `Areas` (6), `System` (2), `Languages` (6), `Regions` (49), `Logs` (2), `VocalMessages` (3), `Errors` (12), `Timezones` (49), `MsgEvents` (20), `WifiRegions` (3), `PstnCountries` (9), `ReleModeRepeatEvents` (8), `WireModeRepeatEvents` (8), `SceneTriggerEvents` (15), `VigEvents` (17)

### Areas Configuration
```xml
<Area id="1" desc="GIARDINO" ena="TRUE"/>
<Area id="2" desc="CORTILE" ena="TRUE"/>
<Area id="3" desc="GARAGE" ena="TRUE"/>
<Area id="4" desc="Area 4" ena="FALSE"/>
<Area id="5" desc="Area 5" ena="FALSE"/>
<Area id="6" desc="Area 6" ena="FALSE"/>
```

Area names and enable/disable are stored in the configuration. The web UI uses a SAVE command on `page=AREA` to update them.

### Settings Login
Settings use a different login type than arm/disarm:
- `<type>SETTINGS</type>` with `<filter>POWERUSER|INST</filter>` (vs `TERM_CODE` / `USER|POWERUSER` for arm/disarm)

### Commands (from Configuration XML)
| Command | Description | Primary |
|---------|-------------|---------|
| C00101 | Inserimento (Arm) | yes |
| C00102 | Disinserimento (Disarm) | yes |
| C00103 | Inserimento parziale (Partial arm) | no |
| C00104 | Inserimento predefinito (Default arm) | yes |
| C00105 | Soccorso Medico (Medical) | no |
| C00106 | Soccorso Aggressione (Panic) | no |
| C00107 | SOS Sirene | no |
| C00108 | Inserimento forzato (Force arm) | no |
| C00401 | Credito residuo SIM (SIM balance) | yes |
| C00402 | Scadenza SIM (SIM expiry) | no |
| C01501-C01506 | Siren vocal/alarm controls | no |

### Key Configured Devices (31 active with area assignments)
| ID | Description | Subcategory | Areas |
|----|-------------|-------------|-------|
| AL002 | AF927 VIA ROMA 4 | ALA001 (Centrale) | 123456 |
| AL003 | Carrier | ALA201 | 123456 |
| AL004 | Modulo Touch LCD | ALA003 | 123456 |
| AL006-AL008 | WiFi modules | ALA102 | 123456 |
| AL010 | Batteria | ALA104 | 123456 |
| AL015 | Modulo GSM | ALA004 | 123456 |
| AL041 | Tastiera (Keypad) | ALA006 | 123456 |
| AL043-AL044 | Telecomando 1-2 (Remotes) | ALA007 | 123456 |
| AL045 | Sirena Esterna | ALA015 | 123--- |
| AL082 | TELECAMERA PISCINA | ALA017 | 123456 |
| AL083 | TELECAMERA CORTILE | ALA017 | 123456 |
| AL084 | TELECAMERA TERRAZZA | ALA017 | 123456 |
| AL085 | TELECAMERA ENTRATA | ALA017 | 123456 |
| AL115 | Locale Tecnico | ALA010 (IR) | --3--- |
| AL146 | TELECAMERA LATO STRADA | ALA017 | 123456 |
| AL152 | Sirena Cortile | ALA015 | -2---- |
| AL159 | Cortile 2 | ALA025 | -2---- |
| AL160 | Cortile 1 | ALA025 | -2---- |
| AL161 | Ripetitore Palestra | ALA018 | 123456 |
| AL162 | Giardino 2 | ALA025 | 1----- |
| AL164 | Giardino 1 | ALA025 | 1----- |

### Device Subcategories (from `device_associative_array`)
| Code | Type |
|------|------|
| ALA001 | Centrale d'Allarme |
| ALA003 | Tastiera LCD |
| ALA004 | Modulo GSM |
| ALA006 | Tastiera |
| ALA007 | Telecomando |
| ALA009 | Contatto Magnetico |
| ALA010 | Rilevatore Infrarosso |
| ALA015 | Sirena Esterna |
| ALA017 | Telecamera IP |
| ALA018 | Ripetitore Segnale |
| ALA020 | Espansione Filare |
| ALA025 | Rilevatore Esterno |
| ALA100 | Modulo RTC |
| ALA102 | WiFi |
| ALA103 | Sessione |
| ALA104 | Batteria |
| ALA105 | Cloud |
| ALA106 | Telegestione |
| ALA107 | Dashboard |
| ALA201 | Carrier |

### Area Assignment Format
Areas are encoded as a 6-char string where each position corresponds to area 1-6. The area number is present if assigned, `-` if not:
- `123456` = all areas
- `123---` = areas 1-3 only
- `-2----` = area 2 only
- `1-----` = area 1 only

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
