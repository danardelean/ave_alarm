pag_table_new["widget_devices_add_bus"] = {
	onload: function()
	{
		page_act("#seeking-page");
		schema_act("#seeking-page", "quadrant_abcd");
		this.header_home_switch();
		this.footer_home_switch();
		var widget_obj = this;
		//
		device_pair_auto_mode_flg = false;
		bus_pair_flg = false;
		//
		$("#device_add_bus_auto").off("click").click(function()
		{
			if (!($(this).hasClass("disabled")))
			{
				device_pair_auto_mode_flg = true;
				pag_change("#seeking-page .quadrant_abcd", "widget_device_bus_pair");
			}
		});
		$("#device_add_bus_manual").off("click").click(function()
		{
			if (!($(this).hasClass("disabled")))
			{
				bus_pair_flg = true;
				pag_change("#seeking-page .quadrant_abcd", "widget_device_wireless", true);
			}
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
	name: "widget_devices_add_bus",
	title: "{LANG_WIZARD_ADD_DEVICE_TITLE}",
	//
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			pag_change("#seeking-page .quadrant_abcd", "widget_devices_add");
		});
		//
		$("#backTitle").html("{LANG_WIZARD_ADD_DEVICE_TITLE}");
	},
	footer_home_switch: function()
	{
		var widget_obj = this;
		footer_home_switch_init();
		//
		//
		footer_button_rotate();
		scrollList(this);
	}
};