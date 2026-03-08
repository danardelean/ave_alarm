pag_table_new["widget_mod_device_mic"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		//
		//name
		global_item_init("#container_mic", "name", "input", "name", this);
		//room
		item_room("#container_mic", this.xml_any);
		//
		global_load_areas_switcher("#area_container_mod", this.xml_any, this);
		//
		picker("#container_mic");
		//
		item_sensibility("#container_mic", this.xml_any);
		//
		global_picker_init("#container_mic", "mode_delay_sec", "delay", this);
		//
		item_sir_mode("#container_mic", this.xml_any);
		//
		item_protection("#container_mic", this.xml_any, this);
		//
		item_led("#container_mic", this.xml_any, this);
		//dispositivo associato
		item_and_function_dev_wrapper("#container_mic", this.xml_any, this);
		//area and
		item_area_and_wrapper("#container_mic", this.xml_any, this);
		//delay between device matched
		global_picker_init("#container_mic", "mode_match_sec", "mode_match_sec_item", this);
		//father ena sons
//		var am_son1 = "2";
//		if (this.son1.children("alarm_mode").text() != "0")
//			am_son1 = this.son1.children("alarm_mode").text();
		global_switcher_binder("#container_mic", "ena_son1", null, this.son1.children("alarm_mode").text() == "0" ? "0" : "1");
		//tvcc
		item_tvcc("#container_mic", this);
		//
		item_tvcc_delay_initial("#container_mic", this);
		//
		item_fw_ver("#container_mic", this.xml_any);
		//
		item_delete("#container_mic", this);
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
					tyu(conf.children("res").text()+": "+conf.children("desc").text());
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
					tyu(conf.children("res").text()+": "+conf.children("desc").text());
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
	name: "widget_mod_device_mic",
	xml_any: xml_any_tbl[any_ind],
	title: xml_any_tbl[any_ind].children("name").text(),
	son1: xml_any_tbl[any_ind].children("has_children").text() == "1" ? xml_any_tbl[any_ind-1+2] : null,
	tvccs: xml_any_tbl[any_ind].find("tvccs").clone(),
	trovata_tvvc: false,
	attivata_tvcc: false,
	//
	par_save: function()
	{
		ena_save = true;
		//
		save_item_name("#container_mic", this);
		//save_room
		if (DIY) this.xml_any.find("room").text(id_room_selected);
		if (DIY) this.son1.find("room").text(id_room_selected);
		//
		save_item_picker("#container_mic", "sensibility", "sensibility", this.xml_any);
		//
		save_item_picker("#container_mic", "mode_delay_sec", "delay", this.xml_any);
		//
		this.xml_any.children("sir_mode").text($("#container_mic .sound .sound_btn[data-checked='1']").attr("data-anchor"));
		this.son1.children("sir_mode").text($("#container_mic .sound .sound_btn[data-checked='1']").attr("data-anchor"));
		//
		save_item_protection("#container_mic", this.xml_any, this);
		//
		save_item_led("#container_mic", this.xml_any);
		//
		this.xml_any.children("mode_match_id").text(and_function_dev);
		this.son1.children("mode_match_id").text(and_function_dev);
		//
		save_item_mode("#container_mic", this.xml_any, this); // X item_area_and_wrapper
		save_item_mode("#container_mic", this.son1, this);
		//
		save_item_picker("#container_mic", "mode_match_sec", "mode_match_sec_item", this.xml_any);
		save_item_picker("#container_mic", "mode_match_sec", "mode_match_sec_item", this.son1);
		//
		save_item_area("#container_mic", this);
		//
		//save_item_toggled("#container_mic", "alarm_mode", "ena_son1", this.son1);
		//
		/*************************/
		/********** son1 *********/
		//ena dal padre	
		if ($("#container_mic .ena_son1").attr("data-checked") != "0" && this.son1.children("alarm_mode").text() == "0")
		{
			this.son1.children("alarm_mode").text("2");
		}
		else if ($("#container_mic .ena_son1").attr("data-checked") == "0" && this.son1.children("phy_mode").text() != "0")
		{
			this.son1.children("alarm_mode").text("0");
		}
		//
		save_item_tvcc("#container_mic", this);
		//"save_item_tvcc_delay_initial" sempre dopo "save_item_tvcc"
		save_item_tvcc_delay_initial("#container_mic", this);
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
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