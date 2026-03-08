pag_table_new["widget_mod_device_dt"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		//
		//name
		global_item_init("#container_dt", "name", "input", "name", this);
		//room
		item_room("#container_dt", this.xml_any);
		//
		global_load_areas_switcher("#area_container_mod", this.xml_any, this);
		//
		picker("#container_dt");
		//
		item_pulse("#container_dt", this.xml_any);
		//integration
		item_integration("#container_dt", this.xml_any);
		//
		global_picker_init("#container_dt", "mode_delay_sec", "delay", this);
		//tempo di interdizione
		item_inter("#container_dt", this.xml_any);
		//sir_mode
		item_sir_mode("#container_dt", this.xml_any);
		//led allarme
		item_led("#container_dt", this.xml_any, this);
		//anti removal protection
		item_protection("#container_dt", this.xml_any, this);
		//temperature compensation
		item_temp_comp("#container_dt", this.xml_any, this);
		//sensibility
		item_sensibility("#container_dt", this.xml_any);
		//chime
		item_chime("#container_dt", this);
		//antimask
		item_antimask("#container_dt", this.xml_any, this);
		//dispositivo associato
		item_and_function_dev_wrapper("#container_dt", this.xml_any, this);
		//area and
		item_area_and_wrapper("#container_dt", this.xml_any, this);
		//delay between device matched
		global_picker_init("#container_dt", "mode_match_sec", "mode_match_sec_item", this);
		//allarme doppia rilevazione
		item_double_ala("#container_dt", this.xml_any, this);
		//
		item_sensibility_mw("#container_dt", this.xml_any);
		//
		item_integration_mw("#container_dt", this.xml_any);
		//
		//tvcc
		item_tvcc("#container_dt", this);
		//
		item_tvcc_delay_initial("#container_dt", this);
		//
		item_fw_ver("#container_dt", this.xml_any);
		//
		item_delete("#container_dt", this);
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
	name: "widget_mod_device_dt",
	xml_any: xml_any_tbl[any_ind],
	title: xml_any_tbl[any_ind].children("name").text(),
	tvccs: xml_any_tbl[any_ind].find("tvccs").clone(),
	trovata_tvvc: false,
	attivata_tvcc: false,
	//
	par_save: function()
	{
		ena_save = true;
		//
		save_item_name("#container_dt", this);
		//save_room
		if (DIY) this.xml_any.find("room").text(id_room_selected);
		//integration
		if (this.xml_any.children("pir_a_present").text() == "1")
			save_item_picker("#container_dt", "pir_a_time_integration", "integration", this.xml_any);
		if (this.xml_any.children("pir_b_present").text() == "1")
			save_item_picker("#container_dt", "pir_b_time_integration", "integration", this.xml_any);
		//regolazione contaimpulsi
		if (this.xml_any.children("pir_a_present").text() == "1")
			save_item_picker("#container_dt", "pir_a_count_impulses", "pulse", this.xml_any);
		if (this.xml_any.children("pir_b_present").text() == "1")
			save_item_picker("#container_dt", "pir_b_count_impulses", "pulse", this.xml_any);
		//
		if (this.xml_any.children("pir_a_present").text() == "1")
			save_item_picker("#container_dt", "pir_a_block_tx", "inter", this.xml_any);
		if (this.xml_any.children("pir_b_present").text() == "1")
			save_item_picker("#container_dt", "pir_b_block_tx", "inter", this.xml_any);
		//
		if (this.xml_any.children("pir_a_present").text() == "1")
			this.xml_any.children("pir_a_temperature").text($("#container_dt .temp_comp").attr("data-checked"));
		if (this.xml_any.children("pir_b_present").text() == "1")
			this.xml_any.children("pir_b_temperature").text($("#container_dt .temp_comp").attr("data-checked"));
		//sensibility
		if (this.xml_any.children("pir_a_present").text() == "1")
			save_item_picker("#container_dt", "pir_a_sensibility", "sensibility", this.xml_any);
		if (this.xml_any.children("pir_b_present").text() == "1")
			save_item_picker("#container_dt", "pir_b_sensibility", "sensibility", this.xml_any);
		//ritardo allarme
		save_item_picker("#container_dt", "mode_delay_sec", "delay", this.xml_any);
		//
		this.xml_any.children("sir_mode").text($("#container_dt .sound .sound_btn[data-checked='1']").attr("data-anchor"));
		//
		save_item_led("#container_dt", this.xml_any, this);
		//
		save_item_protection("#container_dt", this.xml_any, this);
		//
		save_item_chime("#container_dt", this);
		//antimask
		save_item_toggled("#container_dt", "antimask", "antimask", this.xml_any);
		//mode save
		save_item_mode("#container_dt", this.xml_any, this); // X item_area_and_wrapper
		//
		this.xml_any.children("mode_match_id").text(and_function_dev);
		//
		save_item_picker("#container_dt", "mode_match_sec", "mode_match_sec_item", this.xml_any);
		//
		save_item_toggled("#container_dt", "area_or", "area_and", this.xml_any);
		// allarme per doppia rilevazione (and)
		save_item_toggled("#container_dt", "and", "double_ala", this.xml_any);
		//
		save_item_picker("#container_dt", "mw_sensibility", "sensibility_mw", this.xml_any);
		//
		save_item_picker("#container_dt", "mw_time", "integration_mw", this.xml_any);
		//
		save_item_tvcc("#container_dt", this);
		//"save_item_tvcc_delay_initial" sempre dopo "save_item_tvcc"
		save_item_tvcc_delay_initial("#container_dt", this);
		//
		save_item_area("#container_dt", this);
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