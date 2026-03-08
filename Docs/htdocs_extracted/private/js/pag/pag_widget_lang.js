pag_table_new["widget_lang"] = {
	onload: function()
	{
		page_act("#seeking-page");
		schema_act("#seeking-page", "quadrant_abcd");
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		//save_step(WS_WIZARD_STEP_LANG);
		var widget_obj = this;
		//
		var tema_light_flg = isTema("light_tema");
		//
		if (lang_change_flg)
			poptoast("{LANG_ITEM_SAVED}");
		lang_change_flg = false;
		//
		$("#lang_container *:not(.scrollableSize)").remove();
		xml_file_configuration.find("Languages Language").each(function(index)
		{
			$("#lang_container").append("<div class='lang_button' name='" + $(this).attr("id") + "'>" + $(this).attr("desc") + "</div>");
		});
		//
		scrollListArrowCheck(this);
		//
		$(".lang_button").off("click").click(function()
		{
			$(".lang_button")
				.attr("data-checked", "0")
				.css("color", tema_light_flg ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)");
			$(this)
				.attr("data-checked", "1")
				.css("color", tema_light_flg ? "rgba(0,0,0,1)" : "rgba(255,255,255,1)");
			//
			if ($(".widget_lang .lang_button").length < 5)
				$(".widget_lang .lang_button:last-child").css("border-bottom-width", "1px");
			//
			$("#header-home-page2 .close, #footer_h2_a_a").addClass("disabled");
			//
			widget_obj.widget_lang_selection_rollback = widget_lang_selection;
			widget_lang_selection = $(this).attr("name");
			xml_request = xml_request_head_build("MENU", "widget_lang");
			xml_par = $(XML("act")); xml_par.text("SAVE"); xml_request.append(xml_par);		
			xml_par = $(XML("page")); xml_par.text("SET"); xml_request.append(xml_par);		
			xml_par = $(XML("par")); xml_request.append(xml_par);		
			xml_item = $(XML("lang")); xml_item.text(widget_lang_selection); xml_par.append(xml_item);		
			xml_send(xml_request);
		});
		//
		var item_index = $(".lang_button[name='"+widget_lang_selection+"']")
			.attr("data-checked", "1")
			.attr("style", "background:url({TMPL_DIR}res/dot_light_green.png) no-repeat 65% center")
			.css("color", tema_light_flg ? "rgba(0,0,0,1)" : "rgba(255,255,255,1)")
			.index();
		//
		summary_highlighter(this);
	},
	onrecv_confirmation: function(conf)
	{
		var tema_light_flg = isTema("light_tema");
		//
		if (conf.attr("type") == "MENU")
		{
			if (conf.children("act").text() == "SAVE")
			{
				if (conf.children("page").text() == WS_SET_STR)
				{
					if (conf.children("res").text() == "SAVED")
					{
						$(".lang_button").removeAttr("style");
						$(".lang_button[name='"+widget_lang_selection+"']")
							.attr("style", "background:url({TMPL_DIR}res/dot_light_green.png) no-repeat 65% center")
							.css("color", tema_light_flg ? "rgba(0,0,0,1)" : "rgba(255,255,255,1)");
						lang_change_flg = true;
						xml_menu_load_send(WS_AREA_STR, null, null, "widget_lang");
					}
					else
					{
						widget_lang_selection = this.widget_lang_selection_rollback;
						$(".lang_button").removeAttr("style");
						$(".lang_button")
							.attr("data-checked", "0")
							.css("color", tema_light_flg ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)");
						$(".lang_button[name='"+widget_lang_selection+"']")
							.attr("data-checked", "1")
							.attr("style", "background:url({TMPL_DIR}res/dot_light_green.png) no-repeat 65% center")
							.css("color", tema_light_flg ? "rgba(0,0,0,1)" : "rgba(255,255,255,1)");
					}
				}
			}
			else if (conf.children("act").text() == "LOAD")
			{
				if (conf.children("res").text() == "LOADED")
				{
					if (conf.children("page").text() == WS_AREA_STR)
					{
						area_list = conf.find("par");
						//xml_menu_load_send(WS_ROOM_STR, null, null, "widget_lang");
						xml_menu_load_send(WS_SET_STR, null, null, "widget_lang");
					}
					else if (conf.children("page").text() == WS_ROOM_STR)
					{
						room_list = conf.find("par");
						//
						xml_menu_load_send(WS_SET_STR, null, null, "widget_lang");
					}
					else if (conf.children("page").text() == WS_SET_STR)
					{
						cen_set_xml = conf.find("par");
						//
						file_conf_request();
						switch_language(widget_lang_selection);
						//
						$("#header-home-page2 .close, #footer_h2_a_a").removeClass("disabled");
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
		xml_send(xml_request_head_build("STATUS"));
	},
	//
	name: "widget_lang",
	title: "{LANG_WIZARD_LANG_TITLE}",
	widget_lang_selection_rollback: null,
	//
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			if (!($(this).hasClass("disabled")))
			{
				header_nav_lang_naz_group();
			}
		});
		//
		$("#backTitle").html("{LANG_NAV_SETTINGS_GENERIC_LANG_NAZ}");
	},
	footer_home_switch: function()
	{
		var widget_obj = this;
		footer_home_switch_init();
		//
		//
		draw_footer_button("{LANG_OK}", "footer_h2_a_a");
		//
		$("#footer_h2_a_a").click(function()
		{
			if (!($(this).hasClass("disabled")))
			{
				$("#header-home-page2 .close").trigger("click");
			}
		});
		//
		//
		footer_button_rotate();
		scrollList(this);
	}
};