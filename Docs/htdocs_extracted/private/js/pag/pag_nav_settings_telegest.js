pag_table_new["nav_settings_telegest"] = {
	onload: function()
	{
		page_act("#seeking-page");
		schema_act("#seeking-page", "quadrant_abcd");
		this.header_home_switch();
		this.footer_home_switch();
		//
		var widget_obj = this;
		//
//		if (role_str == "INST")
//			$("#menu_audio").parent().removeClass("disabled");
//		else
//			$("#menu_audio").parent().addClass("disabled");
		$("#menu_gestione").off("click").click(function() 
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change(".JSdialog", "widget_popwarn", "{LANG_CLOUD_PLANT_CODE_TEMP}", "{LANG_CLOUD_PLANT_CODE_TEMP}", "input_telegest", "#" + $(this)[0].id, "");
		}).off("on_pw_ok").on("on_pw_ok", function()
		{
			$("#popwarn_input.pw_input").removeClass("fault");
			//
			xml_request = xml_request_head_build("MENU", widget_obj.name);
			xml_par = $(XML("page")); xml_par.text("UTILITY"); xml_request.append(xml_par);
			xml_par = $(XML("act")); xml_par.text("TELEGEST_START"); xml_request.append(xml_par);				
			xml_par = $(XML("par")); xml_par.text($("#popwarn_input").val()); xml_request.append(xml_par);
			xml_send(xml_request);
		}).off("on_pw_ab").on("on_pw_ab", function()
		{	
			xml_request = xml_request_head_build("MENU", widget_obj.name);
			xml_par = $(XML("page")); xml_par.text("UTILITY"); xml_request.append(xml_par);
			xml_par = $(XML("act")); xml_par.text("TELEGEST_STOP"); xml_request.append(xml_par);				
			xml_par = $(XML("par")); xml_request.append(xml_par);
			xml_send(xml_request);
		});
		//
		$("#menu_condivisione").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
			{
				pag_change("#seeking-page .quadrant_abcd", "widget_telegest");
			}
		});
		//
		slotTextClick(this.name);
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "MENU")
		{
			if (conf.children("page").text() == "UTILITY")
			{
				if (conf.children("act").text() == "TELEGEST_START")
				{
					if (conf.children("res").text() == "OK")
					{
						$("#header-home-page2 .home").trigger("click");
					}
					else if (conf.children("res").text() == "KO")
					{
						$("#popwarn_input.pw_input").addClass("fault");
					}
				}
				else if (conf.children("act").text() == "TELEGEST_STOP")
				{
					if (conf.children("res").text() == "OK")
					{
						$("#header-home-page2 .close").trigger("click");
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
	name: "nav_settings_telegest",
	title: "{LANG_NAV_SETTINGS_TELEGEST}",
	gsm_id: null,
	//
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			header_widget_settings_utilities_group();
			pag_clear(".home .JSdialog, .home .JSdialog2");
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