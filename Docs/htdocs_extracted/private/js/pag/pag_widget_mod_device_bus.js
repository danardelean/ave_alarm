pag_table_new["widget_mod_device_bus"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		//
		//name
		global_item_init("#container_bus", "name", "input", "name", this);
		//room
		item_room("#container_bus", this.xml_any);
		//
		global_switcher_binder("#container_bus", "ombil", this.xml_any, null, null, null);
		//
		this.bindProgKeypad();
		//
		item_fw_ver("#container_bus", this.xml_any);
		//
		item_delete("#container_bus", this);
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
		xml_any = null;
		$("#wizard_header_info").text("");
	},
	//
	name: "widget_mod_device_bus",
	xml_any: xml_any_tbl[any_ind],
	title: xml_any_tbl[any_ind].children("name").text(),
	//
	clean_page: function()
	{
		polling_selettivo(this.xml_any.children("id").text(), this.xml_any.children("subcategory").text(), false);
	},
	par_save: function()
	{
		ena_save = true;
		//
		save_item_name("#container_bus", this);
		//
		save_item_toggled("#container_bus", "ombil", null, this.xml_any);
	},
	bindProgKeypad: function()
	{
		$("#start_keypad_bind").off("click").click(function()
		{
			pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_RUSURE}", "okab", "#start_keypad_bind");
		}).off("on_pw_ok").on("on_pw_ok", function()
		{
			xml_request = xml_request_head_build("MENU", null);
			xml_node = $(XML("act")); xml_node.text("PAIRING_KEYPAD"); xml_request.append(xml_node);
			xml_node = $(XML("page")); xml_node.text(WS_DEV_STR); xml_request.append(xml_node);
			xml_node = $(XML("par")); xml_request.append(xml_node);
			xml_send(xml_request);
		});
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
		//
		draw_footer_button("{LANG_OK}", "footer_h2_a_a");
		draw_footer_button("{LANG_WIZARD_MOD_DEVICE_DEL}", "footer_h2_a_b"); //gestito nella item_delete()
		draw_footer_button("{LANG_TERMIS_BINDING_KEYPAD}", "footer_h2_a_c_bus");
		//
		//
		$("#footer_h2_a_a").click(function()
		{
			global_send_dev_mod_save(widget_obj);
		});
		//
		$("#footer_h2_a_c_bus").off("click").click(function()
		{
			pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_RUSURE}", "okab", "#footer_h2_a_c_bus");
		}).off("on_pw_ok").on("on_pw_ok", function()
		{
			xml_request = xml_request_head_build("MENU", null);
			xml_node = $(XML("act")); xml_node.text("PAIRING_KEYPAD"); xml_request.append(xml_node);
			xml_node = $(XML("page")); xml_node.text(WS_DEV_STR); xml_request.append(xml_node);
			xml_node = $(XML("par")); xml_request.append(xml_node);
			xml_send(xml_request);
		});
		//
		//
		footer_button_rotate();
		scrollList(this);
	}
};