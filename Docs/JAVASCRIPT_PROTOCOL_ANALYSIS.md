# AVE AF927 Alarm Panel - JavaScript Protocol Analysis

## Overview

This document provides a detailed analysis of the AVE AF927PLUS alarm panel's WebSocket protocol as reverse-engineered from the official web interface JavaScript files. The analysis is based on examining:
- `web_socket.js` - WebSocket connection initialization and framing
- `xml.js` - XML message construction and framing
- `main.js` - Core event handling and state management
- `util_nolang.js` - Login flows, anomaly handling, state commands
- `pag_widget_login_small.js` - User authentication flow
- `pag_widget_zone_select_vert.js` - Area selection and arm/disarm commands

---

## WebSocket Connection & Framing

### Connection Setup

**File:** `web_socket.js` (lines 64-150)

The panel uses different connection strategies based on network location:

```javascript
// Local network
if (isLocalIp(location.hostname)) {
    ws = new WebSocket(WEB_SOCK_ADDR);  // ws://IP:PORT/
}
// Cloud (old endpoint)
else if (isCloudOldIp(location.hostname)) {
    ws = new WebSocket(WEB_SOCK_CLOUD_OLD_ADDR);  // ws://IP:PORT+10000/
}
// Cloud (new/secure endpoint)
else {
    ws = new WebSocket("wss://" + location.hostname + "/WebSocketService");
}
```

**Binary Type:** `arraybuffer` (line 83)

### Connection Handshake

**Version Check (lines 100-107):**

1. Client opens WebSocket connection
2. Panel sends raw text (not XML) containing the software version string: `<?php echo SW_VER_STR; ?>`
3. Client verifies exact version match with `String.fromCharCode.apply(null, new Uint8Array(e.data))`
4. If version matches, client immediately sends PAIRING request
5. If version mismatch, page reloads (line 110)

### Source/Target ID Generation

**File:** `xml.js` (lines 7-13)

```javascript
var xml_cen_sn = "1234567890";  // Panel serial (fixed/configurable)
var xml_my_sn = Date.now();      // OR from session token
```

**Important:** Client source ID (`xml_my_sn`) is generated in JavaScript:
- Default: `Date.now()` → milliseconds since epoch
- Persisted: Can be stored in `$_SESSION["WS_TOKEN"]` (PHP-side)
- Python equivalent: `int(time.time() * 1000)`

---

## XML Message Framing

### Frame Structure

**File:** `xml.js` (lines 56-85)

Messages are framed with STX (0x02) and ETX (0x03) control characters:

```
0x02 + <?xml version="1.0" encoding="utf-8"?><Request...> + 0x03
```

**Implementation (line 62):**
```javascript
xmlStr = String.fromCharCode(0x02) + "<" + "?xml version=\"1.0\" encoding=\"utf-8\"?>"
         + xmlStr + String.fromCharCode(0x03);
```

### Request Header Structure

**File:** `xml.js` (lines 31-44)

```xml
<?xml version="1.0" encoding="utf-8"?>
<Request id="SYNC_ID"
         source="CLIENT_SN"
         target="PANEL_SN"
         protocolVersion="1.0"
         type="REQUEST_TYPE">
  <!-- body -->
</Request>
```

**Attributes:**
- `id`: Synchronization ID (numeric, usually "00", "01", "02", etc.) - used to correlate responses
- `source`: Client serial ID (millisecond timestamp)
- `target`: Panel serial ID ("1234567890")
- `protocolVersion`: Always "1.0"
- `type`: Message type (PAIRING, FILE, MENU, DEVICE_CMD, STATE, etc.)

---

## Pairing Flow

**File:** `main.js` (lines 1354-1359)

After version verification, client sends pairing request:

```javascript
function pairing_send() {
    xml_request = xml_request_head_build("PAIRING", "main_obj");
    xml_par = $(XML("Authentication"));
    xml_par.attr("username", "host");
    xml_par.attr("password", "00000");
    xml_request.append(xml_par);
    xml_send(xml_request);
}
```

**Pairing Request XML:**
```xml
<?xml version="1.0" encoding="utf-8"?>
<Request id="..." source="..." target="..." protocolVersion="1.0" type="PAIRING">
  <Authentication username="host" password="00000"/>
</Request>
```

**Panel Response:**
The panel sends back FILE type event containing the configuration XML.

---

## Configuration File Loading

**File:** `main.js` (lines 1360-1365)

After pairing, request full configuration:

```xml
<?xml version="1.0" encoding="utf-8"?>
<Request id="..." source="..." target="..." protocolVersion="1.0" type="FILE">
  <Type>CONFIGURATION</Type>
</Request>
```

Response contains base64-encoded XML with all panel configuration (areas, devices, users, etc.)

---

## Login Flow (ARM/DISARM Workflow)

### Step 1: User Initiates ARM/DISARM

User clicks "ON/OFF" button on home page. This opens the login dialog.

**File:** `pag_widget_leaf_home.js` (lines 21-32)

```javascript
$("#menu_on_off").off("click").click(function() {
    // Clear session on manual trigger
    if (!QT && !imq_get()) {
        session_u_p = null;
        role_str = "NOROLE";
        uname_str = "";
        session_st_refresh();
    }
    // Show login widget with "zone_select" destination
    pag_change(".home .JSdialog", "widget_login_small", "zone_select");
});
```

### Step 2: PIN Entry & Authentication

**File:** `pag_widget_login_small.js` (lines 32-40, 1407-1419)

When user submits PIN, `send_login("zone_select", null)` is called:

```javascript
// src: util_nolang.js line 1407-1419
send_login(dest_page="zone_select")
{
    loginType = "TERM_CODE";

    xml_request = xml_request_head_build("MENU", "widget_login_small");
    xml_par = $(XML("filter"));
    xml_par.text(login_permission_str_get("zone_select")); // "USER|POWERUSER"
    xml_request.append(xml_par);

    xml_par = $(XML("act"));
    xml_par.text("LOGIN");
    xml_request.append(xml_par);

    xml_par = $(XML("page"));
    xml_par.text("USER");
    xml_request.append(xml_par);

    xml_par = $(XML("par"));
    xml_request.append(xml_par);

    xml_item = $(XML("code"));
    xml_item.text(pin);
    xml_par.append(xml_item);

    xml_item = $(XML("type"));
    xml_item.text("TERM_CODE");
    xml_par.append(xml_item);

    xml_send(xml_request);
}
```

**LOGIN Request XML (type=TERM_CODE):**
```xml
<?xml version="1.0" encoding="utf-8"?>
<Request id="widget_login_small" source="..." target="..." protocolVersion="1.0" type="MENU">
  <filter>USER|POWERUSER</filter>
  <act>LOGIN</act>
  <page>USER</page>
  <par>
    <code>123456</code>
    <type>TERM_CODE</type>
  </par>
</Request>
```

**Filter attribute:** Permissions required for this login type
- `TERM_CODE`: For arm/disarm operations (USER|POWERUSER filter)
- `SETTINGS`: For panel settings access (varies by admin level)

### Step 3: Anomaly Handling (Conditional)

**File:** `util_nolang.js` (lines 699-729), `pag_widget_leaf_home.js` (lines 37-54)

When LOGIN succeeds and anomalies exist (tamper, low battery, etc.), the panel may send an Anoms event:

```javascript
anoms_obj = {
    anoms: [],
    flush_areas: "",      // Areas to flush anomalies from
    command: "",          // Command to execute (C00101=ARM, C00102=DISARM, C00108=FORCE_ARM)
    login_code: "",       // PIN code for the actual command
    cmd_area: "",         // Area mask for the command
    warning: "",          // "1" if warning (don't arm), "0" if recoverable

    init: function(anom_xml) {
        this.flush_areas = anom_xml.children("Anoms").attr("flush_area");
        this.cmd_area = anom_xml.children("Anoms").attr("cmd_area");
        this.command = anom_xml.children("Anoms").attr("command");
        this.login_code = anom_xml.children("Anoms").attr("login_code");
        this.warning = anom_xml.children("Anoms").attr("warning");
        // Parse individual anomalies from Anom children
    }
};
```

**Anomaly Event Example (type=STATE with Anoms):**
```xml
<?xml version="1.0" encoding="utf-8"?>
<Event type="STATE">
  <Anoms warning="0" flush_area="123456" command="C00101" login_code="123456" cmd_area="123456">
    <Anom id="1">
      <id>AL010</id>
      <State>S10401</State>  <!-- Low battery state -->
      <cnt>1</cnt>
      <Timestamp>...</Timestamp>
      <localdt>...</localdt>
    </Anom>
  </Anoms>
</Event>
```

**Flow Decision:**
- If `warning="1"` → Cannot proceed, show warning only
- If `warning="0"` → Recoverable anomalies, can continue
- If no `<Anoms>` → Proceed directly to area selection

**Anomaly Acknowledgment (if recoverable):**
If anomalies exist and warning=0, send ANOM_ACK before arm command:

```javascript
// util_nolang.js lines 794-800
function send_state_anom_flush(areas) {
    xml_request = xml_request_head_build("STATE");
    xml_par = $(XML("type"));
    xml_par.text("ANOM_ACK");
    xml_request.append(xml_par);
    xml_par = $(XML("value"));
    xml_par.text(areas);  // Area mask (e.g., "123456")
    xml_request.append(xml_par);
    xml_send(xml_request);
}
```

**ANOM_ACK Request:**
```xml
<?xml version="1.0" encoding="utf-8"?>
<Request id="..." source="..." target="..." protocolVersion="1.0" type="STATE">
  <type>ANOM_ACK</type>
  <value>123456</value>  <!-- Areas to acknowledge -->
</Request>
```

### Step 4: Area Selection (PIN Already Validated)

**File:** `pag_widget_login_small.js` (lines 180-189)

After LOGIN succeeds, user is presented with area selection widget:

```javascript
else if (this.destination == "zone_select") {
    u_p = pin;  // Store PIN for subsequent commands
    this.checkpoint_user = true;

    if ((anoms_obj.getSize() > 0) && !(anoms_obj.isWarning())) {
        // Show anomalies
        pag_change(".home .JSdialog", "widget_sideanom", ...);
    } else {
        // Show area selection
        pag_change(".JSdialog", "widget_zone_select_vert", ...);
    }
}
```

**Note:** The PIN is stored in global `u_p` variable for the arm/disarm command.

### Step 5: ARM/DISARM Command Execution

**File:** `pag_widget_zone_select_vert.js` (lines 266-329)

When user selects areas and clicks OK, the area selection widget sends DEVICE_CMD:

```javascript
par_send: function(manual_onoff_flg) {
    for (var i = 0; i < this.cmd_areas_all.length; i++) {
        var msk = "";
        if (this.cmd_areas_all[i] == WS_DEV_ALARM_CEN_CMD_ON_STR)  // "C00101"
            msk = this.on_msk;    // Areas to arm
        else if (this.cmd_areas_all[i] == WS_DEV_ALARM_CEN_CMD_OFF_STR)  // "C00102"
            msk = this.off_msk;   // Areas to disarm

        if (msk == "" || msk == area_off_all_str)
            continue;  // Skip if no areas for this command

        var cen_id = xml_file_configuration.find("Devices Device")
            .filter(function() {
                if ($(this).children("Subcategory").text() == WS_DEV_ALARM_CEN_STR)
                    return true;
            }).attr("id");  // Device ID of central unit (e.g., "2")

        xml_request = xml_request_head_build("DEVICE_CMD");
        xml_par = $(XML("Command"));
        xml_par.text(this.cmd_areas_all[i]);  // "C00101" or "C00102"
        xml_request.append(xml_par);

        xml_par = $(XML("Device"));
        xml_par.text(cen_id);  // Central unit device ID
        xml_request.append(xml_par);

        xml_par = $(XML("Arguments"));
        xml_request.append(xml_par);

        xml_node = $(XML("Argument"));
        xml_node.attr("id", "PIN");
        xml_node.text(u_p);  // The PIN code
        xml_par.append(xml_node);

        xml_node = $(XML("Argument"));
        xml_node.attr("id", "AREAS");
        xml_node.text(msk);  // Area mask (e.g., "123---")
        xml_par.append(xml_node);

        xml_send(xml_request);
    }

    u_p = "";  // Clear PIN after sending
}
```

**Area Mask Format (6 characters):**
- Position = Area number (1-6)
- Character = Area ID if included, '-' if excluded
- Example: `"123---"` = areas 1, 2, 3 only
- Example: `"1-3456"` = all areas except 2

**DEVICE_CMD Request (ARM - C00101):**
```xml
<?xml version="1.0" encoding="utf-8"?>
<Request id="..." source="..." target="..." protocolVersion="1.0" type="DEVICE_CMD">
  <Command>C00101</Command>  <!-- ARM command -->
  <Device>2</Device>          <!-- Central unit device ID -->
  <Arguments>
    <Argument id="PIN">123456</Argument>      <!-- User PIN -->
    <Argument id="AREAS">123---</Argument>    <!-- Area mask (arm areas 1,2,3) -->
  </Arguments>
</Request>
```

**DEVICE_CMD Request (DISARM - C00102):**
```xml
<?xml version="1.0" encoding="utf-8"?>
<Request id="..." source="..." target="..." protocolVersion="1.0" type="DEVICE_CMD">
  <Command>C00102</Command>  <!-- DISARM command -->
  <Device>2</Device>          <!-- Central unit device ID -->
  <Arguments>
    <Argument id="PIN">123456</Argument>      <!-- User PIN -->
    <Argument id="AREAS">123---</Argument>    <!-- Area mask (disarm areas 1,2,3) -->
  </Arguments>
</Request>
```

---

## State Events (Unsolicited from Panel)

### STATE Event Structure

**File:** `pag_widget_leaf_home.js` (lines 164-232)

The panel pushes STATE events when device statuses change:

```xml
<?xml version="1.0" encoding="utf-8"?>
<Event type="STATE">
  <Device>AL002</Device>     <!-- Central unit -->
  <State>S00121</State>       <!-- S00121=DISARMED, S00122=ARMING/ARMED, S00120=ON, S00127=ALARM -->
  <Areas>
    <Area id="1" st="0" />    <!-- st: 0=disarmed, 1=arming (texit=seconds), 2=armed -->
    <Area id="2" st="0" />
    <Area id="3" st="1" texit="88" />  <!-- texit: exit delay in seconds -->
    <Area id="4" st="0" />
    <Area id="5" st="0" />
    <Area id="6" st="0" />
  </Areas>
  <Anoms warning="0" ... />  <!-- Optional: anomalies (tamper, battery, GSM) -->
</Event>
```

**State Codes:**
- `S00120` = Armed (ON)
- `S00121` = Disarmed (OFF)
- `S00122` = Arming/Partial Armed (PART)
- `S00127` = Alarm triggered

**Area State Codes:**
- `st="0"` = Disarmed
- `st="1"` = Arming with exit delay (see `texit`)
- `st="2"` = Armed

### State Transition in Python

The current Python implementation should:

1. Parse the `<State>` element to update global panel state
2. Parse each `<Area>` element to update per-area states
3. Extract `texit` attribute to show exit delay countdown
4. Handle `<Anoms>` if present to show anomalies

---

## Other Device State Events

### Battery Status (AL010)

```xml
<?xml version="1.0" encoding="utf-8"?>
<Event type="STATE">
  <Device>AL010</Device>
  <Info>100%</Info>  <!-- Battery percentage -->
</Event>
```

### GSM Module (AL015)

```xml
<?xml version="1.0" encoding="utf-8"?>
<Event type="STATE">
  <Device>AL015</Device>
  <Info>I TIM</Info>       <!-- Network operator -->
  <IMEI>123456789012345</IMEI>
</Event>
```

### Panel Status (AL001)

```xml
<?xml version="1.0" encoding="utf-8"?>
<Event type="STATE">
  <Device>AL001</Device>
  <State>S00121</State>  <!-- Various status codes -->
</Event>
```

---

## Response Messages

### Confirmation (Synchronous Response)

**File:** `main.js` (lines 200-216)

When request has id != "00", panel sends Response with matching id:

```xml
<?xml version="1.0" encoding="utf-8"?>
<Response id="01" source="1234567890" target="..." protocolVersion="1.0" type="MENU">
  <act>LOGIN</act>
  <page>USER</page>
  <res>ACCEPTED</res>  <!-- ACCEPTED, REFUSED, PENDING, INHIBITED, etc. -->
  <desc>0</desc>       <!-- Attempt count if REFUSED, inhibit time if INHIBITED -->
  <par>
    <item id="1">
      <role>USER</role>
      <name>John Doe</name>
      <area_ins>123456</area_ins>  <!-- Areas user can arm -->
      <area_dis>123456</area_dis>  <!-- Areas user can disarm -->
      <area_grp>------</area_grp>  <!-- Group control -->
      <imq>0</imq>                 <!-- In-motion query? -->
      <coerc>...</coerc>
    </item>
  </par>
</Response>
```

**Response Status Codes (LOGIN):**
- `ACCEPTED` → Login successful, proceed with operation
- `PENDING` → Requires additional confirmation (dialog shown)
- `REFUSED` → Login failed, attempts left shown in desc
- `INHIBITED` → Too many failed attempts, locked for N seconds (desc=seconds)
- `FLUSHED` → All pending states cleared
- `REFUSED_TSLOT` → User not allowed at this time slot

---

## Message Routing Architecture

**File:** `main.js` (lines 262-339)

The JavaScript uses a sophisticated routing system to dispatch messages to handlers:

```javascript
var pag_table_new = {};  // Central message dispatcher

// Each handler registers by name:
pag_table_new["widget_login_small"] = {
    onrecv_confirmation: function(conf) { ... },
    onrecv_indication: function(indi) { ... },
    onclose: function() { ... }
};

// Router matches incoming messages to handlers:
function indi_diverter(indi) {
    // Routes based on: type, act, page, res, State, Device, etc.
    // Returns widget name(s) to call onrecv_indication()
}
```

**Python Equivalent Needed:**
The Python integration needs a similar request/response tracker to:
1. Send request with unique id
2. Wait for Response with matching id
3. Route Events to appropriate handlers
4. Handle unsolicited STATE events

---

## Key Protocol Differences from CLAUDE.md Documentation

Based on JavaScript analysis, these clarifications/corrections:

1. **Version Handshake:** Raw text (not XML) version string must match exactly before PAIRING
2. **Frame Format:** Confirmed STX (0x02) + XML + ETX (0x03)
3. **Sync ID:** Used as both request id attribute AND page/destination identifier
4. **Login Type Attribute:** Must include `<type>TERM_CODE</type>` for arm/disarm (not just in filter)
5. **Area Mask Behavior:** Multiple DEVICE_CMD requests sent if both arm AND disarm areas selected
6. **PIN Handling:**
   - First LOGIN validates PIN
   - PIN stored in global `u_p`
   - Subsequent DEVICE_CMD uses stored PIN
   - NO separate disarm LOGIN needed
7. **Anomaly Window:** Panel sends Anoms event BEFORE showing area selection, not during arm command
8. **No Explicit Logout:** LOGOUT command exists but not strictly required after arm/disarm

---

## Raw Bytes Example

A complete arm command for areas 1-3 would be:

```
0x02
<?xml version="1.0" encoding="utf-8"?><Request id="widget_zone_select" source="1709000000000" target="1234567890" protocolVersion="1.0" type="DEVICE_CMD"><Command>C00101</Command><Device>2</Device><Arguments><Argument id="PIN">123456</Argument><Argument id="AREAS">123---</Argument></Arguments></Request>
0x03
```

**Breaking Down by Bytes:**
- `0x02` = STX (1 byte)
- XML string in UTF-8 encoding
- `0x03` = ETX (1 byte)

---

## Authentication Flow Summary

```
1. WebSocket Connect
   ↓
2. Panel Sends Version String (raw bytes, not XML)
   ↓
3. Client Verifies Version Match
   ↓
4. Client Sends PAIRING Request
   ↓
5. Panel Sends FILE Event (config XML, base64)
   ↓
6. Client Decodes & Stores Configuration
   ↓
7. User Clicks ARM Button
   ↓
8. Client Sends LOGIN Request (type=TERM_CODE)
   ↓
9. Panel Sends LOGIN Response (ACCEPTED/REFUSED/PENDING)
   ↓
10. IF Anomalies Exist:
    Panel Sends STATE Event with <Anoms>
    Client Shows Anomaly Dialog
    ↓
11. Client Shows Area Selection Widget
    ↓
12. User Selects Areas & Clicks OK
    ↓
13. Client Sends DEVICE_CMD (C00101 or C00102)
    ↓
14. Panel Sends STATE Event with updated area states
    ↓
15. Client Updates GUI with new states
```

---

## Notes for Python Implementation

### Critical Details:
1. **Frame Format:** Must add STX (0x02) before XML declaration and ETX (0x03) after root element closing tag
2. **Version Handshake:** First message from panel is plain text version, NOT XML
3. **XML Encoding:** UTF-8, must handle properly for special characters
4. **Millisecond Timestamps:** Use `int(time.time() * 1000)` for source ID
5. **Area Masks:** String of 6 characters, numeric for inclusion, '-' for exclusion
6. **Request Routing:** Need async/await or callback mechanism to match responses to requests
7. **State Events:** Can arrive anytime, must be handled asynchronously
8. **Multiple Commands:** If user selects both arm and disarm areas, send separate DEVICE_CMD requests

### Simplifications from Current Implementation:
1. ANOM_ACK may be optional if no anomalies (test both paths)
2. LOGOUT may be optional
3. Configuration can be cached between sessions
4. Don't need HOME state request if state events arrive automatically

