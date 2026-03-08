pag_table_new["widget_mod_inst"] = {
	onload: function()
	{
		page_act("#seeking-page");
		schema_act("#seeking-page", "quadrant_abcd");
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		widget_obj = this;
		//
		//
		if (role_str === "INST" || role_str === "NOROLE")
			$("#container_mod_inst input").prop("disabled", false);
		//
		xml_menu_load_send("USER", "INST", null, "widget_mod_inst");
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
					if (conf.children("page").text() == WS_USER_STR)
					{
						u_p = $.trim($("#container_mod_inst .pass").val());
						if (!QT && !imq_get())
							session_u_p = u_p;
						//
						if (wizard_config_flg)
						{
							wizard_mandatory_task[this.name] = 1;
							//
							step += 1;
							save_step(step);
						}
						//
						if (wizard_flg)
						{
							poptoast("{LANG_ITEM_SAVED}");
						}
						else
						{
							$("#header-home-page2 .close").trigger("click");
						}
					}
				}
				else if (conf.children("res").text() == "ERROR")// _FT_ warn: nono distingue tra un error di salvataggio generico e un errore di password gia esistente
				{
					if (conf.children("page").text() == WS_USER_STR)
					{
						pag_change(".home .JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_PWD_EXIST}", "ok");
					}
				}
 				else if (conf.children("res").text() == "ERROR_A")
 				{
 					if (conf.children("page").text() == WS_USER_STR)
 					{tyu("gass");
						pag_change(".home .JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_PWD_EXIST_A}", "ok");
 					}
 				}				
			}
			else if (conf.children("act").text() == "LOAD")
			{
				if (conf.children("res").text() == "LOADED")
				{
					if (conf.children("page").text() == WS_USER_STR)
					{
						var widget_obj = this;
						//
						this.inst = conf.find("par item");
						//
						var pwdpoint = "";
						for(var i = 0; i < PINTRENSIZE; i++)
							pwdpoint += "&#8226;";
						//
						$("#wizard_header_info").text(this.inst.find("name").text() == "" ? "{LANG_DEFAULT_INSTALLER_NAME_STR}" : this.inst.find("name").text());
						global_item_init("#container_mod_inst", "name", "input", "name", this, this.inst, this.inst.find("name").text() == "" ? "{LANG_DEFAULT_INSTALLER_NAME_STR}" : this.inst.find("name").text(), null);
						global_item_init("#container_mod_inst", "pass", "input", "code", this, this.inst, (role_str == "USER" || role_str == "POWERUSER") ? $("#mod_user_item_pass").html(pwdpoint).text() : this.inst.find("code").text(), this.inst.find("code").attr("maxlength"));
						global_item_init("#container_mod_inst", "phone", "input", "tel", this, this.inst, null, null);
						global_item_init("#container_mod_inst", "email", "input", "email", this, this.inst, null, null);
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
	name: "widget_mod_inst",
	title: "{LANG_INSTALLER}",
	inst: null,
	//
	inst_par_save: function()
	{
		if (!(this.inst == null) && role_str != "USER" && role_str != "POWERUSER")
		{
			ena_save = true;
			//
			save_item_name("#container_mod_inst", this, null, this.inst);
			save_item_pass("#container_mod_inst", this, null, this.inst);
			$("#container_mod_inst .phone").global_save_item_val({trama_ptr: this.inst.find("tel"), position: 0});
			$("#container_mod_inst .email").global_save_item_val({trama_ptr: this.inst.find("email"), position: 0});
		}
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
		draw_footer_button("{LANG_OK}", "footer_h2_a_a");
		//
		$("#footer_h2_a_a").click(function()
		{
			widget_obj.inst_par_save();
			//
			xml_request = xml_request_head_build("MENU", "widget_mod_inst");
			xml_par = $(XML("act")); xml_par.text("SAVE"); xml_request.append(xml_par);	
			xml_par = $(XML("page")); xml_par.text(WS_USER_STR); xml_request.append(xml_par);
			xml_par = $(XML("par")); xml_request.append(xml_par);
			xml_par.append(widget_obj.inst);
			if (ena_save) xml_send(xml_request);
		});
		//
		footer_button_rotate();
		scrollList(this);
	}
};