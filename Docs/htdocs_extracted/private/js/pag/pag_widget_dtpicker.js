pag_table_new["widget_dtpicker"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		//
		//save_step(WS_WIZARD_STEP_RTC);
		var widget_obj = this;
		//
		//
		picker("#container_dtpicker", this.date_normalizer);
		//
		global_switcher_binder("#container_dtpicker", "dst", this.xml_any);
		$("#dst").on("toggle_tick_click", function()
		{
			widget_obj.only_dst_tzone = true;
			global_send_dev_mod_save(widget_obj, false);
		});
		//
		$("#day_p").html(get_day());
		$("#month_p").html(get_month());
		$("#year_p").html(get_year());
		$("#hour_p").html(get_hours());
		$("#minute_p").html(get_minutes());
		//
		global_switcher_binder("#container_dtpicker", "twentyfour", null, this.xml_any.children("h24").text());
		if ($("#twentyfour").attr("data-checked") == "1") //inizializzazione solo caso "h24"
		{
			if ($("#hour_p").text() > 11)	
			{
				$(".hour .ampm .pm").show();
				$(".hour .ampm .am").hide();
			}
			else
			{
				$(".hour .ampm .pm").hide();
				$(".hour .ampm .am").show();
			}
			$(".hour .ampm").hide();
			local_h24 = true;
		}
		var first_time = true; //se h24 attivo non bisogna lanciare la prima volta il click
		$("#twentyfour").on("toggle_tick_click", function()
		{
			if ($(this).attr("data-checked") === "1")
			{
				if (!first_time)
				{
					local_h24 = true;
					var hval = $("#hour_p").text();
					if (hval === "12")
					{
						if ($(".hour .ampm .am").is(":visible"))
							$("#hour_p").text("00");
					}
					else if ($(".hour .ampm .pm").is(":visible")) 
					{
						$("#hour_p").text(hval-1+13);
					}
					$(".hour .ampm").hide();
				}
			}
			else
			{// serve anche per inizializzare la gui in modalita' h12
				local_h24 = false;
				$(".hour .ampm").show();
				var hval = $("#hour_p").text();
				if (hval > 11)
				{
					if (hval != 12)
						$("#hour_p").text(hval-12 > 9 ? hval-12 : "0"+(hval-12));
					$(".hour .ampm .pm").show();
					$(".hour .ampm .am").hide();
				}
				else
				{
					if (hval == 0)
						$("#hour_p").text("12");
					$(".hour .ampm .pm").hide();
					$(".hour .ampm .am").show();
				}
			}
		}).trigger("toggle_tick_click");
		first_time = false;
		//
	 	if (this.xml_any.children("tzone").text() === "")
		{
			this.utc_value = xml_file_configuration.find("Regions Region[id='"+region+"']").attr("timezone_id");
		}
		else
		{
			this.utc_value = this.xml_any.children("tzone").text();
		}
		$(".widget_dtpicker .time_zone .sl_selector").html(xml_file_configuration.find("Timezones Timezone[id='"+this.utc_value+"']").attr("desc"));
		//
		global_apply_diag("#container_dtpicker", "time_zone", "{LANG_WIZARD_DTPICKER_TIME_ZONE}", "time_zone", null, "widget_dtpicker");
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
						ts_xml_template = this.xml_any;
						ts_xml_template.children("dst").text() == "1" ? dst = true : dst = false;
						ts_xml_template.children("h24").text() == "1" ? h24 = true : h24 = false;
						$(".footer_container_btn_inside").trigger("dt_saved");
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
	name: "widget_dtpicker",
	title: "{LANG_WIZARD_DTPICKER_TITLE}",
	utc_value: null,
	local_ts: 0,
	local_date: "",
	xml_any: ts_xml_template.clone(),
	local_h24: null,
	only_dst_tzone: false,
	only_rollback: false,
	//
	par_save: function()
	{
		ena_save = true;
		//
		if (this.only_dst_tzone)
		{
			this.only_dst_tzone = false;
			//
			this.xml_any.children("dt_str").text("");
			this.xml_any.children("ts").text("");
			this.xml_any.children("localdt").text("");
			this.xml_any.children("dst").text($("#dst").attr("data-checked"));
			this.xml_any.children("tzone").text(this.utc_value);
			//
			this.xml_any.children("dst").text() == "1" ? dst = true : dst = false;
			this.xml_any.children("h24").text() == "1" ? h24 = true : h24 = false;
		}
		else if (this.only_rollback)
		{
			this.only_rollback = false;
			//
			this.xml_any.children("dt_str").text("");
			this.xml_any.children("ts").text("");
			this.xml_any.children("localdt").text("");
			this.xml_any.children("dst").text(ts_xml_template.children("dst").text());
			this.xml_any.children("tzone").text(ts_xml_template.children("tzone").text());
			//
			this.xml_any.children("dst").text() == "1" ? dst = true : dst = false;
			this.xml_any.children("h24").text() == "1" ? h24 = true : h24 = false;
		}
		else
		{
			this.local_ts = this.from_dtpicker_to_timestamp();
			this.local_date = this.from_dtpicker_to_timeString(); //la centrale salva questo
			//
			this.xml_any.children("dt_str").text(this.local_date);
			this.xml_any.children("ts").text(this.local_ts);
			this.xml_any.children("dst").text($("#dst").attr("data-checked"));
			this.xml_any.children("h24").text($("#twentyfour").attr("data-checked"));
			this.xml_any.children("tzone").text(this.utc_value);
		}
	},
	date_normalizer: function(value_dt, context, button)
	{
		var hour_mode = local_h24 ? 24 : 12;
		if (context.hasClass("month"))
		{
			var value_month = value_dt;
			var value_year = parseInt($("#year_p").text());
			if (button.hasClass("right")) value_month++;
			else if (button.hasClass("left")) value_month--;
			if (parseInt($("#day_p").text()) > 28 && value_month == 2)
				if ((value_year % 4 == 0 && value_year % 100 != 0) || value_year % 400 == 0)
					$("#day_p").text("29");
				else $("#day_p").text("28");
			else if (parseInt($("#day_p").text()) > 30 && (value_month == 4 || value_month == 6 || value_month == 9 || value_month == 11))
				$("#day_p").text("30");
			//
			if (value_dt <= 1)
				if (button.hasClass("right")) return value_dt;
				else return 13;
			else if (value_dt >= 12)
				if (button.hasClass("left")) return value_dt;
				else return 0;
		}
		if (context.hasClass("year"))
		{
			var value_month = parseInt($("#month_p").text());
			var value_year = value_dt;
			if (button.hasClass("right")) value_year++;
			else if (button.hasClass("left")) value_year--;
			if (value_month == 2 && parseInt($("#day_p").text()) > 28)
				if ((value_year % 4 == 0 && value_year % 100 != 0) || value_year % 400 == 0)
					$("#day_p").text("29");
				else $("#day_p").text("28");
			//
			if (value_dt <= 1970)
				if (button.hasClass("right")) return value_dt;
				else return 1971;
		}
		if (context.hasClass("day"))
		{
			var value_month = parseInt($("#month_p").text());
			var value_year = parseInt($("#year_p").text());
			var rbound = 31;
			if (value_month == 2)
				if ((value_year % 4 == 0 && value_year % 100 != 0) || value_year % 400 == 0)
					rbound = 29;
				else rbound = 28;
			else if (value_month == 4 || value_month == 6 || value_month == 9 || value_month == 11)
				rbound = 30;
			//
			if (value_dt <= 1)
				if (button.hasClass("right")) return value_dt;
				else return rbound+1;
			else if (value_dt >= rbound)
				if (button.hasClass("left")) return value_dt;
				else return 0;
		}
		if (context.hasClass("hour"))
		{
			if (!local_h24)
			{
				if ((value_dt == 12 && button.hasClass("left")) || (value_dt == 11 && button.hasClass("right")))
					$(".hour .ampm p").each(function()
					{
						if ($(this).is(":visible")) $(this).hide();
						else $(this).show();
					});
				//
				if (value_dt <= 1)
					if (button.hasClass("right")) return value_dt;
					else return hour_mode+1;
				else if (value_dt >= hour_mode)
					if (button.hasClass("left")) return (value_dt > hour_mode ? hour_mode+1 : hour_mode);
					else return 0;
			}
			else
			{
				if (value_dt <= 0)
					if (button.hasClass("right")) return value_dt;
					else return hour_mode;
				else if (value_dt >= hour_mode-1)
					if (button.hasClass("left")) return (value_dt > hour_mode-1 ? hour_mode : hour_mode-1);
					else return -1;
			}
		}
		if (context.hasClass("minute"))
		{
			if (value_dt <= 0)
				if (button.hasClass("right")) return value_dt;
				else return 60;
			else if (value_dt >= 59)
				if (button.hasClass("left")) return value_dt;
				else return -1;
		}
		return value_dt;
	},
	from_dtpicker_to_timestamp: function()
	{
		var year = "" + $("#year_p").text();
		var month = "" + $("#month_p").text();
		var day = "" + $("#day_p").text();
		var hour = "" + $("#hour_p").text();
		if (!local_h24)
		{
			if ($(".hour .ampm .pm").is(":visible"))
			{
				if (hour < 12)
					hour = hour - 1 + 13;
			}
			else if ($(".hour .ampm .am").is(":visible"))
			{
				if (hour == 12)
					hour = 0;
			}
		}
		var minute = "" + $("#minute_p").text();
		//
		if (month.length == 1) month = "0" + month;
		if (day.length == 1) day = "0" + day;
		if (hour.length == 1) hour = "0" + hour;
		if (minute.length == 1) minute = "0" + minute;
		//
		return from_date_obj_to_timestamp(new Date(year + "/" + month + "/" + day + " " + hour + ":" + minute + ":00"));
		//return Math.round(new Date(year+"/"+month+"/"+day+" "+hour+":"+minute+":00").getTime()/1000);
	},
	from_dtpicker_to_timeString: function()
	{
		var year = "" + $("#year_p").text();
		var month = "" + $("#month_p").text();
		var day = "" + $("#day_p").text();
		var hour = "" + $("#hour_p").text();
		if (!local_h24)
		{
			if ($(".hour .ampm .pm").is(":visible"))
			{
				if (hour < 12)
					hour = hour - 1 + 13;
			}
			else if ($(".hour .ampm .am").is(":visible"))
			{
				if (hour == 12)
					hour = 0;
			}
		}
		hour = hour + "";
		var minute = "" + $("#minute_p").text();
		//
		if (month.length == 1) month = "0" + month;
		if (day.length == 1) day = "0" + day;
		if (hour.length == 1) hour = "0" + hour;
		if (minute.length == 1) minute = "0" + minute;
		//
		return year + "" + month + "" + day + "" + hour + "" + minute;
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").on("click.rollback", function()
		{
			widget_obj.only_rollback = true;
			global_send_dev_mod_save(widget_obj, false);
		});
		$("#header-home-page2 .close").on("click.ok", function()
		{
			header_nav_settings_generic_group(this);
			file_conf_request();
		});
		//
		$("#backTitle").html("{LANG_NAV_SETTINGS_GENERIC}");
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
			global_send_dev_mod_save(widget_obj);
		});
		$("#footer_h2_a_a").on("dt_saved", function()
		{
			$("#header-home-page2 .close").trigger("click.ok");
		});
		//
		footer_button_rotate();
		scrollList(this);
	}
};
