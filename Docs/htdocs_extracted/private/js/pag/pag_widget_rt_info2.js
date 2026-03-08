pag_table_new["widget_rt_info2"] = {
	onload: function()
	{
		page_act("#seeking-page");
		schema_act("#seeking-page", "quadrant_abcd");
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		var widget_obj = this;
		//
		//
		this.rtinfo_req();
		//
		//
		var filari = xmlSubTbl[WS_DEV_ALARM_WIRED_STR];
		if (filari == null)
		{
			$("#rt_info2_container .rt_input, #rt_info2_container .rt_output").next(".void").remove();
			$("#rt_info2_container .rt_input, #rt_info2_container .rt_output").remove();
		}
		else 
		{
			for (var i = 0; i < this.rt_in_number_real; i++)
			{
				$(
					"<div class='rt_in_frmt brr brt' data-tag-id='" + filari[WIRE_I_ORD_OFFSET + i].children("tag").text() + "' id='rt_in_" + (i) + "'><p class='in_label'>" + (i + 1) + "</p></div>"
				)
				.appendTo("#rt_info2_container .rt_input")
				.data("name", filari[WIRE_I_ORD_OFFSET + i].children("name").text())
				.data("alarm_mode", filari[WIRE_I_ORD_OFFSET + i].children("cfg_wire_in_alarm_mode").text());
			}
			$("#rt_info2_container .rt_input").append("<br>");
			for (var i = 0; i < this.rt_in_number_virt; i++)
			{
				$(
					"<div class='rt_in_frmt brr brt' data-tag-id='" + filari[WIRE_I_VIRTUAL_ORD_OFFSET + 1 + i].children("tag").text() + "' id='rt_in_" + (i + this.rt_in_number_real) + "'><p class='in_label'>" + (i + 1) + "b" + "</p></div>"
				)
				.appendTo("#rt_info2_container .rt_input")
				.data("name", filari[WIRE_I_VIRTUAL_ORD_OFFSET + 1 + i].children("name").text())
				.data("alarm_mode", filari[WIRE_I_VIRTUAL_ORD_OFFSET + 1 + i].children("cfg_wire_in_alarm_mode").text());
			}
			$("#rt_info2_container .rt_in_frmt").off("click").click(function()
			{
				var aodListIdx = arrassTagIii[$(this).attr("data-tag-id")];
				if (aodListIdx != null)
					pag_change("#JSdialog", "widget_popwarn", aodListIdx, widget_obj.nameDisplay($(this).data("name"), aodListIdx), "ok", "#" + $(this).attr("id"));
			})
			.off("on_pw_ok").on("on_pw_ok", function()
			{
				if (!($(this).hasClass("down")))
				{
					if 
					(
						$(this).data("alarm_mode") == ALAMODE_O 
						&& 
						( 
							$(this).hasClass("alarmed")
							|| $(this).hasClass("alarmed") //24H, segnaposto
						)
					)
					{
						var cltorm = "";
						for (var i in widget_obj.rt_in_st_tbl_catalog)
							cltorm += " " + widget_obj.rt_in_st_tbl_catalog[i];
						$(this).removeClass(cltorm).addClass("idle");
					}
				}
			});
			//
			//
			for (var i = 0; i < this.rt_out_number; i++)
			{
				var label = "";
				var tag_id = "";
				var name = "";
				//
				if (i == 0)
				{
					label = "R1";
					tag_id = filari[WIRE_I_INPUT_ORD_OFFSET + 1 + i].children("tag").text();
					name = filari[WIRE_I_INPUT_ORD_OFFSET + 1 + i].children("name").text();
				}
				else if (i == 1)
				{
					label = "R2";
					tag_id = filari[WIRE_I_INPUT_ORD_OFFSET + 1 + i].children("tag").text();
					name = filari[WIRE_I_INPUT_ORD_OFFSET + 1 + i].children("name").text();
				}
				else if (i == 2)
				{
					label = "+OFF";
					tag_id = "Out ATT";
					name = label;
				}
				else if (i == 3)
				{
					label = "+N";
					tag_id = "Out ALL";
					name = label;
				}
				else if (i == 4)
				{
					label = "V1";
					tag_id = "Out V1";
					name = label;
				}
				else if (i == 5)
				{
					label = "V2";
					tag_id = "Out V2";
					name = label;
				}
				$(
					"<div class='rt_out_frmt brr brt' data-tag-id='" + tag_id + "' data-id='" + i + "' id='rt_out_" + i + "'><p class='out_label'>" + label + "</p></div>"
				).appendTo("#rt_info2_container .rt_output").data("name", name);
			}
			$("#rt_info2_container .rt_out_frmt").off("click").click(function()
			{
				var aodListIdx = arrassTagIii[$(this).attr("data-tag-id")];
				pag_change("#JSdialog", "widget_popwarn", aodListIdx ? aodListIdx : "", widget_obj.nameDisplay($(this).data("name"), aodListIdx), "ok", "#" + $(this).attr("id"));
			})
			.off("on_pw_ok").on("on_pw_ok", function()
			{
				//
			});
		}
		//
		//
		if (xmlSubTbl[WS_DEV_ALARM_BUS_INPUT_STR] == null)
		{
			$("#rt_info2_container .rt_bus_input").next(".void").remove();
			$("#rt_info2_container .rt_bus_input").remove();
		}
		else
		{
			for (var j = 0; j < (xmlSubTbl[WS_DEV_ALARM_BUS_INPUT_STR].length / (this.rt_bus_in_number + 1)); j++)
			{
				var father_idx = j * (this.rt_bus_in_number + 1);
				var bus_input_dev_father = xmlSubTbl[WS_DEV_ALARM_BUS_INPUT_STR][father_idx];
				var tag_id_father = bus_input_dev_father.children("tag").text();
				var id_father = bus_input_dev_father.children("id").text();
				var name_father = bus_input_dev_father.children("name").text();
				$("#rt_info2_container .rt_bus_input").append(arrassTagIii[tag_id_father] + " " + name_father + "<br>");
				for (var i = 0; i < this.rt_bus_in_number; i++)
				{
					var son_idx = father_idx + i + 1;
					var bus_input_dev_son = xmlSubTbl[WS_DEV_ALARM_BUS_INPUT_STR][son_idx];
					var tag_id_son = bus_input_dev_son.children("tag").text();
					$(
						"<div class='" + this.rt_bus_in_frmt_class + "' data-tag-id='" + tag_id_son + "' data-tag-id-father='" + tag_id_father + "' id='rt_bus_in_" + son_idx + "'><p class='bus_in_label'>" + (i + 1) + "</p></div>"
					)
					.appendTo("#rt_info2_container .rt_bus_input")
					.data("name", bus_input_dev_son.children("name").text())
					.data("alarm_mode", bus_input_dev_son.children("alarm_mode").text());
				}
				//
				$(
					"<div class='rt_bus_in_frmt_poll' id='rt_bus_in_poll_" + father_idx + "'><p class='bus_in_label'>&nbsp;</p></div>"
				)
				.appendTo("#rt_info2_container .rt_bus_input")
				.data("id", id_father)
				.data("name", name_father)
				.data("tag", tag_id_father)
				.off("click").click(function()
				{
					polling_selettivo($(this).data("id"), WS_DEV_ALARM_BUS_INPUT_STR, true);
					pag_change("#JSdialog", "widget_popwarn", arrassTagIii[$(this).data("tag")], widget_obj.fatherNameDisplay($(this).data("name")), "ok", "#" + $(this).attr("id"));
				})
				.off("on_pw_ok").on("on_pw_ok", function()
				{
					polling_selettivo($(this).data("id"), WS_DEV_ALARM_BUS_INPUT_STR, false);
				});
				//
				$("#rt_info2_container .rt_bus_input").append("<br>");
			}
			$("#rt_info2_container .rt_bus_in_frmt").off("click").click(function()
			{
				var aodListIdx = arrassTagIii[$(this).attr("data-tag-id")];
				pag_change("#JSdialog", "widget_popwarn", aodListIdx ? aodListIdx : "", widget_obj.nameDisplay($(this).data("name"), aodListIdx), "ok", "#" + $(this).attr("id"));
			})
			.off("on_pw_ok").on("on_pw_ok", function()
			{
				if (!($(this).hasClass("down")))
				{
					if 
					(
						$(this).data("alarm_mode") == ALAMODE_O 
						&& 
						( 
							$(this).hasClass("alarmed")
							|| $(this).hasClass("alarmed") //24H, segnaposto
						)
					)
					{
						var cltorm = "";
						for (var i in widget_obj.rt_bus_in_st_tbl_catalog)
							cltorm += " " + widget_obj.rt_bus_in_st_tbl_catalog[i];
						$(this).removeClass(cltorm).addClass("idle");
					}
				}
			});
		}
		//
		//
		var bus_rf_swi = xmlSubTbl[WS_DEV_ALARM_BUS_CONT_STR];
		if (bus_rf_swi == null)
		{
			$("#rt_info2_container .rt_bus_rf_swi").remove();
		}
		else
		{
			for (var i = 0; i < bus_rf_swi.length; i++)
			{
				var tag_id = bus_rf_swi[i].children("tag").text();
				$(
					"<div class='" + this.rt_bus_rf_swi_frmt_class + "' data-tag-id='" + tag_id + "' id='rt_bus_rf_swi_" + (i + 1) + "'><p class='bus_rf_label'>" + arrassTagIii[tag_id] + "</p></div>"
				).appendTo("#rt_info2_container .rt_bus_rf_swi").data("name", bus_rf_swi[i].children("name").text());
			}
			$("#rt_info2_container .rt_bus_rf_swi_frmt").off("click").click(function()
			{
				var aodListIdx = arrassTagIii[$(this).attr("data-tag-id")];
				pag_change("#JSdialog", "widget_popwarn", aodListIdx ? aodListIdx : "", widget_obj.nameDisplay($(this).data("name"), aodListIdx), "ok", "#" + $(this).attr("id"));
			})
			.off("on_pw_ok").on("on_pw_ok", function()
			{
				if 
				(
					$(this).hasClass("tampered")
				)
				{
					var cltorm = "";
					for (var i in widget_obj.rt_bus_rf_swi_st_tbl_catalog)
						cltorm += " " + widget_obj.rt_bus_rf_swi_st_tbl_catalog[i];
					$(this).removeClass(cltorm).addClass("idle");
				}
			});
		}
		//
		//
		if (bus_rf_swi == null)
			;
		else
			$("#rt_info2_container .rt_bus_rf_sen .bottom_comand").parent().remove();
		//
		var bus_rf_sen = xmlSubTbl[WS_DEV_ALARM_BUS_SENRF_STR];
		if (bus_rf_sen == null)
		{
			$("#rt_info2_container .rt_bus_rf_sen").remove();
		}
		else
		{ 
			for (var i = 0; i < bus_rf_sen.length; i++)
			{
				var downIdle = bus_rf_sen[i].children("ena").text() == "1" ? " idle" : " down";
				var tag_id = bus_rf_sen[i].children("tag").text();
				$(
					"<div class='" + this.rt_bus_rf_sen_frmt_class + downIdle + "' data-tag-id='" + tag_id + "' id='rt_bus_rf_sen_" + (i + 1) + "'><p class='bus_rf_label'>" + arrassTagIii[tag_id] + "</p></div>"
				).appendTo("#rt_info2_container .rt_bus_rf_sen").data("name", bus_rf_sen[i].children("name").text());
			}
			$("#rt_info2_container .rt_bus_rf_sen_frmt").off("click").click(function()
			{
				var aodListIdx = arrassTagIii[$(this).attr("data-tag-id")];
				pag_change("#JSdialog", "widget_popwarn", aodListIdx ? aodListIdx : "", widget_obj.nameDisplay($(this).data("name"), aodListIdx), "ok", "#" + $(this).attr("id"));
			})
			.off("on_pw_ok").on("on_pw_ok", function()
			{
				if (!($(this).hasClass("down")))
				{
					var cltorm = "";
					for (var i in widget_obj.rt_bus_rf_sen_st_tbl_catalog)
						cltorm += " " + widget_obj.rt_bus_rf_sen_st_tbl_catalog[i];
					$(this).removeClass(cltorm).addClass("idle");
				}
			});
		}
		//
		//
		scrollListArrowCheck(this, "#rt_info2_container");
		this.scrollBtnRefresh();
		//
		xml_menu_load_send(WS_TEST_STR, null, null, "widget_rt_info2", DEVICE_TEST_SEN);
		//
		xml_request = xml_request_head_build("MENU", "widget_rt_info2");
		xml_par = $(XML("act")); xml_par.text("START"); xml_request.append(xml_par);		
		xml_par = $(XML("page")); xml_par.text(WS_TEST_STR); xml_request.append(xml_par);		
		xml_par = $(XML("par")); xml_par.text(""/*this.type_of_list*/); xml_request.append(xml_par);
		xml_send(xml_request);
	},
	onrecv_confirmation: function(conf)
	{
		var widget_obj = this;
		//
		if (conf.attr("type") == "MENU")
		{
			if (conf.children("page").text() == "UTILITY")
			{
				if (conf.children("act").text() == "RT_INFO_GET")
				{
					if (conf.children("res").text() == "OK")
					{
						conf.find("par inputs input").each(function()
						{
							var rt_in_state_class = widget_obj.rt_in_st_tbl[$("st", this).text()];
							var rt_in_frmt = $("#rt_info2_container .rt_in_frmt[data-tag-id='" + $(this).attr("devid") + "']");
							//
							if (rt_in_frmt.data("alarm_mode") == ALAMODE_O && rt_in_frmt.hasClass("alarmed") && rt_in_state_class == "idle")
							{
								//do nothing
							}
							else
							{
								rt_in_frmt.attr("class", widget_obj.rt_in_frmt_class);
								rt_in_frmt.addClass(rt_in_state_class);
							}
						});
						//
						conf.find("par outputs output").each(function()
						{
							var rt_out_state_class = widget_obj.rt_out_st_tbl[$("st", this).text()];
							var rt_out_frmt = $("#rt_info2_container .rt_out_frmt[data-tag-id='" + $(this).attr("devid") + "']");
							//
							rt_out_frmt.attr("class", widget_obj.rt_out_frmt_class);
							rt_out_frmt.addClass(rt_out_state_class);
						});
						//
						conf.find("par BusInputs BusInput").each(function()
						{
							var rt_bus_in_frmt = $("#rt_info2_container .rt_bus_in_frmt[data-tag-id-father='" + $(this).attr("devid") + "']");
							$(this).children().each(function(index)
							{
								var rt_bus_in_frmt_guiel = rt_bus_in_frmt.filter("[data-tag-id='" + $(this).attr("devid") + "']");
								var rt_bus_in_state_class = widget_obj.rt_bus_in_st_tbl[$(this).attr("st")];
								if (rt_bus_in_frmt_guiel.data("alarm_mode") == ALAMODE_O && rt_bus_in_frmt_guiel.hasClass("alarmed") && rt_bus_in_state_class == "idle")
								{
									//do nothing
								}
								else
								{
									rt_bus_in_frmt_guiel.attr("class", widget_obj.rt_bus_in_frmt_class);
									rt_bus_in_frmt_guiel.addClass(rt_bus_in_state_class);
								}
							});
						});
						//
						conf.find("par BusRfSwis BusRfSwi").each(function()
						{
							var rt_bus_rf_swi_frmt = $("#rt_info2_container .rt_bus_rf_swi_frmt[data-tag-id='" + $(this).attr("devid") + "']");
							var rt_bus_rf_swi_state_class = widget_obj.rt_bus_rf_swi_st_tbl[$(this).children("st").text()];
							if (rt_bus_rf_swi_frmt.hasClass("tampered") && rt_bus_rf_swi_state_class == "idle")
							{
								//do nothing
							}
							else
							{
								rt_bus_rf_swi_frmt.attr("class", widget_obj.rt_bus_rf_swi_frmt_class);
								rt_bus_rf_swi_frmt.addClass(rt_bus_rf_swi_state_class);
							}
						});
					}
					//
					setTimeout(function()
					{
						widget_obj.rtinfo_req();
					}, this.rt_req_delay * 1000);
				}
			}
		}
	},
	onrecv_indication: function(indi)
	{
		if (indi.attr("type") == "MENU")
		{
			if (indi.children("page").text() == WS_TEST_STR)
			{
				if (indi.children("act").text() == "CHECKED")
				{
					var id_dev = indi.find("par id").text();
					var tag_dev = indi.find("par dev_id").text();
					var id_eve = indi.find("par eve_id").text();
					var localdt_eve = indi.find("localdt").text();
					//
					//
					var rt_in_frmt_guiel = $("#rt_info2_container .rt_in_frmt[data-tag-id='" + tag_dev + "']");
					if 
					(
						rt_in_frmt_guiel.length > 0
						&&
						(
							rt_in_frmt_guiel.data("alarm_mode") == ALAMODE_O 
							&& 
							(
								id_eve == this.rt_in_st_alarmed
								|| id_eve == this.rt_in_st_alarmed_h24
							)
						)
					)
					{
						rt_in_frmt_guiel.attr("class", this.rt_in_frmt_class);
						var rt_in_state_class = this.rt_in_st_tbl_catalog[id_eve];
						rt_in_frmt_guiel.addClass(rt_in_state_class);
					}
					//
					//
					var rt_bus_in_frmt_guiel = $("#rt_info2_container .rt_bus_in_frmt[data-tag-id='" + tag_dev + "']");
					if 
					(
						rt_bus_in_frmt_guiel.length > 0
						&&
						(
							rt_bus_in_frmt_guiel.data("alarm_mode") == ALAMODE_O 
							&& 
							(
								id_eve == this.rt_bus_in_st_alarmed
								|| id_eve == this.rt_bus_in_st_alarmed_h24
							)
						)
					)
					{
						rt_bus_in_frmt_guiel.attr("class", this.rt_bus_in_frmt_class);
						var rt_bus_in_state_class = this.rt_bus_in_st_tbl_catalog[id_eve];
						rt_bus_in_frmt_guiel.addClass(rt_bus_in_state_class);
					}
					//
					//
					var rt_bus_rf_swi_frmt = $("#rt_info2_container .rt_bus_rf_swi_frmt[data-tag-id='" + tag_dev + "']");
					if 
					(
						rt_bus_rf_swi_frmt.length > 0
						&&
						(
							id_eve == this.rt_bus_rf_swi_st_tampered
						)
					)
					{
						rt_bus_rf_swi_frmt.attr("class", this.rt_bus_rf_swi_frmt_class);
						var rt_bus_rf_swi_state_class = this.rt_bus_rf_swi_st_tbl_catalog[id_eve];
						rt_bus_rf_swi_frmt.addClass(rt_bus_rf_swi_state_class);
					}
					//
					//
					var rt_bus_rf_sen_frmt = $("#rt_info2_container .rt_bus_rf_sen_frmt[data-tag-id='" + tag_dev + "']");
					if 
					(
						rt_bus_rf_sen_frmt.length > 0
						&& !(rt_bus_rf_sen_frmt.hasClass("down"))
					)
					{
						rt_bus_rf_sen_frmt.attr("class", this.rt_bus_rf_sen_frmt_class);
						var rt_bus_rf_sen_state_class = this.rt_bus_rf_sen_st_tbl_catalog[id_eve];
						rt_bus_rf_sen_frmt.addClass(rt_bus_rf_sen_state_class);	
					}
					//
					//
					var tagDev = $("[data-tag-id='" + tag_dev + "']");
					if (tagDev.length > 0) // toglie dal log le indication che mandano gli altri dispositivi filari
					{
						this.drawLogEvent
						(
							id_dev
							, tagDev.data("name")
							, xml_file_configuration.find("Logs LogEvents LogEvent[id='" + id_eve + "']").attr("desc")
							, from_localdt_to_datacen(localdt_eve)
						);
						this.scrollBtnRefresh();
					}
				}
			}
		}
	},
	onclose: function()
	{
		//
	},
	//
	name: "widget_rt_info2",
	title: "{LANG_WIZARD_TEST_DEVICE_RT}",
	bodyWrapper: "set elsewhere",
	xml_any_wired_i_real: [],
	rt_req_delay: 1,
	//
	rt_in_number: 16,
	rt_in_number_real: 8,
	rt_in_number_virt: 8,
	rt_in_st_tbl: {0: "idle", 1: "alarmed", 2: "tampered", 3: "down"}, //X confirmation
	rt_in_st_tbl_catalog: {1: "alarmed", 3: "alarmed"/*h24*/}, //X indication
	rt_in_frmt_class: "rt_in_frmt brr brt",
	rt_in_st_alarmed: "1", //corrispondenza catalogo
	rt_in_st_alarmed_h24: "3", //corrispondenza catalogo
	//
	rt_out_number: 6,
	rt_out_st_tbl: {0: "off", 1: "on", 2: "down"},
	rt_out_frmt_class: "rt_out_frmt brr brt",
	//
	rt_bus_in_number: 6,
	rt_bus_in_st_tbl: {0: "idle", 1: "alarmed", 2: "tampered", 3: "down"}, //X confirmation
	rt_bus_in_st_tbl_catalog: {1: "alarmed", 3: "alarmed"/*h24*/}, //X indication
	rt_bus_in_frmt_class: "rt_bus_in_frmt brr brt",
	rt_bus_in_st_alarmed: "1", //corrispondenza catalogo
	rt_bus_in_st_alarmed_h24: "3", //corrispondenza catalogo
	//
	rt_bus_rf_swi_st_tbl_catalog: {0: "idle", 1: "alarmed", 19: "tampered", 44: "down"}, //X indication
	rt_bus_rf_swi_st_tbl: {0: "idle", 1: "alarmed", 2: "tampered", 3: "down"},
	rt_bus_rf_swi_frmt_class: "rt_bus_rf_frmt rt_bus_rf_swi_frmt brr brt",
	rt_bus_rf_swi_st_tampered: "19", //corrispondenza catalogo
	//
	rt_bus_rf_sen_st_tbl_catalog: {0: "idle", 1: "alarmed", 3: "alarmed"/*h24*/, 19: "tampered", 44: "down", 45: "alarmed"/*medico*/, 46: "alarmed"/*panico*/, 47: "alarmed"/*rapina*/}, //X indication
	rt_bus_rf_sen_frmt_class: "rt_bus_rf_frmt rt_bus_rf_sen_frmt brr brt",
	rt_bus_rf_sen_st_alarmed: "1", //corrispondenza catalogo
	rt_bus_rf_sen_st_alarmed_h24: "3", //corrispondenza catalogo
	//
	//
	clean_page: function()
	{
		xml_request = xml_request_head_build("MENU");
		xml_par = $(XML("act")); xml_par.text("STOP"); xml_request.append(xml_par);		
		xml_par = $(XML("page")); xml_par.text(WS_TEST_STR); xml_request.append(xml_par);		
		xml_par = $(XML("par")); xml_par.text(""/*this.type_of_list*/); xml_request.append(xml_par);
		xml_send(xml_request);
		//
		pag_clear("#seeking-page .quadrant");
	},
	rtinfo_req: function()
	{
		xml_request = xml_request_head_build("MENU", "widget_rt_info2");
		xml_par = $(XML("page")); xml_par.text("UTILITY"); xml_request.append(xml_par);
		xml_par = $(XML("act")); xml_par.text("RT_INFO_GET"); xml_request.append(xml_par);				
		xml_par = $(XML("par")); xml_request.append(xml_par);
		xml_send(xml_request);
	},
	drawLogEvent: function(IONumber, IOLabel, IOState, IOtime)
	{
		$("#log_event").prepend
		(
			"<div class='wrap_tag full item'>"
			+	"<p class='bottom_comand'>"
			+		"[" + get_hours_do(IOtime) + ":" + get_minutes_do(IOtime) + ":" + get_seconds_do(IOtime) + "]"
			+		" " + IOLabel
			+		" (" + (Number(IONumber)) + ")"
			+		" -> " + IOState
			+	"</p>"
			+"</div>"
		);
	},
	scrollBtnRefresh: function()
	{
		if ($("#log_event").height() >= $("#log_event")[0].scrollHeight)
		{
			$("#log_event_scroll_down").addClass("disabled");
			$("#log_event_scroll_up").addClass("disabled");
		}
		else
		{
			if ($("#log_event").scrollTop() >= ($("#log_event .item:first").outerHeight(true) - 1) * $("#log_event .item").length - $("#log_event").outerHeight(true))
			{
				$("#log_event_scroll_down").addClass("disabled");
				$("#log_event_scroll_up").removeClass("disabled");
			}
			else if ($("#log_event").scrollTop() <= 1)
			{
				$("#log_event_scroll_up").addClass("disabled");
				$("#log_event_scroll_down").removeClass("disabled");
			}
			else
			{
				$("#log_event_scroll_down").removeClass("disabled");
				$("#log_event_scroll_up").removeClass("disabled");
			}
		}
	},
	nameDisplay: function(name, idx)
	{
		var showStr = "";
		if (idx == null)
			showStr = "{LANG_NAME}: " + name;
		else
			showStr = "{LANG_RT_POP_NAME1}" + idx + "{LANG_RT_POP_NAME2}" + name + "{LANG_RT_POP_NAME3}";
		return showStr;
	},
	fatherNameDisplay: function(name)
	{
		var showStr = "";
		showStr = "{LANG_RT_POP_FATHER_NAME1}" + name + "{LANG_RT_POP_FATHER_NAME2}";
		return showStr;
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			widget_obj.clean_page();
			//
			if ("widget_test_device" in pag_table_new)
				pag_table_new["widget_test_device"].onload();
			else
				pag_change("#seeking-page .quadrant_abcd", "widget_test_device");
		});
		//
		$("#backTitle").html("{LANG_WIZARD_TEST_DEVICE_TITLE}");
	},
	footer_home_switch: function()
	{
		var widget_obj = this;
		footer_home_switch_init();
		//
		//
		$("#log_event_scroll_down").off("click").click(function()
		{
			$("#log_event").finish();
			$("#log_event").animate({"scrollTop": $("#log_event").scrollTop() + $("#log_event .item:first").outerHeight(true) + 1}, null, null, function()
			{
				widget_obj.scrollBtnRefresh();
			});
		});
		$("#log_event_scroll_up").off("click").click(function()
		{
			$("#log_event").finish();
			$("#log_event").animate({"scrollTop": $("#log_event").scrollTop() - $("#log_event .item:first").outerHeight(true) - 1}, null, null, function()
			{
				widget_obj.scrollBtnRefresh();
			});
		});
		$("#log_event").off("stopScroll").stopScroll(function()
		{
			widget_obj.scrollBtnRefresh();
		});
		//
		//
		footer_button_rotate();
		scrollList(this);
	}
};