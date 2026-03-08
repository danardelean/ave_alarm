pag_table_new["widget_audio_edit"] = {
	onload: function()
	{
		$(".JSdialog").show();
		$(".home .JSdialog").addClass("full_scr");
		var widget_obj = this;
		debounce_audio = true;
		var text_color = isTema("light_tema") ? "black" : "white";
		//
		//
		$("#audio_edit_title").text($("#widget_audio_edit").attr("data-title"));
		//
		$("#audio_edit_ok").click(function()
		{
			if (widget_obj.status_audio === "R")
			{
				widget_obj.ok_pressed = true;
				widget_obj.stop();
			}
			else if (widget_obj.status_audio === "P")
			{
				widget_obj.ok_pressed = true;
				widget_obj.stop();
			}
			else if (widget_obj.status_audio === "S")
			{
				if (widget_obj.update_audio)
					xml_menu_load_send
					(
						WS_AUDIO_STR,
						WS_DEV_ALARM_WIFI_STR
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
						, "filter_not", "widget_audio_edit");
				else
					pag_clear(".JSdialog");
			}
			else if (widget_obj.status_audio === "E")
			{
				pag_clear(".JSdialog");
			}
		});
		//
		if ($(".widget_audio_edit").attr("data-present") == "0")
		{
			$(".stop, .play")
				.attr("data-checked", "0")
				.css("opacity", "0.3");
		}
		else if ($(".widget_audio_edit").attr("data-present") == "1")
		{
			$(".stop")
				.attr("data-checked", "0")
				.css("opacity", "0.3");
			$(".sec")
				.css("color", text_color)
				.text(this.format_sec($(".widget_audio_edit").attr("data-sec")));
		}
		//
		$(".rec").click(this.rec);
		$(".play").click(this.play_edit);
		$(".stop").click(this.stop);
	},
	onrecv_confirmation: function(conf)
	{
		var text_color = isTema("light_tema") ? "black" : "white";
		//
		if (conf.attr("type") == "MENU")
		{
			if (conf.children("act").text() == "LOAD")
			{
				if (conf.children("res").text() == "LOADED")
				{
					if (conf.children("page").text() == WS_AUDIO_STR)
					{//aggiorna widget_audio
						audios[audio_index] = conf.find("par item").eq(audio_index);
						//
						if (audios[audio_index].children("present").text() == "1")
						{
							$("#audio_container_list .item[data-id-list='" + audio_index + "']")
								.attr("data-present", audios[audio_index].children("present").text())
								.attr("data-sec", audios[audio_index].children("sec").text())
								.removeClass("disabled");
						}
						//
						pag_clear(".JSdialog");
					}
				}
			}
			else if (conf.children("act").text() == "PLAY")
			{
				if (conf.children("res").text() == "1")
				{
					if (conf.children("page").text() == WS_AUDIO_STR)
					{
						this.status_audio = "P";
						//
						$(".sec")
							.attr("style", "")
							.css("color", text_color);
						$(".stop")
							.css("opacity", "1")
							.attr("data-checked", "1");
						$(".rec, .play")
							.css("opacity", "0.3")
							.attr("data-checked", "0");
						//
						this.audio_st_get();
					}
				}
				else if (conf.children("res").text() == "0")
				{
					$("#audio_error").text("ERROR: PLAY").show();
					this.status_audio = "E";
				}
			}
			else if (conf.children("act").text() == "STOP")
			{
				if (conf.children("res").text() == "1")
				{
					if (conf.children("page").text() == WS_AUDIO_STR)
					{
						if (this.ok_pressed)
						{
							this.ok_pressed = false;
							if (this.update_audio)
								xml_menu_load_send
								(
									WS_AUDIO_STR,
									WS_DEV_ALARM_WIFI_STR
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
									, "filter_not", "widget_audio_edit");
							else
								pag_clear(".JSdialog");
						}
						this.status_audio = "S";
						//
						$(".sec")
							.attr("style", "")
							.css("color", text_color);
						$(".stop")
							.css("opacity", "0.3")
							.attr("data-checked", "0");
						$(".rec, .play")
							.css("opacity", "1")
							.attr("data-checked", "1");
					}
				}
				else if (conf.children("res").text() == "0")
				{
					$("#audio_error").text("ERROR: STOP").show();
					this.status_audio = "E";
				}
			}
			else if (conf.children("act").text() == "REC")
			{
				if (conf.children("res").text() == "1")
				{
					if (conf.children("page").text() == WS_AUDIO_STR)
					{
						this.update_audio = true;
						this.status_audio = "R";
						//
						$(".sec")
							.attr("style", "background:url({TMPL_DIR}res/red_dot.png) no-repeat 42% 1%;")
							.css("color", text_color);
						$(".stop")
							.css("opacity", "1")
							.attr("data-checked", "1");
						$(".rec, .play")
							.css("opacity", "0.3")
							.attr("data-checked", "0");
						//
						this.audio_st_get();
					}
				}
				else if (conf.children("res").text() == "0")
				{
					if (conf.children("page").text() == WS_AUDIO_STR)
					{
						$("#audio_error").text("ERROR: REC").show();
						this.status_audio = "E";
					}
				}
			}
			else if (conf.children("act").text() == "ST_GET")
			{
				if (conf.children("res").text() == "1") 
				{
					if (conf.children("page").text() == WS_AUDIO_STR)
					{
						var widget_obj = this;
						//
						if (conf.find("par item st").text() == "2") //play
						{
							this.status_audio = "P";
							//
							$(".sec")
								.text(this.format_sec(conf.find("par item sec").text()));
							$(".stop")
								.css("opacity", "1")
								.attr("data-checked", "1");
							$(".rec, .play")
								.css("opacity", "0.3")
								.attr("data-checked", "0");
							//
							setTimeout(function()
							{
								widget_obj.audio_st_get();
							}, 1000);
						}
						else if (conf.find("par item st").text() == "1") //stop
						{
							if (this.ok_pressed)
							{
								this.ok_pressed = false;
								if (this.update_audio)
									xml_menu_load_send
									(
										WS_AUDIO_STR,
										WS_DEV_ALARM_WIFI_STR
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
										, "filter_not", "widget_audio_edit");
								else
									pag_clear(".JSdialog");
							}
							this.status_audio = "S";
							//
							$(".sec")
								.attr("style", "")
								.css("color", text_color)
								.text(this.format_sec(conf.find("par item sec").text()));
							$(".stop")
								.css("opacity", "0.3")
								.attr("data-checked", "0");
							$(".rec, .play")
								.css("opacity", "1")
								.attr("data-checked", "1");
						}
						else if (conf.find("par item st").text() == "3") //rec
						{
							this.status_audio = "R";
							//
							$(".sec")
								.text(this.format_sec(conf.find("par item sec").text()));
							$(".stop")
								.css("opacity", "1")
								.attr("data-checked", "1");
							$(".rec, .play")
								.css("opacity", "0.3")
								.attr("data-checked", "0");
							//
							setTimeout(function()
							{
								widget_obj.audio_st_get();
							}, 1000);
						}
						else if (conf.find("par item st").text() == "0") //unknown
						{
							$("#audio_error").text("ERROR: STATUS").show();
							this.status_audio = "E";
						}
					}
				}
			}
			debounce_audio = true;
		}
	},
	onrecv_indication: function(indi)
	{
		//
	},
	onclose: function()
	{
		$(".home .JSdialog").removeClass("full_scr");
		$(".JSdialog").hide();
	},
	//
	name: "widget_audio_edit",
	update_audio: false,
	status_audio: "S",
	ok_pressed: false,
	//
	format_sec: function(sec) 
	{
		var min = ""+Math.floor(sec/60);
		var sec = ""+sec%60;
		if (min.length < 2) min = "0"+min;
		if (sec.length < 2) sec = "0"+sec;
		var t = min+":"+sec;
		return t;
	},
	stop: function()
	{
		if ($(".stop").attr("data-checked") == "1" && debounce_audio)
		{
			debounce_audio = false;
			var audio_item = audios[audio_index].clone();
			audio_item.attr("id", "1");
			//
			xml_request = xml_request_head_build("MENU", "widget_audio_edit");
			xml_par = $(XML("page")); xml_par.text("AUDIO"); xml_request.append(xml_par);
			xml_par = $(XML("act")); xml_par.text("STOP"); xml_request.append(xml_par);
			xml_par = $(XML("par")); xml_par.append(audio_item); xml_request.append(xml_par);
			xml_send(xml_request);
		}
	},
	audio_st_get: function()
	{
		var audio_item = audios[audio_index].clone();
		audio_item.attr("id", "1");
		//
		xml_request = xml_request_head_build("MENU", "widget_audio_edit");
		xml_par = $(XML("page")); xml_par.text("AUDIO"); xml_request.append(xml_par);
		xml_par = $(XML("act")); xml_par.text("ST_GET"); xml_request.append(xml_par);
		xml_par = $(XML("par")); xml_par.append(audio_item); xml_request.append(xml_par);
		xml_send(xml_request);
	},
	rec: function()
	{
		if ($(".rec").attr("data-checked") == "1" && debounce_audio)
		{
			debounce_audio = false;
			var audio_item = audios[audio_index].clone();
			audio_item.attr("id", "1");
			//
			xml_request = xml_request_head_build("MENU", "widget_audio_edit");
			xml_par = $(XML("page")); xml_par.text("AUDIO"); xml_request.append(xml_par);
			xml_par = $(XML("act")); xml_par.text("REC"); xml_request.append(xml_par);
			xml_par = $(XML("par")); xml_par.append(audio_item); xml_request.append(xml_par);
			xml_send(xml_request);
			//anticipo blocco di play e rec per evitare l'invio di richieste che si possono accavallare in centrale
			$(".stop")
				.css("opacity", "1")
				.attr("data-checked", "1");
			$(".rec, .play")
				.css("opacity", "0.3")
				.attr("data-checked", "0");
		}
	},
	play_edit: function()
	{
		if ($(".play").attr("data-checked") == "1" && debounce_audio)
		{
			debounce_audio = false;
			var audio_item = audios[audio_index].clone();
			audio_item.attr("id", "1");
			//
			xml_request = xml_request_head_build("MENU", "widget_audio_edit");
			xml_par = $(XML("page")); xml_par.text("AUDIO"); xml_request.append(xml_par);
			xml_par = $(XML("act")); xml_par.text("PLAY"); xml_request.append(xml_par);
			xml_par = $(XML("par")); xml_par.append(audio_item); xml_request.append(xml_par);
			xml_send(xml_request);
		}
	}
};