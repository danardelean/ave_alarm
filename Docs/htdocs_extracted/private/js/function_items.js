function item_reed_mode(container, xml_any_o, widget_obj)
{
	if (xml_any_o.children("alarm_mode").text() != "-1")
	{
		if (xml_any_o.children("alarm_mode").text() == "1")
		{
			$(container+" .reed .roc").css("color", "rgba(255,255,255,0.4)");
			$(container+" .reed .roc").attr("data-checked", "0");
			$(container+" .reed .open").css("color", "rgba(255,0,0,1)");
			$(container+" .reed .open").attr("data-checked", "1");
		}
		else if (xml_any_o.children("alarm_mode").text() == "2")
		{
			$(container+" .reed .roc").css("color", "rgba(255,255,255,0.4)");
			$(container+" .reed .roc").attr("data-checked", "0");
			$(container+" .reed .open_close").css("color", "rgba(255,255,255,1)");
			$(container+" .reed .open_close").attr("data-checked", "1");
		}
		$(container+" .reed .roc")
			.off("click").click(function()/*en50131 di sir mode è più completa*/
			{
				if (!$(container+" .reed").hasClass("disabled") && !$(container+" .reed").hasClass("invisible") && !$(container+" .reed").hasClass("unavailable"))
				{
					if ($(this).hasClass("en50131"))
					{
						pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_EN50131}", "okab", container+" .reed .roc");
					}
					else
					{
						$(container+" .reed .roc").attr("data-checked", "0");
						$(container+" .reed .roc").css("color", "rgba(255,255,255,0.4)");
						$(this).attr("data-checked", "1");
						$(this).css("color", "rgba(255,255,255,1)");
					}
				}
			})
			.off("on_pw_ok").on("on_pw_ok", function()
			{
				if ($(this).hasClass("en50131"))
				{
					$(container+" .reed .roc").attr("data-checked", "0");
					$(container+" .reed .roc").css("color", "rgba(255,255,255,0.4)");
					$(this).attr("data-checked", "1");
					$(this).css("color", "rgba(255,0,0,1)");
				}
			});
		//
		if (widget_obj.phy_mode != undefined)
		{
			var phy_mode = widget_obj.phy_mode;
			if (phy_mode == widget_obj.NC_CONTAIMPULSI || phy_mode == widget_obj.NC_BILANCIATO_CONTAIMPULSI)
			{
				$(container+" .reed").addClass("disabled");
				$(container+" .reed .roc").css("color", "rgba(255,255,255,1)");
				$(container+" .reed .roc").attr("data-checked", "0");
				$(container+" .reed .roc.open_close").attr("data-checked", "1");
			}
		}
	}
	else
	{
		$(container+" .reed").addClass("unavailable");
	}
}
function wire_in_tst(ord)
{
	return((ord >= WIRE_I_ORD_OFFSET) && (ord <= WIRE_I_INPUT_ORD_OFFSET));
}
function wire_in_virt_tst(ord)
{
	return((ord > WIRE_I_VIRTUAL_ORD_OFFSET) && (ord <= (WIRE_I_VIRTUAL_ORD_OFFSET + WIRE_NC_DUAL_NUMBER)));	
}
function item_phy_mode(container, widget_obj)
{
	if
	(
		widget_obj.phy_mode == widget_obj.NC
		|| widget_obj.phy_mode == widget_obj.NO 
		|| widget_obj.phy_mode == widget_obj.NC_CONTAIMPULSI
	)
		$(container + " .phy_mode .sl_selector").addClass("red");
	//
	if
	(
		widget_obj.phy_mode == widget_obj.NC_CONTAIMPULSI
		|| widget_obj.phy_mode == widget_obj.NC_BILANCIATO_CONTAIMPULSI
	)
		widget_obj.force_to_open = true;
	//
	$(container + " .phy_mode .sl_selector").html(widget_obj.associative_phy_mode[widget_obj.phy_mode]);
	if (wire_in_virt_tst(Number(widget_obj.xml_any.children("ord").text())))
	{
		$(container + " .phy_mode").addClass("disabled");
	}
	else if (wire_in_tst(Number(widget_obj.xml_any.children("ord").text())))
	{
		$(container + " .phy_mode").removeClass("disabled");
		global_apply_diag(container, "phy_mode", "{LANG_CONF_INGR}", "phy_mode", null, widget_obj.name);
	}
}
function item_reed_mode_wired(container, widget_obj)
{
	if (widget_obj.reed_mode != "-1")
	{
		if (widget_obj.reed_mode == "1")
		{
			$(container+" .reed .roc")
				.css("color", "rgba(255,255,255,0.4)")
				.attr("data-checked", "0");
			$(container+" .reed .open")
				.css("color", "rgba(255,0,0,1)")
				.attr("data-checked", "1");
		}
		else if (widget_obj.reed_mode == "2")
		{
			$(container+" .reed .roc")
				.css("color", "rgba(255,255,255,0.4)")
				.attr("data-checked", "0");
			$(container+" .reed .open_close")
				.css("color", "rgba(255,255,255,1)")
				.attr("data-checked", "1");
		}
		$(container+" .reed .roc")
			.off("click").click(function()
			{
				if (!$(container+" .reed").hasClass("disabled") && !$(container+" .reed").hasClass("invisible") && !$(container+" .reed").hasClass("unavailable"))
				{
					if ($(this).attr("data-checked") == "0")
					{
						if ($(this).hasClass("en50131"))
						{
							pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_EN50131}", "okab", container+" .reed .roc");
						}
						else
						{
							$(container+" .reed .roc")
								.attr("data-checked", "0")
								.css("color", "rgba(255,255,255,0.4)");
							$(this).attr("data-checked", "1");
							$(this).css("color", "rgba(255,255,255,1)");
						}
					}
				}
			})
			.off("on_pw_ok").on("on_pw_ok", function()
			{
				if ($(this).hasClass("en50131"))
				{
					$(container+" .reed .roc")
						.attr("data-checked", "0")
						.css("color", "rgba(255,255,255,0.4)");
					$(this).attr("data-checked", "1");
					$(this).css("color", "rgba(255,0,0,1)");
				}
			});
		//
		var phy_mode = widget_obj.phy_mode;
		if (phy_mode == widget_obj.NC_CONTAIMPULSI || phy_mode == widget_obj.NC_BILANCIATO_CONTAIMPULSI)
		{
			$(container+" .reed").addClass("disabled");
			$(container+" .reed .roc").css("color", "rgba(255,255,255,1)");
			$(container+" .reed .roc").attr("data-checked", "0");
			$(container+" .reed .roc.open_close").attr("data-checked", "1");
		}
	}
	else
	{
		$(container+" .reed").addClass("unavailable");
	}
}
//
function item_sir_mode(container, xml_any_o)
{
	//$(container+" .sound").append("<div class='s_bar1'></div>");
	//$(container+" .sound").append("<div class='s_bar2'></div>");
	//
	if (xml_any_o.children("sir_mode").text() != "-1")
	{
		$(container + " .sound .sound_btn").attr("data-checked", "0");
		$(container + " .sound .sound_btn[data-anchor='" + xml_any_o.children("sir_mode").text() + "']").attr("data-checked", "1");
		//
		if (!$(container+" .sound").hasClass("disabled"))
		{
			$(container+" .sound .sound_btn").off("click").click(function()
			{
				if ($(this).attr("data-checked") == "0")
				{
					if ($(this).hasClass("en50131"))
					{
						pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_EN50131}", "okab", container+" .sound #"+$(this).attr("id"));
					}
					else
					{
						$(container+" .sound .sound_btn").attr("data-checked", "0");
						$(this).attr("data-checked", "1");
						//
						if (!DIY)
							$(container + " .chime").trigger("switch_state_changer", [["enabled"]]);
					}
				}
			})
			.off("on_pw_ok").on("on_pw_ok", function()
			{
				$(container+" .sound .sound_btn").attr("data-checked", "0");
				$(this).attr("data-checked", "1");
				//
				if ($(this).attr("data-anchor") === "2" && !DIY)
				{
					$(container + " .chime").trigger("switch_state_changer", [["disabled", "off"]]);
				}
				else if (!DIY)
				{
					$(container + " .chime").trigger("switch_state_changer", [["enabled"]]);
				}
			});
		}
	}
}
function item_chime(container, widget_obj)
{
	if (!DIY)
		global_switcher_binder(container, "chime", widget_obj.xml_any);
	else
		$(container + " .chime").empty();
	//
	if (widget_obj.xml_any.children("sir_mode").text() == "2")
		$(container + " .chime").trigger("switch_state_changer", [["disabled", "off"]]);
}
function item_fw_ver(container, xml_any_o)
{
	$(container + " .firmware_version").text(xml_any_o.children("fw_ver").text());
}
function item_and_function_dev_wrapper(container, xml_any_o, widget_obj)
{
	xml_any_o = xml_any_o || xml_any;
	//
	if (DIY)
	{
		$(container + " .slot_picker.mode_match_sec_item").addClass("unavailable");
		$(container + " .and_function_dev").addClass("unavailable");
	}
	else
	{
		item_and_function_dev(container, xml_any_o, widget_obj);
		item_device_and_dependencies(container, xml_any_o, widget_obj);
	}
}
function item_and_function_dev(container, xml_any_o, widget_obj)
{
	xml_any_o = xml_any_o || xml_any;
	//
	and_function_dev = xml_any_o.children("mode_match_id").text();
	//
	if (!$(container + " .and_function_dev").hasClass("disabled"))
		global_apply_diag(container, "and_function_dev", "{LANG_AND_FUNCTION_WITH_OTHER_DEVICE}", "and_function_dev", null, widget_obj.name);
	//
	var i = 0;
	for (i = 0; i < xml_any_tbl.length; i++)
		if (xml_any_tbl[i].children("id").text() === and_function_dev)
		{
			$(container + " .and_function_dev .sl_selector").html(xml_any_tbl[i].children("name").text());
			break;
		}
	if (i == xml_any_tbl.length)
		$(container + " .and_function_dev .sl_selector").html("{LANG_DISABLED}");
}
//dipendenze device and
function item_device_and_dependencies(container, xml_any_o, widget_obj)
{
	xml_any_o = xml_any_o || xml_any;
	//
	if (xml_any_o.children("mode").text() == DELAYED)
	{
		$(container+" .slot_picker.mode_match_sec_item").addClass("invisible");
	}
	else
	{
		$(container+" .slot_picker.delay").addClass("invisible");
		$(container+" .slot_picker .pick_delay").text("0");
	}
	//
	$(container+" .and_function_dev").off("ok_diag").on("ok_diag", function()
	{
		if (and_function_dev != "0")
		{
			if ("mode_bus_rf" in widget_obj)
			{
				widget_obj.mode_bus_rf = 1;
				$(container + " .mode_bus_rf .sl_selector").html(widget_obj.mode_bus_rf_label[widget_obj.mode_bus_rf]);
				mode_bus_rf_dynamic_gui(container, widget_obj, true);
			}
			//
			$(container + " .area_and").trigger("switch_state_changer", [["off"]]);
			//per il picker delay time mode_match_sec_item
			$(container + " .slot_picker.mode_match_sec_item").removeClass("invisible");
			//
			$(container + " .slot_picker.delay").addClass("invisible");
			$(container + " .slot_picker .pick_delay").text("0");
		}
		else
		{	//per il picker delay time mode_match_sec_item
			if ($(container + " .area_and").attr("data-checked") == "0")
			{
				if ("mode_bus_rf" in widget_obj)
				{
					widget_obj.mode_bus_rf = 0;
					$(container + " .mode_bus_rf .sl_selector").html(widget_obj.mode_bus_rf_label[widget_obj.mode_bus_rf]);
					mode_bus_rf_dynamic_gui(container, widget_obj, true);
				}
				//
				$(container+" .slot_picker.mode_match_sec_item").addClass("invisible");
				//
				$(container+" .slot_picker.delay").removeClass("invisible");
			}
			else
			{
				if ("mode_bus_rf" in widget_obj)
				{
					widget_obj.mode_bus_rf = 2;
					$(container + " .mode_bus_rf .sl_selector").html(widget_obj.mode_bus_rf_label[widget_obj.mode_bus_rf]);
					mode_bus_rf_dynamic_gui(container, widget_obj, true);
				}
			}
		}
	});
}
function item_area_and_wrapper(container, xml_any_o, widget_obj)
{
	xml_any_o = xml_any_o || xml_any;
	//
	if (DIY)
		$(container + " .slot_picker.mode_match_sec_item").addClass("unavailable");
	//
	global_switcher_binder(container, "area_and", null, xml_any_o.children("mode").text() == MATCH_AREA ? "1" : "0");
	if (!DIY) item_area_and_dependencies(container, xml_any_o, widget_obj);
}
//dipendenze area and
function item_area_and_dependencies(container, xml_any_o, widget_obj)
{
	xml_any_o = xml_any_o || xml_any;
	//
	if (xml_any_o.children("mode").text() == DELAYED)
	{
		$(container + " .slot_picker.mode_match_sec_item").addClass("invisible");
	}
	else
	{
		$(container + " .slot_picker.delay").addClass("invisible");
		$(container + " .slot_picker .pick_delay").text("0");
	}
	//
	$(container + " .area_and").off("toggle_tick_click").on("toggle_tick_click", function()
	{
		if ($(this).attr("data-checked") != "0")
		{
			if ("mode_bus_rf" in widget_obj)
			{
				widget_obj.mode_bus_rf = 2;
				$(container + " .mode_bus_rf .sl_selector").html(widget_obj.mode_bus_rf_label[widget_obj.mode_bus_rf]);
			}
			//
			and_function_dev = "0";
			$(container + " .and_function_dev .sl_selector").html("{LANG_DISABLED}");
			//per il picker delay time mode_match_sec_item
			$(container + " .slot_picker.mode_match_sec_item").removeClass("invisible");
			//
			$(container + " .slot_picker.delay").addClass("invisible");
			$(container + " .slot_picker .pick_delay").text("0");
		}
		else
		{	//per il picker delay time mode_match_sec_item
			if (and_function_dev == "0")
			{
				if ("mode_bus_rf" in widget_obj)
				{
					widget_obj.mode_bus_rf = 0;
					$(container + " .mode_bus_rf .sl_selector").html(widget_obj.mode_bus_rf_label[widget_obj.mode_bus_rf]);
				}
				//
				$(container + " .slot_picker.mode_match_sec_item").addClass("invisible");
				//
				$(container + " .slot_picker.delay").removeClass("invisible");
			}
			else
			{
				if ("mode_bus_rf" in widget_obj)
				{
					widget_obj.mode_bus_rf = 1;
					$(container + " .mode_bus_rf .sl_selector").html(widget_obj.mode_bus_rf_label[widget_obj.mode_bus_rf]);		
				}
			}
		}
	});
}
function item_delete(container, widget_obj)
{
	$("#footer_h2_a_b").off("click").click(function()
	{
		pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_WDELDEV}", "okab", "#footer_h2_a_b");
	})
	.off("on_pw_ok").on("on_pw_ok", function()
	{
		crossroads["MENU"]["act page res"]["DELETE " + WS_DEV_STR + " DELETED"] = widget_obj.name;
		//
		xml_request = xml_request_head_build("MENU", widget_obj.name);
		xml_par = $(XML("act")); xml_par.text("DELETE"); xml_request.append(xml_par);
		xml_par = $(XML("page")); xml_par.text(WS_DEV_STR); xml_request.append(xml_par);
		xml_par = $(XML("par")); xml_request.append(xml_par);
		var xml_item = $(XML("item")); xml_item.attr("id", "1"); xml_par.append(xml_item);
		xml_node = $(XML("id")); xml_node.text(widget_obj.xml_any.children("id").text()); xml_item.append(xml_node);
		return xml_send(xml_request);
	});
}
var id_room_selected = "";
function item_room(container, xml_any_o)
{
	if (SIL || AVE)
	{
		$(container + " .room").addClass("unavailable");
	} 
	else
	{
		id_room_selected = xml_any_o.children("room").text();
		room_list.children("item").each(function()
		{
			if ($(this).children("id").text() == id_room_selected)
			{
				$(container+" .room .sl_selector").html($(this).children("desc").text());
				return false;
			}
		});
		$(container+" .room").off("click").click(function()
		{
			if (!$(container+" .room").hasClass("disabled"))
				pag_change(".JSdialog", "widget_room");
		});
	}
}
//pick_inter
function item_inter(container, xml_any_o)
{
	if 
	(
		container == "#container_pir" 
		|| container == "#container_dt"
		|| container == "#container_3t"
		|| container == "#container_dualpir_lr"
		|| container == "#container_dualpir_lr_aa"
	)
	{
		if (xml_any_o.children("pir_a_present").text() === "1")
			$(container+" .pick_inter").text(xml_any_o.children("pir_a_block_tx").text());
		else if (xml_any_o.children("pir_b_present").text() === "1")
			$(container+" .pick_inter").text(xml_any_o.children("pir_b_block_tx").text());
		else
			$(container+" .inter").addClass("invisible");
	}
	else
	{
		if (xml_any_o.children("block_tx").text() == "-1")
			$(container+" .inter").addClass("invisible");
		else
			$(container+" .pick_inter").text(xml_any_o.children("block_tx").text());
	}
	//
	if (DIY)
	{
		$(container+" .inter")
			.addClass("disabled")
			.find(".side.arrow").remove();
	}
}
function item_protection(container, xml_any_o, widget_obj)
{
	if 
	(
		widget_obj.name == "widget_mod_device_sir" 
		|| widget_obj.name == "widget_mod_device_siri"
		|| widget_obj.name == "widget_mod_device_repeater"
	)
	{
		global_switcher_binder(container, "reed_tamper_o", null, xml_any_o.children("reed_tamper").text() == "2" ? "1" : "0", {condizione: "0", messaggio: "{LANG_EN50131}"});
		global_switcher_binder(container, "reed_tamper_r", null, xml_any_o.children("reed_tamper").text() == "1" ? "1" : "0", {condizione: "0", messaggio: "{LANG_EN50131}"});
		$(container + " .reed_tamper_o").trigger("switch_state_changer", [["disabled"]]);
		if (xml_any_o.children("reed_tamper").text() == "3")
		{
			$(container + " .reed_tamper_o").trigger("switch_state_changer", [["on"]]);
			$(container + " .reed_tamper_r").trigger("switch_state_changer", [["on"]]);
		}
	}
	else
	{
		global_switcher_binder(container, "protect", null, xml_any_o.children("reed_tamper").text() == "3" ? "1" : "0", {condizione: "0", messaggio: "{LANG_EN50131}"});
		$(container + " .protect").trigger("switch_state_changer", [["disabled"]]);	
	}
}
function item_led(container, xml_any_o, widget_obj)
{
	global_switcher_binder(container, "led", xml_any_o);
}
function item_temp_comp(container, xml_any_o, widget_obj)
{
	if 
	(
		container == "#container_pir"
		|| container == "#container_dt"
		|| container == "#container_3t"
		|| container === "#container_dualpir_lr"
		|| container === "#container_dualpir_lr_aa"
		|| container.indexOf("#container_bus_") > -1
	)
	{
		if (xml_any_o.children("pir_a_present").text() == "1")
			global_switcher_binder(container, "temp_comp", null, xml_any_o.children("pir_a_temperature").text());
		else if (xml_any_o.children("pir_b_present").text() == "1")
			global_switcher_binder(container, "temp_comp", null, xml_any_o.children("pir_b_temperature").text());
		else
			$(container + " .temp_comp").addClass("unavailable");
	}
	else
	{
		//
	}
}
function item_antimask(container, xml_any_o, widget_obj)
{
	if 
	(
		widget_obj.name == "widget_mod_device_mic_s"
		|| widget_obj.name == "widget_mod_device_magdet_f"
		|| widget_obj.name == "widget_mod_device_magdet_fonly"
	)
		global_switcher_binder(container, "reed_tamper_mag", null, xml_any_o.children("antimask").text());
	else
		global_switcher_binder(container, "antimask", xml_any_o);
	
}
function item_double_ala(container, xml_any_o, widget_obj)
{
	global_switcher_binder(container, "double_ala", null, widget_obj.xml_any.children("and").text());
}
function item_pulse(container, xml_any_o)
{
	if (container == "#container_dt" || container == "#container_bus_dt")
	{
		if (xml_any_o.children("pir_a_present").text() == "1")
			$(container+" .pick_pulse").text(xml_any_o.children("pir_a_count_impulses").text());
		else if (xml_any_o.children("pir_b_present").text() == "1")
			$(container+" .pick_pulse").text(xml_any_o.children("pir_b_count_impulses").text());
		else
			$(container+" .pulse").addClass("unavailable");
	}
	else if (container == "#container_pir" || container == "#container_bus_ir" || container.indexOf("#container_bus_") > -1)
	{
		if (xml_any_o.children("pir_a_present").text() == "1")
			$(container+" .pick_pulse_a").text(xml_any_o.children("pir_a_count_impulses").text());
		else
			$(container+" .pulse_a").addClass("unavailable");
		//
		if (xml_any_o.children("pir_b_present").text() == "1")
			$(container+" .pick_pulse_b").text(xml_any_o.children("pir_b_count_impulses").text());
		else
			$(container+" .pulse_b").addClass("unavailable");
		//
		if (!$(container+" .pulse_b").hasClass("unavailable") && DIY)
			$(container+" .pulse_b").addClass("disabled");
	}
	else if (container == "#container_3t" || container == "#container_dualpir_lr" || container == "#container_dualpir_lr_aa")
	{
		if (xml_any_o.children("pir_a_present").text() == "1")
			$(container + " .pick_pulse_a").text(xml_any_o.children("pir_a_count_impulses").text());
		else
			$(container + " .pulse_a").addClass("unavailable");
		if (xml_any_o.children("pir_b_present").text() == "1")
			$(container + " .pick_pulse_b").text(xml_any_o.children("pir_b_count_impulses").text());
		else
			$(container + " .pulse_b").addClass("unavailable");
	}
}
function item_sensibility(container, xml_any_o)
{
	if (container == "#container_dt" || container == "#container_bus_dt")
	{
		if (xml_any_o.children("pir_a_present").text() == "1")
			$(container+" .pick_sensibility").text(xml_any_o.children("pir_a_sensibility").text());
		else if (xml_any_o.children("pir_b_present").text() == "1")
			$(container+" .pick_sensibility").text(xml_any_o.children("pir_b_sensibility").text());
		else
			$(container+" .sensibility").addClass("unavailable");
	}
	else if (container == "#container_pir" || container.indexOf("#container_bus_") > -1)
	{
		if (xml_any_o.children("pir_a_present").text() == "1")
			$(container+" .pick_sens_a").text(xml_any_o.children("pir_a_sensibility").text());
		else
			$(container+" .sens_a").addClass("unavailable");
		//
		if (xml_any_o.children("pir_b_present").text() == "1")
			$(container+" .pick_sens_b").text(xml_any_o.children("pir_b_sensibility").text());
		else
			$(container+" .sens_b").addClass("unavailable");
		//
		if (!$(container+" .sens_b").hasClass("unavailable") && DIY)
		{
			$(container+" .sens_b").addClass("disabled");
			$(container+" .sens_a .side.arrow").off("pick_extra_func").on("pick_extra_func", function()
			{
				$(container+" .pick_sens_b").text($(this).siblings(".side.value").children(".pick_sens_a").text());
			});
			$(container+" .pulse_a .side.arrow").off("pick_extra_func").on("pick_extra_func", function()
			{
				$(container+" .pick_pulse_b").text($(this).siblings(".side.value").children(".pick_pulse_a").text());
			});
		}
	}
	else if (container == "#container_3t" || container == "#container_dualpir_lr" || container == "#container_dualpir_lr_aa")
	{
		if (xml_any_o.children("pir_a_present").text() == "1")
			$(container + " .pick_sensibility_a").text(xml_any_o.children("pir_a_sensibility").text());
		else
			$(container + " .sensibility_a").addClass("unavailable");
		if (xml_any_o.children("pir_b_present").text() == "1")
			$(container + " .pick_sensibility_b").text(xml_any_o.children("pir_b_sensibility").text());
		else
			$(container + " .sensibility_b").addClass("unavailable");
	}
	else if (container == "#container_mic")
	{
		$(container+" .pick_sensibility").text(xml_any_o.children("sensibility").text());
		//
		if (xml_any_o.children("sensibility").text() == "-1")
			$(container+" .sensibility").addClass("unavailable");
		//
		if (!$(container+" .sensibility").hasClass("unavailable") && DIY)
			$(container+" .sensibility").addClass("disabled");
	}
}
function item_sensibility_mw(container, xml_any_o)
{
	if (xml_any_o.children("mw_sensibility").text() == "-1")
		$(container + " .sensibility_mw").addClass("invisible");
	else
		$(container + " .pick_sensibility_mw").text(xml_any_o.children("mw_sensibility").text());
}
function item_integration_mw(container, xml_any_o)
{
	if (xml_any_o.children("mw_time").text() == "-1")
		$(container + " .integration_mw").addClass("invisible");
	else
		$(container + " .pick_integration_mw").text(xml_any_o.children("mw_time").text());
}
function item_integration(container, xml_any_o)
{
	if (container == "#container_3t" || container == "#container_dualpir_lr" || container == "#container_dualpir_lr_aa")
	{
		if (xml_any_o.children("pir_a_present").text() == "1")
		{
			if (imq_get())
				$(container + " .pick_integration_a").attr("data-lbound", "4");
			$(container + " .pick_integration_a").text(xml_any_o.children("pir_a_time_integration").text());
		}
		else
		{
			$(container + " .integration_a").addClass("unavailable");
		}
		if (xml_any_o.children("pir_b_present").text() == "1")
		{
			if (imq_get())
				$(container + " .pick_integration_b").attr("data-lbound", "4");
			$(container + " .pick_integration_b").text(xml_any_o.children("pir_b_time_integration").text());
		}
		else
		{
			$(container + " .integration_b").addClass("unavailable");
		}
	}
	else
	{
		if (xml_any_o.children("pir_a_present").text() == "1")
		{
			if (imq_get())
				$(container + " .pick_integration").attr("data-lbound", "4");
			$(container + " .pick_integration").text(xml_any_o.children("pir_a_time_integration").text());
		}
		else if (xml_any_o.children("pir_b_present").text() == "1")
		{
			if (imq_get())
				$(container + " .pick_integration").attr("data-lbound", "4");
			$(container + " .pick_integration").text(xml_any_o.children("pir_b_time_integration").text());
		}
		else
		{
			$(container + " .integration").addClass("invisible");
		}
	}
	//
	if (DIY && !$(container + " .integration").hasClass("invisible"))
		$(container + " .integration").addClass("disabled");
}
function item_shock(container, xml_any_o)
{
	if (xml_any_o.children("shock_lev").text() !== "-1")
	{
		$(container+" .pick_shock_lev").text(xml_any_o.children("shock_lev").text());
	}
	else
	{
		$(container+" .shock_lev").addClass("invisible");
	}
}
var gsm_priority_str = ["{LANG_WIZARD_PRIORITY_GSM_B}", "{LANG_WIZARD_PRIORITY_GSM_A}"];
function item_gsm_priority(container, widget_obj)
{
	widget_obj.gsm_priority = widget_obj.xml_any.children("gsm_priority").text();
	if (widget_obj.gsm_priority >= 0)
	{
		$(container+" .gsm_priority .sl_selector").html(gsm_priority_str[widget_obj.gsm_priority]);
		global_apply_diag(container, "gsm_priority", "{LANG_COMM_PRIORITY}", null, null, widget_obj.name);
	}
	else
	{
		$(container+" .gsm_priority").addClass("invisible");
	}
}
function item_mode_alarm(container, widget_obj)
{
	if (widget_obj.mode == "1")
	{
		$(container + " .mode_alarm .sl_selector").html(xml_file_configuration.find("ReleModeRepeatEvents ReleModeRepeatEvent[id='"+widget_obj.mode_repeat_eve+"']").attr("desc"));
	}
	else if (widget_obj.mode == "2")
	{
		if (widget_obj.cfg_relay_mode == 1) $(container + " .mode_alarm .sl_selector").html("{LANG_RELAY_MONOSTABLE}");
		else if (widget_obj.cfg_relay_mode == 2) $(container + " .mode_alarm .sl_selector").html("{LANG_RELAY_BISTABLE}");
		else if (widget_obj.cfg_relay_mode == 3) $(container + " .mode_alarm .sl_selector").html("{LANG_RELAY_BLIND}");
	}
	//
	global_apply_diag(container, "mode_alarm", "{LANG_RELAY_MODE_ALARM}", null, null, widget_obj.name);
}
function item_timing(container, widget_obj)
{
	if (widget_obj.mode == "2")
	{
		if (widget_obj.cfg_relay_mode == "1")
		{
			$(container+" .pick_timing").text(widget_obj.mode_domo_mono_sec);
			//
			$(container+" .pick_timing").attr("data-lbound", "1");//bounds impostati anche nella diag "mode_alarm" alla pressione di ok
			$(container+" .pick_timing").attr("data-rbound", "999");
		}
		else if (widget_obj.cfg_relay_mode == "2")
		{
			$(container+" .timing")
				.addClass("disabled")
				.find(".pick_timing")
				.text("0");
			//
			$(container+" .pick_timing").attr("data-lbound", "0");//bounds impostati anche nella diag "mode_alarm" alla pressione di ok
			$(container+" .pick_timing").attr("data-rbound", "0");
		}
		else if (widget_obj.cfg_relay_mode == "3")
		{
			$(container+" .pick_timing").text(widget_obj.mode_domo_blind_sec);
			//
			$(container+" .pick_timing").attr("data-lbound", "1");//bounds impostati anche nella diag "mode_alarm" alla pressione di ok
			$(container+" .pick_timing").attr("data-rbound", "120");
		}
	}
	else if (widget_obj.mode == "1")
	{
		var lb = xml_file_configuration.find("ReleModeRepeatEvents ReleModeRepeatEvent[id='" + widget_obj.mode_repeat_eve + "']").attr("sec_lbound");
		var ub = xml_file_configuration.find("ReleModeRepeatEvents ReleModeRepeatEvent[id='" + widget_obj.mode_repeat_eve + "']").attr("sec_ubound");
		//
		if (lb == 0 && ub == 0)
		{
			$(container + " .timing")
				.addClass("disabled")
				.find(".pick_timing")
				.text("0");
		}
		else
		{
			$(container + " .pick_timing").text(widget_obj.mode_repeat_par);
			//
			$(container + " .pick_timing").attr("data-lbound", lb);
			$(container + " .pick_timing").attr("data-rbound", ub);
		}
//		if (widget_obj.mode_repeat_eve < 9)
//		{
//			$(container+" .pick_timing").text(widget_obj.mode_repeat_par);
//			var lb = xml_file_configuration.find("ReleModeRepeatEvents ReleModeRepeatEvent[id='"+widget_obj.mode_repeat_eve+"']").attr("sec_lbound");
//			var ub = xml_file_configuration.find("ReleModeRepeatEvents ReleModeRepeatEvent[id='"+widget_obj.mode_repeat_eve+"']").attr("sec_ubound");
//			$(container+" .pick_timing").attr("data-lbound", lb);
//			$(container+" .pick_timing").attr("data-rbound", ub);
//		}
//		else/* if (widget_obj.mode_repeat_eve < 11)*/
//		{
//			$(container+" .timing")
//				.addClass("disabled")
//				.find(".pick_timing")
//				.text("0");
//		}
	}
	//
	$(container+" .timing .side.arrow").off("pick_extra_func").on("pick_extra_func", function()
	{
		if (widget_obj.mode == "2")
		{
			if (widget_obj.cfg_relay_mode == "1")
			{
				widget_obj.mode_domo_mono_sec = $(container+" .pick_timing").text();
			}
			else if (widget_obj.cfg_relay_mode == "2")
			{
				//
			}
			else if (widget_obj.cfg_relay_mode == "3")
			{
				widget_obj.mode_domo_blind_sec = $(container+" .pick_timing").text();
			}
		}
		else if (widget_obj.mode == "1")
		{
			if (widget_obj.mode_repeat_eve < 9)
			{
				widget_obj.mode_repeat_par = $(container+" .pick_timing").text();
			}
			else if (widget_obj.mode_repeat_eve < 11)
			{
				//
			}
		}
	});
}
function item_mode_wired(container, widget_obj)
{
	if (widget_obj.name == "widget_mod_device_wired_o")
	{
		global_apply_diag(container, "mode_alarm", "{LANG_RELAY_MODE_ALARM}", "wired_mode", null, "widget_mod_device_wired_o");
		//
		if (widget_obj.wire_out_mode == "1")
		{
			$(container+" .mode_alarm .sl_selector").html(xml_file_configuration.find("ReleModeRepeatEvents ReleModeRepeatEvent[id='"+widget_obj.wire_out_mode_repeat_eve+"']").attr("desc"));
		}
		else if (widget_obj.wire_out_mode == "2")
		{
			if (widget_obj.wire_out_mode_domo_par == "0")
				$(container+" .mode_alarm .sl_selector").html("{LANG_RELAY_BISTABLE}");
			else
				$(container+" .mode_alarm .sl_selector").html("{LANG_RELAY_MONOSTABLE}");
		}
	}
}
function item_timing_wired(container, widget_obj)
{
	if (widget_obj.name == "widget_mod_device_wired_o")
	{
		if (widget_obj.wire_out_mode == "1")
		{
			$(container+" .pick_timing").text(widget_obj.wire_out_mode_repeat_par);
			//
			var lb = xml_file_configuration.find("ReleModeRepeatEvents ReleModeRepeatEvent[id='"+widget_obj.wire_out_mode_repeat_eve+"']").attr("sec_lbound");
			var ub = xml_file_configuration.find("ReleModeRepeatEvents ReleModeRepeatEvent[id='"+widget_obj.wire_out_mode_repeat_eve+"']").attr("sec_ubound");
			$(container+" .pick_timing").attr("data-lbound", lb);
			$(container+" .pick_timing").attr("data-rbound", ub);
			//
			if (widget_obj.wire_out_mode_repeat_par == "0")
				$(container+" .timing").addClass("disabled");
		}
		else if (widget_obj.wire_out_mode == "2")
		{
			$(container+" .pick_timing").text(widget_obj.wire_out_mode_domo_par);
			if (widget_obj.wire_out_mode_domo_par == "0")
			{
				$(container+" .timing").addClass("disabled");
				$(container+" .pick_timing").attr("data-lbound", "0");
				$(container+" .pick_timing").attr("data-rbound", "0");
			}
			else
			{
				$(container+" .pick_timing").attr("data-lbound", "1");
				$(container+" .pick_timing").attr("data-rbound", "999");
			}
		}
		//
		$(container+" .timing .side.arrow").off("pick_extra_func").on("pick_extra_func", function()
		{
			if (widget_obj.wire_out_mode == "1")
				widget_obj.wire_out_mode_repeat_par = $(this).siblings(".side.value").children("p").text();
			else if (widget_obj.wire_out_mode == "2")
				widget_obj.wire_out_mode_domo_par = $(this).siblings(".side.value").children("p").text();
		});
	}
}
function item_abilitation(container, widget_obj)
{
	if (widget_obj.mode == "2")
	{
		var trovato = false;
		for (var i = 0; i < widget_obj.xml_sen_oc_tbl.length; i++)
		{
			if (widget_obj.xml_sen_oc_tbl[i].children("id").text() == widget_obj.mode_domo_sen_trigger_id)
			{
				$(container + " .abilitation .sl_selector").html(widget_obj.xml_sen_oc_tbl[i].children("name").text());
				trovato = true;
				break;
			}
		}
		if (!trovato)
			$(container + " .abilitation .sl_selector").html("{LANG_NO_SETUP}");
	}
	else	
	{
		$(container + " .abilitation .sl_selector").html("{LANG_NO_SETUP}");
		$(container + " .abilitation").addClass("disabled");
		widget_obj.mode_domo_sen_trigger_id = 0;
	}
	global_apply_diag(container, "abilitation", "{LANG_RELAY_ABILITATION}", null, null, widget_obj.name);
}
function item_trigger_relay(container, widget_obj)
{
	if (widget_obj.mode == "2")
	{
		if
		(
			widget_obj.mode_domo_sen_a_id == "0"
			&& widget_obj.mode_domo_sen_b_id == "0"
			&& widget_obj.mode_domo_sen_c_id == "0"
		)
			$(container + " .trigger_relay .sl_selector").html("{LANG_NO_SETUP}");
		else
			$(container + " .trigger_relay .sl_selector").html("{LANG_ITEM_AT_LEAST_ONE}");
		//
		if (widget_obj.cfg_relay_mode == "3")
			$(container + " .trigger_relay").addClass("disabled");
	}
	else
	{
		$(container + " .trigger_relay .sl_selector").html("{LANG_NO_SETUP}");
		$(container + " .trigger_relay").addClass("disabled");
		widget_obj.mode_domo_sen_a_id = "0";
		widget_obj.mode_domo_sen_b_id = "0";
		widget_obj.mode_domo_sen_c_id = "0";
	}
	global_apply_diag(container, "trigger_relay", "{LANG_TRIGGER}", null, null, widget_obj.name);
}
function item_real_relay(container, widget_obj)
{
	if (widget_obj.xml_any.children("model").text() == "AFR02R-DB")
	{
		if (widget_obj.cfg_relay_cfm_exe_ext == "0")
			$(container+" .real_relay .sl_selector").html("{LANG_NO_SETUP}");
		else if (widget_obj.cfg_relay_cfm_exe_ext == "1")
			$(container+" .real_relay .sl_selector").html("{LANG_RELAY_MOR_NC}");
		else if (widget_obj.cfg_relay_cfm_exe_ext == "2")
			$(container+" .real_relay .sl_selector").html("{LANG_RELAY_MOR_NO}");
		//
		global_apply_diag(container, "real_relay", "{LANG_RELAY_REAL}", null, null, widget_obj.name);
	}
	else
	{
		$(container + " .real_relay").addClass("unavailable");
	}
}
function item_dev_events(container, widget_obj)
{
	widget_obj.events[0] = {
		type: widget_obj.xml_any.find("keys key[id='7'] type").text(),
		par: widget_obj.xml_any.find("keys key[id='7'] par").text()
	};
	widget_obj.events[1] = {
		type: widget_obj.xml_any.find("keys key[id='5'] type").text(),
		par: widget_obj.xml_any.find("keys key[id='5'] par").text()
	};
	widget_obj.events[2] = {
		type: widget_obj.xml_any.find("keys key[id='6'] type").text(),
		par: widget_obj.xml_any.find("keys key[id='6'] par").text()
	};
	//
	widget_obj.events_array_init_flg = true;
	//
	for(var i = 0; i < $(container+" .event").length; i++)
	{
		switch(widget_obj.events[i].type)
		{
			case "VOID":
				$(container+" .event:eq("+i+") .sl_selector").html("{LANG_NO_SETUP}");
				break;
			case "M":
				$(container+" .event:eq("+i+") .sl_selector").html("{LANG_FIRST_AID}");
				break;
			case "R":
				$(container+" .event:eq("+i+") .sl_selector").html("{LANG_AGGRESSION}");
				break;
			case "P":
				$(container+" .event:eq("+i+") .sl_selector").html("{LANG_PANIC}");
				break;
			case "DOMO":
				if (widget_obj.associative_xml_relay_domo_tbl[widget_obj.events[i].par] != null)
					$(container+" .event:eq("+i+") .sl_selector").html(widget_obj.associative_xml_relay_domo_tbl[widget_obj.events[i].par].children("name").text());
				break;
			case "SCENE":
				$(container+" .event:eq("+i+") .sl_selector").html(xml_file_configuration.find("Scenes Scene[id='S"+widget_obj.events[i].par+"']").attr("desc"));
				break;
			default:
				break;
		}
	}
	//
	global_apply_diag(container, "event.one", "{LANG_BUTTON_EVENT_1}", "diag_events", "0", widget_obj.name);
	global_apply_diag(container, "event.two", "{LANG_BUTTON_EVENT_2}", "diag_events", "1", widget_obj.name);
	global_apply_diag(container, "event.three", "{LANG_BUTTON_EVENT_3}", "diag_events", "2", widget_obj.name);
}
function item_dev_areas(container, widget_obj)
{
	var ins_selector = "";
	var dis_selector = "";
	var insp_selector = "";
	if (widget_obj.name.indexOf("_rem") > -1)
	{
		ins_selector = "keys key[id='1'] par";
		dis_selector = "keys key[id='2'] par";
		insp_selector = "keys key[id='3'] par";
	}
	else if (widget_obj.name.indexOf("_rfid") > -1)
	{
		ins_selector = "area_ins";
		dis_selector = "area_dis";
		insp_selector = "area_insp";
	}
	else if (widget_obj.name.indexOf("_user") > -1)
	{
		ins_selector = "area_ins";
		dis_selector = "area_dis";
		insp_selector = "area_grp";
	}
	else if (widget_obj.name.indexOf("_bus_tag_reader") > -1)
	{
		ins_selector = "area_ins";
		dis_selector = "area_dis";
		insp_selector = "area_insp";
	}
	else if (widget_obj.name.indexOf("_set_device_bus") > -1)
	{
		if (widget_obj.subcat == WS_DEV_ALARM_BUS_REM_STR)
		{
			ins_selector = "keys key[id='1'] par";
			dis_selector = "keys key[id='2'] par";
			insp_selector = "keys key[id='3'] par";
		}
		else
		{
			ins_selector = "area_ins";
			dis_selector = "area_dis";
			insp_selector = "area_insp";	
		}
	}
	else
	{
		alert("ERR: widget name not found");
	}
	//
	var area_dis_str = widget_obj.xml_any.find(dis_selector).text();
	for (var i = 0; i < area_dis_str.length; i++)
	{
		if (area_dis_str.charAt(i) == "-")
			widget_obj.area_dis[i] = 0;
		else
			widget_obj.area_dis[i] = 1;
	}
	//
	var area_insp_str = widget_obj.xml_any.find(insp_selector).text();
	for (var i = 0; i < area_insp_str.length; i++)
	{
		if (area_insp_str.charAt(i) == "-")
			widget_obj.area_insp[i] = 0;
		else
			widget_obj.area_insp[i] = 1;
	}
	//
	var area_ins_str = widget_obj.xml_any.find(ins_selector).text();
	for (var i = 0; i < area_ins_str.length; i++)
	{
		if (area_ins_str.charAt(i) == "-")
		{
			widget_obj.area_ins[i] = 0;
			widget_obj.area_insp[i] = -1;
		}
		else
		{
			widget_obj.area_ins[i] = 1;
		}
	}
	//
	$(container+" .area_ins .sl_selector").html(widget_obj.aa_to_str(widget_obj.area_ins));
	$(container+" .area_dis .sl_selector").html(widget_obj.aa_to_str(widget_obj.area_dis));
	$(container+" .area_insp .sl_selector").html(widget_obj.aa_to_str(widget_obj.area_insp));
	//
	global_apply_diag(container, "area_ins", "{LANG_TOTAL_AREA_INS}", "diag_areas", "INS", widget_obj.name);
	global_apply_diag(container, "area_dis", "{LANG_TOTAL_AREA_DIS}", "diag_areas", "DIS", widget_obj.name);
	global_apply_diag(container, "area_insp", "{LANG_PARTIAL_AREA_INS}", "diag_areas", "INSP", widget_obj.name);
}
function area_ena_check(idx) //l'indice delle aree parte da 1
{
	return area_list.find("par item id:contains(" + idx + ")").siblings("ena").text() == "TRUE";
}
function init_rem(container, widget_obj)
{
	var i = 0;
	for(var key in widget_obj.guiRemId)
	{
		var gui_item = $(container + " .rem_func:eq(" + (i++) + ")");
		gui_item.addClass(key);
		global_apply_diag(container, key, $(container + " ." + key + " .tt_selector").text(), "rem_mode", null/*extra*/, widget_obj.name, null);
		//
		var type = widget_obj.xml_any.find("keys key[id='" + widget_obj.guiRemId[key].trama_idx + "'] type").text();
		if (widget_obj.remToggleId[type] == null)
			continue;
		if (widget_obj.remToggleId[type].mode == REM_MODE_1) // == area
		{
			$(container + " ." + key + " .sl_selector").text(widget_obj.format_area_sl(widget_obj.xml_any.find("keys key[id='" + widget_obj.guiRemId[key].trama_idx + "'] par").text()));
		}
		else if (widget_obj.remToggleId[type].mode == REM_MODE_2) // == domo
		{
			var data_id = widget_obj.xml_any.find("keys key[id='" + widget_obj.guiRemId[key].trama_idx + "'] par").text();
			$(container + " ." + key + " .sl_selector").text(widget_obj.associative_xml_relay_domo_tbl[data_id].children("name").text());
		}
		else if (widget_obj.remToggleId[type].mode == REM_MODE_3) // == scene
		{
			var data_id = widget_obj.xml_any.find("keys key[id='" + widget_obj.guiRemId[key].trama_idx + "'] par").text();
			$(container + " ." + key + " .sl_selector").text(xml_file_configuration.find("Scenes Scene[id='S" + data_id + "']").attr("desc"));
		}
		else if (widget_obj.remToggleId[type].mode == REM_MODE_4) // == autom
		{
			var data_id = widget_obj.xml_any.find("keys key[id='" + widget_obj.guiRemId[key].trama_idx + "'] par").text();
			$(container + " ." + key + " .sl_selector").text("{LANG_REM_AUTOMATION}" + " " + (Number(data_id) + 1));
		}
		else
		{
			$(container + " ." + key + " .sl_selector").text(widget_obj.remToggleId[type].tag);
		}
	}
}
function load_areas_diag_mask(container, mask)
{
	$(container + " .diag_button.item").each(function()
	{
		var id = $(this).attr("data-id");
		var desc_resp = null;
		desc_resp = area_list.find("item")
			.filter(function()
			{
				if ($(this).children("name").text() == id)
					return true;
				else return false;
			}).children("desc").text();
		$(this).attr("data-id", id).children(".area_label").text(id + " - " + desc_resp);
		//
		if (mask.charAt(id - 1) == "-")
			$(".switcher", this).trigger("switch_state_changer", [["off", area_ena_check(id) ? "" : "disabled"]]);
		else
			$(".switcher", this).trigger("switch_state_changer", [["on", area_ena_check(id) ? "" : "disabled"]]);
	});
}
function load_areas_diag(container, widget_obj, area_type)
{
	$(container + " .diag_button.item").each(function()
	{
		var id = $(this).attr("data-id");
		var desc_resp = null;
		desc_resp = area_list.find("item")
			.filter(function()
			{
				if ($(this).children("name").text() == id)
					return true;
				else return false;
			}).children("desc").text();
		//
		if (desc_resp == null || desc_resp == undefined || desc_resp == "")
		{
			$(".switcher", this).trigger("switch_state_changer", [["disabled"]]);
		}
		else
		{
			$(".area_label", this).text(id + " - " + desc_resp);
			$(this).attr("data-id", id);
		}
		//
		var area_array = [];
		if (area_type == "INS")
			area_array = widget_obj.area_ins;
		else if (area_type == "DIS")
			area_array = widget_obj.area_dis;
		else if (area_type == "INSP")
			area_array = widget_obj.area_insp;
		//
		if (area_array[id - 1] == 0)
			$(".switcher", this).trigger("switch_state_changer", [["off", area_ena_check(id) ? "" : "disabled"]]);
		else if (area_array[id - 1] == 1)
			$(".switcher", this).trigger("switch_state_changer", [["on", area_ena_check(id) ? "" : "disabled"]]);
		else if (area_array[id - 1] == -1)
			$(".switcher", this).trigger("switch_state_changer", [["disabled"]]);
	});
}
function item_photo(container, widget_obj)
{
	global_picker_init(container, "snapshot_delay_sec", "photo", widget_obj);
}
function item_frame(container, widget_obj)
{
	global_picker_init(container, "snapshot_frame_cnt", "frame", widget_obj);
}
function item_visual(container, widget_obj, cam_id)
{
	var command_cam = xml_file_configuration.find("Devices Device[id='"+cam_id+"'][deleted='FALSE'] Commands").text();
	//
	$(container+" #get_frame").off("click").click(function()
	{
		if (!$(this).hasClass("disabled"))
		{
			xml_request = xml_request_head_build("DEVICE_CMD", widget_obj.name);
			xml_par = $(XML("Command")); xml_par.text(command_cam); xml_request.append(xml_par);
			xml_par = $(XML("Device")); xml_par.text(cam_id); xml_request.append(xml_par);
			xml_send(xml_request);
			//
			if (widget_obj.name == "widget_mod_device_tvcc")
			{
				$("#container_tvcc .visual .info").html("{LANG_ACQUIRING}");
				$("#container_tvcc #get_frame").addClass("disabled");
			}
			//
			//richiesta doppia perche' il primo fotogramma potrebbe essere vuoto
			if (widget_obj.uansciot_fleg)
			{
				setTimeout(function()
				{
					xml_request = xml_request_head_build("DEVICE_CMD", widget_obj.name);
					xml_par = $(XML("Command")); xml_par.text(command_cam); xml_request.append(xml_par);
					xml_par = $(XML("Device")); xml_par.text(cam_id); xml_request.append(xml_par);
					xml_send(xml_request);
				}, 6*1000);
				widget_obj.uansciot_fleg = false;
			}
		}
	}).show();
}
function item_tvcc(container, widget_obj)
{
	widget_obj.xml_any.find("tvccs tvcc").each(function()
	{
		if ($(this).children("id").text() != "0")
		{
			widget_obj.trovata_tvcc = true;
			if ($(this).children("ena").text() == "1")
				widget_obj.attivata_tvcc = true;
		}
	});
	//
	if (widget_obj.trovata_tvcc)
		global_apply_diag(container, "tvcc", "{LANG_WIZARD_MOD_DEVICE_TVCC}", "tvcc_list", "initial_delay_sec", widget_obj.name);
	else
		$(container+" .tvcc").addClass("disabled");
	//
	if (widget_obj.attivata_tvcc)
		$(container+" .tvcc .sl_selector").html("{LANG_ITEM_AT_LEAST_ONE}");
	else
		$(container+" .tvcc .sl_selector").html("{LANG_ITEM_NONE}");
}
function item_tvcc_delay_initial(container, widget_obj)
{
	global_picker_init(container, "tvccs_initial_delay_sec", "initial_delay_sec", widget_obj, widget_obj.attivata_tvcc ? null : "invisible");
}
function item_dhcp(container, widget_obj)
{
	if (type_conn == "AP" || type_conn == "NN" || type_conn == null)
	{
		$(container + " .dhcp").addClass("unavailable").off("toggle_tick_click");
	}
	else
	{
		global_switcher_binder(container, "dhcp", null, "GUI");
		//
		if (widget_obj.xml_any.children("ip").text() == "0.0.0.0")
			$(container + " .dhcp").trigger("switch_state_changer", [["enabled"]]);
		else
			$(container + " .dhcp").trigger("switch_state_changer", [["disabled"]]);
		//
		$(container + " .dhcp").off("toggle_tick_click").on("toggle_tick_click", function()
		{
			if ($(this).attr("data-checked") == "1")
				$(container + " .ip").addClass("invisible");
			else
				$(container + " .ip").removeClass("invisible");
		}).trigger("click");
	}
}
function item_ip(container, widget_obj)
{
	if (type_conn == "AP" || type_conn == "NN" || type_conn == null)
		$(container+" .ip").addClass("unavailable");
	else
		global_item_init(container, "ip_input", "input", "ip", widget_obj);
}
function item_pulse_flg(container, widget_obj)
{
	if (widget_obj.xml_any.children("pulse_flg").text() == "-1")
	{
		$(container+" .pulse_flg").addClass("unavailable");
	}
	else
	{
		$(container+" .pulse_flg .sl_selector").html(widget_obj.pulse_flg == "0" ? "{LANG_RELAY_BISTABLE}" : "{LANG_WIZARD_WIRED_PULSEMODE}");
		global_apply_diag(container, "pulse_flg", "{LANG_WIZARD_WIRED_KEYIN}", "wired_pulse", null, widget_obj.name);
	}
}
function item_rescue(container, item, widget_obj)
{
	var localRescue = (widget_obj.xml_scenes["S1"].attr("home") == "TRUE" ? "1" : "0");
	global_switcher_binder(container, item, null, localRescue);
}
function item_panic(container, item, widget_obj)
{
	var localPanic = (widget_obj.xml_scenes["S2"].attr("home") == "TRUE" ? "1" : "0");
	global_switcher_binder(container, item, null, localPanic);
}
function item_aggression(container, item, widget_obj)
{
	var localAggression = (widget_obj.xml_scenes["S3"].attr("home") == "TRUE" ? "1" : "0");
	global_switcher_binder(container, item, null, localAggression);
}
function loadVig(vigItems, widget_obj)
{
	widget_obj.xml_vig = vigItems;
	var transmission_label = ["{LANG_WIZARD_TRANSMISSION}", "{LANG_WIZARD_TRANSMISSION_2}", "{LANG_WIZARD_SIA_DIGITAL_PROTOCOL_TRANSMISSION}", "{LANG_WIZARD_SIA_DIGITAL_PROTOCOL_TRANSMISSION_2}"];
	var notification_label = ["{LANG_WIZARD_NOTIFICATION}", "{LANG_WIZARD_NOTIFICATION_2}", "{LANG_WIZARD_SIA_DIGITAL_PROTOCOL_NOTIFICATION}", "{LANG_WIZARD_SIA_DIGITAL_PROTOCOL_NOTIFICATION_2}"];
	//
	vigItems.find("item").each(function()
	{
		//preparazione elementi struttura
		var AStype = $(this).children("type").text(); // adem sia type
		if (AStype == "0") //adem
		{
			var telNumA = $(this).children("telnum_a").text();
			var telNumB = $(this).children("telnum_b").text();
			//
			var telNumAMax = $(this).children("telnum_a").attr("maxlength");
			var telNumAMin = $(this).children("telnum_a").attr("minlength");
			var telNumBMax = $(this).children("telnum_b").attr("maxlength");
			var telNumBMin = $(this).children("telnum_b").attr("minlength");
		}
		else if (AStype == "1") //sia
		{
//			var telNumBack = $(this).children("sms_telnum").text();
			var ipAdr = $(this).children("ip_adr").text();
			var ipPort = $(this).children("ip_port").text();
//			var periodicMin = $(this).children("periodic_min").text();
//			var periodicMinBounds = "["+$(this).children("periodic_min").attr("lbound")+","+$(this).children("periodic_min").attr("rbound")+"]";
//			var periodicEna = $(this).children("periodic_ena_flg").text();
			var udpFlag = $(this).children("udp_flg").text();
			var prot = $(this).children("prot").text();
			//
//			var telNumBackMax = $(this).children("sms_telnum").attr("maxlength");
//			var telNumBackMin = $(this).children("sms_telnum").attr("minlength");
			var aeskey = $(this).children("aeskey").text();
		}
		var enaFlag = $(this).children("ena_flg").text();
		var invFlag = $(this).children("inv_flg").text(); // adem sia type
		var contactId = $(this).children("code").text();
		//
		var contactIdMax = $(this).children("code").attr("maxlength");
		var contactIdMin = $(this).children("code").attr("minlength");
		//
		var itemId = $(this).children("id").text();
		var guiItems = $("#container_parvig .vig").filter(function()
		{
			if ($(this).hasAttr("data-id"))
				return false;
			else return true;
		}).first();
		var guiId = null;
		if (guiItems.length > 0)
		{
			guiId = itemId;
			guiItems.attr("data-id", guiId);
		}
		//riempimento struttura
		if (AStype == "0") //adem
		{
			widget_obj.notifyStruct[itemId] = 
			{
				guiId: guiId,
				AStype: AStype,
				enaFlag: enaFlag,
				invFlag: invFlag,
				contactId: contactId,
				//
				telNumA: telNumA,
				telNumB: telNumB,
				//
				events: []
			};
			widget_obj.checkSaveStruct[itemId] = 
			{
				guiId: guiId,
				AStype: AStype,
				enaFlag: enaFlag,
				invFlag: invFlag,
				contactId: contactId,
				//
				telNumA: telNumA,
				telNumB: telNumB,
				//
				events: []
			};
		}
		else if (AStype == "1") //sia
		{
			widget_obj.notifyStruct[itemId] = 
			{
				guiId: guiId,
				AStype: AStype,
				enaFlag: enaFlag,
				invFlag: invFlag,
				contactId: contactId,
				//
//				telNumBack: telNumBack,
				ipAdr: ipAdr,
				ipPort: ipPort,
//				periodicMin: periodicMin,
//				periodicEna: periodicEna,
				udpFlag: udpFlag,
				prot: prot,
				aeskey: aeskey,
				//
				events: []
			};
			widget_obj.checkSaveStruct[itemId] = 
			{
				guiId: guiId,
				AStype: AStype,
				enaFlag: enaFlag,
				invFlag: invFlag,
				contactId: contactId,
				//
//				telNumBack: telNumBack,
				ipAdr: ipAdr,
				ipPort: ipPort,
//				periodicMin: periodicMin,
//				periodicEna: periodicEna,
				udpFlag: udpFlag,
				prot: prot,
				aeskey: aeskey,
				//
				events: []
			};
		}
		//riempimento events
		var trovEnaNotify = false;
		$(this).find("events event").each(function()
		{
			var ena = $(this).attr("ena");
			var areas = $(this).attr("areas");
			//
			if (ena == "1")
				trovEnaNotify = true;
			//
			widget_obj.notifyStruct[itemId].events[$(this).attr("id")] = 
			{
				ena: ena,
				areas: areas
			}
			widget_obj.checkSaveStruct[itemId].events[$(this).attr("id")] = 
			{
				ena: ena,
				areas: areas
			}
		});
		//"disegno"
		//ena
		if (guiId != null)
		{
			//ena
			global_switcher_binder("#container_parvig .vig[data-id=" + guiId + "]", "ena", null, enaFlag);
			$("#container_parvig .vig[data-id=" + guiId + "] .ena").on("toggle_tick_click", function()
			{
				//var perenaflg = $("#container_parvig .vig[data-id="+guiId+"] .periodicEna").attr("data-checked");
				if ($(this).attr("data-checked") == "0")
				{
					$(this).closest(".global_item").siblings().not(".title").addClass("disabled");
					$(this).closest(".global_item").siblings().not(".title").children("input").prop("disabled", true);				
				}
				else
				{
					$(this).closest(".global_item").siblings().not(".title").removeClass("disabled");
					$(this).closest(".global_item").siblings().not(".title").children("input").prop("disabled", false);
				}
			}).trigger("toggle_tick_click");
			// nome utente - contactId
			global_item_init("#container_parvig", "vig[data-id="+guiId+"] .contactId", "input", null, null, null, contactId, contactIdMax);
			// modalita' di trasmissione diretta inversa
			guiItems.find(".transmission .sl_selector").html(invFlag == 1 ? "{LANG_INVERSE}" : "{LANG_DIRECT}");
			global_apply_diag("#container_parvig", "vig[data-id="+guiId+"] .transmission", transmission_label[guiId-1], "transmission", guiId, "widget_parvig");
			// eventi - notifiche
			guiItems.find(".notification .sl_selector").html(trovEnaNotify ? "{LANG_ITEM_AT_LEAST_ONE}" : "{LANG_DISABLED}"); //eventi - notifiche
			global_apply_diag("#container_parvig", "vig[data-id="+guiId+"] .notification", notification_label[guiId-1], "notification", guiId, "widget_parvig");
			//
			if (AStype == "0")
			{
				global_item_init("#container_parvig", "vig[data-id="+guiId+"] .telNumA", "input", null, null, null, telNumA, telNumAMax);
				global_item_init("#container_parvig", "vig[data-id="+guiId+"] .telNumB", "input", null, null, null, telNumB, telNumBMax);
			}
			else if (AStype == "1")
			{
//				global_item_init("#container_parvig", "vig[data-id="+guiId+"] .telNumBack", "input", null, null, null, telNumBack, telNumBackMax);
				global_item_init("#container_parvig", "vig[data-id="+guiId+"] .ipAdr", "input", null, null, null, ipAdr);
				global_item_init("#container_parvig", "vig[data-id="+guiId+"] .ipPort", "input", null, null, null, ipPort);
//				global_picker_init_simple("#container_parvig", "vig[data-id="+guiId+"] .periodicMin", "periodicMin", periodicMin, null, periodicMinBounds);
//				$("#container_parvig .vig[data-id="+guiId+"] .periodicEna").on("toggle_tick_click", function()
//				{
//					if ($(this).attr("data-checked") == 0)
//						$("#container_parvig .vig[data-id="+guiId+"] .periodicMin").addClass("invisible");
//					else if ($(this).attr("data-checked") == 1)
//						$("#container_parvig .vig[data-id="+guiId+"] .periodicMin").removeClass("invisible");
//				}).trigger("toggle_tick_click");
				//
				guiItems.find(".tcpudp .sl_selector").html(udpFlag == "1" ? "{LANG_UDP}" : "{LANG_TCP}");
				global_apply_diag("#container_parvig", "vig[data-id="+guiId+"] .tcpudp", "{LANG_WIZARD_TCPUDP_MODE}", "tcpudp", guiId, "widget_parvig");
				//
				guiItems.find(".aeskey_val").val(aeskey);
				guiItems.find(".prot .sl_selector").html(prot == "2" ? "{LANG_SIA_ADEM_CID}" : "{LANG_SIA_DCS}");
				global_apply_diag("#container_parvig", "vig[data-id="+guiId+"] .prot", "{LANG_WIZARD_PROT}", "prot", guiId, "widget_parvig");
				if (prot == "2")
				{
					$("#container_parvig .vig[data-id="+guiId+"] .transmission").removeClass("unavailable");
					$("#container_parvig .vig[data-id="+guiId+"] .aeskey").addClass("hider");
				}
				else
				{
					$("#container_parvig .vig[data-id="+guiId+"] .transmission").addClass("unavailable");
					$("#container_parvig .vig[data-id="+guiId+"] .aeskey").removeClass("hider");	
				}
			}
		}
	});
}
//
function item_repeater_startstop(container, widget_obj)
{
	global_switcher_binder(container, "startstopbinder", widget_obj.xml_any, 0);
	$(container + " #start_stop").off("triclick").on("triclick", function()
	{
		if ($(this).hasClass("start"))
		{
			$(this).switchClass("start", "disabled");
			$(this).siblings(".switcher").switchClass("stopped", "starting").trigger("switch_state_changer", [["on"]]);
			//
			widget_obj.pair_start();
			//
			var start_obj = $(this);
			widget_obj.t_out_start = setTimeout(function()
			{
				widget_obj.allow_start = false;
				//
				start_obj.switchClass("disabled", "start");
				start_obj.siblings(".switcher").switchClass("starting", "stopped").trigger("switch_state_changer", [["off"]]);
				//
				widget_obj.pair_stop();
			}, 20 * 1000);
			//
			widget_obj.allow_start = true;
		}
		else if ($(this).hasClass("stop"))
		{
			$(this).switchClass("stop", "disabled");
			$(this).siblings(".switcher").switchClass("started", "starting"); //passa allo stato intermedio che si chiama starting
			//
			widget_obj.pair_stop();
			//
			var start_obj = $(this);
			widget_obj.t_out_stop = setTimeout(function()
			{
				widget_obj.allow_stop = false;
				//
				start_obj.switchClass("disabled", "stop"); //stop non è l'azione in corso ma quella che si vuole attivare
				start_obj.siblings(".switcher").switchClass("starting", "started");
				//
				widget_obj.pair_start();
			}, 20 * 1000);
			//
			widget_obj.allow_stop = true;
		}
	});
	$("#start_stop").parent().off("click").click(function()
	{
		$("#start_stop").trigger("triclick");
	});
}
function item_photopir_mac(container, widget_obj)
{
	$(container + " #photopir_mac").text(widget_obj.xml_any.children("photopir_mac").text());
}
//
function item_address_mode(container, widget_obj)
{
	var addrm = Number(widget_obj.xml_any.children("ip_address_mode_flg").text());
	if (addrm == 0)
	{
		$(container + " .tvcc_mac").parent().removeClass("unavailable");
		$(container + " .tvcc_ip").parent().addClass("unavailable");
		$(container + " .ip_address_mode_flg .sl_selector").html("{LANG_TVCC_MAC}");
	}
	else if (addrm == 1)
	{
		$(container + " .tvcc_mac").parent().addClass("unavailable");
		$(container + " .tvcc_ip").parent().removeClass("unavailable");
		$(container + " .ip_address_mode_flg .sl_selector").html("{LANG_TVCC_IP}");
	}
	//
	global_apply_diag(container, "ip_address_mode_flg", "{LANG_TVCC_MAC_IP}", "address_mode", null, widget_obj.name, null);	
}
//
function item_ala_eve(container, widget_obj)
{
	var dev_eve_size = $(container + " .dev_ala_eve").length;
	//
	if (widget_obj.ala_eve_msk.length == 0)
		for(var i = 0; i < dev_eve_size; i++)
			widget_obj.ala_eve_msk += "0";
	widget_obj.xml_any.children("ala_eve_msk").text(widget_obj.ala_eve_msk);
	//
	for(var i = 0; i < dev_eve_size; i++)
	{
		var sl_label = widget_obj.ala_eve_state_str[Number(widget_obj.ala_eve_msk.charAt(i))];	
		$("#" + widget_obj.ala_eve_id[i] + " .sl_selector").html(sl_label);
		global_apply_diag("", "#" + widget_obj.ala_eve_id[i], $("#" + widget_obj.ala_eve_id[i] + " .tt_selector").html(), "dev_ala_eve", i, widget_obj.name, null);
	}	
}
//
function main_iot_dom_state_changer()
{
	if 
	(
		autom_iot_mask[WS_DEV_ALARM_AVE_AUTOMATION_STR] == WS_DEV_ALARM_AVE_AUTOMATION_CONNECTED_OK_STR
		&& !(autom_iot_mask[WS_DEV_ALARM_IOT_STR] == WS_DEV_ALARM_AVE_IOT_CONNECTED_OK_STR)
	)
	{
		$("#i_name").off("click").click(function()
		{
			pag_change(".home .JSdialog", "widget_popwarn", "", "{LANG_SUPERV_DOMO_OK}" + autom_ip, "ok", null);
		}).removeClass("fnt_rd fnt_gr").addClass("fnt_az");
	}
	else if
	(
		!(autom_iot_mask[WS_DEV_ALARM_AVE_AUTOMATION_STR] == WS_DEV_ALARM_AVE_AUTOMATION_CONNECTED_OK_STR)
		&& !(autom_iot_mask[WS_DEV_ALARM_AVE_AUTOMATION_STR] == WS_DEV_ALARM_AVE_AUTOMATION_CONNECTED_KO_STR)
		&& autom_iot_mask[WS_DEV_ALARM_IOT_STR] == WS_DEV_ALARM_AVE_IOT_CONNECTED_OK_STR
	)
	{
		$("#i_name").off("click").click(function()
		{
			pag_change(".home .JSdialog", "widget_popwarn", "", "{LANG_SUPERV_IOT_OK}" + iot_ip, "ok", null);
		}).removeClass("fnt_rd fnt_gr").addClass("fnt_az");
	}
	else if
	(
		autom_iot_mask[WS_DEV_ALARM_AVE_AUTOMATION_STR] == WS_DEV_ALARM_AVE_AUTOMATION_CONNECTED_OK_STR
		&& autom_iot_mask[WS_DEV_ALARM_IOT_STR] == WS_DEV_ALARM_AVE_IOT_CONNECTED_OK_STR
	)
	{
		$("#i_name").off("click").click(function()
		{
			pag_change(".home .JSdialog", "widget_popwarn", "", "{LANG_SUPERV_DOMO_OK}" + autom_ip + "<br><br><br> {LANG_SUPERV_IOT_OK}" + iot_ip, "ok", null);
		}).removeClass("fnt_rd fnt_az").addClass("fnt_gr");
	}
	else if
	(
		autom_iot_mask[WS_DEV_ALARM_AVE_AUTOMATION_STR] == WS_DEV_ALARM_AVE_AUTOMATION_CONNECTED_KO_STR
		&& !(autom_iot_mask[WS_DEV_ALARM_IOT_STR] == WS_DEV_ALARM_AVE_IOT_CONNECTED_OK_STR)
	)
	{
		$("#i_name").off("click").click(function()
		{
			pag_change(".home .JSdialog", "widget_popwarn", "", "{LANG_SUPERV_DOMO_KO}" + autom_ip + "{LANG_SUPERV_DOMO_KO2}", "ok", null);
		}).removeClass("fnt_az fnt_gr").addClass("fnt_rd");
	}
	else if
	(
		autom_iot_mask[WS_DEV_ALARM_AVE_AUTOMATION_STR] == WS_DEV_ALARM_AVE_AUTOMATION_CONNECTED_KO_STR
		&& autom_iot_mask[WS_DEV_ALARM_IOT_STR] == WS_DEV_ALARM_AVE_IOT_CONNECTED_OK_STR
	)
	{
		$("#i_name").off("click").click(function()
		{
			pag_change(".home .JSdialog", "widget_popwarn", "", "{LANG_SUPERV_DOMO_KO}" + autom_ip + "{LANG_SUPERV_DOMO_KO2} <br><br><br> {LANG_SUPERV_IOT_OK}" + iot_ip, "ok", null);
		}).removeClass("fnt_az fnt_gr").addClass("fnt_rd");
	}
	else
	{
		$("#i_name").off("click").removeClass("fnt_az fnt_gr fnt_rd");
	}
}
//
function tslotf(container, xml_any_o)
{
	var tmsk = xml_any_o.children("timeslot_msk").text();
	if (tmsk.length == 0)
		tmsk = "0";
	var i = 0, k = 0;
	while (i < TSLOTSNUM)
	{
		$("#tse" + i).parent().find(".item_tag").text(tslotNames[i]);
		global_switcher_binder(container, "#tse" + i, null, tmsk[k], null, null);
		if (k + 1 < tmsk.length)
			k++;
		i++;
	}
}
//
function item_light_sec(container, widget_obj)
{
	global_picker_init(container, "light_sec", null, widget_obj, null, null);
}
function item_light_perc(container, widget_obj)
{
	global_picker_init(container, "light_perc", null, widget_obj, null, null);
}
function item_signal(container, widget_obj)
{
	if (Number(widget_obj.xml_any.find("volume").text()) > 1)
		widget_obj.xml_any.find("volume").text("1");
	global_switcher_binder(container, "volume", widget_obj.xml_any, null, null, null);
}
//***********************//
//******** SAVES ********//
//***********************//
function save_item_area(area_container_str, widget_obj)
{
	var area_str = "";
	for(var i = 1; i < area_list.find("item").length + 1; i++)
	{
		area_str += ($(area_container_str + " .area .switcher[data-id='" + i + "']").attr("data-checked") == "1") ? i : "-";
	}
	if (area_str == area_off_all_str)
	{
		ena_save = false;
		pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_SELECT_ATLEAST_ONEAREA}", "ok", null, null);
	}
	else
	{
		widget_obj.xml_any.find("area_alarm").text(area_str);
	}
	return area_str;
}
function save_item_mode(container, xml_any_o, widget_obj)// X item_area_and_wrapper
{
	if ("mode_bus_rf" in widget_obj)
	{
		xml_any_o.children("mode").text(widget_obj.mode_bus_rf);
	}
	else
	{
		if (and_function_dev != DELAYED)
			xml_any_o.children("mode").text(MATCH_DEV);
		else if ($(container + " .area_and").attr("data-checked") == "1") // != DELAYED
			xml_any_o.children("mode").text(MATCH_AREA);
		else
			xml_any_o.children("mode").text(DELAYED);
	}
}
function save_item_toggled(container, trama_tag, item_name, xml_any_o, invert, force_flg)
{
	item_name = item_name || trama_tag;
	var item = $(container + " ." + item_name);
	force_flg = force_flg || false;
	//
	if 
	(
		!force_flg
		&&
		(
			item.parent().hasClass("invisible")
			|| item.parent().hasClass("unavailable")
			|| item.hasClass("invisible")
			|| item.hasClass("unavailable")
			|| item.hasClass("disabled")
		)
	)
	{}
	else
	{
		if (invert)
			xml_any_o.children(trama_tag).text(1 - Number(item.attr("data-checked")));
		else
			xml_any_o.children(trama_tag).text(item.attr("data-checked"));
	}
}
function save_item_toggled_manual(container, item_name, trama_tag, xml_any_o, widget_obj)
{
	xml_any_o = xml_any_o || widget_obj.xml_any;
	trama_tag = trama_tag || item_name;
	//
	if 
	(
		!$(container+" ."+item_name).hasClass("invisible") 
		&& !$(container+" ."+item_name).hasClass("unavailable")
		&& !$(container+" ."+item_name).hasClass("disabled")
	)
	{
		xml_any_o.children(trama_tag).text($(container+" ."+item_name).attr("data-checked"));
	}
}
function save_item_picker(container, trama_tag, item_name, xml_any_o)
{
	item_name = item_name || trama_tag;
	//
	if 
	(
		!$(container+" ."+item_name).hasClass("invisible") 
		&& !$(container+" ."+item_name).hasClass("unavailable")
		&& !$(container+" ."+item_name).hasClass("disabled")
	)
	{
		if (trama_tag.indexOf("[") > -1 && trama_tag.indexOf("]") > -1)
			xml_any_o.children(trama_tag.cutAfter("[")).attr(trama_tag.cutAround("[", "]"), $(container+" .pick_"+item_name).text());
		else
			xml_any_o.children(trama_tag).text($(container+" .pick_"+item_name).text());
	}
}
function save_item_picker2(container, trama_tag, item_name, item_pick, xml_any_o)
{
	item_name = item_name || trama_tag;
	//
	if 
	(
		!$(container + " ." + item_name).hasClass("invisible") 
		&& !$(container + " ." + item_name).hasClass("unavailable")
		&& !$(container + " ." + item_name).hasClass("disabled")
	)
	{
		xml_any_o.children(trama_tag).text($(container + " ." + item_pick).text());
	}
}
var ena_save = true;
function save_item_name(container, widget_obj, pos, xml_any_o)
{
	if (pos == null)
		pos = $(container + " .name").closest(".entire").index();
	if (xml_any_o == null)
		xml_any_o = widget_obj.xml_any;
	//
	$(container + " .name").global_save_item_val({trama_ptr: xml_any_o.children("name"), position: pos});
}
function save_item_pass(container, widget_obj, pos, xml_any_o)
{
	if (pos == null)
		pos = $(container+" .pass").closest(".entire").index();
	if (xml_any_o == null)
		xml_any_o = widget_obj.xml_any;
	//
	$(container+" .pass").global_save_item_val
	({
		trama_ptr: xml_any_o.children("code"),
		position: pos,
		check_func: function()
		{
			var res = true;
			//
			if (res)
				if ($.trim($(container+" .pass").val()).indexOf(String.fromCharCode(8226)) > -1)
					res = null;
			//			
			if (res)
				res = !isNaN($.trim($(container+" .pass").val()));
			if (res)
			{
				var pLen = $.trim($(container+" .pass").val()).length;
				if (pLen > xml_any_o.children("code").attr("maxlength") || pLen < xml_any_o.children("code").attr("minlength"))
					res = false;
			}
			//
			if (res)
			{
				if ($(container + " .pass").val() == "00000" || $(container + " .pass").val() == "000000")
					res = false;
			}
			//
			if (res)
			{
				if (widget_obj.same_user_flg != undefined)
				{
					if (!widget_obj.same_user_flg)
						xml_any_o.find("reset_pwd_flg").text("1");
				}
			}
			//
			return res;
		}
	});
}
function save_item_chime(container, widget_obj)
{
	if (!DIY) save_item_toggled(container, "chime", null, widget_obj.xml_any, null, true);
}
function save_item_global(container, name, type, trama, widget_obj, xml_any_o)
{
	if (xml_any_o == null)
	{
		if (type == "paragraph")
			widget_obj.xml_any.children(trama).text($(container + " ." + name).text());
		else if (type == "input")
			widget_obj.xml_any.children(trama).text($(container + " ." + name).val());
	}
	else
	{
		if (type == "paragraph")
			xml_any_o.children(trama).text($(container+" ."+name).text());
		else if (type == "input")
			xml_any_o.children(trama).text($(container+" ."+name).val());
	}
}
(function($)
{
	$.fn.global_save_item_val = function(options)
	{
		options = $.extend(
		{
			xml_any_o: null,
			trama_ptr: null,
			trama: "",
			position: 0,
			check_func: function(extra)
			{
				if (options.trama_ptr == null)
					options.trama_ptr = options.xml_any_o.find(options.trama);
				//
				if (options.trama_ptr.hasAttr("minlength|maxlength|lbound|rbound"))
				{
					var res = true;
					//
					if (res && options.trama_ptr.hasAttr("minlength"))
					{
						if ($.trim($(this).val()).length < options.trama_ptr.attr("minlength"))
							res = false;
					}
					if (res && options.trama_ptr.hasAttr("maxlength"))
					{
						if ($.trim($(this).val()).length > options.trama_ptr.attr("maxlength"))
							res = false;
					}
					if (res && options.trama_ptr.hasAttr("lbound"))
					{
						var n = Number($.trim($(this).val()));
						var lb = Number(options.trama_ptr.attr("lbound"));
						if (isNaN(n) || isNaN(lb))
							res = false;
						if (n < lb)
							res = false;
					}
					if (res && options.trama_ptr.hasAttr("rbound"))
					{
						var n = Number($.trim($(this).val()));
						var rb = Number(options.trama_ptr.attr("rbound"));
						if (isNaN(n) || isNaN(rb))
							res = false;
						if (n > rb)
							res = false;
					}
					//
					return res;
				}		
				else
				{
					return $.trim($(this).val()) != "";
				}
			},
			extra: null
	    }, options);
		//
        return this.each(function()
        {
        	if ($(this).is("input"))
        	{
        		var ocf_res = options.check_func.call(this, options.extra);
        		//
        		if (ocf_res != null)
        		{
	        		if (!ocf_res)
	        		{
	        			$(this).addClass("fault");
	        			//
	        			var inputWrapper = $(this).closest(".global_item, .global_item_dyn").first();
	        			if ((inputWrapper[0].offsetTop + inputWrapper[0].offsetHeight) > inputWrapper.closest(".scrollableContainer")[0].offsetHeight)
	        				inputWrapper.closest(".scrollableContainer").scrollTop(inputWrapper[0].offsetTop);
	        			//
	        			ena_save = false;
	        		}
	        		else
	        		{
	        			$(this).removeClass("fault");
	        			//
	        			if (options.trama_ptr != null)
	        				options.trama_ptr.text($.trim($(this).val()));
	        			else if (options.trama != "")
	        				options.xml_any_o.find(options.trama).text($.trim($(this).val()));
	        		}
        		}
        	}
        });
    };
}(jQuery));
function save_item_reed_wired(container, widget_obj)
{
	if (!$(container+" .reed").hasClass("unavailable") && widget_obj.xml_any.children("cfg_wire_in_alarm_mode").text() != "-1")
	{
		if (widget_obj.force_to_open)
			widget_obj.reed_mode = "1";
		else if ($(container+" .reed .roc[data-checked='1']").hasClass("open"))
			widget_obj.reed_mode = "1";
		else if ($(container+" .reed .roc[data-checked='1']").hasClass("open_close"))
			widget_obj.reed_mode = "2";
		//
		widget_obj.xml_any.children("cfg_wire_in_alarm_mode").text(widget_obj.reed_mode);
	}
}
function save_item_tvcc(container, widget_obj)
{
	widget_obj.xml_any.children("tvccs").replaceWith(widget_obj.tvccs);
}
function save_item_tvcc_delay_initial(container, widget_obj)
{
	if 
	(
		$(container+" .initial_delay_sec").hasClass("invisible")
		|| $(container+" .initial_delay_sec").hasClass("unavailable")
		|| $(container+" .initial_delay_sec").hasClass("disabled")
	);
	else
		save_item_picker(container, "tvccs_initial_delay_sec", "initial_delay_sec", widget_obj.xml_any);
}
function save_item_rescue(container, widget_obj)
{
	var localRescue = widget_obj.xml_scenes["S1"].attr("home");
	if
	(
		localRescue == "TRUE"
		&& $(container + " .rescue").attr("data-checked") == "0"
	)
	{
		widget_obj.scenes_save_flg["S1"] = true;
		widget_obj.xml_scenes["S1"].attr("home", "FALSE");
	}
	else if
	(
		localRescue == "FALSE"
		&& $(container + " .rescue").attr("data-checked") == "1"
	)
	{
		widget_obj.scenes_save_flg["S1"] = true;
		widget_obj.xml_scenes["S1"].attr("home", "TRUE");
	}
}
function save_item_panic(container, widget_obj)
{
	var localPanic = widget_obj.xml_scenes["S2"].attr("home");
	if
	(
		localPanic == "TRUE"
		&& $(container+" .panic").attr("data-checked") == "0"
	)
	{
		widget_obj.scenes_save_flg["S2"] = true;
		widget_obj.xml_scenes["S2"].attr("home", "FALSE");
	}
	else if
	(
		localPanic == "FALSE"
		&& $(container+" .panic").attr("data-checked") == "1"
	)
	{
		widget_obj.scenes_save_flg["S2"] = true;
		widget_obj.xml_scenes["S2"].attr("home", "TRUE");
	}
}
function save_item_aggression(container, widget_obj)
{
	var localAggression = widget_obj.xml_scenes["S3"].attr("home");
	if
	(
		localAggression == "TRUE"
		&& $(container+" .aggression").attr("data-checked") == "0"
	)
	{
		widget_obj.scenes_save_flg["S3"] = true;
		widget_obj.xml_scenes["S3"].attr("home", "FALSE");
	}
	else if
	(
		localAggression == "FALSE"
		&& $(container+" .aggression").attr("data-checked") == "1"
	)
	{
		widget_obj.scenes_save_flg["S3"] = true;
		widget_obj.xml_scenes["S3"].attr("home", "TRUE");
	}
}
function saveVig(container, widget_obj)
{
	//aggiornamento di struct con gli elementi non diag
	$("#container_parvig .vig").each(function()
	{
		var id = $(this).attr("data-id");
		//
		var ena = $(".ena", this).attr("data-checked");
		widget_obj.notifyStruct[id].enaFlag = ena;
		//
		if (ena == 1)
		{
			widget_obj.notifyStruct[id].contactId = widget_obj.hexA_input_check($(".contactId", this).val(), id, "code", "contactId");
			//
			if ($(this).hasClass("adem"))
			{
				widget_obj.notifyStruct[id].telNumA = widget_obj.phone_number_check($(".telNumA", this).val(), id, "telnum_a", "telNumA");
				widget_obj.notifyStruct[id].telNumB = widget_obj.phone_number_check($(".telNumB", this).val(), id, "telnum_b", "telNumB");
			}
			//
			if ($(this).hasClass("sia"))
			{
//				widget_obj.notifyStruct[id].telNumBack = widget_obj.phone_number_check($(".telNumBack", this).val(), id, "sms_telnum", "telNumBack");
				widget_obj.notifyStruct[id].ipAdr = widget_obj.check_address($(".ipAdr", this).val(), id, "ipAdr");
				widget_obj.notifyStruct[id].ipPort = widget_obj.port_check($(".ipPort", this).val(), id, "ipPort");
//				widget_obj.notifyStruct[id].periodicMin = $(".pick_periodicMin", this).text();
//				widget_obj.notifyStruct[id].periodicEna = $(".periodicEna", this).attr("data-checked");
				widget_obj.notifyStruct[id].aeskey = widget_obj.aeskey_check($(".aeskey_val", this).val(), id, "aeskey_val");
			}
		}
	});
	//
	//passaggio a xml
	widget_obj.xml_vig_save = widget_obj.xml_vig.clone();
	//
	for (var key in widget_obj.notifyStruct)
	{
		var xml_struct = widget_obj.xml_vig_save.find("item").filter(function()
		{
			if ($(this).children("id").text() == key)
				return true;
			else return false;
		});
		//
		if (JSON.stringify(widget_obj.checkSaveStruct[key]) !== JSON.stringify(widget_obj.notifyStruct[key]))
		{
			var _struct = widget_obj.notifyStruct[key];
			//
			xml_struct.children("ena_flg").text(_struct.enaFlag);
			//
			if (_struct.enaFlag == 1)
			{
				xml_struct.children("inv_flg").text(_struct.invFlag);
				xml_struct.children("code").text(_struct.contactId);
				//
				if (_struct.AStype == "0")
				{
					xml_struct.children("telnum_a").text(_struct.telNumA);
					xml_struct.children("telnum_b").text(_struct.telNumB);
				}
				else if (_struct.AStype == "1")
				{
//					xml_struct.children("sms_telnum").text(_struct.telNumBack);
					xml_struct.children("ip_adr").text(_struct.ipAdr);
					xml_struct.children("ip_port").text(_struct.ipPort);
//					xml_struct.children("periodic_min").text(_struct.periodicMin);
//					xml_struct.children("periodic_ena_flg").text(_struct.periodicMin);
					xml_struct.children("udp_flg").text(_struct.udpFlag);
					xml_struct.children("prot").text(_struct.prot);
					xml_struct.children("aeskey").text(_struct.aeskey);
				}
				var xml_events = xml_struct.find("events");
				for (var k in _struct.events)
				{
					$("[id='"+k+"']", xml_events)
						.attr("ena", _struct.events[k].ena)
						.attr("areas", _struct.events[k].areas);
				}
			}
		}
		else
		{
			xml_struct.remove();
		}
	}
}
function save_item_protection(container, xml_any_o, widget_obj)
{
	if
	(
		widget_obj.name == "widget_mod_device_sir"
		|| widget_obj.name == "widget_mod_device_siri"
		|| widget_obj.name == "widget_mod_device_repeater"
	)
	{
		if ($(container + " .reed_tamper_o").attr("data-checked") == "1" && $(container + " .reed_tamper_r").attr("data-checked") == "1")
		{
			xml_any_o.children("reed_tamper").text("3");
		}
		else if ($(container + " .reed_tamper_o").attr("data-checked") == "1")
		{
			xml_any_o.children("reed_tamper").text("2");
		}
		else if ($(container + " .reed_tamper_r").attr("data-checked") == "1")
		{
			xml_any_o.children("reed_tamper").text("1");
		}
		else
		{
			xml_any_o.children("reed_tamper").text("0");
		}
	}
	else
	{
		xml_any_o.children("reed_tamper").text($(container + " .protect").attr("data-checked") == "0" ? "0" : "3");
	}
}
function save_item_led(container, xml_any_o, widget_obj)
{
	save_item_toggled(container, "led", null, xml_any_o);
}
function save_item_ala_eve_msk(container, widget_obj)
{
	widget_obj.xml_any.children("ala_eve_msk").text(widget_obj.ala_eve_msk);
}
function save_item_tslot(xml_any)
{
	var tmsk = "";
	for (var i = 0; i < TSLOTSNUM; i++)
		tmsk += $("#tse" + i).attr("data-checked");
	xml_any.find("timeslot_msk").text(tmsk);
}
//***********************//
//******* GLOBALS *******//
//***********************//
function global_item_init(container, name, type, trama, widget_obj, xml_any_o, value, maxlength)
{
	if (value != null)
	{
		if (type == "paragraph")
		{
			$(container + " ." + name).html(value);
		}
		else if (type == "input")
		{
			$(container + " ." + name).val(value);
			if (maxlength != null)
				$(container + " ." + name).attr("maxlength", maxlength);
		}
	}
	else if (xml_any_o == null)
	{
		if (type == "paragraph")
		{
			$(container+" ."+name).text(widget_obj.xml_any.children(trama).text());
		}
		else if (type == "input")
		{
			$(container+" ."+name).val(widget_obj.xml_any.children(trama).text());
			//
			if (widget_obj.xml_any.children(trama).hasAttr("maxlength"))
				$(container+" ."+name).attr("maxlength", widget_obj.xml_any.children(trama).attr("maxlength"));
		}
	}
	else
	{
		if (type == "paragraph")
		{
			$(container+" ."+name).text(xml_any_o.children(trama).text());
		}
		else if (type == "input")
		{
			$(container+" ."+name).val(xml_any_o.children(trama).text());
			//
			if (xml_any_o.children(trama).hasAttr("maxlength"))
				$(container+" ."+name).attr("maxlength", xml_any_o.children(trama).attr("maxlength"));
		}
	}
}
function global_picker_init(container, trama_tag, item_name, widget_obj, disabled, xml_any_o)
{
	xml_any_o = xml_any_o || widget_obj.xml_any;
	item_name = item_name || trama_tag;
	disabled = disabled || "none";
	//
	var gui_obj = $(container+" .pick_"+item_name);
	var trama_obj = xml_any_o.children(trama_tag);
	//
	var trama_value = "";
	if (trama_obj.hasAttr("lbound") && trama_obj.hasAttr("rbound"))
	{
		gui_obj.attr("data-lbound", trama_obj.attr("lbound"));
		gui_obj.attr("data-rbound", trama_obj.attr("rbound"));
	}
	//set value
	trama_value = trama_obj.text();
	//
	if (trama_value == "-1")
	{
		$(container+" ."+item_name).addClass("unavailable");
	}
	else
	{
		gui_obj.text(trama_value);
		//
		if (disabled == "disabled")
			$(container+" ."+item_name).addClass("disabled");
		else if (disabled == "invisible")
			$(container+" ."+item_name).addClass("invisible");
	}
}
function global_picker_init_simple(container, item_addr, item_name, value, disabled, bounds)
{
	disabled = disabled || "none";
	//
	var gui_obj = $(container+" ."+item_addr+" .pick_"+item_name);
	//
	try
	{
		if (bounds.indexOf("[") != -1)
		{
			bounds = bounds.cutAround("[","]").split(",");
			var lbound = bounds[0];
			var rbound = bounds[1];
			gui_obj.attr("data-lbound", lbound);
			gui_obj.attr("data-rbound", rbound);
		}
	}
	catch(nobounds){}
	//
	if (value == "-1")
	{
		$(container+" ."+item_addr).addClass("unavailable");
	}
	else
	{
		gui_obj.text(value);
		//
		if (disabled == "disabled")
			$(container+" ."+item_addr).addClass("disabled");
		else if (disabled == "invisible")
			$(container+" ."+item_addr).addClass("invisible");
	}
}
function global_apply_diag(container, item_name, diag_title, diag_identifier, extra, widget_str, jsd)
{
	diag_identifier = diag_identifier || item_name;
	jsd = jsd || ".JSdialog";
	var point = (item_name[0] == "#" ? "" : ".");
	var space = (container == "" ? "" : " ");
	$(container + space + point + item_name).off("click").click(function()
	{
		if (!$(this).hasClass("disabled") && !$(this).hasClass("invisible") && !$(this).hasClass("unavailable"))
			pag_change(jsd, "widget_diag", diag_identifier, diag_title, container, "" + extra, widget_str, item_name);
	});
}
//
function global_switcher_binder(widgetContainer, element, xml_any_o, valoreIniziale, avviso, allowToggleFlg)
{
	//classe dell'interruttore e trama xml devono avere lo stesso nome, altrimenti utilizzare il parametro valoreIniziale
	//"valoreIniziale" non può essere diverso da 0 e 1
	//
	var selection = null;
	if (element[0] == "#")
	{
		selection = $(element);
	}
	else
	{
		var point = (element[0] == ":" ? "" : ".");
		var selectorStr = widgetContainer + " .switcher" + point + element;
		selection = $(selectorStr);	
	}
	if (valoreIniziale == null)
		valoreIniziale = xml_any_o.children(element).text();
	//
	if (valoreIniziale == "-1")
		selection.parent().addClass("unavailable");
	//
	if (valoreIniziale == "GUI") //passare come parametro GUI quando bisogna prendere come valore iniziale il data-checked già presente nell'HTML
		valoreIniziale = selection.attr("data-checked");
	//
	if (avviso == null)
	{
		selection.off("click").click(function()
		{
			if ($(this).hasClass("disabled") || $(this).parent().hasClass("unavailable"))
			{
				if (allowToggleFlg)
					$(this).trigger("toggle_tick_click");
				return false;
			}
			//
			if ($(this).attr("data-checked") == "1")
			{
				$(this).switchClass("on", "off", 150).attr("data-checked", "0");
			}
			else
			{
				$(this).switchClass("off", "on", 150).attr("data-checked", "1");
			}
			$(this).trigger("toggle_tick_click");
		});
	}
	else
	{
		if (avviso.condizione == "1")
			selection.addClass("avvisoCondizioneUno");
		else if (avviso.condizione == "0")
			selection.addClass("avvisoCondizioneZero");
		//
		selection.off("click").click(function()
		{
			if ($(this).hasClass("disabled") || $(this).parent().hasClass("unavailable"))
			{
				if (allowToggleFlg)
					$(this).trigger("toggle_tick_click");
				return false;
			}
			//
			if ($(this).attr("data-checked") == "1")
			{
				if (avviso.condizione == "0")
				{
					pag_change(".JSdialog2", "widget_popwarn", "{LANG_WARNING}", avviso.messaggio, "okab", selectorStr);
				}
				else
				{
					$(this).switchClass("on", "off", 150).attr("data-checked", "0");
					$(this).trigger("toggle_tick_click");
				}
			}
			else
			{
				if (avviso.condizione == "1")
				{
					pag_change(".JSdialog2", "widget_popwarn", "{LANG_WARNING}", avviso.messaggio, "okab", selectorStr);
				}
				else
				{
					$(this).switchClass("off", "on", 150).attr("data-checked", "1");
					$(this).trigger("toggle_tick_click");
				}
			}
		})
		.off("on_pw_ok").on("on_pw_ok", function()
		{
			if (avviso.condizione == "1")
			{
				$(this).switchClass("off", "on", 150).attr("data-checked", "1");
			}
			else if (avviso.condizione == "0")
			{
				$(this).switchClass("on", "off", 150).attr("data-checked", "0");
			}
			if ($(this).parent().hasClass("ex"))
				$(this).trigger("click.ex");
			if ($(this).parent().hasClass("alo"))
				$(this).trigger("click.alo");
			$(this).trigger("toggle_tick_click");
		});
	}
	//
	selection.off("switch_state_changer").on("switch_state_changer", function(event, state, no_ttclick_flg)
	{
		for(var i = 0; i < state.length; i++)
		{
			if (state[i] == "on" && $(this).attr("data-checked") == "0")
			{
				$(this).switchClass("off", "on", 150).attr("data-checked", "1");
				if (!no_ttclick_flg)
					$(this).trigger("toggle_tick_click");
			}
			else if (state[i] == "off" && $(this).attr("data-checked") == "1")
			{
				$(this).switchClass("on", "off", 150).attr("data-checked", "0");
				if (!no_ttclick_flg)
					$(this).trigger("toggle_tick_click");
			}
			else if (state[i] == "enabled")
			{
				$(this).removeClass("disabled");
			}
			else if (state[i] == "disabled")
			{
				$(this).addClass("disabled");
			}
		}
	});
	//
	selection.attr("data-checked", "" + valoreIniziale);
	if (selection.attr("data-checked") == "1")
		selection.swapClass("off", "on");
	//
	if (!QT)
	{
		selection.off("swipeleft").on("swipeleft", function()
		{
			if ($(this).attr("data-checked") == "1")
				$(this).trigger("click");
		});
		selection.off("swiperight").on("swiperight", function()
		{
			if ($(this).attr("data-checked") == "0")
				$(this).trigger("click");
		});
	}
}
//
function global_load_areas_switcher(area_container, xml_any_o, widget_obj)
{
	$(area_container + " .area").each(function(index)
	{
		var area_item = area_list.find("item:eq(" + index + ")");
		var areaId = area_item.find("id").text();
		//
		$(".item_tag", this).text(area_item.find("desc").text());
		$(".switcher", this).attr("data-id", areaId).addClass("disableMode3");
		//
		if (xml_any_o.children("area_alarm").text().indexOf(areaId) == -1)
			global_switcher_binder(area_container, ":eq(" + index + ")", null, "0");
		else
			global_switcher_binder(area_container, ":eq(" + index + ")", null, "1");
		//
		if (area_item.find("ena").text() == "FALSE")
			$(".switcher", this).trigger("switch_state_changer", [["disabled"]]);
	});
}
//
function global_send_dev_mod_save(widget_obj, resp, parsav, type_of_save, force_send, item_id, xml_any_o)
{
	if (resp == null)
		resp = true;
	if (parsav == null)
		parsav = true;
	if (type_of_save == null)
		type_of_save = WS_DEV_STR;
	if (item_id == null)
		item_id = true;
	if (force_send == null)
		force_send = false;
	var res = false;
	var k = 1;
	//
	if (parsav)
		widget_obj.par_save();
	//
	xml_request = xml_request_head_build("MENU", resp ? widget_obj.name : null);
	xml_par = $(XML("act")); xml_par.text("SAVE"); xml_request.append(xml_par);
	xml_par = $(XML("page")); xml_par.text(type_of_save); xml_request.append(xml_par);
	xml_par = $(XML("par")); xml_request.append(xml_par);
	//
	if (xml_any_o == null)
	{
		if (widget_obj.xml_any != null)
		{
			if (item_id) widget_obj.xml_any.attr("id", k++);
			xml_par.append(widget_obj.xml_any);
			res = true;
		}
		//
		if (widget_obj.son1 != null)
		{
			if (item_id) widget_obj.son1.attr("id", k++);
			xml_par.append(widget_obj.son1);
			res = true;
		}
		if (widget_obj.son2 != null)
		{
			if (item_id) widget_obj.son2.attr("id", k++);
			xml_par.append(widget_obj.son2);
			res = true;
		}
		//
		if (widget_obj.sons != null)
		{
			for (var i = 0; i < widget_obj.sons.length; i++)
			{
				if (item_id) widget_obj.sons[i].attr("id", i + k);
				xml_par.append(widget_obj.sons[i]);
				res = true;
			}
		}
		//
		if (widget_obj.xml_any_arr != null)
		{
			for (var i = 0; i < widget_obj.xml_any_arr.length; i++)
			{
				if (item_id) widget_obj.xml_any_arr[i].attr("id", i+k);
				xml_par.append(widget_obj.xml_any_arr[i]);
				res = true;
			}
		}
	}
	else
	{
		xml_par.append(xml_any_o);
		res = true;
	}
	//
	if (ena_save || force_send)
	{
		if (res)
			xml_send(xml_request);
		else
			tyu("ERROR: NOTHING TO SAVE");
	}
}