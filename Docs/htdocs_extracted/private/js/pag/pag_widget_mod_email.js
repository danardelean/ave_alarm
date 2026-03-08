pag_table_new["widget_mod_email"] = {
	onload: function()
	{
		page_act("#seeking-page");
		schema_act("#seeking-page", "quadrant_abcd");
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		//
		xml_menu_load_send(WS_SERVICES_STR, null, null, "widget_mod_email");
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "MENU")
		{
			if (conf.children("act").text() == "SAVE")
			{
				if (conf.children("res").text() == "SAVED")
				{
					if (conf.children("page").text() == WS_SERVICES_STR)
					{
						$(".footer_container_btn_inside").trigger("email_saved");
					}
					else if (conf.children("page").text() == WS_SET_STR)
					{
						cen_set_xml = this.xml_set;
						//
						global_send_dev_mod_save(this, null, false, WS_SERVICES_STR, null, false);
					}
				}
				else if (conf.children("res").text() == "ERROR")
				{
					if (conf.children("page").text() == WS_USER_STR)
					{
						alert(conf.children("res").text()+": "+conf.children("desc").text());
					}
				}
			}
			if (conf.children("act").text() == "LOAD")
			{
				if (conf.children("res").text() == "LOADED")
				{
					if (conf.children("page").text() == WS_SERVICES_STR)
					{
						this.xml_any = conf.find("par email");
						//
						global_switcher_binder("#container_email", "email", this.xml_set, this.xml_set.children("email_ena").text());
						//
						global_item_init("#container_email", "smtp", "input", "smtp", this);
						//
						global_item_init("#container_email", "port", "input", "port", this);
						//
						global_switcher_binder("#container_email", "ssl", this.xml_any);
						//
						global_item_init("#container_email", "user", "input", "user", this);
						//
						global_item_init("#container_email", "password", "input", "password", this);
						//
						global_item_init("#container_email", "from", "input", "from", this);
					}
				}
				else if (conf.children("res").text() == "ERROR")
				{
					if (conf.children("page").text() == WS_SERVICES_STR)
					{
						alert(conf.children("res").text()+": "+conf.children("desc").text());
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
	name: "widget_mod_email",
	title: "{LANG_WIZARD_MOD_USER_EMAIL}",
	xml_any: null,
	xml_set: cen_set_xml.clone(),
	//
	par_save: function()
	{
		ena_save = true;
		//
		save_item_toggled("#container_email", "email_ena", "email", this.xml_set, null);
		//
		$("#container_email .smtp").global_save_item_val({trama_ptr: this.xml_any.children("smtp")});
		//
		$("#container_email .port").global_save_item_val({trama_ptr: this.xml_any.children("port"), check_func: this.port_check});
		//
		save_item_toggled("#container_email", "ssl", "ssl", this.xml_any, null);
		//
		$("#container_email .user").global_save_item_val({trama_ptr: this.xml_any.children("user")});
		//
		$("#container_email .password").global_save_item_val({trama_ptr: this.xml_any.children("password")});
		//
		$("#container_email .from").global_save_item_val({trama_ptr: this.xml_any.children("from")});
	},
	port_check: function()
	{
		var value_str = "";
		value_str += $(this).val();
		if (isNaN(value_str))
			return false;
		if (value_str >= 1 && value_str <= 65535)
			return true;
		else
			return false;
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
		draw_footer_button("{LANG_OK}", "footer_h2_a_a");
		//
		$("#footer_h2_a_a").click(function()
		{
			widget_obj.par_save();
			//
			xml_request = xml_request_head_build("MENU", "widget_mod_email");
			xml_par = $(XML("act")); xml_par.text("SAVE"); xml_request.append(xml_par);
			xml_par = $(XML("page")); xml_par.text(WS_SET_STR); xml_request.append(xml_par);
			xml_par = $(XML("par")); xml_request.append(xml_par);
			xml_par.append(widget_obj.xml_set);
			if (ena_save) xml_send(xml_request);
		}).on("email_saved", function()
		{
			$("#header-home-page2 .close").trigger("click");
		});
		//
		footer_button_rotate();
		scrollList(this);
	}
};