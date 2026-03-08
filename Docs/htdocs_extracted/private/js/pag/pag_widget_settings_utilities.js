pag_table_new["widget_settings_utilities"] = {
	onload: function()
	{
		var widget_obj = this;
		//
		if (this.loadButHide_flg)
		{
			//
		}
		else
		{
			pag_clear(".home .JSdialog");
			page_act("#settings-page");
			schema_act("#settings-page", "quadrant_abcd");
			//
			this.header_home_switch();
			this.footer_home_switch();
			//
			away_from_home();
		}
		//
		//
		if (role_str == "INST")
		{
			$(
				"#devices_areas_btn"
				+ ", #menu_phone"
				+ ", #settings_generic_btn"
				+ ", #menu_telegest"
				+ ", #menu_eventi_s"
				+ ", #menu_test_impianto_s"
				+ ", #menu_communication_s"
				+ ", #menu_utenti_s"
			).parent().removeClass("disabled");
		}
		else
		{
			$(
				"#devices_areas_btn"
				+ ", #menu_phone"
				+ ", #settings_generic_btn"
				+ ", #menu_telegest"
				+ ", #menu_eventi_s"
				+ ", #menu_test_impianto_s"
				+ ", #menu_communication_s"
				+ ", #menu_utenti_s"
			).parent().addClass("disabled");
			$("#menu_phone, #settings_generic_btn, #menu_telegest").parent().removeClass("disabled");
		}
		if (imq_get())
		{
			$(".widget_settings_utilities > .grid_container").removeClass("quattuor");
		}
		else
		{
			$(".widget_settings_utilities > .grid_container").addClass("quattuor");	
			$("#menu_eventi_s, #menu_test_impianto_s, #menu_communication_s, #menu_utenti_s").parent().addClass("disabled");
		}
		//
		$("#devices_areas_btn").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "widget_devices_areas");
		});
		$("#menu_phone").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "nav_settings_phone");
		});
		$("#settings_generic_btn").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "nav_settings_generic");
		});
		//
		$("#menu_telegest").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "nav_settings_telegest");
		});
		//
		$("#menu_eventi_s").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "widget_log");
		});
		$("#menu_test_impianto_s").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "widget_test_device");
		});
		$("#menu_communication_s").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "nav_communication");
		});
		$("#menu_utenti_s").off("click").click(function()
		{
			if (!($(this).parent().hasClass("disabled")))
				pag_change("#seeking-page .quadrant_abcd", "widget_add_other_users");
		});
		//
		slotTextClick(this.name);
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
	name: "widget_settings_utilities",
	title: "{LANG_MENU_SET}",
	loaded: false,
	loadButHide_flg: $(".widget_settings_utilities").attr("data-loadButHide") == "none" ? false : true,
	//
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			header_home_group(widget_obj);
		});
		//
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