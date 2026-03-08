pag_table_new["widget_parvig"] = {
	onload: function()
	{
		page_act("#seeking-page");
		schema_act("#seeking-page", "quadrant_abcd");
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		//save_step(WS_WIZARD_STEP_VIG_PAR);
		//
		//
		xml_request = xml_request_head_build("SCENE_LOAD", "widget_parvig");
		xml_send(xml_request);
		xml_menu_load_send("VIG", null, null, "widget_parvig", null);
		//
		//
		global_picker_init("#container_parvig", "periodic_ini_hour", "periodic_begin", this);
		//
		global_picker_init("#container_parvig", "periodic", null, this);
		$("#container_parvig .periodic").off("pick_extra_func").on("pick_extra_func", function()
		{
			if ($("#container_parvig .pick_periodic").text() == "0")
				$("#container_parvig .periodic_begin").addClass("disabled");
			else
				$("#container_parvig .periodic_begin").removeClass("disabled");
		});
		//
		item_gsm_priority("#container_parvig", this);
		//
		global_switcher_binder("#container_parvig", "cloud_pow_down_ena", this.xml_any, this.xml_any.children("cloud_pow_down_ena").length == 0 ? -1 : null, {condizione: "1", messaggio: "{LANG_EN50131}"});
		//
		global_switcher_binder("#container_parvig", "ave_automation_st_ena", this.xml_any);
		global_switcher_binder("#container_parvig", "ave_automation_ena", this.xml_any, null, {condizione: "1", messaggio: "{LANG_EN50131}"});
		$("#container_parvig .ave_automation_ena").on("toggle_tick_click", function()
		{
			if ($(this).attr("data-checked") == "0")
				$("#container_parvig .ave_automation_st_ena").trigger("switch_state_changer", [["disabled"]]);
			else if ($(this).attr("data-checked") == "1")
				$("#container_parvig .ave_automation_st_ena").trigger("switch_state_changer", [["enabled"]]);
		}).trigger("toggle_tick_click");
		//
		global_switcher_binder("#container_parvig", "ave_iot_ena", this.xml_any);
		global_switcher_binder("#container_parvig", "wifi_gateway_reboot_ena", this.xml_any);
		global_switcher_binder("#container_parvig", "wifi_internet_reboot_ena", this.xml_any);
		//
		//global_item_init("#container_parvig", "cloud_port", "input", "cloud_port", this, null, null, this.xml_any.children("cloud_port").attr("maxlength"));
		//global_item_init("#container_parvig", "telegest_port", "input", "telegest_port", this, null, null, this.xml_any.children("telegest_port").attr("maxlength"));
		//
		picker("#container_parvig");
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
						$(".footer_container_btn_inside").trigger("parvig_saved");
					}
					else if (conf.children("page").text() == WS_VIG_STR)
					{
						global_send_dev_mod_save(this, true, false, WS_SET_STR, false, true);
					}
				}
				else if (conf.children("res").text() == "ERROR")
				{
					alert(conf.children("res").text()+": "+conf.children("desc").text());
				}
			}
			else if (conf.children("act").text() == "LOAD")
			{
				if (conf.children("res").text() == "LOADED")
				{
					if (conf.children("page").text() == WS_VIG_STR)
					{
						loadVig(conf.find("par"), this);
					}
				}
				else if (conf.children("res").text() == "ERROR")
				{
					alert(conf.children("res").text()+": "+conf.children("desc").text());
				}
			}
		}
		else if (conf.attr("type") == "SCENE_LOAD")
		{
			var widget_obj = this;
			conf.find("Scenes Scene[id='S1'], Scenes Scene[id='S2'], Scenes Scene[id='S3']").each(function(index)
			{
				widget_obj.xml_scenes[$(this).attr("id")] = $(this);
				widget_obj.scenes_save_flg[$(this).attr("id")] = false;
			});
			//
			item_rescue("#container_parvig", "rescue", this);
			item_panic("#container_parvig", "panic", this);
			item_aggression("#container_parvig", "aggression", this);
		}
		else if (conf.attr("type") == "SCENE_EDIT")
		{
			var widget_obj = this;
			this.wait_for_resp--;
			//
			if (this.wait_for_resp == 0)
			{
				if (!this.xml_vig_save.is(":empty"))
				{
					xml_request = xml_request_head_build("MENU", "widget_parvig");
					xml_par = $(XML("act")); xml_par.text("SAVE"); xml_request.append(xml_par);
					xml_par = $(XML("page")); xml_par.text("VIG"); xml_request.append(xml_par);
					xml_request.append(this.xml_vig_save);
					xml_send(xml_request);
				}
				else
				{
					global_send_dev_mod_save(this, true, false, WS_SET_STR, false, true);
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
	name: "widget_parvig",
	title: "{LANG_WIZARD_PARVIG_TITLE}",
	xml_any: cen_set_xml.clone(),
	gsm_priority: null,
	notifyStruct: [],
	checkSaveStruct: [],
	xml_vig: null,
	xml_vig_save: null,
	xml_scenes: [],
	scenes_save_flg: [],
	wait_for_resp: 0,
	//
	par_save: function()
	{
		ena_save = true;
		//
		saveVig("#container_parvig", this);
		//
		save_item_picker("#container_parvig", "periodic_ini_hour", "periodic_begin", this.xml_any);
		//
		save_item_picker("#container_parvig", "periodic", "periodic", this.xml_any);
		//
		save_item_toggled("#container_parvig", "ave_automation_ena", null, this.xml_any);
		save_item_toggled("#container_parvig", "ave_automation_st_ena", null, this.xml_any);
		//
		this.xml_any.children("gsm_priority").text(this.gsm_priority);
		//
		save_item_rescue("#container_parvig", this);
		save_item_panic("#container_parvig", this);
		save_item_aggression("#container_parvig", this);
		//
		if (this.xml_any.children("cloud_pow_down_ena").length > 0)
			save_item_toggled_manual("#container_parvig", "cloud_pow_down_ena", "cloud_pow_down_ena", null, this);
		//$("#container_parvig .cloud_port").global_save_item_val({xml_any_o: this.xml_any, trama: "cloud_port", position: 5});
		//$("#container_parvig .telegest_port").global_save_item_val({xml_any_o: this.xml_any, trama: "telegest_port", position: 5});
		//
		//save notify vig function
		//
		//save_item_toggled_manual("#container_parvig", "cloud", "cloud_ena", null, this);
		//
		save_item_toggled("#container_parvig", "ave_iot_ena", null, this.xml_any);
		save_item_toggled("#container_parvig", "wifi_gateway_reboot_ena", null, this.xml_any);
		save_item_toggled("#container_parvig", "wifi_internet_reboot_ena", null, this.xml_any);
	},
	send_parvig_save: function()
	{
		this.par_save();
		//
		if (ena_save)
		{
			var salvato = false;
			//
			this.wait_for_resp = 0;
			for (var key in this.xml_scenes)
			{
				if (this.scenes_save_flg[key])
				{
					salvato = true;
					//
					this.wait_for_resp++;
					//
					xml_request = xml_request_head_build("SCENE_EDIT", "widget_parvig");
					xml_request.append(this.xml_scenes[key]);
					xml_send(xml_request);
				}
			}
			//
			if (!salvato)
			{
				if (!this.xml_vig_save.is(":empty"))
				{
					xml_request = xml_request_head_build("MENU", "widget_parvig");
					xml_par = $(XML("act")); xml_par.text("SAVE"); xml_request.append(xml_par);
					xml_par = $(XML("page")); xml_par.text("VIG"); xml_request.append(xml_par);
					xml_request.append(this.xml_vig_save);
					xml_send(xml_request);
				}
				else
				{
					global_send_dev_mod_save(this, true, false, WS_SET_STR, false, true);		
				}
			}
		}
	},
	standard_input_check: function(value, id, tag, gui)
	{
		var item = this.xml_vig.find("item").filter(function()
		{
			if ($(this).children("id").text() == id)
				return true;
			else return false;
		});
		var itemTag = item.children(tag);
		var ub = 32;
		var lb = 0;
		if (itemTag.hasAttr("maxlength") && itemTag.hasAttr("minlength"))
		{
			ub = itemTag.attr("maxlength");
			lb = itemTag.attr("minlength");
		}
		//
		if (value.length > ub || value.length < lb)
		{
			$("#container_parvig .vig[data-id=" + id + "] ." + gui).addClass("fault");
			if (ena_save)
			{
				var pos = $("#container_parvig .vig[data-id=" + id + "] ." + gui).parent()[0].offsetTop;
				scrollTo(this, pos);
			}
			ena_save = false;
		}
		else
		{
			$("#container_parvig .vig[data-id="+id+"] ."+gui).removeClass("fault");
		}
		//
		return value;
	},
	hexA_input_check: function(value, id, tag, gui)
	{
		var item = this.xml_vig.find("item").filter(function()
		{
			if ($(this).children("id").text() == id)
				return true;
			else return false;
		});
		var itemTag = item.children(tag);
		var ub = 32;
		var lb = 0;
		if (itemTag.hasAttr("maxlength") && itemTag.hasAttr("minlength"))
		{
			ub = itemTag.attr("maxlength");
			lb = itemTag.attr("minlength");
		}
		//
		var value_str = value;
		var reg = new RegExp("[b-f0-9]{"+lb+","+ub+"}", "i"); //controllo esadecimale senza 'a': si cerca stringa da 'b' a 'f' o da '0' a '9' che abbia lunghezza min 'lb' max 'ub'
		if (value_str.search(reg) == 0)	//search e' simile ad indexOf ma riconosce anche le regex. Se la regex parte dal primo carattere allora va bene 
			value_str = true;
		else
			value_str = false;
		//
		if (value.length > ub || value.length < lb || value_str == false)
		{
			$("#container_parvig .vig[data-id=" + id + "] ." + gui).addClass("fault");
			if (ena_save)
			{
				var pos = $("#container_parvig .vig[data-id=" + id + "] ." + gui).closest(".entire")[0].offsetTop;
				scrollTo(this, pos);
			}
			ena_save = false;
		}
		else
		{
			$("#container_parvig .vig[data-id=" + id + "] ." + gui).removeClass("fault");
		}
		//
		return value;
	},
	phone_number_check: function(value, id, tag, gui)
	{
		var item = this.xml_vig.find("item").filter(function()
		{
			if ($(this).children("id").text() == id)
				return true;
			else return false;
		});
		var itemTag = item.children(tag);
		var ub = 32;
		var lb = 0;
		if (itemTag.hasAttr("maxlength") && itemTag.hasAttr("minlength"))
		{
			ub = itemTag.attr("maxlength");
			lb = itemTag.attr("minlength");
		}
		//
		var value_str = value;
		value_str = $.trim(value_str);
		value_str = value_str.replaceAll("*", "0");
		value_str = value_str.replaceAll("+", "0");
		value_str = value_str.replaceAll("#", "0");
		//
		if (value.length > ub || value.length < lb || isNaN(value_str))
		{
			$("#container_parvig .vig[data-id=" + id + "] ." + gui).addClass("fault");
			if (ena_save)
			{
				var pos = $("#container_parvig .vig[data-id=" + id + "] ." + gui).closest(".entire")[0].offsetTop;
				scrollTo(this, pos);
			}
			ena_save = false;
		}
		else
		{
			$("#container_parvig .vig[data-id=" + id + "] ." + gui).removeClass("fault");
		}
		//
		return value;
	},
	check_address: function(value, id, gui)
	{
		var valid = true;
		//
		var val_array = $.trim(value).split(".");
		if (val_array.length != 4)
		{
			valid = false;
		}
		else
		{
			for (var i = 0; i < val_array.length; i++)
			{
				if (isNaN(val_array[i]))
				{
					valid = false;
				}
				else if (val_array[i] < 0 || val_array[i] > 255 || val_array[i] == "")
				{
					valid = false;
				}
			}
		}
		//
		if (!valid)
		{
			$("#container_parvig .vig[data-id=" + id + "] ." + gui).addClass("fault");
			if (ena_save)
			{
				var pos = $("#container_parvig .vig[data-id=" + id + "] ." + gui).closest(".entire")[0].offsetTop;
				scrollTo(this, pos);
			}
			ena_save = false;
		}
		else
		{
			$("#container_parvig .vig[data-id=" + id + "] ." + gui).removeClass("fault");
		}
		//
		return value;
	},
	port_check: function(value, id, gui)
	{
		var valid = true;
		//
		var value_str = "";
		value_str += value;
		if (isNaN(value_str))
			valid = false;
		if (value_str >= 1 && value_str <= 65535)
		;
		else
			valid = false;
		//
		if (!valid)
		{
			$("#container_parvig .vig[data-id=" + id + "] ." + gui).addClass("fault");
			if (ena_save)
			{
				var pos = $("#container_parvig .vig[data-id=" + id + "] ." + gui).closest(".entire")[0].offsetTop;
				scrollTo(this, pos);
			}
			ena_save = false;
		}
		else
		{
			$("#container_parvig .vig[data-id=" + id + "] ." + gui).removeClass("fault");
		}
		//
		return value;
	},
	aeskey_check: function(value, id, gui)
	{
		if (value.length == 0) return value;
		//		
		value = value.toUpperCase();
		if (value.search(/[a-f0-9]{32}/i) == -1)
		{
			$("#container_parvig .vig[data-id=" + id + "] ." + gui).addClass("fault");
			if (ena_save)
			{
				var pos = $("#container_parvig .vig[data-id=" + id + "] ." + gui).closest(".entire")[0].offsetTop;
				scrollTo(this, pos);
			}
			ena_save = false;
		}
		//
		return value;
	},
	aeskey_check_diag: function(value)
	{
		if (value.length == 0) return true;
		//		
		value = value.toUpperCase();
		if (value.search(/[a-f0-9]{32}/i) == -1)
		{
			return false;
		}
		//
		return true;
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
		footer_button_rotate();
		scrollList(this);
	}
};