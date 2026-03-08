pag_table_new["widget_mod_device_bus_input"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		//
		//name
		global_item_init("#container_bus_input", "name", "input", "name", this);
		//room
		item_room("#container_bus_input", this.xml_any);
		//
		global_load_areas_switcher("#area_container_mod", this.xml_any, this);
		//
		for (var i = 0; i < this.xml_bus_input_tbl.length; i++)
		{
			var label = "{LANG_DISABLED}";
			if (this.xml_bus_input_tbl[i].children("child_valid").text() == "1")
				label = this.xml_bus_input_tbl[i].children("name").text();
			$("#container_bus_input .input_dev:eq(" + i + ") .sl_selector").html(label);
			global_apply_diag("#container_bus_input", "input_dev:eq(" + i + ")", "{LANG_CONCENTRATORE_INPUT} " + (i + 1), "input_bus", i, "widget_mod_device_bus_input");
		}
		//
		item_fw_ver("#container_bus_input", this.xml_any);
		//
		item_delete("#container_bus_input", this);
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
	name: "widget_mod_device_bus_input",
	xml_any: xml_any_tbl[any_ind],
	title: xml_any_tbl[any_ind].children("name").text(),
	xml_any_arr: [],
	xml_bus_input_tbl: function()
	{
		var sons_local = [];
		for (var i = 0; i < xml_any_tbl.length; i++)
		{
			if 
			(
				xml_any_tbl[i].children("subcategory").text() == WS_DEV_ALARM_BUS_INPUT_STR
				&& Number(xml_any_tbl[i].children("ord").text()) > 0
				&& xml_any_tbl[i].children("parent_id").text() == xml_any_tbl[any_ind].children("parent_id").text()
			)
				sons_local.push(xml_any_tbl[i]);
		}
		return sons_local;
	}(),
	//
	clean_page: function()
	{
		polling_selettivo(this.xml_any.children("id").text(), this.xml_any.children("subcategory").text(), false);
	},
	par_save: function()
	{
		ena_save = true;
		//
		save_item_name("#container_bus_input", this);
		//save_room
		if (DIY) this.xml_any.find("room").text(id_room_selected);
		//integration
		//
		save_item_area("#container_bus_input", this);
		//
		this.xml_any_arr = this.xml_bus_input_tbl;
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