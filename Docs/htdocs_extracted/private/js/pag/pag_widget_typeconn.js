pag_table_new["widget_typeconn"] = {
	onload: function()
	{
		page_act("#seeking-page");
		schema_act("#seeking-page", "quadrant_abcd");
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		//save_step(WS_WIZARD_STEP_WEB);
		var widget_obj = this;
		//
		parconn.ap_cl_nn = [];
		parconn.saved = false;
		typeconn.mode = null;
		//
		cen_conf_request("WIFI");
		//
		for (var i = 0; i < wifi_dev.length; i++)
		{
			this.xml_any_arr.push(wifi_dev[i].clone());
		}
		this.recover_mode_sec = this.xml_any_arr[0].children("wifi_recover").text();
		$("#typeconn_recover_mode").addClass("unavailable");
		var widget_obj = this;
		setTimeout(function() { widget_obj.recover_refresh(); }, $("#typeconn_recover_mode").hasClass("unavailable") ? 250 : 750);
		//
		if (typeconn.mode == null)
			typeconn.mode = type_conn;
		//
		var loading = true;
		//
		//
		if (typeconn.mode != null)
		{
			global_switcher_binder("#containerTypeconn", "access_point", null, 0, null, true);
			global_switcher_binder("#containerTypeconn", "client", null, 0, null, true);
			global_switcher_binder("#containerTypeconn", "lan", null, 0, null, true);
			//
			$("#containerTypeconn .access_point").off("toggle_tick_click").on("toggle_tick_click", function()
			{
				if ($(this).attr("data-checked") == "1")
				{
					$("#containerTypeconn .switcher:not(.access_point)").trigger("switch_state_changer", [["off", "enabled"], true]);
					$(this).trigger("switch_state_changer", [["disabled"]]);
				}
				else
				{
					$("#containerTypeconn .disable_wifi").trigger("switch_state_changer", [["on"], true]);
				}
				//
				typeconn.mode = "AP";
				//
				if (!loading)
				{
					$("#footer_h2_a_a").hide();
					here_context = $(".widget_typeconn").parent();
					pag_change("HERE", "widget_parconn");
				}
			});
			$("#containerTypeconn .client").off("toggle_tick_click").on("toggle_tick_click", function()
			{
				if ($(this).attr("data-checked") == "1")
				{
					$("#containerTypeconn .switcher:not(.client)").trigger("switch_state_changer", [["off", "enabled"], true]);
					$(this).trigger("switch_state_changer", [["disabled"]]);
				}
				else
				{
					$("#containerTypeconn .disable_wifi").trigger("switch_state_changer", [["on"], true]);
				}
				//
				typeconn.mode = "CL";
				//
				if (!loading)
				{
					$("#footer_h2_a_a").hide();
					here_context = $(".widget_typeconn").parent();
					pag_change("HERE", "widget_parconn");
				}
			});
			$("#containerTypeconn .lan").off("toggle_tick_click").on("toggle_tick_click", function()
			{
				if ($(this).attr("data-checked") == "1")
				{
					$("#containerTypeconn .switcher:not(.lan)").trigger("switch_state_changer", [["off", "enabled"], true]);
					$(this).trigger("switch_state_changer", [["disabled"]]);
				}
				else
				{
					$("#containerTypeconn .disable_wifi").trigger("switch_state_changer", [["on"], true]);
				}
				//
				typeconn.mode = "LN";
				//
				if (!loading)
				{
					$("#footer_h2_a_a").hide();
					here_context = $(".widget_typeconn").parent();
					pag_change("HERE", "widget_parconn");
				}
			});
		}
		//
		global_switcher_binder("#containerTypeconn", "disable_wifi", null, 0);
		$("#containerTypeconn .disable_wifi").off("toggle_tick_click").on("toggle_tick_click", function()
		{
			if ($(this).attr("data-checked") == "1")
			{
				typeconn.mode = "NN";
				$("#containerTypeconn .switcher:not(.disable_wifi)").trigger("switch_state_changer", [["off", "enabled"], true]);
			}
			else
			{
				$(this).trigger("switch_state_changer", [["on"], true]);
			}
		});
		//
		//
		$("#typeconn_access_point, #typeconn_client, #typeconn_disable, #typeconn_lan").off("click").click(function(event) 
		{
			if ($(event.target).closest(".switcher").length > 0)
				return;
			else
				$(".switcher", this).trigger("click");	
		});
		//
		if (typeconn.mode != null)
		{
			if (typeconn.mode == "CL")
			{
				$("#containerTypeconn .client").trigger("click");
			}
			else if (typeconn.mode == "AP")
			{
				$("#containerTypeconn .access_point").trigger("click");
			}
			else if (typeconn.mode == "NN")
			{
				$("#containerTypeconn .disable_wifi").trigger("click");
			}
			else if (typeconn.mode == "LN")
			{
				$("#containerTypeconn .lan").trigger("click");
			}
		}
		else
		{
			$("#containerTypeconn .disable_wifi").trigger("click");
		}
		//
		if (BLK)
		{
			$("#typeconn_disable").addClass("unavailable");
		}
		//
		loading = false;
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
						//
//						if (type_conn == "NN")
//							$("#mywifistatus").hide();
//						else
//							$("#mywifistatus").show();
						//
						$("#footer_h2_a_a").trigger("parconn_saved");
					}
					else if (conf.children("res").text() == "ERROR")
					{
						tyu("Save : Error");
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
	name: "widget_typeconn",
	title: "{LANG_WIZARD_TYPECONN_TITLE}",
	xml_any_arr: [],
	recover_mode_sec: 0,
	//
	par_save: function()
	{
		ena_save = true;
		//
		if 
		(
			typeconn.mode == "CL"
			|| typeconn.mode == "AP"
			|| typeconn.mode == "LN"
		)
		{
			this.xml_any_arr = parconn.ap_cl_nn;
		}
		if (typeconn.mode == "NN")
		{
			this.xml_any_arr[0].children("wifi_mode").text("3");
		}
	},
	init_drawer: function()
	{
		var widget_obj = this;
		draw_footer_button("{LANG_OK}", "footer_h2_a_a");
		//
		$("#footer_h2_a_a").off("click").click(function()
		{
			if (SIL)
			{
				if (typeconn.mode == "NN")
				{
					if (typeconn.mode != type_conn)
						global_send_dev_mod_save(widget_obj);
					else
						$("#header-home-page2 .close").trigger("click");
				}
				else
				{
					$("#header-home-page2 .close").trigger("click");
				}
			}
			else
			{
				if (typeconn.mode == type_conn && !parconn.saved)
				{
					$(this).trigger("parconn_saved");
				}
				else
				{
					global_send_dev_mod_save(widget_obj);
				}
			}
		})
		.off("parconn_saved").on("parconn_saved", function()
		{
			refresh_set_email = true;
			//
			$("#header-home-page2 .close").trigger("click");
		});
	},
	recover_refresh: function()
	{
		if (this.recover_mode_sec > 0 && !$("#typeconn_recover_mode").hasClass("unavailable"))
			this.recover_mode_sec--;
		$("#typeconn_recover_mode_sec").text(this.recover_mode_sec);
		if (this.recover_mode_sec == "0")
		{
			$("#typeconn_recover_mode").addClass("unavailable");
		}
		else
		{
			$("#typeconn_recover_mode").toggleClass("unavailable");
			if ("widget_typeconn" in pag_table_new)
			{
				var widget_obj = this;
				setTimeout(function() { widget_obj.recover_refresh(); }, $("#typeconn_recover_mode").hasClass("unavailable") ? 250 : 750);
			}
		}
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			header_nav_communication_group(widget_obj);
		});
		//
		$("#backTitle").html("{LANG_NAV_HOME_COMMUNICATION}");
	},
	footer_home_switch: function()
	{
		var widget_obj = this;
		footer_home_switch_init();
		//
		widget_obj.init_drawer();
		//
		footer_button_rotate();
		scrollList(this);
	}
};