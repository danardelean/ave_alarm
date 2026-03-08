pag_table_new["widget_mod_device_bus_input_s"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		//
		//name
		global_item_init("#container_bus_input_s", "name", "input", "name", this);
		//room
		item_room("#container_bus_input_s", this.xml_any);
		//
		global_load_areas_switcher("#area_container_mod", this.xml_any, this);
		if (!mode_bus_rf_dynamic_area_flg("#container_bus_input_s", this))
			$("#area_container_mod .switcher").trigger("switch_state_changer", [["disabled", "on"]]);
		//
		$("#container_bus_input_s .mode_bus_rf .sl_selector").html(this.mode_bus_rf_label[this.mode_bus_rf]);
		global_apply_diag("#container_bus_input_s", "mode_bus_rf", "{LANG_BUS_SENRF_MODE}", null, null, this.name);
		//reed
		item_reed_mode("#container_bus_input_s", this.xml_any, this);
		//
		picker("#container_bus_input_s");
		//
		global_picker_init("#container_bus_input_s", "mode_delay_sec", "delay", this);
		//sir_mode
		item_sir_mode("#container_bus_input_s", this.xml_any);
		//dispositivo associato
		item_and_function_dev_wrapper("#container_bus_input_s", this.xml_any, this);
		//area and
		item_area_and_wrapper("#container_bus_input_s", this.xml_any, this);
		//delay between device matched
		global_picker_init("#container_bus_input_s", "mode_match_sec", "mode_match_sec_item", this);
		//chime
		item_chime("#container_bus_input_s", this);
		//tvcc
		item_tvcc("#container_bus_input_s", this);
		//
		item_tvcc_delay_initial("#container_bus_input_s", this);
		//
		item_fw_ver("#container_bus_input_s", this.xml_any);
		//
		var widget_obj = this;
		$("#footer_h2_a_b").click(function()
		{
			pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_WDELDEV}", "okab", "#footer_h2_a_b");
		})
		.on("on_pw_ok", function()
		{
			widget_obj.xml_any.children("child_valid").text("0");
			//
			xml_request = xml_request_head_build("MENU", "widget_mod_device_bus_input_s");
			xml_par = $(XML("act")); xml_par.text("SAVE"); xml_request.append(xml_par);
			xml_par = $(XML("page")); xml_par.text(WS_DEV_STR); xml_request.append(xml_par);
			xml_par = $(XML("par")); xml_request.append(xml_par);
			xml_par.append(widget_obj.xml_any);
			xml_send(xml_request);
		});
		//
		if (this.mode_bus_rf > Number(MATCH_AREA))
			mode_bus_rf_dynamic_gui("#container_bus_input_s", this, false);
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "MENU")
		{		
			if (conf.children("act").text() == "SAVE")
			{
				if (conf.children("res").text() == "SAVED")
				{
					if (conf.children("page").text() == WS_DEV_STR)
					{
						$("#header-home-page2 .close").trigger("click", [true]);
					}
				}
				else if (conf.children("res").text() == "ERROR")
				{
					tyu(conf.children("res").text() + ": " + conf.children("desc").text());
				}
			}
			else if (conf.children("act").text() == "DELETE")
			{
				if (conf.children("res").text() == "DELETING")
				{
					if (conf.children("page").text() == WS_DEV_STR)
					{
						//
					}
				}
				else if (conf.children("res").text() == "ERROR")
				{
					tyu(conf.children("res").text() + ": " + conf.children("desc").text());
				}
			}
		}
	},
	onrecv_indication: function(indi)
	{
		if (indi.attr("type") == "MENU")
		{
			if (indi.children("act").text() == "DELETE")
			{
				if (indi.children("res").text() == "DELETED")
				{
					if (indi.children("page").text() == WS_DEV_STR)
					{
						$("#header-home-page2 .close").trigger("click", [true]);
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
	name: "widget_mod_device_bus_input_s",
	xml_any: xml_any_tbl[any_ind],
	title: xml_any_tbl[any_ind].children("name").text(),
	tvccs: xml_any_tbl[any_ind].find("tvccs").clone(),
	mode_bus_rf: Number(xml_any_tbl[any_ind].find("mode").text()),
	mode_bus_rf_label: function()
	{
		var assarr = [];
		assarr[DELAYED] = "{LANG_BUS_SENRF_MODE_DETECT}";//"{LANG_DEFAULT_MODE}";
		assarr[MATCH_DEV] = "{LANG_BUS_SENRF_MODE_DETECT}";//"{LANG_DEV_AND_MODE}";
		assarr[MATCH_AREA] = "{LANG_BUS_SENRF_MODE_DETECT}";//"{LANG_AREA_AND_MODE}";
		assarr[ALA_MODE_M] = "{LANG_FIRST_AID}";
		assarr[ALA_MODE_P] = "{LANG_PANIC}";
		assarr[ALA_MODE_R] = "{LANG_AGGRESSION}";
		assarr[ALA_MODE_T] = "{LANG_TECNO_MODE}";
		assarr[ALA_MODE_SIR] = "{LANG_SIREN_MODE}";
		return assarr;
	}(),
	mode_bus_rf_compact_gui_flg: false,
	//
	clean_page: function()
	{
		polling_selettivo(this.xml_any.children("id").text(), this.xml_any.children("subcategory").text(), false);
	},
	par_save: function()
	{
		ena_save = true;
		//
		save_item_name("#container_bus_input_s", this);
		//
		if (DIY) this.xml_any.find("room").text(id_room_selected);
		//
		save_item_area("#container_bus_input_s", this);
		//
//		if (this.force_to_open)
//			xml_any.children("alarm_mode").text("1");
/*		else */if ($("#container_bus_input_s .reed .roc[data-checked='1']").hasClass("open"))
			this.xml_any.children("alarm_mode").text("1");
		else if ($("#container_bus_input_s .reed .roc[data-checked='1']").hasClass("open_close"))
			this.xml_any.children("alarm_mode").text("2");
		//
		save_item_picker("#container_bus_input_s", "mode_delay_sec", "delay", this.xml_any);
		//
		this.xml_any.children("sir_mode").text($("#container_bus_input_s .sound .sound_btn[data-checked='1']").attr("data-anchor"));
		//
		this.xml_any.children("mode_match_id").text(and_function_dev);
		//
		save_item_picker("#container_bus_input_s", "mode_match_sec", "mode_match_sec_item", this.xml_any);
		//
		save_item_mode("#container_bus_input_s", this.xml_any, this);
		//
		save_item_tvcc("#container_bus_input_s", this);
		//"save_item_tvcc_delay_initial" sempre dopo "save_item_tvcc"
		save_item_tvcc_delay_initial("#container_bus_input_s", this);
		//
		save_item_chime("#container_bus_input_s", this);
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		//
		header_mod_device(this);
	},
	footer_home_switch: function()
	{
		var widget_obj = this;
		footer_home_switch_init();
		//
		draw_footer_button("{LANG_OK}", "footer_h2_a_a");
		draw_footer_button("{LANG_WIZARD_MOD_DEVICE_DEL}", "footer_h2_a_b"); //gestito nella item_delete()
		//
		$("#footer_h2_a_a").click(function()
		{
			global_send_dev_mod_save(widget_obj);
		});
		//
		footer_button_rotate();
		scrollList(this);
	}
};