pag_table_new["widget_leaf_home"] = {
	onload: function()
	{
		if (this.loadButHide_flg) {}
		else
			header_act("#header-home-page");
		//
		var widget_obj = this;
		//
		if (maintenance_flg)
			this.lock_all();
		//
		if (status_area_global != null)
			this.change_icon_area_status(status_area_global);
		//
		this.refresh_notify_icon();
		//
		load_devices(); // prepara i dispositivi per la schermata di test
		//
		//**AREE**//
		$("#menu_on_off").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
			{
				if (!QT && !imq_get()) // No auto login su ON/OFF
				{
					session_u_p = null;
					role_str = "NOROLE";
					uname_str = "";
					session_st_refresh();
				}
				pag_change(".home .JSdialog", "widget_login_small", "zone_select");
			}
		}).off("open_ins_force_popup").on("open_ins_force_popup", function()
		{
			pag_change(".home .JSdialog", "widget_popwarn", "", "{LANG_INS_DOOR_LOCK_FORCE}", "okab", "#menu_on_off");
		}).off("on_pw_ok").on("on_pw_ok", function()
		{
			var cen_id = xml_file_configuration.find("Devices Device")
			.filter(function()
			{
				if ($(this).children("Subcategory").text() == WS_DEV_ALARM_CEN_STR)
					return true;
			}).attr("id");
			//
			xml_request = xml_request_head_build("DEVICE_CMD");
			xml_par = $(XML("Command")); xml_par.text(anoms_obj.command); xml_request.append(xml_par);
			xml_par = $(XML("Device")); xml_par.text(cen_id); xml_request.append(xml_par);
			xml_par = $(XML("Arguments")); xml_request.append(xml_par);
			xml_node = $(XML("Argument")); xml_node.attr("id", "PIN"); xml_node.text(anoms_obj.login_code); xml_par.append(xml_node);
			xml_node = $(XML("Argument")); xml_node.attr("id", "AREAS"); xml_node.text(anoms_obj.cmd_area); xml_par.append(xml_node);
			xml_send(xml_request);
			anoms_obj.command = ""; // RESET COMMAND
		});
		$("#menu_impostazioni").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
			{
				pag_change(".home .JSdialog", "widget_login_small", "settings");
			}
		});
		$("#menu_communication").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
			{
				pag_change(".home .JSdialog", "widget_login_small", "par_comm");
			}
		});
		$("#menu_utenti").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
			{
				pag_change(".home .JSdialog", "widget_login_small", "mod_user");
			}
		});
		$("#menu_test_impianto").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
			{
				pag_change(".home .JSdialog", "widget_login_small", "mod_test");
			}
		});
		$("#menu_eventi").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
			{
				pag_change(".home .JSdialog", "widget_login_small", "mod_log");
			}
		});
		$("#menu_scenari").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
			{
				pag_change(".home .JSdialog", "widget_login_small", "scenery");
			}
		});
		if (are_there_tvcc())
			$("#menu_camera").removeClass("unavailable");
		else
			$("#menu_camera").addClass("unavailable");
		$("#menu_camera").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")) && !($(this).parent().hasClass("unavailable")))
			{
				pag_change(".home .JSdialog", "widget_login_small", "login_tvcc");
			}
		});
		//
		$("#widget_leaf_home .leafAct")/*.not("#menu_on_off")*/.click(function() //NO off("click")
		{
			if (!$(this).parent().hasClass("disabled") && !$(this).parent().hasClass("unavailable") && session_u_p != null)
			{
				startWaitingScr();
			}
		});
		//
		slotTextClick(this.name);
		//
		//get area and state reference from catalogue
		this.area_reference = xml_file_configuration.find("Devices Device").filter(function()
		{
			var res = false;
			if ($(this).children("Category").text() == "ALARM")
				if ($(this).children("Subcategory").text() == WS_DEV_ALARM_CEN_STR)
					res = true;
			return res;
		}).attr("id");
		//
		this.idIconClassStr = "";
		icon_st_reference = xml_file_configuration
			.children("Categories")
			.children("Category[id='ALARM']")
			.children("Subcategories")
			.children("Subcategory[id='"+WS_DEV_ALARM_CEN_STR+"']")
			.children("States")
			.children("State")
			.filter(function()
			{
				var res = false;
				if 
				(
					$(this).attr("id") == WS_DEV_ALARM_CEN_STATE_ON_STR
					|| $(this).attr("id") == WS_DEV_ALARM_CEN_STATE_OFF_STR
					|| $(this).attr("id") == WS_DEV_ALARM_CEN_STATE_PART_STR
					|| $(this).attr("id") == WS_DEV_ALARM_CEN_STATE_ALARM_STR
				)
				{
					widget_obj.idIconClassStr += $(this).attr("id") + " ";
					res= true;
				}
				return res;
			});
		this.idIconClassStr = this.idIconClassStr.trim();
		//**FINE AREE**//
		//
		urlCommandHook();
		//
		this.loaded = true;
	},
	onrecv_confirmation: function(conf)
	{
		//
	},
	onrecv_indication: function(indi)
	{
		//**AREE**//
		if (indi.attr("type") == "STATE")
		{
			if
			(
				indi.find("State").text() == WS_DEV_ALARM_CEN_STATE_ON_STR
				|| indi.find("State").text() == WS_DEV_ALARM_CEN_STATE_OFF_STR
				|| indi.find("State").text() == WS_DEV_ALARM_CEN_STATE_PART_STR
				|| indi.find("State").text() == WS_DEV_ALARM_CEN_STATE_ALARM_STR
			)
			{
				session_st_refresh();
				if (indi.find("State").text() === WS_DEV_ALARM_CEN_STATE_OFF_STR)
				{
					area_dis_flg = true;
					this.unlock_settings();
				}
				else
				{
					area_dis_flg = false;
					this.lock_settings();
				}
				//
				stdby_out();
				//
				var aree_pattern = indi.children("Device").filter(function()
				{
					var res = false;
					if ($(this).text() == pag_table_new["widget_leaf_home"].area_reference)
						res = true;
					return res;
				});
				if (aree_pattern.length > 0)
				{
					var widget_obj = this;
					//
					var status_area = indi.children("State").text();
					status_area_global = status_area; 
					this.change_icon_area_status(status_area);
					for (var i = 0; i < this.t_out_area.length; i++)
						clearTimeout(this.t_out_area[i]);
					this.t_out_area = [];
					this.t_exit_min = null;
					area_st_obj = indi.find("Areas Area");					
					//
					area_st_obj.each(function()
					{
						var st = $(this).attr("st");
						if (imq_get())
						{
							if (!(indi.find("State").text() === WS_DEV_ALARM_CEN_STATE_OFF_STR))
								st = "unknown";	
						}
						$("#footer_area_b, #footer_area_bh")
							.find("div[data-id = '" + $(this).attr("id") + "']")
							.attr("class", "area_item area_" + $(this).attr("id") + "_stato_" + st + " unavailableMode1")
							.addClass(area_ena_check($(this).attr("id")) ? "" : "unavailable");
						if ($(this).attr("texit") < widget_obj.t_exit_min || widget_obj.t_exit_min == null)
							widget_obj.t_exit_min = $(this).attr("texit");
					});
					clearTimeout(this.t_out_decrease);
					this.t_exit_min = this.t_exit_min || 0;
					this.decrease_and_show_t_exit();
				}
			}
		}
		//**FINE AREE**//
	},
	onclose: function()
	{
		//
	},
	//
	name: "widget_leaf_home",
	loaded: false,
	area_reference: "",
	t_out_area: [],
	t_out_decrease: null,
	t_exit_min: null,
	loadButHide_flg: $(".widget_leaf_home").attr("data-loadButHide") == "none" ? false : true,
	idIconClassStr: "",
	//
	decrease_and_show_t_exit: function()
	{
		var widget_obj = this;
		//
		clearTimeout(this.t_out_decrease);
		//
		if (this.t_exit_min > 0)
		{
			$("#t_exit").text(this.t_exit_min).closest(".verAl").show();
			this.t_out_decrease = setTimeout(function()
			{
				widget_obj.t_exit_min -= 1;
				widget_obj.decrease_and_show_t_exit();
			}, QT ? 950 : 1000);
		}
		else
		{
			$("#t_exit").closest(".verAl").hide();
			clearTimeout(this.t_out_decrease);
		}
	},
	change_icon_area_status: function(icon_status)
	{
		$("#menu_on_off").removeClass(this.idIconClassStr).addClass(icon_status);
		//
		$("#mypolice").removeClass("inserito disinserito allarmato unknown");
		switch (icon_status)
		{
			case "S00120":
				$("#mypolice").addClass("inserito");
				break;
			case "S00121":
				$("#mypolice").addClass("disinserito");
				break;
			case "S00122":
				$("#mypolice").addClass("inserito");
				break;
			case "S00127":
				$("#mypolice").addClass("allarmato");
				break;
			default:
				$("#mypolice").addClass("unknown");
				break;
		}
	},
	refresh_areas_name: function()
	{
		area_list.children("item").each(function(index)
		{
			$("#widget_zone_status_container .zone_status").eq(index).children("p").text($(this).children("desc").text());
		});
	},
	lock_settings: function()
	{
		this.lock_all();
		$("#menu_on_off").parent().removeClass("disabled");
		$("#menu_camera").parent().removeClass("disabled");
		$("#menu_eventi").parent().removeClass("disabled");
	},
	unlock_settings: function()
	{
		this.unlock_all();
	},
	lock_all: function()
	{
		if (maintenance_flg)
			this.init_cover();
		//
		$("#footer_area_b, #footer_area_bh").find("div").each(function()
		{
			$(this).attr("class", "area_item area_" + $(this).attr("data-id") + "_stato_unknown unavailableMode1")
				.addClass(area_ena_check($(this).attr("data-id")) ? "" : "unavailable");
		});
		$(".widget_leaf_home .slot .slot_wrapper, #head_button_settings, #head_button_settings2, #mysessionstatus, #mycloudstatus").addClass("disabled");
	},
	unlock_all: function()
	{
		this.decommit_cover();
		//
		$(".widget_leaf_home .slot .slot_wrapper, #head_button_settings, #head_button_settings2, #mysessionstatus, #mycloudstatus").removeClass("disabled");
		if (!QT && !imq_get())
		{
			if (role_str == "USER")
			{
				$("#menu_on_off").parent().removeClass("disabled");
				$("#menu_eventi").parent().removeClass("disabled");
				$("#menu_scenari").parent().removeClass("disabled");
				$("#menu_utenti").parent().addClass("disabled");
				$("#menu_camera").parent().removeClass("disabled");
				$("#menu_test_impianto").parent().addClass("disabled");
				$("#menu_communication").parent().addClass("disabled");
				$("#menu_impostazioni").parent().addClass("disabled");
				$("#head_button_settings, #head_button_settings2").addClass("disabled");
			}
			else if (role_str == "POWERUSER")
			{
				$("#menu_on_off").parent().removeClass("disabled");
				$("#menu_eventi").parent().removeClass("disabled");
				$("#menu_scenari").parent().removeClass("disabled");
				$("#menu_utenti").parent().removeClass("disabled");
				$("#menu_camera").parent().removeClass("disabled");
				$("#menu_test_impianto").parent().removeClass("disabled");
				$("#menu_communication").parent().removeClass("disabled");
				$("#menu_impostazioni").parent().removeClass("disabled");
				$("#head_button_settings, #head_button_settings2").removeClass("disabled");
			}
			else if (role_str == "INST")
			{
				$("#menu_on_off").parent().addClass("disabled");
				$("#menu_eventi").parent().removeClass("disabled");
				$("#menu_scenari").parent().addClass("disabled");
				$("#menu_utenti").parent().removeClass("disabled");
				$("#menu_camera").parent().removeClass("disabled");
				$("#menu_test_impianto").parent().removeClass("disabled");
				$("#menu_communication").parent().removeClass("disabled");
				$("#menu_impostazioni").parent().removeClass("disabled");
				$("#head_button_settings, #head_button_settings2").removeClass("disabled");
			}
		}
	},
	init_cover: function()
	{
		if (maintenance_fwupd_txt == null)
		{
			$(".JScover").addClass("maintLeaf").removeClass("unavailable").html
			(
				  "<div class='leafMsgCont'>"
				+		"<div class='leafMsgText'>"
				+			"{LANG_SYSTEM_MAINTENANCE}"
				+ 			"<BR>"
				+ 			(maint_ip_curr == null ? "" : "{LANG_MAINT_IP_STR} " + maint_ip_curr)
				+		"</div>"
				+ "</div>"
			);
		}
		else
		{
			$(".JScover").addClass("maintLeaf").removeClass("unavailable").html
			(
				  "<div class='leafMsgCont'>"
				+		"<div class='leafMsgText'>"
				+			maintenance_fwupd_txt
				+		"</div>"
				+ "</div>"
			);
		}
	},
	decommit_cover: function()
	{
		$(".JScover").empty().removeClass("maintLeaf").addClass("unavailable");
	},
	refresh_notify_icon: function()
	{
		if (anoms_obj.getSize() > 0)
		{
			if (imq_get())
			{
				$("#notify_icon").text("!").show();	
				$("#notify_icon").addClass("notifyIcon_imq").removeClass("notifyIcon");
			}
			else
			{
				$("#notify_icon").text(anoms_obj.getSize() > 99 ? 99 : anoms_obj.getSize()).show();	
				$("#notify_icon").addClass("notifyIcon").removeClass("notifyIcon_imq");
			}
		}
		else
		{
			$("#notify_icon").text("").hide();
		}
	}
};