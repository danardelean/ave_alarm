pag_table_new["widget_add_other_users"] = {
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
		this.send_xml_users_load();
		//
		summary_highlighter(this);
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "MENU")
		{
			if (conf.children("act").text() == "LOAD")
			{
				if (conf.children("res").text() == "LOADED")
				{
					if (conf.children("page").text() == WS_USER_STR)
					{
						$(".add_other_users_container *:not(.scrollableSize)").remove()
						$(".add_other_users_container").append
						(
								"<div id='addOU_item_tmpl' style='display:none;'>"
							+		"<p class='number'></p>"
							+		"<p class='name'></p>"
							+		"<div class='eye_binder'></div>"
							+	"</div>"
						);
						//
						conf.find("par item").each(function(index)
						{
							xml_user_tbl[index] = $(this);
							//
							var item_gui = $("#addOU_item_tmpl").clone();
							item_gui
								.removeAttr("id")
								.attr("class", "add_other_users_item user");
							//
							item_gui.attr("data-id", $(this).children("id").text());
							item_gui.attr("data-par-mod-id", index);
							item_gui.children(".number").text(index+1);
							item_gui.children(".name").text($(this).children("name").text());
							item_gui.attr("data-role", $(this).children("role").text());
							var item_gui_eyebinder = item_gui.find(".eye_binder");
							//
							item_gui_eyebinder.addClass("disableMode3");
							if ($(this).children("role").text() == "POWERUSER")
							{
								item_gui.children(".name").text($(this).children("name").text() == "" ? "{LANG_DEFAULT_POWERUSER_NAME_STR}" : $(this).children("name").text());
								item_gui.children(".name").append(" ("+"{LANG_WIZARD_ADD_POWER_USER_LOGIN}"+")");	
								if (role_str == "USER")
									item_gui_eyebinder.addClass("disabled");
							}
							else if ($(this).children("role").text() == "INST")
							{
								item_gui.children(".name").text($(this).children("name").text() == "" ? "{LANG_DEFAULT_INSTALLER_NAME_STR}" : $(this).children("name").text());
								item_gui.children(".name").append(" ("+"{LANG_WIZARD_ADD_INSTALLER_LOGIN}"+")");
								if (!(role_str == "INST"))
									item_gui_eyebinder.addClass("disabled");
							}
							else
							{
								if (role_str == "USER")
								{
									if ($(this).children("code").text() != u_p)
										item_gui_eyebinder.addClass("disabled");
								}
							}
							//
							//
							item_gui.appendTo(".add_other_users_container");						
							item_gui.show();
						});
						//
						$(".widget_add_other_users .eye_binder").click(function()
						{
							if (!$(this).hasClass("disabled"))
							{
								if ($(this).parent().attr("data-role") === "INST")
								{
									pag_change("#seeking-page .quadrant_abcd", "widget_mod_inst");
								}
								else
								{
									pag_change("#seeking-page .quadrant_abcd", "widget_mod_user", $(this).parent().attr("data-par-mod-id"));
								}
							}
						});
						//
						conf.find("par2 item").each(function(index)
						{
							tslotNames[index] = $(this).children("name").text();
						});
						//
						scrollListArrowCheck(this);
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
	name: "widget_add_other_users",
	title: "{LANG_WIZARD_ADD_USER_BTN}",
	bodyWrapper: "set elsewhere",
	scrollOffset: 0,
	//
	send_xml_users_load: function()
	{
		xml_menu_load_send(WS_USER_STR, "USER|POWERUSER|INST", null, "widget_add_other_users");
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			if (wizard_flg)
			{
				poptoast("{LANG_ITEM_SAVED}");
			}
			else
			{
				if (widget_obj.bodyWrapper == "#settings-page")
					header_home_group(widget_obj);
				else if (widget_obj.bodyWrapper == "#seeking-page")
					header_widget_settings_utilities_group();
			}
		});
		//
		if (widget_obj.bodyWrapper == "#settings-page")
			$("#backTitle").html("{LANG_HOME}");
		else if (widget_obj.bodyWrapper == "#seeking-page")
			$("#backTitle").html("{LANG_MENU_SET}");
	},
	footer_home_switch: function()
	{
		var widget_obj = this;
		footer_home_switch_init();
		//
		//
		draw_footer_button("{LANG_WIZARD_ADD_USER_BTN}", "footer_h2_a_a");
		draw_footer_button("{LANG_WIZARD_ADD_TSLOT_BTN}", "footer_h2_a_b");
		//
		if (role_str == "USER")
		{
			$("#footer_h2_a_a .foot_button").addClass("disabled");
			$("#footer_h2_a_b .foot_button").addClass("disabled");
		}
		else
		{
			$("#footer_h2_a_a .foot_button").off("click").click(function()
			{
				pag_change("#seeking-page .quadrant_abcd", "widget_add_user2");
			});
			$("#footer_h2_a_b .foot_button").off("click").click(function()
			{
				pag_change("#seeking-page .quadrant_abcd", "widget_add_tslot");
			});
		}
		//
		//
		footer_button_rotate();
		scrollList(this);
	}
};