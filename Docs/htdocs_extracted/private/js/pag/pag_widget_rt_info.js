pag_table_new["widget_rt_info"] = {
	onload: function()
	{
		page_act("#seeking-page");
		schema_act("#seeking-page", "quadrant_abcd");
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		var widget_obj = this;
		//
		if (QT)
			$("#rt_info_container .rt_input, #rt_info_container .rt_output").css("padding-bottom", "35px");
		//
		this.rtinfo_req();
		//
		//
		$("#web_ver").html(package_version);
		$("#tlc_ver").html(tlc_version);
		$("#som_ver").html(som_version);
		$("#car_ver").html(car_version);
		//
		xml_menu_load_send(WS_TEST_STR, null, null, "widget_rt_info", DEVICE_TEST_SEN);
		//
		xml_request = xml_request_head_build("MENU", "widget_rt_info");
		xml_par = $(XML("act")); xml_par.text("START"); xml_request.append(xml_par);		
		xml_par = $(XML("page")); xml_par.text(WS_TEST_STR); xml_request.append(xml_par);		
		xml_par = $(XML("par")); xml_par.text(""/*this.type_of_list*/); xml_request.append(xml_par);
		xml_send(xml_request);
	},
	onrecv_confirmation: function(conf)
	{
		var widget_obj = this;
		//
		var tema_path = (isTema("light_tema") ? "light/" : "");
		//
		if (conf.attr("type") == "MENU")
		{
			if (conf.children("page").text() == WS_TEST_STR)
			{
				if (conf.children("act").text() == "STOP")
				{
					//
				}
				else if (conf.children("act").text() == "START")
				{
					//
				}
				else if (conf.children("act").text() == "LOAD")
				{
					pre_gui_device_test(conf);
					//
					//
					conf.find("par2 item").each(function()
					{
						var itemId = $(this).attr("id");
						var devName = $(this).attr("name");
						//
						var guiItemDev = $.parseHTML
						(
							"<div class='global_item_dyn full ibrb batt_dev_st' data-id='" + itemId + "'>"
						+		"<div class='wrap_tag'><p class='name'>" + devName + "</p></div>"
						+			"<div class='wrap_tag'>"
						+				"<div class='battStContainer'>"
						+				"</div>"
						+			"</div>"
						+		"</div>"
						+	"</div>"
						);
						//
						var measLeft = 5;
						$(this).find("meas").each(function() 
						{
							var battValue = $(this).attr("value");
							var battLocalDtNonHuman = from_localdt_to_datacen($(this).attr("localdt"));
							var battLocalDt = week_day_month_do(battLocalDtNonHuman) + " " + ampm_time(battLocalDtNonHuman);
							//
							var guiItemBat =  $.parseHTML
							(
								"<div class='battSt" + (battValue == "1" ? " ok" : " ko") + "'></div>"
							);
							$(guiItemBat).off("click").click(function()
							{
								pag_change(".JSdialog", "widget_popwarn", "{LANG_RT_INFO_WARN}: " + (battValue == "1" ? "{LANG_OK}" : "{LANG_KO}"), battLocalDt, "ok");
							});
							//
							$(".battStContainer", guiItemDev).append(guiItemBat);
							//
							measLeft--;
						});
						while (measLeft > 0)
						{
							$(".battStContainer", guiItemDev).append("<div class='battSt un'></div>");
							//
							measLeft--;
						}
						//
						$("#rt_info_container .entire").append(guiItemDev);
					});
				}
				else
				{
					alert("ERROR: " + conf.children("act").text());
				}
			}
			else if (conf.children("page").text() == "UTILITY")
			{
				if (conf.children("act").text() == "RT_INFO_GET")
				{
					if (conf.children("res").text() == "OK")
					{
						var gsmSignal = conf.find("par gsm signal").text(); //Math.round(Math.random()*5);
						var wifiSignal = conf.find("par wifi signal").text(); //Math.round(Math.random()*5);
						var cloudState = conf.find("par cloud persistent_st").text(); //Math.round(Math.random()*3);
						//
						//
						$("#powergrid").html(conf.find("par pow st").text() == "1" ? "{LANG_PRECOG}" : "{LANG_ASSCOG}");
						$("#battery_level").html(conf.find("par bat perc").text() + "%");
						$("#gsm_level").closest(".global_item_dyn").find(".item_tag").html("{LANG_GSM_SIGNAL} (" + gsmSignal + ")");
						$("#gsm_level").attr("style", "background-image: url({TMPL_DIR}res/" + tema_path + "gsm_dot_" + gsmSignal + ".png)");
						$("#wifi").closest(".global_item_dyn").find(".item_tag").html("{LANG_WIFI_STR} (" + wifiSignal + ")");
						$("#wifi").attr("style", "background-image: url({TMPL_DIR}res/" + tema_path + "wifi_st_" + wifiSignal + ".png)");
						$("#cloud").attr("style", "background-image: url({TMPL_DIR}res/" + tema_path + "cloud_st_" + cloudState + ".png)");
						//
						//
						this.rt_init_flg = false;
					}
					var widget_obj = this;
					setTimeout(function()
					{
						widget_obj.rtinfo_req();
					}, this.rt_req_delay * 1000);
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
	name: "widget_rt_info",
	title: "{LANG_WIZARD_TEST_DEVICE_RT}",
	bodyWrapper: "set elsewhere",
	rt_req_delay: 1, 
	rt_init_flg: true,
	//
	clean_page: function()
	{
		xml_request = xml_request_head_build("MENU");
		xml_par = $(XML("act")); xml_par.text("STOP"); xml_request.append(xml_par);		
		xml_par = $(XML("page")); xml_par.text(WS_TEST_STR); xml_request.append(xml_par);		
		xml_par = $(XML("par")); xml_par.text(""/*this.type_of_list*/); xml_request.append(xml_par);
		xml_send(xml_request);
		//
		pag_clear("#seeking-page .quadrant");
	},
	rtinfo_req: function()
	{
		xml_request = xml_request_head_build("MENU", "widget_rt_info");
		xml_par = $(XML("page")); xml_par.text("UTILITY"); xml_request.append(xml_par);
		xml_par = $(XML("act")); xml_par.text("RT_INFO_GET"); xml_request.append(xml_par);				
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
			widget_obj.clean_page();
			//
			if ("widget_test_device" in pag_table_new)
				pag_table_new["widget_test_device"].onload();
			else
				pag_change("#seeking-page .quadrant_abcd", "widget_test_device");
		});
		//
		$("#backTitle").html("{LANG_WIZARD_TEST_DEVICE_TITLE}");
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