# AVE HS3 Alarm System — Firmware Reverse Engineering Analysis

## System Overview

This is firmware for an **AVE HS3** alarm/security system running on an **ARM (i.MX) platform** with Linux 3.0.35. The web interface version is **V0.01.77**, catalog version **5.02.29**.

---

## File Inventory

| File | Type | Description |
|------|------|-------------|
| `k00024` | u-boot Linux kernel (ARM) | Linux 3.0.35 kernel image, load address 0x10008000 |
| `a50447` | ELF 32-bit ARM executable | Main application binary (with debug info, not stripped) |
| `q20210` | ELF 32-bit ARM executable | Secondary binary |
| `t20041` | ELF 32-bit ARM executable | Secondary binary |
| `b00004.bin` | Binary data | Likely bootloader or firmware blob |
| `c20268` | Binary data | Unknown data blob |
| `d50229` | XML catalog | Device catalog — defines all device types, states, commands, and models |
| `w00177.tar.gz` | **htdocs.tar** | **Web interface (PHP + JS + CSS)** — the main target |
| `p00032.tar.gz` | tmp filesystem | Kernel module (`hs3_gpio_mod.ko`), timezone data, utilities |
| `g00161.tar.gz` | generic.tar | SSH keys, certificates, bus config, package list |
| `l50246.tar.gz` | language.tar | Localization XML files (EN, DE, ES, FR, IT, PT) |
| `v00004.tar.gz` | audio.tar | WAV audio files for alarm sounds/voice prompts |

---

## Communication Architecture

The alarm system uses a **WebSocket-based XML protocol** for all communication between the web UI and the alarm central unit.

### Connection Flow

1. **Browser connects** to WebSocket on port **14001** (local) or via WSS through cloud proxy
2. **Version handshake** — server sends version string, client verifies it matches `V0.01.77`
3. **Pairing request** — client sends XML PAIRING request with credentials:
   - Default: `username="host"`, `password="00000"`
4. **Configuration load** — client requests the full device/area/room configuration
5. **Real-time events** — server pushes XML `<Event>` messages for state changes

### WebSocket Endpoints

- **Local**: `ws://<alarm-ip>:14001/`
- **Cloud (old)**: `ws://tunnel.ave.it:<port>/` or `ws://monitoraggio.ave.it:<port>/`
- **Cloud (new)**: `wss://<hostname>/WebSocketService`

---

## XML Protocol Reference

All messages are framed with `0x02` (STX) and `0x03` (ETX) bytes around XML.

### Request Structure
```xml
<?xml version="1.0" encoding="utf-8"?>
<Request id="<transaction-id>" source="<client-sn>" target="<central-sn>" protocolVersion="1.0" type="<TYPE>">
  <!-- parameters -->
</Request>
```

### Request Types

| Type | Purpose |
|------|---------|
| `PAIRING` | Initial authentication/handshake |
| `MENU` | Load pages, navigate UI, request data |
| `FILE` | Request configuration files |
| `DEV` | Device operations |
| `AREA` | Area arm/disarm operations |
| `USER` | User management |
| `SET` | Settings operations |
| `LOG` | Event log access |
| `AUDIO` | Audio management |
| `TEST` | Device testing |
| `SERVICES` | Service operations |
| `TIMESLOT` | Time slot scheduling |

### Key Commands (from catalog d50229)

| Command ID | Description |
|------------|-------------|
| `C00101` | **Arm (Total)** — full system arm |
| `C00102` | **Disarm** — system disarm |
| `C00103` | **Arm (Partial)** — partial arm |
| `C00104` | Arm (Predefined) |
| `C00105` | Medical emergency |
| `C00106` | Robbery/hold-up |
| `C00107` | Panic |
| `C00108` | Forced arm |
| `C00181` | Enable remote management (telegest) |
| `C00182` | Disable remote management |
| `C00193` | Get generic status |
| `C00401` | GSM credit check |
| `C02001` | Wired input activate |
| `C02002` | Wired input deactivate |

### Key States

| State ID | Description |
|----------|-------------|
| `S00120` | System armed (total) |
| `S00121` | System disarmed |
| `S00122` | System partially armed |
| `S00123` | Arming denied |
| `S00124` | Idle/maintenance out |
| `S00125` | Maintenance mode |
| `S00127` | System in alarm |

---

## PHP Source Code Map

### Core Files (`private/php/`)

| File | Purpose |
|------|---------|
| `config.php` | System configuration — defines paths, ports, version, simulation mode |
| `gp_fx.php` | General functions — template parsing, language loading, session key management |
| `tmpl_fx.php` | Template engine — processes `{TMPL_*}` and `{LANG_*}` tokens |
| `param.php` | Page parameter handler — routes widget parameters from GET/POST |
| `remote_backup.php` | Backup download handler — serves ZIP backups from `/home/user/new/backup_zip/` |
| `rf_test.php` | RF log download/erase — accesses `/ramdisk/rf.txt` and `/ramdisk/debug.txt` |

### Entry Points

| File | URL | Purpose |
|------|-----|---------|
| `index.php` | `/` | Main web app — loads templates, handles language, serves pages/JS/CSS |
| `bridge.php` | `/bridge.php?command=LSF` | Returns bridge LSF XML from ramdisk |
| `revealcode.php` | `/revealcode.php` | Returns reveal code XML from ramdisk |

### Key Configuration Constants

```php
define("WS_PORT", 14001);          // WebSocket port
define("RAMDISK_PATH", "/ramdisk/"); // Runtime data location
define("REMOTE_BACKUP_PATH", "/home/user/new/backup_zip/");
define("SW_VER_STR", "V0.01.77");  // Software version
```

### Page/Widget System

The UI uses a widget-based architecture loaded via `index.php?cmd=getpag&name=<widget>`. There are 100+ widget PHP templates in `tmpl/default/pag/` covering:

- **Home/Status**: `pag_home`, `pag_widget_leaf_home`, `pag_widget_stdby`
- **Devices**: `pag_widget_device`, `pag_widget_devices_add`, `pag_widget_devices_areas`
- **Areas/Zones**: `pag_widget_zone_select_vert`, `pag_widget_identifying_areas`
- **Settings**: `pag_nav_settings_*`, `pag_widget_settings_utilities`
- **Users**: `pag_widget_mod_user`, `pag_widget_add_other_users`
- **Scenes**: `pag_widget_scenery_list`, `pag_widget_add_scenery`
- **Communication**: `pag_nav_communication`, `pag_widget_cloud`, `pag_widget_telegest`
- **Testing**: `pag_widget_test_device`, `pag_widget_test_device_list`
- **Login**: `pag_widget_login_small`, `pag_widget_keypad`

---

## JavaScript Architecture

### Core JS Files (`private/js/`)

| File | Purpose |
|------|---------|
| `web_socket.js` | WebSocket connection management — connect, reconnect, send |
| `xml.js` | XML protocol builder — constructs Request XML, serializes and sends |
| `main.js` | Main application logic — state machine, event handling, pairing, configuration loading |
| `term_def.js` | Constants/definitions — all device type codes, state codes, command codes |
| `pag.js` | Page/widget navigation system |
| `util.js` / `util_nolang.js` | Utility functions including login flow |
| `function_items.js` | Device item rendering and interaction |

### Login/Authentication Flow

1. User enters PIN via keypad widget
2. `send_login()` in `util_nolang.js` builds a MENU request with login credentials
3. Server validates and returns role: `USER`, `POWERUSER`, `INST`, or `NOROLE`
4. Role determines which pages/actions are available

### User Roles

| Role | Access Level |
|------|-------------|
| `USER` | Basic — arm/disarm, view status |
| `POWERUSER` | Extended — settings, device management |
| `INST` | Installer — full configuration access |

---

## Device Types (from term_def.js)

The system supports a wide range of alarm peripherals:

- **ALA001**: Central unit
- **ALA003-008**: LCD, GSM, PSTN, Keypad, Remote, RFID
- **ALA009-014**: Sensors (Magnetic, PIR, Dual-Tech, Microwave, Flood, Smoke)
- **ALA015-022**: Sirens, Repeaters, Relays, Wired inputs, Universal sensors, Photo-PIR
- **ALA030-055**: BUS devices (wired sensors, sirens, transponders, relays, tag readers, concentrators)
- **ALA100-108**: System components (RTC, Power, WiFi, Terminal, Battery, Cloud, Telegest, Automation)
- **IOT001-002**: IoT device, Thermostat

---

## How to Interact with the Alarm System

To programmatically interact with this alarm system, you need to:

1. **Open a WebSocket** to the alarm IP on port 14001
2. **Receive version string**, verify it matches
3. **Send PAIRING** XML with valid credentials
4. **Send commands** as XML Request messages

### Example: Arm System (Total)
```xml
<?xml version="1.0" encoding="utf-8"?>
<Request id="1" source="myclient" target="1234567890" protocolVersion="1.0" type="DEV">
  <act>CMD</act>
  <id>central-device-id</id>
  <cmd>C00101</cmd>
</Request>
```

### Example: Disarm System
```xml
<?xml version="1.0" encoding="utf-8"?>
<Request id="2" source="myclient" target="1234567890" protocolVersion="1.0" type="DEV">
  <act>CMD</act>
  <id>central-device-id</id>
  <cmd>C00102</cmd>
</Request>
```

### Example: Request Configuration
```xml
<?xml version="1.0" encoding="utf-8"?>
<Request id="3" source="myclient" target="1234567890" protocolVersion="1.0" type="FILE">
  <Type>CONFIGURATION</Type>
</Request>
```

> **Note**: The exact XML structure for commands may require a valid login session (PIN authentication) before arm/disarm commands are accepted. The `target` field should be the central unit's serial number (obtained during pairing).

---

## Extracted Files Location

The full extracted web interface is available at: `htdocs_extracted/` in your folder.
