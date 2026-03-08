pag_table_new["widget_mod_device_double_pir"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		var widget_obj = this;
		//
		//name
		global_item_init("#container_pir", "name", "input", "name", this);
		//room
		item_room("#container_pir", this.xml_any);
		//
		global_load_areas_switcher("#area_container_mod", this.xml_any, this);
		//sir_mode
		item_sir_mode("#container_pir", this.xml_any);
		//
		picker("#container_pir");
		//tempo di interdizione
		item_inter("#container_pir", this.xml_any);
		//
		global_picker_init("#container_pir", "mode_delay_sec", "delay", this);
		//anti removal protection
		item_protection("#container_pir", this.xml_any, this);
		//temperature compensation
		item_temp_comp("#container_pir", this.xml_any, this);
		//led allarme
		item_led("#container_pir", this.xml_any, this);
		//antimask
		item_antimask("#container_pir", this.xml_any, this);
		//
		item_sensibility("#container_pir", this.xml_any);
		//
		item_pulse("#container_pir", this.xml_any);
		//dispositivo associato
		item_and_function_dev_wrapper("#container_pir", this.xml_any, this);
		//area and
		item_area_and_wrapper("#container_pir", this.xml_any, this);
		//delay time between device matched
		global_picker_init("#container_pir", "mode_match_sec", "mode_match_sec_item", this);
		//
		if (this.dpirVal == -1)
			$("#container_pir .p1p2_and_dir").parent().addClass("unavailable");
		else
			global_switcher_binder("#container_pir", "p1p2_and_dir", null, this.dpirVal == DPIR_AND_DIR ? 1 : 0, null, null);
		if (this.verDev < 2.0 || this.dpirVal == -1)
			$("#container_pir .p1p2_or").parent().addClass("unavailable");
		else
			global_switcher_binder("#container_pir", "p1p2_or", null, this.dpirVal == DPIR_OR_NNDIR ? 1 : 0, {condizione: "1", messaggio: "{LANG_EN50131}"}, null);
		$("#container_pir .p1p2_and_dir, #container_pir .p1p2_or").off("toggle_tick_click").on("toggle_tick_click", function()
		{
			if (widget_obj.dpirVal != -1)
			{
				var onFlg = $(this).attr("data-checked") != "0";
				if ($(this).hasClass("p1p2_and_dir"))
				{
					if (onFlg)
						widget_obj.dpirVal = DPIR_AND_DIR;
					else if ($("#container_pir .p1p2_or").attr("data-checked") == "1")
						widget_obj.dpirVal = DPIR_OR_NNDIR;
					else
						widget_obj.dpirVal = DPIR_AND_NNDIR;
				}
				else if($(this).hasClass("p1p2_or"))
				{
					if (onFlg && !(widget_obj.verDev < 2.0))
					{
						$("#container_pir .p1p2_and_dir").trigger("switch_state_changer", [["off", "disabled"], true]);
						widget_obj.dpirVal = DPIR_OR_NNDIR;
					}
					else if ($("#container_pir .p1p2_and_dir").attr("data-checked") == "1")
					{
						widget_obj.dpirVal = DPIR_AND_DIR;
					}
					else
					{
						$("#container_pir .p1p2_and_dir").trigger("switch_state_changer", [["enabled"], true]);
						widget_obj.dpirVal = DPIR_AND_NNDIR;
					}
				}
			}
		}).trigger("toggle_tick_click");
		//chime
		item_chime("#container_pir", this);
		//tvcc
		item_tvcc("#container_pir", this);
		//
		item_tvcc_delay_initial("#container_pir", this);
		//
		item_fw_ver("#container_pir", this.xml_any);
		//
		item_delete("#container_pir", this);
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
	name: "widget_mod_device_double_pir",
	xml_any: xml_any_tbl[any_ind],
	title: xml_any_tbl[any_ind].children("name").text(),
	tvccs: xml_any_tbl[any_ind].find("tvccs").clone(),
	trovata_tvvc: false,
	attivata_tvcc: false,
	dpirVal: Number(xml_any_tbl[any_ind].children("and_direzionale").text()),
	verDev: Number(xml_any_tbl[any_ind].children("fw_ver").text()),
	//
	par_save: function()
	{
		ena_save = true;
		//
		save_item_name("#container_pir", this);
		//save_room
		if (DIY) this.xml_any.find("room").text(id_room_selected);
		//
		save_item_picker("#container_pir", "mode_delay_sec", "delay", this.xml_any);
		//
		this.xml_any.children("sir_mode").text($("#container_pir .sound .sound_btn[data-checked='1']").attr("data-anchor"));
		//
		save_item_led("#container_pir", this.xml_any, this);
		//
		save_item_protection("#container_pir", this.xml_any, this);
		//
		if (this.xml_any.children("pir_a_present").text() == "1")
		{
			//interdizione
			save_item_picker("#container_pir", "pir_a_block_tx", "inter", this.xml_any);
			//temperature compensation
			this.xml_any.children("pir_a_temperature").text($("#container_pir .temp_comp").attr("data-checked"));
			//portata e sensibilita
			save_item_picker("#container_pir", "pir_a_sensibility", "sens_a", this.xml_any);
			//contaimpulsi o pulse
			save_item_picker("#container_pir", "pir_a_count_impulses", "pulse_a", this.xml_any);
		}
		if (this.xml_any.children("pir_b_present").text() == "1")
		{
			//interdizione
			save_item_picker("#container_pir", "pir_b_block_tx", "inter", this.xml_any);
			//temperature compensation
			this.xml_any.children("pir_b_temperature").text($("#container_pir .temp_comp").attr("data-checked"));
			//portata e sensibilita
			if (DIY)
				save_item_picker("#container_pir", "pir_b_sensibility", "sens_a", this.xml_any);
			else
				save_item_picker("#container_pir", "pir_b_sensibility", "sens_b", this.xml_any);
			//contaimpulsi o pulse
			if (DIY)
				save_item_picker("#container_pir", "pir_b_count_impulses", "pulse_a", this.xml_any);
			else
				save_item_picker("#container_pir", "pir_b_count_impulses", "pulse_b", this.xml_any);
		}
		//delay time between device matched
		save_item_picker("#container_pir", "mode_match_sec", "mode_match_sec_item", this.xml_any);
		//antimask
		save_item_toggled("#container_pir", "antimask", "antimask", this.xml_any);
		//
		if (!DIY) save_item_chime("#container_pir", this);
		//mode save
		save_item_mode("#container_pir", this.xml_any, this); // X item_area_and_wrapper
		//
		if (!DIY) this.xml_any.children("mode_match_id").text(and_function_dev);
		//
		save_item_area("#container_pir", this);
		//
		if (!DIY) save_item_toggled("#container_pir", "area_or", "area_and", this.xml_any);
		//
		save_item_tvcc("#container_pir", this);
		//"save_item_tvcc_delay_initial" sempre dopo "save_item_tvcc"
		save_item_tvcc_delay_initial("#container_pir", this);
		//or + and pir1 pir2
		if (this.dpirVal != -1)
			this.xml_any.children("and_direzionale").text(this.dpirVal);
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