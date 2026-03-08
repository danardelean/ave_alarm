pag_table_new["nav_lang_naz"] = {
	onload: function()
	{
		page_act("#seeking-page");
		schema_act("#seeking-page", "quadrant_abcd");
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		$("#menu_lingua").off("click").click(function() 
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "widget_lang");
		});
		$("#menu_nazione").off("click").click(function() 
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "widget_region"); 
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
	name: "nav_lang_naz",
	title: "{LANG_NAV_SETTINGS_GENERIC_LANG_NAZ}",
	//
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			header_nav_settings_generic_group(widget_obj);
		});
		//
		$("#backTitle").html("{LANG_NAV_SETTINGS_GENERIC}");
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