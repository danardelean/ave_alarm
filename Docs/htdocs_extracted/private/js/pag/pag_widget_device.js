pag_table_new["widget_device"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		//
		//
		storing = false;
		//
		var data_info = $(".widget_device").attr("data-info");
		//
		if (data_info == "exist")
		{
			$("#footer_h2_a_a").off("click").children(".foot_button").addClass("disabled");
			this.update_device_widget(xml_any_nobind);
			pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_WIZARD_DEVICE_STORING_EXIST}", "ok");
		}
		else if (data_info == "toomany")
		{
			$("#footer_h2_a_a").off("click").children(".foot_button").addClass("disabled");
			this.update_device_widget(xml_any_nobind);
			pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_WIZARD_DEVICE_STORING_TOOMANY}", "ok");
		}
		else if (data_info == "nowifi")
		{
			$("#footer_h2_a_a").off("click").children(".foot_button").addClass("disabled");
			this.update_device_widget(xml_any_nobind);
			pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_WIZARD_DEVICE_STORING_NOWIFI}", "ok");
		}
		else
		{
			this.xml_any = xml_any_bind;
			this.update_device_widget(this.xml_any);
		}
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "PNP")
		{
			if (conf.children("act").text() == "STORE")
			{
				if (conf.children("res").text() == "STORING")
				{
					$("#footer_h2_a_a").off("click").children(".foot_button").addClass("disabled");
					//
					startWaitingScr();
				}
				else
				{
					tyu("STORING ERROR");
					//
					stopWaitingScr();
				}
			}
		}
	},
	onrecv_indication: function(indi)
	{
		if (indi.attr("type") == "PNP")
		{
			if (indi.children("act").text() == "STORE")
			{
				if (indi.children("res").text() == "STORED")
				{
					any_ind = xml_any_tbl.length;
					indi.find("par item").each(function(index)
					{
						xml_any_tbl[any_ind+index] = $(this);
					});
					//
					stopWaitingScr();
					$(".footer_container_btn_inside").trigger("_binder");
				}
				else if (indi.children("res").text() == "ABORTED")
				{
					stopWaitingScr();
					storing = false;
					pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_WIZARD_DEVICE_STORING_ABORTED}", "ok");
				}
				else if (indi.children("res").text() == "ERROR")
				{
					stopWaitingScr();
					storing = false;
					pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_WIZARD_DEVICE_STORING_FAILED}", "ok");
				}
			}
			else if (indi.children("act").text() == "DETECTION")
			{
				xml_any_nobind = null;
				//
				if (indi.children("res").text() == "DETECTED")
				{
					xml_any_bind = indi.find("par item").first();
					//
					here_context = $("." + this.name).parent();
					pag_change("HERE", "widget_device");
				}
				else if (indi.children("res").text() == "EMPTY")
				{
					device_pair_auto_mode_flg = false;
					//
					this.abort_detection();
					here_context = $("." + this.name).parent();
					pag_change("HERE", "widget_devices_add");
				}
			}
		}
	},
	onclose: function()
	{
		//
	},
	//
	name: "widget_device",
	title: "{LANG_WIZARD_DEVICE_TITLE}",
	xml_any: null,
	//
	abort_detection: function()
	{
		xml_request = xml_request_head_build("PNP");
		xml_par = $(XML("act")); xml_par.text("ABORT"); xml_request.append(xml_par);	
		xml_send(xml_request);
	},
	clean_page: function()
	{
		this.abort_detection();
	},
	send_storing: function()
	{
		xml_request = xml_request_head_build("PNP", "widget_device");
		xml_par = $(XML("act")); xml_par.text("STORE"); xml_request.append(xml_par);
		xml_par = $(XML("par")); xml_request.append(xml_par);
		xml_par.append(this.xml_any);
		xml_send(xml_request);
	},
	update_device_widget: function(device)
	{
		var subcat = device.find("subcategory").text();
		var widget_device_type_str = xml_file_configuration
			.find("Categories")
			.find("Category[id='"+device.find("category").text()+"']")
			.find("Subcategories").find("Subcategory[id='" + subcat + "']")
			.attr("name");
		var device_icon = subcat + "-" + device.find("model").text() + ".png";
		var lang_str = device.children("info").text();
		//
		$("#device_item_desc_info p").html(lang_str);
		//
		$("#device_item_number .item_value").text(device.find("prg").text());
		$("#device_item_type .item_value").text(widget_device_type_str);
		//
		if
		(
			subcat == WS_DEV_ALARM_BUS_SENRF_STR
//			|| subcat == WS_DEV_ALARM_BUS_REM_STR
			|| subcat == WS_DEV_ALARM_BUS_CONT_STR
		)
		{
			$("#device_item_code .item_value").text("");
		}
		else
		{
			$("#device_item_img").attr("style", "background:url({TMPL_DIR}res/" + device_icon + ") no-repeat center center");
			$("#device_item_code .item_value").text(device.find("model").text());
		}
	},
	//
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		if (device_pair_auto_mode_flg)
		{
			$("#header-home-page2 .close").off("click").addClass("disabled");
		}
		else
		{
			$("#header-home-page2 .close").off("click").click(function()
			{
				if (!storing)
				{
					pag_clear(".home .JSdialog");
					pag_change("#seeking-page .quadrant_abcd.abcd", "widget_device_wireless");
				}
			});
		}
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
			if (!storing)
			{
				storing = true;
				widget_obj.send_storing();
			}
		}).on("_binder", function()
		{
			if (xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_RFID_STR)
				pag_change("#seeking-page .quadrant_abcd.abcd", "widget_set_device_rfid");
			else if (xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_SEN_MAG_STR)
				pag_change("#seeking-page .quadrant_abcd.abcd", "widget_set_device_magdet");
			else if (xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_REM_STR)
				pag_change("#seeking-page .quadrant_abcd.abcd", "widget_set_device_rem");
			else if (xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_KBD_STR)
				pag_change("#seeking-page .quadrant_abcd.abcd", "widget_set_device_kbd");
			else if (xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_SEN_PIR_STR)
				pag_change("#seeking-page .quadrant_abcd.abcd", "widget_set_device_pir");
			else if (xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_SEN_PHOTOPIR_STR)
				pag_change("#seeking-page .quadrant_abcd.abcd", "widget_set_device_pir");
			else if (xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_SEN_DT_STR)
				pag_change("#seeking-page .quadrant_abcd.abcd", "widget_set_device_dt");
			else if (xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_SIR_STR)
				pag_change("#seeking-page .quadrant_abcd.abcd", "widget_set_device_sir");
			else if (xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_SIRI_STR)
				pag_change("#seeking-page .quadrant_abcd.abcd", "widget_set_device_sir");
			else if (xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_SEN_SMO_STR)
				pag_change("#seeking-page .quadrant_abcd.abcd", "widget_set_device_smo");
			else if (xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_SEN_FLO_STR)
				pag_change("#seeking-page .quadrant_abcd.abcd", "widget_set_device_flo");
			else if (xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_SEN_MIC_STR)
				pag_change("#seeking-page .quadrant_abcd.abcd", "widget_set_device_mic");
			else if (xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_RELAY_STR)
				pag_change("#seeking-page .quadrant_abcd.abcd", "widget_set_device_relay");
			else if (xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_SENUNI_STR)
				pag_change("#seeking-page .quadrant_abcd.abcd", "widget_set_device_senuni");
			else if (xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_REPEATER_STR)
				pag_change("#seeking-page .quadrant_abcd.abcd", "widget_set_device_repeater");
			else if (xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_SEN_3T_STR)
				pag_change("#seeking-page .quadrant_abcd.abcd", "widget_set_device_pir");
			else if (xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_SEN_DUALPIR_LR_STR)
				pag_change("#seeking-page .quadrant_abcd.abcd", "widget_set_device_dualpir_lr");
			else if 
			(
				xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_BUS_SENIR_STR
				|| xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_BUS_SENDT_STR
				|| xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_BUS_SMALLPIR_STR
				|| xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_BUS_WINDOWPIR_STR
				|| xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_BUS_SIR_STR
				|| xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_BUS_TRANSPONDER_STR
				|| xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_BUS_RELAY_STR
				|| xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_BUS_TAG_READER_STR
				|| xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_BUS_SENSORI_STR
				|| xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_BUS_CONC_STR
				|| xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_BUS_CONC_RF_STR
				|| xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_BUS_INPUT_STR
				|| xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_BUS_REM_STR
				|| xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_BUS_SENRF_STR
				|| xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_BUS_CONT_STR
				|| xml_any_tbl[any_ind].children("subcategory").text() == WS_DEV_ALARM_BUS_TERMIS_STR
			)
				pag_change("#seeking-page .quadrant_abcd.abcd", "widget_set_device_bus");
			else
				tyu("NO GUI di SET PROGRAMMATA");
		});
		//
		footer_button_rotate();
		scrollList(this);
	}
};