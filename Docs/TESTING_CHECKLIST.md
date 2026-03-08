# Protocol Testing Checklist

Use this checklist to verify that the Python implementation matches the exact JavaScript protocol behavior.

---

## Connection & Initialization Tests

### Test 1.1: WebSocket Connection
- [ ] Client connects to `ws://192.168.1.11:14001/`
- [ ] Binary type set to `arraybuffer`
- [ ] No data sent immediately

**Expected Behavior:**
```
CLIENT: WebSocket connects
PANEL: Sends raw version string (not XML)
PANEL: Example: "AF927v1.0.0\x00" or similar
```

**How to Test:**
```python
async def test_version_handshake():
    async with websockets.connect("ws://192.168.1.11:14001/") as ws:
        # Don't send anything
        version = await ws.recv()
        assert isinstance(version, bytes) or isinstance(version, str)
        print(f"Received version: {version}")
        # Should NOT be XML
        assert not version.startswith(b'<?xml')
```

---

### Test 1.2: Version Validation
- [ ] Version string matches panel exactly
- [ ] No request sent if version mismatch
- [ ] Disconnect and reconnect on mismatch

**Expected Behavior:**
```
CLIENT checks: version == EXPECTED_VERSION (byte-for-byte match)
IF match: Proceed to PAIRING
IF mismatch: Disconnect, log error, do NOT send any requests
```

---

## Frame Format Tests

### Test 2.1: Outgoing Frame Format
- [ ] Every message wrapped with STX (0x02) prefix
- [ ] Every message wrapped with ETX (0x03) suffix
- [ ] XML declaration present between STX and ETX

**Expected Bytes:**
```
0x02
<?xml version="1.0" encoding="utf-8"?><Request...>...</Request>
0x03
```

**How to Test:**
```python
async def test_frame_format():
    async with websockets.connect("ws://192.168.1.11:14001/") as ws:
        # Receive version
        version = await ws.recv()

        # Send PAIRING with correct framing
        pairing_xml = build_pairing_request()
        framed = b'\x02' + pairing_xml.encode('utf-8') + b'\x03'

        ws.send(framed)

        # Verify bytes
        assert framed[0] == 0x02
        assert framed[-1] == 0x03
        assert b'<?xml' in framed
```

---

### Test 2.2: Incoming Frame Format
- [ ] Received messages have STX prefix
- [ ] Received messages have ETX suffix
- [ ] Content properly decoded after stripping framing

**Expected Behavior:**
```python
raw_bytes = await ws.recv()
assert raw_bytes[0] == 0x02
assert raw_bytes[-1] == 0x03
xml_string = raw_bytes[1:-1].decode('utf-8')
assert xml_string.startswith('<?xml')
```

---

## Pairing & Configuration Tests

### Test 3.1: Pairing Request
- [ ] Request type="PAIRING"
- [ ] Contains `<Authentication username="host" password="00000"/>`
- [ ] Has valid id, source, target attributes

**Expected XML:**
```xml
<?xml version="1.0" encoding="utf-8"?>
<Request id="..." source="..." target="1234567890"
         protocolVersion="1.0" type="PAIRING">
  <Authentication username="host" password="00000"/>
</Request>
```

---

### Test 3.2: Configuration Request
- [ ] After pairing, panel sends FILE type event
- [ ] Configuration is base64-encoded
- [ ] Decode to get XML with all devices, areas, users

**Expected Event:**
```xml
<?xml version="1.0" encoding="utf-8"?>
<Event type="FILE">
  <File>[base64-encoded-configuration-xml]</File>
</Event>
```

---

## Login Tests (PIN Authentication)

### Test 4.1: Login Request Structure
- [ ] type="MENU"
- [ ] `<act>LOGIN</act>`
- [ ] `<page>USER</page>`
- [ ] Contains `<filter>` attribute
- [ ] Contains `<par>` with `<code>` and `<type>`

**For ARM/DISARM (destination=zone_select):**
```xml
<?xml version="1.0" encoding="utf-8"?>
<Request id="widget_login_small" source="..." target="..."
         protocolVersion="1.0" type="MENU">
  <filter>USER|POWERUSER</filter>
  <act>LOGIN</act>
  <page>USER</page>
  <par>
    <code>123456</code>
    <type>TERM_CODE</type>
  </par>
</Request>
```

**For SETTINGS (destination=settings):**
```xml
<?xml version="1.0" encoding="utf-8"?>
<Request id="widget_login_small" source="..." target="..."
         protocolVersion="1.0" type="MENU">
  <filter>POWERUSER|INST</filter>
  <act>LOGIN</act>
  <page>USER</page>
  <par>
    <code>654321</code>
    <type>SETTINGS</type>
  </par>
</Request>
```

---

### Test 4.2: Login Response Success
- [ ] Response id matches request id
- [ ] Contains `<res>ACCEPTED</res>` for successful PIN
- [ ] Contains `<par>` with user info
- [ ] User info includes `area_ins` and `area_dis` masks

**Expected Response:**
```xml
<?xml version="1.0" encoding="utf-8"?>
<Response id="widget_login_small" source="1234567890"
          target="..." protocolVersion="1.0" type="MENU">
  <act>LOGIN</act>
  <page>USER</page>
  <res>ACCEPTED</res>
  <desc>0</desc>
  <par>
    <item id="1">
      <role>USER</role>
      <name>John Doe</name>
      <area_ins>123456</area_ins>
      <area_dis>123456</area_dis>
      <area_grp>------</area_grp>
      <imq>0</imq>
    </item>
  </par>
</Response>
```

**How to Test:**
```python
async def test_login_success():
    client = AVEClient()
    response = await client.send_login("zone_select", "123456")
    assert response['result'] == 'ACCEPTED'
    assert 'area_ins' in response['par']
    assert response['par']['area_ins'] == "123456"
    print(f"Login successful for user: {response['par']['name']}")
```

---

### Test 4.3: Login Response Failure
- [ ] Contains `<res>REFUSED</res>` for wrong PIN
- [ ] Contains `<desc>` with attempts remaining

**Expected Response (Wrong PIN):**
```xml
<?xml version="1.0" encoding="utf-8"?>
<Response id="widget_login_small" source="1234567890" ...>
  <act>LOGIN</act>
  <page>USER</page>
  <res>REFUSED</res>
  <desc>2</desc>  <!-- 2 attempts remaining -->
</Response>
```

---

### Test 4.4: Login Response Lockout
- [ ] Contains `<res>INHIBITED</res>` after too many failures
- [ ] Contains `<desc>` with lockout duration in seconds

**Expected Response (Locked Out):**
```xml
<?xml version="1.0" encoding="utf-8"?>
<Response id="widget_login_small" source="1234567890" ...>
  <act>LOGIN</act>
  <page>USER</page>
  <res>INHIBITED</res>
  <desc>300</desc>  <!-- Locked for 300 seconds -->
</Response>
```

---

## Anomaly Tests (Optional)

### Test 5.1: Anomaly Event Reception
- [ ] After LOGIN, panel may send STATE event with Anoms
- [ ] Contains `<Anoms>` element with attributes
- [ ] `warning="0"` = recoverable, `warning="1"` = blocking

**Expected Event (Recoverable Anomalies):**
```xml
<?xml version="1.0" encoding="utf-8"?>
<Event type="STATE">
  <Anoms warning="0" flush_area="123456" command="C00101"
         login_code="123456" cmd_area="123456">
    <Anom id="1">
      <id>AL010</id>
      <State>S10401</State>
      <cnt>1</cnt>
      <Timestamp>1709012345678</Timestamp>
      <localdt>2024-02-27-14-05-45-78</localdt>
    </Anom>
  </Anoms>
</Event>
```

---

### Test 5.2: ANOM_ACK Sending
- [ ] When `warning="0"`, send ANOM_ACK
- [ ] ANOM_ACK type="STATE" with `<type>ANOM_ACK</type>`
- [ ] Include `<value>` with flush_area mask

**Expected ANOM_ACK:**
```xml
<?xml version="1.0" encoding="utf-8"?>
<Request id="..." source="..." target="..."
         protocolVersion="1.0" type="STATE">
  <type>ANOM_ACK</type>
  <value>123456</value>  <!-- flush_area from Anoms element -->
</Request>
```

---

## Area Selection & Masking Tests

### Test 6.1: Area Mask Encoding
- [ ] 6-character string where position = area number
- [ ] Character is area ID (1-6) if included, '-' if excluded
- [ ] Total length always 6

**Valid Masks:**
- `"123456"` → All areas
- `"123---"` → Areas 1, 2, 3
- `"---456"` → Areas 4, 5, 6
- `"1-3-5-"` → Areas 1, 3, 5
- `"------"` → No areas

**Invalid Masks:**
- `"12345"` → Too short (5 chars)
- `"1234567"` → Too long (7 chars)
- `"A23456"` → Invalid character
- `"1234-6"` → Position 4 should be '4' or '-', not both

**How to Test:**
```python
def test_area_mask_validation():
    valid_masks = ["123456", "123---", "---456", "1-3-5-"]
    invalid_masks = ["12345", "A23456", "1234-6"]

    for mask in valid_masks:
        assert validate_area_mask(mask), f"Should accept {mask}"

    for mask in invalid_masks:
        assert not validate_area_mask(mask), f"Should reject {mask}"
```

---

## ARM/DISARM Command Tests

### Test 7.1: Simple ARM Command
- [ ] User selects areas 1-3 to arm
- [ ] No areas to disarm
- [ ] Send single DEVICE_CMD with C00101

**Expected Command:**
```xml
<?xml version="1.0" encoding="utf-8"?>
<Request id="..." source="..." target="..."
         protocolVersion="1.0" type="DEVICE_CMD">
  <Command>C00101</Command>
  <Device>2</Device>  <!-- Central unit ID -->
  <Arguments>
    <Argument id="PIN">123456</Argument>
    <Argument id="AREAS">123---</Argument>
  </Arguments>
</Request>
```

**How to Test:**
```python
async def test_simple_arm():
    client = AVEClient()
    # Login first
    await client.login("zone_select", "123456")

    # Send ARM command
    areas = [1, 2, 3]
    await client.send_device_cmd(
        command="C00101",
        areas=encode_area_mask(areas),
        pin=client.current_pin
    )

    # Receive STATE event
    state = await client.receive_state_event()
    assert state['global_state'] == "S00122"  # ARMING
```

---

### Test 7.2: Multiple Commands (ARM + DISARM)
- [ ] User selects areas 1-3 to arm, 4-6 to disarm
- [ ] Send TWO separate DEVICE_CMD requests
- [ ] First command: C00101 with areas="123---"
- [ ] Second command: C00102 with areas="---456"

**Expected Commands:**
```xml
<!-- Command 1: ARM -->
<?xml version="1.0" encoding="utf-8"?>
<Request id="..." source="..." target="..."
         protocolVersion="1.0" type="DEVICE_CMD">
  <Command>C00101</Command>
  <Device>2</Device>
  <Arguments>
    <Argument id="PIN">123456</Argument>
    <Argument id="AREAS">123---</Argument>
  </Arguments>
</Request>

<!-- Command 2: DISARM -->
<?xml version="1.0" encoding="utf-8"?>
<Request id="..." source="..." target="..."
         protocolVersion="1.0" type="DEVICE_CMD">
  <Command>C00102</Command>
  <Device>2</Device>
  <Arguments>
    <Argument id="PIN">123456</Argument>
    <Argument id="AREAS">---456</Argument>
  </Arguments>
</Request>
```

**How to Test:**
```python
async def test_mixed_arm_disarm():
    client = AVEClient()
    await client.login("zone_select", "123456")

    # Mixed selection
    await client.send_mixed_commands(
        areas_to_arm=[1, 2, 3],
        areas_to_disarm=[4, 5, 6],
        pin=client.current_pin
    )

    # Should send 2 separate requests
```

---

### Test 7.3: PIN Clearing After Command
- [ ] PIN cached in global variable after LOGIN
- [ ] Used in DEVICE_CMD
- [ ] Cleared after command sent

**How to Test:**
```python
async def test_pin_clearing():
    client = AVEClient()
    assert client.current_pin is None

    await client.login("zone_select", "123456")
    assert client.current_pin == "123456"

    await client.send_device_cmd("C00101", "123---", client.current_pin)
    # Note: current_pin should be cleared after (but could remain for retry scenarios)

    # For next operation, need to login again
    assert client.current_pin is not None or needs_new_login
```

---

## State Event Tests

### Test 8.1: STATE Event - Arming in Progress
- [ ] Global state="S00122" (ARMING)
- [ ] Individual areas have st="1" with texit attribute
- [ ] texit = exit delay in seconds

**Expected Event:**
```xml
<?xml version="1.0" encoding="utf-8"?>
<Event type="STATE">
  <Device>AL002</Device>
  <State>S00122</State>  <!-- ARMING -->
  <Areas>
    <Area id="1" st="1" texit="88" />  <!-- 88 second exit delay -->
    <Area id="2" st="1" texit="88" />
    <Area id="3" st="1" texit="88" />
    <Area id="4" st="0" />
    <Area id="5" st="0" />
    <Area id="6" st="0" />
  </Areas>
</Event>
```

---

### Test 8.2: STATE Event - Armed
- [ ] Global state="S00120" (ARMED)
- [ ] Individual areas have st="2"
- [ ] No texit attribute

**Expected Event:**
```xml
<?xml version="1.0" encoding="utf-8"?>
<Event type="STATE">
  <Device>AL002</Device>
  <State>S00120</State>  <!-- ARMED -->
  <Areas>
    <Area id="1" st="2" />
    <Area id="2" st="2" />
    <Area id="3" st="2" />
    <Area id="4" st="0" />
    <Area id="5" st="0" />
    <Area id="6" st="0" />
  </Areas>
</Event>
```

---

### Test 8.3: STATE Event - Disarmed
- [ ] Global state="S00121" (DISARMED)
- [ ] All areas have st="0"

**Expected Event:**
```xml
<?xml version="1.0" encoding="utf-8"?>
<Event type="STATE">
  <Device>AL002</Device>
  <State>S00121</State>  <!-- DISARMED -->
  <Areas>
    <Area id="1" st="0" />
    <Area id="2" st="0" />
    <Area id="3" st="0" />
    <Area id="4" st="0" />
    <Area id="5" st="0" />
    <Area id="6" st="0" />
  </Areas>
</Event>
```

---

### Test 8.4: Exit Delay Countdown
- [ ] When texit > 0, countdown display
- [ ] Decrement every second
- [ ] Hide when texit reaches 0

**How to Test:**
```python
async def test_exit_delay():
    client = AVEClient()
    # ... send arm command ...

    # Receive arming state
    state = await client.receive_state_event()
    exit_delay = state['areas'][0]['exit_delay']
    assert exit_delay > 0

    # Countdown should happen in UI
    # Next state events should have decremented texit values
    await asyncio.sleep(2)  # Wait 2 seconds
    state2 = await client.receive_state_event()
    assert state2['areas'][0]['exit_delay'] < exit_delay
```

---

## Error Handling Tests

### Test 9.1: Wrong PIN Handling
- [ ] Pin field cleared
- [ ] Attempt counter shown
- [ ] User can retry

**Validation:**
```python
async def test_wrong_pin():
    client = AVEClient()
    response = await client.send_login("zone_select", "000000")
    assert response['result'] == 'REFUSED'
    assert 'attempts_left' in response
    assert response['attempts_left'] > 0
```

---

### Test 9.2: Lockout Handling
- [ ] After 3 wrong attempts (or less), account locked
- [ ] Lockout duration provided
- [ ] User cannot login until timeout expires

**Validation:**
```python
async def test_lockout():
    client = AVEClient()

    # Try wrong PIN 3+ times
    for i in range(3):
        response = await client.send_login("zone_select", "000000")
        if response['result'] == 'INHIBITED':
            lockout_duration = response['lockout_seconds']
            assert lockout_duration > 0
            print(f"Locked for {lockout_duration} seconds")
            break
```

---

## Boundary Tests

### Test 10.1: Area Boundary Cases
- [ ] Area ID 0 (invalid) - should not be accepted
- [ ] Area ID 7 (beyond 6) - should not be accepted
- [ ] Area ID 1 (minimum valid) - should work
- [ ] Area ID 6 (maximum valid) - should work

### Test 10.2: PIN Length
- [ ] PIN < 6 digits - should not allow submission
- [ ] PIN = 6 digits - should allow
- [ ] PIN > 6 digits - should truncate or reject

### Test 10.3: Message Size
- [ ] Large configuration XML (potentially several MB) - should handle
- [ ] Multiple STATE events in quick succession - should queue

---

## Integration Tests

### Test 11.1: Complete ARM Flow
```python
async def test_complete_arm_flow():
    client = AVEClient()

    # 1. Initialize
    await client.connect()
    version = await client.verify_version()
    assert version == "expected_version"

    # 2. Pairing
    await client.send_pairing()
    config = await client.receive_configuration()
    assert config is not None

    # 3. Login
    login_resp = await client.send_login("zone_select", "123456")
    assert login_resp['result'] == 'ACCEPTED'

    # 4. Handle anomalies (if any)
    try:
        anoms = await asyncio.wait_for(client.receive_anomalies(), timeout=2.0)
        if anoms and anoms['warning'] == '0':
            await client.send_anom_ack(anoms['flush_area'])
    except asyncio.TimeoutError:
        pass  # No anomalies

    # 5. Send ARM command
    await client.send_device_cmd("C00101", "123---", client.current_pin)

    # 6. Receive state updates
    state = await client.receive_state_event()
    assert state['global_state'] == "S00122"  # ARMING

    # 7. Wait for armed
    state = await client.receive_state_event()
    assert state['global_state'] == "S00120"  # ARMED

    print("ARM successful!")
```

---

### Test 11.2: Complete DISARM Flow
```python
async def test_complete_disarm_flow():
    # Similar to ARM but with C00102 instead of C00101
    # Expected final state: S00121 (DISARMED)
```

---

## Wireshark/Network Analysis Tests

### Test 12.1: Raw Bytes Verification
- [ ] Capture WebSocket traffic with Wireshark
- [ ] Verify STX (0x02) at start of each frame
- [ ] Verify ETX (0x03) at end of each frame
- [ ] Check XML declaration present

**Command Line Verification:**
```bash
# Hexdump of captured frame should show:
# 02 3c 3f 78 6d 6c ... 2f 3e 03
#  ^  ^ (XML)           ^  ^ (ETX)
# STX
```

---

### Test 12.2: Character Encoding
- [ ] All XML properly UTF-8 encoded
- [ ] Special characters (accents, etc.) handled correctly
- [ ] Non-ASCII in responses decoded properly

---

## Stress & Performance Tests

### Test 13.1: Rapid Arm/Disarm
- [ ] Send multiple ARM/DISARM in sequence
- [ ] Verify PIN caching works
- [ ] State events arrive in order

### Test 13.2: Large Configuration
- [ ] Request large configuration (50+ devices)
- [ ] Parse and cache correctly
- [ ] Reuse configuration in subsequent operations

---

## Final Verification Checklist

- [ ] All frame messages have STX/ETX
- [ ] Version handshake works
- [ ] PIN validation works (right PIN, wrong PIN, lockout)
- [ ] Area masks formatted correctly
- [ ] Multiple DEVICE_CMD when mixed selection
- [ ] Single DEVICE_CMD when single command
- [ ] State events properly parsed
- [ ] texit countdown displayed
- [ ] Anomalies handled correctly
- [ ] PIN caching works
- [ ] PIN cleared after operation
- [ ] Exit delay shows and counts down
- [ ] All error cases handled
- [ ] Configuration cached and reused

**When all tests pass, the implementation is protocol-compliant with the official JavaScript client.**

