pag_table_new["nav_ceninfo"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		//
		var widget_obj = this;
		//
		//
		$("#upd_version").text(package_version);
		$("#web_version").text(web_version);
		$("#tlc_version").text(tlc_version);
		$("#som_version").text(som_version);
		$("#car_version").text(car_version);
		$("#ker_version").text(ker_version);
		$("#datesom").text(datesom);
		$("#cen_sn").text(this.xml_set.children("cen_sn").text());
		if (wbr_version == null)
			$("#wbr_version").parent().empty();
		else
			$("#wbr_version").text(wbr_version);
		//
		xml_request = xml_request_head_build("INFO", "nav_ceninfo");
		xml_par = $(XML("Authentication")); xml_par.attr("username", "host"); xml_par.attr("password", "00000"); xml_request.append(xml_par);
		xml_send(xml_request);
		//
		this.ceninfo_req();
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "INFO")
		{
			$("#cat_version").text(conf.children("Catalog").text());
		}
		else if (conf.attr("type") == "MENU")
		{
			if (conf.children("act").text() == "STAT_INFO_GET")
			{
				if (conf.children("res").text() == "OK")
				{
					var xml_par_info = conf.children("par");
					$("#mmc_size").text(xml_par_info.children("mmc_size").text());
					$("#mmc_free").text(xml_par_info.children("mmc_free").text());
					$("#ram_size").text(xml_par_info.children("ram_size").text());
					$("#ram_free").text(xml_par_info.children("ram_free").text());
					$("#up_time").text(xml_par_info.children("up_time").text());
				}
				var widget_obj = this;
				setTimeout(function()
				{
					widget_obj.ceninfo_req();
				}, 1 * 1000);
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
	name: "nav_ceninfo",
	title: "{LANG_NAV_SETTINGS_GENERIC_PLANT_INFO}",
	xml_set: cen_set_xml.clone(),
	//
	ceninfo_req: function()
	{
		xml_request = xml_request_head_build("MENU", "nav_ceninfo");
		xml_par = $(XML("page")); xml_par.text("UTILITY"); xml_request.append(xml_par);
		xml_par = $(XML("act")); xml_par.text("STAT_INFO_GET"); xml_request.append(xml_par);				
		xml_par = $(XML("par")); xml_request.append(xml_par);
		xml_send(xml_request);
	},
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
		//
		//
		footer_button_rotate();
		scrollList(this);
	}
};