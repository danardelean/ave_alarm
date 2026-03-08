pag_table_new["widget_telegest"] = {
	onload: function()
	{
		page_act("#seeking-page");
		schema_act("#seeking-page", "quadrant_abcd");
		this.header_home_switch();
		this.footer_home_switch();
		//
		var widget_obj = this;
		//
		this.loaded = true;
		//
		xml_menu_load_send("USER", "INST", null, "widget_telegest");
		//
		$("#menu_condivisione").off("click").click(function()
		{
			if ($(this).hasClass("share_status_on"))
			{
				clearTimeout(widget_obj.t_out_telegest);
				widget_obj.t_out_telegest = setTimeout(function()
				{
					widget_obj.share_state = -1;
					widget_obj.update_status();
				}, widget_obj.time_t * 1000);
				//
				$(this).removeClass("share_status_on share_status_off");
				$(this).addClass("share_status_off");
				$(this).siblings(".text").html("{LANG_WIDGET_TELEGEST_CALL_BTN_OFF_PROGRESS}");
				//
				xml_request = xml_request_head_build("MENU");
				xml_par = $(XML("page")); xml_par.text("UTILITY"); xml_request.append(xml_par);
				xml_par = $(XML("act")); xml_par.text("TELEGEST_SHARE_DIS"); xml_request.append(xml_par);
				xml_send(xml_request);	
			}
			else if ($(this).hasClass("share_status_off"))
			{
				clearTimeout(widget_obj.t_out_telegest);
				widget_obj.t_out_telegest = setTimeout(function()
				{
					widget_obj.share_state = -1;
					widget_obj.update_status();
				}, widget_obj.time_t * 1000);
				//
				$(this).removeClass("share_status_on share_status_off");
				$(this).addClass("share_status_on");
				$(this).siblings(".text").html("{LANG_WIDGET_TELEGEST_CALL_BTN_ON_PROGRESS}");
				//
				xml_request = xml_request_head_build("MENU");
				xml_par = $(XML("page")); xml_par.text("UTILITY"); xml_request.append(xml_par);
				xml_par = $(XML("act")); xml_par.text("TELEGEST_SHARE_ENA"); xml_request.append(xml_par);
				xml_send(xml_request);
			}
		});
		//
		slotTextClick(this.name);
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
						var widget_obj = this;
						//
						this.instMail = conf.find("par item email").text();
						//
						this.share_state = -1;
						this.update_status();
						//
						xml_request = xml_request_head_build("MENU");
						xml_par = $(XML("page")); xml_par.text("UTILITY"); xml_request.append(xml_par);
						xml_par = $(XML("act")); xml_par.text("TELEGEST_SHARE_REFRESH"); xml_request.append(xml_par);
						xml_send(xml_request);
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
	name: "widget_telegest",
	title: "{LANG_WIDGET_TELEGEST_TITLE}",
	loaded: false,
	instMail: "",
	share_state: -1,
	t_out_telegest: null,
	time_t: 10,
	//
	clean_page: function()
	{
		this.loaded = false;
	},
	update_status: function() //chiamata anche da main_status_get()
	{
		var mc = $("#menu_condivisione");
		mc.removeClass("share_status_on share_status_off");
		clearTimeout(this.t_out_telegest);
		//
		if (this.share_state == 1)
		{
			mc.siblings(".text").html("{LANG_WIDGET_TELEGEST_CALL_BTN_OFF}");
			mc.siblings(".head_text").html("{LANG_WIDGET_TELEGEST_HEAD}" + xml_file_configuration.find("Users User[role='INST']").attr("login") + ", " + this.instMail);
			mc.addClass("share_status_on");
		}
		else if (this.share_state == 0)
		{
			mc.siblings(".text").html("{LANG_WIDGET_TELEGEST_CALL_BTN_ON}");
			mc.siblings(".head_text").html("");
			mc.addClass("share_status_off");
		}
		else // -1, null
		{
			mc.siblings(".head_text").html("");
			this.t_out_telegest = setTimeout(function()
			{
				mc.siblings(".text").html("{LANG_WIDGET_TELEGEST_CALL_BTN_KO}");
			}, this.time_t * 1000);
			mc.siblings(".text").html("{LANG_WIDGET_TELEGEST_CALL_BTN_REQ}");
		}
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			widget_obj.clean_page();
			pag_change("#seeking-page .quadrant_abcd", "nav_settings_telegest");
		});
		//
		$("#backTitle").html("{LANG_NAV_SETTINGS_TELEGEST}");
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