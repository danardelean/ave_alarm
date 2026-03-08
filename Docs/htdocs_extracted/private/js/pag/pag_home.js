pag_table_new["home"] = {
	onload: function()
	{
		var homepage_type = $("#home").attr("data-page");
		//
		if (homepage_type == "main")
		{
			file_conf_request();
			//
			save_step(WS_WIZARD_STEP_N);
			//
			iName_adv();
			//
			wizard_flg= false;
			wizard_config_flg = false;
			//
			this.schema = "quadrant_abcd";
			schema_act("#main-page", this.schema);
			page_act("#main-page");
			footer_act("#footer-home-page");
			pag_clear(".home .JSdialog");
			pag_change("#main-page .quadrant_abcd.abcd", "widget_leaf_home");
			//
			$("#home_from_home").off("click").click(function()
			{
				if ($("#main-page").is(":visible") && !($(this).hasClass("disabled")))
					stdby_in();
			});
			$("#head_button_settings, #head_button_settings2").off("click").click(function()
			{
				if (!($(this).hasClass("disabled")))
				{
					$("#menu_impostazioni").trigger("click");
				}
			});
			//
			$("#mycloudstatus").off("click").click(function()
			{
				if (!($(this).hasClass("disabled")))
				{
					pag_change(".home .JSdialog", "widget_login_small", "par_cloud");
				}
			});
			//
			settingsButton();
			//
			exit_mode_manager();
			//
			session_st_refresh();
			if (!QT)
			{
				$("#mysessionstatus").off("click").click(function()
				{
					if (!($(this).hasClass("disabled")))
					{
						if (!(role_str == "NOROLE") && !imq_get())
						{
							stdby_out();
							pag_change(".home .JSdialog", "widget_popwarn", logout_title_str, logout_str.replace("<BR>", " " + uname_str), "okab", "#mysessionstatus");	
						}
					}
				}).off("on_pw_ok").on("on_pw_ok", function()
				{
					session_u_p = null;
					role_str = "NOROLE";
					uname_str = "";
					session_st_refresh();
					if ("widget_leaf_home" in pag_table_new)
						pag_table_new["widget_leaf_home"].unlock_all();
				});
			}
			//
			pag_change(".JSstdby", "widget_stdby", "preload");
			pag_change("#footer-home-page", "footer_area_home");
			pag_change(".JSwait", "widget_waiting");
			//
			this.version_foot(3);
			//
			this.list_of_widget = this.list_of_widget.concat(["widget_stdby", "footer_area_home", "widget_leaf_home"]);
			//
			var attempt = 20;
			function poll_check_loaded()
			{
				if (pag_table_new["home"].check_loaded_widget())
				{
					xml_send(xml_request_head_build("STATUS"));
				}
				else
				{
					attempt--;
					if (attempt < 0)
					{
						alert("ERROR: 'loaded' variable of some widget has not been set to true");
						attempt = 20;
					}
					if ($("#home").length > 0)
						setTimeout(poll_check_loaded, 500);
				}
			}
			poll_check_loaded();
		}
		else if (homepage_type == "wizard")
		{
			wizard_config_flg = true;
			pag_change("#side-menu", "summary");
			this.version_foot(20, "#gui_body");
		}
		else
		{
			tyu("ERRORE pag_change: passaggio parametro 'pag_home' non corretto");
		}
		//
		pag_change("#footer-home-page2", "footer_home2");
	},
	onrecv_confirmation: function()
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
	name: "home",
	list_of_widget: [],
	schema: "quadrant_abcd",
	mShutSel: null,
	//
	version_foot: function(timesec, mShutSel)
	{
		var widget_obj = this;
		this.mShutSel = mShutSel;
		//
		pag_change("#footer-wizard-page", "footer_wizard");
		var t_out_verf = setTimeout(function()
		{
			if 
			(
				widget_obj.mShutSel == null
				&& curr_page == "#main-page"
				&& !$("#JSdialog").is(":visible")
			)
				swap_body_foot(true);
			widget_obj.del_version_foot();
		}, timesec * 1000);
		if (this.mShutSel != null)
		{
			$(this.mShutSel).off("click.vFoot").on("click.vFoot", function()
			{
				clearTimeout(t_out_verf);
				widget_obj.del_version_foot();
			});	
		}
	},
	del_version_foot: function()
	{
		var fwpObj = $("#footer-wizard-page");
		if (fwpObj.length > 0)
		{
			pag_clear("#footer-wizard-page");
			fwpObj.remove();
			if (this.mShutSel != null)
			{
				$(this.mShutSel).off("click.vFoot");
				this.mShutSel = null;
			}
		}
	},
	check_loaded_widget: function() //controlla che i widget definiti in 'list_of_widget' siano pronti
	{
		for (var i = 0; i < this.list_of_widget.length; i++)
		{
			if (!(this.list_of_widget[i] in pag_table_new))
			{
				return false;
			}
			else
			{
				if (pag_table_new[this.list_of_widget[i]].loaded == null)
					alert("ERROR: loaded variable of " + this.list_of_widget[i] + " not declared");
				else
					if (pag_table_new[this.list_of_widget[i]].loaded == false)
						return false;
			}
		}
		return true;
	}
};