pag_table_new["widget_sideanom"] = {
	onload: function()
	{
		$(".home .JSdialog").show();
		this.header_home_switch();
		this.footer_home_switch();
		//
		away_from_home();
		//
		anom_flush_area_str = "ABCDEF";
		this.loaded = true;
		//
		stopWaitingScr();
		//
		if (anoms_obj.getSize() > 0)
		{
			if (!anoms_obj.isWarning())
				summon_sideanom("display");
		}
		//
		$("#header-home-page2 .header_title").addClass("abnormalities_title_color");
		//
		if (!QT && !imq_get()) // No auto login su ON/OFF
		{
			session_u_p = null;
			role_str = "NOROLE";
			uname_str = "";
			session_st_refresh();
		}
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "MENU")
		{
			if (conf.children("act").text() == "LOGIN")
			{
				if (conf.children("page").text() == "USER")
				{
					if (conf.children("res").text() == "ACCEPTING")
					{
						//
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
		$("#header-home-page2 .header_title").removeClass("abnormalities_title_color");
	},
	//
	name: "widget_sideanom",
	title: "{LANG_LIST_ANOMS}",
	loaded: false,
	cmd_standing: 1,
	t_out_escape: null,
	//
	clean_page: function()
	{
		clearTimeout(this.t_out_escape);
	},
	refresh: function()
	{
		$("#anom_list_container *:not(.scrollableSize)").remove();
		if (anoms_obj.flush_areas != "")
			anom_flush_area_str = anoms_obj.flush_areas;
		//
		clearTimeout(this.t_out_escape);
		if (imq_get())
			this.t_out_escape = setTimeout(function(){ $("#footer_h2_a_a").trigger("click"); }, 60 * 1000);
		//
		for (var i = 0; i < anoms_obj.getSize(); i++)
		{
			var newDate = 0;
			if (QT)
				newDate = from_timestamp_to_date_obj(anoms_obj.getAnomIndex(i).ts);
			else
				newDate = from_localdt_to_datacen(anoms_obj.getAnomIndex(i).localdt);
			$(".widget_sideanom #anom_list_container").append
			(
				"<div class='anom_list_button ibrb'><p>"
					+ anoms_obj.getAnomIndex(i).id 
					+ " " + anoms_obj.getAnomIndex(i).desc + (anoms_obj.getAnomIndex(i).count > 1 ? " (" + anoms_obj.getAnomIndex(i).count + ")" : "")
					+ " - " + week_day_month_do(newDate) + " " + ampm_time(newDate)
					+ "</p></div>"
			);
		}
		//
		scrollListArrowCheck(this);
	},
	hide: function()
	{
		$("#header-home-page2 .close").trigger("click");
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			$("#info_stdby").text("");
			//
			if (anom_flush_area_str != "")
				send_state_anom_flush(anom_flush_area_str);
			anom_flush_area_str = "";
			//
			header_home_group(widget_obj);
		});
		//
		$("#backTitle").html("{LANG_HOME}");
	},
	footer_home_switch: function()
	{
		var widget_obj = this;
		footer_home_switch_init();
		//
		//
//		draw_footer_button("{LANG_LIST_ANOMS_BUT_FLUSH}", "footer_h2_a_a");
		if (anoms_obj.command == WS_DEV_ALARM_CEN_CMD_ON_FORCED_STR)
			draw_footer_button("{LANG_LIST_ANOMS_BUT_INS_FORCE}", "footer_h2_a_b");
		else
			draw_footer_button("{LANG_LIST_ANOMS_BUT_INS}", "footer_h2_a_b");
		//
		$("#footer_h2_a_b").off("click").click(function()
		{
			clearTimeout(widget_obj.t_out_escape);
			//
			if (anoms_obj.command == WS_DEV_ALARM_CEN_CMD_ON_FORCED_STR)
			{
				var cen_id = xml_file_configuration.find("Devices Device")
				.filter(function()
				{
					if ($(this).children("Subcategory").text() == WS_DEV_ALARM_CEN_STR)
						return true;
				}).attr("id");
				//
				xml_request = xml_request_head_build("DEVICE_CMD");
				xml_par = $(XML("Command")); xml_par.text(anoms_obj.command); xml_request.append(xml_par);
				xml_par = $(XML("Device")); xml_par.text(cen_id); xml_request.append(xml_par);
				xml_par = $(XML("Arguments")); xml_request.append(xml_par);
				xml_node = $(XML("Argument")); xml_node.attr("id", "PIN"); xml_node.text(anoms_obj.login_code); xml_par.append(xml_node);
				xml_node = $(XML("Argument")); xml_node.attr("id", "AREAS"); xml_node.text(anoms_obj.cmd_area); xml_par.append(xml_node);
				xml_send(xml_request);
				anoms_obj.command = ""; // RESET COMMAND
				summon_sideanom("hide");
			}
			else
			{
				if (anom_flush_area_str != "")
					send_state_anom_flush(anom_flush_area_str);
				anom_flush_area_str = "";
				pag_change(".JSdialog", "widget_zone_select_vert", $(".widget_sideanom").attr("data-area-ins"), $(".widget_sideanom").attr("data-area-dis"), $(".widget_sideanom").attr("data-area-grp"));				
			}
		});
//		$("#footer_h2_a_a").off("click").click(function()
//		{
//			if (anom_flush_area_str != "")
//				send_state_anom_flush(anom_flush_area_str);
//			anom_flush_area_str = "";
//			summon_sideanom("hide");
//		});
		//
		//
		footer_button_rotate();
		scrollList(this);
	}
};