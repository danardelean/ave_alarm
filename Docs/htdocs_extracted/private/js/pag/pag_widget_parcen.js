pag_table_new["widget_parcen"] = {
	onload: function()
	{
		page_act("#seeking-page");
		schema_act("#seeking-page", "quadrant_abcd");
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		//save_step(WS_WIZARD_STEP_CENTRAL_PAR);
		var widget_obj = this;
		var disabled_flg = (!(role_str == "INST"));
		//
		picker("#container_parcen");
		//
		global_switcher_binder("#container_parcen", "door_lock_ena", this.xml_set, null, {condizione: "0", messaggio: "{LANG_EN50131}"});
		if (disabled_flg)
			$("#container_parcen .door_lock_ena").trigger("switch_state_changer", [["disabled"]]);
		//rilevatori isolati
		global_apply_diag("#container_parcen", "not_ena", "{LANG_WIZARD_NOT_ENA}", null, null, "widget_parcen");
		//
		global_picker_init("#container_parcen", "talarm", null, null, disabled_flg ? "disabled" : null, this.xml_set);
		global_picker_init("#container_parcen", "texit", null, null, disabled_flg ? "disabled" : null, this.xml_set);
		//supervisione radio
		global_switcher_binder("#container_parcen", "spv_ena", this.xml_set, null, {condizione: "0", messaggio: "{LANG_EN50131}"});
		if (disabled_flg)
			$("#container_parcen .spv_ena").trigger("switch_state_changer", [["disabled"]]);
		//interferenza radio
		global_picker_init("#container_parcen", "scan", null, null, disabled_flg ? "disabled" : null, this.xml_set);
		//mancanza rete(inteso come power)
		global_picker_init("#container_parcen", "pow", null, null, disabled_flg ? "disabled" : null, this.xml_set);
		//
		global_picker_init("#container_parcen", "wifi", null, null, disabled_flg ? "disabled" : null, this.xml_set);
		//
		global_switcher_binder("#container_parcen", "coerc_ena", this.xml_set);
		if (disabled_flg)
			$("#container_parcen .coerc_ena").trigger("switch_state_changer", [["disabled"]]);
		global_switcher_binder("#container_parcen", "coerc_tag_ena", this.xml_set);
		if (disabled_flg)
			$("#container_parcen .coerc_tag_ena").trigger("switch_state_changer", [["disabled"]]);
		//
		global_switcher_binder("#container_parcen", "imq_ena", this.xml_set, 1 - Number(this.xml_set.children("imq_ena").text()), {condizione: "1", messaggio: "{LANG_EN50131}"});
		if (disabled_flg)
			$("#container_parcen .imq_ena").trigger("switch_state_changer", [["disabled"]]);
		$("#container_parcen .imq_ena").on("toggle_tick_click", function()
		{
			if ($(this).attr("data-checked") == "0")
			{
				$("#container_parcen .pick_pow").attr("data-red", "1o,60o");
				if ($("#container_parcen .pick_pow").text() > 60 || $("#container_parcen .pick_pow").text() < 1)
					$("#container_parcen .pick_pow").addClass("red");
				else
					$("#container_parcen .pick_pow").removeClass("red");
				//
				$("#container_parcen .pick_scan").attr("data-red", "1o,30o");
				if ($("#container_parcen .pick_scan").text() > 30 || $("#container_parcen .pick_scan").text() < 1)
					$("#container_parcen .pick_scan").addClass("red");
				else
					$("#container_parcen .pick_scan").removeClass("red");
				//
				if (!disabled_flg)
					$("#container_parcen .door_lock_ena").trigger("switch_state_changer", [["disabled"]]);
			}
			else if ($(this).attr("data-checked") == "1")
			{
				$("#container_parcen .pick_pow, #container_parcen .pick_scan")
					.removeAttr("data-red")
					.removeClass("red");
				//
				if (!disabled_flg)
					$("#container_parcen .door_lock_ena").trigger("switch_state_changer", [["enabled"]]);
			}
		}).trigger("toggle_tick_click");
		//chime
		global_picker_init("#container_parcen", "tchime", null, null, disabled_flg ? "disabled" : null, this.xml_set);
		//
		global_picker_init("#container_parcen", "stdby_pow", null, null, BLK ? "disabled" : null, this.xml_set);
		global_picker_init("#container_parcen", "bright_stdby", null, null, BLK ? "disabled" : null, this.xml_set);
		global_picker_init("#container_parcen", "bright_run", null, null, BLK ? "disabled" : null, this.xml_set);
		global_picker_init("#container_parcen", "bright_maint", null, null, BLK ? "disabled" : null, this.xml_set);
		global_picker_init("#container_parcen", "tout_maint", null, null, disabled_flg ? "disabled" : null, this.xml_set);
		//
		global_switcher_binder("#container_parcen", "tout_maint_ena", this.xml_set);
		$("#container_parcen .tout_maint_ena").off("toggle_tick_click").on("toggle_tick_click", function()
		{
			if ($(this).attr("data-checked") == "0")
				$("#container_parcen .tout_maint").addClass("disabled");
			else if ($(this).attr("data-checked") == "1")
				$("#container_parcen .tout_maint").removeClass("disabled");
		}).trigger("toggle_tick_click");
		if (disabled_flg)
		{
			$("#container_parcen .tout_maint_ena").trigger("switch_state_changer", [["disabled"]]);
			$("#container_parcen .tout_maint").addClass("disabled");
		}
		//
		global_picker_init("#container_parcen", "vol_local", null, null, null, this.xml_set);
		$("#container_parcen .vol_local .side.arrow").on("pick_extra_func", function()
		{
			clearTimeout(widget_obj.t_out_bip);
			widget_obj.t_out_bip = setTimeout(function(){send_state_volume($("#container_parcen .pick_vol_local").text());}, 500);
		});
		//
		//bright_maint cambio al volo
		var t_out_bright;
		$("#container_parcen .bright .arrow").click("click.bright", function()
		{
			send_state_brightness($(this).siblings(".value").children(".pick_bright").text());
			//
			clearTimeout(t_out_bright);
			t_out_bright = setTimeout(function()
			{
				send_state_brightness($("#container_parcen .pick_bright_maint").text());
			}, 3000);
		});
		//
		this.and_match = parseInt(this.xml_set.children("and_match_ena").text());
		if (this.and_match == 0)
			$("#container_parcen .and_match .sl_selector").html("{LANG_WIZARD_AND_MATCH_ITEM_OR}");
		else
			$("#container_parcen .and_match .sl_selector").html("{LANG_WIZARD_AND_MATCH_ITEM_AND}");
		global_apply_diag("#container_parcen", "and_match", "{LANG_WIZARD_AND_MATCH_TITLE}", null, null, "widget_parcen");
		if (disabled_flg)
			$("#container_parcen .and_match").addClass("disabled");
		//
		global_switcher_binder("#container_parcen", "cen_reed_tamper_ena", this.xml_set, null, {condizione: "0", messaggio: "{LANG_EN50131}"});
		global_switcher_binder("#container_parcen", "cen_sir_ena", this.xml_set, null, null);
		//
		var season_pass = this.xml_set.children("ave_iot_therm_mode").text();
		if (season_pass == "0" || season_pass == "1")
			this.season_pass = parseInt(season_pass);
		if (this.season_pass == -1)
			$("#container_parcen .season_pass").addClass("unavailable");
		else if (this.season_pass == 0)
			$("#container_parcen .season_pass .sl_selector").html("{LANG_THERMO_SUMMER}");
		else
			$("#container_parcen .season_pass .sl_selector").html("{LANG_THERMO_WINTER}");
		global_apply_diag("#container_parcen", "season_pass", "{LANG_THERMO_SEASON}", null, null, "widget_parcen");
		//
		this.theme_pass_local = Number(this.xml_set.children("theme_selector").text());
		$("#container_parcen .theme_pass .sl_selector").html(this.theme_pass_str[this.theme_pass_local]);
		global_apply_diag("#container_parcen", "theme_pass", "{LANG_THEME_PASS}", null, null, "widget_parcen");
		//
		if (!isTSSmart() && !isAPPWebView() && !QT)
		{
			this.theme_pass_local_web = $.cookie("theme_pass") ? Number($.cookie("theme_pass")) : Number(this.xml_set.children("theme_selector").text());
			$("#container_parcen .theme_pass2").removeClass("unavailable");
			$("#container_parcen .theme_pass2 .sl_selector").html(this.theme_pass_str[this.theme_pass_local_web]);
			global_apply_diag("#container_parcen", "theme_pass2", "{LANG_THEME_PASS2}", null, null, "widget_parcen");	
		}
		//
		load_devices_cust
		(
			null
			, WS_DEV_ALARM_GSM_STR
			+ "|" + WS_DEV_ALARM_PSTN_STR
			+ "|" + WS_DEV_ALARM_WIFI_STR
			+ "|" + WS_DEV_ALARM_TERM_STR
			+ "|" + WS_DEV_ALARM_CEN_STR
			+ "|" + WS_DEV_ALARM_LCD_STR
			+ "|" + WS_DEV_ALARM_POW_STR
			+ "|" + WS_DEV_ALARM_RTC_STR
			+ "|" + WS_DEV_ALARM_BAT_STR
			+ "|" + WS_DEV_ALARM_CARRIER_STR
			+ "|" + WS_DEV_ALARM_RELAY_STR
			+ "|" + WS_DEV_ALARM_CLOUD_STR
			+ "|" + WS_DEV_ALARM_REPEATER_STR
			+ "|" + WS_DEV_ALARM_TELEGEST_STR
			+ "|" + WS_DEV_ALARM_DASH_STR
			+ "|" + WS_DEV_ALARM_AVE_AUTOMATION_STR
			+ "|" + WS_DEV_ALARM_IOT_STR
			+ "|" + WS_DEV_ALARM_THERMOSTAT_STR
			+ "|" + WS_DEV_ALARM_BUS_CONC_RF_STR
			, "filter_not");
		//
		summary_highlighter(this);
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "MENU")
		{		
			if (conf.children("act").text() == "SAVE")
			{
				if (conf.children("res").text() == "SAVED")
				{
					if (conf.children("page").text() == WS_SET_STR)
					{
						cen_set_xml = this.xml_set;
						imq_set(this.xml_set.find("par imq_ena").text());
						//
						stopWaitingScr();
						//
						stdby_t_in = $("#container_parcen .pick_stdby_pow").text();
						//
						if (QT)
						{
							theme_pass = this.theme_pass_local;
							theme_changer();
						}
						else
						{
							if 
							(
								!isTSSmart()
								&& !isAPPWebView()
							)
							{
								$.cookie("theme_pass", this.theme_pass_local_web, { expires: 365 });
								theme_pass = this.theme_pass_local_web;
								theme_changer();
							}
						}
						//
						setTimeout(function()
						{
							$(".footer_container_btn_inside").trigger("parcen_saved");
						}, 0.5*1000);
					}
				}
				else if (conf.children("res").text() == "ERROR")
				{
					stopWaitingScr();
					//
					alert(conf.children("res").text()+": "+conf.children("desc").text());
				}
			}
		}
	},
	onrecv_indication: function(indi)
	{
		//
	},
	onclose: function()
	{
		this.diag_list_notena = [];
	},
	//
	name: "widget_parcen",
	title: "{LANG_WIZARD_PARCEN_TITLE}",
	xml_set: cen_set_xml.clone(),
	xml_any: null,
	xml_any_tbl_parcen: [],
	xml_any_tbl_parcen_bkp: [],
	xml_any_arr: [],
	t_out_bip: null,
	and_match: null,
	season_pass: -1,
	theme_pass_str: ["{LANG_THEME_LEGACY}", "{LANG_THEME_DARK}", "{LANG_THEME_LIGHT}", "{LANG_THEME_TEAL}"],
	theme_pass_local: null,
	theme_pass_local_web: null,
	//
	par_save: function()
	{
		ena_save = true;
		//
		//
		save_item_toggled("#container_parcen", "door_lock_ena", null, this.xml_set);
		//x rilevatori isolati vedi send_parcen_save
		save_item_picker("#container_parcen", "talarm", "talarm", this.xml_set);
		save_item_picker("#container_parcen", "texit", "texit", this.xml_set);
		save_item_toggled("#container_parcen", "spv_ena", null, this.xml_set);
		save_item_picker("#container_parcen", "scan", "scan", this.xml_set);
		save_item_picker("#container_parcen", "pow", "pow", this.xml_set);
		if (!(DIY || type_conn == null || type_conn != "CL"))
		{
			save_item_picker("#container_parcen", "wifi", "wifi", this.xml_set);
		}
		//
		save_item_toggled("#container_parcen", "coerc_ena", null, this.xml_set);
		save_item_toggled("#container_parcen", "coerc_tag_ena", null, this.xml_set);
		//
		save_item_toggled("#container_parcen", "imq_ena", null, this.xml_set, true);
		this.xml_set.children("and_match_ena").text("" + this.and_match);
		//chime
		save_item_picker("#container_parcen", "tchime", "tchime", this.xml_set);
		//
		save_item_picker("#container_parcen", "stdby_pow", "stdby_pow", this.xml_set);
		save_item_picker("#container_parcen", "bright_stdby", "bright_stdby", this.xml_set);
		save_item_picker("#container_parcen", "bright_run", "bright_run", this.xml_set);
		save_item_picker("#container_parcen", "bright_maint", "bright_maint", this.xml_set);
		save_item_picker("#container_parcen", "tout_maint", "tout_maint", this.xml_set);
		//
		save_item_toggled("#container_parcen", "tout_maint_ena", null, this.xml_set);
		//
		save_item_picker("#container_parcen", "vol_local", "vol_local", this.xml_set);
		//
		for (var i = 0; i < this.xml_any_tbl_parcen_bkp.length; i++)
		{
			var ena_value = this.xml_any_tbl_parcen_bkp[i].children("ena").text();
			var led_value = this.xml_any_tbl_parcen_bkp[i].children("led").text();
			//
			if (led_value === "0" || led_value === "1" || ena_value === "0" || ena_value === "1")
			{
				if (ena_value != this.xml_any_tbl_parcen[i].children("ena").text() || led_value != this.xml_any_tbl_parcen[i].children("led").text())
				{
					this.xml_any_arr.push(this.xml_any_tbl_parcen_bkp[i]);
				}
			}
		}
		//
		save_item_toggled("#container_parcen", "cen_sir_ena", null, this.xml_set);
		save_item_toggled("#container_parcen", "cen_reed_tamper_ena", null, this.xml_set);
		//
		if (this.season_pass != -1)
			this.xml_set.children("ave_iot_therm_mode").text("" + this.season_pass);
		//
		this.xml_set.children("theme_selector").text(this.theme_pass_local);
		//
		if (this.xml_any_arr.length > 0) 
			global_send_dev_mod_save(this, false, false);
		this.xml_any_arr = [];
		this.xml_any = this.xml_set;
	},
	init_xml_any_tbl: function()
	{
		var i = 0;
		count_led_off = 0;
		count_ena_off = 0;
		var item_led = false;
		var item_ena = false;
		var activate_led_item = $(".widget_parcen").hasClass("limited");
		//
		for (i = 0; i < this.xml_any_tbl_parcen.length; i++)
		{
			if (activate_led_item)
			{
				var device_led = this.xml_any_tbl_parcen[i].children("led").text();
				if (device_led == "0")
				{
					count_led_off++;
					item_led = true;
				}
				else if (device_led == "1")
				{
					item_led = true;
				}
			}
			//
			var device_ena = this.xml_any_tbl_parcen[i].children("ena").text();
			if (device_ena == "0")
			{
				count_ena_off++;
				item_ena = true;
			}
			else if (device_ena == "1")
			{
				item_ena = true;
			}
		}
		//
		//
		if (count_ena_off == 0) 
			$("#container_parcen .not_ena .sl_selector").html("{LANG_ITEM_NONE}"); 
		else 
			$("#container_parcen .not_ena .sl_selector").html("{LANG_ITEM_AT_LEAST_ONE}");
		//
		if (item_ena)
			$(".widget_parcen .not_ena").removeClass("disabled");
		if (!(role_str == "INST" || role_str == "POWERUSER"))
			$(".widget_parcen .not_ena").addClass("disabled");
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			header_nav_settings_generic_group(widget_obj);
		});
		//
		$("#backTitle").html("{LANG_NAV_SETTINGS_GENERIC}");
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
			global_send_dev_mod_save(widget_obj, null, null, WS_SET_STR);
		});
		$("#footer_h2_a_a").on("parcen_saved", function()
		{
			if (wizard_flg)
			{
				poptoast("{LANG_ITEM_SAVED}");
			}
			else
			{
				$("#header-home-page2 .close").trigger("click");
			}
		});
		//
		//
		footer_button_rotate();
		scrollList(this);
	}
};