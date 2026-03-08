pag_table_new["widget_keypad"] = {
	onload: function()
	{
		$(".JSdialog2").show();
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		var wtdd_obj = pag_table_new["widget_test_device_detail"];
		//
		//init
		var num_max_len = 18;
		var data_detail = $(".widget_keypad").attr("data-detail");
		var data_origin = $(".widget_keypad").attr("data-origin");
		if (data_origin == "test_device_gsm")
		{
			this.info_label("BEGIN", data_origin, data_detail);
			//
			if (data_detail.indexOf(" a") > -1)
			{
				$(".widget_keypad .container_num").text(test_device_saves.common.phNum);
			}
			else if (data_detail.indexOf(" b") > -1)
			{
				$(".widget_keypad .container_num").text(test_device_saves.common.phNum);
			}
			else if (data_detail.indexOf(" c") > -1)
			{
				$(".widget_keypad .container_num").text(test_device_saves.common.digitale);
			}
			else if (data_detail.indexOf(" d") > -1)
			{
				$(".widget_keypad .container_num").text(test_device_saves.common.digitale2);
			}
			/*else if (data_detail.indexOf(" d") > -1)
			{
				num_max_len = 21;
				$(".widget_keypad").addClass("ip");
				$(".widget_keypad .container_num").text(test_device_saves.gsm.sia);
			}*/
		}
		else if (data_origin == "test_device_pstn")	
		{
			this.info_label("BEGIN", data_origin, data_detail);
			//
			if (data_detail.indexOf(" a") > -1)
			{
				$(".widget_keypad .container_num").text(test_device_saves.common.phNum);
			}
			else if (data_detail.indexOf(" b") > -1)
			{
				$(".widget_keypad .container_num").text(test_device_saves.common.digitale);
			}
			else if (data_detail.indexOf(" c") > -1)
			{
				$(".widget_keypad .container_num").text(test_device_saves.common.digitale2);
			}
		}
		//
		var widget_obj = this;
		var numK = "";
		$("#num_send .active_click").click(function()
		{
			numK = $(".widget_keypad .container_num").text();
			//
			if (numK.length > 0 && !$(this).parent().hasClass("disabled"))
			{
				widget_obj.info_label("INPROGRESS", data_origin, data_detail);
				widget_obj.okey_toggle("OFF");
				//
				wtdd_obj.xml_par_local.find("par act").remove();
				wtdd_obj.xml_par_local.find("par telnum").remove();
				wtdd_obj.xml_par_local.find("par content").remove();
				wtdd_obj.xml_par_local.find("par ip").remove();
				wtdd_obj.xml_par_local.find("par port").remove();
				//
				if (data_origin == "test_device_gsm")
				{
					if (data_detail.indexOf(" a") > -1)
					{
						wtdd_obj.xml_node_local = $(XML("act")); wtdd_obj.xml_node_local.text("GSM_VOX_SEND"); wtdd_obj.xml_par_local.append(wtdd_obj.xml_node_local);
						wtdd_obj.xml_node_local = $(XML("telnum")); wtdd_obj.xml_node_local.text(numK); wtdd_obj.xml_par_local.append(wtdd_obj.xml_node_local);
						test_device_saves.common.phNum = numK;
					}
					else if (data_detail.indexOf(" b") > -1)
					{
						wtdd_obj.xml_node_local = $(XML("act")); wtdd_obj.xml_node_local.text("GSM_SMS_SEND"); wtdd_obj.xml_par_local.append(wtdd_obj.xml_node_local);
						wtdd_obj.xml_node_local = $(XML("telnum")); wtdd_obj.xml_node_local.text(numK); wtdd_obj.xml_par_local.append(wtdd_obj.xml_node_local);
						wtdd_obj.xml_node_local = $(XML("content")); wtdd_obj.xml_node_local.text("TEST"); wtdd_obj.xml_par_local.append(wtdd_obj.xml_node_local);
						test_device_saves.common.phNum = numK;
					}
					else if (data_detail.indexOf(" c") > -1)
					{
						wtdd_obj.xml_node_local = $(XML("act")); wtdd_obj.xml_node_local.text("GSM_VIG_SEND"); wtdd_obj.xml_par_local.append(wtdd_obj.xml_node_local);
						wtdd_obj.xml_node_local = $(XML("vig_id")); wtdd_obj.xml_node_local.text(widget_obj.extra); wtdd_obj.xml_par_local.append(wtdd_obj.xml_node_local);
						wtdd_obj.xml_node_local = $(XML("telnum")); wtdd_obj.xml_node_local.text(numK); wtdd_obj.xml_par_local.append(wtdd_obj.xml_node_local);
						//test_device_saves.common.digitale = numK; //memorizzazione del numero disabilitata
					}
					else if (data_detail.indexOf(" d") > -1)
					{
						wtdd_obj.xml_node_local = $(XML("act")); wtdd_obj.xml_node_local.text("GSM_VIG_SEND"); wtdd_obj.xml_par_local.append(wtdd_obj.xml_node_local);
						wtdd_obj.xml_node_local = $(XML("vig_id")); wtdd_obj.xml_node_local.text(widget_obj.extra); wtdd_obj.xml_par_local.append(wtdd_obj.xml_node_local);
						wtdd_obj.xml_node_local = $(XML("telnum")); wtdd_obj.xml_node_local.text(numK); wtdd_obj.xml_par_local.append(wtdd_obj.xml_node_local);
						//test_device_saves.common.digitale = numK;
					}
					/*else if (data_detail.indexOf(" d") > -1)
					{
						numK_ip = numK.split(":")[0];
						numK_port = numK.split(":")[1];
						//_FT_ VALIDATORE TODO
						wtdd_obj.xml_node_local = $(XML("act")); wtdd_obj.xml_node_local.text("GSM_VIG_SIA_SEND"); wtdd_obj.xml_par_local.append(wtdd_obj.xml_node_local);
						wtdd_obj.xml_node_local = $(XML("ip")); wtdd_obj.xml_node_local.text(numK_ip); wtdd_obj.xml_par_local.append(wtdd_obj.xml_node_local);
						wtdd_obj.xml_node_local = $(XML("port")); wtdd_obj.xml_node_local.text(numK_port); wtdd_obj.xml_par_local.append(wtdd_obj.xml_node_local);
						test_device_saves.gsm.sia = numK;
					}*/
					//
					xml_send(wtdd_obj.xml_request_local);
				}
				else if (data_origin == "test_device_pstn")
				{
					if (data_detail.indexOf(" a") > -1)
					{
						wtdd_obj.xml_node_local = $(XML("act")); wtdd_obj.xml_node_local.text("PSTN_VOX_SEND"); wtdd_obj.xml_par_local.append(wtdd_obj.xml_node_local);
						wtdd_obj.xml_node_local = $(XML("telnum")); wtdd_obj.xml_node_local.text(numK); wtdd_obj.xml_par_local.append(wtdd_obj.xml_node_local);
						test_device_saves.common.phNum = numK;
					}
					else if (data_detail.indexOf(" b") > -1)
					{
						wtdd_obj.xml_node_local = $(XML("act")); wtdd_obj.xml_node_local.text("PSTN_VIG_SEND"); wtdd_obj.xml_par_local.append(wtdd_obj.xml_node_local);
						wtdd_obj.xml_node_local = $(XML("vig_id")); wtdd_obj.xml_node_local.text(widget_obj.extra); wtdd_obj.xml_par_local.append(wtdd_obj.xml_node_local);
						wtdd_obj.xml_node_local = $(XML("telnum")); wtdd_obj.xml_node_local.text(numK); wtdd_obj.xml_par_local.append(wtdd_obj.xml_node_local);
						//test_device_saves.common.digitale = numK;
					}
					else if (data_detail.indexOf(" c") > -1)
					{
						wtdd_obj.xml_node_local = $(XML("act")); wtdd_obj.xml_node_local.text("PSTN_VIG_SEND"); wtdd_obj.xml_par_local.append(wtdd_obj.xml_node_local);
						wtdd_obj.xml_node_local = $(XML("vig_id")); wtdd_obj.xml_node_local.text(widget_obj.extra); wtdd_obj.xml_par_local.append(wtdd_obj.xml_node_local);
						wtdd_obj.xml_node_local = $(XML("telnum")); wtdd_obj.xml_node_local.text(numK); wtdd_obj.xml_par_local.append(wtdd_obj.xml_node_local);
						//test_device_saves.common.digitale = numK;
					}
					//
					xml_send(wtdd_obj.xml_request_local);
				}
			}
		});
		//
		$(".widget_keypad .keys .key.digit .active_click").click(function()
		{
			if (!$(this).parent().hasClass("disabled"))
			{
				if ($(".widget_keypad .container_num").text().length < num_max_len)
					$(".widget_keypad .container_num").append($(this).siblings(".num").text());
			}
		});
		$("#num_cancel .active_click").click(function()
		{
			if (!$(this).parent().hasClass("disabled"))
			{
				var numK = $(".widget_keypad .container_num");
				numK.text(numK.text().slice(0, numK.text().length-1));
			}
		});
		$("#num_cancel .active_click, .widget_keypad .keys .key.digit .active_click").click(function()
		{
			if (!$(this).parent().hasClass("disabled"))
			{
				widget_obj.info_label("BEGIN", data_origin, data_detail);
			}
		});
	},
	onrecv_confirmation: function(conf)
	{
		//
	},
	onrecv_indication: function(indi)
	{
		if (indi.attr("type") == "MENU")
		{
			if (indi.children("page").text() == WS_TEST_STR)
			{
				if (indi.children("act").text() == "OK")
				{
					this.okey_toggle("ON");
				}
				else if (indi.children("act").text() == "KO")
				{
					this.okey_toggle("ON");
				}
				this.info_label(indi.children("act").text());
			}
		}
	},
	onclose: function()
	{
		//
	},
	//
	name: "widget_keypad",
	title: $(".widget_keypad").attr("data-title"),
	extra: $(".widget_keypad").attr("data-extra"),
	//
	okey_toggle: function(onoff)
	{
		if (onoff == "ON")
		{
			$(".widget_keypad .keys .key")
				.removeClass("disabled")
				.children("p, .inner").css("opacity", "1");
		}
		else if (onoff == "OFF")
		{
			$(".widget_keypad .keys .key")
				.addClass("disabled")
				.children("p, .inner").css("opacity", "0.4");
		}
	},
	info_label: function(okko, data_origin, data_detail)
	{
		data_origin = data_origin || $(".widget_keypad").attr("data-origin");
		data_detail = data_detail || $(".widget_keypad").attr("data-detail");
		var st_okko = $(".widget_keypad .kbd_value .info_num").attr("data-st");
		//
		if (st_okko != okko)
		{
			$(".widget_keypad .kbd_value .info_num").attr("data-st", okko);
			//
			if (okko == "INPROGRESS")
			{
				$(".widget_keypad .kbd_value .info_num").html("{LANG_KEYPAD_INFO_INCORSO}");
			}
			else if (okko == "BEGIN")
			{
				if (data_origin == "test_device_gsm")
				{
					if (data_detail.indexOf(" e") > -1 || data_detail.indexOf(" f") > -1)
					{
						$(".widget_keypad .kbd_value .info_num").html("{LANG_KEYPAD_INFO_IP}");
					}
					else
					{
						$(".widget_keypad .kbd_value .info_num").html("{LANG_KEYPAD_INFO_TEL}");
					}
				}
				else if (data_origin == "test_device_pstn")	
				{
					$(".widget_keypad .kbd_value .info_num").html("{LANG_KEYPAD_INFO_TEL}");
				}
			}
			else if (okko == "OK")
			{
				$(".widget_keypad .kbd_value .info_num").html("{LANG_KEYPAD_INFO_OK}");
			}
			else if (okko == "KO")
			{
				$(".widget_keypad .kbd_value .info_num").html("{LANG_KEYPAD_INFO_KO}");
			}
		}
	},
	//
	clean_page: function()
	{
		xml_request = xml_request_head_build("MENU");
		xml_par = $(XML("act")); xml_par.text("EXE"); xml_request.append(xml_par);
		xml_par = $(XML("page")); xml_par.text(WS_TEST_STR); xml_request.append(xml_par);
		xml_par = $(XML("par")); xml_request.append(xml_par);
		xml_node = $(XML("id")); xml_node.text($(".widget_test_device_detail").attr("data-dev-id")); xml_par.append(xml_node);
		xml_node = $(XML("act")); xml_node.text("ABORT"); xml_par.append(xml_node);
		xml_send(xml_request);
		//
		this.okey_toggle("ON");
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
			if ("widget_test_device_detail" in pag_table_new)
			{
				pag_table_new["widget_test_device_detail"].header_home_switch();
				pag_table_new["widget_test_device_detail"].footer_home_switch();
			}
			//
			$(".JSdialog2").hide();
			pag_clear(".JSdialog2");
		});
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