pag_table_new["widget_log"] = {
	onload: function()
	{
		pag_clear(".home .JSdialog");
		//
		dynamic_page_act(this);
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		away_from_home();
		//
		var widget_obj = this;
		//
		xml_file_configuration.find("Logs LogEvents LogEvent").each(function()
		{
			widget_obj.associative_eve[$(this).attr("type")] = $(this).attr("desc");
		});
		xml_file_configuration.find("Logs LogResults LogResult").each(function()
		{
			widget_obj.associative_res[$(this).attr("type")] = $(this).attr("desc");
		});
		//
		//conta quanti eventi possono essere visualizzati in una singola pagina
		this.logs_limit_cnt = Math.floor($("#widget_log_entire").height() / $("#dummy_decoy").height());
		if (!QT)
		{
			$(window).off("resize." + widget_obj.name).on("resize." + widget_obj.name, function ()
			{
				pag_table_new["widget_log"].logs_limit_cnt = Math.floor($("#widget_log_entire").height() / $("#dummy_decoy").height());			
				pag_table_new["widget_log"].send_fetch_logs();
			});
		}
		//
		this.send_request_logs();
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "MENU")
		{
			if (conf.find("page").text() == WS_LOG_STR)
			{
				if (conf.find("Logs").attr("act") == "QUERY")
				{
					this.logs_cnt = conf.find("Logs").attr("cnt");
					this.logs_limit_ini = 0;
					//
					$(".foot_button.filter").swapClass("filter_activated", "bg_azure_gr");
					if (this.filter_date_ini_flg || this.filter_date_end_flg)
						$(".foot_button.filter.date").swapClass("bg_azure_gr", "filter_activated");
					if (this.filter_eve_type != "-1")
						$(".foot_button.filter.event").swapClass("bg_azure_gr", "filter_activated");
					//
					if (this.logs_cnt == 0)
					{
						$("#header-home-page2 .header_title").html("{LANG_MENU_LOG_TITLE}");
						$("#widget_log_entire").empty();
					}
					else
					{
						this.send_fetch_logs();	
					}
				}
				else if (conf.find("Logs").attr("act") == "FETCH")
				{
					if (this.download_flg)
					{
						this.download_fx(conf);
						this.download_flg = false;
					}
					else
					{
						$("#widget_log_entire").empty();
						var i = 0;
						var widget_obj = this;
						conf.find("Logs Log").each(function(index)
						{
							var eve_id = widget_obj.associative_eve[$(this).attr("eve")];
							var newDate = 0;
							if (QT)
								newDate = from_timestamp_to_date_obj($(this).children("Timestamp").text());
							else
								newDate = from_localdt_to_datacen($(this).children("localdt").text());
							var dev_name = $(this).children("name").text();
							var result = widget_obj.associative_res[$(this).children("res").text()];
							var msg = $(this).children("Msg").text();
							var user_login = $(this).children("user").text();
							if (user_login != "")
								dev_name = user_login;
							var custFnt = null;
							//
							if (eve_id.toLowerCase().trim() == "void") eve_id = "";
							if (dev_name.toLowerCase().trim() == "void") dev_name = "";
							if (result.toLowerCase().trim() == "void") result = "";
							if (msg.toLowerCase().trim() == "void") msg = "";
							//
							custFnt = widget_obj.custColTbl[$(this).attr("eve")];
							if (typeof custFnt === "object")
								custFnt = custFnt[$(this).children("res").text()];
							//
							$(".widget_log .entire.row_1").append
							(
								"<div class='global_item ibrb row_" + (index + 1) + " full fnt_" + custFnt + "'>"
								+	"<div class='item_col log'><p class='p_text'>" + week_day_month_do(newDate) + " " + ampm_time(newDate) + "</p></div>"
								+	"<div class='item_col log'><p class='p_text'>" + eve_id + "<br>" + msg +"</p></div>"
								+	"<div class='item_col log'><p class='p_text'>" + dev_name + "</p></div>"
								+	"<div class='item_col log'><p class='p_text'>" + result + "</p></div>"
								+"</div>"
							);
							//
							if ($(this).hasTag("images"))
							{
								if ($(this).children("images").hasTag("image"))
								{
									var last_item = $(".widget_log .entire.row_1 .global_item:last");
									last_item
										.data("images", $(this).find("images"))
										.children(".item_col:last").css("background", "url({TMPL_DIR}res/eye"+(SIL ? "_y" : "")+".png) no-repeat center center");
									last_item
										.click(function()
										{
											var li = $(this);
											$(".widget_log .images .image")
												.css("background-image", "url(data:image/jpg;base64,"+li.data("images").children("image:eq("+widget_obj.image_idx+")").text()+")")
												.off("click").click(function(event)
												{
													if (event.target == this || event.target.getAttribute("class") == "slice" || event.target.getAttribute("class") == "cam_name")
													{
														widget_obj.image_idx = 0;
														$(this).parent().hide();
													}
													else if (event.target.id == "prev_img")
													{
														if (widget_obj.image_idx == 0)
															widget_obj.image_idx = li.data("images").children("image").length-1;
														else
															widget_obj.image_idx--;
														//
														$(this)
															.css("background-image", "url(data:image/jpg;base64,"+li.data("images").children("image:eq("+widget_obj.image_idx+")").text()+")")
															.parent().find(".cam_name").text("Image"+widget_obj.image_idx); //siblings e parent.children non funzionano
													}
													else if (event.target.id == "next_img")
													{
														if (widget_obj.image_idx == li.data("images").children("image").length-1)
															widget_obj.image_idx = 0;
														else
															widget_obj.image_idx++;
														//
														$(this)
															.css("background-image", "url(data:image/jpg;base64,"+li.data("images").children("image:eq("+widget_obj.image_idx+")").text()+")")
															.parent().find(".cam_name").text("Image"+widget_obj.image_idx); //siblings e parent.children non funzionano
													}
												})
												.parent().show()
												.find(".cam_name").text("Image"+widget_obj.image_idx);
											//
											if (li.data("images").children("image").length == 1)
												$(".widget_log .images .slice").hide();
											else
												$(".widget_log .images .slice").show();
										});
								}
							}
							//
							if (index+1+widget_obj.logs_limit_ini == widget_obj.logs_cnt && index+1 < 6)
							{
								$(".widget_log .entire.row_1").append
								(
									"<div class='global_item row_"+(index+1+1)+" full void'>"
									+"</div>"
								);
							}
						});
						//
						var upper_limit = this.logs_limit_ini + this.logs_limit_cnt > this.logs_cnt ? this.logs_cnt : this.logs_limit_ini + this.logs_limit_cnt;
						$("#header-home-page2 .header_title").html("{LANG_MENU_LOG_TITLE} " + (this.logs_limit_ini-1+2) + " &#47; " + upper_limit);
						//
						widget_obj.gui_detail();
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
	name: "widget_log",
	title: "{LANG_MENU_LOG_TITLE}",
	bodyWrapper: "set elsewhere",
	associative_eve: [],
	associative_res: [],
	logs_cnt: null,
	logs_limit_ini: null,
	logs_limit_cnt: null,
	date_log_ini: ts,
	date_log_end: ts,
	localdt_ini: date_cen_str,
	localdt_end: date_cen_str,
	filter_date_ini_flg: false,
	filter_date_end_flg: false,
	filter_eve_type: "-1",
	download_url: null,
	download_flg: false,
//	filter_devus_id: "-1",
	image_idx: 0,
	custColTbl:
	{
		ALARM_ARM: "bl"
		, ARM_FORCED: "bl"
		, ALARM_DISARM: "gr"
		, ALARM_INTRUSION: "rd"
		, ALARM_TAMPER_A: "rd"
		, ALARM_H24: "rd"
		, ALARM_TAMPER_B: "rd"
		, ALARM_TAMPER: "rd"
		, ALARM_TAMPER_C: "rd"
		, ALARM_TAMPER_WIRE_EXT: "rd"
		, ALARM_MEDICAL: "rd"
		, ALARM_PANIC: "rd"
		, ALARM_ROBBERY: "rd"
		, VOX_OUT_GSM: 
		{
			OK_ACK: "gr"
			, OK_NAK: "or"
			, KO: "rd"
		}
		, VOX_OUT_PSTN: 
		{
			OK_ACK: "gr"
			, OK_NAK: "or"
			, KO: "rd"
		}
	},
	//
	send_request_logs: function()
	{
		xml_request = xml_request_head_build("MENU", "widget_log");
		xml_par = $(XML("page")); xml_par.text(WS_LOG_STR); xml_request.append(xml_par);
		if (this.filter_date_ini_flg) {xml_par = $(XML("date_ini")); xml_par.text(this.date_log_ini); xml_request.append(xml_par);}
		if (this.filter_date_end_flg) {xml_par = $(XML("date_end")); xml_par.text(this.date_log_end); xml_request.append(xml_par);}
		if (this.filter_date_ini_flg) {xml_par = $(XML("localdt_ini")); xml_par.text(this.localdt_ini); xml_request.append(xml_par);}
		if (this.filter_date_end_flg) {xml_par = $(XML("localdt_end")); xml_par.text(this.localdt_end); xml_request.append(xml_par);}
		if (this.filter_eve_type != "-1") {xml_par = $(XML("eve")); xml_par.text(this.filter_eve_type); xml_request.append(xml_par);}
//		if (this.filter_devus_id != "-1") {xml_par = $(XML("category")); xml_par.text(this.filter_devus_id); xml_request.append(xml_par);}
//		if (!(result == "NULL_OPTION")) {xml_par = $(XML("res")); xml_par.text(result); xml_request.append(xml_par);};
		xml_par = $(XML("act")); xml_par.text("QUERY"); xml_request.append(xml_par);
		xml_send(xml_request);
	},
	send_fetch_logs: function()
	{
		xml_request = xml_request_head_build("MENU", "widget_log");
		xml_par = $(XML("page")); xml_par.text(WS_LOG_STR); xml_request.append(xml_par);
		xml_par = $(XML("act")); xml_par.text("FETCH"); xml_request.append(xml_par);
		xml_par = $(XML("limit_ini")); xml_par.text(this.logs_limit_ini); xml_request.append(xml_par);
		xml_par = $(XML("limit_cnt")); xml_par.text(this.logs_limit_cnt); xml_request.append(xml_par);
		xml_send(xml_request);
	},
	from_value_to_timestamp: function(day, month, year, ini)
	{
		var local_date = new Date(year+"/"+month+"/"+day+" "+(ini ? "00:00:00" : "23:59:59"));
		if (local_date == "Invalid Date")
		{
			return "NODATE";
		}
		else
		{
			var local_ts = from_date_obj_to_timestamp(local_date);
			if (local_ts < 0) local_ts = 0;
			return local_ts;
		}
	},
	from_value_to_localdt: function(day, month, year, ini)
	{
		var localdt = year + "-" + month + "-" + day + "-" + 1 + "-" + (ini ? "0" : "23") + "-" + (ini ? "0" : "59") + "-" + (ini ? "0" : "59"); 
		return localdt;
	},
	gui_detail: function()
	{
		if (this.logs_limit_ini + this.logs_limit_cnt < this.logs_cnt)
			$("#footer_h2_c_a").removeClass("disabled");
		else
			$("#footer_h2_c_a").addClass("disabled");
		if (this.logs_limit_ini > 0)
			$("#footer_h2_b_b").removeClass("disabled");
		else
			$("#footer_h2_b_b").addClass("disabled");
		//
		//
		/*$(".widget_log .item_col .p_text").each(function()
		{
			if ($(this).height() != 0)
			{
				var lines = $(this).parent().height() - $(this).height();
				if (lines > 35 && lines < 45)
					$(this).css("top", "18px");
				else if (lines > 15 && lines < 25)
					$(this).css("top", "9px");
			}
		});*/
	},
	download_fx: function(conf)
	{
		var widget_obj = this;
		//
		var log = "";
		if (widget_lang_selection == "it")
			log += "\"DATA_ORA\";\"EVENTO\";\"UTENTE\";\"INFORMAZIONI\"\r\n";
		else
			log += "\"DATE_HOUR\";\"EVENT\";\"USER\";\"INFO\"\r\n";
		conf.find("Logs Log").each(function(index)
		{
			var eve_id = widget_obj.associative_eve[$(this).attr("eve")];
			var newDate = 0;
			if (QT)
				newDate = from_timestamp_to_date_obj($(this).children("Timestamp").text());
			else
				newDate = from_localdt_to_datacen($(this).children("localdt").text());
			var dev_name = $(this).children("name").text();
			var result = widget_obj.associative_res[$(this).children("res").text()];
			var msg = $(this).children("Msg").text();
			var user_login = $(this).children("user").text();
			if (user_login != "")
				dev_name = user_login;
			//
			if (eve_id.toLowerCase().trim() == "void") eve_id = "";
			if (dev_name.toLowerCase().trim() == "void") dev_name = "";
			if (result.toLowerCase().trim() == "void") result = "";
			if (msg.toLowerCase().trim() == "void") msg = "";
			//
			log += "\"" + week_day_month_do(newDate) + " " + ampm_time(newDate) + "\";"
				+ "\"" + eve_id + " " + msg + "\";"
				+ "\"" + dev_name + "\";"
				+ "\"" + result + "\"\r\n";
		});
		var namefile = get_year() + "" + get_month_2str() + "" + get_day_2str() + "_" + get_hours() + "" + get_minutes() + "_" + cen_name + "_log.csv";
		namefile = namefile.replaceAll(" ", "_");
		var blob = new Blob( [ log ], { type : "text/plain;charset=utf-8" } );
		if (this.download_url)
			URL.revokeObjectURL(this.download_url);
		this.download_url = URL.createObjectURL(blob);
		$("#footer_h2_b_b").attr("href", this.download_url);
		$("#footer_h2_b_b").attr("download", namefile);
		var a = document.createElement('A');
		a.href = this.download_url;
		a.download = namefile;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		//URL.revokeObjectURL(this.download_url); // Valutare se metterla
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
		draw_footer_button("{LANG_WIZARD_LOG_FILTER_DATE}", "footer_h2_a_a");
		draw_footer_button("{LANG_WIZARD_LOG_FILTER_EVENT}", "footer_h2_a_b");
		//
		$("#footer_h2_a_a .foot_button").addClass("filter date").parent().addClass("logeve");
		$("#footer_h2_a_b .foot_button").addClass("filter event").parent().addClass("logeve");
		//
		global_apply_diag("#footer_home2", "footer_h2_a_a", "{LANG_WIZARD_LOG_FILTER_DATE}", "log_date", null, "widget_log");
		global_apply_diag("#footer_home2", "footer_h2_a_b", "{LANG_WIZARD_LOG_FILTER_EVENT}", "log_event", null, "widget_log");
//		global_apply_diag(".footer_container_btn.home2.footer_x", "filter_devus", "{LANG_WIZARD_LOG_FILTER_DEVUS}", "log_devus", null, "widget_log");
		//
		$("#footer_h2_c_a").off("click").click(function()
		{
			if (widget_obj.logs_limit_ini + widget_obj.logs_limit_cnt < widget_obj.logs_cnt)
			{
				widget_obj.logs_limit_ini += widget_obj.logs_limit_cnt;
				//
				widget_obj.send_fetch_logs();
			}
			//
			widget_obj.image_idx = 0;
			$(".widget_log .images").hide();
		});
		$("#footer_h2_b_b").off("click").click(function()
		{
			if (widget_obj.logs_limit_ini > 0)
			{
				widget_obj.logs_limit_ini -= widget_obj.logs_limit_cnt;
				//
				widget_obj.send_fetch_logs();
			}
			//
			widget_obj.image_idx = 0;
			$(".widget_log .images").hide();
		});
		//
		// DONWLOAD LOG
		if (!QT)
		{
			draw_footer_button("{LANG_DOWNLOAD_LOG}", "footer_h2_a_c");
			$("#footer_h2_a_c .foot_button").addClass("download event").parent().addClass("logeve");
			//
			$("#footer_h2_a_c").off("click").click(function()
			{
				var tmp_logs_limit_ini = widget_obj.logs_limit_ini;
				var tmp_logs_limit_cnt = widget_obj.logs_limit_cnt;
				widget_obj.logs_limit_ini = 0;
				widget_obj.logs_limit_cnt = 10000;
				widget_obj.download_flg = true;
				widget_obj.send_fetch_logs();
				widget_obj.logs_limit_ini = tmp_logs_limit_ini;
				widget_obj.logs_limit_cnt = tmp_logs_limit_cnt;
			});
		}
		//FINE DOWNLOAD LOG
		//
		if (!QT)
		{
			$("." + this.name + " .scrollableContainer").off("swipeup").on("swipeup", function()
			{
				$("#footer_h2_c_a").trigger("click");
			});
			$("." + this.name + " .scrollableContainer").off("swipedown").on("swipedown", function()
			{
				$("#footer_h2_b_b").trigger("click");
			});
			//
			//
			$("." + this.name + " .scrollableContainer").off("mousewheel").on("mousewheel", function(event)
			{
				//console.log(event.deltaX);
				//console.log(event.deltaFactor);
				var qn = $(this).queue().length;
				if (qn < 2) //TreNZ™ //ObreT™
				{
					$(this).animate({border: 0}, 0.2 * 1000, null, function()
					{
						if (event.deltaY == -1)
						{
							if (widget_obj.logs_limit_ini + 1 < widget_obj.logs_cnt)
							{
								widget_obj.logs_limit_ini += 1;
								//
								widget_obj.send_fetch_logs();
							}
							//
							widget_obj.image_idx = 0;
							$(".widget_log .images").hide();
						}
						else if (event.deltaY == 1)
						{
							if (widget_obj.logs_limit_ini > 0)
							{
								widget_obj.logs_limit_ini -= 1;
								//
								widget_obj.send_fetch_logs();
							}
							//
							widget_obj.image_idx = 0;
							$(".widget_log .images").hide();
						}
					});
				}
			});
		}
		//
		//footer_button_rotate();
	}
};