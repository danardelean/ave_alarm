pag_table_new["widget_mod_device_senuni_s"] = {
	onload: function()
	{
		var widget_obj = this;
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		//name
		global_item_init("#container_senuni", "name", "input", "name", this);
		//room
		item_room("#container_senuni", this.xml_any);
		//
		picker("#container_senuni");
		//
		global_picker_init("#container_senuni", "mode_delay_sec", "delay", this);
		//tempo di interdizione
		item_inter("#container_senuni", this.xml_any);
		//sir_mode
//		item_sir_mode("#container_senuni", this.xml_any);
		//configurazione di ingresso
		item_phy_mode("#container_senuni", this);
		//pulse
		global_picker_init("#container_senuni", "pulse_n", "impulse", this, this.phy_mode != this.NC_CONTAIMPULSI && this.phy_mode != this.NC_BILANCIATO_CONTAIMPULSI ? "disabled" : null);
		//dispositivo associato
//		item_and_function_dev_wrapper("#container_senuni", this.xml_any, this);
		//area and
//		item_area_and_wrapper("#container_senuni", this.xml_any, this);
		//delay between device matched
//		global_picker_init("#container_senuni", "mode_match_sec", "mode_match_sec_item", this);
		//tvcc
		item_tvcc("#container_senuni", this);
		//
		item_tvcc_delay_initial("#container_senuni", this);
		//
		item_fw_ver("#container_senuni", this.xml_any);
		//
		$("#footer_h2_a_b").click(function()
		{
			pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", "{LANG_WDELDEV}", "okab", "#footer_h2_a_b");
		})
		.on("on_pw_ok", function()
		{
			widget_obj.xml_any.children("phy_mode").text(widget_obj.N_DISABLED);
			//
			xml_request = xml_request_head_build("MENU", "widget_mod_device_senuni_s");
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
	name: "widget_mod_device_senuni_s",
	xml_any: xml_any_tbl[any_ind],
	title: xml_any_tbl[any_ind].children("name").text(),
	tvccs: xml_any_tbl[any_ind].find("tvccs").clone(),
	trovata_tvvc: false,
	attivata_tvcc: false,
	force_to_open: false,
	phy_mode: xml_any_tbl[any_ind].children("phy_mode").text(),
	associative_phy_mode: ["NONE" ,"{LANG_NCLOSED}", "{LANG_NOPENED}", "{LANG_ICOUNT}", "{LANG_BALANCED}", "{LANG_DBALANCED}", "{LANG_IBALANCED}"],
	NC_BILANCIATO: SENUNI_NC_BILANCIATO,
	NC_DOPPIO_BILANCIAMENTO: SENUNI_NC_DOPPIO_BILANCIAMENTO,
	NC_BILANCIATO_CONTAIMPULSI: SENUNI_NC_BILANCIATO_CONTAIMPULSI,
	NC: SENUNI_NC,
	NO: SENUNI_NO,
	NC_CONTAIMPULSI: SENUNI_NC_CONTAIMPULSI,
	N_DISABLED: SENUNI_N_DISABLED,
	//
	par_save: function()
	{
		ena_save = true;
		//
		save_item_name("#container_senuni", this);
		//
		this.xml_any.find("room").text(id_room_selected);
		//
		//if (this.force_to_open)
		//	this.xml_any.children("alarm_mode").text("1");
		//else if ($("#container_senuni .reed .roc[data-checked='1']").hasClass("open"))
		//	this.xml_any.children("alarm_mode").text("1");
		//else if ($("#container_senuni .reed .roc[data-checked='1']").hasClass("open_close"))
		//	this.xml_any.children("alarm_mode").text("2");
		//
		save_item_picker("#container_senuni", "mode_delay_sec", "delay", this.xml_any);
		save_item_picker("#container_senuni", "block_tx", "inter", this.xml_any);
		//
//		this.xml_any.children("sir_mode").text($("#container_senuni .sound .sound_btn[data-checked='1']").attr("data-anchor"));
		//	
		this.xml_any.children("phy_mode").text(this.phy_mode);
		//
		save_item_picker("#container_senuni", "pulse_n", "impulse", this.xml_any);
		//
//		this.xml_any.children("mode_match_id").text(and_function_dev);
		//
//		save_item_picker("#container_senuni", "mode_match_sec", "mode_match_sec_item");
		//
//		save_item_mode("#container_senuni", this.xml_any, this);
		//
		save_item_tvcc("#container_senuni", this);
		//"save_item_tvcc_delay_initial" sempre dopo "save_item_tvcc"
		save_item_tvcc_delay_initial("#container_senuni", this);
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