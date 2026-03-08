pag_table_new["nav_communication"] = {
	onload: function()
	{
		var widget_obj = this;
		//
		pag_clear(".home .JSdialog");
		//
		dynamic_page_act(this);
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		away_from_home();
		//
		cen_conf_request("WIFI");
		//
		$("#menu_wifi").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "widget_typeconn");
		});
		$("#menu_email").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "widget_mod_email");		
		});
		$("#menu_cloud").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "widget_cloud");			
		});
		$("#menu_communication_other").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "widget_parvig");		
		});
		//
		summary_highlighter(this);
		//
		slotTextClick(this.name);
	},
	onrecv_confirmation: function(conf)
	{
		//
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
	name: "nav_communication",
	title: "{LANG_NAV_HOME_COMMUNICATION}",
	bodyWrapper: "set elsewhere",
	//
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			if (widget_obj.bodyWrapper == "#settings-page")
				header_home_group(widget_obj);
			else if (widget_obj.bodyWrapper == "#seeking-page")
				header_widget_settings_utilities_group();
		});
		//
		if (widget_obj.bodyWrapper == "#settings-page")
			$("#backTitle").html("{LANG_HOME}");
		else if (widget_obj.bodyWrapper == "#seeking-page")
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