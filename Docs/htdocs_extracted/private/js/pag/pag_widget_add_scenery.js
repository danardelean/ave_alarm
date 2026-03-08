pag_table_new["widget_add_scenery"] = {
	onload: function()
	{
		dynamic_page_act(this);
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		var widget_obj = this;
		saveModFlg = true;
		this.first_load = true;
		//
		//
		this.init_variable();
		//
		this.draw_value_date();
		//
		this.draw_value_active_if();
		//
		this.refresh_cmds_list();
		//
		this.init_control();
		//
		if (this.mode != "read") picker("#container_scenery", this.normalizer);
		//
		this.init_updater();
		//
		global_apply_diag("#container_scenery", "active_if_sel", "{LANG_ACTIVE_IF}", "triggered_by", null, "widget_add_scenery", null);
		//
		pag_table_new["main_obj"].preload_dev = true;
		xml_menu_load_send
		(
			WS_DEV_STR, WS_DEV_ALARM_CEN_STR
			+ "|" + WS_DEV_ALARM_RELAY_STR
			+ "|" + WS_DEV_ALARM_SIR_STR
			+ "|" + WS_DEV_ALARM_SIRI_STR
			+ "|" + WS_DEV_ALARM_BUS_RELAY_STR
			+ "|" + WS_DEV_ALARM_WIRED_STR
			+ "|" + WS_DEV_ALARM_IOT_STR
			+ "|" + WS_DEV_ALARM_THERMOSTAT_STR
			, null, "main_obj"
		);
		//
		if (this.IoTCablatoFlg)
		{
			$("#scenery_name").attr("disabled", "");
			$("#active_if_sw").addClass("disabled").off("click");
			$("#footer_h2_a_b").remove();
			$("#footer_h2_a_c").remove();
		}
		//
		scrollListArrowCheck(this);
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "SCENE_NEW" || conf.attr("type") == "SCENE_EDIT")
		{
			$("#header-home-page2 .close").trigger("click");
		}
		else if (conf.attr("type") == "SCENE_DELETE")
		{
			$("#header-home-page2 .close").trigger("click");
		}
	},
	onrecv_indication: function(indi)
	{
		//
	},
	onclose: function()
	{
		//
	},
	//
	name: "widget_add_scenery",
	title: ($(".widget_add_scenery").attr("data-scene-id") == "none" ? "{LANG_NEW_SCENERY}" : sceneries.filter("[id='" + $(".widget_add_scenery").attr("data-scene-id") + "']").attr("desc")),
	bodyWrapper: "set elsewhere",
	first_load: true,
	mode: $(".widget_add_scenery").attr("data-mode"),
	week_mem: [],
	time_mem: [],
	active_if_mem: "",
	triggered_by_ena: false,
	triggered_by: "1",
	cmds: [],
	scroller_pos: $("#container_scenery .entire").length-1,
	scenery: null,
	scene_id: $(".widget_add_scenery").attr("data-scene-id"),
	first_time_loaded: true,
	date_time_switch_state: false,
	event_switch_state: false,
	xml_any_tbl_scenery_ready_flg: false,
	associative_catId_xatsIdx: [], //associa l'id del device all'indice nella lista "xml_any_tbl_scenery"
	shortcut_mode: $(".widget_add_scenery").attr("data-shortcut-mode"),
	IoTCablatoFlg: false,
	//
	init_control: function()
	{
		var widget_obj = this;
		//
		$("#container_scenery .switcher").off("click").click(function()
		{
			if ($(this).attr("data-checked") == "1")
			{
				$(this).switchClass("bg_clear on", "bg_wsmt off", 150);
				$(this).attr("data-checked", "0");
			}
			else
			{
				$(this).switchClass("bg_wsmt off", "bg_clear on", 150);
				$(this).attr("data-checked", "1");
			}
			widget_obj.sw_trigger($(this).attr("id"));
		});
		//
		if (this.date_time_switch_state)
		{
			$("#date_sw")
				.switchClass("bg_wsmt off", "bg_clear on", 150)
				.attr("data-checked", "1");
		}
		else
		{
			$("#date_sw")
				.switchClass("bg_clear on", "bg_wsmt off", 150)
				.attr("data-checked", "0");
		}
		if (this.event_switch_state)
		{
			$("#active_if_sw")
				.switchClass("bg_wsmt off", "bg_clear on", 150)
				.attr("data-checked", "1");
		}
		else
		{
			$("#active_if_sw")
				.switchClass("bg_clear on", "bg_wsmt off", 150)
				.attr("data-checked", "0");
		}
		//
		$("#container_scenery .days_week").off("click").click(function()
		{
			if ($("#date_sw").attr("data-checked") == "1")
			{
				if ($(this).hasClass("week"))
				{
					if ($(this).attr("data-checked") == "1")
					{
						$(this).switchClass("bg_clear", "c_clear", 150);
						$(this).attr("data-checked", "0");
						//
						$(this).siblings(".days_week").first()
							.switchClass("c_clear", "bg_clear", 150)
							.attr("data-checked", "1");
						widget_obj.week_mem[1] = "1";
					}
					else
					{
						$(this).siblings(".days_week")
							.switchClass("bg_clear", "c_clear", 150)
							.attr("data-checked", "0");
						widget_obj.week_mem[1] = "0";
						widget_obj.week_mem[2] = "0";
						widget_obj.week_mem[3] = "0";
						widget_obj.week_mem[4] = "0";
						widget_obj.week_mem[5] = "0";
						widget_obj.week_mem[6] = "0";
						widget_obj.week_mem[7] = "0";
						//
						$(this).switchClass("c_clear", "bg_clear", 150);
						$(this).attr("data-checked", "1");
					}
				}
				else
				{
					if ($(this).attr("data-checked") == "1")
					{
						if ($(this).siblings(".days_week[data-checked='1']").length == 0)
						{
							$(this).siblings(".days_week").first()
								.switchClass("c_clear", "bg_clear", 150)
								.attr("data-checked", "1");
							widget_obj.week_mem[0] = "1";
						}
						//
						$(this).switchClass("bg_clear", "c_clear", 150);
						$(this).attr("data-checked", "0");
					}
					else
					{
						$(this).siblings(".days_week").first()
							.switchClass("bg_clear", "c_clear", 150)
							.attr("data-checked", "0");
						widget_obj.week_mem[0] = "0";
						//
						$(this).switchClass("c_clear", "bg_clear", 150);
						$(this).attr("data-checked", "1");
						//
						if ($(this).siblings(".days_week[data-checked='1']").length == 6)
							$(this).siblings(".days_week.week").trigger("click");
					}
				}
				//
				widget_obj.week_mem[$(this).index()] = $(this).attr("data-checked");
			}
		});
		//
		$("#container_scenery .favorite").off("click").click(function()
		{
			if ($(this).attr("data-checked") == "1")
				$(this).attr("data-checked", "0");
			else
				$(this).attr("data-checked", "1");
		});
	},
	init_variable: function()
	{
		var widget_obj = this;
		//
		if (this.scene_id == "none")
		{
			if (this.week_mem.length == 0)
			{
				this.week_mem[0] = "0";
				this.week_mem[1] = "1";
				this.week_mem[2] = "0";
				this.week_mem[3] = "0";
				this.week_mem[4] = "0";
				this.week_mem[5] = "0";
				this.week_mem[6] = "0";
				this.week_mem[7] = "0";
			}
			if (this.time_mem.length == 0)
			{
				this.time_mem["hr"] = "0";
				this.time_mem["min"] = "0";
			}
			this.date_time_switch_state = false;
			this.event_switch_state = false;
			var mre_list = xml_file_configuration.find("SceneTriggerEvents SceneTriggerEvent");
			this.active_if_mem = mre_list.filter("[id='1']").attr("desc");
		}
		else
		{
			this.scenery = sceneries.filter("[id='"+this.scene_id+"']");
			//
			$("#scenery_name").val(this.scenery.attr("desc"));
			$("#container_scenery .favorite").attr("data-checked", this.scenery.attr("home") == "TRUE" ? "1" : "0");	
			//
			var days = [];
			if (this.scenery.find("Scheduling Days").text() != "") days = this.scenery.find("Scheduling Days").text().split(",");
			var sched_ena = (this.scenery.find("Scheduling Ena").text() == "TRUE");
			var hr = this.scenery.find("Scheduling Hour").text();
			var min = this.scenery.find("Scheduling Minutes").text();
			this.date_time_switch_state = sched_ena;
			if (days.length == 0)
			{
				this.week_mem[0] = "0";
				this.week_mem[1] = "1";
				this.week_mem[2] = "0";
				this.week_mem[3] = "0";
				this.week_mem[4] = "0";
				this.week_mem[5] = "0";
				this.week_mem[6] = "0";
				this.week_mem[7] = "0";
			}
			else
			{
				this.week_mem[0] = days.indexOf("Wk") == -1 ? "0" : "1";
				this.week_mem[1] = days.indexOf("Mo") == -1 ? "0" : "1";
				this.week_mem[2] = days.indexOf("Tu") == -1 ? "0" : "1";
				this.week_mem[3] = days.indexOf("We") == -1 ? "0" : "1";
				this.week_mem[4] = days.indexOf("Th") == -1 ? "0" : "1";
				this.week_mem[5] = days.indexOf("Fr") == -1 ? "0" : "1";
				this.week_mem[6] = days.indexOf("Sa") == -1 ? "0" : "1";
				this.week_mem[7] = days.indexOf("Su") == -1 ? "0" : "1";
			}	
			this.time_mem["hr"] = (hr == "") ? "0" : hr;
			this.time_mem["min"] = (min == "") ? "0" : min;
			//
			////
			this.triggered_by_ena = (this.scenery.attr("triggeredByEna") == "TRUE");
			this.triggered_by = this.scenery.attr("triggeredBy");
			var mre_list = xml_file_configuration.find("SceneTriggerEvents SceneTriggerEvent");
			if (this.triggered_by == 0)
				this.triggered_by = 1;
			//
			var triggered_by_look_for = mre_list.filter("[id='" + this.triggered_by + "']");
			if (triggered_by_look_for.length > 0)
				this.active_if_mem = triggered_by_look_for.attr("desc");
			//
			this.event_switch_state = this.triggered_by_ena;
			////
			//
			this.scenery.find("Steps Step").each(function()
			{
				var device = xml_file_configuration.find("Devices Device[deleted='FALSE'][id='"+$(this).attr("deviceId")+"']");
				var device_deleted = xml_file_configuration.find("Devices Device[deleted='TRUE'][id='"+$(this).attr("deviceId")+"']");
				var value = $(this).attr("value") || null;
				//
				if (device.length > 0)
				{
					widget_obj.cmds.push
					([
					 	$(this).attr("deviceId")
					 	, $(this).attr("commandId")
					 	, $(this).attr("delay")
					 	, device.attr("desc")
					 	, xml_file_configuration.find("Categories Category Subcategories Subcategory[id='"+device.children("Subcategory").text()+"'] Commands Command[id='"+$(this).attr("commandId")+"']").attr("desc")
					 	, device.children("Subcategory").text()
					 	, value
					]);
				}
				else if (device_deleted.length > 0)
				{
					widget_obj.cmds.push
					([
					 	$(this).attr("deviceId")
					 	, $(this).attr("commandId")
					 	, $(this).attr("delay")
					 	, "{LANG_DEVICE_DELETED}"
					 	, xml_file_configuration.find("Categories Category Subcategories Subcategory[id='"+device.children("Subcategory").text()+"'] Commands Command[id='"+$(this).attr("commandId")+"']").attr("desc")
					 	, device.children("Subcategory").text()
					]);
//					widget_obj.deleted_cmds_idx.push(widget_obj.cmds.length-1);
				}
			});
			//
			////
			if (this.cmds.length > 0 && isIoTType(this.cmds.length, this.cmds[0][5], this.triggered_by_ena))
				this.IoTCablatoFlg = true; 
			else
				this.IoTCablatoFlg = false;
		}
	},
	init_updater: function()
	{
		var widget_obj = this;
		//
		$("#container_scenery .hours .arrow").off("pick_extra_func").on("pick_extra_func", function()
		{
			if (h24)
			{
				widget_obj.time_mem["hr"] = $("#container_scenery .pick_hours").text().cutBefore("0");
			}
			else
			{
				if ($("#container_scenery .ampm .am").is(":visible"))
				{
					if ($("#container_scenery .pick_hours").text() == "12")
						widget_obj.time_mem["hr"] = "0";
					else
						widget_obj.time_mem["hr"] = $("#container_scenery .pick_hours").text().cutBefore("0");
				}
				else if ($("#container_scenery .ampm .pm").is(":visible"))
				{
					if ($("#container_scenery .pick_hours").text() == "12")
						widget_obj.time_mem["hr"] = $("#container_scenery .pick_hours").text();
					else
						widget_obj.time_mem["hr"] = $("#container_scenery .pick_hours").text().cutBefore("0")-1+13;
				}
			}
		});
		//
		$("#container_scenery .minutes .arrow").off("pick_extra_func").on("pick_extra_func", function()
		{
			widget_obj.time_mem["min"] = $("#container_scenery .pick_minutes").text().cutBefore("0");
		});
	},
	draw_value_date: function()
	{
		var widget_obj = this;
		//
		if (this.date_time_switch_state)
		{
			$("#container_scenery .days_week").removeClass("c_wsmt");
			$("#container_scenery .days_week").each(function(index)
			{
				if (widget_obj.week_mem[index] == "1")
				{
					$(this).switchClass("c_clear", "bg_clear", 150);
					$(this).attr("data-checked", "1"); 
				}
				else
				{
					$(this).switchClass("bg_clear", "c_clear", 150);
					$(this).attr("data-checked", "0");
				}
			});
		}
		else
		{
			$("#container_scenery .days_week").swapClass("bg_clear", "c_clear").addClass("c_wsmt").attr("data-checked", "0");
		}
		//
		$("#container_scenery .pick_hours").text(this.time_mem["hr"]);
		$("#container_scenery .pick_minutes").text(this.time_mem["min"]);
		//
		if (this.date_time_switch_state)
		{
			$("#container_scenery .hours, #container_scenery .minutes").removeClass("disabled");
		}
		else
		{
			$("#container_scenery .hours, #container_scenery .minutes").addClass("disabled");
		}
		//
		if (h24)
		{
			$("#container_scenery .ampm").hide();
		}
		else
		{
			$("#container_scenery .ampm").show();
			//
			var hr = $("#container_scenery .pick_hours").text();
			//
			if (hr == "00" || hr == "0")	
			{
				$("#container_scenery .ampm .pm").hide();
				$("#container_scenery .ampm .am").show();
				$("#container_scenery .pick_hours").text("12");
			}
			else if (hr == "12")
			{
				$("#container_scenery .ampm .pm").show();
				$("#container_scenery .ampm .am").hide();
			}
			else if (hr > 12)
			{
				$("#container_scenery .ampm .pm").show();
				$("#container_scenery .ampm .am").hide();
				$("#container_scenery .pick_hours").text($("#container_scenery .pick_hours").text()-12);
			}
			else
			{
				$("#container_scenery .ampm .pm").hide();
				$("#container_scenery .ampm .am").show();
			}
		}
		//
		if ($("#container_scenery .pick_hours").text().length == 1)
			$("#container_scenery .pick_hours").text("0"+$("#container_scenery .pick_hours").text());
		if ($("#container_scenery .pick_minutes").text().length == 1)
			$("#container_scenery .pick_minutes").text("0"+$("#container_scenery .pick_minutes").text());
	},
	draw_value_active_if: function()
	{
		if (this.event_switch_state)
		{
			$("#container_scenery .active_if_sel").removeClass("disabled");
			$("#container_scenery .active_if_sel .sl_selector").html(this.active_if_mem);
		}
		else
		{
			$("#container_scenery .active_if_sel").addClass("disabled");
			$("#container_scenery .active_if_sel .sl_selector").html(this.active_if_mem);
		}
	},
	label_init_active_if: function() //copre solo il caso di "attiva se" di dispositivi IOT //per gli altri eventi vedere "triggered_by_look_for"
	{
		var mre_list = xml_file_configuration.find("SceneTriggerEvents SceneTriggerEvent");
		var triggered_by_look_for = mre_list.filter("[id='" + this.triggered_by + "']");
		if (triggered_by_look_for.length == 0)
		{
			for(var i = 0; i < xml_any_tbl_scenery.length; i++)
			{
				if (xml_any_tbl_scenery[i].find("item id").text() == this.triggered_by)
				{
					this.active_if_mem = xml_any_tbl_scenery[i].find("item name").text();
					this.draw_value_active_if();
					i = xml_any_tbl_scenery.length;
				}
			}
		}
	},
	sw_trigger: function(sw_id)
	{
		if (sw_id == "date_sw")
		{
			if ($("#date_sw").attr("data-checked") == "1")
				this.date_time_switch_state = true;
			else
				this.date_time_switch_state = false;
			//
			this.draw_value_date();
		}
		else if (sw_id == "active_if_sw")
		{
			if ($("#active_if_sw").attr("data-checked") == "1")
				this.event_switch_state = true;
			else
				this.event_switch_state = false;
			//
			this.draw_value_active_if();
		}
	},
	check_scenario_name: function()
	{
		var widget_obj = this;
		//
		var value_name = $.trim($("#scenery_name").val());
		if (value_name == "")
			return false;
		//
		if
		(
			sceneries_all.filter(function()
			{
				if ($(this).attr("desc").toLowerCase() == value_name.toLowerCase() && $(this).attr("id") != widget_obj.scene_id)
					return true;
				else return false;
			}).length > 0
		)
		return false;
		//
		return true;
	},
	check_cmds_len: function()
	{
		if (this.cmds.length == 0)
			return false;
		else return true;
	},
	refresh_cmds_list: function()
	{
		var widget_obj = this;
		//
		$("#container_scenery .entire .elem_cmd, #container_scenery .entire .picker_delay").remove();
		//
		for(var i = 0; i < this.cmds.length; i++)
		{
			this.draw_item_cmds_list(i);
		}
		//
		if (this.first_load)
		{
			this.first_load = false;
		}
		else
		{
			setTimeout(function()
			{
				widget_obj.address_label_init();
			}, 0.5 * 1000);
		}
		//
		this.func_item_cmds_list();
	},
	add_item_cmds_list: function()
	{
		this.draw_item_cmds_list(this.cmds.length-1);
		//
		this.func_item_cmds_list();
	},
	draw_item_cmds_list: function(index)
	{
		var widget_obj = this;
		//
		var rowNumber = Number($("#sceAction").attr("class").cutAround("row_", " ")) + index + 1;
		//
		$("#container_scenery .entire").append
		(
			"<div class='global_item row_" + rowNumber + " left elem_cmd" + (this.cmds[index][5] == WS_DEV_ALARM_THERMOSTAT_STR ? " thermo'" : "'") + " data-cat-id='" + this.cmds[index][0] + "' data-idx='" + index + "' data-xats-idx='" + this.associative_catId_xatsIdx[this.cmds[index][0]] + "'>"
			+	"<p class='devname c_wsmt'>" + this.cmds[index][3] + "</p>"
			+	"<p class='action c_wsmt'>{LANG_ACTION}: " + this.cmds[index][4] + "</p>"
			+	(this.cmds[index][5] == WS_DEV_ALARM_IOT_STR && this.IoTCablatoFlg ? "" : "<div class='delete'></div>")
			+	(this.cmds[index][5] == WS_DEV_ALARM_IOT_STR ? "" : "<div class='edit'></div>")
			+	(this.cmds[index][5] == WS_DEV_ALARM_THERMOSTAT_STR ? "<p class='indirizzoTempe c_wsmt'>" + this.temperature_label_draw(index) + "</p>" : "")
			+"</div>"
			+"<div class='global_item row_" + rowNumber + " right slot_picker picker_delay' data-idx='" + index + "'>"
			+	"<div class='side text'>"
			+		"<div class='wrap_tag'><p class='item_tag'>{LANG_DELAY}</p></div>"
			+	"</div>"
			+	"<div class='side arrow left'><p>_</p>"
			+	"</div>"
			+	"<div class='side value'><p data-lbound='0' data-rbound='59' class='pick_delay c_ye'>" + this.cmds[index][2] + "</p>"
			+	"</div>"
			+	"<div class='side arrow right'><p>+</p>"
			+	"</div>"
			+"</div>"
		);
	},
	func_item_cmds_list: function()
	{
		var widget_obj = this;
		//
		if (this.mode != "read") picker("#container_scenery");
		$("#container_scenery .picker_delay .side.arrow").off("pick_extra_func").on("pick_extra_func", function()
		{
			var idx = $(this).closest(".picker_delay").attr("data-idx");
			widget_obj.cmds[idx][2] = $(this).siblings(".value").children("p").text(); 
		});
		//
		$("#container_scenery .edit").off("click").click(function()
		{
			if (widget_obj.xml_any_tbl_scenery_ready_flg)
			{
				var idx = $(this).closest(".elem_cmd").attr("data-idx");
				if (widget_obj.cmds[idx][5] == WS_DEV_ALARM_CEN_STR)
					pag_change(".JSdialog2", "widget_zone_select_vert", widget_obj.cmds[idx][6], widget_obj.cmds[idx][6], widget_obj.cmds[idx][6], widget_obj.cmds[idx][0], widget_obj.cmds[idx][3], idx, widget_obj.cmds[idx][1], "scene", widget_obj.cmds[idx][6]);
				else if (widget_obj.cmds[idx][5] == WS_DEV_ALARM_THERMOSTAT_STR)
					pag_change(".JSdialog2", "widget_thermostat_device", "scene", widget_obj.cmds[idx][0], widget_obj.cmds[idx][3], widget_obj.cmds[idx][5], widget_obj.cmds[idx][1], idx, $(this).closest(".elem_cmd").attr("data-xats-idx"), widget_obj.cmds[idx][6]);
				else
					pag_change(".JSdialog2", "widget_cmd_device_cen", "scene", widget_obj.cmds[idx][0], widget_obj.cmds[idx][3], widget_obj.cmds[idx][5], widget_obj.cmds[idx][1], idx, $(this).closest(".elem_cmd").attr("data-xats-idx"));
			}
		});
		//
		$("#container_scenery .delete").off("click").click(function()
		{
			pag_change(".home .JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_WDELCMD}", "okab", "#container_scenery .elem_cmd[data-idx='" + $(this).parent().attr("data-idx") + "'] .delete");
		})
		.off("on_pw_ok").on("on_pw_ok", function()
		{
			var idx = $(this).parent().attr("data-idx");
			widget_obj.cmds.splice(idx, 1);
			widget_obj.refresh_cmds_list();
		});
		//
		$("#container_scenery .add_device").off("click").click(function()
		{
			if (widget_obj.xml_any_tbl_scenery_ready_flg)
			{
				pag_change(".JSdialog", "widget_scenery_device_list");
			}
		});
		//
		if (this.first_time_loaded)
		{
			this.scroller_pos = 0;
			this.first_time_loaded = false;
		}
	},
	refresh_item_cmds_list: function(index)
	{
		var widget_obj = this;
		//
		$("#container_scenery .elem_cmd:eq(" + index + ")").each(function()
		{
			$(this).children(".devname").text(widget_obj.cmds[index][3]);
			$(this).children(".action").html("{LANG_ACTION}: "+widget_obj.cmds[index][4]);
			$(this).children(".pick_delay").text(widget_obj.cmds[index][2]);
			if (widget_obj.cmds[index][5] == WS_DEV_ALARM_THERMOSTAT_STR)
			{
				$(this).children(".indirizzoTempe").html(widget_obj.temperature_label_draw(index));
				widget_obj.address_label_set($(this));
			}
		});
		//
		this.func_item_cmds_list();
	},
	save_scenario: function()
	{
		ena_save = true;
		//
		var ena_save_name = this.check_scenario_name();
		ena_save = ena_save_name;
		$("#scenery_name").css("background-color", "rgba(255,255,255,0.1)");
		if (!ena_save_name)
		{
			$("#scenery_name").css("background-color", "rgba(255,0,0,0.2)");
		}
		//
		if (ena_save)
		{
			var ena_save_cmd = this.check_cmds_len();
			ena_save = ena_save_cmd;
			if (!ena_save_cmd)
			{
				pag_change(".home .JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_ACTION_SCENE_WARN}", "ok", null);
			}
		}
		//
		if (ena_save && !this.IoTCablatoFlg)
		{
			var normalCmdFlg = false;
			var ioTCmdFlg = false;
			var trByConflFlg = false;
			//
			for (var i = 0; i < this.cmds.length; i++)	
			{
				if (this.cmds[i][5] == WS_DEV_ALARM_IOT_STR)
					ioTCmdFlg = true;
				else
					normalCmdFlg = true;
			}
			if (uniGetDev("id", "subcategory", this.triggered_by) == WS_DEV_ALARM_IOT_STR && ioTCmdFlg)
				trByConflFlg = true;
			//
			if (isIoTType(this.cmds.length, this.cmds[0][5], this.event_switch_state)) //event_switch_state sarebbe il triggered_by_ena da salvare
				ena_save = false;
			if (!ena_save)
			{
				pag_change(".home .JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_ACTION_SCENE_WARN_IOT}", "ok", null);
			}
			else
			{
				ena_save = !trByConflFlg;
				if (!ena_save)
				{
					pag_change(".home .JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_ACTION_SCENE_WARN_CONFL}", "ok", null);
				}
			}
		}
		//
		if (ena_save)
		{
			if 
			(
				this.event_switch_state
				&& Number(this.triggered_by) >= SceneTriggerEventsIdMin
				&& Number(this.triggered_by) <= SceneTriggerEventsIdMax
			)
			{
				var i = 0;
				for (i = 0; i < this.cmds.length; i++)
					if (this.cmds[i][5] == WS_DEV_ALARM_CEN_STR)
						break;
				//
				ena_save = (i >= this.cmds.length);
				//
				if (!ena_save)
					pag_change(".home .JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_ACTION_SCENE_WARN_CEN}", "ok", null);
			}
		}
		//
		//
		if (ena_save)
		{
			var scenario_name = $.trim($("#scenery_name").val());
			var favorite = $("#container_scenery .favorite").attr("data-checked") == "1" ? "TRUE" : "FALSE";
			var triggered_by_ena = this.event_switch_state;
			var triggered_by = this.triggered_by;
			var days = "";
			var minutes = "";
			var hours = "";			
			var day_flg = false;
			for (var i = 0; i < this.week_mem.length; i++)
			{
				if (this.week_mem[i] == "1")
				{
					if (day_flg) days += ",";
					if (i == 0) days += "Wk";
					else if (i == 1) days += "Mo";
					else if (i == 2) days += "Tu";
					else if (i == 3) days += "We";
					else if (i == 4) days += "Th";
					else if (i == 5) days += "Fr";
					else if (i == 6) days += "Sa";
					else if (i == 7) days += "Su";
					day_flg = true;
				}
			}
			minutes = this.time_mem["min"];
			hours = this.time_mem["hr"];
			//
			var edit_mode = !(this.scene_id == "none");
			//
			xml_request = xml_request_head_build(edit_mode ? "SCENE_EDIT" : "SCENE_NEW", "widget_add_scenery");
			xml_par = $(XML("Authentication")); xml_par.attr("username", "host"); xml_par.attr("password", "00000"); xml_request.append(xml_par);
			var xml_scene = $(XML("Scene")); if (edit_mode) xml_scene.attr("id", this.scene_id); xml_scene.attr("desc", scenario_name); xml_scene.attr("triggeredByEna", triggered_by_ena ? "TRUE" : "FALSE"); xml_scene.attr("triggeredBy", triggered_by); xml_scene.attr("home", favorite); xml_scene.attr("lock", "FALSE");
			var xml_scheduling = $(XML("Scheduling"));
			var xml_scheduling_ena = $(XML("Ena")); xml_scheduling_ena.text(this.date_time_switch_state ? "TRUE" : "FALSE");
			var xml_scheduling_days = $(XML("Days")); xml_scheduling_days.text(days);
			var xml_scheduling_hh = $(XML("Hour")); xml_scheduling_hh.text(hours);
			var xml_scheduling_mm = $(XML("Minutes")); xml_scheduling_mm.text(minutes);
			xml_scheduling.append(xml_scheduling_ena);
			xml_scheduling.append(xml_scheduling_days);
			xml_scheduling.append(xml_scheduling_hh);
			xml_scheduling.append(xml_scheduling_mm);			
			var xml_steps = $(XML("Steps"));
			for (var i = 0; i < this.cmds.length; i++)
			{		
				var xml_step_a = $(XML("Step")); xml_step_a.attr("deviceId", this.cmds[i][0]); xml_step_a.attr("commandId", this.cmds[i][1]); xml_step_a.attr("delay", this.cmds[i][2]);
				if (this.cmds[i][6] != null) xml_step_a.attr("value", this.cmds[i][6]);
				xml_steps.append(xml_step_a);
				//
				if (this.cmds[i][5] == WS_DEV_ALARM_CEN_STR) 
					xml_scene.attr("lock", "TRUE");
			}	
			xml_scene.append(xml_scheduling);
			xml_scene.append(xml_steps);
			xml_request.append(xml_scene);
			if (ena_save) xml_send(xml_request);
		}
	},
	//
	normalizer: function(value_dt, context, button)
	{
		var hour_mode = h24 ? 24 : 12;
		if (context.hasClass("hours"))
		{
			if (!h24)
			{
				if ((value_dt == 12 && button.hasClass("left")) || (value_dt == 11 && button.hasClass("right")))
					$("#container_scenery .ampm p").each(function()
					{
						if ($(this).is(":visible")) $(this).hide();
						else $(this).show();
					});
				//
				if (value_dt <= 1)
					if (button.hasClass("right")) return value_dt;
					else return hour_mode+1;
				else if (value_dt >= hour_mode)
					if (button.hasClass("left")) return (value_dt > hour_mode ? hour_mode+1 : hour_mode);
					else return 0;
			}
			else
			{
				if (value_dt <= 0)
					if (button.hasClass("right")) return value_dt;
					else return hour_mode;
				else if (value_dt >= hour_mode-1)
					if (button.hasClass("left")) return (value_dt > hour_mode-1 ? hour_mode : hour_mode-1);
					else return -1;
			}
		}
		if (context.hasClass("minutes"))
		{
			if (value_dt <= 0)
				if (button.hasClass("right")) return value_dt;
				else return 60;
			else if (value_dt >= 59)
				if (button.hasClass("left")) return value_dt;
				else return -1;
		}
		//
		return value_dt;
	},
	delete_scenario: function()
	{
		if (sceneries.filter("[id='" + this.scene_id + "']").attr("permanent") == "FALSE")
		{
			xml_request = xml_request_head_build("SCENE_DELETE", "widget_add_scenery");
			xml_par = $(XML("Authentication")); xml_par.attr("username", "host"); xml_par.attr("password", "00000"); xml_request.append(xml_par);
			xml_par = $(XML("Scene")); xml_par.text(this.scene_id); xml_request.append(xml_par);
			xml_send(xml_request);
		}
	},
	temperature_label_draw: function(index)
	{
		var str = this.cmds[index][6].replaceAtRegex(",", " ").replace(/(\d+\.\d+)/g, "$1°C ");
		if (str.charAt(0) == '0')
			str = str.substring(1);
		str = str.removeMatch(" 0");
		return str;
	},
	address_label_init: function()
	{
		var widget_obj = this;
		//
		$("#container_scenery .global_item.thermo").each(function()
		{
			widget_obj.address_label_set($(this));
		});
	},
	address_label_set: function(globalItemThermo)
	{
		$(".indirizzoTempe", globalItemThermo).each(function()
		{
			$(this).html("{LANG_THERMO_ADDRESS} " + xml_any_tbl_scenery[$(this).parent().attr("data-xats-idx")].children("address").text() + " | " + $(this).html());
		});
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			pag_change("#seeking-page .quadrant_abcd", "widget_scenery_list", "edit", widget_obj.shortcut_mode);
		});
		//
		$("#backTitle").html("{LANG_SCENERY}");
	},
	footer_home_switch: function()
	{
		var widget_obj = this;
		footer_home_switch_init();
		//
		//
		draw_footer_button("{LANG_OK}", "footer_h2_a_a");
		//
		$("#footer_h2_a_a").click(function()
		{
			widget_obj.save_scenario();
		});
		//
		//
		if (this.scene_id != "none")
			draw_footer_button("{LANG_ITEM_DEL}", "footer_h2_a_b");
		//
		$("#footer_h2_a_b").click(function()
		{
			pag_change(".home .JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_WDELSCENE}", "okab", "#footer_h2_a_b");
		})
		.on("on_pw_ok", function()
		{
			widget_obj.delete_scenario(widget_obj.scene_id);
		});
		//
		//
		draw_footer_button("{LANG_S_ADD_DEVICE}", "footer_h2_a_c");
		//
		$("#footer_h2_a_c").off("click").click(function()
		{
			pag_change(".JSdialog", "widget_scenery_device_list");
		});
		//
		//
		footer_button_rotate();
		scrollList(this);
	}
};