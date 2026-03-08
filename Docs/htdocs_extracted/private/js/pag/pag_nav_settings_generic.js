pag_table_new["nav_settings_generic"] = {
	onload: function()
	{
		pag_clear(".home .JSdialog");
		page_act("#seeking-page");
		schema_act("#seeking-page", "quadrant_abcd");
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		away_from_home();
		//
		setTimeout(function()
		{
			saveUrlLevel(0);
		}, 0.5*1000);
		//
		//
		if (role_str == "INST")
		{
			$("#date_time").parent().removeClass("disabled");
			$("#language_nazione").parent().removeClass("disabled");
			$("#plant").parent().removeClass("disabled");
			$("#par_cen").parent().removeClass("disabled");
			$("#ceninfo").parent().removeClass("disabled");
			$("#updates").parent().removeClass("disabled");
			$("#summary_btn").parent().removeClass("disabled");
			$("#scenery_btn").parent().removeClass("disabled");
		}
		else
		{
			$("#date_time").parent().removeClass("disabled");
			$("#language_nazione").parent().addClass("disabled");
			$("#plant").parent().addClass("disabled");
			$("#par_cen").parent().removeClass("disabled");
			$("#ceninfo").parent().removeClass("disabled");
			$("#updates").parent().addClass("disabled");
			$("#summary_btn").parent().addClass("disabled");
			$("#scenery_btn").parent().removeClass("disabled");
		}
		//
		$("#date_time").off("click").click(function() 
		{
			if (!($(this).parent().hasClass("disabled")))
			{
				saveUrlLevel(1);
				pag_change("#seeking-page .quadrant_abcd", "widget_dtpicker");
			}
		});
		$("#language_nazione").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
			{
				saveUrlLevel(1);
				pag_change("#seeking-page .quadrant_abcd", "nav_lang_naz");
			}
		});
		$("#plant").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
			{
				saveUrlLevel(1);
				pag_change("#seeking-page .quadrant_abcd", "widget_new_plant");
			}
		});
		$("#par_cen").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
			{
				saveUrlLevel(1);
				pag_change("#seeking-page .quadrant_abcd", "widget_parcen");
			}
		});
		$("#ceninfo").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
			{
				saveUrlLevel(1);
				pag_change("#seeking-page .quadrant_abcd", "nav_ceninfo");
			}
		});
		$("#updates").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
			{
				saveUrlLevel(1);
				pag_change("#seeking-page .quadrant_abcd", "widget_utility");
			}
		});
		$("#summary_btn").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
			{
				saveUrlLevel(1);
				pag_change("#side-menu", "summary");	
			}
		});
		$("#scenery_btn").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
			{
				saveUrlLevel(1);
				pag_change("#seeking-page .quadrant_abcd", "widget_scenery_list", "edit");
			}
		});
		//
		slotTextClick(this.name);
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
	name: "nav_settings_generic",
	title: "{LANG_NAV_SETTINGS_GENERIC}",
	//
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			header_widget_settings_utilities_group();
		});
		//
		$("#backTitle").html("{LANG_MENU_SET}");
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