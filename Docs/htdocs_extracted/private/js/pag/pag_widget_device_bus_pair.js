pag_table_new["widget_device_bus_pair"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		var widget_obj = this;
		//
		//
		//inizializzazione animazione
		this.incr = Math.ceil(1000 * ((this.opacity_max - this.opacity_min) / this.transition_len))/1000;
		this.gui_elem_jarr.each(function(index)
		{
			$(this).data("queueLen", widget_obj.q_len);
			$(this).css("opacity", widget_obj.opacity_min + (widget_obj.incr * index));
		});
		//
		//
		xml_request = xml_request_head_build("PNP", "widget_device_bus_pair");
		xml_par = $(XML("act")); xml_par.text("START_AUTO"); xml_request.append(xml_par);
		xml_send(xml_request);
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "PNP")
		{
			if (conf.children("act").text() == "START_AUTO")
			{
				if (conf.children("res").text() == "ACQUIRING")
				{
					var widget_obj = this;
					//
					//avvio animazione
					i_bus_pair = setInterval(function()
					{
						widget_obj.gui_elem_jarr.each(function(index)
						{
							$(this).finish();
							//
							if (Number($(this).css("opacity")) > widget_obj.opacity_min)
							{
								$(this).animate({opacity: "-=" + widget_obj.incr},
								{
									duration: widget_obj.t_rate * 1000
								});	
							}
							else if ($(this).data("queueLen") > 0)
							{
								$(this).data("queueLen", $(this).data("queueLen") - 1);
							}
							else
							{
								$(this).data("queueLen", widget_obj.q_len);
								$(this).css("opacity", widget_obj.opacity_max);
							}
						});
						//
						if (!("widget_device_bus_pair" in pag_table_new))
						{
							clearInterval(i_bus_pair);
						}
					}, this.t_rate * 1000);
				}
			}
			else if (conf.children("act").text() == "GET_AUTO")
			{
				if (conf.children("res").text() == "GETTING")
				{
					//
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
				var widget_obj = this;
				xml_any_nobind = null;
				//
				if (indi.children("res").text() == "DETECTED")
				{
					xml_any_bind = indi.find("par item").first();
					clearTimeout(t_out_main_secondary);
					//
					here_context = $("." + this.name).parent();
					pag_change("HERE", "widget_device");
				}
				else if (indi.children("res").text() == "COMPLETED")
				{
					send_get_auto(widget_obj.name);
				}
				else if (indi.children("res").text() == "EXISTING")
				{
					xml_any_nobind = indi.find("par item").first();
					//
					here_context = $(".widget_device_bus_pair").parent();
					pag_change("HERE", "widget_device", "exist");
				}
				else if (indi.children("res").text() == "TOO_MANY")
				{
					$("." + this.name).off("on_pw_ok").on("on_pw_ok", function()
					{
						$("#header-home-page2 .close").trigger("click", [true]);
					});
					clearInterval(i_bus_pair);
					pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_WIZARD_DEVICE_STORING_TOOMANY}", "ok", "." + this.name);
				}
				else if (indi.children("res").text() == "NO_WIFI")
				{
					xml_any_nobind = indi.find("par item").first();
					//
					here_context = $(".widget_device_bus_pair").parent();
					pag_change("HERE", "widget_device", "nowifi");
				}
				else if (indi.children("res").text() == "EMPTY")
				{
					$("." + this.name).off("on_pw_ok").on("on_pw_ok", function()
					{
						$("#header-home-page2 .close").trigger("click", [true]);
					});
					if (this.disable_empty_msg_flg)
					{
						$("." + this.name).trigger("on_pw_ok");
					}
					else
					{
						clearInterval(i_bus_pair);
						pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_EMPTY_BUS_DEVICE}", "ok", "." + this.name);
					}
				}
				else if (indi.children("res").text() == "BIND_ENTRY_FULL")
				{
					$("." + this.name).off("on_pw_ok").on("on_pw_ok", function()
					{
						$("#header-home-page2 .close").trigger("click", [true]);
					});
					clearInterval(i_bus_pair);
					pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_WIZARD_DEVICE_STORING_TOOMANY_BUS}", "ok", "." + this.name);
				}
				else if (indi.children("res").text() == "BIND_STORE_FULL")
				{
					$("." + this.name).off("on_pw_ok").on("on_pw_ok", function()
					{
						widget_obj.disable_empty_msg_flg = true;
						send_get_auto(widget_obj.name);
					});
					pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_WIZARD_DEVICE_STORING_TOOMANY_BUS}", "ok", "." + this.name);
				}
			}
			else if (indi.children("act").text() == "ABORT")
			{
				if (indi.children("res").text() == "ABORTED")
				{
					//non raggiunta: quando si preme freccia indietro l'interfaccia cambia schermata senza aspettare la confirmation di abort
					here_context = $(".widget_device_bus_pair").parent();
					pag_change("HERE", "widget_add_device");
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
					here_context = $(".widget_device_bus_pair").parent();
					pag_change("HERE", "widget_add_device");
				}
			}
		}
	},
	onclose: function()
	{
		//
	},
	//
	name: "widget_device_bus_pair",
	title: "{LANG_WIDGET_DEVICE_BUS_PAIR_TITLE}",
	gui_elem_jarr: $(".widget_device_bus_pair .div_bus_pair_images_container").children(),
	opacity_min: 0.2,
	opacity_max: 1.0,
	incr: null,
	t_rate: 0.1,
	q_len: 6,
	transition_len: 10,
	disable_empty_msg_flg: false,
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
			pag_change("#seeking-page .quadrant_abcd", "widget_devices_add_bus");
		});
		//
		$("#backTitle").html("{LANG_WIZARD_ADD_DEVICE_TITLE}");
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