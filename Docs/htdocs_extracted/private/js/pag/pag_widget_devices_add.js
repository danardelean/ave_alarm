pag_table_new["widget_devices_add"] = {
	onload: function()
	{
		page_act("#seeking-page");
		schema_act("#seeking-page", "quadrant_abcd");
		this.header_home_switch();
		this.footer_home_switch();
		var widget_obj = this;
		//
		bus_pair_flg = false;
		//
		$("#device_add_click").off("click").click(function()
		{
			if (!($(this).hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "widget_device_wireless");
		});
		$("#cam_device_add_click").off("click").click(function()
		{
			if (!($(this).hasClass("disabled")))
			{
				if (widget_obj.send_tvcc_flg)
				{
					xml_request = xml_request_head_build("PNP");
					xml_par = $(XML("act")); xml_par.text("NEW_TVCC"); xml_request.append(xml_par);
					xml_send(xml_request);
					//
					widget_obj.send_tvcc_flg = false;
				}
			}
		});
		//
		if (WS_DEV_ALARM_BUS_STR in xmlSubTbl)
		{
			$("#auto_bus_device_add_click").off("click").click(function()
			{
				if (!($(this).hasClass("disabled")))
				{
					pag_change("#seeking-page .quadrant_abcd", "widget_devices_add_bus");
				}
			});
			$("#auto_bus_device_add").show().parent().swapClass("duo", "tres");
		}
		else
		{
			$("#auto_bus_device_add").hide().parent().swapClass("tres", "duo");
		}
		//
		slotTextClick(this.name);
	},
	onrecv_confirmation: function(conf)
	{
		//
	},
	onrecv_indication: function(indi)
	{
		if (indi.attr("type") == "PNP")
		{
			if (indi.children("act").text() == "DETECTION")
			{
				if (indi.children("res").text() == "DETECTED")
				{
					indi.find("par item").each(function()
					{
						xml_tvcc = $(this);
						//
						pag_change("#seeking-page .quadrant_abcd", "widget_mod_device_tvcc", "binding");
					});
				}
			}
		}
	},
	onclose: function()
	{
		//
	},
	//
	name: "widget_devices_add",
	title: "{LANG_WIZARD_ADD_DEVICE_TITLE}",
	send_tvcc_flg: true,
	//
	clean_page: function()
	{
		load_devices(); // prepara i dispositivi per la schermata di test
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			pag_change("#seeking-page .quadrant_abcd", "widget_add_other_devices");
		});
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