pag_table_new["widget_device_wireless"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		//
		xml_request = xml_request_head_build("PNP", "widget_device_wireless");
		xml_par = $(XML("act")); xml_par.text(bus_pair_flg ? "START_BUS_ONLY" : "START_RF_ONLY"); xml_request.append(xml_par);
		xml_send(xml_request);
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "PNP")
		{
			if (conf.children("act").text() == "START_BUS_ONLY" || conf.children("act").text() == "START_RF_ONLY")
			{
				if (conf.children("res").text() == "ACQUIRING")
				{
					var widget_obj = this;
					function wireless_anim()
					{
						widget_obj.small.finish();
						widget_obj.small.animate({"opacity": widget_obj.opacity_max},
						{
							duration: 600
						});
						setTimeout(function()
						{
							widget_obj.small.animate({"opacity": widget_obj.opacity_min},
							{
								duration: 800
							});
							widget_obj.medium.finish();
							widget_obj.medium.animate({"opacity": widget_obj.opacity_max},
							{
								duration: 600
							});
							setTimeout(function()
							{
								widget_obj.medium.animate({"opacity": widget_obj.opacity_min},
								{
									duration: 800
								});
								widget_obj.big.finish();
								widget_obj.big.animate({"opacity": widget_obj.opacity_max},
								{
									duration: 600
								});
								setTimeout(function()
								{
									widget_obj.big.animate({"opacity": widget_obj.opacity_min},
									{
										duration: 800
									});
								}, 600);
							}, 600);
						}, 600);
						if (pag_table_new["widget_device_wireless"] != undefined)
							t_out_main_secondary = setTimeout(wireless_anim, 2400/*durata incremento opacita' * 4*/);
					}
					//
					$(".point.disabled").removeClass("disabled");
					wireless_anim();
				}
			}
		}
	},
	onrecv_indication: function(indi)
	{
		if (indi.attr("type") == "PNP")
		{
			if (indi.children("act").text() == "DETECTION")
			{
				xml_any_nobind = null;
				//
				if (indi.children("res").text() == "DETECTED")
				{
					xml_any_bind = indi.find("par item").first();
					clearTimeout(t_out_main_secondary);
					//
					here_context = $(".widget_device_wireless").parent();
					pag_change("HERE", "widget_device");
				}
				else if (indi.children("res").text() == "EXISTING")
				{
					xml_any_nobind = indi.find("par item").first();
					clearTimeout(t_out_main_secondary);
					//
					here_context = $(".widget_device_wireless").parent();
					pag_change("HERE", "widget_device", "exist");
				}
				else if (indi.children("res").text() == "TOO_MANY")
				{
					xml_any_nobind = indi.find("par item").first();
					clearTimeout(t_out_main_secondary);
					//
					here_context = $(".widget_device_wireless").parent();
					pag_change("HERE", "widget_device", "toomany");
				}
				else if (indi.children("res").text() == "NO_WIFI")
				{
					xml_any_nobind = indi.find("par item").first();
					clearTimeout(t_out_main_secondary);
					//
					here_context = $(".widget_device_wireless").parent();
					pag_change("HERE", "widget_device", "nowifi");
				}
				else if (indi.children("res").text() == "ERROR")
				{
					tyu("ERRORE PAIR");
				}
			}
			else if (indi.children("act").text() == "ABORT")
			{
				if (indi.children("res").text() == "ABORTED")
				{
					//non raggiunta: quando si preme freccia indietro l'interfaccia cambia schermata senza aspettare la confirmation di abort
					$("#header-home-page2 .close").trigger("click");
				}
			}
			else if (indi.children("act").text() == "START")
			{
				if (indi.children("res").text() == "STARTED")
				{
					//
				}
				else if (indi.children("res").text() == "ERROR")
				{
					$("#header-home-page2 .close").trigger("click");
				}
			}
		}
	},
	onclose: function()
	{
		//
	},
	//
	name: "widget_device_wireless",
	title: bus_pair_flg ? "{LANG_WIZARD_DEVICE_WIRELESS_TITLE}" : "{LANG_WIZARD_DEVICE_WIRELESS_TITLE_R}",
	big: $(".widget_device_wireless .div_wireless_images .big"),
	medium: $(".widget_device_wireless .div_wireless_images .medium"),
	small: $(".widget_device_wireless .div_wireless_images .small"),
	opacity_min: Math.round($(".widget_device_wireless .div_wireless_images .small").css("opacity")*100)/100,
	opacity_max: 0.9,
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
	//
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			clearTimeout(t_out_main_secondary);
			widget_obj.abort_detection();
			pag_change("#seeking-page .quadrant_abcd", bus_pair_flg ? "widget_devices_add_bus" : "widget_devices_add");
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