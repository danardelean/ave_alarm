pag_table_new["widget_login_small"] = {
	onload: function()
	{
		var widget_obj = this;
		//
		if (session_u_p == null || this.destination == "scenery_edit")
		{
			this.header_home_switch();
			this.footer_home_switch();
			//
			away_from_home();
		}
		//
		login_count = 60;
		pin = "";
		var tmp_str = login_permission_str_get(this.destination);
		if (tmp_str == "USER")
			tmp_str = "{LANG_INS_PIN_USER}";
		else if (tmp_str == "POWERUSER")
			tmp_str = "{LANG_INS_PIN_POWUSER}"
		else if (tmp_str == "INST")
			tmp_str = "{LANG_INS_PIN_INST}"
		else if (tmp_str == "USER|POWERUSER")
			tmp_str = "{LANG_INS_PIN_USER_POWUSER}"
		else if (tmp_str == "POWERUSER|INST")
			tmp_str = "{LANG_INS_PIN_POWUSER_INST}"
		else if (tmp_str == "USER|POWERUSER|INST")
			tmp_str = "{LANG_INS_PIN_USER_POWUSER_INST}"
		$("#login_label").html(tmp_str);
		//
		var debounce = false;
		$("#login_send .active_click").click(function()
		{
			if (!debounce && !inhibit)
			{
				debounce = true;
				setTimeout(function(){debounce = false;}, 2000);
				send_login(widget_obj.destination, $(".widget_login_small").attr("data-par")); /****SEND LOGIN****/
			}
		});
		//
		$(".widget_login_small .keys .key.digit .num").each(function()
		{
			$(this).siblings(".active_click").data("digit", $(this).text());
		});
		pointGuiList = $(".widget_login_small .pin .point_container div");
		$(".widget_login_small .pin .point_container div:nth-child(n + " + (PINTRENSIZE + 1) + ")").hide();
		$(".widget_login_small .keys .key.digit .active_click").click(function()
		{
			if (pin.length < PINTRENSIZE)
			{
				pointGuiList.eq(pin.length).addClass("bg_clear");
				pin += $(this).data("digit");
			}
		});
		$("#pin_cancel .active_click").click(function()
		{
			if (pin.length > 0)
			{
				pin = pin.slice(0, pin.length - 1);
				pointGuiList.eq(pin.length).removeClass("bg_clear");
			}
		});
		//
		var risoluzione = (QT ? 5 : 1);
		function decrease_counter()
		{
			if (login_count > 0)
			{
				$("#login_counter").text("(" + login_count + ")");
				login_count -= risoluzione;				
				login_dec_tout = setTimeout(decrease_counter, risoluzione * 1000);
			}
			else
			{
				$("#login_counter").text("");
				//
				//pag_clear(".home .JSdialog");
				$("#header-home-page2 .close").trigger("click");
			}
		}
		//
		saveUrlLevel(0);
		//
		clearTimeout(login_dec_tout);
		if (inhibit)
		{
			this.inhibit_mode(inhibit_time);
		}
		else
		{
			if (!HASH_MODE)
				decrease_counter();
			if (attempt_left != -1)
				$("#login_attempt").html("{LANG_ATTEMPT_LEFT} " + attempt_left).show();
		}
if (SIMUL && !TMP)
	;//session_u_p = "12345";
		if (session_u_p == null || this.destination == "scenery_edit")
		{
			$(".home .JSdialog").show();
		}
		else
		{
			pin = session_u_p;
			send_login(this.destination, $(".widget_login_small").attr("data-par")); /****SEND LOGIN****/
		}
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "MENU")
		{
			if (conf.children("act").text() == "LOGIN")
			{
				if (conf.children("page").text() == "USER")
				{
					if (conf.children("res").text() == "ACCEPTING")
					{
						//
					}
				}
			}
		}
		else if (conf.attr("type") == "SCENE_CMD")
		{
			pag_clear(".home .JSdialog");
		}
	},
	onrecv_indication: function(indi)
	{
		if (indi.attr("type") == "MENU")
		{
			if (indi.children("act").text() == "LOGIN")
			{
				if (indi.children("page").text() == "USER")
				{
					if ((indi.children("res").text() == "ACCEPTED") || (indi.children("res").text() == "NOTIFY"))
					{
						attempt_left = -1;
						//
						if (!QT && !imq_get())
							session_u_p = pin;
						//
						role_str = indi.find("par item role").text();
						uname_str = indi.find("par item name").text();
						//
//						if (loginType.indexOf("SETTINGS") > -1)
//							pag_table_new["widget_leaf_home"].lock_all();
						//
						if (this.destination == "home")
						{
							xml_request = xml_request_head_build("SCENE_CMD");
							xml_par = $(XML("Command")); xml_par.text("START"); xml_request.append(xml_par);
							xml_par = $(XML("Scene")); xml_par.text($(".widget_login_small").attr("data-par")); xml_request.append(xml_par);
							xml_par = $(XML("coerc")); xml_par.text(indi.children("par").children("item[id='1']").children("coerc").text()); xml_request.append(xml_par);
							xml_send(xml_request);
							pag_clear(".home .JSdialog");
						}
						else if (this.destination == "settings")
						{
							imq_set(indi.find("par item imq").text());
							u_p = pin;
							if (!imq_get())
								pag_change("#settings-page .quadrant_abcd", "widget_settings_utilities");
							else
								pag_change("#settings-page .quadrant_abcd", "nav_settings_access");
						}
						else if (this.destination == "settings inst")
						{
							u_p = pin;
							imq_set(indi.find("par item imq").text());
							pag_change("#settings-page .quadrant_abcd", "widget_settings_utilities");
						}
						else if (this.destination == "settings generic")
						{
							u_p = pin;
							imq_set(indi.find("par item imq").text());
							pag_change("#seeking-page .quadrant_abcd", "nav_settings_generic");
						}
						else if (this.destination == "zone_select")
						{
							u_p = pin;
							this.checkpoint_user = true;
							//
							if ((anoms_obj.getSize() > 0) && !(anoms_obj.isWarning()))
								pag_change(".home .JSdialog", "widget_sideanom", indi.find("par item area_ins").text(), indi.find("par item area_dis").text(), indi.find("par item area_grp").text());
							else
								pag_change(".JSdialog", "widget_zone_select_vert", indi.find("par item area_ins").text(), indi.find("par item area_dis").text(), indi.find("par item area_grp").text());
						}
						else if (this.destination == "par_comm")
						{
							u_p = pin;
							//
							pag_change("#settings-page .quadrant_abcd", "nav_communication");
						}
						else if (this.destination == "par_cloud")
						{
							u_p = pin;
							//
							pag_change("#settings-page .quadrant_abcd", "widget_cloud");
						}
						else if (this.destination == "mod_user")
						{
							u_p = pin;
							//
							pag_change("#settings-page .quadrant_abcd", "widget_add_other_users");
						}
						else if (this.destination == "mod_test")
						{
							u_p = pin;
							//
							pag_change("#settings-page .quadrant_abcd", "widget_test_device");
						}
						else if (this.destination == "mod_log")
						{
							u_p = pin;
							//
							pag_change("#settings-page .quadrant_abcd", "widget_log");
						}
						else if (this.destination == "login_tvcc")
						{
							u_p = pin;
							//
							pag_change("#settings-page .quadrant_abcd", "widget_tvcc");
						}
						else if (this.destination == "scenery")
						{
							u_p = pin;
							//
							pag_change("#settings-page .quadrant_abcd.abcd", "widget_scenery_list");
						}
						else if (this.destination == "scenery_edit")
						{
							u_p = pin;
							//
							pag_clear("#settings-page .quadrant_abcd.abcd"); //EXEC PRIMA
							pag_change("#seeking-page .quadrant_abcd.abcd", "widget_scenery_list", "edit", "shortcut");
						}
						clearTimeout(login_dec_tout);
					}
					else if (indi.children("res").text() == "PENDING" && !imq_get())
					{
						attempt_left = -1;
						//
						if (!QT && !imq_get())
							session_u_p = pin;
						//
						u_p = pin;
						role_str = indi.find("par item role").text();
						uname_str = indi.find("par item name").text();
						//
						if (role_str == "USER" || role_str == "POWERUSER")
						{
							$("#login_send .active_click")
							.off("on_pw_ok").on("on_pw_ok", function()
							{
								pag_change(".JSdialog2", "widget_zone_select_vert", indi.find("par item area_ins").text(), indi.find("par item area_dis").text(), indi.find("par item area_grp").text());
								//
								$("#login_send .active_click").off("on_pw_ok").off("on_pw_ab");
							})
							.off("on_pw_ab").on("on_pw_ab", function()
							{
								$("#header-home-page2 .close").trigger("click");
								//
								$("#login_send .active_click").off("on_pw_ok").off("on_pw_ab");
							});
							//
							pag_change(".JSdialog2", "widget_popwarn", "{LANG_WARNING}", "{LANG_MENU_ACCESS_CODE_GRANTED}", "new_okab_act", "#login_send .active_click", null, "{LANG_ABORT}" + "|" + "{LANG_GO}");
						}
						else
						{
							pin = "";
							role_str = "NOROLE";
							uname_str = "";
							if (!QT)
								session_u_p = null;
							//
							$("#header-home-page2 .close").trigger("click");
							pag_change(".JSdialog2", "widget_popwarn", "{LANG_WARNING}", "{LANG_MENU_ACCESS_CODE_GRANTED_INST}", "new_ok", null, null, null);
						}
						//
						stopWaitingScr();
						//
						clearTimeout(login_dec_tout);
					}
					else if (indi.children("res").text() == "REFUSED")
					{
						$("#login_attempt").html("{LANG_ATTEMPT_LEFT} " + indi.children("desc").text()).show();
						//
						pin = "";
						role_str = "NOROLE";
						uname_str = "";
						if (!QT)
							session_u_p = null;
						$(".widget_login_small .pin .point_container div").removeClass("bg_clear");
						//
						stopWaitingScr();
					}
					else if (indi.children("res").text() == "REFUSED_TSLOT")
					{
						$("#header-home-page2 .close").trigger("click");
						pag_change(".JSdialog2", "widget_popwarn", "{LANG_WARNING}", "{LANG_USER_TSLOT_NOTALLOWED}", "ok", null, null, null);
					}
					else if (indi.children("res").text() == "INHIBITED")
					{
						stopWaitingScr();
						//
						/*if (inhibit)
						{
							this.update_inhibit_time(inhibit_time);
						}
						else
						{*/
						this.inhibit_mode(indi.children("desc").text());
						/*	$("#login_counter").text("");
							clearTimeout(login_dec_tout);
							//$("#login_send .active_click").unbind();
							this.update_inhibit_time(indi.children("desc").text());
							clearTimeout(login_tout);
							login_tout = setTimeout(function()
							{
								//pag_clear(".home .JSdialog");
								$("#header-home-page2 .close").trigger("click");
							}, 5000);*/
						//}
					}
					/*else if (indi.children("res").text() == "NOTIFY")
					{
						clearTimeout(login_dec_tout);
						this.checkpoint_user = false;
						u_p = pin;
						pag_clear(".home .JSdialog");
					}*/
					else if (indi.children("res").text() == "FLUSHED")
					{
						// LOGIN: FLUSHED
					}
					session_st_refresh();
				}
			}
		}
	},
	onclose: function()
	{
		login_count = 0;
		pin = "";
		if (!this.checkpoint_user)
		{
			footer_act("#footer-home-page");
			//
			$(".home .JSdialog").hide();
		}
		this.checkpoint_user = false;
		$("#home .JSdialog").off("on_pw_ok");
	},
	//
	name: "widget_login_small",
	title: "{LANG_LOGIN_AUTH}",
	xml_any: xml_any_tbl[any_ind],
	checkpoint_user: false,
	s4: false, //patch sulla cancellazione dell'allarme dalla schermata stdby _FT_
	destination: $(".widget_login_small").attr("data-pag-dest"),
	inhibit_mode_func_trigger_flg: false,
	//
	clean_page: function()
	{
		if (!inhibit && imq_get() && !this.inhibit_mode_func_trigger_flg)
		{
			send_login("code_miss", null);
		}
		this.inhibit_mode_func_trigger_flg = false;
		//
		$("#header-home-page2 .close").off("click");
	},
	update_inhibit_time: function(sec)
	{
		if (sec == 1)
		{
			$("#login_attempt").html("{LANG_WAIT} " + sec + " {LANG_SEC}").show();
		}
		else
		{
			$("#login_attempt").html("{LANG_WAIT} " + sec + " {LANG_SECS}").show();
		}
	},
	inhibit_mode: function(inhibit_time_par)
	{
		var widget_obj = this;
		//
		$("#login_counter").text("");
		clearTimeout(login_dec_tout);
		//$("#login_send .active_click").unbind();
		this.update_inhibit_time(Number(inhibit_time_par));
		clearTimeout(login_tout);
		if (!HASH_MODE)
		{	
			login_tout = setTimeout(function()
			{
				//pag_clear(".home .JSdialog");
				widget_obj.inhibit_mode_func_trigger_flg = true;
				$("#header-home-page2 .close").trigger("click");
			}, 5 * 1000);
		}
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			if (widget_obj.destination == "scenery_edit")
			{
				widget_obj.clean_page();
				//
				clearTimeout(login_tout);
				clearTimeout(login_dec_tout);
				pag_clear(".home .JSdialog, .home .JSdialog2");
				$(".home .JSdialog, .home .JSdialog2").hide();
				//
				pag_table_new["widget_scenery_list"].header_home_switch();
				pag_table_new["widget_scenery_list"].footer_home_switch();
			}
			else
			{
				header_home_group(widget_obj);
			}
		});
		//
		if (widget_obj.destination == "scenery_edit")
			$("#backTitle").html("{LANG_SCENERY}");
		else
			$("#backTitle").html("{LANG_HOME}");
	},
	footer_home_switch: function()
	{
		var widget_obj = this;
		footer_home_switch_init();
		//
		footer_button_rotate();
		scrollList(this);
	}
};