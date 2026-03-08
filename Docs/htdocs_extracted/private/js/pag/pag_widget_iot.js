pag_table_new["widget_iot"] = {
	onload: function()
	{
		dynamic_page_act(this);
		this.header_home_switch();
		//footer_home_switch piazzato nella onrecv_confirmation
		//
		var widget_obj = this;
		//
		//
		load_devices_new(WS_DEV_ALARM_IOT_STR + "|" + WS_DEV_ALARM_THERMOSTAT_STR, null, this);
	},
	onrecv_confirmation: function(conf)
	{
		var widget_obj = this;
		if (conf.attr("type") == "MENU")
		{
			if (conf.children("act").text() == "LOAD")
			{
				if (conf.children("res").text() == "LOADED")
				{
					if (conf.children("page").text() == WS_DEV_STR)
					{
						this.xml_iot = conf;
						conf.find("par item").each(function()
						{
							var idx = $(this).attr("idx");
							var name = $(this).children("name").text();
							var ena = $(this).children("ena").text();
							var maxlength = $(this).children("name").attr("maxlength");
							widget_obj.iot_names[idx] = name;
							widget_obj.iot_ena[idx] = ena;
							$("#e_iot_name" + idx)
								.val(name)
								.attr("maxlength", maxlength)
								.closest(".global_item")
								.data("idx", idx);
							global_switcher_binder(null, "#e_iot_switch" + idx, null, ena);
							//
							//
							var th_address = $(this).children("address").text();
							var lbound = Number($(this).children("address").attr("lbound"));
							var rbound = Number($(this).children("address").attr("rbound"));
							if (th_address)
							{
								widget_obj.therm_address[idx] = th_address;
								//
								$("#eye_addr" + idx).off("click").click(function()
								{
									pag_change(".JSdialog2", "widget_popwarn", "{LANG_THERMO_ADDRESS}", "{LANG_THERMO_ADDRESS_POP_MSG}", "input_hex", "#eye_addr" + idx, widget_obj.therm_address[idx]);
								}).off("on_pw_ok").on("on_pw_ok", function()
								{
									var addr = $("#popwarn_input").val();
									var regex = /^[0-9A-Fa-f]{2}$/;
									if
									(
										(
											regex.test(addr)
											&& parseInt(addr, 16) >= lbound
											&& parseInt(addr, 16) <= rbound
										)
										|| 
										(
											$(this).siblings(".switcher").attr("data-checked") == 0
											&& parseInt(addr, 16) == 0
										)
									)
									{
										$("#popwarn_input").removeClass("fault");
										widget_obj.therm_address[idx] = $("#popwarn_input").val();
										pag_clear(".JSdialog2");
									}
									else
									{
										$("#popwarn_input").addClass("fault");
									}
								});
							}
						});
						//
						this.footer_home_switch();
					}
				}
			}
			else if (conf.children("act").text() == "SAVE")
			{
				if (conf.children("res").text() == "SAVED")
				{
					if (conf.children("page").text() == WS_DEV_STR)
					{
						$("#footer_h2_a_a").trigger("iot_saved");
					}
				}
				else if (conf.children("res").text() == "ERROR")
				{
					tyu("errore SOM sul salvataggio IOT");
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
		file_conf_request();
	},
	//
	name: "widget_iot",
	title: "{LANG_IOT_DEV}",
	xml_any_arr: [],
	xml_iot: null,
	iot_names: {}, // memorizza i nomi IOT caricati per vedere se sono cambiati prima di salvarli
	iot_ena: {}, // memorizza gli stati di abilitazione degli IOT caricati per vedere se sono cambiati prima di salvarli
	therm_address: {},
	//
	par_save: function()
	{
		var widget_obj = this;
		//
		ena_save = true;
		//
		this.xml_any_arr = [];
		//
		for (var idx in this.iot_names)
		{
			var alreadyOnSaveFlg = false;
			//
			var guiIotN = $("#e_iot_name" + idx);
			var nuovoValoreN = guiIotN.val();
			var guiIotE = $("#e_iot_switch" + idx);
			var nuovoValoreE = guiIotE.attr("data-checked");
			//
			var tosave = this.xml_iot.find("par item[idx='" + idx + "']").clone();
			//
			guiIotN.removeClass("fault");
			if (nuovoValoreN.trim().length == 0 && nuovoValoreE == "1")
			{
				ena_save = false;
				guiIotN.addClass("fault");
			}
			else if (nuovoValoreN == this.iot_names[idx])
			{
				//
			}
			else
			{
				alreadyOnSaveFlg = true;
				//
				tosave.children("name").text(nuovoValoreN);
			}
			//
			if (nuovoValoreE == this.iot_ena[idx])
			{
				//
			}
			else
			{
				alreadyOnSaveFlg = true;
				//
				tosave.children("ena").text(nuovoValoreE);
			}
			//
			if (this.therm_address[idx])
			{
				if (this.therm_address[idx] == tosave.children("address").text())
				{
					//
				}
				else
				{
					alreadyOnSaveFlg = true;
					//
					tosave.children("address").text(this.therm_address[idx]);
				}
			}
			//
			if (alreadyOnSaveFlg)
			{
				this.xml_any_arr.push(tosave);
			}
		}
		//
		if (this.xml_any_arr.length == 0 && ena_save)
		{
			ena_save = false;
			$("#header-home-page2 .close").trigger("click");
		}
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			pag_change("#seeking-page .quadrant_abcd", "widget_devices_areas");
			//file_conf_request();
		});
		//
		$("#backTitle").html("{LANG_AREA_DEVICE_SETUP}");
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
			var trovato = false;
			for (var key in widget_obj.therm_address)
			{
				if 
				(
					(widget_obj.therm_address[key] == "00" || widget_obj.therm_address[key] == "0")
					&& $("#e_iot_switch" + key).attr("data-checked") == "1"
				)
					trovato = true;
				else if (widget_obj.therm_address[key] == "0")
					widget_obj.therm_address[key] = "00";
			}
			if (trovato)
				pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_THERMO_ADDRESS_POP_WARN}", "ok");
			else
				global_send_dev_mod_save(widget_obj, null, null, WS_DEV_STR);
		});
		$("#footer_h2_a_a").on("iot_saved", function()
		{
			$("#header-home-page2 .close").trigger("click");
		});
		//
		//
		footer_button_rotate();
		scrollList(this);
	}
};