pag_table_new["widget_cloud"] = {
	onload: function()
	{
		if ($("." + this.name).closest("#seeking-page").length == 1)
		{
			page_act("#seeking-page");
			schema_act("#seeking-page", "quadrant_abcd");
		}
		else if ($("." + this.name).closest("#settings-page").length == 1)
		{
			pag_clear(".home .JSdialog");
			page_act("#settings-page");
			schema_act("#settings-page", "quadrant_abcd");
		}
		else
		{
			tyu("contenitore errato");
		}
		this.header_home_switch();
		this.footer_home_switch();
		//
		away_from_home();
		//
		var widget_obj = this;
		//
		//cloud_plant_code
		$("#cloud_plant_code").off("input").on("input", function(event)
		{
			if (pressed_char_filter(event, event.originalEvent.data, "HEX"));
			else
				$(this).val($(this).val().slice(0, -1));
		});
		//
		//
		global_switcher_binder("#container_cloud", "cloud_monitor_ena", null, this.xml_any.children("ave_cloud_monitor_ena").text());
		global_switcher_binder("#container_cloud", "cloud_ena", this.xml_any);
		global_item_init("#container_cloud", "cloud_plant_code", "input", "cloud_code", this);
		global_item_init("#container_cloud", "cloud_pass", "input", "cloud_pwd", this);
		//
		this.cloud_push_msk = this.xml_any.children("cloud_push_msk").text();
		global_apply_diag("#container_cloud", "events[data-evetype='push']", "{LANG_WIZARD_MOD_USER_APP}", "user_events", "push", "widget_cloud");
		if ((this.cloud_push_msk.match(new RegExp("-", "g")) || []).length === this.cloud_push_msk.length)
			$("#container_cloud .events[data-evetype='push'] .sl_selector").html("{LANG_ITEM_NONE}");
		else
			$("#container_cloud .events[data-evetype='push'] .sl_selector").html("{LANG_ITEM_AT_LEAST_ONE}");
		//
		global_item_init("#container_cloud", "ave_cloud_tunnel_url", "input", "ave_cloud_tunnel_url", this);
		global_item_init("#container_cloud", "ave_cloud_telegest_tunnel_url", "input", "ave_cloud_telegest_tunnel_url", this);
		global_item_init("#container_cloud", "ave_cloud_tunnel_user", "input", "ave_cloud_tunnel_user", this);
		global_item_init("#container_cloud", "ave_cloud_api_url", "input", "ave_cloud_api_url", this);
		global_item_init("#container_cloud", "ave_cloud_api_port", "input", "ave_cloud_api_port", this);
		global_switcher_binder("#container_cloud", "ave_cloud_api_ssl", this.xml_any);
		global_item_init("#container_cloud", "ave_cloud_push_url", "input", "ave_cloud_push_url", this);
		global_item_init("#container_cloud", "ave_cloud_push_port", "input", "ave_cloud_push_port", this);
		global_switcher_binder("#container_cloud", "ave_cloud_push_ssl", this.xml_any);
		//
		var tmp_str = "";
		for (var i = 0; i < this.xml_any.find("ave_cloud_push_user").text().length; i++) tmp_str += String.fromCharCode(8226);
		global_item_init("#container_cloud", "ave_cloud_push_user", "input", "ave_cloud_push_user", this, null, tmp_str);
		tmp_str = "";
		for (var i = 0; i < this.xml_any.find("ave_cloud_push_pwd").text().length; i++) tmp_str += String.fromCharCode(8226);
		global_item_init("#container_cloud", "ave_cloud_push_pwd", "input", "ave_cloud_push_pwd", this, null, tmp_str);
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "MENU")
		{		
			if (conf.children("act").text() == "SAVE")
			{
				if (conf.children("res").text() == "SAVED")
				{
					if (conf.children("page").text() == WS_SET_STR)
					{
						cen_set_xml = this.xml_any;
						//
						$("#header-home-page2 .close").trigger("click");
					}
				}
				else if (conf.children("res").text() == "ERROR")
				{
					tyu(conf.children("res").text()+": "+conf.children("desc").text());
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
	name: "widget_cloud",
	title: "{LANG_CLOUD_STR}",
	xml_any: cen_set_xml.clone(),
	local_msk: "",
	cloud_push_msk: "",
	//
	par_save: function()
	{
		ena_save = true;
		//
		save_item_toggled("#container_cloud", "ave_cloud_monitor_ena", "cloud_monitor_ena", this.xml_any, null);
		save_item_toggled("#container_cloud", "cloud_ena", "cloud_ena", this.xml_any, null);
		$("#cloud_plant_code").global_save_item_val({trama_ptr: this.xml_any.children("cloud_code"), check_func: this.pcode_check});
		$("#cloud_pass").global_save_item_val({trama_ptr: this.xml_any.children("cloud_pwd")});
		//
		this.xml_any.children("cloud_push_msk").text(this.cloud_push_msk);
		//
		$("#ave_cloud_tunnel_url").global_save_item_val({trama_ptr: this.xml_any.children("ave_cloud_tunnel_url")});
		$("#ave_cloud_telegest_tunnel_url").global_save_item_val({trama_ptr: this.xml_any.children("ave_cloud_telegest_tunnel_url")});
		$("#ave_cloud_tunnel_user").global_save_item_val({trama_ptr: this.xml_any.children("ave_cloud_tunnel_user")});
		$("#ave_cloud_api_url").global_save_item_val({trama_ptr: this.xml_any.children("ave_cloud_api_url")});
		$("#ave_cloud_api_port").global_save_item_val({trama_ptr: this.xml_any.children("ave_cloud_api_port"), check_func: this.port_check});
		save_item_toggled("#container_cloud", "ave_cloud_api_ssl", "ave_cloud_api_ssl", this.xml_any, null);
		$("#ave_cloud_push_url").global_save_item_val({trama_ptr: this.xml_any.children("ave_cloud_push_url")});
		$("#ave_cloud_push_port").global_save_item_val({trama_ptr: this.xml_any.children("ave_cloud_push_port"), check_func: this.port_check});
		save_item_toggled("#container_cloud", "ave_cloud_push_ssl", "ave_cloud_push_ssl", this.xml_any, null);
		//
		if ($("#ave_cloud_push_user").val().indexOf(String.fromCharCode(8226)) == -1)
			$("#ave_cloud_push_user").global_save_item_val({trama_ptr: this.xml_any.children("ave_cloud_push_user")});
		if ($("#ave_cloud_push_pwd").val().indexOf(String.fromCharCode(8226)) == -1)
			$("#ave_cloud_push_pwd").global_save_item_val({trama_ptr: this.xml_any.children("ave_cloud_push_pwd")});
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
	pcode_check: function() //HEX check
	{
		var value_str = "";
		value_str += $(this).val().trim();
		var park = parseInt(value_str, 16);
		var res = (park.toString(16) === value_str.toLowerCase()) || value_str.length == 0;
		return (res);
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			if ($("." + widget_obj.name).closest("#seeking-page").length == 1)
			{
				header_nav_communication_group(widget_obj);
			}
			else if ($("." + widget_obj.name).closest("#settings-page").length == 1)
			{
				header_home_group(widget_obj);
			}
			else
			{
				tyu("contenitore errato");
			}
		});
		//
		if ($("." + this.name).closest("#seeking-page").length == 1)
		{
			$("#backTitle").html("{LANG_NAV_HOME_COMMUNICATION}");
		}
		else if ($("." + this.name).closest("#settings-page").length == 1)
		{
			$("#backTitle").html("{LANG_HOME}");
		}
	},
	footer_home_switch: function()
	{
		var widget_obj = this;
		footer_home_switch_init();
		//
		//
		draw_footer_button("{LANG_OK}", "footer_h2_a_a");
		//
		$("#footer_h2_a_a").click(function()
		{
			if (widget_obj.name == "widget_parvig")
				widget_obj.send_parvig_save();
			else
				global_send_dev_mod_save(widget_obj, null, null, WS_SET_STR, null, null);
		});
		$("#footer_h2_a_a").on("parvig_saved", function()
		{
			$("#header-home-page2 .close").trigger("click");
		});
		//
		//
		footer_button_rotate();
		scrollList(this);
	}
};