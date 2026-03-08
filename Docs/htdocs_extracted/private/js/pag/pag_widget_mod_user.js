pag_table_new["widget_mod_user"] = {
	onload: function()
	{
		page_act("#seeking-page");
		schema_act("#seeking-page", "quadrant_abcd");
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		//if (settings_change_pwd)
			//save_step(WS_WIZARD_STEP_USER_MOD);
		var user = this.user;
		var widget_obj = this;
		//
		//
		this.no_gsm = !gsm_check();
		this.no_pstn = !pstn_check();
		//
		var pin_hide_str = ""; 
		if (user.find("code").text() != "00000" && user.find("code").text() != "000000")
			for (var i = 0; i < PINTRENSIZE; i++)
				pin_hide_str += String.fromCharCode(8226);
		//
		if (this.no_gsm)
		{
			$("#container_mod_user .events[data-evetype='sms']").addClass("disabled");
			$("#container_mod_user .direct").addClass("disabled");
		}
		if (this.no_gsm && type_conn != "CL")
		{
			$("#container_mod_user .email").trigger("switch_state_changer", [["disabled"]]);
			$("#mod_user_item_email").attr("disabled", true);
		}
		if (this.no_pstn && this.no_gsm)
		{
			$("#container_mod_user .events[data-evetype='vox']").addClass("disabled");
		}
		//
		var name_str = null;
		if (this.role_puser_flg)
			name_str = (this.user.find("name").text() == "" ? "{LANG_DEFAULT_POWERUSER_NAME_STR}" : this.user.find("name").text());
		if (this.role_inst_flg)
			name_str = (this.user.find("name").text() == "" ? "{LANG_DEFAULT_INSTALLER_NAME_STR}" : this.user.find("name").text());
		global_item_init("#container_mod_user", "name", "input", "name", this, null, name_str, null);
		if (this.user_flg) $("#container_mod_user .name").attr("disabled", true);
		//
		global_item_init("#container_mod_user", "pass", "input", "code", this, null, this.same_user_flg ? user.find("code").text() : pin_hide_str, user.find("code").attr("maxlength"));
		if (this.user_flg)
		{
			$("#mod_user_item_pass").attr("disabled", true);
		}
		else if (!this.same_user_flg /*&& !this.wzrd_flg*/ && !QT)
		{
			var cc = false;
			$("#mod_user_item_pass").on(vmousedown, function()
			{
				cc = true;
				if ($(this).val() == pin_hide_str)
					$(this).val("");
			});
			$("#container_mod_user").on(vmousedown, function()
			{
				if ($.trim($("#mod_user_item_pass").val()) == "" && !cc)
					$("#mod_user_item_pass").val(pin_hide_str);
				else
					cc = false;
			});
		}
		//
		global_switcher_binder("#container_mod_user", "ena", user);
		if (!((this.inst_flg || this.puser_flg || this.wzrd_flg) && this.role_user_flg))
			$("#container_mod_user .ena").trigger("switch_state_changer", [["disabled"]]);
		//
		global_switcher_binder("#container_mod_user", "email", null, user.children("email_ena").text());
		$("#container_mod_user .email").on("toggle_tick_click", function()
		{
			if ($(this).attr("data-checked") == "0")
			{
				$("#mod_user_item_email").attr("disabled", true);
			}
			else if ($(this).attr("data-checked") == "1")
			{
				$("#mod_user_item_email").removeAttr("disabled");
			}
		}).trigger("toggle_tick_click");
		//
		if (this.user_flg || (this.puser_flg && this.bool_imq)) $("#mod_user_item_phone").attr("disabled", true);
		if (this.user_flg || (this.puser_flg && this.bool_imq)) 
		{
			$("#mod_user_item_email").attr("disabled", true);
			$("#container_mod_user .email").trigger("switch_state_changer", [["disabled"]]);
		}
		global_item_init("#container_mod_user", "phone", "input", "tel", this, null, null, null);
		global_item_init("#container_mod_user", "email_txt", "input", "email", this, null, null, null);
		//
		global_switcher_binder("#container_mod_user", "direct", user);
		if (!(this.inst_flg || this.wzrd_flg))
			$("#container_mod_user .direct").trigger("switch_state_changer", [["disabled"]]);
		//
		//
		this.area_loader((this.inst_flg || this.puser_flg || this.wzrd_flg) && this.role_user_flg);
		//
		this.vox_msk = user.children("vox").text();
		this.sms_msk = user.children("sms").text();
		this.app_msk = user.children("app").text();
		//
		//global_apply_diag("#container_mod_user", "events[data-evetype='app']", "{LANG_WIZARD_MOD_USER_APP}", "user_events", "app", this.name);
		global_apply_diag("#container_mod_user", "events[data-evetype='sms']", "{LANG_WIZARD_MOD_USER_SMS}", "user_events", "sms", this.name);
		global_apply_diag("#container_mod_user", "events[data-evetype='vox']", "{LANG_WIZARD_MOD_USER_VOX}", "user_events", "vox", this.name);
		//
		if ((this.vox_msk.match(new RegExp("-", "g")) || []).length === this.vox_msk.length)
			$("#container_mod_user .events[data-evetype='vox'] .sl_selector").html("{LANG_ITEM_NONE}");
		else
			$("#container_mod_user .events[data-evetype='vox'] .sl_selector").html("{LANG_ITEM_AT_LEAST_ONE}");
		if ((this.sms_msk.match(new RegExp("-", "g")) || []).length === this.sms_msk.length)
			$("#container_mod_user .events[data-evetype='sms'] .sl_selector").html("{LANG_ITEM_NONE}");
		else
			$("#container_mod_user .events[data-evetype='sms'] .sl_selector").html("{LANG_ITEM_AT_LEAST_ONE}");
		//
		if (!(this.inst_flg || this.wzrd_flg || (!this.bool_imq && this.puser_flg)))
			$("#container_mod_user .events").addClass("disabled");
		//
		//
		if (this.role_user_flg)
		{
			tslotf("#container_mod_user", this.user);
		}
		else
		{
			$("#container_mod_user .tslot").remove();
		}
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "MENU")
		{
			if (conf.children("act").text() == "SAVE")
			{
				if (conf.children("res").text() == "SAVED")
				{
					if (conf.children("page").text() == WS_USER_STR)
					{
						if (this.same_user_flg)
						{
							u_p = $.trim($("#container_mod_user .pass").val());
							if (!QT && !imq_get())
								session_u_p = u_p;
						}
						//
						if (wizard_config_flg && this.role_puser_flg)
						{
							wizard_mandatory_task[this.name] = 1;
							//
							step += 2;
							save_step(step);
						}
						//
						$("#header-home-page2 .close").trigger("click");						
					}
				}
				else if (conf.children("res").text() == "ERROR")// _FT_ warn: nono distingue tra un error di salvataggio generico e un errore di password gia esistente
				{
					if (conf.children("page").text() == WS_USER_STR)
					{
						$("#container_mod_user .pass").css("background-color", "rgba(255,0,0,0.2)");
						pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_PWD_EXIST}", "ok");
					}
				}
 				else if (conf.children("res").text() == "ERROR_A")
 				{
 					if (conf.children("page").text() == WS_USER_STR)
 					{
 						$("#container_mod_user .pass").css("background-color", "rgba(255,0,0,0.2)");
 						pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_PWD_EXIST_A}", "ok");
 					}
 				}				
			}
			else if (conf.children("act").text() == "DELETE")
			{
				if (conf.children("res").text() == "DELETING")
				{
					if (conf.children("page").text() == WS_USER_STR)
					{
						//
					}
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
					if (indi.children("page").text() == WS_USER_STR)
					{
						$("#header-home-page2 .close").trigger("click");
					}
				}
			}
		}
	},
	onclose: function()
	{
		$("#wizard_header_info").text("");
		settings_change_pwd = false;
	},
	//
	name: "widget_mod_user",
	title: xml_user_tbl[$(".widget_mod_user").attr("data-user-index")].find("name").text(),
	user: xml_user_tbl[$(".widget_mod_user").attr("data-user-index")],
	xml_any: xml_user_tbl[$(".widget_mod_user").attr("data-user-index")],
	vox_msk: "",
	sms_msk: "",
	app_msk: "",
	local_msk: "",
	same_user_flg: xml_user_tbl[$(".widget_mod_user").attr("data-user-index")].find("code").text() == u_p,
	//CHI SONO
	puser_flg: role_str == "POWERUSER",
	user_flg: false, // _EO_ role_str == "USER",
	inst_flg: role_str == "INST",
	wzrd_flg: role_str == "NOROLE",
	//CHI STO MODIFICANDO
	role_inst_flg: xml_user_tbl[$(".widget_mod_user").attr("data-user-index")].children("role").text() == "INST",
	role_puser_flg: xml_user_tbl[$(".widget_mod_user").attr("data-user-index")].children("role").text() == "POWERUSER",
	role_user_flg: xml_user_tbl[$(".widget_mod_user").attr("data-user-index")].children("role").text() == "USER",
	//
	no_gsm: false,
	no_pstn: false,
	//
	bool_imq: imq_get(),
	dc10: "1",
	dcIco: "tick"+(SIL ? "_y" : ""),
	//
	area_ins: [],
	area_dis: [],
	area_insp: [],
	//
	scrollOffset: 0,
	//
	//
	user_par_save: function()
	{
		if (this.user != null)
		{
			ena_save = true;
			//
			if ((this.inst_flg || this.puser_flg || this.wzrd_flg) && this.role_user_flg)
			{
				save_item_toggled("#container_mod_user", "ena", null, this.user);
				//
				this.user.find("area_ins").text(this.aa_to_str(this.area_ins, true));
				this.user.find("area_dis").text(this.aa_to_str(this.area_dis, true));
				this.user.find("area_grp").text(this.aa_to_str(this.area_insp, true));
				//
				this.user.find("area_grp_flg").text(this.dc10);
				//
				save_item_tslot(this.user);
			}
			if ((this.inst_flg || this.puser_flg || this.wzrd_flg) && this.role_puser_flg)
			{
				this.user.find("area_grp").text(this.aa_to_str(this.area_insp, true));
				//
				this.user.find("area_grp_flg").text(this.dc10);
			}
			if (this.inst_flg || this.wzrd_flg || (!this.bool_imq && this.puser_flg))
			{
				save_item_toggled("#container_mod_user", "direct", null, this.user);
				//save_item_toggled("#container_mod_user", "app_ena", null, this.user);
				//
				this.user.children("vox").text(this.vox_msk);
				this.user.children("sms").text(this.sms_msk);
				//this.user.children("app").text(this.app_msk);
			}
			if (this.puser_flg || this.inst_flg || this.wzrd_flg)
			{
				save_item_pass("#container_mod_user", this, null, this.user);
				save_item_name("#container_mod_user", this, null, this.user);
			}
			if (this.inst_flg || this.wzrd_flg || (!this.bool_imq && this.puser_flg))
			{
				$("#container_mod_user .phone").global_save_item_val({trama_ptr: this.user.find("tel"), position: 1});
				$("#container_mod_user .email_txt").global_save_item_val({trama_ptr: this.user.find("email"), position: 1});
			}
			if (settings_change_pwd && ena_save)
			{
				this.user.find("reset_pwd_flg").text("0");
			}
			save_item_toggled("#container_mod_user", "email_ena", "email", this.user);
		}
	},
	area_loader: function(enabled)
	{
		if (!enabled)
		{
			$(".area_ins").addClass("disabled");
			$(".area_dis").addClass("disabled");
		}
		item_dev_areas("#container_mod_user", this);
	},
	aa_to_str: function(area_array, less)
	{
		return global_aa_to_str(area_array, less);
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			if ("widget_add_other_users" in pag_table_new)
				pag_table_new["widget_add_other_users"].onload();
			else
				pag_change("#seeking-page .quadrant_abcd", "widget_add_other_users");
		});
		//
		$("#backTitle").html("{LANG_WIZARD_ADD_USER_BTN}");
	},
	footer_home_switch: function()
	{
		var widget_obj = this;
		footer_home_switch_init();
		//
		//
		draw_footer_button("{LANG_OK}", "footer_h2_a_a");
		if ((this.inst_flg || this.puser_flg || this.wzrd_flg) && this.role_user_flg)
			draw_footer_button("{LANG_WIZARD_MOD_USER_DEL}", "footer_h2_a_b");
		//
		$("#footer_h2_a_a").click(function()
		{
			widget_obj.user_par_save();
			//
			xml_request = xml_request_head_build("MENU", "widget_mod_user");
			xml_par = $(XML("act")); xml_par.text("SAVE"); xml_request.append(xml_par);
			xml_par = $(XML("page")); xml_par.text(WS_USER_STR); xml_request.append(xml_par);
			xml_par = $(XML("par")); xml_request.append(xml_par);
			xml_par.append(widget_obj.user);
			if (ena_save) xml_send(xml_request);
		});
		$("#footer_h2_a_b").click(function()
		{
			pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_WDELUSER}", "okab", "#footer_h2_a_b");
		})
		.on("on_pw_ok", function()
		{
			xml_request = xml_request_head_build("MENU", "widget_mod_user");
			xml_par = $(XML("act")); xml_par.text("DELETE"); xml_request.append(xml_par);
			xml_par = $(XML("page")); xml_par.text(WS_USER_STR); xml_request.append(xml_par);
			xml_par = $(XML("par")); xml_request.append(xml_par);
			var xml_item = $(XML("item")); xml_item.attr("id", "1"); xml_par.append(xml_item);
			xml_node = $(XML("id")); xml_node.text(widget_obj.user.find("id").text()); xml_item.append(xml_node);
			xml_send(xml_request);
		});
		//
		//
		footer_button_rotate();
		scrollList(this);
	}
};