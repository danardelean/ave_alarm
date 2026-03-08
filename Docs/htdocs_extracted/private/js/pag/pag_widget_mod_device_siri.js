pag_table_new["widget_mod_device_siri"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		//
		//name
		global_item_init("#container_sir", "name", "input", "name", this);
		//room
		item_room("#container_sir", this.xml_any);
		//
		global_load_areas_switcher("#area_container_mod", this.xml_any, this);
		//
		global_picker_init("#container_sir", "vol_msg", "vol_msg", this);
		//
		global_picker_init("#container_sir", "vol_prealarm", "vol_prealarm", this);
		//
		global_picker_init("#container_sir", "vol_armdis", "vol_armdis", this);
		//
		global_switcher_binder("#container_sir", "talarm_fix", null, this.xml_any.children("talarm_fix_flg").text(), {condizione: "0", messaggio: "{LANG_LEGAL}"});
		//
		item_protection("#container_sir", this.xml_any, this);
		//
		item_chime("#container_sir", this);
		//
		item_fw_ver("#container_sir", this.xml_any);
		//
		item_delete("#container_sir", this);
		//
		//
		picker("#container_sir");
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
	name: "widget_mod_device_siri",
	xml_any: xml_any_tbl[any_ind],
	title: xml_any_tbl[any_ind].children("name").text(),
	//
	par_save: function()
	{
		ena_save = true;
		//
		save_item_name("#container_sir", this);
		//
		save_item_picker("#container_sir", "vol_msg", "vol_msg", this.xml_any);
		//
		save_item_picker("#container_sir", "vol_prealarm", "vol_prealarm", this.xml_any);
		//
		save_item_picker("#container_sir", "vol_armdis", "vol_armdis", this.xml_any);
		//
		save_item_toggled("#container_sir", "talarm_fix_flg", "talarm_fix", this.xml_any);
		//
		save_item_protection("#container_sir", this.xml_any, this);
		//
		save_item_chime("#container_sir", this);
		//
		save_item_area("#container_sir", this);
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