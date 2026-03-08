pag_table_new["summary"] = {
	onload: function()
	{
		wizard_flg = true;
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		var widget_obj = this;
		//
		pag_clear("#seeking-page .quadrant_abcd");
		page_act("#seeking-page");
		schema_act("#seeking-page", "quadrant_abcd");
		$("#side-menu").show();
		$("#gui_body .body_wrapper, .wizard_body .body_wrapper").addClass("side_menu_mode");
		//
		this.init_cover();
		//
		//
		$("#summary_lang_naz").off("click.lang").on("click.lang", function() 
		{
			if (!($(this).parent().hasClass("disabled")))
			{
				if (lang_change_flg)
					pag_change("#seeking-page .quadrant_abcd", "widget_lang");
				else
					pag_change("#seeking-page .quadrant_abcd", "nav_lang_naz");
			}
		}).trigger("click.lang");
		$("#summary_name").off("click").click(function() 
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "widget_new_plant");
		});
		$("#summary_aree").off("click").click(function() 
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "widget_identifying_areas");
		});
		$("#summary_dispo").off("click").click(function() 
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "widget_add_other_devices");
		});
		$("#summary_utenti").off("click").click(function() 
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#settings-page .quadrant_abcd", "widget_add_other_users");
		});
		$("#summary_audio").off("click").click(function() 
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "widget_audio");
		});
		$("#summary_navcomm").off("click").click(function() 
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#settings-page .quadrant_abcd", "nav_communication");
		});
		$("#summary_scenari").off("click").click(function() 
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#settings-page .quadrant_abcd", "widget_scenery_list", "edit");
		});
		$("#summary_parcen").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "widget_parcen");
		});
		$("#summary_inst").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "widget_mod_inst");
		});
		//
		this.loaded = true;
	},
	onrecv_confirmation: function(conf)
	{
		//
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
	name: "summary",
	title: "{LANG_SUMMARY_TITLE}",
	loaded: false,
	//
	init_cover: function()
	{
		if (maintenance_fwupd_txt == null)
		{
			$(".JScover").removeClass("maintLeaf bg_obs").addClass("sumSize").removeClass("unavailable").html
			(
				  "<div class='sumMsgCont'>"
				+		"<div class='sumMsgText'>"
				+			"{LANG_SUMMARY_SIZE_WARN}"
				+		"</div>"
				+ "</div>"
			);	
		}
		else
		{
			$(".JScover").removeClass("sumSize").addClass("maintLeaf bg_obs").removeClass("unavailable").html
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
		$(".JScover").empty().removeClass("sumSize maintLeaf bg_obs").addClass("unavailable");
	},
	//
	header_home_switch: function()
	{
		var widget_obj = this;
		header_wizard_switch_init(this);
		//
		if (wizard_config_flg)
		{
			$("#header-wizard-page .close").addClass("disabled");
		}
		else
		{
			$("#backTitle").html("{LANG_NAV_SETTINGS_GENERIC}");
			$("#header-wizard-page .close").removeClass("disabled");
		}
		//
		$("#header-wizard-page .close").off("click").click(function()
		{
			if (!($(this).hasClass("disabled")))
			{
				if ($(".JScover").is(":visible"))
					$(this).trigger("on_pw_ok");
				else
					pag_change(".home .JSdialog", "widget_popwarn", "{LANG_SUMMARY_EXIT}", "{LANG_RUSURE}", "okab", "#header-wizard-page .close");
			}
		}).off("on_pw_ok").on("on_pw_ok", function()
		{
			back_from_yellow_summary();
			//
			header_nav_settings_generic_group(widget_obj);
		});
	},
	scrollBtnRefresh: function()
	{
		if ($("#summary_menu").height() >= $("#summary_menu")[0].scrollHeight)
		{
			$("#summary_scroll_down").addClass("disabled");
			$("#summary_scroll_up").addClass("disabled");
		}
		else
		{
			if ($("#summary_menu").scrollTop() >= ($("#summary_menu .item:first").outerHeight(true) - 1) * $("#summary_menu .item").length - $("#summary_menu").outerHeight(true))
			{
				$("#summary_scroll_down").addClass("disabled");
				$("#summary_scroll_up").removeClass("disabled");
			}
			else if ($("#summary_menu").scrollTop() <= 1)
			{
				$("#summary_scroll_up").addClass("disabled");
				$("#summary_scroll_down").removeClass("disabled");
			}
			else
			{
				$("#summary_scroll_down").removeClass("disabled");
				$("#summary_scroll_up").removeClass("disabled");
			}
		}
	},
	footer_home_switch: function()
	{
		var widget_obj = this;
		footer_home_switch_init();
		//
		//
		if ($("#summary_menu").scrollTop() >= ($("#summary_menu .item:first").outerHeight(true) - 1) * $("#summary_menu .item").length - $("#summary_menu").outerHeight(true))
			$("#summary_scroll_down").addClass("disabled");
		else if ($("#summary_menu").scrollTop() <= 1)
			$("#summary_scroll_up").addClass("disabled");
		//
		$("#summary_scroll_down").off("click").click(function()
		{
			$("#summary_menu").finish();	
			$("#summary_menu").animate({"scrollTop": $("#summary_menu").scrollTop() + $("#summary_menu .item:first").outerHeight(true) + 1}, null, null, function()
			{
				widget_obj.scrollBtnRefresh();
			});
		});
		$("#summary_scroll_up").off("click").click(function()
		{
			$("#summary_menu").finish();
			$("#summary_menu").animate({"scrollTop": $("#summary_menu").scrollTop() - $("#summary_menu .item:first").outerHeight(true) - 1}, null, null, function()
			{
				widget_obj.scrollBtnRefresh();
			});
		});
		$("." + widget_obj.name + " .summary_menu").off("stopScroll").stopScroll(function()
		{
			widget_obj.scrollBtnRefresh();
		});
	}
};