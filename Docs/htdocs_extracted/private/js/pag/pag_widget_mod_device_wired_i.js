pag_table_new["widget_mod_device_wired_i"] = {
	onload: function()
	{
		var widget_obj = this;
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		//name
		this.xml_any.children("name").attr("maxlength", this.xml_any.children("name").attr("maxlength") - 2); // Size - 2 per aggiungere " B" su virtual wire
		$("#container_wired .name").val(this.xml_any.children("name").text());
		//
		item_room("#container_wired", this.xml_any);
		//
		global_load_areas_switcher("#area_container_mod", this.xml_any, this);
		if (!mode_bus_rf_dynamic_area_flg("#container_wired", this))
			$("#area_container_mod .switcher").trigger("switch_state_changer", [["disabled", "on"]]);
		//
		picker("#container_wired");
		//
		$("#container_wired .mode_bus_rf .sl_selector").html(this.mode_bus_rf_label[this.mode_bus_rf]);
		global_apply_diag("#container_wired", "mode_bus_rf", "{LANG_BUS_SENRF_MODE}", null, null, this.name);
		//
		item_reed_mode_wired("#container_wired", this);
		//
		global_picker_init("#container_wired", "mode_delay_sec", "delay", this);
		//
		item_sir_mode("#container_wired", this.xml_any);
		//
		item_phy_mode("#container_wired", this);
		//pulse
		global_picker_init("#container_wired", "cfg_wire_in_pulse_n", "impulse", this, this.phy_mode != this.NC_CONTAIMPULSI && this.phy_mode != this.NC_BILANCIATO_CONTAIMPULSI ? "disabled" : null);
		//
		item_and_function_dev_wrapper("#container_wired", this.xml_any, this);
		//area and
		item_area_and_wrapper("#container_wired", this.xml_any, this);
		//delay between device matched
		global_picker_init("#container_wired", "mode_match_sec", "mode_match_sec_item", this);
		//
		item_chime("#container_wired", this);
		//tvcc
		item_tvcc("#container_wired", this);
		//
		item_tvcc_delay_initial("#container_wired", this);
		//
		if (this.mode_bus_rf > Number(MATCH_AREA))
			mode_bus_rf_dynamic_gui("#container_wired", this, false);
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "MENU")
		{		
			if (conf.children("act").text() == "LOAD")
			{
				if (conf.children("res").text() == "LOADED")
				{
					if (conf.children("page").text() == WS_AREA_STR)
					{
						//
					}
				}
				else if (conf.children("res").text() == "ERROR")
				{
					//alert("_EO_4" + conf.children("res").text()+": "+conf.children("desc").text());
				}
			}
			else if (conf.children("act").text() == "SAVE")
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
					//alert("_EO_5" + conf.children("res").text()+": "+conf.children("desc").text());
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
					//alert("_EO_6" + conf.children("res").text()+": "+conf.children("desc").text());
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
	name: "widget_mod_device_wired_i",
	xml_any: xml_any_tbl[any_ind],
	son1: null,
	title: xml_any_tbl[any_ind].children("name").text(),
	tvccs: xml_any_tbl[any_ind].find("tvccs").clone(),
	trovata_tvvc: false,
	attivata_tvcc: false,
	force_to_open: false,
	reed_mode: xml_any_tbl[any_ind].children("cfg_wire_in_alarm_mode").text(),
	phy_mode: xml_any_tbl[any_ind].children("cfg_wire_in_mode").text(),
	associative_phy_mode: ["{LANG_NCLOSED}", "{LANG_NOPENED}", "{LANG_ICOUNT}", "{LANG_BALANCED}", "{LANG_DBALANCED}", "{LANG_IBALANCED}", "NONE", "{LANG_NCDUAL}"],
	NC_BILANCIATO: WIRE_NC_BILANCIATO,
	NC_DOPPIO_BILANCIAMENTO: WIRE_NC_DOPPIO_BILANCIAMENTO,
	NC_BILANCIATO_CONTAIMPULSI: WIRE_NC_BILANCIATO_CONTAIMPULSI,
	NC: WIRE_NC,
	NO: WIRE_NO,
	NC_CONTAIMPULSI: WIRE_NC_CONTAIMPULSI,
	NC_DUAL: WIRE_NC_DUAL,
	N_DISABLED: WIRE_N_DISABLED,
	mode_bus_rf: Number(xml_any_tbl[any_ind].find("mode").text()),
	mode_bus_rf_label: function()
	{
		var assarr = [];
		assarr[DELAYED] = "{LANG_BUS_SENRF_MODE_DETECT}";//"{LANG_DEFAULT_MODE}";
		assarr[MATCH_DEV] = "{LANG_BUS_SENRF_MODE_DETECT}";//"{LANG_DEV_AND_MODE}";
		assarr[MATCH_AREA] = "{LANG_BUS_SENRF_MODE_DETECT}";//"{LANG_AREA_AND_MODE}";
		assarr[ALA_MODE_M] = "{LANG_FIRST_AID}";
		assarr[ALA_MODE_P] = "{LANG_PANIC}";
		assarr[ALA_MODE_R] = "{LANG_AGGRESSION}";
		assarr[ALA_MODE_T] = "{LANG_TECNO_MODE}";
		assarr[ALA_MODE_SIR] = "{LANG_SIREN_MODE}";
		return assarr; 
	}(),
	mode_bus_rf_compact_gui_flg: false,
	//
	par_save: function()
	{
		ena_save = true;
		//
		save_item_name("#container_wired", this);
		//
		this.xml_any.find("room").text(id_room_selected);
		//
		save_item_reed_wired("#container_wired", this);
		//
		save_item_picker("#container_wired", "mode_delay_sec", "delay", this.xml_any);
		//
		save_item_picker("#container_wired", "mode_match_sec", "mode_match_sec_item", this.xml_any);
		//
		this.xml_any.children("sir_mode").text($("#container_wired .sound .sound_btn[data-checked='1']").attr("data-anchor"));
		//
		this.xml_any.children("cfg_wire_in_mode").text(this.phy_mode);
		if (wire_in_tst(Number(this.xml_any.children("ord").text())))
		{
			this.son1 = this.get_dual_son();
			if (this.son1 != null)
			{
				if (this.phy_mode == WIRE_NC_DUAL)
				{
					if (!(this.son1.children("cfg_wire_in_mode").text() == WIRE_NC_DUAL))
						this.son1.children("name").text(this.xml_any.children("name").text() + " b");
					this.son1.children("cfg_wire_in_mode").text(WIRE_NC_DUAL);
				}
				else
				{
					this.son1.children("cfg_wire_in_mode").text(WIRE_N_DISABLED);
				}
			}
		}
		//
		save_item_picker("#container_wired", "cfg_wire_in_pulse_n", "impulse", this.xml_any);
		//
		this.xml_any.children("mode_match_id").text(and_function_dev);
		//
		save_item_mode("#container_wired", this.xml_any, this);
		//
		save_item_chime("#container_wired", this);
		//
		save_item_area("#container_wired", this);
		//
		save_item_tvcc("#container_wired", this);
		//"save_item_tvcc_delay_initial" sempre dopo "save_item_tvcc"
		save_item_tvcc_delay_initial("#container_wired", this);
	},
	get_dual_son: function()
	{
		for (var i = 0; i < xml_any_tbl.length; i++)
		{
			if (xml_any_tbl[i].children("subcategory").text() == WS_DEV_ALARM_WIRED_STR)
				if (xml_any_tbl[i].children("wire_type").text() == "1")
					if (Number(xml_any_tbl[i].children("ord").text()) == (Number(this.xml_any.children("ord").text()) + WIRE_I_VIRTUAL_ORD_OFFSET))
						return xml_any_tbl[i];
		}
		return(null);
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