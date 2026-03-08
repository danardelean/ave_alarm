pag_table_new["widget_identifying_areas"] = {
	onload: function()
	{
		page_act("#seeking-page");
		schema_act("#seeking-page", "quadrant_abcd");
		this.header_home_switch();
		this.footer_home_switch();
		var widget_obj = this;
		//
		//save_step(WS_WIZARD_STEP_AREA);
		//
		if (areaExtendFlg)
			$("#div_area_container .div_area_item").removeClass("unavailable");
		//
		//inizializza tutti a 1
		global_switcher_binder("#div_area_container .div_area_item:not(.unavailable)", "ena", null, "1", null, null);
		//
		//modalità html:non fa funzionare la tastiera su qt _FT_
		//modalità .val(): funziona tastiera su qt ma non accetta caratteri speciali
		$("#div_area_container .div_area_item:not(.unavailable)").each(function(index)
		{
			var tramaElem = widget_obj.local_area_list.find("item name:contains('" + $(this).attr("data-id") + "')");
			$("input", this).val(tramaElem.siblings("desc").text());
			$(".switcher", this).trigger("switch_state_changer", [[(tramaElem.siblings("ena").text() == "TRUE" ? "on" : "off")]]);
		});
		//fine modalità .val()
		//
		summary_highlighter(this);
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "MENU")
		{
			if (conf.children("act").text() == "SAVE")
			{
				if (conf.children("res").text() == "SAVED")
				{
					if (conf.find("page").text() == WS_AREA_STR)
					{
						area_list = this.local_area_list;
						//crea la lista di aree disattivate
						area_list_ena_false = [];
						area_list.find("item").each(function()
						{
							if ($(this).find("ena").text() == "FALSE")
								area_list_ena_false.push($(this).find("id").text());	
						});
						//
						$("#footer_h2_a_a").trigger("areas_name_saved");
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
	name: "widget_identifying_areas",
	title: "{LANG_WIZARD_IDENTIFYING_AREAS_TITLE}",
	local_area_list: area_list.clone(),
	//
	save_area: function()
	{
		var widget_obj = this;
		ena_save = true;
		//
		//
		$("#div_area_container .div_area_item:not(.unavailable)").each(function()
		{
			var trama_elem = widget_obj.local_area_list.find("item name:contains('" + $(this).attr("data-id") + "')");
			$("input", this).global_save_item_val({trama_ptr: trama_elem.siblings("desc")});
			trama_elem.siblings("ena").text($(".switcher", this).attr("data-checked") == "1" ? "TRUE" : "FALSE");
		});
		this.areas_save_send();
	},
	areas_save_send: function()
	{
		xml_request = xml_request_head_build("MENU", this.name);
		xml_par = $(XML("act")); xml_par.text("SAVE"); xml_request.append(xml_par);		
		xml_par = $(XML("page")); xml_par.text(WS_AREA_STR); xml_request.append(xml_par);		
		xml_request.append(this.local_area_list);
		if (ena_save) xml_send(xml_request);
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			pag_change("#seeking-page .quadrant_abcd", "widget_devices_areas");
			file_conf_request();
		});
		//
		$("#backTitle").html("{LANG_AREA_DEVICE_SETUP}");
	},
	footer_home_switch: function()
	{
		var widget_obj = this;
		footer_home_switch_init();
		//
		draw_footer_button("{LANG_OK}", "footer_h2_a_a");
		//
		$("#footer_h2_a_a").off("click").click(function()
		{
			widget_obj.save_area();
		});
		$("#footer_h2_a_a").off("areas_name_saved").on("areas_name_saved", function()
		{
			if (wizard_flg)
				poptoast("{LANG_ITEM_SAVED}");
			else
				$("#header-home-page2 .close").trigger("click");
		});
		//
		footer_button_rotate();
		scrollList(this);
	}
};