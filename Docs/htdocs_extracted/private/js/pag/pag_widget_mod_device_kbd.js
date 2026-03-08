pag_table_new["widget_mod_device_kbd"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		//
		//
		item_room("#container_kbd", this.xml_any);
		//
		global_load_areas_switcher("#area_container_mod", this.xml_any, this);
		//
		global_item_init("#container_kbd", "name", "input", "name", this);
		//
		if (DIY)
		{
			$("#container_kbd .rfid_ena_flg").addClass("invisible");
			$("#container_kbd .rfid_insp_flg").addClass("invisible");
		}
		//
		global_switcher_binder("#container_kbd", "rfid_ena_flg", this.xml_any);
		$("#container_kbd .rfid_ena_flg").on("toggle_tick_click", function()
		{
			if ($(this).attr("data-checked") == "0")
				$("#container_kbd .rfid_insp_flg").trigger("switch_state_changer", [["disabled", "off"]]);
			else
				$("#container_kbd .rfid_insp_flg").trigger("switch_state_changer", [["enabled"]]);
		});
		global_switcher_binder("#container_kbd", "rfid_insp_flg", this.xml_any);
		$("#container_kbd .rfid_ena_flg").trigger("toggle_tick_click");
		global_switcher_binder("#container_kbd", "info_flg", this.xml_any, null, {condizione: "1", messaggio: "{LANG_EN50131}"});
		global_switcher_binder("#container_kbd", "m_flg", this.xml_any);
		global_switcher_binder("#container_kbd", "r_flg", this.xml_any);
		global_switcher_binder("#container_kbd", "p_flg", this.xml_any);
		//
		item_fw_ver("#container_kbd", this.xml_any);
		//
		if (SIL || AVE) $("#container_kbd .domo_bid").addClass("unavailable");
		//
		item_delete("#container_kbd", this);
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
					alert(conf.children("res").text()+": "+conf.children("desc").text());
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
					alert(conf.children("res").text()+": "+conf.children("desc").text());
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
	name: "widget_mod_device_kbd",
	xml_any: xml_any_tbl[any_ind],
	title: xml_any_tbl[any_ind].children("name").text(),
	//
	par_save: function()
	{
		ena_save = true;
		//
		save_item_name("#container_kbd", this);
		//
		this.xml_any.find("room").text(id_room_selected);
		//
		save_item_area("#container_kbd", this);
		//
		if (!DIY) save_item_toggled("#container_kbd", "rfid_ena_flg", null, this.xml_any);
		if (!DIY) save_item_toggled("#container_kbd", "rfid_insp_flg", null, this.xml_any, null, true);
		save_item_toggled("#container_kbd", "info_flg", null, this.xml_any);
		save_item_toggled("#container_kbd", "m_flg", null, this.xml_any);
		save_item_toggled("#container_kbd", "r_flg", null, this.xml_any);
		save_item_toggled("#container_kbd", "p_flg", null, this.xml_any);
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