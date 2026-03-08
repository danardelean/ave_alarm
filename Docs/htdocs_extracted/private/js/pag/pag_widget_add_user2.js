pag_table_new["widget_add_user2"] = {
	onload: function()
	{
		page_act("#seeking-page");
		schema_act("#seeking-page", "quadrant_abcd");
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		$("#newpin_user").on("on_pw_ok", function()
		{
			$(this).val("");
		});
		//
		xml_request = xml_request_head_build("MENU", "widget_add_user2");
		xml_node = $(XML("act")); xml_node.text("NEW"); xml_request.append(xml_node);
		xml_node = $(XML("page")); xml_node.text("USER"); xml_request.append(xml_node);
		xml_node = $(XML("par")); xml_request.append(xml_node);
		xml_send(xml_request);
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "MENU")
		{
			if (conf.children("act").text() == "NEW")
			{
				if (conf.children("res").text() == "CREATED")
				{
					if (conf.children("page").text() == "USER")
					{
						this.item_user = conf.find("par item");
						global_item_init(".widget_add_user2", "name", "input", "name", this, this.item_user, null, null);
						global_item_init(".widget_add_user2", "pass", "input", null, null, null, "", conf.find("par item code").attr("maxlength"));
						$("#pin_user").val(conf.find("par item code").text());
					}
				}
			}
			if (conf.children("act").text() == "SAVE")
			{
				if (conf.children("res").text() == "SAVED")
				{
					if (conf.children("page").text() == "USER")
					{
						$(".footer_container_btn_inside").trigger("usr_saved");
					}
				}
				else if (conf.children("res").text() == "ERROR")
				{
					if (conf.children("page").text() == "USER")
					{
						pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_PWD_EXIST}", "ok", "#newpin_user");
					}
				}
				else if (conf.children("res").text() == "ERROR_A")
				{
					if (conf.children("page").text() == "USER")
					{
						pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_PWD_EXIST_A}", "ok", "#newpin_user");
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
	name: "widget_add_user2",
	title: "{LANG_WIZARD_ADD_USER2_TITLE}".cutBefore("."),
	item_user: null,
	//
	save_user: function()
	{
		this.item_user.children("name").text($("#name_user").val());
		this.item_user.children("code").text($("#newpin_user").val());
	},
	send_save_user: function()
	{
		$("#name_poweruser").css("background-color", "");
		$("#newpin_poweruser").css("background-color", "");
		if (this.name_newpin_check())
		{
			this.save_user();
			xml_request = xml_request_head_build("MENU", "widget_add_user2");
			xml_par = $(XML("act")); xml_par.text("SAVE"); xml_request.append(xml_par);		
			xml_par = $(XML("page")); xml_par.text("USER"); xml_request.append(xml_par);		
			xml_par = $(XML("par")); xml_par.append(this.item_user); xml_request.append(xml_par);
			xml_send(xml_request);
		}
	},
	name_newpin_check: function()
	{
		var res_name = false;
		var nameTag = this.item_user.find("name");
		var maxlengthNAME = nameTag.attr("maxlength");
		var minlengthNAME = nameTag.attr("minlength");
		if 
		(
			!($.trim($("#name_user").val()).length > maxlengthNAME)
			&& !($.trim($("#name_user").val()).length < minlengthNAME)
		)
			res_name = true;
		//
		var pinTag = this.item_user.find("code");
		var maxlengthPIN = Number(pinTag.attr("maxlength"));
		var minlengthPIN = Number(pinTag.attr("minlength"));
		//
		var nopinstrs = [];
		for (var i = 0; i < maxlengthPIN - minlengthPIN + 1; i++)
		{
			nopinstrs.push("");
			for (var j = 0; j < minlengthPIN + i; j++)
				nopinstrs[i] += "0";
		}
		//
		var res_newpin = true;
		if ($.trim($("#newpin_user").val()).length > maxlengthPIN)
			res_newpin = false;
		if ($.trim($("#newpin_user").val()).length < minlengthPIN)
			res_newpin = false;
		if (!($.isNumeric($.trim($("#newpin_user").val()))))
			res_newpin = false;
		for (var i = 0; i < nopinstrs.length; i++)			
			if ($.trim($("#newpin_user").val()) == nopinstrs[i])
				res_newpin = false;
		//
		if (!res_name)
		{
			$("#name_user").css("background-color", "rgba(255,0,0,0.2)");
		}
		if (!res_newpin)
		{
			$("#newpin_user").css("background-color", "rgba(255,0,0,0.2)");
		}
		return (res_name && res_newpin);
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
		//
		$("#footer_h2_a_a").click(function()
		{
			widget_obj.send_save_user();
		});
		$("#footer_h2_a_a").on("usr_saved", function()
		{
			$("#header-home-page2 .close").trigger("click");
		});
		//
		//
		footer_button_rotate();
		scrollList(this);
	}
};