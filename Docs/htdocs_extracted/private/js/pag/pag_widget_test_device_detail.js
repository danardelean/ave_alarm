pag_table_new["widget_test_device_detail"] = {
	onload: function()
	{
		$(".JSdialog").show();
		//
		this.footer_home_switch();
		this.header_home_switch();
		//
		var widget_obj = this;
		//
		var tema_path = (isTema("light_tema") ? "light/" : "");
		//
		//
		var ticket = null;
		//
		switch(this.dev_type)
		{
			case WS_DEV_ALARM_SIR_STR:
				$("#container_test_device_detail .info_dev").parent().css("background-image", "url({TMPL_DIR}res/" + tema_path + "sir_icon.png)");
				$("#container_test_device_detail .entire:not(#TD_sir)").remove();
				break;
			case WS_DEV_ALARM_SIRI_STR:
				$("#container_test_device_detail .info_dev").parent().css("background-image", "url({TMPL_DIR}res/" + tema_path + "sir_icon.png)");
				$("#container_test_device_detail .entire:not(#TD_sir)").remove();
				break;
			case WS_DEV_ALARM_GSM_STR:
				$("#container_test_device_detail .info_dev").parent().css("background-image", "url({TMPL_DIR}res/" + tema_path + "gsm_icon.png)");
				$("#container_test_device_detail .entire:not(#TD_gsm)").remove();
				break;
			case WS_DEV_ALARM_PSTN_STR:
				$("#container_test_device_detail .info_dev").parent().css("background-image", "url({TMPL_DIR}res/" + tema_path + "pstn_icon.png)");
				$("#container_test_device_detail .entire:not(#TD_pstn)").remove();
				break;
			case WS_DEV_ALARM_WIFI_STR:
				$("#container_test_device_detail .info_dev").parent().css("background-image", "url({TMPL_DIR}res/" + tema_path + "wifi_icon.png)");
				$("#container_test_device_detail .entire:not(#TD_wifi)").remove();
				break;
			case WS_DEV_ALARM_RELAY_STR:
			case WS_DEV_ALARM_BUS_RELAY_STR:
				$("#container_test_device_detail .info_dev").parent().css("background-image", "url({TMPL_DIR}res/" + tema_path + "relay_icon.png)");
				$("#container_test_device_detail .entire:not(#TD_relay)").remove();
				break;
			case WS_DEV_ALARM_TVCC_STR:
				$("#container_test_device_detail .info_dev").parent().css("background-image", "url({TMPL_DIR}res/" + tema_path + "tvcc_icon.png)");
				$("#container_test_device_detail .entire:not(#TD_tvcc)").remove();
				ticket = "widget_test_device_detail";
				break;
			case WS_DEV_ALARM_SEN_PHOTOPIR_STR:
				$("#container_test_device_detail .info_dev").parent().css("background-image", "url({TMPL_DIR}res/" + tema_path + "tvcc_icon.png)");
				$("#container_test_device_detail .entire:not(#TD_tvcc)").remove();
				ticket = "widget_test_device_detail";
				break;
			default:
				$("#container_test_device_detail .info_dev").parent().css("background-image", "url({TMPL_DIR}res/" + tema_path + "disabled.png)");
				$("#container_test_device_detail .entire:not(#TD_nogui)").remove();
				break;
		}
		///////////////
		//parte fissa//
		if ($(".widget_test_device_detail").attr("data-type") != "none")
			$("#container_test_device_detail .info_dev .type").append($(".widget_test_device_detail").attr("data-type"));
		else
			$("#container_test_device_detail .info_dev .type").hide();
		if ($(".widget_test_device_detail").attr("data-room") != "none")
			$("#container_test_device_detail .info_dev .room").append($(".widget_test_device_detail").attr("data-room"));
		else
			$("#container_test_device_detail .info_dev .room").hide();
		if ($(".widget_test_device_detail").attr("data-area") != "none")
			$("#container_test_device_detail .info_dev .area").append($(".widget_test_device_detail").attr("data-area"));
		else
			$("#container_test_device_detail .info_dev .area").hide();
		if ($(".widget_test_device_detail").attr("data-dev-name") != "none")
			$("#container_test_device_detail .info_dev .name").append($(".widget_test_device_detail").attr("data-dev-name"));
		else
			$("#container_test_device_detail .info_dev .name").hide();
		//
		$("#container_test_device_detail .start, #container_test_device_detail .stop, #container_test_device_detail .insert, #container_test_device_detail .get_frame").click(function()
		{
			widget_obj.xml_request_local = xml_request_head_build("MENU", ticket);
			widget_obj.xml_par_local = $(XML("act")); widget_obj.xml_par_local.text("EXE"); widget_obj.xml_request_local.append(widget_obj.xml_par_local);
			widget_obj.xml_par_local = $(XML("page")); widget_obj.xml_par_local.text(WS_TEST_STR); widget_obj.xml_request_local.append(widget_obj.xml_par_local);
			widget_obj.xml_par_local = $(XML("par")); widget_obj.xml_request_local.append(widget_obj.xml_par_local);
			widget_obj.xml_node_local = $(XML("id")); widget_obj.xml_node_local.text($(".widget_test_device_detail").attr("data-dev-id")); widget_obj.xml_par_local.append(widget_obj.xml_node_local);
		});
		//fine parte fissa//
		////////////////////
		if (this.dev_type == WS_DEV_ALARM_SIR_STR)
		{
			widget_obj.xml_node_local2 = $(XML("act"));
			//
			$("#container_test_device_detail .start.a").click(function()	{	widget_obj.xml_node_local2.text("SIR_START");		});
			$("#container_test_device_detail .stop.a").click(function()		{	widget_obj.xml_node_local2.text("SIR_STOP");		});
			$("#container_test_device_detail .start.b").click(function()	{	widget_obj.xml_node_local2.text("SIR_MSG_A_START");	});
			$("#container_test_device_detail .stop.b").click(function()		{	widget_obj.xml_node_local2.text("SIR_MSG_A_STOP");	});
			$("#container_test_device_detail .start.c").click(function()	{	widget_obj.xml_node_local2.text("SIR_MSG_B_START");	});
			$("#container_test_device_detail .stop.c").click(function()		{	widget_obj.xml_node_local2.text("SIR_MSG_B_STOP");	});
			//
			$("#container_test_device_detail .start, #container_test_device_detail .stop").click(function()
			{
				widget_obj.xml_par_local.append(widget_obj.xml_node_local2);
				xml_send(widget_obj.xml_request_local);
			});
		}
		else if (this.dev_type == WS_DEV_ALARM_SIRI_STR)
		{
			widget_obj.xml_node_local2 = $(XML("act"));
			//
			$("#container_test_device_detail .start.a").click(function()	{	widget_obj.xml_node_local2.text("SIR_START");		});
			$("#container_test_device_detail .stop.a").click(function()		{	widget_obj.xml_node_local2.text("SIR_STOP");		});
			$("#container_test_device_detail .start.b").click(function()	{	widget_obj.xml_node_local2.text("SIR_MSG_A_START");	});
			$("#container_test_device_detail .stop.b").click(function()		{	widget_obj.xml_node_local2.text("SIR_MSG_A_STOP");	});
			$("#container_test_device_detail .start.c").click(function()	{	widget_obj.xml_node_local2.text("SIR_MSG_B_START");	});
			$("#container_test_device_detail .stop.c").click(function()		{	widget_obj.xml_node_local2.text("SIR_MSG_B_STOP");	});
			//
			$("#container_test_device_detail .start, #container_test_device_detail .stop").click(function()
			{
				widget_obj.xml_par_local.append(widget_obj.xml_node_local2);
				xml_send(widget_obj.xml_request_local);
			});
		}
		else if (this.dev_type == WS_DEV_ALARM_GSM_STR)
		{
			$("#container_test_device_detail .insert:not(.c):not(.d):not(.e):not(.f):not(.g)").click(function()		{	pag_change(".JSdialog2", "widget_keypad", "test_device_gsm", $(this).attr("class"), null, $(this).text());	});
			//
			$("#container_test_device_detail .insert:not(.a):not(.b):not(.e):not(.f):not(.g)").click(function()		{	pag_change(".JSdialog2", "widget_keypad", "test_device_gsm", $(this).attr("class"), $(this).attr("data-id"), $(this).text());	});
			//
			$("#container_test_device_detail .insert:not(.a):not(.b):not(.c):not(.d):not(.g)").click(function()
			{
				var addr = "none";
				var test_str = "";
				if ($(this).attr("data-id") == "3")
				{
					addr = test_device_saves.common.sia;
					test_str = "{LANG_SEND_SIA_S1}";
				}
				else if ($(this).attr("data-id") == "4")
				{
					addr = test_device_saves.common.sia2;
					test_str = "{LANG_SEND_SIA_S2}";
				}
				//
				if (!$(this).hasClass("disabled")) pag_change(".JSdialog2", "widget_popwarn", test_str, addr, "okab", "#container_test_device_detail .insert[data-id='"+$(this).attr("data-id")+"']", null);
			}).on("on_pw_ok", function()
			{
				widget_obj.testing_sia_adem = true;
				//
				widget_obj.xml_node_local2 = $(XML("act")); widget_obj.xml_node_local2.text("GSM_VIG_SEND"); widget_obj.xml_par_local.append(widget_obj.xml_node_local2);
				widget_obj.xml_node_local2 = $(XML("vig_id")); widget_obj.xml_node_local2.text($(this).attr("data-id")); widget_obj.xml_par_local.append(widget_obj.xml_node_local2);
				if (!$(this).hasClass("disabled")) xml_send(widget_obj.xml_request_local);
				//
				var addr = "none";
				if ($(this).attr("data-id") == "3")
					addr = test_device_saves.common.sia;
				else if ($(this).attr("data-id") == "4")
					addr = test_device_saves.common.sia2;
				//
				// per riattivare la possibilita' di annullare il test decommentare la seguenti righe
				//pagClear(".JSdialog2");
				//if (!$(this).hasClass("disabled")) pag_change(".JSdialog2", "widget_popwarn", "{LANG_WARNING}", "{LANG_CALL_IN_PROGRESS} "+addr, "ab", "#container_test_device_detail .insert[data-id='"+$(this).attr("data-id")+"']", null);
			}).on("on_pw_ab", function()
			{
				widget_obj.testing_sia_adem = false;
				widget_obj.abort();
			});
			//
			$("#container_test_device_detail .insert.g").click(function()
			{
				if (!$(this).hasClass("disabled"))
					pag_change(".JSdialog2", "widget_popwarn", "{LANG_SEND_MAIL}", "{LANG_IN_MAIL}", "input", "#container_test_device_detail .insert.g", test_device_saves.common.email);
			});
			$("#container_test_device_detail .insert.g").on("on_pw_ok", function()
			{
				test_device_saves.common.email = $("#popwarn_input").val();
				pag_clear(pag_table_new["widget_popwarn"].pw_container);
				//
				widget_obj.xml_node_local2 = $(XML("act")); widget_obj.xml_node_local2.text("GSM_EMAIL_SEND"); widget_obj.xml_par_local.append(widget_obj.xml_node_local2);
				widget_obj.xml_node_local2 = $(XML("email_adr")); widget_obj.xml_node_local2.text(test_device_saves.common.email); widget_obj.xml_par_local.append(widget_obj.xml_node_local2);
				widget_obj.xml_node_local2 = $(XML("content")); widget_obj.xml_node_local2.text("TEST EMAIL"); widget_obj.xml_par_local.append(widget_obj.xml_node_local2);
				if (widget_obj.xml_request_local.find("email_adr").text().trim().length > 0 && cen_set_xml.children("email_ena").text() > 0) xml_send(widget_obj.xml_request_local);
			});
			if (cen_set_xml.children("email_ena").text() == 0)
				$("#container_test_device_detail .insert.g").addClass("disabled");
			//
			xml_menu_load_send("VIG", null, null, "widget_test_device_detail", null);
		}
		else if (this.dev_type == WS_DEV_ALARM_PSTN_STR)
		{
			$("#container_test_device_detail .insert").click(function()	{	pag_change(".JSdialog2", "widget_keypad", "test_device_pstn", $(this).attr("class"), $(this).attr("data-id"), $(this).text());	});
			//
			/*$("#container_test_device_detail .insert:not(.a)").click(function()
			{
				widget_obj.testing_sia_adem = true;
				//
				widget_obj.xml_node_local2 = $(XML("act")); widget_obj.xml_node_local2.text("PSTN_VIG_SEND"); widget_obj.xml_par_local.append(widget_obj.xml_node_local2);
				widget_obj.xml_node_local2 = $(XML("vig_id")); widget_obj.xml_node_local2.text($(this).attr("data-id")); widget_obj.xml_par_local.append(widget_obj.xml_node_local2);
				widget_obj.xml_node_local2 = $(XML("telnum")); widget_obj.xml_node_local2.text("999999"); widget_obj.xml_par_local.append(widget_obj.xml_node_local2);
				if (!$(this).hasClass("disabled")) xml_send(widget_obj.xml_request_local);
				//
				if (!$(this).hasClass("disabled")) pag_change(".JSdialog2", "widget_popwarn", "{LANG_WARNING}", "{LANG_CALL_IN_PROGRESS}", "ab", "#container_test_device_detail .insert[data-id='"+$(this).attr("data-id")+"']", null);
			}).on("on_pw_ab", function()
			{
				widget_obj.testing_sia_adem = false;
				widget_obj.abort();
			});*/
			//
			xml_menu_load_send("VIG", null, null, "widget_test_device_detail", null);
		}
		else if (this.dev_type == WS_DEV_ALARM_WIFI_STR)
		{
			$("#container_test_device_detail .insert:not(.c)").click(function()
			{
				var addr = "none";
				var test_str = "";
				if ($(this).attr("data-id") == "3")
				{
					addr = test_device_saves.common.sia;
					test_str = "{LANG_SEND_SIA_S1}";
				}
				else if ($(this).attr("data-id") == "4")
				{
					addr = test_device_saves.common.sia2;
					test_str = "{LANG_SEND_SIA_S2}";
				}
				//
				if (!$(this).hasClass("disabled")) pag_change(".JSdialog2", "widget_popwarn", test_str, addr, "okab", "#container_test_device_detail .insert[data-id='"+$(this).attr("data-id")+"']", null);
			}).on("on_pw_ok", function()
			{
				widget_obj.testing_sia_adem = true;
				//
				widget_obj.xml_node_local2 = $(XML("act")); widget_obj.xml_node_local2.text("WIFI_VIG_SEND"); widget_obj.xml_par_local.append(widget_obj.xml_node_local2);
				widget_obj.xml_node_local2 = $(XML("vig_id")); widget_obj.xml_node_local2.text($(this).attr("data-id")); widget_obj.xml_par_local.append(widget_obj.xml_node_local2);
				if (!$(this).hasClass("disabled")) xml_send(widget_obj.xml_request_local);
				//
				var addr = "none";
				if ($(this).attr("data-id") == "3")
					addr = test_device_saves.common.sia;
				else if ($(this).attr("data-id") == "4")
					addr = test_device_saves.common.sia2;
				//
				// per riattivare la possibilita' di annullare il test decommentare la seguenti righe
				//pagClear(".JSdialog2");
				//if (!$(this).hasClass("disabled")) pag_change(".JSdialog2", "widget_popwarn", "{LANG_WARNING}", "{LANG_CALL_IN_PROGRESS} "+addr, "ab", "#container_test_device_detail .insert[data-id='"+$(this).attr("data-id")+"']", null);
			}).on("on_pw_ab", function()
			{
				widget_obj.testing_sia_adem = false;
				widget_obj.abort();
			});
			//
			$("#container_test_device_detail .insert.c").click(function()
			{
				if (!$(this).hasClass("disabled"))
					pag_change(".JSdialog2", "widget_popwarn", "{LANG_SEND_MAIL}", "{LANG_IN_MAIL}", "input", "#container_test_device_detail .insert.c", test_device_saves.common.email);
			});
			$("#container_test_device_detail .insert.c").on("on_pw_ok", function()
			{
				test_device_saves.common.email = $("#popwarn_input").val();
				pag_clear(pag_table_new["widget_popwarn"].pw_container);
				//
				widget_obj.xml_node_local2 = $(XML("act")); widget_obj.xml_node_local2.text("WIFI_EMAIL_SEND"); widget_obj.xml_par_local.append(widget_obj.xml_node_local2);
				widget_obj.xml_node_local2 = $(XML("email_adr")); widget_obj.xml_node_local2.text(test_device_saves.common.email); widget_obj.xml_par_local.append(widget_obj.xml_node_local2);
				widget_obj.xml_node_local2 = $(XML("content")); widget_obj.xml_node_local2.text("TEST EMAIL"); widget_obj.xml_par_local.append(widget_obj.xml_node_local2);
				if (widget_obj.xml_request_local.find("email_adr").text().trim().length > 0 && cen_set_xml.children("email_ena").text() > 0) xml_send(widget_obj.xml_request_local);
			});
			if (cen_set_xml.children("email_ena").text() == 0)
				$("#container_test_device_detail .insert.c").addClass("disabled");
			//
			xml_menu_load_send("VIG", null, null, "widget_test_device_detail", null);
		}
		else if (this.dev_type == WS_DEV_ALARM_RELAY_STR || this.dev_type == WS_DEV_ALARM_BUS_RELAY_STR)
		{
			widget_obj.xml_node_local2 = $(XML("act"));
			//
			if (xml_any_tbl_test[any_ind].children("mode").text() == "2" && xml_any_tbl_test[any_ind].children("cfg_rele_mode").text() == "3")
			{
				$("#TD_relay .quadrant.one").remove();
			}
			else	
			{
				$("#TD_relay .quadrant.two").remove();
			}
			$("#container_test_device_detail .insert.a").click(function()	{	widget_obj.xml_node_local2.text("RELE_ACT_A");	});
			$("#container_test_device_detail .insert.b").click(function()	{	widget_obj.xml_node_local2.text("RELE_ACT_B");	});
			$("#container_test_device_detail .insert.c").click(function()	{	widget_obj.xml_node_local2.text("RELE_ACT_C");	});
			//
			$("#container_test_device_detail .insert").click(function()
			{
				widget_obj.xml_par_local.append(widget_obj.xml_node_local2);
				xml_send(widget_obj.xml_request_local);
			});
		}
		else if (this.dev_type == WS_DEV_ALARM_TVCC_STR)
		{
			$("#container_test_device_detail .get_frame").click(function()
			{
				if (widget_obj.cam_test_debouncer)
				{
					widget_obj.cam_test_debouncer = false;
					//
					widget_obj.xml_node_local2 = $(XML("act")); widget_obj.xml_node_local2.text("SNAPSHOT"); widget_obj.xml_par_local.append(widget_obj.xml_node_local2);
					xml_send(widget_obj.xml_request_local);
					//
					$("#TD_tvcc .visual").removeAttr("style");
					//
					widget_obj.acquiring();
					//
					clearTimeout(widget_obj.t_out_nimage);
					widget_obj.t_out_nimage = setTimeout(function(){widget_obj.abort();widget_obj.noimage();}, widget_obj.time_noimage*1000);
				}
			});
			if (!SIL) $("#container_test_device_detail .get_frame").trigger("click");
		}
		else if (this.dev_type == WS_DEV_ALARM_SEN_PHOTOPIR_STR)
		{
			$("#container_test_device_detail .get_frame").click(function()
			{
				if (widget_obj.cam_test_debouncer)
				{
					widget_obj.cam_test_debouncer = false;
					//
					widget_obj.xml_node_local2 = $(XML("act")); widget_obj.xml_node_local2.text("SNAPSHOT"); widget_obj.xml_par_local.append(widget_obj.xml_node_local2);
					xml_send(widget_obj.xml_request_local);
					//
					$("#TD_tvcc .visual").removeAttr("style");
					//
					widget_obj.acquiring();
					//
					clearTimeout(widget_obj.t_out_nimage);
					widget_obj.t_out_nimage = setTimeout(function(){widget_obj.abort();widget_obj.noimage();}, widget_obj.time_noimage*1000);
				}
			});
			if (!SIL) $("#container_test_device_detail .get_frame").trigger("click");
		}
	},
	onrecv_confirmation: function(conf)
	{
		if (this.dev_type == WS_DEV_ALARM_GSM_STR || this.dev_type == WS_DEV_ALARM_PSTN_STR || this.dev_type == WS_DEV_ALARM_WIFI_STR)
		{
			if (conf.attr("type") == "MENU")
			{		
				if (conf.children("act").text() == "LOAD")
				{
					if (conf.children("res").text() == "LOADED")
					{
						if (conf.children("page").text() == WS_VIG_STR)
						{
							var widget_obj = this;
							//
							conf.find("item ena_flg").each(function()
							{
								if  ($(this).text() == 0)
									$("#container_test_device_detail .insert[data-id='"+$(this).siblings("id").text()+"']").off("click");
								else
									$("#container_test_device_detail .insert[data-id='"+$(this).siblings("id").text()+"']").removeClass("disabled");
								//
								var id = $(this).siblings("id").text();
								if (id == 1)
									test_device_saves.common.digitale = $(this).siblings("telnum_a").text();
								else if (id == 2)
									test_device_saves.common.digitale2 = $(this).siblings("telnum_a").text();
								else if (id == 3)
									test_device_saves.common.sia = $(this).siblings("ip_adr").text()+":"+$(this).siblings("ip_port").text();
								else if (id == 4)
									test_device_saves.common.sia2 = $(this).siblings("ip_adr").text()+":"+$(this).siblings("ip_port").text();
							});
						}
					}
					else if (conf.children("res").text() == "ERROR")
					{
						alert(conf.children("res").text()+": "+conf.children("desc").text());
					}
				}
			}
		}
		else if (this.dev_type == WS_DEV_ALARM_TVCC_STR)
		{
			if (conf.attr("type") == "MENU")
			{
				if (conf.children("act").text() == "EXE")
				{
					if (conf.children("res").text() == "ACQUIRING")
					{
						if (conf.children("page").text() == WS_TEST_STR)
						{
							//
						}
					}
					else if (conf.children("res").text() == "ERROR")
					{
						clearTimeout(this.t_out_nimage);
						//
						this.noimage();
					}
				}
			}
		}
	},
	onrecv_indication: function(indi)
	{
		if (indi.attr("type") == "MENU")
		{
			if (indi.children("page").text() == WS_TEST_STR)
			{
				if (indi.children("act").text() == "ACQUIRED")
				{
					clearTimeout(this.t_out_nimage);
					//
					var image = indi.find("par image").text();
					$("#TD_tvcc .visual").attr("style", "background-image: url('data:image/jpg;base64," + image + "');");
					this.acquired();
				}
				else if (indi.children("act").text() == "ERROR")
				{
					clearTimeout(this.t_out_nimage);
					//
					this.noimage();
				}
				if (this.testing_sia_adem)
				{
					this.testing_sia_adem = false;
					if (indi.children("act").text() == "OK")
					{
						// per riattivare l'avviso OK decommentare la seguente riga
						//pag_change(".JSdialog2", "widget_popwarn", "{LANG_WARNING}", "{LANG_OK}", "ok", null, null);
					}
					else if (indi.children("act").text() == "KO")
					{
						// per riattivare l'avviso KO decommentare la seguente riga
						//pag_change(".JSdialog2", "widget_popwarn", "{LANG_WARNING}", "{LANG_KO}", "ok", null, null);
					}
				}
			}
		}
	},
	onclose: function()
	{
		$(".JSdialog").hide();
		//
		pag_table_new["widget_test_device_list"].gui_detail();
		this.numTel = null;
		this.numIP = null;
		this.abort();
		clearTimeout(this.t_out_nimage);
	},
	//
	name: "widget_test_device_detail",
	title: function()
	{
		var title = "";
		switch($(".widget_test_device_detail").attr("data-type-code"))
		{
			case WS_DEV_ALARM_SIR_STR:
				title = "{LANG_TEST_SIR}";
				break;
			case WS_DEV_ALARM_SIRI_STR:
				title = "{LANG_TEST_SIR}";
				break;
			case WS_DEV_ALARM_GSM_STR:
				title = "{LANG_TEST_GSM}";
				break;
			case WS_DEV_ALARM_PSTN_STR:
				title = "{LANG_TEST_PSTN}";
				break;
			case WS_DEV_ALARM_WIFI_STR:
				title = "{LANG_TEST_WIFI}";
				break;
			case WS_DEV_ALARM_RELAY_STR:
				title = "{LANG_TEST_RELAY}";
				break;
			case WS_DEV_ALARM_BUS_RELAY_STR:
				title = "{LANG_TEST_RELAY}";
				break;
			case WS_DEV_ALARM_TVCC_STR:
				title = "{LANG_TEST_TVCC}";
				break;
			case WS_DEV_ALARM_SEN_PHOTOPIR_STR:
				title = "{LANG_TEST_PHOTOPIR}";
				break;
			default:
				if (SIMUL) title = "titolo mancante";
				break;
		}
		return title;
	}(),
	dev_type: $(".widget_test_device_detail").attr("data-type-code"),
	xml_request_local: null,
	xml_par_local: null,
	xml_node_local: null,
	xml_node_local2: null,
	t_out_nimage: null,
	time_noimage: 40,
	cam_test_debouncer: true,
	//
	testing_sia_adem: false,
	//
	acquiring: function()
	{
		//$("#TD_tvcc .quadrant.bc").attr("style", "background-image: url({TMPL_DIR}res/big_circle.png);");
		$("#TD_tvcc .quadrant.bc p").remove();
		$("#TD_tvcc .quadrant.bc").append("<p>{LANG_ACQUIRING}</p>");
	},
	noimage: function()
	{
		//$("#TD_tvcc .quadrant.bc").attr("style", "background-image: url({TMPL_DIR}res/big_circle.png);");
		$("#TD_tvcc .quadrant.bc p").remove();
		$("#TD_tvcc .quadrant.bc").append("<p>{LANG_NO_IMAGE_AVAILABLE}</p>");
		//
		this.cam_test_debouncer = true;
	},
	acquired: function()
	{
		$("#TD_tvcc .quadrant.bc").removeAttr("style");
		$("#TD_tvcc .quadrant.bc p").remove();
		//
		this.cam_test_debouncer = true;
	},
	abort: function()
	{
		xml_request = xml_request_head_build("MENU");
		xml_par = $(XML("act")); xml_par.text("EXE"); xml_request.append(xml_par);
		xml_par = $(XML("page")); xml_par.text(WS_TEST_STR); xml_request.append(xml_par);
		xml_par = $(XML("par")); xml_request.append(xml_par);
		xml_node = $(XML("id")); xml_node.text($(".widget_test_device_detail").attr("data-dev-id")); xml_par.append(xml_node);
		xml_node = $(XML("act")); xml_node.text("ABORT"); xml_par.append(xml_node);
		xml_send(xml_request);
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			if ("widget_test_device_list" in pag_table_new)
			{
				pag_table_new["widget_test_device_list"].header_home_switch();
				pag_table_new["widget_test_device_list"].footer_home_switch();
			}
			//
			pag_clear(".JSdialog");
		});
		//
		$("#backTitle").html("{LANG_WIZARD_TEST_DEVICE_LIST_TITLE}");
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