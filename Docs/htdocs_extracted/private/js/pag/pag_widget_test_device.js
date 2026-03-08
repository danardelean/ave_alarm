pag_table_new["widget_test_device"] = {
	onload: function()
	{
		dynamic_page_act(this);
		//
		pag_clear(".home .JSdialog");
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		away_from_home();
		//
		//reset filtri di lista
		filter_area = [];
		filter_room = [];
		filter_type = [];
		//
		xml_request = xml_request_head_build("MENU");
		xml_par = $(XML("act")); xml_par.text("INIT"); xml_request.append(xml_par);
		xml_par = $(XML("page")); xml_par.text(WS_TEST_STR); xml_request.append(xml_par);
		xml_par = $(XML("par")); xml_request.append(xml_par);
		xml_send(xml_request);
		//
		corrIdxAddDev();
		this.guiActivator();
		//
		//
		$("#test_field_meter").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "widget_test_field_meter");
		});
		$("#test_device").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "widget_test_device_list", DEVICE_TEST_SEN);
		});
		$("#test_combiner").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "widget_test_device_list", DEVICE_TEST_TEL);
		});
		$("#test_siren").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "widget_test_device_list", DEVICE_TEST_SIR);
		});
		$("#test_camera").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "widget_test_device_list", DEVICE_TEST_TVCC);
		});
		$("#test_relay").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "widget_test_device_list", DEVICE_TEST_RELAY);
		});
		$("#test_rt").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "widget_rt_info");
		});
		$("#test_rt2").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "widget_rt_info2");
		});
		//
		slotTextClick(this.name);
	},
	onrecv_confirmation: function(conf)
	{
		var widget_obj = this;
		//
		if (conf.attr("type") == "MENU")
		{
			if (conf.children("act").text() == "LOAD")
			{
				if (conf.children("res").text() == "LOADED")
				{
					if (conf.children("page").text() == WS_DEV_STR)
					{
						var combinatori = false;
						conf.find("par item subcategory").each(function()
						{
							if ($(this).text() == WS_DEV_ALARM_WIFI_STR)
							{
								combinatori = true;
								return false;
							}
						});
						if (combinatori)
							$("#test_combiner").parent().removeClass("disabled");
						else
							$("#test_combiner").parent().addClass("disabled");
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
	name: "widget_test_device",
	title: "{LANG_WIZARD_TEST_DEVICE_TITLE}",
	bodyWrapper: "set elsewhere",
	//
	clean_page: function()
	{
		xml_request = xml_request_head_build("MENU");
		xml_par = $(XML("act")); xml_par.text("STOP"); xml_request.append(xml_par);
		xml_par = $(XML("page")); xml_par.text(WS_TEST_STR); xml_request.append(xml_par);
		xml_par = $(XML("par")); xml_request.append(xml_par);
		xml_send(xml_request);
	},
	guiActivator: function()
	{
		var combinatori = false;
		var sirene = false;
		var fotogrammi = false;
		var rele = false;
		if 
		(
			WS_DEV_ALARM_GSM_STR in xmlSubTbl
			|| WS_DEV_ALARM_PSTN_STR in xmlSubTbl
		)
			combinatori = true;
		if 
		(
			WS_DEV_ALARM_SIR_STR in xmlSubTbl
			|| WS_DEV_ALARM_SIRI_STR in xmlSubTbl
		)
			sirene = true;
		if 
		(
			WS_DEV_ALARM_SEN_PHOTOPIR_STR in xmlSubTbl
			|| WS_DEV_ALARM_TVCC_STR in xmlSubTbl
		)
			fotogrammi = true;
		if 
		(
			WS_DEV_ALARM_RELAY_STR in xmlSubTbl
			|| WS_DEV_ALARM_BUS_RELAY_STR in xmlSubTbl
		)
			rele = true;
		//
		$("#test_field_meter").parent().removeClass("disabled");
		$("#test_device").parent().removeClass("disabled");
		//
		if (combinatori)
			$("#test_combiner").parent().removeClass("disabled");
		else
			xml_menu_load_send(WS_DEV_STR, WS_DEV_ALARM_WIFI_STR, null, "widget_test_device");
		if (sirene)
			$("#test_siren").parent().removeClass("disabled");
		else
			$("#test_siren").parent().addClass("disabled");
		if (fotogrammi)
			$("#test_camera").parent().removeClass("disabled");
		else
			$("#test_camera").parent().addClass("disabled");
		if (rele)
			$("#test_relay").parent().removeClass("disabled");
		else
			$("#test_relay").parent().addClass("disabled");
		//
		$("#test_rt").parent().removeClass("disabled");
		$("#test_rt2").parent().removeClass("disabled");
	},
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
		//
		footer_button_rotate();
		scrollList(this);
	}
};