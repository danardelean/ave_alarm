#!/usr/bin/env python3
"""
Test ARM and DISARM flow against a real AVE AF927 alarm panel.

Flow tested:
  ARM:   LOGIN(TERM_CODE) → [ANOM_ACK] → DEVICE_CMD(C00101) → LOGOUT
  DISARM: LOGIN(TERM_CODE) → DEVICE_CMD(C00102) → LOGOUT

Monitors STATE events to verify area state transitions.
"""
import asyncio
import os
import sys
import time
import types
import importlib.util
from xml.etree import ElementTree as ET

# ── Module loading (avoid __init__.py which imports homeassistant) ──

_pkg_dir = os.path.join(os.path.dirname(__file__), "custom_components", "ave_alarm")
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
    build_anom_ack_body,
    build_device_cmd_body,
    build_login_body,
    build_logout_body,
    build_pairing_body,
    build_request,
    build_state_body,
    encode_area_mask,
    frame,
    generate_source_sn,
    to_xml_str,
)
from ave_alarm.parsers import (
    PanelState,
    parse_file_response,
    parse_state_event,
    parse_xml,
)
from ave_alarm.const import (
    AREA_STATE_OFF,
    AREA_STATE_ARMING,
    AREA_STATE_ARMED,
    CMD_ARM,
    CMD_DISARM,
    LOGIN_REFUSED,
    LOGIN_INHIBITED,
)

import websockets

# ── Configuration ──

HOST = "192.168.1.11"
PORT = 14001
TARGET_SN = "1234567890"
PIN = "201220"
AREAS_TO_TEST = "123"  # Test with areas 1-3 (GIARDINO, CORTILE, GARAGE)

# ── Console output helpers ──

BOLD = "\033[1m"
GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
CYAN = "\033[96m"
DIM = "\033[90m"
RESET = "\033[0m"

passed = 0
failed = 0


def heading(text):
    print(f"\n{BOLD}{text}{RESET}")


def ok(text):
    global passed
    passed += 1
    print(f"  {GREEN}✓{RESET} {text}")


def fail(text):
    global failed
    failed += 1
    print(f"  {RED}✗{RESET} {text}")


def check(condition, ok_text, fail_text="FAILED"):
    if condition:
        ok(ok_text)
    else:
        fail(fail_text)
    return condition


def info(text):
    print(f"  {CYAN}ℹ{RESET} {text}")


def warn(text):
    print(f"  {YELLOW}⚠{RESET} {text}")


def tx(text):
    print(f"  {DIM}TX {text}{RESET}")


def rx(text):
    print(f"  {DIM}RX {text}{RESET}")


# ── Helpers ──

_msg_counter = 0


def next_id():
    global _msg_counter
    _msg_counter += 1
    return f"{_msg_counter:02d}"


async def send(ws, source_sn, msg_type, body, msg_id=None):
    msg_id = msg_id or "00"
    xml = build_request(source_sn, TARGET_SN, msg_type, body, msg_id)
    tx(f"[{msg_type}] id={msg_id}")
    await ws.send(frame(xml))


def route_message(raw, state):
    """Parse and route a raw WebSocket message. Returns (root, updated)."""
    xml_str = to_xml_str(raw)
    if not xml_str:
        return None, False
    root = parse_xml(xml_str)
    if root is None:
        return None, False
    updated = False
    if root.tag == "Event" and root.get("type") == "STATE":
        updated = parse_state_event(root, state)
    elif root.tag == "Response" and root.get("type") in ("FILE", "PAIRING"):
        updated = parse_file_response(root, state)
    return root, updated


async def wait_for_response(ws, state, msg_id, timeout=10.0):
    """Wait for a Response with matching id, processing events along the way."""
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline:
        try:
            remaining = max(1.0, deadline - time.monotonic())
            raw = await asyncio.wait_for(ws.recv(), timeout=remaining)
            root, updated = route_message(raw, state)
            if root is None:
                continue

            if root.tag == "Event":
                device = root.findtext("Device", "?")
                st = root.findtext("State", "?")
                info(f"Event: Device={device} State={st} (updated={updated})")
            elif root.tag == "Response":
                resp_id = root.get("id", "")
                if resp_id == msg_id:
                    return root
                else:
                    rx(f"Response id={resp_id} (not ours)")
        except asyncio.TimeoutError:
            break
    return None


async def listen_for_events(ws, state, duration=10.0, stop_when=None):
    """Listen for STATE events for up to `duration` seconds.

    If `stop_when` is provided, stop early when that condition returns True.
    Returns list of (device, state_code, updated) tuples.
    """
    events = []
    deadline = time.monotonic() + duration
    while time.monotonic() < deadline:
        try:
            remaining = max(0.5, deadline - time.monotonic())
            raw = await asyncio.wait_for(ws.recv(), timeout=remaining)
            root, updated = route_message(raw, state)
            if root is None:
                continue

            if root.tag == "Event":
                device = root.findtext("Device", "?")
                st = root.findtext("State", "?")
                events.append((device, st, updated))
                info(f"Event: Device={device} State={st} (updated={updated})")

                # Show area states when AL002 updates
                if device == "AL002" and updated:
                    for aid in sorted(state.area_states.keys(), key=int):
                        area_st = state.area_states[aid]
                        delay = state.area_exit_delays.get(aid, 0)
                        name = state.area_names.get(aid, f"Area {aid}")
                        state_desc = {AREA_STATE_OFF: "disarmed", AREA_STATE_ARMING: f"arming (exit delay {delay}s)", AREA_STATE_ARMED: "ARMED"}.get(area_st, area_st)
                        info(f"  Area {aid} ({name}): {state_desc}")

                if stop_when and stop_when():
                    info("Stop condition met")
                    break
            elif root.tag == "Response":
                resp_type = root.get("type", "?")
                resp_id = root.get("id", "?")
                rx(f"Response type={resp_type} id={resp_id}")
        except asyncio.TimeoutError:
            continue
    return events


# ── Main test ──

async def main():
    global _msg_counter
    _msg_counter = 0

    mask = encode_area_mask(AREAS_TO_TEST)
    print(f"{BOLD}{'=' * 60}{RESET}")
    print(f"{BOLD}  AVE AF927 Alarm — ARM / DISARM Test{RESET}")
    print(f"{BOLD}{'=' * 60}{RESET}")
    print(f"  Panel: {HOST}:{PORT}")
    print(f"  PIN: {'*' * len(PIN)}")
    print(f"  Areas to test: {AREAS_TO_TEST} (mask: {mask})")

    state = PanelState()

    # ── Step 1: Connect + PAIRING ─────────────────────────────────
    heading("Step 1: Connect + PAIRING")
    ws = await websockets.connect(
        f"ws://{HOST}:{PORT}/",
        ping_interval=None, ping_timeout=None, close_timeout=5,
    )
    ok("Connected")

    # Version
    raw = await asyncio.wait_for(ws.recv(), timeout=10)
    v = raw.decode("utf-8", errors="replace") if isinstance(raw, bytes) else raw
    state.panel_version = v.strip().strip("\x02\x03")
    ok(f"Version: {state.panel_version}")

    # PAIRING
    pairing_id = next_id()
    await send(ws, generate_source_sn(), "PAIRING", build_pairing_body(), pairing_id)

    # Consume until PAIRING response
    source_sn = generate_source_sn()  # for subsequent sends
    early_events = []
    deadline = time.monotonic() + 30.0
    while time.monotonic() < deadline:
        try:
            raw = await asyncio.wait_for(ws.recv(), timeout=10)
            # Buffer for replay
            if not state.config_loaded:
                root_check = parse_xml(to_xml_str(raw) or "")
                if root_check is not None and root_check.tag == "Event":
                    early_events.append(raw)
            root, updated = route_message(raw, state)
            if root is not None and root.tag == "Response" and root.get("id") == pairing_id:
                # Replay early events
                for evt_raw in early_events:
                    route_message(evt_raw, state)
                break
        except asyncio.TimeoutError:
            break

    if not check(state.config_loaded, "Configuration loaded", "Config NOT loaded"):
        await ws.close()
        return

    info(f"Central device: {state.central_device_id}")
    info(f"Tracked devices: {len(state.device_subcategory)}")

    # Request HOME state
    await send(ws, source_sn, "STATE", build_state_body("HOME"))
    await listen_for_events(ws, state, duration=5.0)

    # Show initial area states
    heading("Initial Area States")
    initial_states = {}
    for aid in sorted(state.area_states.keys(), key=int):
        area_st = state.area_states[aid]
        name = state.area_names.get(aid, f"Area {aid}")
        state_desc = {AREA_STATE_OFF: "disarmed", AREA_STATE_ARMING: "arming", AREA_STATE_ARMED: "ARMED"}.get(area_st, area_st)
        initial_states[aid] = area_st
        info(f"  Area {aid} ({name}): {state_desc}")

    # Determine test order based on current state
    test_areas = [c for c in AREAS_TO_TEST if c.isdigit()]
    any_armed = any(state.area_states.get(a) == AREA_STATE_ARMED for a in test_areas)

    if any_armed:
        info("Some areas are armed → will DISARM first, then ARM, then DISARM")
        test_sequence = ["disarm", "arm", "disarm"]
    else:
        info("All test areas are disarmed → will ARM first, then DISARM")
        test_sequence = ["arm", "disarm"]

    # ── ARM / DISARM cycles ───────────────────────────────────────

    for step_num, action in enumerate(test_sequence, start=2):
        heading(f"Step {step_num}: {action.upper()} (areas {AREAS_TO_TEST})")

        # LOGIN
        login_id = next_id()
        await send(ws, source_sn, "MENU", build_login_body(PIN), login_id)
        login_resp = await wait_for_response(ws, state, login_id, timeout=10.0)

        if login_resp is not None:
            res = login_resp.findtext("res", "?")
            act = login_resp.findtext("act", "?")
            info(f"Login response: act={act} res={res}")

            if res == LOGIN_REFUSED:
                fail("Login REFUSED")
                await ws.close()
                return
            if res == LOGIN_INHIBITED:
                desc = login_resp.findtext("desc", "?")
                fail(f"Login INHIBITED for {desc}s")
                await ws.close()
                return

            check(res == "ACCEPTING", f"Login accepted (res={res})", f"Login unexpected res={res}")
        else:
            fail("Login timeout — no response")
            await ws.close()
            return

        await asyncio.sleep(0.3)

        # Check for anomalies (only when arming)
        if action == "arm" and state.anomalies:
            warn(f"Active anomalies: {len(state.anomalies)}")
            flush = state.anomaly_flush_area or encode_area_mask(AREAS_TO_TEST)
            info(f"Sending ANOM_ACK with value={flush}")
            await send(ws, source_sn, "STATE", build_anom_ack_body(flush))
            await asyncio.sleep(0.5)

        # DEVICE_CMD
        cmd = CMD_ARM if action == "arm" else CMD_DISARM
        device_id = state.central_device_id or "AL002"
        info(f"Sending DEVICE_CMD: {cmd} device={device_id} areas={mask}")
        await send(ws, source_sn, "DEVICE_CMD", build_device_cmd_body(cmd, device_id, PIN, mask))
        await asyncio.sleep(0.3)

        # LOGOUT
        await send(ws, source_sn, "MENU", build_logout_body())
        info("Logout sent")

        # Wait for STATE events showing the transition
        if action == "arm":
            heading(f"  Waiting for ARM state transition (up to 120s)...")

            def all_armed():
                return all(
                    state.area_states.get(a) in (AREA_STATE_ARMED, AREA_STATE_ARMING)
                    for a in test_areas
                )

            events = await listen_for_events(ws, state, duration=120.0, stop_when=lambda: all(
                state.area_states.get(a) == AREA_STATE_ARMED for a in test_areas
            ))

            # Check results
            for a in test_areas:
                area_st = state.area_states.get(a, "?")
                name = state.area_names.get(a, f"Area {a}")
                if area_st == AREA_STATE_ARMED:
                    ok(f"Area {a} ({name}): ARMED")
                elif area_st == AREA_STATE_ARMING:
                    warn(f"Area {a} ({name}): still arming (exit delay not complete)")
                else:
                    fail(f"Area {a} ({name}): expected armed, got {area_st}")

        else:  # disarm
            heading(f"  Waiting for DISARM state transition (up to 15s)...")
            events = await listen_for_events(ws, state, duration=15.0, stop_when=lambda: all(
                state.area_states.get(a) == AREA_STATE_OFF for a in test_areas
            ))

            # Check results
            for a in test_areas:
                area_st = state.area_states.get(a, "?")
                name = state.area_names.get(a, f"Area {a}")
                if area_st == AREA_STATE_OFF:
                    ok(f"Area {a} ({name}): disarmed")
                else:
                    fail(f"Area {a} ({name}): expected disarmed, got {area_st}")

    # ── Final state ───────────────────────────────────────────────
    heading("Final Area States")
    for aid in sorted(state.area_states.keys(), key=int):
        area_st = state.area_states[aid]
        name = state.area_names.get(aid, f"Area {aid}")
        state_desc = {AREA_STATE_OFF: "disarmed", AREA_STATE_ARMING: "arming", AREA_STATE_ARMED: "ARMED"}.get(area_st, area_st)
        info(f"  Area {aid} ({name}): {state_desc}")

    await ws.close()

    # ── Summary ───────────────────────────────────────────────────
    heading("Summary")
    total = passed + failed
    if failed == 0:
        print(f"\n  {GREEN}{BOLD}ALL {total} CHECKS PASSED{RESET}")
    else:
        print(f"\n  {YELLOW}{passed}/{total} passed, {failed} failed{RESET}")

    sys.exit(1 if failed else 0)


if __name__ == "__main__":
    asyncio.run(main())
