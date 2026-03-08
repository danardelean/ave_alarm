pag_table_new["widget_parconn"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		//
		var widget_obj = this;
		//
		//
		if (parconn.ap_cl_nn.length == 0)
		{
			for (var i = 0; i < wifi_dev.length; i++)
			{
				this.xml_any_arr.push(wifi_dev[i].clone());
			}
		}
		else
		{
			this.xml_any_arr = parconn.ap_cl_nn;
		}
		//
		if (typeconn.mode == "CL")
		{
			$("#container_ap").remove();
			$("#container_ln").remove();
		}
		else if (typeconn.mode == "AP")
		{
			$("#container_cl").remove();
			$("#container_ln").remove();
		}
		else if (typeconn.mode == "NN")
		{
			$("#container_cl").remove();
			$("#container_ap").remove();
			$("#container_ln").remove();
		}
		else if (typeconn.mode == "LN")
		{
			$("#container_cl").remove();
			$("#container_ap").remove();
		}
		//
		var wifi_region;
		//POPOlando
		if (typeconn.mode == "AP")
		{
			global_item_init("#container_ap", "ap_web_ssid", "input", null, null, null, this.xml_any_arr[1].children("ap_ssid").text(), this.xml_any_arr[1].children("ap_ssid").attr("maxlength"));
			$("#ap_mac").text(this.xml_any_arr[1].children("sn").text());
			this.auth = this.xml_any_arr[1].children("ap_auth").text();
			global_apply_diag("#container_ap", "auth", "{LANG_WIZARD_PARCONN_AUTH}", "auth", null, "widget_parconn");
			$("#container_ap .auth .sl_selector").html(this.associate_auth[this.auth]);
			picker("#container_ap");
			global_item_init("#container_ap", "ap_web_password", "input", null, null, null, this.xml_any_arr[1].children("ap_pass").text(), this.xml_any_arr[1].children("ap_pass").attr("maxlength"));
			if (this.auth === "0")
				$("#ap_web_password").parent().addClass("invisible");
			else
				$("#ap_web_password").parent().removeClass("invisible");
			global_picker_init("#container_ap", "ap_chan", "ap_web_chan", null, null, this.xml_any_arr[1]);
			$("#ap_web_ip").val(this.xml_any_arr[1].children("ap_ip").text());
			$("#ap_web_netmask").val(this.xml_any_arr[1].children("ap_netmask").text());
			$("#ap_phy_prot").text(this.xml_any_arr[1].children("ap_phy_prot").text());
			//
			wifi_region = xml_file_configuration.find("WifiRegions WifiRegion[id='"+this.xml_any_arr[1].children("ap_region").text()+"']");
			$("#container_ap .region_conn .sl_selector").html(wifi_region.attr("desc"));
			$("#container_ap .region_conn").attr("data-value", wifi_region.attr("id"));
			global_apply_diag("#container_ap", "region_conn", "{LANG_WIZARD_REGION_TITLE}", "region_conn", null, "widget_parconn");
			//
			$("#container_ap .pick_ap_web_chan").attr("data-rbound", wifi_region.attr("channels"));
			//
			global_switcher_binder("#container_ap", "ap_dhcp", null, this.xml_any_arr[1].children("ap_dhcp_ena").text());
			$("#container_ap .ap_dhcp").off("toggle_tick_click").on("toggle_tick_click", function()
			{
				if ($(this).attr("data-checked") == "0")
					$("#ap_web_ip_start, #ap_web_ip_end").parent().children().hide();
				else
					$("#ap_web_ip_start, #ap_web_ip_end").parent().children().show();
			}).trigger("toggle_tick_click");
			//
			$("#container_ap #ap_web_ip_start").val(this.xml_any_arr[1].children("ap_dhcp_ini").text());
			$("#container_ap #ap_web_ip_end").val(this.xml_any_arr[1].children("ap_dhcp_end").text());
		}
		else if (typeconn.mode == "CL")
		{
			$("#web_client_ip").val(this.xml_any_arr[2].children("client_ip").text());
			$("#cl_mac").text(this.xml_any_arr[2].children("sn").text());
			$("#web_client_netmask").val(this.xml_any_arr[2].children("client_netmask").text());
			$("#web_client_gateway").val(this.xml_any_arr[2].children("client_gateway").text());
			this.auth = this.xml_any_arr[2].children("client_auth").text();
			global_apply_diag("#container_cl", "auth", "{LANG_WIZARD_PARCONN_AUTH}", "auth", null, "widget_parconn");
			//
			$("#container_cl .auth .sl_selector").html(this.associate_auth[this.auth]);
			this.ssid_name = this.xml_any_arr[2].children("client_ssid").text();
			global_item_init("#container_cl", "web_client_ssid", "paragraph", null, null, null, this.xml_any_arr[2].children("client_ssid").text(), this.xml_any_arr[2].children("client_ssid").attr("maxlength"));
			$("#container_cl .ssid").off("click").click(function() { pag_change(".JSdialog", "widget_wifi_seek"); });
			//
			global_item_init("#container_cl", "web_client_password", "input", null, null, null, this.xml_any_arr[2].children("client_pass").text(), this.xml_any_arr[2].children("client_pass").attr("maxlength"));
			if (this.auth === "0")
				$("#web_client_password").parent().addClass("invisible");
			else
				$("#web_client_password").parent().removeClass("invisible");
			//
			wifi_region = xml_file_configuration.find("WifiRegions WifiRegion[id='"+this.xml_any_arr[2].children("client_region").text()+"']");
			$("#container_cl .region_conn .sl_selector").html(wifi_region.attr("desc"));
			$("#container_cl .region_conn").attr("data-value", wifi_region.attr("id"));
			global_apply_diag("#container_cl", "region_conn", "{LANG_WIZARD_REGION_TITLE}", "region_conn", null, "widget_parconn");
			//
			global_switcher_binder("#container_cl", "cl_dhcp", null, this.xml_any_arr[2].children("client_dhcp_ena").text());
			$("#container_cl .cl_dhcp").off("toggle_tick_click").on("toggle_tick_click", function()
			{
				$("#web_client_ip, #web_client_netmask, #web_client_gateway").prop("disabled", !($(this).attr("data-checked") == "0"));
				applyKeyboard();
			}).trigger("toggle_tick_click");
			//
			$("#cl_phy_prot").text(this.xml_any_arr[2].children("client_phy_prot").text());
			$("#web_dns1").val(this.xml_any_arr[2].children("client_dns_a").text());
			$("#web_dns2").val(this.xml_any_arr[2].children("client_dns_b").text());
			//
			$("#wps_trigger").off("on_pw_ok").on("on_pw_ok", function()
			{
				pag_clear(".JSdialog2");
				pag_change(".JSdialog", "widget_popwarn", "{LANG_WPS_ALERT_TITLE_B}", "{LANG_WPS_ALERT_DESC_B}", "okab", "#wps_trigger1");
			});
			$("#wps_trigger1").off("on_pw_ok").on("on_pw_ok", function()
			{
				xml_request = xml_request_head_build("MENU", "widget_parconn");
				xml_node = $(XML("page")); xml_node.text("SSID"); xml_request.append(xml_node);
				xml_node = $(XML("act")); xml_node.text("WPS_START"); xml_request.append(xml_node);
				xml_par = $(XML("par")); xml_request.append(xml_par);
				xml_node = $(XML("ssid")); xml_node.text(widget_obj.ssid_name); xml_par.append(xml_node);
				xml_node = $(XML("mac_adr")); xml_node.text(widget_obj.mac_adr); xml_par.append(xml_node);
				xml_send(xml_request);
			});
		}
		else if (typeconn.mode == "LN")
		{
			$("#web_lan_ip").val(this.xml_any_arr[3].children("lan_ip").text());
			$("#ln_mac").text(this.xml_any_arr[3].children("sn").text());
			$("#web_lan_netmask").val(this.xml_any_arr[3].children("lan_netmask").text());
			$("#web_lan_gateway").val(this.xml_any_arr[3].children("lan_gateway").text());
			global_switcher_binder("#container_ln", "ln_dhcp", null, this.xml_any_arr[3].children("lan_dhcp_ena").text());
			$("#container_ln .ln_dhcp").off("toggle_tick_click").on("toggle_tick_click", function()
			{
				$("#web_lan_ip, #web_lan_netmask, #web_lan_gateway").prop("disabled", !($(this).attr("data-checked") == "0"));
				applyKeyboard();
			}).trigger("toggle_tick_click");
			//
			$("#web_lan_dns1").val(this.xml_any_arr[3].children("lan_dns_a").text());
			$("#web_lan_dns2").val(this.xml_any_arr[3].children("lan_dns_b").text());
		}
		//
		xml_menu_load_send(WS_DEV_STR, WS_DEV_ALARM_WIFI_STR, null, "widget_parconn");
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "MENU")
		{
			if (conf.children("page").text() == WS_DEV_STR)
			{
				if (conf.children("act").text() == "SAVE")
				{
					if (conf.children("res").text() == "SAVED")
					{
						wifi_dev = this.xml_any_arr;
						type_conn = typeconn.mode;
						$("#footer_h2_a_a").trigger("parconn_saved");
					}
					else if (conf.children("res").text() == "ERROR")
					{
						tyu("Save : Error");
					}
				}
				else if (conf.children("act").text() == "LOAD")
				{
					if (conf.children("res").text() == "LOADED")
					{
						$("#ap_phy_prot").text(conf.find("par item ap_phy_prot").text());
						$("#cl_phy_prot").text(conf.find("par item client_phy_prot").text());
					}
				}
			}
			else if (conf.children("page").text() == "SSID")
			{
				if (conf.children("act").text() == "WPS_START")
				{
					if (conf.children("res").text() == "STARTING")
					{
						startWaitingScr(60);
					}
					else if (conf.children("res").text() == "KO")
					{
						tyu("wps KO");
					}
				}
			}
		}
	},
	onrecv_indication: function(indi)
	{
		if (indi.attr("type") == "MENU")
		{
			if (indi.children("page").text() == "WPS_PAGE")
			{
				if (indi.children("act").text() == "WPS_RESULT")
				{
					if (waiting_status == 1)
					{
						stopWaitingScr();
						//
						if (indi.children("res").text() == "OK")
						{
							var par = indi.find("par");
							//
							$("#web_client_ip").val(indi.find("par").children("client_ip").text());
							$("#web_client_netmask").val(par.children("client_netmask").text());
							$("#web_client_gateway").val(par.children("client_gateway").text());
							this.auth = par.children("client_auth").text();
							//
							$("#container_cl .auth .sl_selector").html(this.associate_auth[this.auth]);
							this.ssid_name = par.children("client_ssid").text();
							//
							$("#container_cl .web_client_password").val(par.children("client_pass").text());
							if (this.auth === "0")
								$("#web_client_password").parent().addClass("invisible");
							else
								$("#web_client_password").parent().removeClass("invisible");
							//
							wifi_region = xml_file_configuration.find("WifiRegions WifiRegion[id='" + par.children("client_region").text() + "']");
							$("#container_cl .region_conn .sl_selector").html(wifi_region.attr("desc"));
							$("#container_cl .region_conn").attr("data-value", wifi_region.attr("id"));
							//
							$("#cl_dhcp").attr("data-checked", (par.children("client_dhcp_ena").text() === "0") ? "1" : "0").trigger("click");
							//
							$("#cl_phy_prot").text(par.children("client_phy_prot").text());
							$("#web_dns1").val(par.children("client_dns_a").text());
							$("#web_dns2").val(par.children("client_dns_b").text());
							//
							pag_change(".JSdialog", "widget_popwarn", "{LANG_WPS_RES_TITLE_OK}", "{LANG_WPS_RES_DESC_OK}", "ok", null);
						}
						else
						{
							pag_change(".JSdialog", "widget_popwarn", "{LANG_WPS_RES_TITLE_KO}", "{LANG_WPS_RES_DESC_KO}", "ok", null);
						}
					}
				}
			}
		}
							
	},
	onclose: function()
	{
		$("#wizard_header_info").text("");
	},
	//
	name: "widget_parconn",
	title: function()
	{
		var res = "{LANG_WIZARD_PARCONN_TITLE}";
		if (typeconn.mode == "AP")
			res = "{LANG_WIZARD_TYPECONN_ACCESS_POINT}";
		else if (typeconn.mode == "CL")
			res = "{LANG_WIZARD_TYPECONN_CLIENT}";
		else if (typeconn.mode == "LN")
			res = "{LANG_WIZARD_TYPECONN_LAN}";
		return res;
	}(),
	xml_any_arr: [],
	auth: null,
	ssid_name: "",
	mac_adr: "",
	associate_auth: ["NONE", "WPA", "WPA2", "WEP"],
	//
	par_save: function()
	{
		ena_save = true;
		//
		if (typeconn.mode == "CL")
		{
			if (this.ssid_name.trim().length == 0) 
			{
				ena_save = false;
				$("#container_cl .ssid").addClass("fault");
			}
			else
			{
				$("#container_cl .ssid").removeClass("fault");
				this.xml_any_arr[2].children("client_ssid").text(this.ssid_name);
			}
			//
			$("#web_client_ip").global_save_item_val({trama_ptr: this.xml_any_arr[2].children("client_ip"), position: 1, check_func: this.check_address});
			$("#web_client_netmask").global_save_item_val({trama_ptr: this.xml_any_arr[2].children("client_netmask"), position: 1, check_func: this.check_address});
			$("#web_client_gateway").global_save_item_val({trama_ptr: this.xml_any_arr[2].children("client_gateway"), position: 1, check_func: this.check_address});
			if (this.auth != "0")
				$("#web_client_password").global_save_item_val({trama_ptr: this.xml_any_arr[2].children("client_pass"), position: 0, check_func: this.check_pass});
			else
				this.xml_any_arr[2].children("client_pass").text("");
			this.xml_any_arr[2].children("client_auth").text(this.auth);
			this.xml_any_arr[2].children("client_region").text($("#container_cl .region_conn").attr("data-value"));
			$("#web_dns1").global_save_item_val({trama_ptr: this.xml_any_arr[2].children("client_dns_a"), position: 1, check_func: this.check_address});
			$("#web_dns2").global_save_item_val({trama_ptr: this.xml_any_arr[2].children("client_dns_b"), position: 1, check_func: this.check_address});
			save_item_toggled("#container_cl", "client_dhcp_ena", "cl_dhcp", this.xml_any_arr[2]);
			this.xml_any_arr[0].children("wifi_mode").text(WIFI_CL);
		}
		else if (typeconn.mode == "AP")
		{
			$("#ap_web_ssid").global_save_item_val({trama_ptr: this.xml_any_arr[1].children("ap_ssid"), position: 0});
			if (this.auth != "0")
				$("#ap_web_password").global_save_item_val({trama_ptr: this.xml_any_arr[1].children("ap_pass"), position: 0, check_func: this.check_pass});
			else
				this.xml_any_arr[1].children("ap_pass").text("");
			this.xml_any_arr[1].children("ap_region").text($("#container_ap .region_conn").attr("data-value"));
			save_item_picker("#container_ap", "ap_chan", "ap_web_chan", this.xml_any_arr[1]);
			this.xml_any_arr[1].children("ap_auth").text(this.auth);
			this.xml_any_arr[1].children("ap_region").text($("#container_ap .region_conn").attr("data-value"));
			$("#ap_web_ip").global_save_item_val({trama_ptr: this.xml_any_arr[1].children("ap_ip"), position: 1, check_func: this.check_address});
			$("#ap_web_netmask").global_save_item_val({trama_ptr: this.xml_any_arr[1].children("ap_netmask"), position: 1, check_func: this.check_address});
			$("#ap_web_ip_start").global_save_item_val({trama_ptr: this.xml_any_arr[1].children("ap_dhcp_ini"), position: 1, check_func: this.check_address_se2, extra: $("#ap_web_ip").val()});
			$("#ap_web_ip_end").global_save_item_val({trama_ptr: this.xml_any_arr[1].children("ap_dhcp_end"), position: 1, check_func: this.check_address_se, extra: $("#ap_web_ip_start").val()});
			save_item_toggled("#container_ap", "ap_dhcp_ena", "ap_dhcp", this.xml_any_arr[1]);
			this.xml_any_arr[0].children("wifi_mode").text(WIFI_AP);
		}
		else if (typeconn.mode == "LN")
		{
			$("#web_lan_ip").global_save_item_val({trama_ptr: this.xml_any_arr[3].children("lan_ip"), position: 1, check_func: this.check_address});
			$("#web_lan_netmask").global_save_item_val({trama_ptr: this.xml_any_arr[3].children("lan_netmask"), position: 1, check_func: this.check_address});
			$("#web_lan_gateway").global_save_item_val({trama_ptr: this.xml_any_arr[3].children("lan_gateway"), position: 1, check_func: this.check_address});
			save_item_toggled("#container_ln", "lan_dhcp_ena", "ln_dhcp", this.xml_any_arr[3]);
			$("#web_lan_dns1").global_save_item_val({trama_ptr: this.xml_any_arr[3].children("lan_dns_a"), position: 1, check_func: this.check_address});
			$("#web_lan_dns2").global_save_item_val({trama_ptr: this.xml_any_arr[3].children("lan_dns_b"), position: 1, check_func: this.check_address});
			this.xml_any_arr[0].children("wifi_mode").text(WIFI_LN);
		}
	},
	check_address: function()
	{
		var val_array = $.trim($(this).val()).split(".");
		if (val_array.length != 4)
		{
			return false;
		}
		else
		{
			for (var i = 0; i < val_array.length; i++)
			{
				if (isNaN(val_array[i]))
					return false;
				else if (val_array[i] < 0 || val_array[i] > 255 || val_array[i] == "")
					return false;
			}
		}
		return true;
	},
	check_address_se: function(extra)
	{
		var val_array = $.trim($(this).val()).split(".");
		var val_extra = extra.split(".");
		if (val_array.length != 4)
		{
			return false;
		}
		else
		{
			for (var i = 0; i < val_array.length; i++)
			{
				if (isNaN(val_array[i]))
					return false;
				else if (val_array[i] < 0 || val_array[i] > 255 || val_array[i] == "")
					return false;
			}
			if (val_array[0] != val_extra[0] || val_array[1] != val_extra[1] || val_array[2] != val_extra[2] || val_array[3] <= parseInt(val_extra[3]))
				return false;
		}
		return true;
	},
	check_address_se2: function(extra)
	{
		var val_array = $.trim($(this).val()).split(".");
		var val_extra = $.trim(extra).split(".");
		if (val_array.length != 4)
		{
			return false;
		}
		else
		{
			for (var i = 0; i < val_array.length; i++)
			{
				if (isNaN(val_array[i]))
					return false;
				else if (val_array[i] < 0 || val_array[i] > 255 || val_array[i] == "")
					return false;
			}
			if (val_array[0] != val_extra[0] || val_array[1] != val_extra[1] || val_array[2] != val_extra[2] || val_array[3] <= (parseInt(val_extra[3])+TVCC_QTY))
				return false;
		}
		return true;
	},
	check_pass: function()
	{
		var val_pass = $(this).val();
		if (this.auth == "1" || this.auth == "2")
		{
			if (val_pass.length < 8)
				return false;
		}
		else
		{
			return $.trim($(this).val()) != "";
		}
		return true;
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			pag_change("#seeking-page .quadrant_abcd", "widget_typeconn");
		});
		//
		$("#backTitle").html("{LANG_WIZARD_TYPECONN_TITLE}");
	},
	footer_home_switch: function()
	{
		var widget_obj = this;
		footer_home_switch_init();
		//
		draw_footer_button("{LANG_OK}", "footer_h2_a_a");
		//
		$("#footer_h2_a_a").off("click").click(function()
		{
			if (wizard_flg)
				pag_change(".home .JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_WIFI_RESTART_ALERT}", "okab", "#footer_h2_a_a");
			else
				global_send_dev_mod_save(widget_obj);
		})
		.off("on_pw_ok").on("on_pw_ok", function()
		{
			global_send_dev_mod_save(widget_obj);
		})
		.off("parconn_saved").on("parconn_saved", function()
		{
			refresh_set_email = true;
			header_nav_communication_group(widget_obj);
		});
		//
		footer_button_rotate();
		scrollList(this);
	}
};