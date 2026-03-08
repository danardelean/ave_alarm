pag_table_new["widget_utility"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		var widget_obj = this;
		//
		if (QT)
		{
			$("#container_utility .backup").addClass("disabled");
			$("#container_utility .restore").addClass("disabled");
			$("#container_utility .update_browser").addClass("disabled");
		}
		else
		{
			// BACKUP
			$("#container_utility .backup").click(function()
			{
				xml_request = xml_request_head_build("MENU", "widget_utility");
				xml_par = $(XML("page")); xml_par.text("UTILITY"); xml_request.append(xml_par);
				xml_par = $(XML("act")); xml_par.text("BACKUP_REMOTE"); xml_request.append(xml_par);
				xml_par = $(XML("par")); xml_request.append(xml_par);
				xml_send(xml_request);
			})
			.on("on_pw_ab_w", function()
			{
				xml_request = xml_request_head_build("MENU", "widget_utility");
				xml_par = $(XML("page")); xml_par.text("UTILITY"); xml_request.append(xml_par);
				xml_par = $(XML("act")); xml_par.text("BACKUP_REMOTE_ABORT"); xml_request.append(xml_par);
				xml_par = $(XML("par")); xml_request.append(xml_par);
				xml_send(xml_request);
			});
			// RESTORE
			$("#container_utility .restore").click(function()
			{
				widget_obj.upgrade_flg = false;
				var chunkCb = function(cnt, n)
				{
					if ("widget_popwarn" in pag_table_new)
					{
						if (pag_table_new["widget_popwarn"].popMode == "wbar")
							pag_table_new["widget_popwarn"].popBar_drawer(cnt + "/" + n);
					}
				}
				var errorCb = function()
				{
					xml_request = xml_request_head_build("MENU");
					xml_par = $(XML("page")); xml_par.text("UTILITY"); xml_request.append(xml_par);
					xml_par = $(XML("act")); xml_par.text("FW_UPGRADE_STOP"); xml_request.append(xml_par);
					xml_par = $(XML("par")); xml_par.text("0"); xml_request.append(xml_par);
					xml_send(xml_request);
					//
					pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_SYSTEM_RESTORE_FAIL_POP}", "ok", null);
				}
				if (!webUpgradeProc(true, "2", chunkCb, errorCb))
				{
					tyu("Errore centrale: Start Upgrade failed");
				}
			});
			// UPGRADE
			if (imq_get())
			{
				$("#container_utility .update_browser").addClass("disabled");
			}
			$("#container_utility .update_browser").click(function()
			{
				if (!($(this).hasClass("disabled")))
				{
					widget_obj.upgrade_flg = true;
					var chunkCb = function(cnt, n)
					{
						if ("widget_popwarn" in pag_table_new)
						{
							if (pag_table_new["widget_popwarn"].popMode == "wbar")
								pag_table_new["widget_popwarn"].popBar_drawer(cnt + "/" + n);
						}
					}
					var errorCb = function()
					{
						xml_request = xml_request_head_build("MENU");
						xml_par = $(XML("page")); xml_par.text("UTILITY"); xml_request.append(xml_par);
						xml_par = $(XML("act")); xml_par.text("FW_UPGRADE_STOP"); xml_request.append(xml_par);
						xml_par = $(XML("par")); xml_par.text("0"); xml_request.append(xml_par);
						xml_send(xml_request);
						//
						pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_SYSTEM_UPDATE_FAIL_POP}", "ok", null);
					}
					if (!webUpgradeProc(true, "1", chunkCb, errorCb))
					{
						tyu("Errore centrale: Start Upgrade failed");
					}
				}
			})
			.on("on_pw_ab_w", function()
			{
				webUpgradeAbort(true);
			});
		}
		//
		//
		if (imq_get())
		{
			$("#container_utility .update_usb").addClass("disabled");
			$("#container_utility .reboot").addClass("disabled");
		}
		// REBOOT UPGRADE
		$("#container_utility .update_usb").click(function()
		{
			if (!($(this).hasClass("disabled")))
				pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_SYSTEM_UPDATE_USB_POP}", "okab", "#container_utility .update_usb");
		})
		.on("on_pw_ok", function()
		{
			pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_REBOOT_PLANT}", "nobtn", null);
			//
			xml_request = xml_request_head_build("MENU", "widget_utility");
			xml_par = $(XML("page")); xml_par.text("UTILITY"); xml_request.append(xml_par);
			xml_par = $(XML("act")); xml_par.text("REBOOT"); xml_request.append(xml_par);				
			xml_par = $(XML("par")); xml_request.append(xml_par);
			xml_send(xml_request);
		});
		// REBOOT
		$("#container_utility .reboot").click(function()
		{
			if (!($(this).hasClass("disabled")))
				pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_SYSTEM_REBOOT_POP}", "okab", "#container_utility .reboot");
		})
		.off("on_pw_ok").on("on_pw_ok", function()
		{
			pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_REBOOT_PLANT}", "nobtn_trig", "#container_utility .reboot");
		})
		.off("on_pw_trig").on("on_pw_trig", function()
		{
			xml_request = xml_request_head_build("MENU", "widget_utility");
			xml_par = $(XML("page")); xml_par.text("UTILITY"); xml_request.append(xml_par);
			xml_par = $(XML("act")); xml_par.text("REBOOT"); xml_request.append(xml_par);
			xml_par = $(XML("par")); xml_request.append(xml_par);
			xml_send(xml_request);
		});
		// FACTORY RESTORE
		var fact_def_count = 0;
		$("#fact_def").click(function()
		{
			if (!($(this).hasClass("disabled")))
			{
				fact_def_count = 0;
				pag_change(".home .JSdialog", "widget_popwarn", "{LANG_FACT_DEF}", "{LANG_RUSURE}", "okab", "#fact_def");
			}
		})
		.off("on_pw_ok").on("on_pw_ok", function()
		{
			if (fact_def_count == 0)
			{
				fact_def_count++;
				pag_clear(".JSdialog");
				pag_change(".home .JSdialog2", "widget_popwarn", "{LANG_FACT_DEF}", "{LANG_RUSURESURE}", "okab", "#fact_def");
			}
			else
			{
				pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_REBOOT_PLANT}", "nobtn_trig", "#fact_def");
			}
		})
		.off("on_pw_trig").on("on_pw_trig", function()
		{
			xml_request = xml_request_head_build("MENU");
			xml_par = $(XML("act")); xml_par.text("ERASE"); xml_request.append(xml_par);		
			xml_par = $(XML("page")); xml_par.text("SET"); xml_request.append(xml_par);				
			xml_send(xml_request);
		});
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "MENU")
		{
			if (conf.children("page").text() == "UTILITY")
			{
				if (conf.children("act").text() == "BACKUP_REMOTE")
				{
					if (conf.children("res").text() == "BACKING_UP")
					{
						pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_SYSTEM_BACKUP_UNDERWAY}", "wbar", "#container_utility .backup", 0 + "/" + (conf.children("act").text() == "BACKUP" ? 6 : 11));
					}
				}
				if (conf.children("act").text() == "REBOOT")
				{
					if (conf.children("res").text() == "OK")
					{
						//riavvio in corso
					}
					else if (conf.children("res").text() == "KO")
					{
						pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_SYSTEM_REBOOT_FAIL_POP}", "ok", null);
					}
				}
				else if (conf.children("act").text() == "FW_UPGRADE_START")
				{
					if (conf.children("res").text() == "OK")
					{
						webUpgradeProc(false);
						if (this.upgrade_flg)
							pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_SYSTEM_UPDATE_PROGRESS}", "wbar", "#container_utility .update_browser", 0 + "/" + 11);
						else
							pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_SYSTEM_RESTORE_UNDERWAY}", "wbar", "#container_utility .update_browser", 0 + "/" + 11);
					}
					else if (conf.children("res").text() == "KO")
					{
						webUpgradeAbort(false);
						if (this.upgrade_flg)
							pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_SYSTEM_UPDATE_FAIL_POP}", "ok", null);
						else
							pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_SYSTEM_RESTORE_FAIL_POP}", "ok", null);
					}
				}
				else if (conf.children("act").text() == "FW_UPGRADE_CHUNK")
				{
					if (conf.children("res").text() == "OK")
					{
						webUpgradeProc(false);
					}
					else if (conf.children("res").text() == "KO")
					{
						webUpgradeAbort(false);
						if (this.upgrade_flg)
							pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_SYSTEM_UPDATE_FAIL_POP}", "ok", null);
						else
							pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_SYSTEM_RESTORE_FAIL_POP}", "ok", null);
					}
				}
				else if (conf.children("act").text() == "FW_UPGRADE_STOP")
				{
					if (conf.children("res").text() == "OK")
					{
						pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_SYSTEM_REBOOT_FORCE_POP}", "nobtn", null);
						setTimeout(function()
						{
							xml_request = xml_request_head_build("MENU");
							xml_par = $(XML("page")); xml_par.text("UTILITY"); xml_request.append(xml_par);
							xml_par = $(XML("act")); xml_par.text("CLOUD_REBOOT"); xml_request.append(xml_par);
							xml_par = $(XML("par")); xml_request.append(xml_par);
							xml_send(xml_request);
						}, 3 * 1000);
					}
					else if (conf.children("res").text() == "ABORT")
					{
						pag_clear(".home .JSdialog");
					}
					else if (conf.children("res").text() == "KO")
					{
						webUpgradeAbort(false);
						if (this.upgrade_flg)
							pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_SYSTEM_UPDATE_FAIL_POP}", "ok", null);
						else
							pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_SYSTEM_RESTORE_FAIL_POP}", "ok", null);
					}
				}
			}
		}
	},
	onrecv_indication: function(indi)
	{
		if (indi.attr("type") == "MENU")
		{
			if (indi.children("page").text() == "UTILITY")
			{
				if (indi.children("act").text() == "BACKUP_REMOTE")
				{
					if (indi.children("res").text() == "OK")
					{
						window.location = "?cmd=getphp&name=remote_backup&act="+indi.children("desc").text();
						pag_clear(".home .JSdialog");
					}
					else if (indi.children("res").text() == "KO")
					{
						pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_SYSTEM_BACKUP_FAIL_POP}", "ok", null);
					}
					else if (indi.children("res").text() == "PROGRESS")
					{
						var curr = indi.find("par current").text();
						var tot = indi.find("par total").text();
						//
						if ("widget_popwarn" in pag_table_new)
						{
							if (pag_table_new["widget_popwarn"].popMode.indexOf("wbar") > -1)
								pag_table_new["widget_popwarn"].popBar_drawer(curr + "/" + tot);
						}
					}
				}
			}
		}
	},
	onclose: function()
	{
		//
	},
	//
	name: "widget_utility",
	title: "{LANG_NAV_SETTINGS_GENERIC_UTILITIES}",
	//
	upgrade_flg: true,
	//
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			header_nav_settings_generic_group(widget_obj);
		});
		//
		$("#backTitle").html("{LANG_NAV_SETTINGS_GENERIC}");
	},
	footer_home_switch: function()
	{
		var widget_obj = this;
		footer_home_switch_init();
		//
		draw_footer_button("{LANG_OK}", "footer_h2_a_a");
		//
		$("#footer_h2_a_a").click(function()
		{
			$("#header-home-page2 .close").trigger("click");
		});
		//
		footer_button_rotate();
		scrollList(this);
	}
};