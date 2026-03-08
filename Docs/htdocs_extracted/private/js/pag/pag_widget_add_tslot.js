pag_table_new["widget_add_tslot"] = {
	onload: function()
	{
		page_act("#seeking-page");
		schema_act("#seeking-page", "quadrant_abcd");
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		var widget_obj = this;
		//
		//
		startWaitingScr();
		xml_menu_load_send(WS_TSLOT_STR, null, null, this.name, null);
	},
	onrecv_confirmation: function(conf)
	{
		var widget_obj = this;
		//
		if (conf.attr("type") == "MENU")
		{
			if (conf.children("act").text() == "LOAD")
			{
				if (conf.children("res").text() == "LOADED")
				{
					if (conf.children("page").text() == WS_TSLOT_STR)
					{
						picker("#container_add_tslot", this.hr_normalizer);
						//
						this.xml_tslots = conf.find("par item");
						//
						$("#container_add_tslot .days_week").removeClass("c_wsmt");
						//
						for (var i = 0; i < TSLOTSNUM; i++)
						{
							var tramaItem = this.filterById(this.xml_tslots, i + 1);
							//
							//
							this.name_mem[i] = tramaItem.children("desc").text();
							this.tslotsEna[i] = tramaItem.children("ena").text() == "TRUE" ? 1 : 0;
							this.week_mem[i] = tramaItem.children("days").text();
							//
							var hr_ini = tramaItem.children("hour_ini").text();
							var min_ini = tramaItem.children("minutes_ini").text();
							var hr_end = tramaItem.children("hour_end").text();
							var min_end = tramaItem.children("minutes_end").text();
							//
							//
							global_item_init("#container_add_tslot #fts" + i, "name", "input", null, null, null, this.name_mem[i], null);
							global_switcher_binder("#container_add_tslot #fts" + i, "ena", null, this.tslotsEna[i], null, null);
							//
							if (this.tslotsEna[i])
							{
								$("#container_add_tslot #fts" + i + " .days_week").each(function(index)
								{
									var dayCase = widget_obj.week_mem[i];
									var selCase = $(this).attr("data-val");
									if (dayCase.indexOf(selCase) > -1)
									{
										$(this).switchClass("c_clear", "bg_clear", 150);
										$(this).attr("data-checked", "1");
									}
									else
									{
										$(this).switchClass("bg_clear", "c_clear", 150);
										$(this).attr("data-checked", "0");
									}
								});
							}
							else
							{
								//$("#container_add_tslot #fts" + i + " .days_week").swapClass("bg_clear", "c_clear").addClass("c_wsmt").attr("data-checked", "0");
							}
							//
							//
							global_picker_init_simple("#container_add_tslot #fts" + i, "ini_hours", "hours", this.ampmh24(hr_ini), null, h24 ? "[0, 23]" : "[1, 12]");
							global_picker_init_simple("#container_add_tslot #fts" + i, "ini_minutes", "minutes", this.timeZero(min_ini), null, "[0, 59]");
							global_picker_init_simple("#container_add_tslot #fts" + i, "end_hours", "hours", this.ampmh24(hr_end), null, h24 ? "[0, 23]" : "[1, 12]");
							global_picker_init_simple("#container_add_tslot #fts" + i, "end_minutes", "minutes", this.timeZero(min_end), null, "[0, 59]");
							//
							//
							if (h24)
							{
								$("#container_add_tslot #fts" + i + " .ampm").hide();
							}
							else
							{
								if (hr_ini < 12)
									$("#container_add_tslot #fts" + i + " .ini_hours .pm").hide();
								else
									$("#container_add_tslot #fts" + i + " .ini_hours .am").hide();
								if (hr_end < 12)
									$("#container_add_tslot #fts" + i + " .end_hours .pm").hide();
								else
									$("#container_add_tslot #fts" + i + " .end_hours .am").hide();
							}
						}
						//
						this.init_control();
						//
						stopWaitingScr();
					}
				}
				else if (conf.children("res").text() == "ERROR")
				{
					tyu("ERROR: LOAD ");
				}
			}
			else if (conf.children("act").text() == "SAVE")
			{
				if (conf.children("res").text() == "SAVED")
				{
					if (conf.children("page").text() == WS_TSLOT_STR)
					{
						$("#header-home-page2 .close").trigger("click");
					}
				}
				else if (conf.children("res").text() == "ERROR")// _FT_ warn: nono distingue tra un error di salvataggio generico e un errore di password gia esistente
				{
					if (conf.children("page").text() == WS_USER_STR)
					{
					
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
	name: "widget_add_tslot",
	title: "{LANG_WIZARD_ADD_TSLOT_BTN}",
	xml_tslots: null,
	tslotsEna: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	week_mem: [],
	name_mem: [],
	//
	//
	par_save: function()
	{
		if (this.xml_tslots != null)
		{
			ena_save = true;
			//
			for (var i = 0; i < TSLOTSNUM; i++)
			{
				var tramaItem = this.filterById(this.xml_tslots, i + 1);
				//
				$("#container_add_tslot #fts" + i + " .name").global_save_item_val({trama_ptr: tramaItem.children("desc")});
				tramaItem.children("days").text(this.week_mem[i]);
				tramaItem.children("ena").text($("#container_add_tslot #fts" + i + " .ena").attr("data-checked") == "1" ? "TRUE" : "FALSE");
				//
				var hr_ini = Number($("#container_add_tslot #fts" + i + " .ini_hours .pick_hours").text());
				var hr_end = Number($("#container_add_tslot #fts" + i + " .end_hours .pick_hours").text());
				if (h24);
				else
				{
					if ($("#container_add_tslot #fts" + i + " .ini_hours .am").is(":hidden"))
						if (hr_ini != 12)
							hr_ini += 12;
					if ($("#container_add_tslot #fts" + i + " .end_hours .am").is(":hidden"))
						if (hr_end != 12)
							hr_end += 12;
					if ($("#container_add_tslot #fts" + i + " .ini_hours .pm").is(":hidden"))
						if (hr_ini == 12)
							hr_ini -= 12;
					if ($("#container_add_tslot #fts" + i + " .end_hours .pm").is(":hidden"))
						if (hr_end == 12)
							hr_end -= 12;
				}
				tramaItem.children("hour_ini").text(hr_ini);
				tramaItem.children("hour_end").text(hr_end);
				if (ena_save)
				{
					if (hr_ini > hr_end)
					{
						ena_save = false;
					}
					else if (hr_ini == hr_end)
					{
						var min_ini = Number($("#container_add_tslot #fts" + i + " .ini_minutes .pick_minutes").text());
						var min_end = Number($("#container_add_tslot #fts" + i + " .end_minutes .pick_minutes").text());
						if (min_ini > min_end)
							ena_save = false;
					}
					if (!ena_save)
						pag_change(".home .JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_WIZARD_ADD_TSLOT_ERR}", "ok", null);
				}
				//
				save_item_picker2("#container_add_tslot #fts" + i, "minutes_ini", "ini_minutes", "ini_minutes .pick_minutes", tramaItem);
				save_item_picker2("#container_add_tslot #fts" + i, "minutes_end", "end_minutes", "end_minutes .pick_minutes", tramaItem);
			}
		}
	},
	filterById: function(xmllist, id)
	{
		return xmllist.filter(function() { if ($(this).children("id").text() == id) return true; });
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
	ampmh24: function(hr)
	{
		hr = Number(hr);
		//
		if (h24);
		else
		{
			if (hr > 12)
				hr = hr - 12;
			else if (hr == 0)
				hr = 12;
		}
		hr = this.timeZero(hr);
		return hr + "";
	},
	timeZero: function(t0)
	{
		t0 = "" + t0;
		//
		if (t0.length == 1)
			t0 = "0" + t0;
		//
		return t0;
	},
	hr_normalizer: function(value_dt, context, button)
	{
		var hour_mode = h24 ? 24 : 12;
		if (context.hasClass("hour"))
		{
			if (!h24)
			{
				if ((value_dt == 12 && button.hasClass("left")) || (value_dt == 11 && button.hasClass("right")))
					$(context).find(".ampm p").each(function()
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
		//
		return value_dt;
	},
	init_control: function()
	{
		var widget_obj = this;
		//
		//
		$("#container_add_tslot .days_week").off("click").click(function()
		{
			var index = Number($(this).closest(".fascia").attr("data-index")); 
			//
			widget_obj.week_mem[index] = "";
			//
			if ($(this).attr("data-checked") == 0)
			{
				if ($(this).hasClass("week"))
				{
					$(this).siblings(".days_week")
						.switchClass("bg_clear", "c_clear", 150)
						.attr("data-checked", "0");
				}
				else
				{
					$(this).siblings(".week")
						.switchClass("bg_clear", "c_clear", 150)
						.attr("data-checked", "0");
				}
				//
				if ($(this).siblings("[data-checked='1']").length == 6)
				{
					$(this).siblings()
						.switchClass("bg_clear", "c_clear", 150)
						.attr("data-checked", "0");
					//
					$(this).siblings(".week")
						.switchClass("c_clear", "bg_clear", 150)
						.attr("data-checked", "1");
				}
				else
				{
					$(this)
						.switchClass("c_clear", "bg_clear", 150)
						.attr("data-checked", "1");
					//
					widget_obj.week_mem[index] += $(this).attr("data-val");	
				}
			}
			else
			{
				if ($(this).hasClass("week"))
				{
					$(this).siblings(".days_week").first()
						.switchClass("c_clear", "bg_clear", 150)
						.attr("data-checked", "1");
				}
				else
				{
					if ($(this).siblings("[data-checked='0']").length == 7)
					{
						$(this).siblings(".week")
							.switchClass("c_clear", "bg_clear", 150)
							.attr("data-checked", "1");
					}
				}
				//
				$(this)
					.switchClass("bg_clear", "c_clear", 150)
					.attr("data-checked", "0");
			}
			//
			$(this).siblings().each(function()
			{
				if ($(this).attr("data-checked") == "1")
				{
					if (widget_obj.week_mem[index] == "") 
						widget_obj.week_mem[index] += $(this).attr("data-val");
					else
						widget_obj.week_mem[index] += "," + $(this).attr("data-val");
				}
			});
		});
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
			widget_obj.par_save();
			//
			xml_request = xml_request_head_build("MENU", widget_obj.name);
			xml_par = $(XML("act")); xml_par.text("SAVE"); xml_request.append(xml_par);	
			xml_par = $(XML("page")); xml_par.text(WS_TSLOT_STR); xml_request.append(xml_par);
			xml_par = $(XML("par")); xml_request.append(xml_par);
			xml_par.append(widget_obj.xml_tslots);
			if (ena_save) xml_send(xml_request);
		});
		//
		//
		footer_button_rotate();
		scrollList(this);
	}
};