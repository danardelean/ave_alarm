pag_table_new["widget_mod_device_smo"] = {
	onload: function()
	{
		var widget_obj = this;
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		//name
		global_item_init("#container_smo", "name", "input", "name", this);
		//room
		item_room("#container_smo", this.xml_any);
		//
		global_picker_init("#container_smo", "mode_delay_sec", "delay", this);
		//led allarme
		item_led("#container_smo", this.xml_any, this);
		//anti removal protection
		item_protection("#container_smo", this.xml_any, this);
		//
		picker("#container_smo");
		//tvcc
		item_tvcc("#container_smo", this);
		//
		item_tvcc_delay_initial("#container_smo", this);
		//
		item_fw_ver("#container_smo", this.xml_any);
		//
		item_delete("#container_smo", this);
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
	name: "widget_mod_device_smo",
	xml_any: xml_any_tbl[any_ind],
	title: xml_any_tbl[any_ind].children("name").text(),
	tvccs: xml_any_tbl[any_ind].find("tvccs").clone(),
	trovata_tvvc: false,
	attivata_tvcc: false,
	//
	par_save: function()
	{
		ena_save = true;
		//
		save_item_name("#container_smo", this);
		//save_room
		this.xml_any.find("room").text(id_room_selected);
		// ritardo allarme
		save_item_picker("#container_smo", "mode_delay_sec", "delay", this.xml_any);
		// led
		save_item_led("#container_smo", this.xml_any);
		// protect
		save_item_protection("#container_smo", this.xml_any, this);
		//
		save_item_tvcc("#container_smo", this);
		//"save_item_tvcc_delay_initial" sempre dopo "save_item_tvcc"
		save_item_tvcc_delay_initial("#container_smo", this);
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