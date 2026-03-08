pag_table_new["nav_settings_access"] = {
	onload: function()
	{
		var widget_obj = this;
		//
		pag_clear(".home .JSdialog");
		page_act("#settings-page");
		schema_act("#settings-page", "quadrant_abcd");
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		away_from_home();
		//
		$("#access_powuser").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#settings-page .quadrant_abcd", "widget_settings_utilities");
		});
		$("#access_inst").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change(".home .JSdialog", "widget_login_small", "settings inst");
		});
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
	name: "nav_settings_access",
	title: "{LANG_MENU_SET}",
	//
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			header_home_group(widget_obj);
		});
		//
		$("#backTitle").html("{LANG_HOME}");
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