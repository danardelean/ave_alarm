# Critical Protocol Implementation Corrections

## Summary

Analysis of the official JavaScript implementation reveals several important corrections needed for the Python integration to fully comply with the exact protocol specification.

---

## 1. Version Handshake (CRITICAL)

### Current Assumption
The implementation assumes the panel responds to initial requests immediately.

### Actual Protocol
After WebSocket connects, the panel sends **raw text** (not XML) containing the software version string.

**Source:** `web_socket.js` lines 100-112

```javascript
ws.onmessage = function(e) {
    if (ws_check_version_flg) {
        if (SIMUL || (String.fromCharCode.apply(null, new Uint8Array(e.data)) == "<?php echo SW_VER_STR; ?>")) {
            cons("send pairing...");
            pairing_send();
            ws_check_version_flg = false;
        } else {
            window.location.replace("");  // Page reload on version mismatch
        }
    }
    // ... rest of message handling
}
```

### Python Implementation Required

**Step 1: Send nothing, just wait**
```python
# Don't send anything on connection
# Just wait for the version string
```

**Step 2: Receive raw version string**
```python
first_message = await websocket.recv()
version_string = first_message.decode('utf-8')
# Expected format: something like "AF927v1.0.0" or similar
# Must match EXACTLY with panel's version

# Check for version match
if version_string == EXPECTED_VERSION:
    # Proceed to pairing
    pass
else:
    # Connection failed, version mismatch
    # Don't send pairing, just log and reconnect
    pass
```

### Key Point
- No requests should be sent before receiving version string
- Version string is **raw text**, not XML
- Must match exactly (byte-for-byte)
- If mismatch, disconnect and reconnect (don't send anything)

---

## 2. XML Frame Format (CRITICAL)

### Current Assumption
Messages may have various framing schemes.

### Actual Protocol
**ALL** XML messages must be framed with STX (0x02) and ETX (0x03).

**Source:** `xml.js` lines 56-85

```javascript
var xmlStr;
var len;
if (window.ActiveXObject)
    xmlStr = xmldata[0].xml;
else
    xmlStr = new XMLSerializer().serializeToString(xmldata[0]);

// THIS IS THE FRAME FORMAT:
xmlStr = String.fromCharCode(0x02) + "<" + "?xml version=\"1.0\" encoding=\"utf-8\"?>" + xmlStr + String.fromCharCode(0x03);

if (!web_socket_send(xmlStr) && SIMUL)
    alert("KO " + xmlStr);
```

### Python Implementation

```python
def frame_message(xml_string):
    """Add STX/ETX framing to XML message"""
    # Ensure no double framing
    if isinstance(xml_string, str):
        xml_bytes = xml_string.encode('utf-8')
    else:
        xml_bytes = xml_string

    # Add STX before and ETX after
    framed = b'\x02' + xml_bytes + b'\x03'
    return framed

async def send_request(xml_string):
    """Send XML request with proper framing"""
    framed = frame_message(xml_string)
    await websocket.send(framed)

async def receive_message():
    """Receive and unframe message"""
    raw_data = await websocket.recv()

    if isinstance(raw_data, bytes):
        # Strip STX (0x02) and ETX (0x03)
        if raw_data[0] == 0x02 and raw_data[-1] == 0x03:
            xml_string = raw_data[1:-1].decode('utf-8')
            return xml_string
    else:
        # Could be raw version string or other text
        return raw_data
```

### Verification
Every message sent must have:
- Byte 0: 0x02 (STX)
- Bytes 1-N: UTF-8 encoded XML with declaration
- Byte N+1: 0x03 (ETX)

---

## 3. Request ID (Sync ID) Semantics

### Current Assumption
The `id` attribute in Request is just an arbitrary sequence number.

### Actual Usage
The `id` attribute serves dual purposes:

**Source:** `xml.js` lines 31-44, `main.js` lines 341-416

```javascript
function xml_request_head_build(type, prot_tx_str) {
    if (prot_tx_str == null)
        xml_prot_tx_syn = "00";
    else
        xml_prot_tx_syn = prot_tx_str;

    xml_request = $(XML_ROOT("Request"));
    xml_request.attr("id", "" + xml_prot_tx_syn);        // 1. Correlation ID
    xml_request.attr("source", xml_my_sn);
    xml_request.attr("target", xml_cen_sn);
    xml_request.attr("protocolVersion", "1.0");
    xml_request.attr("type", type);
    return(xml_request);
}
```

### Dual Purpose of ID

**Purpose 1: Request/Response Correlation**
- Request has id="01"
- Response has id="01"
- Allows matching responses to requests

**Purpose 2: Handler Routing**
- The id can be a widget name (string) like "widget_login_small"
- Used to route unsolicited indications to handlers
- Example: `pag_table_new[hash_confirmation].onrecv_confirmation(confirmation)`

### Python Implementation

```python
# Track pending requests
self.pending_requests = {}

async def send_request(xml_request, request_id=None):
    """Send request and track for response"""
    if request_id is None:
        request_id = self.next_sync_id()

    # Create future for response
    response_future = asyncio.Future()
    self.pending_requests[request_id] = response_future

    # Send message
    xml_string = self.build_xml_with_id(request_id, xml_request)
    await self._send_frame(xml_string)

    # Wait for response (with timeout)
    try:
        response = await asyncio.wait_for(response_future, timeout=5.0)
        return response
    except asyncio.TimeoutError:
        del self.pending_requests[request_id]
        raise

async def handle_response(response_element):
    """Handle synchronous response"""
    response_id = response_element.get('id')
    if response_id in self.pending_requests:
        future = self.pending_requests.pop(response_id)
        future.set_result(response_element)

async def handle_event(event_element):
    """Handle unsolicited event/indication"""
    # Route to appropriate handler
    event_type = event_element.get('type')
    # ... dispatch logic
```

---

## 4. Login Type Attribute (TERM_CODE vs SETTINGS)

### Current Assumption
Login type might be optional or in filter only.

### Actual Protocol
The `<type>` element inside `<par>` is **MANDATORY** and must be correct.

**Source:** `util_nolang.js` lines 1407-1419

```javascript
else if ((dest_page == "zone_select")) {
    loginType = "TERM_CODE";

    xml_par = $(XML("filter"));
    xml_par.text(login_permission_str_get(dest_page));

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
    xml_item.text(loginType);  // CRITICAL: Must be "TERM_CODE"
    xml_par.append(xml_item);

    xml_send(xml_request);
}
```

### Login Type Reference

| Login Type | Purpose | Filter | Use Case |
|------------|---------|--------|----------|
| `TERM_CODE` | User PIN for arm/disarm | `USER\|POWERUSER` | Zone select, logs, test |
| `SETTINGS` | Admin PIN for settings | Varies (POWERUSER, INST) | Settings access |
| `SETTINGS_INST` | Installer credentials | `INST` | Installer settings |

### Correct XML Structure

```xml
<!-- ARM/DISARM LOGIN -->
<Request type="MENU">
  <filter>USER|POWERUSER</filter>     <!-- 1. Filter in Request -->
  <act>LOGIN</act>
  <page>USER</page>
  <par>
    <code>123456</code>               <!-- 2. PIN in par/code -->
    <type>TERM_CODE</type>            <!-- 3. Type in par/type -->
  </par>
</Request>

<!-- SETTINGS LOGIN -->
<Request type="MENU">
  <filter>POWERUSER|INST</filter>     <!-- 1. Different filter -->
  <act>LOGIN</act>
  <page>USER</page>
  <par>
    <code>654321</code>               <!-- 2. Admin PIN -->
    <type>SETTINGS</type>             <!-- 3. Type is SETTINGS -->
  </par>
</Request>
```

---

## 5. Area Mask Encoding (CRITICAL)

### Current Assumption
Area mask might be a bitmap or binary encoding.

### Actual Protocol
Area mask is a **6-character string** where each position represents an area:

**Source:** `pag_widget_zone_select_vert.js` lines 252-264

```javascript
this.on_msk = "";
this.off_msk = "";

$("#zone_select_container .zone_select_item").each(function() {
    var area_id = $(this).attr("data-id");
    var utente_ins = widget_obj.areas_ins_msk.charAt(area_id - 1) != "-";

    var onoffflg = $(this).hasClass("on")
                && utente_ins
                && !widget_obj.onoffflg_prev[area_id]
                && !$(this).hasClass("unavailable");

    widget_obj.on_msk += (onoffflg ? area_id : "-");
});
```

### Area Mask Format

```
Position:  1 2 3 4 5 6
Example:   1 2 3 - - -  (areas 1,2,3 included)
Example:   - - - 4 5 6  (areas 4,5,6 included)
Example:   1 2 3 4 5 6  (all areas included)
Example:   - - - - - -  (no areas)
```

### Python Implementation

```python
def encode_area_mask(selected_areas):
    """
    Encode selected areas as 6-character mask string.

    Args:
        selected_areas: List of area IDs (1-6) to include
        Example: [1, 2, 3] -> "123---"

    Returns:
        String mask with area numbers or dashes
    """
    mask = []
    for area_id in range(1, 7):  # Areas 1-6
        if area_id in selected_areas:
            mask.append(str(area_id))
        else:
            mask.append('-')
    return ''.join(mask)

# Examples:
encode_area_mask([1, 2, 3])      # "123---"
encode_area_mask([4, 5, 6])      # "---456"
encode_area_mask([1, 3, 5])      # "1-3-5-"
encode_area_mask([1, 2, 3, 4, 5, 6])  # "123456"
```

### Validation

```python
def validate_area_mask(mask_string):
    """Validate area mask format"""
    if not isinstance(mask_string, str) or len(mask_string) != 6:
        return False

    for i, char in enumerate(mask_string):
        area_id = i + 1
        if char not in [str(area_id), '-']:
            return False  # Must be area number or dash

    return True

# Examples:
validate_area_mask("123---")       # True
validate_area_mask("12-456")       # False (position 3 should be '-' or '3')
validate_area_mask("---456")       # True
```

---

## 6. Multiple DEVICE_CMD Requests

### Current Assumption
A single DEVICE_CMD can handle both arm and disarm in one request.

### Actual Protocol
If user selects **both** areas to arm AND areas to disarm, **separate** DEVICE_CMD requests are sent.

**Source:** `pag_widget_zone_select_vert.js` lines 304-325

```javascript
// For each command type (ARM and DISARM)
for (var i = 0; i < this.cmd_areas_all.length; i++) {
    var msk = "";

    if (this.cmd_areas_all[i] == WS_DEV_ALARM_CEN_CMD_ON_STR)  // "C00101"
        msk = this.on_msk;
    else if (this.cmd_areas_all[i] == WS_DEV_ALARM_CEN_CMD_OFF_STR)  // "C00102"
        msk = this.off_msk;

    // Skip if no areas for this command
    if (msk == "" || msk == area_off_all_str)
        continue;

    // Build and send DEVICE_CMD
    xml_request = xml_request_head_build("DEVICE_CMD");
    // ... append Command, Device, Arguments
    xml_send(xml_request);
}
```

### When to Send Multiple Requests

```python
async def send_arm_disarm_commands(areas_to_arm, areas_to_disarm):
    """
    Send separate commands for arm and disarm if needed.
    """
    if areas_to_arm:
        await send_device_cmd(
            command="C00101",  # ARM
            areas=encode_area_mask(areas_to_arm),
            pin=current_pin
        )

    if areas_to_disarm:
        await send_device_cmd(
            command="C00102",  # DISARM
            areas=encode_area_mask(areas_to_disarm),
            pin=current_pin
        )

# Example: User selects to arm areas 1-3 and disarm areas 4-6
# This sends TWO requests:
# 1. C00101 with areas="123---"
# 2. C00102 with areas="---456"
```

---

## 7. Anomaly Acknowledgment (ANOM_ACK)

### Current Assumption
ANOM_ACK might be sent as part of arm command sequence.

### Actual Protocol
ANOM_ACK is **optional** and only sent if:
1. Anomalies event received with recoverable anomalies (`warning="0"`)
2. User acknowledges anomaly dialog
3. BEFORE sending DEVICE_CMD

**Source:** `util_nolang.js` lines 794-800

```javascript
function send_state_anom_flush(areas) {
    xml_request = xml_request_head_build("STATE");
    xml_par = $(XML("type"));
    xml_par.text("ANOM_ACK");
    xml_request.append(xml_par);
    xml_par = $(XML("value"));
    xml_par.text(areas);
    xml_send(xml_request);
}
```

### When ANOM_ACK is Sent

**Scenario 1: Anomalies with recoverable errors**
```
Panel sends: <Anoms warning="0" flush_area="123456" ... />
User clicks: Acknowledge anomalies
Client sends: STATE type=ANOM_ACK with value="123456"
Panel responds: Proceed normally
Client sends: DEVICE_CMD (normal arm/disarm)
```

**Scenario 2: No anomalies**
```
Panel sends: <Anoms warning="0" flush_area="" ... /> or no Anoms at all
Client skips: ANOM_ACK
Client sends: DEVICE_CMD directly
```

**Scenario 3: Warning anomalies**
```
Panel sends: <Anoms warning="1" ... />
Client shows: Cannot arm, blocking dialog
Client skips: ANOM_ACK and DEVICE_CMD
```

### Python Implementation

```python
async def handle_anomalies(anoms_element):
    """Handle anomaly event"""
    warning = anoms_element.get('warning', '0')
    flush_area = anoms_element.get('flush_area', '')
    command = anoms_element.get('command', '')

    if warning == '1':
        # Blocking anomalies - cannot proceed
        return False, "Cannot arm due to anomalies"

    elif warning == '0' and flush_area:
        # Recoverable anomalies - need acknowledgment
        # Show anomaly list to user...
        # User clicks "Continue"

        # Send ANOM_ACK
        await send_state_anom_flush(flush_area)
        return True, "Anomalies acknowledged"

    else:
        # No anomalies
        return True, "No anomalies"

async def send_state_anom_flush(areas):
    """Send ANOM_ACK state update"""
    xml = f"""<?xml version="1.0" encoding="utf-8"?>
<Request id="{self.next_id()}" source="{self.source_id}"
         target="{self.panel_serial}" protocolVersion="1.0" type="STATE">
  <type>ANOM_ACK</type>
  <value>{areas}</value>
</Request>"""
    await self.send_request(xml)
```

---

## 8. PIN Persistence in Session

### Current Assumption
PIN might need to be re-entered for each command.

### Actual Protocol
After successful LOGIN, PIN is cached in global `u_p` variable for subsequent DEVICE_CMD requests.

**Source:** `pag_widget_login_small.js` lines 180-189, `pag_widget_zone_select_vert.js` lines 321

```javascript
// After LOGIN succeeds
if (this.destination == "zone_select") {
    u_p = pin;  // Cache PIN globally
    // ... show area selection
}

// Later, when sending DEVICE_CMD
xml_node = $(XML("Argument"));
xml_node.attr("id", "PIN");
xml_node.text(u_p);  // Use cached PIN
xml_par.append(xml_node);

// After sending commands
u_p = "";  // Clear PIN
```

### Python Implementation

```python
class AVEClient:
    def __init__(self):
        self.current_pin = None  # Cached PIN after LOGIN

    async def login_for_arm_disarm(self, pin):
        """LOGIN and cache PIN"""
        response = await self.send_login("zone_select", pin)
        if response.success:
            self.current_pin = pin  # Cache it
            return response.area_permissions

    async def send_arm_command(self, areas):
        """Send ARM using cached PIN"""
        if not self.current_pin:
            raise RuntimeError("Not logged in")

        await self.send_device_cmd("C00101", areas, self.current_pin)

    async def clear_session(self):
        """Clear PIN after operation"""
        self.current_pin = None
```

---

## 9. Logout Flow

### Current Assumption
LOGOUT might be required after operations.

### Actual Protocol
LOGOUT command exists but is **optional** for client-initiated sequences.

**Source:** `util_nolang.js` lines 815-822

```javascript
function send_logOut() {
    xml_request = xml_request_head_build("MENU");
    xml_par = $(XML("act"));
    xml_par.text("LOGOUT");
    xml_request.append(xml_par);
    xml_par = $(XML("page"));
    xml_par.text("USER");
    xml_request.append(xml_par);
    xml_par = $(XML("par"));
    xml_request.append(xml_par);
    xml_send(xml_request);
}
```

**When Used:**
- Session timeout (60 seconds)
- User explicitly logs out
- Settings changed

**When Not Used:**
- Normal arm/disarm flow
- Configuration requests
- Query operations

### Python Implementation

```python
async def logout(self):
    """Send LOGOUT (optional)"""
    xml = f"""<?xml version="1.0" encoding="utf-8"?>
<Request id="{self.next_id()}" source="{self.source_id}"
         target="{self.panel_serial}" protocolVersion="1.0" type="MENU">
  <act>LOGOUT</act>
  <page>USER</page>
  <par></par>
</Request>"""

    try:
        await asyncio.wait_for(self.send_request(xml), timeout=2.0)
    except asyncio.TimeoutError:
        # Logout timeout is not critical
        pass
    finally:
        self.current_pin = None
```

---

## 10. Configuration Caching

### Current Assumption
Configuration must be loaded for every session.

### Actual Protocol
Configuration is large (XML with all devices, settings, areas) and can be cached.

**Source:** `main.js` lines 724-835, `pag_widget_zone_select_vert.js` uses `xml_file_configuration`

```javascript
// Configuration is stored globally
var xml_file_configuration = null;

// Loaded once from FILE event
function file_eva(type, file64) {
    var file = decodeURIComponent(escape($.base64.atob(file64)));
    $($.parseXML(file)).find("Configuration").each(function() {
        xml_file_configuration = $(this);
    });
    // ... process areas, devices, etc.
}

// Reused throughout session
var cen_id = xml_file_configuration.find("Devices Device")
    .filter(function() {
        if ($(this).children("Subcategory").text() == WS_DEV_ALARM_CEN_STR)
            return true;
    }).attr("id");
```

### Python Implementation

```python
class AVEClient:
    def __init__(self):
        self.config = None  # Cached configuration

    async def initialize(self):
        """Load configuration once"""
        if self.config is None:
            # Request FILE type with CONFIGURATION
            config_xml = await self.request_configuration()
            self.config = self.parse_configuration(config_xml)
            self.cache_config_to_file()  # Optional: persist to disk

    def get_central_unit_id(self):
        """Reuse cached config"""
        for device in self.config['devices']:
            if device['subcategory'] == 'ALA001':  # Central unit
                return device['id']
        return None

    def cache_config_to_file(self):
        """Optional: cache to ~/.ave_alarm/config.xml"""
        with open(self.config_cache_file, 'w') as f:
            f.write(self.config_xml)
```

---

## 11. Exit Delay Display (texit)

### Current Assumption
Area states are simply 0, 1, 2 without additional timing info.

### Actual Protocol
When `st="1"` (arming), area includes `texit` attribute with countdown seconds.

**Source:** `pag_widget_leaf_home.js` lines 223-228

```javascript
area_st_obj.each(function() {
    var st = $(this).attr("st");
    // ...
    if ($(this).attr("texit") < widget_obj.t_exit_min || widget_obj.t_exit_min == null)
        widget_obj.t_exit_min = $(this).attr("texit");
});

// Display countdown
decrease_and_show_t_exit: function() {
    if (this.t_exit_min > 0) {
        $("#t_exit").text(this.t_exit_min).closest(".verAl").show();
        this.t_out_decrease = setTimeout(function() {
            widget_obj.t_exit_min -= 1;
            widget_obj.decrease_and_show_t_exit();
        }, 1000);
    }
}
```

### Example STATE Event

```xml
<?xml version="1.0" encoding="utf-8"?>
<Event type="STATE">
  <Device>AL002</Device>
  <State>S00122</State>  <!-- ARMING -->
  <Areas>
    <Area id="1" st="1" texit="88" />  <!-- Arming with 88 second exit delay -->
    <Area id="2" st="1" texit="88" />
    <Area id="3" st="0" />             <!-- Already disarmed, no texit -->
  </Areas>
</Event>
```

### Python Implementation

```python
def parse_area_state(area_element):
    """Parse area state with exit delay"""
    return {
        'id': int(area_element.get('id')),
        'state': int(area_element.get('st')),
        'exit_delay': int(area_element.get('texit', 0))  # Seconds
    }

async def display_exit_delay(exit_delay_seconds):
    """Show countdown timer"""
    while exit_delay_seconds > 0:
        self.set_display(f"Exit delay: {exit_delay_seconds}s")
        await asyncio.sleep(1)
        exit_delay_seconds -= 1

    self.set_display("Armed")
```

---

## Summary Table: Key Corrections

| Issue | Current | Correct | Impact |
|-------|---------|---------|--------|
| Version handshake | Assumed automatic | Receive version string, validate | High |
| Frame format | Unknown | STX + XML + ETX | Critical |
| Sync ID purpose | Just sequence | Request correlation + routing | High |
| Login type | Might be optional | Must include `<type>TERM_CODE</type>` | Critical |
| Area mask | Unknown format | 6-char string with area numbers | Critical |
| Multiple commands | Single request | Separate ARM & DISARM if needed | Medium |
| ANOM_ACK | Always required | Only if `warning="0"` | Medium |
| PIN caching | Re-enter each time | Cache in `u_p` after LOGIN | Medium |
| LOGOUT | Required | Optional | Low |
| Configuration | Always reload | Cache between sessions | Low |
| Exit delay | Ignored | Parse `texit` and display countdown | Low |

---

## Implementation Priority

### Must Fix (Critical)
1. ✓ Version handshake
2. ✓ Frame format (STX/ETX)
3. ✓ Login type attribute
4. ✓ Area mask encoding
5. ✓ Multiple DEVICE_CMD requests

### Should Fix (High)
6. ✓ PIN caching mechanism
7. ✓ Anomaly handling with ANOM_ACK
8. ✓ Request correlation (id matching)

### Can Defer (Medium)
9. Exit delay display
10. Configuration caching

### Nice to Have (Low)
11. LOGOUT implementation
12. Force arm support

