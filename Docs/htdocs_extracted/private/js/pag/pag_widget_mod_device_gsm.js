pag_table_new["widget_mod_device_gsm"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		//
		//
		picker("#container_gsm");
		//
		global_item_init("#container_gsm", "name", "input", "name", this);
		global_item_init("#container_gsm", "pin", "input", "gsm_pin", this);
		$("#container_gsm .serial").text(this.xml_any.children("sn").text());
		$("#container_gsm .ope").text(this.xml_any.children("gsm_ope").text());
		global_picker_init("#container_gsm", "sim_expire", "simexp", this);
		global_item_init("#container_gsm", "credit", "input", "gsm_cre_sms", this);
		global_item_init("#container_gsm", "prov", "input", "gsm_cre_telnum", this);
		global_item_init("#container_gsm", "apn", "input", "gprs_apn", this);
		$("#container_gsm .ip").val(this.xml_any.children("gprs_ip_adr").text());
		global_item_init("#container_gsm", "user", "input", "gprs_user", this);
		global_item_init("#container_gsm", "pwd", "input", "gprs_pwd", this);
		global_picker_init("#container_gsm", "gsm_vol_msg", "gsm_vol_msg", this);
		//
		//
		var g4_discriminator_fleg = false;
		if (this.xml_any.children("hw_type").length > 0)
			if (this.xml_any.children("hw_type").text() == "3")
				g4_discriminator_fleg = true;
		//
		if (g4_discriminator_fleg)
		{
			global_switcher_binder("#container_gsm", "data_ena_flg", this.xml_any, null, null, null);
			global_switcher_binder("#container_gsm", "data_sms_only_flg", this.xml_any, null, null, null);
			$("#container_gsm .data_ena_flg").off("toggle_tick_click").on("toggle_tick_click", function()
			{
				if ($(this).attr("data-checked") == "0")
					$("#container_gsm .data_sms_only_flg").trigger("switch_state_changer", [["disabled", "off"]]);
				else
					$("#container_gsm .data_sms_only_flg").trigger("switch_state_changer", [["enabled"]]);
			}).trigger("toggle_tick_click");
		}
		else
		{
			$("#container_gsm .data_ena_flg, #container_gsm .data_sms_only_flg").parent().addClass("unavailable");
		}
		//
		//
		item_fw_ver("#container_gsm", this.xml_any);
		//
		item_delete("#container_gsm", this);
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
						$("#header-home-page2 .close").trigger("click", [true]);
					}
				}
				else if (conf.children("res").text() == "ERROR")
				{
					alert(conf.children("res").text()+": "+conf.children("desc").text());
				}
			}
			else if (conf.children("act").text() == "DELETE")
			{
				if (conf.children("res").text() == "DELETING")
				{
					if (conf.children("page").text() == WS_DEV_STR)
					{
						//
					}
				}
				else if (conf.children("res").text() == "ERROR")
				{
					alert(conf.children("res").text()+": "+conf.children("desc").text());
				}
			}
		}
	},
	onrecv_indication: function(indi)
	{
		if (indi.attr("type") == "MENU")
		{
			if (indi.children("act").text() == "DELETE")
			{
				if (indi.children("res").text() == "DELETED")
				{
					if (indi.children("page").text() == WS_DEV_STR)
					{
						refresh_set_email_from_gsm_dev = true;
						//
						$("#header-home-page2 .close").trigger("click", [true]);
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
	name: "widget_mod_device_gsm",
	xml_any: xml_any_tbl[any_ind],
	title: xml_any_tbl[any_ind].children("name").text(),
	//
	par_save: function()
	{
		ena_save = true;
		//
		save_item_name("#container_gsm", this);
		save_item_picker("#container_gsm", "sim_expire", "simexp", this.xml_any);
		$("#container_gsm .pin").global_save_item_val({trama_ptr: this.xml_any.children("gsm_pin"), position: 0, check_func: this.pure_number_check_fourdig, extra: this.xml_any.children("gsm_pin").attr("maxlength")+","+this.xml_any.children("gsm_pin").attr("minlength")});
		$("#container_gsm .credit").global_save_item_val({trama_ptr: this.xml_any.children("gsm_cre_sms"), position: 0});
		$("#container_gsm .prov").global_save_item_val({trama_ptr: this.xml_any.children("gsm_cre_telnum"), position: 0, check_func: this.phone_number_check, extra: this.xml_any.children("gsm_cre_telnum").attr("maxlength")+","+this.xml_any.children("gsm_cre_telnum").attr("minlength")});
		$("#container_gsm .apn").global_save_item_val({trama_ptr: this.xml_any.children("gprs_apn"), position: $("#container_gsm .pwd").closest(".entire").index()});
		$("#container_gsm .ip").global_save_item_val({trama_ptr: this.xml_any.children("gprs_ip_adr"), position: 1, check_func: this.check_address});
		$("#container_gsm .user").global_save_item_val({trama_ptr: this.xml_any.children("gprs_user"), position: $("#container_gsm .pwd").closest(".entire").index()});
		$("#container_gsm .pwd").global_save_item_val({trama_ptr: this.xml_any.children("gprs_pwd"), position: $("#container_gsm .pwd").closest(".entire").index()});
		save_item_picker("#container_gsm", "gsm_vol_msg", "gsm_vol_msg", this.xml_any);
		save_item_toggled("#container_gsm", "data_ena_flg", "data_ena_flg", this.xml_any, null, null);
		save_item_toggled("#container_gsm", "data_sms_only_flg", "data_sms_only_flg", this.xml_any, null, null);
		if (this.xml_any.children("data_ena_flg").text() == "0") this.xml_any.children("data_sms_only_flg").text("0");
	},
	phone_number_check: function(minmax)
	{
		var maxlength = minmax.split(",")[0];
		var minlength = minmax.split(",")[1];
		//
		var value_str = "";
		value_str += $.trim($(this).val());
		value_str = value_str.replaceAll("*", "0");
		value_str = value_str.replaceAll("+", "0");
		value_str = value_str.replaceAll("#", "0");
		//
		return (!isNaN(value_str) && value_str.length <= maxlength && value_str.length >= minlength) || value_str == "";
	},
	check_address: function()
	{
		var val_array = $(this).val().split(".");
		if (val_array.length != 4)
		{
			return false;
		}
		else
		{
			for (var i = 0; i < val_array.length; i++)
			{
				if (isNaN(val_array[i]))
					return false;
				else if (val_array[i] < 0 || val_array[i] > 255 || val_array[i] == "")
					return false;
			}
		}
		return true;
	},
	pure_number_check: function()
	{
		var value_str = "";
		value_str += $(this).val();
		//
		return !isNaN(value_str);
	},
	pure_number_check_fourdig: function(minmax)
	{
		var maxlength = minmax.split(",")[0];
		var minlength = minmax.split(",")[1];
		//
		var value_str = "";
		value_str += $(this).val();
		if (value_str.length < maxlength && value_str.length > minlength || value_str.length > maxlength)
			return false;
		//
		return !isNaN(value_str);
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		header_mod_device(this);
	},
	footer_home_switch: function()
	{
		var widget_obj = this;
		footer_home_switch_init();
		//
		draw_footer_button("{LANG_OK}", "footer_h2_a_a");
		draw_footer_button("{LANG_WIZARD_MOD_DEVICE_DEL}", "footer_h2_a_b"); //gestito nella item_delete()
		//
		$("#footer_h2_a_a").click(function()
		{
			global_send_dev_mod_save(widget_obj);
		});
		//
		footer_button_rotate();
		scrollList(this);
	}
};