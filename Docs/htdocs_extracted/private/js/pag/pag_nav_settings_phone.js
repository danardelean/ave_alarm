pag_table_new["nav_settings_phone"] = {
	onload: function()
	{
		page_act("#seeking-page");
		schema_act("#seeking-page", "quadrant_abcd");
		this.header_home_switch();
		this.footer_home_switch();
		//
		var widget_obj = this;
		//
		if (role_str == "INST")
			$("#menu_audio").parent().removeClass("disabled");
		else
			$("#menu_audio").parent().addClass("disabled");
		$("#menu_audio").off("click").click(function() 
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "widget_audio");
		});
		this.gsm_id = xml_file_configuration.find("Devices Device").filter(function()
		{
			if ($(this).children("Subcategory").text() == WS_DEV_ALARM_GSM_STR)
				if ($(this).hasAttr("deleted"))
					if ($(this).attr("deleted") == "TRUE")
						return false;
					else return true;
				else return true;
			else return false;
		}).attr("id");
		//
		this.update_credit_button_status();
		$("#menu_cre").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
			{
				if (widget_obj.gsm_id != null)
				{
					xml_request = xml_request_head_build("DEVICE_CMD", null);
					xml_par = $(XML("Command")); xml_par.text(WS_DEV_ALARM_GSM_CREDIT); xml_request.append(xml_par);
					xml_par = $(XML("Device")); xml_par.text(widget_obj.gsm_id); xml_request.append(xml_par);
					xml_send(xml_request);
				}
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
	name: "nav_settings_phone",
	title: "{LANG_NAV_SETTINGS_COMBI}",
	gsm_id: null,
	//
	update_credit_button_status: function()
	{
		if 
		(
			this.gsm_id != null
			&& gsm_status != GSM_STATUS_NOSIM
			&& gsm_status != GSM_STATUS_NOPIN
			&& gsm_status != GSM_STATUS_NOGSM
			&& gsm_status != GSM_STATUS_INIT
			&& gsm_status != GSM_STATUS_VOID
		)
			$("#menu_cre").parent().removeClass("disabled");
		else
			$("#menu_cre").parent().addClass("disabled");
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