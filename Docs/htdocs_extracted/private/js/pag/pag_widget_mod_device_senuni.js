pag_table_new["widget_mod_device_senuni"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		//
		//name
		global_item_init("#container_senuni", "name", "input", "name", this);
		//room
		item_room("#container_senuni", this.xml_any);
		//led allarme
		item_led("#container_senuni", this.xml_any, this);
		//anti removal protection
		item_protection("#container_senuni", this.xml_any, this);
		//
		item_fw_ver("#container_senuni", this.xml_any);
		//
		item_delete("#container_senuni", this);
		//
		/*SON 1*/
		//
		global_switcher_binder("#container_senuni", "ena_son1", null, this.son1.children("phy_mode").text() == "0" ? "0" : "1");
		//
		/*SON 2*/
		//
		global_switcher_binder("#container_senuni", "ena_son2", null, this.son2.children("phy_mode").text() == "0" ? "0" : "1");
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
	name: "widget_mod_device_senuni",
	xml_any: xml_any_tbl[any_ind],
	title: xml_any_tbl[any_ind].children("name").text(),
	son1: xml_any_tbl[any_ind].children("has_children").text() == "1" ? xml_any_tbl[any_ind-1+2] : null,
	son2: xml_any_tbl[any_ind].children("has_children").text() == "1" ? xml_any_tbl[any_ind-1+3] : null,
	//
	par_save: function()
	{
		ena_save = true;
		//
		save_item_name("#container_senuni", this);
		//
		this.xml_any.find("room").text(id_room_selected);
		//
		save_item_led("#container_senuni", this.xml_any);
		//
		save_item_protection("#container_senuni", this.xml_any, this);
		//
		/*************************/
		/********** son1 *********/
		//ena dal padre	
		if ($("#container_senuni .ena_son1").attr("data-checked") != "0" && this.son1.children("phy_mode").text() == "0")
		{
			this.son1.children("pulse_n").text("6");
			this.son1.children("phy_mode").text("4");
		}
		else if ($("#container_senuni .ena_son1").attr("data-checked") == "0" && this.son1.children("phy_mode").text() != "0")
		{
			this.son1.children("phy_mode").text("0");
		}
		/*************************/
		/********** son2 *********/	
		//ena dal padre
		if ($("#container_senuni .ena_son2").attr("data-checked") != "0" && this.son2.children("phy_mode").text() == "0")
		{
			this.son2.children("pulse_n").text("6");
			this.son2.children("phy_mode").text("4");
		}
		else if ($("#container_senuni .ena_son2").attr("data-checked") == "0" && this.son2.children("phy_mode").text() != "0")
		{
			this.son2.children("phy_mode").text("0");
		}
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