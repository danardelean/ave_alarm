#!/usr/bin/env python3
"""Raw debug test — dumps every byte from the panel to understand the protocol."""
import asyncio
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "custom_components", "ave_alarm"))
import types, importlib.util

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
    build_file_config_body, build_login_body, build_logout_body,
    build_pairing_body, build_request, build_state_body,
    frame, generate_source_sn, to_xml_str,
)
from ave_alarm.parsers import PanelState, parse_file_response, parse_state_event, parse_xml

import websockets

HOST = "192.168.1.11"
PORT = 14001
TARGET_SN = "1234567890"
PIN = "201220"

def dump_raw(label, data):
    """Print raw data in both hex and decoded text."""
    if isinstance(data, bytes):
        # Show first/last bytes as hex
        hex_preview = data[:50].hex(" ")
        text = data.decode("utf-8", errors="replace")
        print(f"  [{label}] type=bytes len={len(data)}")
        print(f"  hex: {hex_preview}{'...' if len(data) > 50 else ''}")
        print(f"  txt: {text[:300]}{'...' if len(text) > 300 else ''}")
    elif isinstance(data, str):
        print(f"  [{label}] type=str len={len(data)}")
        print(f"  txt: {data[:300]}{'...' if len(data) > 300 else ''}")
    else:
        print(f"  [{label}] type={type(data)} = {data}")
    print()


async def main():
    source_sn = generate_source_sn()
    state = PanelState()

    print(f"=== Connecting to ws://{HOST}:{PORT}/ ===\n")
    ws = await websockets.connect(f"ws://{HOST}:{PORT}/", ping_interval=30, ping_timeout=10)
    print("Connected!\n")

    # Step 1: Version
    print("--- Waiting for version ---")
    raw = await asyncio.wait_for(ws.recv(), timeout=10)
    dump_raw("VERSION", raw)

    version_text = raw.decode("utf-8", errors="replace") if isinstance(raw, bytes) else raw
    state.panel_version = version_text.strip().strip("\x02\x03")
    print(f"  → Panel version: {state.panel_version}\n")

    # Step 2: PAIRING
    print("--- Sending PAIRING ---")
    pairing_xml = build_request(source_sn, TARGET_SN, "PAIRING", build_pairing_body(), "01")
    framed = frame(pairing_xml)
    print(f"  TX hex: {framed[:80].hex(' ')}")
    print(f"  TX xml: {pairing_xml}\n")
    await ws.send(framed)

    print("--- Waiting for PAIRING response ---")
    raw = await asyncio.wait_for(ws.recv(), timeout=10)
    dump_raw("PAIRING_RESP", raw)

    xml_str = unframe(raw)
    if xml_str:
        print(f"  Unframed XML: {xml_str[:500]}\n")
        root = parse_xml(xml_str)
        if root is not None:
            print(f"  Parsed: tag={root.tag} type={root.get('type','')} source={root.get('source','')}")
        else:
            print(f"  parse_xml returned None")
    else:
        print(f"  unframe returned None — not STX/ETX framed!")
        # Try parsing raw as text
        text = raw.decode("utf-8", errors="replace") if isinstance(raw, bytes) else raw
        text = text.strip().strip("\x02\x03")
        root = parse_xml(text)
        if root is not None:
            print(f"  Direct parse: tag={root.tag} type={root.get('type','')} source={root.get('source','')}")
        else:
            print(f"  Direct parse also failed")
    print()

    # Step 3: FILE CONFIGURATION
    print("--- Sending FILE CONFIGURATION ---")
    file_xml = build_request(source_sn, TARGET_SN, "FILE", build_file_config_body(), "02")
    await ws.send(frame(file_xml))
    print(f"  TX: {file_xml[:150]}...\n")

    print("--- Reading responses (up to 15 messages or 20 seconds) ---")
    for i in range(15):
        try:
            raw = await asyncio.wait_for(ws.recv(), timeout=5.0)
            dump_raw(f"MSG_{i}", raw)

            xml_str = unframe(raw)
            if xml_str:
                root = parse_xml(xml_str)
                if root is not None:
                    tag = root.tag
                    msg_type = root.get("type", "")
                    source = root.get("source", "")
                    print(f"  → tag={tag} type={msg_type} source={source}")

                    if tag == "Response" and msg_type == "FILE":
                        updated = parse_file_response(root, state)
                        print(f"  → parse_file_response: updated={updated} config_loaded={state.config_loaded}")
                    elif tag == "Event" and msg_type == "STATE":
                        device = root.findtext("Device", "?")
                        scode = root.findtext("State", "?")
                        updated = parse_state_event(root, state)
                        print(f"  → STATE event: Device={device} State={scode} updated={updated}")
                else:
                    print(f"  → parse_xml returned None")
            else:
                text = raw.decode("utf-8", errors="replace") if isinstance(raw, bytes) else raw
                print(f"  → Not framed. Raw text: {text[:200]}")
            print()

            if state.config_loaded:
                print("  *** Configuration loaded! ***\n")
                break

        except asyncio.TimeoutError:
            print(f"  [timeout after 5s]\n")
            break

    # Step 4: HOME state request
    print("--- Sending STATE HOME ---")
    await ws.send(frame(build_request(source_sn, TARGET_SN, "STATE", build_state_body("HOME"), "03")))

    print("--- Listening for 15 more seconds ---")
    deadline = asyncio.get_event_loop().time() + 15.0
    msg_count = 0
    while asyncio.get_event_loop().time() < deadline:
        try:
            remaining = deadline - asyncio.get_event_loop().time()
            raw = await asyncio.wait_for(ws.recv(), timeout=max(0.5, remaining))
            msg_count += 1
            dump_raw(f"EVENT_{msg_count}", raw)

            xml_str = unframe(raw)
            if xml_str:
                root = parse_xml(xml_str)
                if root is not None:
                    tag = root.tag
                    msg_type = root.get("type", "")
                    if tag == "Event" and msg_type == "STATE":
                        device = root.findtext("Device", "?")
                        scode = root.findtext("State", "?")
                        updated = parse_state_event(root, state)
                        print(f"  → STATE: Device={device} State={scode} updated={updated}")
                    else:
                        print(f"  → {tag} type={msg_type}")
            print()
        except asyncio.TimeoutError:
            continue

    # Print final state
    print("=== Final State ===")
    print(f"  config_loaded:  {state.config_loaded}")
    print(f"  central_id:     {state.central_device_id}")
    print(f"  panel_version:  {state.panel_version}")
    print(f"  panel_serial:   {state.panel_serial}")
    print(f"  panel_state:    {state.panel_state}")
    print(f"  area_names:     {state.area_names}")
    print(f"  area_states:    {state.area_states}")
    print(f"  device_subcat:  {state.device_subcategory}")
    print(f"  battery:        {state.battery_level}")
    print(f"  gsm_info:       {state.gsm_info}")
    print(f"  gsm_imei:       {state.gsm_imei}")
    print(f"  gsm_state:      {state.gsm_state}")
    print(f"  power_state:    {state.power_state}")
    print(f"  wifi_state:     {state.wifi_state}")
    print(f"  cloud_state:    {state.cloud_state}")
    print(f"  anomalies:      {state.anomalies}")

    await ws.close()


if __name__ == "__main__":
    asyncio.run(main())
