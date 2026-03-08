pag_table_new["widget_mod_device_magdet_s"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		//
		//name
		global_item_init("#container_magdet", "name", "input", "name", this);
		//room
		item_room("#container_magdet", this.xml_any);
		//
		global_load_areas_switcher("#area_container_mod", this.xml_any, this);
		//
		item_reed_mode("#container_magdet", this.xml_any, this);
		//
		picker("#container_magdet");
		//
		global_picker_init("#container_magdet", "mode_delay_sec", "delay", this);
		//tempo di interdizione
		item_inter("#container_magdet", this.xml_any);
		//sir_mode
		item_sir_mode("#container_magdet", this.xml_any);
		//configurazione di ingresso
		item_phy_mode("#container_magdet", this);
		//pulse
		global_picker_init("#container_magdet", "pulse_n", "impulse", this, this.phy_mode != this.NC_CONTAIMPULSI && this.phy_mode != this.NC_BILANCIATO_CONTAIMPULSI ? "disabled" : null);
		//chime
		item_chime("#container_magdet", this);
		//dispositivo associato
		item_and_function_dev_wrapper("#container_magdet", this.xml_any, this);
		//area and
		item_area_and_wrapper("#container_magdet", this.xml_any, this);
		//delay between device matched
		global_picker_init("#container_magdet", "mode_match_sec", "mode_match_sec_item", this);
		//tvcc
		item_tvcc("#container_magdet", this);
		//
		item_tvcc_delay_initial("#container_magdet", this);
		//
		item_fw_ver("#container_magdet", this.xml_any);
		//
		var widget_obj = this;
		$("#footer_h2_a_b").click(function()
		{
			pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_WDELDEV}", "okab", "#footer_h2_a_b");
		})
		.on("on_pw_ok", function()
		{
			widget_obj.xml_any.children("phy_mode").text(widget_obj.N_DISABLED);
			//
			xml_request = xml_request_head_build("MENU", "widget_mod_device_magdet_s");
			xml_par = $(XML("act")); xml_par.text("SAVE"); xml_request.append(xml_par);
			xml_par = $(XML("page")); xml_par.text(WS_DEV_STR); xml_request.append(xml_par);
			xml_par = $(XML("par")); xml_request.append(xml_par);
			xml_par.append(widget_obj.xml_any);
			xml_send(xml_request);
		});
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
	name: "widget_mod_device_magdet_s",
	xml_any: xml_any_tbl[any_ind],
	title: xml_any_tbl[any_ind].children("name").text(),
	tvccs: xml_any_tbl[any_ind].find("tvccs").clone(),
	trovata_tvvc: false,
	attivata_tvcc: false,
	force_to_open: false,
	phy_mode: xml_any_tbl[any_ind].children("phy_mode").text(),
	associative_phy_mode: ["NONE" ,"{LANG_NCLOSED}", "{LANG_NOPENED}", "{LANG_ICOUNT}", "{LANG_BALANCED}", "{LANG_DBALANCED}", "{LANG_IBALANCED}"],
	NC_BILANCIATO: SENMAG_NC_BILANCIATO,
	NC_DOPPIO_BILANCIAMENTO: SENMAG_NC_DOPPIO_BILANCIAMENTO,
	NC_BILANCIATO_CONTAIMPULSI: SENMAG_NC_BILANCIATO_CONTAIMPULSI,
	NC: SENMAG_NC,
	NO: SENMAG_NO,
	NC_CONTAIMPULSI: SENMAG_NC_CONTAIMPULSI,
	N_DISABLED: SENMAG_N_DISABLED,
	//
	par_save: function()
	{
		ena_save = true;
		//
		save_item_name("#container_magdet", this);
		//
		this.xml_any.find("room").text(id_room_selected);
		//
		if (this.force_to_open)
			this.xml_any.children("alarm_mode").text("1");
		else if ($("#container_magdet .reed .roc[data-checked='1']").hasClass("open"))
			this.xml_any.children("alarm_mode").text("1");
		else if ($("#container_magdet .reed .roc[data-checked='1']").hasClass("open_close"))
			this.xml_any.children("alarm_mode").text("2");
		//
		save_item_picker("#container_magdet", "mode_delay_sec", "delay", this.xml_any);
		save_item_picker("#container_magdet", "block_tx", "inter", this.xml_any);
		//
		this.xml_any.children("sir_mode").text($("#container_magdet .sound .sound_btn[data-checked='1']").attr("data-anchor"));
		//	
		this.xml_any.children("phy_mode").text(this.phy_mode);
		//
		save_item_picker("#container_magdet", "pulse_n", "impulse", this.xml_any);
		//
		save_item_chime("#container_magdet", this);
		//
		this.xml_any.children("mode_match_id").text(and_function_dev);
		//
		save_item_mode("#container_magdet", this.xml_any, this); // X item_area_and_wrapper
		//
		save_item_picker("#container_magdet", "mode_match_sec", "mode_match_sec_item", this.xml_any);
		//
		save_item_area("#container_magdet", this);
		//
		save_item_tvcc("#container_magdet", this);
		//"save_item_tvcc_delay_initial" sempre dopo "save_item_tvcc"
		save_item_tvcc_delay_initial("#container_magdet", this);
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