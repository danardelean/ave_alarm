# JavaScript Code Flow Analysis - Exact Implementation Details

## File References Quick Lookup

| Functionality | File | Lines |
|---------------|------|-------|
| WebSocket init | web_socket.js | 64-150 |
| Frame format | xml.js | 56-85 |
| Request header | xml.js | 31-44 |
| Pairing | main.js | 1354-1365 |
| Message dispatch | main.js | 193-340 |
| Login flow | util_nolang.js | 1340-1489 |
| Anomaly handling | util_nolang.js | 674-739 |
| ARM/DISARM execution | pag_widget_zone_select_vert.js | 266-329 |
| State event handling | pag_widget_leaf_home.js | 160-232 |

---

## Detailed Code Flow: ARM Operation (User-Initiated)

### 1. User Clicks "ON/OFF" Button

**File:** `pag_widget_leaf_home.js` lines 21-32

```javascript
$("#menu_on_off").off("click").click(function() {
    if (!($(this).parent().hasClass("disabled"))) {
        // Important: Clear cached PIN on manual trigger
        if (!QT && !imq_get()) {
            session_u_p = null;      // Clear session PIN
            role_str = "NOROLE";     // Clear role
            uname_str = "";          // Clear username
            session_st_refresh();    // Refresh UI
        }
        // Open login dialog for area selection
        pag_change(".home .JSdialog", "widget_login_small", "zone_select");
    }
}).off("open_ins_force_popup").on("open_ins_force_popup", function() {
    // Force arm dialog
    pag_change(".home .JSdialog", "widget_popwarn", "", "{LANG_INS_DOOR_LOCK_FORCE}", "okab", "#menu_on_off");
}).off("on_pw_ok").on("on_pw_ok", function() {
    // Executed when user confirms anomaly/force dialog
    var cen_id = xml_file_configuration.find("Devices Device")
        .filter(function() {
            if ($(this).children("Subcategory").text() == WS_DEV_ALARM_CEN_STR)
                return true;
        }).attr("id");

    xml_request = xml_request_head_build("DEVICE_CMD");
    xml_par = $(XML("Command"));
    xml_par.text(anoms_obj.command);  // Force arm command from anoms
    xml_request.append(xml_par);

    xml_par = $(XML("Device"));
    xml_par.text(cen_id);
    xml_request.append(xml_par);

    xml_par = $(XML("Arguments"));
    xml_request.append(xml_par);

    xml_node = $(XML("Argument"));
    xml_node.attr("id", "PIN");
    xml_node.text(anoms_obj.login_code);  // Use code from anomalies
    xml_par.append(xml_node);

    xml_node = $(XML("Argument"));
    xml_node.attr("id", "AREAS");
    xml_node.text(anoms_obj.cmd_area);  // Use areas from anomalies
    xml_par.append(xml_node);

    xml_send(xml_request);
    anoms_obj.command = "";  // Reset
});
```

**Result:** `widget_login_small` is loaded with `destination="zone_select"` and data parameter empty

---

### 2. Login Widget Initializes

**File:** `pag_widget_login_small.js` lines 2-107

```javascript
pag_table_new["widget_login_small"] = {
    onload: function() {
        var widget_obj = this;

        // If no cached session, show login
        if (session_u_p == null || this.destination == "scenery_edit") {
            this.header_home_switch();
            this.footer_home_switch();
            away_from_home();
        }

        login_count = 60;  // Countdown to auto-close
        pin = "";          // Clear entered PIN

        // Set login label based on destination
        var tmp_str = login_permission_str_get(this.destination);
        if (tmp_str == "USER")
            tmp_str = "{LANG_INS_PIN_USER}";
        else if (tmp_str == "POWERUSER")
            tmp_str = "{LANG_INS_PIN_POWUSER}";
        // ... more role translations

        $("#login_label").html(tmp_str);

        // Digit buttons
        $(".widget_login_small .keys .key.digit .num").each(function() {
            $(this).siblings(".active_click").data("digit", $(this).text());
        });

        // PIN entry display
        pointGuiList = $(".widget_login_small .pin .point_container div");
        $(".widget_login_small .pin .point_container div:nth-child(n + " + (PINTRENSIZE + 1) + ")").hide();

        // Digit click handling
        $(".widget_login_small .keys .key.digit .active_click").click(function() {
            if (pin.length < PINTRENSIZE) {  // PINTRENSIZE = 6
                pointGuiList.eq(pin.length).addClass("bg_clear");
                pin += $(this).data("digit");
            }
        });

        // Backspace
        $("#pin_cancel .active_click").click(function() {
            if (pin.length > 0) {
                pin = pin.slice(0, pin.length - 1);
                pointGuiList.eq(pin.length).removeClass("bg_clear");
            }
        });

        // Countdown timer
        var risoluzione = (QT ? 5 : 1);
        function decrease_counter() {
            if (login_count > 0) {
                $("#login_counter").text("(" + login_count + ")");
                login_count -= risoluzione;
                login_dec_tout = setTimeout(decrease_counter, risoluzione * 1000);
            } else {
                $("#login_counter").text("");
                // Auto-close dialog after 60 seconds
                $("#header-home-page2 .close").trigger("click");
            }
        }

        // Start countdown if not in settings
        if (!HASH_MODE)
            decrease_counter();

        // Submit button
        var debounce = false;
        $("#login_send .active_click").click(function() {
            if (!debounce && !inhibit) {
                debounce = true;
                setTimeout(function(){debounce = false;}, 2000);
                send_login(widget_obj.destination, $(".widget_login_small").attr("data-par"));
            }
        });

        // If session exists, auto-submit
        if (session_u_p == null || this.destination == "scenery_edit") {
            $(".home .JSdialog").show();
        } else {
            pin = session_u_p;
            send_login(this.destination, $(".widget_login_small").attr("data-par"));
        }
    },

    // ... other methods
}
```

**Key Variables Set:**
- `pin` = User-entered PIN (string)
- `widget_obj.destination` = "zone_select"
- `session_u_p` = Cached PIN (or null for first login)

---

### 3. Send LOGIN Request

**File:** `util_nolang.js` lines 1407-1419

```javascript
function send_login(dest_page, extra) {
    loginType = "";  // Global tracking

    // Build MENU request (not SCENE_CMD, not any other type)
    xml_request = xml_request_head_build("MENU", dest_page == "code_miss" ? null : "widget_login_small");

    // FOR ZONE_SELECT (ARM/DISARM):
    if ((dest_page == "zone_select")) {
        loginType = "TERM_CODE";  // Critical: TERM_CODE for arm/disarm

        xml_par = $(XML("filter"));
        xml_par.text(login_permission_str_get(dest_page));  // Returns "USER|POWERUSER"
        xml_request.append(xml_par);

        xml_par = $(XML("act"));
        xml_par.text("LOGIN");
        xml_request.append(xml_par);

        xml_par = $(XML("page"));
        xml_par.text("USER");
        xml_request.append(xml_par);

        xml_par = $(XML("par"));  // Container for parameters
        xml_request.append(xml_par);

        xml_item = $(XML("code"));
        xml_item.text(pin);  // The 6-digit PIN
        xml_par.append(xml_item);

        xml_item = $(XML("type"));
        xml_item.text(loginType);  // Must be "TERM_CODE"
        xml_par.append(xml_item);

        xml_send(xml_request);  // Send with STX/ETX framing
    }
    // Other destinations (settings, log, etc.) use type="SETTINGS"...
}
```

**Resulting XML Sent:**
```xml
0x02
<?xml version="1.0" encoding="utf-8"?><Request id="widget_login_small" source="1709012345678" target="1234567890" protocolVersion="1.0" type="MENU"><filter>USER|POWERUSER</filter><act>LOGIN</act><page>USER</page><par><code>123456</code><type>TERM_CODE</type></par></Request>
0x03
```

---

### 4. Panel Authenticates PIN

Panel validates the PIN against its user database and either:
- Returns `<res>ACCEPTED</res>` - proceed to area selection
- Returns `<res>REFUSED</res>` - wrong PIN, attempts left
- Returns `<res>INHIBITED</res>` - too many attempts, locked for N seconds
- Returns `<res>PENDING</res>` - requires confirmation (medical/panic approval)

**Panel May Also Send Anomalies Event:**

If tamper/battery/GSM issues exist:
```xml
<?xml version="1.0" encoding="utf-8"?>
<Event type="STATE">
  <Anoms warning="0" flush_area="123456" command="C00101" login_code="123456" cmd_area="123456">
    <Anom id="1">
      <id>AL010</id>
      <State>S10401</State>  <!-- Low battery -->
      <cnt>1</cnt>
      <Timestamp>1709012345678</Timestamp>
      <localdt>2024-02-27-14-05-45-78</localdt>
    </Anom>
  </Anoms>
</Event>
```

**Note:** The Anoms event carries:
- `login_code` - PIN for executing the anomaly recovery
- `command` - The actual command to send (C00101, C00108 for force)
- `cmd_area` - Areas to operate on
- `warning` - If "1", cannot proceed; if "0", can proceed

---

### 5. Handle LOGIN Response

**File:** `pag_widget_login_small.js` lines 109-342

```javascript
pag_table_new["widget_login_small"] = {
    // ... (onload code)

    onrecv_indication: function(indi) {
        if (indi.attr("type") == "MENU") {
            if (indi.children("act").text() == "LOGIN") {
                if (indi.children("page").text() == "USER") {

                    // SUCCESS: User authenticated
                    if ((indi.children("res").text() == "ACCEPTED")
                        || (indi.children("res").text() == "NOTIFY")) {

                        attempt_left = -1;  // Reset attempt counter

                        // Cache PIN if not keyboard input
                        if (!QT && !imq_get())
                            session_u_p = pin;

                        // Extract user info
                        role_str = indi.find("par item role").text();  // "USER" or "POWERUSER"
                        uname_str = indi.find("par item name").text();  // "John Doe"

                        // Destination-specific handling
                        if (this.destination == "zone_select") {
                            u_p = pin;  // Store PIN globally for DEVICE_CMD
                            this.checkpoint_user = true;

                            // Check if anomalies exist and panel didn't resolve them
                            if ((anoms_obj.getSize() > 0) && !(anoms_obj.isWarning())) {
                                // Show anomaly dialog
                                pag_change(".home .JSdialog", "widget_sideanom",
                                    indi.find("par item area_ins").text(),
                                    indi.find("par item area_dis").text(),
                                    indi.find("par item area_grp").text());
                            } else {
                                // Show area selection
                                pag_change(".JSdialog", "widget_zone_select_vert",
                                    indi.find("par item area_ins").text(),      // area_ins
                                    indi.find("par item area_dis").text(),      // area_dis
                                    indi.find("par item area_grp").text());     // area_grp
                            }
                        }
                        // ... other destinations

                        clearTimeout(login_dec_tout);  // Stop countdown
                    }

                    // FAILURE: Wrong PIN
                    else if (indi.children("res").text() == "REFUSED") {
                        $("#login_attempt").html("{LANG_ATTEMPT_LEFT} " + indi.children("desc").text()).show();
                        pin = "";
                        role_str = "NOROLE";
                        uname_str = "";
                        if (!QT)
                            session_u_p = null;
                        $(".widget_login_small .pin .point_container div").removeClass("bg_clear");
                        stopWaitingScr();
                    }

                    // LOCKED OUT: Too many attempts
                    else if (indi.children("res").text() == "INHIBITED") {
                        stopWaitingScr();
                        this.inhibit_mode(indi.children("desc").text());  // N seconds
                    }

                    session_st_refresh();
                }
            }
        }
    }
}
```

**Key Action:** After successful LOGIN with destination="zone_select", the global `u_p` variable is set to the PIN, and the `widget_zone_select_vert` widget is loaded.

---

### 6. Area Selection Widget Initializes

**File:** `pag_widget_zone_select_vert.js` lines 2-187

```javascript
pag_table_new["widget_zone_select_vert"] = {
    onload: function() {
        var widget_obj = this;

        // Get area permissions from login response
        // Constructor: pag_change(".JSdialog", "widget_zone_select_vert", area_ins, area_dis, area_grp)
        this.areas_ins_msk = $(".widget_zone_select_vert").attr("data-area-ins");  // e.g. "123456"
        this.areas_dis_msk = $(".widget_zone_select_vert").attr("data-area-dis");  // e.g. "123456"

        // Initialize area UI elements
        area_list.find("item").each(function() {
            var area_id = $(this).find("id").text();
            var utente_dis = widget_obj.areas_dis_msk.charAt(area_id - 1) != "-";
            var utente_ins = widget_obj.areas_ins_msk.charAt(area_id - 1) != "-";
            var st_attuale = Number(area_st_obj.filter("[id='" + area_id + "']").attr("st")) > 0;
            var enaFlg = $(this).find("ena").text() == "TRUE" ? true : false;

            widget_obj.onoffflg_prev[area_id] = st_attuale && !utente_dis;

            // Determine if area should be ON or OFF in UI
            var trov = false;
            for (var i = 0; i < area_st_obj.length; i++) {
                if (Number(area_st_obj.filter("[id='" + (i + 1) + "']").attr("st")) > 0
                    && widget_obj.areas_dis_msk.charAt(i) != "-") {
                    trov = true;
                    break;
                }
            }
            var onoffflg = ((st_attuale && !utente_dis) || (utente_ins && !trov)) && enaFlg;

            // Create clickable area selector
            $("#zone_select_container").append(
                "<div class='zone_select_item " + (onoffflg ? "on" : "off") +
                (enaFlg ? "" : " unavailableMode1 unavailable") + "' data-id='" +
                area_id + "'>" +
                "  <div class='itembox brb brt brl brr'></div>" +
                "  <div class='icon_wrapper'><div class='icon'><div class='img'></div></div></div>" +
                "  <div class='text_wrapper'>" +
                "    <div class='name'><div class='vname'>" + $(this).children("desc").text() + "</div></div>" +
                "    <div class='condition'><div class='vcondition'>" +
                (onoffflg ? "{LANG_WIDGET_ZONE_SELECT_VERT_INS}" : "{LANG_WIDGET_ZONE_SELECT_VERT_DIS}") +
                "</div></div>" +
                "  </div>" +
                "</div>"
            );
        });

        // Toggle ON/OFF when area is clicked
        $("#zone_select_container .zone_select_item").off("click").click(function() {
            if ($(this).hasClass("off")) {
                $(this)
                    .removeClass("off")
                    .addClass("on")
                    .find(".vcondition")
                    .html("{LANG_WIDGET_ZONE_SELECT_VERT_INS}");
            } else {
                $(this)
                    .removeClass("on")
                    .addClass("off")
                    .find(".vcondition")
                    .html("{LANG_WIDGET_ZONE_SELECT_VERT_DIS}");
            }
            proceed_button_ena();  // Enable/disable OK button
        });

        // OK button handler
        $("#footer_h2_a_a").click(function() {
            if (!$(this).hasClass("disabled")) {
                widget_obj.par_send();  // Send DEVICE_CMD
                $("#header-home-page2 .close").trigger("click");  // Close dialog
            }
        });
    }
}
```

**Data Passed to Widget:**
- `data-area-ins` = "123456" (areas user can arm)
- `data-area-dis` = "123456" (areas user can disarm)
- Current area states from `area_st_obj` global

**User Interaction:**
User clicks areas to toggle ON/OFF, then clicks OK button.

---

### 7. Prepare & Send ARM Command

**File:** `pag_widget_zone_select_vert.js` lines 225-329

When user clicks OK:

```javascript
par_send: function(manual_onoff_flg) {
    // If called from manual toggle (not auto)
    if (!manual_onoff_flg)
        this.par_save();  // Collect which areas user selected

    // Build on_msk and off_msk from selected areas
    var widget_obj = this;
    this.on_msk = "";   // Areas to arm
    this.off_msk = "";  // Areas to disarm

    $("#zone_select_container .zone_select_item").each(function() {
        var area_id = $(this).attr("data-id");
        var utente_ins = widget_obj.areas_ins_msk.charAt(area_id - 1) != "-";

        var onoffflg = $(this).hasClass("on")
                    && utente_ins
                    && !widget_obj.onoffflg_prev[area_id]
                    && !$(this).hasClass("unavailable");

        // If area is ON and user can arm it and it wasn't already armed
        widget_obj.on_msk += (onoffflg ? area_id : "-");
    });

    // For each command type (ARM and DISARM)
    for (var i = 0; i < this.cmd_areas_all.length; i++) {
        var msk = "";

        // Get the appropriate mask for this command
        if (this.cmd_areas_all[i] == WS_DEV_ALARM_CEN_CMD_ON_STR)  // "C00101"
            msk = this.on_msk;    // e.g. "123---"
        else if (this.cmd_areas_all[i] == WS_DEV_ALARM_CEN_CMD_OFF_STR)  // "C00102"
            msk = this.off_msk;   // e.g. "------"

        // Skip if no areas for this command
        if (msk == "" || msk == area_off_all_str)
            continue;

        // Find central unit device ID
        var cen_id = xml_file_configuration.find("Devices Device")
            .filter(function() {
                if ($(this).children("Subcategory").text() == WS_DEV_ALARM_CEN_STR)
                    return true;
            }).attr("id");  // e.g. "2"

        // Build DEVICE_CMD request
        xml_request = xml_request_head_build("DEVICE_CMD");

        xml_par = $(XML("Command"));
        xml_par.text(this.cmd_areas_all[i]);  // "C00101" or "C00102"
        xml_request.append(xml_par);

        xml_par = $(XML("Device"));
        xml_par.text(cen_id);
        xml_request.append(xml_par);

        xml_par = $(XML("Arguments"));
        xml_request.append(xml_par);

        // PIN argument (validated in previous LOGIN)
        xml_node = $(XML("Argument"));
        xml_node.attr("id", "PIN");
        xml_node.text(u_p);  // The PIN from LOGIN
        xml_par.append(xml_node);

        // AREAS argument (mask of areas to arm/disarm)
        xml_node = $(XML("Argument"));
        xml_node.attr("id", "AREAS");
        xml_node.text(msk);  // e.g. "123---"
        xml_par.append(xml_node);

        xml_send(xml_request);
    }

    // Clear PIN after sending
    u_p = "";
}
```

**Multiple DEVICE_CMD Requests Sent:**
If user selected areas 1-3 to arm and areas 4-6 to disarm:
1. First request: Command=C00101, AREAS=123---
2. Second request: Command=C00102, AREAS=---456

**XML Sent (ARM Areas 1-3):**
```xml
0x02
<?xml version="1.0" encoding="utf-8"?><Request id="..." source="..." target="..." protocolVersion="1.0" type="DEVICE_CMD"><Command>C00101</Command><Device>2</Device><Arguments><Argument id="PIN">123456</Argument><Argument id="AREAS">123---</Argument></Arguments></Request>
0x03
```

---

### 8. Panel Processes ARM Command & Sends State Update

Panel validates PIN, confirms area permissions, executes arm sequence:
1. Validate PIN matches authenticated user
2. Check user has permission for selected areas
3. Initiate arming sequence
4. Send STATE event with updated area states

**STATE Event Response (Arming in Progress):**
```xml
<?xml version="1.0" encoding="utf-8"?>
<Event type="STATE">
  <Device>AL002</Device>
  <State>S00122</State>  <!-- ARMING state -->
  <Areas>
    <Area id="1" st="1" texit="88" />  <!-- st=1: arming, texit=exit delay seconds -->
    <Area id="2" st="1" texit="88" />
    <Area id="3" st="1" texit="88" />
    <Area id="4" st="0" />              <!-- st=0: disarmed -->
    <Area id="5" st="0" />
    <Area id="6" st="0" />
  </Areas>
  <Anoms warning="0" flush_area="" />  <!-- No anomalies -->
</Event>
```

---

### 9. Python Client Receives & Handles STATE Update

**File:** `pag_widget_leaf_home.js` lines 164-232

```javascript
pag_table_new["widget_leaf_home"] = {
    // ...

    onrecv_indication: function(indi) {
        if (indi.attr("type") == "STATE") {
            if (indi.find("State").text() == WS_DEV_ALARM_CEN_STATE_ON_STR      // "S00120"
                || indi.find("State").text() == WS_DEV_ALARM_CEN_STATE_OFF_STR   // "S00121"
                || indi.find("State").text() == WS_DEV_ALARM_CEN_STATE_PART_STR  // "S00122"
                || indi.find("State").text() == WS_DEV_ALARM_CEN_STATE_ALARM_STR // "S00127"
            ) {
                session_st_refresh();  // Update session display

                // Check if disarmed
                if (indi.find("State").text() === WS_DEV_ALARM_CEN_STATE_OFF_STR) {
                    area_dis_flg = true;
                    this.unlock_settings();
                } else {
                    area_dis_flg = false;
                    this.lock_settings();
                }

                stdby_out();  // End standby mode

                // Find areas in this state event
                var aree_pattern = indi.children("Device").filter(function() {
                    var res = false;
                    if ($(this).text() == pag_table_new["widget_leaf_home"].area_reference)
                        res = true;
                    return res;
                });

                if (aree_pattern.length > 0) {
                    var widget_obj = this;

                    // Update global area states
                    var status_area = indi.children("State").text();
                    status_area_global = status_area;
                    this.change_icon_area_status(status_area);

                    // Clear previous timeouts
                    for (var i = 0; i < this.t_out_area.length; i++)
                        clearTimeout(this.t_out_area[i]);
                    this.t_out_area = [];
                    this.t_exit_min = null;

                    // Store area states for later reference
                    area_st_obj = indi.find("Areas Area");

                    // Update each area in footer
                    area_st_obj.each(function() {
                        var st = $(this).attr("st");
                        if (imq_get()) {
                            // In-motion query mode: hide state
                            if (!(indi.find("State").text() === WS_DEV_ALARM_CEN_STATE_OFF_STR))
                                st = "unknown";
                        }

                        // Update area display in footer
                        $("#footer_area_b, #footer_area_bh")
                            .find("div[data-id = '" + $(this).attr("id") + "']")
                            .attr("class", "area_item area_" + $(this).attr("id") +
                                  "_stato_" + st + " unavailableMode1")
                            .addClass(area_ena_check($(this).attr("id")) ? "" : "unavailable");

                        // Track minimum exit delay
                        if ($(this).attr("texit") < widget_obj.t_exit_min
                            || widget_obj.t_exit_min == null)
                            widget_obj.t_exit_min = $(this).attr("texit");
                    });

                    // Start exit delay countdown if arming
                    clearTimeout(this.t_out_decrease);
                    this.t_exit_min = this.t_exit_min || 0;
                    this.decrease_and_show_t_exit();
                }
            }
        }
    }
}
```

**Exit Delay Countdown:**
```javascript
decrease_and_show_t_exit: function() {
    var widget_obj = this;
    clearTimeout(this.t_out_decrease);

    if (this.t_exit_min > 0) {
        // Show exit delay counter
        $("#t_exit").text(this.t_exit_min).closest(".verAl").show();

        // Decrement every second
        this.t_out_decrease = setTimeout(function() {
            widget_obj.t_exit_min -= 1;
            widget_obj.decrease_and_show_t_exit();
        }, QT ? 950 : 1000);
    } else {
        $("#t_exit").closest(".verAl").hide();
        clearTimeout(this.t_out_decrease);
    }
}
```

---

## Anomaly Recovery Path (Force Arm)

If panel detects anomalies that prevent normal arming:

### 1. Panel Sends Anomalies with Command

```xml
<?xml version="1.0" encoding="utf-8"?>
<Event type="STATE">
  <Anoms warning="0" flush_area="123456" command="C00108" login_code="123456" cmd_area="123456">
    <Anom id="1">
      <id>AL010</id>
      <State>S10401</State>  <!-- Low battery -->
      <cnt>1</cnt>
      <Timestamp>1709012345678</Timestamp>
      <localdt>2024-02-27-14-05-45-78</localdt>
    </Anom>
  </Anoms>
</Event>
```

**Key Fields:**
- `command="C00108"` - FORCE ARM command
- `login_code="123456"` - PIN for executing force arm
- `cmd_area="123456"` - Areas to force arm
- `warning="0"` - Can proceed (warning="1" means cannot proceed)

### 2. Application Shows Anomaly Dialog

**File:** `main.js` lines 630-651

```javascript
if (indi.children("Anoms").length > 0) {
    if (xml_file_configuration != null) {
        anoms_obj.init(indi);  // Parse anomalies
        if ("widget_leaf_home" in pag_table_new)
            pag_table_new["widget_leaf_home"].refresh_notify_icon();

        if (anoms_obj.command == WS_DEV_ALARM_CEN_CMD_ON_FORCED_STR) {  // "C00108"
            if (imq_get())
                pag_change(".home .JSdialog", "widget_sideanom", "", "", "");
            else
                $("#menu_on_off").trigger("open_ins_force_popup");
        }
    }
}
```

### 3. User Confirms Force Arm

**File:** `pag_widget_leaf_home.js` lines 34-54

```javascript
.off("open_ins_force_popup").on("open_ins_force_popup", function() {
    // Show confirmation dialog
    pag_change(".home .JSdialog", "widget_popwarn", "",
        "{LANG_INS_DOOR_LOCK_FORCE}", "okab", "#menu_on_off");
})
.off("on_pw_ok").on("on_pw_ok", function() {
    // User confirmed force arm
    var cen_id = xml_file_configuration.find("Devices Device")
        .filter(function() {
            if ($(this).children("Subcategory").text() == WS_DEV_ALARM_CEN_STR)
                return true;
        }).attr("id");

    // Send FORCE ARM command with anomaly-provided PIN & areas
    xml_request = xml_request_head_build("DEVICE_CMD");
    xml_par = $(XML("Command"));
    xml_par.text(anoms_obj.command);  // "C00108"
    xml_request.append(xml_par);

    xml_par = $(XML("Device"));
    xml_par.text(cen_id);
    xml_request.append(xml_par);

    xml_par = $(XML("Arguments"));
    xml_request.append(xml_par);

    xml_node = $(XML("Argument"));
    xml_node.attr("id", "PIN");
    xml_node.text(anoms_obj.login_code);  // PIN from anomalies
    xml_par.append(xml_node);

    xml_node = $(XML("Argument"));
    xml_node.attr("id", "AREAS");
    xml_node.text(anoms_obj.cmd_area);  // Areas from anomalies
    xml_par.append(xml_node);

    xml_send(xml_request);
    anoms_obj.command = "";  // Reset
});
```

**FORCE ARM Command XML:**
```xml
<?xml version="1.0" encoding="utf-8"?>
<Request id="..." source="..." target="..." protocolVersion="1.0" type="DEVICE_CMD">
  <Command>C00108</Command>  <!-- Force arm -->
  <Device>2</Device>
  <Arguments>
    <Argument id="PIN">123456</Argument>      <!-- From anomaly event -->
    <Argument id="AREAS">123456</Argument>    <!-- From anomaly event -->
  </Arguments>
</Request>
```

---

## Error Handling Patterns

### Login Failures

```javascript
else if (indi.children("res").text() == "REFUSED") {
    // PIN was wrong
    attempt_left = Number(indi.children("desc").text());  // 2, 1, 0 remaining

    // Show remaining attempts
    $("#login_attempt").html("{LANG_ATTEMPT_LEFT} " + indi.children("desc").text()).show();

    // Clear entered PIN
    pin = "";
    role_str = "NOROLE";
    uname_str = "";
    if (!QT)
        session_u_p = null;

    // Clear point display
    $(".widget_login_small .pin .point_container div").removeClass("bg_clear");

    stopWaitingScr();  // Hide loading spinner
}
```

### Account Lockout

```javascript
else if (indi.children("res").text() == "INHIBITED") {
    stopWaitingScr();

    // Show lockout timer
    this.inhibit_mode(indi.children("desc").text());  // N seconds

    // Auto-close after lockout expires
    login_tout = setTimeout(function() {
        $("#header-home-page2 .close").trigger("click");
    }, inhibit_time * 1000);
}
```

### Unauthorized Areas

If user tries to arm areas they don't have permission for:
- Area will not toggle in UI (checked in onoffflg logic)
- Cannot be included in on_msk/off_msk
- No request sent to panel

---

## Summary: Complete Request/Response Flow

```
USER ACTION: Click ON/OFF button
    ↓
CLEAR SESSION: session_u_p = null
    ↓
LOAD LOGIN WIDGET: destination="zone_select"
    ↓
USER ENTERS PIN: pin = "123456"
    ↓
USER CLICKS SUBMIT
    ↓
SEND LOGIN REQUEST
  type="MENU"
  act="LOGIN"
  page="USER"
  code="123456"
  type="TERM_CODE"
  filter="USER|POWERUSER"
    ↓
RECEIVE LOGIN RESPONSE
  res="ACCEPTED" → SUCCESS
  res="REFUSED" → Show attempts left
  res="INHIBITED" → Lock N seconds
    ↓
IF ANOMALIES EXIST:
  RECEIVE ANOMS EVENT
  anoms_obj.init(anoms_xml)
  IF warning="0": Show anomaly dialog
  IF warning="1": Block arming
    ↓
LOAD AREA SELECTION WIDGET
  Initialize UI with selected areas
  Store PIN globally: u_p = pin
    ↓
USER SELECTS AREAS
  Click to toggle ON/OFF
    ↓
USER CLICKS OK
    ↓
SEND DEVICE_CMD REQUEST(S)
  Command="C00101" (ARM) or "C00102" (DISARM)
  Device="2" (central unit)
  PIN=u_p (the validated PIN)
  AREAS="123---" (user selection)
    ↓
RECEIVE STATE EVENT
  State="S00122" (ARMING)
  Area[id="1"] st="1" texit="88"
    ↓
SHOW EXIT DELAY COUNTDOWN
  Decrement texit every second
    ↓
RECEIVE FINAL STATE EVENT
  State="S00120" (ARMED)
  Area[id="1"] st="2"
    ↓
UPDATE UI & CLOSE DIALOGS
```

---

## Critical JavaScript Global Variables

| Variable | Scope | Purpose | Example |
|----------|-------|---------|---------|
| `xml_my_sn` | Global | Client source ID (milli-epoch) | 1709012345678 |
| `xml_cen_sn` | Global | Panel target serial | "1234567890" |
| `session_u_p` | Global | Cached PIN (session-level) | "123456" or null |
| `u_p` | Global | Current PIN (operation-level) | "123456" |
| `pin` | Global | User-entered PIN during login | "123456" |
| `role_str` | Global | Authenticated user role | "USER", "POWERUSER", "NOROLE" |
| `uname_str` | Global | Authenticated username | "John Doe" |
| `area_st_obj` | Global | Current area states (jQuery) | `<Area id="1" st="0" />` |
| `status_area_global` | Global | Global panel status | "S00121" (disarmed) |
| `anoms_obj` | Global | Anomaly data | See anoms_obj structure |
| `xml_file_configuration` | Global | Configuration XML | Entire panel config |
| `pag_table_new` | Global | Widget dispatch table | `{widget_name: {onload, onrecv_...}}` |
| `area_list` | Global | Areas from configuration | jQuery array |

---

## Protocol Version Details

**From web_socket.js line 102:**
```javascript
if (SIMUL || (String.fromCharCode.apply(null, new Uint8Array(e.data)) == "<?php echo SW_VER_STR; ?>"))
```

The panel sends raw version string. For testing, the version must match exactly:
- Development: Check panel's actual version via web interface
- Typical format: Something like "AF927v1.0.0" or similar

Mismatch causes page reload (line 110): `window.location.replace("");`

