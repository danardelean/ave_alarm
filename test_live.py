#!/usr/bin/env python3
"""Standalone live test against the AVE AF927 alarm panel.

Tests the full protocol without Home Assistant:
  1. WebSocket connect + version handshake
  2. PAIRING (configuration arrives here)
  3. Listen for STATE events (battery, GSM, power, WiFi, cloud, areas)
  4. LOGIN (TERM_CODE) + LOGOUT

Usage:
    python3 test_live.py
"""
import asyncio
import sys
import os
import time

# ── Module loading (avoids __init__.py which imports homeassistant) ──

_pkg_dir = os.path.join(os.path.dirname(__file__), "custom_components", "ave_alarm")
sys.path.insert(0, _pkg_dir)
import types, importlib.util

_pkg = types.ModuleType("ave_alarm")
_pkg.__path__ = [_pkg_dir]
_pkg.__package__ = "ave_alarm"
sys.modules["ave_alarm"] = _pkg

def _load(name):
    spec = importlib.util.spec_from_file_location(
        f"ave_alarm.{name}", os.path.join(_pkg_dir, f"{name}.py"),
        submodule_search_locations=[],
    )
    mod = importlib.util.module_from_spec(spec)
    mod.__package__ = "ave_alarm"
    sys.modules[f"ave_alarm.{name}"] = mod
    spec.loader.exec_module(mod)
    return mod

_const = _load("const")
_protocol = _load("protocol")
_parsers = _load("parsers")

from ave_alarm.protocol import (
    build_file_config_body, build_login_body, build_logout_body,
    build_pairing_body, build_request, build_state_body,
    encode_area_mask, frame, generate_source_sn, to_xml_str,
)
from ave_alarm.parsers import PanelState, parse_file_response, parse_state_event, parse_xml

import websockets

# ── Configuration ──────────────────────────────────────────────────

HOST = "192.168.1.11"
PORT = 14001
TARGET_SN = "1234567890"
PIN = "201220"

# ── Colours ────────────────────────────────────────────────────────

G = "\033[92m"; R = "\033[91m"; Y = "\033[93m"; C = "\033[96m"; D = "\033[90m"; B = "\033[1m"; X = "\033[0m"
def ok(m):   print(f"  {G}✓{X} {m}")
def fail(m): print(f"  {R}✗{X} {m}")
def info(m): print(f"  {C}ℹ{X} {m}")
def warn(m): print(f"  {Y}⚠{X} {m}")
def heading(m): print(f"\n{B}{m}{X}")

# ── Helpers ────────────────────────────────────────────────────────

_msg_counter = 0
def next_id():
    global _msg_counter; _msg_counter += 1
    return f"{_msg_counter:02d}"

async def send(ws, src, rtype, body, mid=None):
    mid = mid or "00"
    xml = build_request(src, TARGET_SN, rtype, body, mid)
    print(f"  {D}TX [{rtype}] id={mid}{X}")
    await ws.send(frame(xml))
    return mid

def route_message(raw, state):
    """Parse a raw WS message and route to parsers. Returns (root, updated)."""
    xml_str = to_xml_str(raw)
    if not xml_str:
        return None, False

    root = parse_xml(xml_str)
    if root is None:
        return None, False

    tag = root.tag
    msg_type = root.get("type", "")
    source = root.get("source", "")

    if source and source != state.panel_serial and len(source) > 10:
        state.panel_serial = source

    updated = False
    if tag == "Event" and msg_type == "STATE":
        updated = parse_state_event(root, state)
    elif tag == "Response" and msg_type in ("FILE", "PAIRING"):
        updated = parse_file_response(root, state)
    elif tag == "Event" and msg_type == "FILE":
        updated = parse_file_response(root, state)

    return root, updated

# ── Main test ──────────────────────────────────────────────────────

async def run_test():
    results = {"pass": 0, "fail": 0}

    def check(cond, pass_msg, fail_msg):
        if cond:
            ok(pass_msg); results["pass"] += 1
        else:
            fail(fail_msg); results["fail"] += 1

    source_sn = generate_source_sn()
    state = PanelState()

    # ── Step 1: Connect ────────────────────────────────────────
    heading("Step 1: WebSocket Connect")
    ws_url = f"ws://{HOST}:{PORT}/"
    info(f"Connecting to {ws_url}")
    try:
        ws = await websockets.connect(ws_url, ping_interval=None, ping_timeout=None, close_timeout=5)
        ok("Connected")
    except Exception as e:
        fail(f"Connection failed: {e}")
        return results

    try:
        # ── Step 2: Version handshake ──────────────────────────
        heading("Step 2: Version Handshake")
        raw = await asyncio.wait_for(ws.recv(), timeout=10)
        v = raw.decode("utf-8", errors="replace") if isinstance(raw, bytes) else raw
        state.panel_version = v.strip().strip("\x02\x03")
        check(len(state.panel_version) > 0, f"Version: {state.panel_version}", "No version")

        # ── Step 3: PAIRING ────────────────────────────────────
        heading("Step 3: PAIRING + Configuration")
        pairing_id = next_id()
        await send(ws, source_sn, "PAIRING", build_pairing_body(), pairing_id)

        # Read messages for up to 30 seconds. The panel sends STATE events
        # before the PAIRING Response (which contains the configuration).
        # We buffer early STATE events and replay them after config loads.
        pairing_ok = False
        event_count = 0
        early_events = []  # Buffer STATE events before config is loaded
        deadline = time.monotonic() + 30.0

        while time.monotonic() < deadline:
            try:
                remaining = max(1.0, deadline - time.monotonic())
                raw = await asyncio.wait_for(ws.recv(), timeout=remaining)
                root, updated = route_message(raw, state)
                if root is None:
                    continue

                if root.tag == "Event":
                    event_count += 1
                    device = root.findtext("Device", "?")
                    st = root.findtext("State", "?")
                    # Buffer early STATE events that couldn't be parsed (no config yet)
                    if not state.config_loaded and root.get("type") == "STATE":
                        early_events.append(raw)
                    info(f"Event #{event_count}: Device={device} State={st} (updated={updated})")
                elif root.tag == "Response":
                    resp_type = root.get("type", "")
                    resp_id = root.get("id", "")
                    info(f"Response: type={resp_type} id={resp_id} (config={state.config_loaded})")
                    if resp_id == pairing_id:
                        pairing_ok = True
                        # Replay buffered early events now that config is loaded
                        if early_events and state.config_loaded:
                            info(f"Replaying {len(early_events)} early STATE events...")
                            for evt_raw in early_events:
                                _, upd = route_message(evt_raw, state)
                                if upd:
                                    info(f"  ↳ updated state from replay")
                        break
            except asyncio.TimeoutError:
                break
            except Exception as e:
                warn(f"Error: {e}")
                break

        check(pairing_ok, f"Pairing OK ({event_count} early events)", "Pairing timeout")
        check(state.config_loaded, "Configuration loaded", "Configuration NOT loaded")

        if state.config_loaded:
            info(f"Areas: {len(state.area_names)}")
            for aid, name in sorted(state.area_names.items()):
                ena = state.area_enabled.get(aid, False)
                info(f"  Area {aid}: {name} ({'enabled' if ena else 'disabled'})")
            info(f"Central device ID: {state.central_device_id}")
            info(f"Tracked devices: {len(state.device_subcategory)}")
            for tag, subcat in sorted(state.device_subcategory.items()):
                info(f"  {tag} → {subcat}")

        # ── Step 4: HOME state + listen ────────────────────────
        heading("Step 4: HOME State + Listen (20s)")
        await send(ws, source_sn, "STATE", build_state_body("HOME"))

        event_count = 0
        deadline = time.monotonic() + 20.0

        while time.monotonic() < deadline:
            try:
                remaining = max(0.5, deadline - time.monotonic())
                raw = await asyncio.wait_for(ws.recv(), timeout=remaining)
                root, updated = route_message(raw, state)
                if root is None:
                    continue

                if root.tag == "Event":
                    event_count += 1
                    device = root.findtext("Device", "?")
                    st = root.findtext("State", "?")
                    info_txt = root.findtext("Info", "")
                    extra = f" Info={info_txt}" if info_txt else ""
                    info(f"Event #{event_count}: Device={device} State={st}{extra} (updated={updated})")
                elif root.tag == "Response":
                    resp_type = root.get("type", "")
                    resp_id = root.get("id", "")
                    info(f"Response: type={resp_type} id={resp_id}")
                    # Process FILE responses too
                    if resp_type == "FILE":
                        parse_file_response(root, state)
            except asyncio.TimeoutError:
                continue

        check(event_count > 0, f"Received {event_count} STATE events", "No events")

        # ── Print collected state ──────────────────────────────
        heading("Collected State")
        info(f"Panel version: {state.panel_version}")
        info(f"Panel serial:  {state.panel_serial}")
        info(f"Panel state:   {state.panel_state}")
        for aid in sorted(state.area_states.keys()):
            st = state.area_states[aid]
            name = state.area_names.get(aid, f"Area {aid}")
            label = {"0": "disarmed", "1": "arming", "2": "armed"}.get(st, st)
            info(f"  Area {aid} ({name}): {label}")
        info(f"Battery:       {state.battery_level}{'%' if state.battery_level else ''}")
        info(f"GSM info:      {state.gsm_info}")
        info(f"GSM IMEI:      {state.gsm_imei}")
        info(f"GSM state:     {state.gsm_state}")
        info(f"Power state:   {state.power_state}")
        info(f"WiFi state:    {state.wifi_state}")
        info(f"Cloud state:   {state.cloud_state}")
        info(f"Anomalies:     {len(state.anomalies)}")

        heading("Home Screen Data Checks")
        check(state.battery_level is not None, f"Battery: {state.battery_level}%", "Battery not received")
        check(state.gsm_info is not None, f"GSM: {state.gsm_info}", "GSM not received")
        check(state.power_state is not None, f"Power: {state.power_state}", "Power not received")
        check(state.cloud_state is not None, f"Cloud: {state.cloud_state}", "Cloud not received")
        # WiFi is optional — the panel only sends WiFi STATE events if
        # WiFi is used as the primary network interface.
        if state.wifi_state is not None:
            ok(f"WiFi: {state.wifi_state}")
        else:
            warn("WiFi: not received (normal if using wired network)")
        check(len(state.area_states) > 0, f"Areas: {len(state.area_states)}", "No area states")

        # ── Step 5: LOGIN test ─────────────────────────────────
        heading("Step 5: LOGIN (TERM_CODE)")
        login_id = next_id()
        await send(ws, source_sn, "MENU", build_login_body(PIN), login_id)

        login_ok = False
        deadline = time.monotonic() + 10.0
        while time.monotonic() < deadline:
            try:
                remaining = max(0.5, deadline - time.monotonic())
                raw = await asyncio.wait_for(ws.recv(), timeout=remaining)
                root, _ = route_message(raw, state)
                if root is not None and root.tag == "Response" and root.get("id") == login_id:
                    res = root.findtext("res", "")
                    act = root.findtext("act", "")
                    info(f"Login: act={act} res={res}")
                    if res == "REFUSED":
                        fail("Login REFUSED — wrong PIN?")
                    elif res == "INHIBITED":
                        fail(f"Login INHIBITED for {root.findtext('desc', '')}s")
                    else:
                        login_ok = True
                        user = root.findtext(".//name", "")
                        role = root.findtext(".//role", "")
                        if user:
                            info(f"User: {user} (role={role})")
                    break
            except asyncio.TimeoutError:
                continue

        check(login_ok, "Login successful", "Login failed")

        # LOGOUT
        if login_ok:
            heading("Step 6: LOGOUT")
            await send(ws, source_sn, "MENU", build_logout_body())
            await asyncio.sleep(1.0)
            ok("Logout sent")

    except Exception as e:
        fail(f"Unexpected error: {e}")
        import traceback; traceback.print_exc()
    finally:
        await ws.close()

    return results


# ── Unit tests ─────────────────────────────────────────────────────

async def run_unit_tests():
    heading("Unit Tests: Protocol Helpers")
    p = f = 0
    def check(c, m):
        nonlocal p, f
        if c: ok(m); p += 1
        else: fail(m); f += 1

    check(encode_area_mask("123") == "123---", "encode_area_mask('123') == '123---'")
    check(encode_area_mask("2") == "-2----", "encode_area_mask('2') == '-2----'")
    check(encode_area_mask([1,3,5]) == "1-3-5-", "encode_area_mask([1,3,5]) == '1-3-5-'")
    check(encode_area_mask("123456") == "123456", "encode_area_mask('123456') == '123456'")
    check(encode_area_mask("") == "------", "encode_area_mask('') == '------'")

    test_xml = '<Request type="TEST">body</Request>'
    framed = frame(test_xml)
    check(isinstance(framed, bytes), "frame returns bytes")
    check(to_xml_str(framed).strip() == test_xml, "to_xml_str recovers XML")
    check(to_xml_str(b"not xml") is None, "to_xml_str rejects non-XML bytes")
    check(to_xml_str("plain text") is None, "to_xml_str rejects plain text")

    req = build_request("111", "222", "TEST", "<body/>", "01")
    check('source="111"' in req, "build_request source")
    check('type="TEST"' in req, "build_request type")

    login = build_login_body("1234")
    check("<code>1234</code>" in login, "build_login_body PIN")
    check("<type>TERM_CODE</type>" in login, "build_login_body type")

    sn = generate_source_sn()
    check(sn.isdigit() and len(sn) >= 12, f"generate_source_sn: {sn}")

    heading(f"Unit Tests: {p} passed, {f} failed")
    return {"pass": p, "fail": f}


async def main():
    print(f"\n{B}{'='*60}{X}")
    print(f"{B}  AVE AF927 Alarm — Live Integration Test{X}")
    print(f"{B}{'='*60}{X}")

    unit = await run_unit_tests()
    live = await run_test()

    total_p = unit["pass"] + live["pass"]
    total_f = unit["fail"] + live["fail"]

    heading("Overall")
    print(f"  Unit: {unit['pass']} passed, {unit['fail']} failed")
    print(f"  Live: {live['pass']} passed, {live['fail']} failed")
    if total_f == 0:
        print(f"\n  {G}{B}ALL {total_p} CHECKS PASSED{X}")
    else:
        print(f"\n  {Y}{total_p}/{total_p+total_f} passed, {total_f} failed{X}")

    return 0 if total_f == 0 else 1


if __name__ == "__main__":
    sys.exit(asyncio.run(main()))
