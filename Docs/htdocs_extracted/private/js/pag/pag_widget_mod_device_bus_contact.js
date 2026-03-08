pag_table_new["widget_mod_device_bus_contact"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		//
		//name
		global_item_init("#container_bus_contact", "name", "input", "name", this);
		//room
		item_room("#container_bus_contact", this.xml_any);
		//
		global_load_areas_switcher("#area_container_mod", this.xml_any, this);
		//
		picker("#container_bus_contact");
		//
		global_picker_init("#container_bus_contact", "mode_delay_sec", "delay", this);
		//sir_mode
		item_sir_mode("#container_bus_contact", this.xml_any);
		//chime
		item_chime("#container_bus_contact", this);
		//dispositivo associato
		item_and_function_dev_wrapper("#container_bus_contact", this.xml_any, this);
		//area and
		item_area_and_wrapper("#container_bus_contact", this.xml_any, this);
		//delay between device matched
		global_picker_init("#container_bus_contact", "mode_match_sec", "mode_match_sec_item", this);
		//tvcc
		item_tvcc("#container_bus_contact", this);
		//
		item_tvcc_delay_initial("#container_bus_contact", this);
		//
		item_delete("#container_bus_contact", this);
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
	name: "widget_mod_device_bus_contact",
	xml_any: xml_any_tbl[any_ind],
	title: xml_any_tbl[any_ind].children("name").text(),
	tvccs: xml_any_tbl[any_ind].find("tvccs").clone(),
	trovata_tvvc: false,
	attivata_tvcc: false,
	//
	clean_page: function()
	{
		polling_selettivo(this.xml_any.children("id").text(), this.xml_any.children("subcategory").text(), false);
	},
	par_save: function()
	{
		ena_save = true;
		//
		save_item_name("#container_bus_contact", this);
		//
		this.xml_any.find("room").text(id_room_selected);
		//
		save_item_picker("#container_bus_contact", "mode_delay_sec", "delay", this.xml_any);
		//
		this.xml_any.children("sir_mode").text($("#container_bus_contact .sound .sound_btn[data-checked='1']").attr("data-anchor"));
		//
		save_item_chime("#container_bus_contact", this);
		//
		this.xml_any.children("mode_match_id").text(and_function_dev);
		//
		save_item_mode("#container_bus_contact", this.xml_any, this);
		//
		save_item_picker("#container_bus_contact", "mode_match_sec", "mode_match_sec_item", this.xml_any);
		//
		save_item_area("#container_bus_contact", this);
		//
		save_item_toggled("#container_bus_contact", "area_or", "area_and", this.xml_any);
		//
		save_item_tvcc("#container_bus_contact", this);
		//"save_item_tvcc_delay_initial" sempre dopo "save_item_tvcc"
		save_item_tvcc_delay_initial("#container_bus_contact", this);
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