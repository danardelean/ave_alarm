pag_table_new["widget_devices_areas"] = {
	onload: function()
	{
		page_act("#seeking-page");
		schema_act("#seeking-page", "quadrant_abcd");
		this.header_home_switch();
		this.footer_home_switch();
		//
		//
		if (cen_set_xml.find("ave_iot_ena").text() == "1") 
			$("#device_area_container")
				.addClass("tres")
				.removeClass("duo")
				.children("#iot_slot")
				.show()
				.find("#iot_btn")
				.click(function()
				{
					if (!($(this).parent().hasClass("disabled")))
						pag_change("#seeking-page .quadrant_abcd", "widget_iot");
				});
		//
		$("#devices_btn").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "widget_add_other_devices");
		});
		$("#areas_btn").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "widget_identifying_areas");
		});
		//
		slotTextClick(this.name);
		//
		this.send_xml_users_load();
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "MENU")
		{
			if (conf.children("act").text() == "LOAD")
			{
				if (conf.children("res").text() == "LOADED")
				{
					if (conf.children("page").text() == WS_USER_STR)
					{
						conf.find("par2 item").each(function(index)
						{
							tslotNames[index] = $(this).children("name").text();
						});
					}
				}
			}
		}
	},
	onrecv_indication: function(indi)
	{
		//
	},
	onclose: function()
	{
		//
	},
	//
	name: "widget_devices_areas",
	title: "{LANG_AREA_DEVICE_SETUP}",
	//
	send_xml_users_load: function()
	{
		xml_menu_load_send(WS_USER_STR, "POWERUSER", null, "widget_devices_areas");
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			header_widget_settings_utilities_group();
		});
		//
		$("#backTitle").html("{LANG_MENU_SET}");
	},
	footer_home_switch: function()
	{
		var widget_obj = this;
		footer_home_switch_init();
		//
		footer_button_rotate();
		scrollList(this);
	}
};