pag_table_new["widget_new_plant"] = {
	onload: function()
	{
		page_act("#seeking-page");
		schema_act("#seeking-page", "quadrant_abcd");
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		//save_step(WS_WIZARD_STEP_IMPIANTO);
		//
		//
		$("#new_plant_name").children("input").val(cen_name);
		//
		summary_highlighter(this);
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "MENU")
		{
			if (conf.children("act").text() == "SAVE")
			{
				if (conf.children("res").text() == "SAVED")
				{
					if (conf.children("page").text() == WS_DEV_STR)
					{
						cen_name = $("#new_plant_name").children("input").val();
						iName_adv();
						xml_cen = this.xml_any;
						$(".footer_container_btn_inside").trigger("system_name_saved"); 
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
		$("#wizard_header_info").text("");
	},
	//
	name: "widget_new_plant",
	title: "{LANG_NAV_SETTINGS_GENERIC_PLANT}",
	xml_any: xml_cen.clone(),
	//
	par_save: function()
	{
		ena_save = true;
		//
		this.xml_any.children("name").text($("#new_plant_name").children("input").val());
	},
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
			global_send_dev_mod_save(widget_obj);
		});
		$("#footer_h2_a_a").on("system_name_saved", function()
		{
			if (wizard_flg)
			{
				poptoast("{LANG_ITEM_SAVED}");
			}
			else
			{
				$("#header-home-page2 .close").trigger("click");
			}
		});
		//
		footer_button_rotate();
		scrollList(this);
	}
};