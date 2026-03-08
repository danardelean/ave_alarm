pag_table_new["widget_mod_device_rfid"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		//
		//
		item_dev_areas("#container_rfid", this);
		//
		global_item_init("#container_rfid", "name", "input", "name", this);
		//
		tslotf("#container_rfid", this.xml_any);
		//
		item_delete(".widget_mod_device_rfid", this);
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
	name: "widget_mod_device_rfid",
	xml_any: xml_any_tbl[any_ind],
	title: xml_any_tbl[any_ind].children("name").text(),
	area_ins: [],
	area_dis: [],
	area_insp: [],
	//
	par_save: function()
	{
		ena_save = true;
		//
		save_item_name("#container_rfid", this);
		//
		this.xml_any.find("area_ins").text(this.aa_to_str(this.area_ins, true));
		this.xml_any.find("area_dis").text(this.aa_to_str(this.area_dis, true));
		this.xml_any.find("area_insp").text(this.aa_to_str(this.area_insp, true));
		//
		save_item_tslot(this.xml_any);
	},
	aa_to_str: function(area_array, less)
	{
		return global_aa_to_str(area_array, less);
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