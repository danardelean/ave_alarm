pag_table_new["widget_audio"] = {
	onload: function()
	{
		page_act("#seeking-page");
		schema_act("#seeking-page", "quadrant_abcd");
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		saveModFlg = true;
		//save_step(WS_WIZARD_STEP_AUDIO);
		//
		//
		this.scrollTop_associative_array["areas"] = 0;
		this.scrollTop_associative_array["system"] = 0;
		this.scrollTop_associative_array["events"] = 0;
		this.scrollTop_associative_array["devices"] = 0;
		//
		xml_menu_load_send
		(
			WS_AUDIO_STR
			, WS_DEV_ALARM_WIFI_STR
			+ "|" + WS_DEV_ALARM_TERM_STR
			+ "|" + WS_DEV_ALARM_CEN_STR
			+ "|" + WS_DEV_ALARM_LCD_STR
			+ "|" + WS_DEV_ALARM_POW_STR
			+ "|" + WS_DEV_ALARM_RTC_STR
			+ "|" + WS_DEV_ALARM_BAT_STR
			+ "|" + WS_DEV_ALARM_CARRIER_STR
			+ "|" + WS_DEV_ALARM_GSM_STR
			+ "|" + WS_DEV_ALARM_PSTN_STR
			+ "|" + WS_DEV_ALARM_CLOUD_STR
			+ "|" + WS_DEV_ALARM_TELEGEST_STR
			+ "|" + WS_DEV_ALARM_DASH_STR
			+ "|" + WS_DEV_ALARM_AVE_AUTOMATION_STR
			+ "|" + WS_DEV_ALARM_IOT_STR
			+ "|" + WS_DEV_ALARM_THERMOSTAT_STR
			, "filter_not", "widget_audio");
		//
		summary_highlighter(this);
		//
		slotTextClick(this.name);
	},
	onrecv_confirmation: function(conf)
	{
		var tema_path = (isTema("light_tema") ? "light/" : "");
		//
		if (conf.attr("type") == "MENU")
		{
			if (conf.children("act").text() == "LOAD")
			{
				if (conf.children("res").text() == "LOADED")
				{
					if (conf.children("page").text() == WS_AUDIO_STR)
					{
						var widget_obj = this;
						audios = [];
						conf.find("par item").each(function()
						{
							audios.push($(this));
						});
						//
						$(".audio_container .item").off("click").click(function()
						{
							widget_obj.init();
							widget_obj.audio_type_str = $(this).attr("data-type");
							if (widget_obj.audio_type_str == "areas")
								$("#audio_title").html("{LANG_WIZARD_AUDIO_AREAS}");
							else if (widget_obj.audio_type_str == "system")
								$("#audio_title").html("{LANG_WIZARD_AUDIO_SYSTEM}");
							else if (widget_obj.audio_type_str == "events")
								$("#audio_title").html("{LANG_WIZARD_AUDIO_EVENT}");
							else if (widget_obj.audio_type_str == "devices")
								$("#audio_title").html("{LANG_WIZARD_AUDIO_DEVICES}");
							for (var i = 0; i < audios.length; i++)
							{
								if (audios[i].attr("type") == widget_obj.audio_type_str)
								{
									$("#audio_container_list").append
									(
										"<div class='global_item item" + ((audios[i].children("present").text() === "0") ? " disabled'" : "'")
										+ " data-id-list='" + i + "' data-id='" + audios[i].children("id").text() + "'" 
										+ " data-present='" + audios[i].children("present").text() + "'"
										+ " data-sec='" + audios[i].children("sec").text() + "'>"
										+ "<p class='side'>" + audios[i].children("name").text() + "</p>"
										+ "<div class='sound' style='background:url({TMPL_DIR}res/" + tema_path + "sound.png) no-repeat center center;'></div>"
										+ "<div class='trash' style='background:url({TMPL_DIR}res/" + tema_path + "del.png) no-repeat center center;'></div>"
										+ "</div>"
									);									
								}
							}
							footer_button_rotate();
							scrollList(widget_obj);
							widget_obj.common();
						});
					}
				}
			}
			else if (conf.children("act").text() == "PLAY")
			{
				if (conf.children("res").text() == "1")
				{
					if (conf.children("page").text() == WS_AUDIO_STR)
					{
						//
					}
				}
				else if (conf.children("res").text() == "0")
				{
					if (conf.children("page").text() == WS_AUDIO_STR)
					{
						//
					}
				}
			}
			else if (conf.children("act").text() == "STOP")
			{
				if (conf.children("res").text() == "1")
				{
					if (conf.children("page").text() == WS_AUDIO_STR)
					{
						//this.audio_st_get(conf.children("par").text());
					}
				}
				else if (conf.children("res").text() == "0")
				{
					if (conf.children("page").text() == WS_AUDIO_STR)
					{
						$(".widget_audio .audio_item[data-id='"+conf.children("par").text()+"']")
							.find(".stop")
							.css("color", "white");
					}
				}
			}
			else if (conf.children("act").text() == "DELETE")
			{
				if (conf.children("res").text() == "DELETED")
				{
					if (conf.children("page").text() == WS_AUDIO_STR)
					{
						$("#audio_container_list .item[data-id-list='" + audio_index + "']")
							.attr("data-present", "0")
							.attr("data-sec", "0")
							.addClass("disabled");
						audios[audio_index].children("present").text("0");
						audios[audio_index].children("sec").text("0");
					}
				}
				else if (conf.children("res").text() == "0")
				{
					if (conf.children("page").text() == WS_AUDIO_STR)
					{
						//
					}
				}
			}
			else if (conf.children("act").text() == "REC")
			{
				if (conf.children("res").text() == "1")
				{
					if (conf.children("page").text() == WS_AUDIO_STR)
					{
						//
					}
				}
				else if (conf.children("res").text() == "0")
				{
					if (conf.children("page").text() == WS_AUDIO_STR)
					{
						//
					}
				}
			}
			else if (conf.children("act").text() == "ST_GET")
			{
				//
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
	name: "widget_audio",
	title: "{LANG_NAV_SETTINGS_COMBI_VOX}",
	audio_type_str: null,
	scrollTop_associative_array: [],
	//
	init: function()
	{
		var widget_obj = this;
		//
		$(".widget_audio .audio_container").hide();
		$("#audio_container_list").show();
		//
		allowed_flg = false;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			$("#audio_container_list").children(":not(:first-child)").remove();
			$("#audio_container_list").hide();
			$(".widget_audio .audio_container").show();
			//
			widget_obj.header_home_switch();
			widget_obj.footer_home_switch();
		});
	},
	common: function()
	{
		var widget_obj = this;
		//
		$("#audio_container_list .sound").off("click").click(widget_obj.play);
		$("#audio_container_list .trash").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_WDELAUDIO}", "okab", "#audio_container_list .item[data-id-list='"+$(this).parent().attr("data-id-list")+"']");
		})
		.parent().off("on_pw_ok").on("on_pw_ok", function()
		{
			widget_obj.delete_($(this));
		});
		$("#audio_container_list .item p").off("click").click(function()
		{
			audio_index = $(this).parent().attr("data-id-list");
			pag_change(".JSdialog", "widget_audio_edit", $(this).parent().attr("data-id"), $(this).text(), $(this).parent().attr("data-present"), $(this).parent().attr("data-sec"));
		});
	},
	play: function()
	{
		if (!($(this).parent().hasClass("disabled")))
		{
			var index_i = $(this).parent().attr("data-id-list");
			var audio_item = audios[index_i].clone();
			audio_item.attr("id", "1");
			//
			xml_request = xml_request_head_build("MENU", "widget_audio");
			xml_par = $(XML("page")); xml_par.text("AUDIO"); xml_request.append(xml_par);
			xml_par = $(XML("act")); xml_par.text("PLAY"); xml_request.append(xml_par);
			xml_par = $(XML("par")); xml_par.append(audio_item); xml_request.append(xml_par);
			xml_send(xml_request);
		}
	},
	delete_: function(questo)
	{
		audio_index = questo.attr("data-id-list");
		var audio_item = audios[audio_index].clone();
		audio_item.attr("id", "1");
		//
		xml_request = xml_request_head_build("MENU", "widget_audio");
		xml_par = $(XML("page")); xml_par.text("AUDIO"); xml_request.append(xml_par);
		xml_par = $(XML("act")); xml_par.text("DELETE"); xml_request.append(xml_par);
		xml_par = $(XML("par")); xml_par.append(audio_item); xml_request.append(xml_par);
		xml_send(xml_request);
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			pag_change("#seeking-page .quadrant_abcd", "nav_settings_phone");
		});
		//
		$("#backTitle").html("{LANG_NAV_SETTINGS_COMBI}");
	},
	footer_home_switch: function()
	{
		var widget_obj = this;
		footer_home_switch_init();
		//
		//
		scrollList(this);
	}
};