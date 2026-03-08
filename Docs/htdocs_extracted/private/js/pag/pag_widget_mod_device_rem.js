pag_table_new["widget_mod_device_rem"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		//
		this.get_relay_dev();
		//
		//
		init_rem("#container_remote", this);
		//
		//
		global_item_init("#container_remote", "name", "input", "name", this);
		//
		tslotf("#container_remote", this.xml_any);
		//
		item_fw_ver("#container_remote", this.xml_any);
		//
		item_delete("#container_remote", this);
		//
		//
/*this.xml_any.find("keys key[id='1'] type").text("0");
this.xml_any.find("keys key[id='2'] type").text("1");
this.xml_any.find("keys key[id='3'] type").text("2");
//this.xml_any.find("keys key[id='1'] par").text("");
//this.xml_any.find("keys key[id='2'] par").text("");
//this.xml_any.find("keys key[id='3'] par").text("");
this.xml_any.find("keys key[id='5'] type").text("3");
this.xml_any.find("keys key[id='6'] type").text("4");
this.xml_any.find("keys key[id='7'] type").text("9");
//this.xml_any.find("keys key[id='5'] par").text("");
//this.xml_any.find("keys key[id='6'] par").text("");
this.xml_any.find("keys key[id='7'] par").text("3");*/
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
	name: "widget_mod_device_rem",
	xml_any: xml_any_tbl[any_ind],
	title: xml_any_tbl[any_ind].children("name").text(),
	area_ins: [],
	area_dis: [],
	area_insp: [],
	events: [],
	events_array_init_flg: false,
	associative_xml_relay_domo_tbl: [],
	// AVE
	guiRemId: {
				"first_func": { trama_idx: "1", change_flg: false, save_type: null, save_par: null}
				,"second_func": { trama_idx: "2", change_flg: false, save_type: null, save_par: null}
				,"third_func": { trama_idx: "3", change_flg: false, save_type: null, save_par: null}
				,"fourth_func": { trama_idx: "7", change_flg: false, save_type: null, save_par: null}
				,"fifth_func": { trama_idx: "5", change_flg: false, save_type: null, save_par: null}
				,"sixth_func": { trama_idx: "6", change_flg: false, save_type: null, save_par: null}
			  },
	remToggleId: {
					"VOID": {tag: "{LANG_ITEM_NONE}", scelta: false, mode: 0}
					,"INS": {tag: "{LANG_ENGAGE}", scelta: true, mode: REM_MODE_1} // mode: "area"
					,"DIS": {tag: "{LANG_DISENGAGE}", scelta: true, mode: REM_MODE_1} // mode: "area"
					//,"INSP": {tag: "PART", scelta: true, mode: REM_MODE_1} // mode: "area"
					,"M": {tag: "{LANG_24H_M}", scelta: false, mode: 0}
					,"P": {tag: "{LANG_24H_P}", scelta: false, mode: 0}
					,"R": {tag: "{LANG_24H_R}", scelta: false, mode: 0}
					,"DOMO": {tag: "{LANG_DOMOTICA}", scelta: true, mode: REM_MODE_2} // mode: "domo"
					,"SCENE": {tag: "{LANG_SCENARI}", scelta: true, mode: REM_MODE_3} // mode: "scene"
					,"AUTOM": {tag: "{LANG_AUTOMATION}", scelta: true, mode: REM_MODE_4} // mode: "autom"
				 },
	//
	par_save: function()
	{
		ena_save = true;
		//
		save_item_name("#container_remote", this);
		//
		if (AVE)
		{
			for (var key in this.guiRemId)
			{
				var grio = this.guiRemId[key];
				if (grio.change_flg)
				{
					this.xml_any.find("keys key[id='" + grio.trama_idx + "'] type").text(grio.save_type);
					this.xml_any.find("keys key[id='" + grio.trama_idx + "'] par").text(grio.save_par);
				}
			}
			//
			save_item_tslot(this.xml_any);
		}
		else
		{
			this.xml_any.find("keys key[id='1'] par").text(this.aa_to_str(this.area_ins, true));
			this.xml_any.find("keys key[id='2'] par").text(this.aa_to_str(this.area_dis, true));
			this.xml_any.find("keys key[id='3'] par").text(this.aa_to_str(this.area_insp, true));
			//
			ena_save = this.events_array_init_flg;
			this.xml_any.find("keys key[id='7'] type").text(this.events[0].type);
			this.xml_any.find("keys key[id='5'] type").text(this.events[1].type);
			this.xml_any.find("keys key[id='6'] type").text(this.events[2].type);
			this.xml_any.find("keys key[id='7'] par").text(this.events[0].par);
			this.xml_any.find("keys key[id='5'] par").text(this.events[1].par);
			this.xml_any.find("keys key[id='6'] par").text(this.events[2].par);	
		}
	},
	aa_to_str: function(area_array, less)
	{
		return global_aa_to_str(area_array, less);
	},
	format_area_sl: function(str)
	{
		str = str.replace(/-/g, "");
		//
		for (var i = 0; i < area_list_ena_false.length; i++)
		{
			var regexArea = new RegExp(area_list_ena_false[i], "g");
			str = str.replace(regexArea, "");
		}
		return str;
	},
	get_relay_dev: function()
	{
		for (var i = 0; i < xml_any_tbl.length; i++)
			if
			(
				(
					xml_any_tbl[i].children("subcategory").text() == WS_DEV_ALARM_RELAY_STR
					&& xml_any_tbl[i].children("mode").text() == "2"
				)
				|| 
				(
					xml_any_tbl[i].children("subcategory").text() == WS_DEV_ALARM_WIRED_STR
					&& xml_any_tbl[i].children("wire_out_mode").text() == "2"
				)
			)
				this.associative_xml_relay_domo_tbl[xml_any_tbl[i].children("id").text()] = xml_any_tbl[i];
		return this.associative_xml_relay_domo_tbl;
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