pag_table_new["widget_scenery_list"] = {
	onload: function()
	{
		pag_clear(".home .JSdialog");
		//
		dynamic_page_act(this);
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		away_from_home();
		//
		xml_request = xml_request_head_build("SCENE_LOAD", "widget_scenery_list");
		xml_send(xml_request);
		//
		summary_highlighter(this);
	},
	onrecv_confirmation: function(conf)
	{
		var widget_obj = this;
		//
		if (conf.attr("type") == "SCENE_LOAD")
		{
			sceneries = conf.find("Scenes Scene[permanent='FALSE']");
			sceneries_all = conf.find("Scenes Scene");
			var strIoT = "";
			var strTby = "";
			var strAct = "";
			var str = "";
			//
			$("#container_scenery_list > div:not(.phantom_entire)").remove();
			conf.find("Scenes Scene[permanent='FALSE']").each(function(index)
			{
				var conf_obj = $(this);
				//
				var guiModeClass = "";
				if (isIoTType(conf_obj.find("Steps Step").length, uniGetDev("tagId", "subcategory", conf_obj.find("Steps Step").attr("deviceId")), conf_obj.attr("triggeredByEna")))
				{
					if (widget_obj.edit_mode_flg)
						guiModeClass = "scenery_edit_iot";
					else
						guiModeClass = "scenery_iot";
				}
				else
				{
					if (widget_obj.edit_mode_flg)
						guiModeClass = "scenery_edit";
				}
				var trby = false;
				var action = false;
				if (!(guiModeClass == "scenery_edit_iot" || guiModeClass == "scenery_iot"))
				{
					trby = uniGetDev("id", "subcategory", conf_obj.attr("triggeredBy")) == WS_DEV_ALARM_IOT_STR && conf_obj.attr("triggeredByEna") == "TRUE";
					if (!trby)
					{
						conf_obj.find("Steps Step").each(function()
						{
							if (uniGetDev("tagId", "subcategory", $(this).attr("deviceId")) == WS_DEV_ALARM_IOT_STR)
							{
								action = true;
							    return false;
							}
						});
					}
				}
				//
				if (guiModeClass == "scenery_iot" || guiModeClass == "scenery_edit_iot")
				{
					strIoT +=
						"<div class='dyn_slot " + guiModeClass + "' data-id='" + conf_obj.attr("id") + "'>"
						+	"<div class='slot_wrapper'>"
						+		"<div class='ico ico1'></div>"
						+		"<div class='text'>" + conf_obj.attr("desc") + "</div>"
						+	"</div>"
						+ "</div>";
				}
				else if (trby)
				{
					strTby +=
						"<div class='dyn_slot " + guiModeClass + "' data-id='" + conf_obj.attr("id") + "'>"
						+	"<div class='slot_wrapper'>"
						+		"<div class='ico ico1'></div>"
						+		"<div class='text'>" + conf_obj.attr("desc") + "</div>"
						+		"<div class='notifyIcon bggr dBlock'>I</div>"
						+	"</div>"
						+ "</div>";
				}
				else if (action)
				{
					strAct +=
						"<div class='dyn_slot " + guiModeClass + "' data-id='" + conf_obj.attr("id") + "'>"
						+	"<div class='slot_wrapper'>"
						+		"<div class='ico ico1'></div>"
						+		"<div class='text'>" + conf_obj.attr("desc") + "</div>"
						+		"<div class='notifyIcon bg_azure_gr dBlock'>I</div>"
						+	"</div>"
						+ "</div>";
				}
				else
				{
					str +=
						"<div class='dyn_slot " + guiModeClass + "' data-id='" + conf_obj.attr("id") + "'>"
						+	"<div class='slot_wrapper'>"
						+		"<div class='ico ico1'></div>"
						+		"<div class='text'>" + conf_obj.attr("desc") + "</div>"
						+	"</div>"
						+ "</div>";
				}
			});
			//
			if (strIoT == "")
				;
			else
				$("#container_scenery_list").append("<p class='dyn_title dyn_pad'>{LANG_IOT_SCENERY_IOT_TITLE}</p>" + strIoT);
			//
			if (strTby == "" && strAct == "" && str == "")
				;
			else
				$("#container_scenery_list").append("<p class='dyn_title'>{LANG_IOT_SCENERY_STD_TITLE}</p>" + strTby + strAct + str);
			//
			//
			$("#container_scenery_list .dyn_slot .ico").off("click").click(function()
			{
				if (widget_obj.edit_mode_flg)
				{
					widget_obj.edit_scenario($(this).closest(".dyn_slot").attr("data-id"));
				}
				else
				{
					xml_request = xml_request_head_build("SCENE_CMD", widget_obj.name);
					xml_par = $(XML("Command")); xml_par.text("START"); xml_request.append(xml_par);
					xml_par = $(XML("Scene")); xml_par.text($(this).closest(".dyn_slot").attr("data-id")); xml_request.append(xml_par);
					xml_par = $(XML("Arguments")); xml_request.append(xml_par);
					xml_node = $(XML("Argument")); xml_node.attr("id", "PIN"); xml_node.text(u_p); xml_par.append(xml_node);
					xml_send(xml_request);
					$("#header-home-page2 .close").trigger("click");
				}
			});
			//
			$("#container_scenery_list").scrollTop(scenery_list_scroll_pointer);
			scrollListArrowCheck(this);
			//
			slotTextClick(this.name);
		}
		else if (conf.attr("type") == "SCENE_DELETE")
		{
			this.onload();
		}
		else if (conf.attr("type") == "SCENE_CMD")
		{
			//
		}
	},
	onrecv_indication: function(indi)
	{
		//
	},
	onclose: function()
	{
		scenery_list_scroll_pointer = $("#container_scenery_list").scrollTop();
	},
	//
	name: "widget_scenery_list",
	title: "{LANG_SCENERY}",
	bodyWrapper: "set elsewhere",
	edit_mode_flg: $(".widget_scenery_list").attr("data-edit-mode") == "edit",
	shortcut_mode_flg: $(".widget_scenery_list").attr("data-shortcut-mode") == "shortcut",
	//
	edit_scenario: function(scene_id)
	{
		pag_change("#seeking-page .quadrant_abcd.abcd", "widget_add_scenery", scene_id, null, $(".widget_scenery_list").attr("data-shortcut-mode"));
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			if (widget_obj.shortcut_mode_flg)
			{
				pag_clear("#seeking-page .quadrant_abcd.abcd"); //EXEC PRIMA
				pag_change("#settings-page .quadrant_abcd.abcd", "widget_scenery_list");
			}
			else if (widget_obj.bodyWrapper == "#settings-page")
			{
				header_home_group(widget_obj);
			}
			else if (widget_obj.bodyWrapper == "#seeking-page")
			{
				header_nav_settings_generic_group(widget_obj);
			}
		});
		//
		if (this.shortcut_mode_flg)
		{
			$("#backTitle").html("{LANG_SCENERY}");
		}
		else if (this.bodyWrapper == "#settings-page")
		{
			$("#backTitle").html("{LANG_HOME}");
		}
		else if (this.bodyWrapper == "#seeking-page")
		{
			$("#backTitle").html("{LANG_NAV_SETTINGS_GENERIC}");
		}
	},
	footer_home_switch: function()
	{
		var widget_obj = this;
		footer_home_switch_init();
		//
		//
		if (this.edit_mode_flg)
		{
			draw_footer_button("{LANG_S_ADD_SCENERY}", "footer_h2_a_a");
			$("#footer_h2_a_a").click(function()
			{
				pag_change("#seeking-page .quadrant_abcd.abcd", "widget_add_scenery", null, null, $(".widget_scenery_list").attr("data-shortcut-mode"));
			});
		}
		else
		{
			draw_footer_button("{LANG_NAV_SETTINGS_GENERIC_SCENERY}", "footer_h2_a_a");
			$("#footer_h2_a_a").click(function()
			{
				if (!$(this).hasClass("disabled"))
				{
					pag_change(".home .JSdialog", "widget_login_small", "scenery_edit");
				}
			});
			if (role_str == "USER")
				$("#footer_h2_a_a").addClass("disabled");
		}
		//
		//
		footer_button_rotate();
		scrollList(this);
	}
};