pag_table_new["widget_set_device_rem"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		//
		storing = false;
		this.get_relay_dev();
		//
		if (AVE)
		{
			init_rem(".widget_set_device_rem", this);
		}
		else
		{
			item_dev_areas(".widget_set_device_rem", this);
			//
			item_dev_events(".widget_set_device_rem", this);
		}
		//
		var widget_device_type_str = xml_file_configuration
			.find("Categories")
			.find("Category[id='" + xml_any_tbl[any_ind].find("category").text() + "']")
			.find("Subcategories").find("Subcategory[id='" + this.xml_any
			.find("subcategory").text() + "']")
			.attr("name");
		if (this.xml_any.children("name").text() != "")
			widget_device_type_str = this.xml_any.children("name").text();
		//
		var nameDev = widget_device_type_str + " " + this.xml_any.find("prg").text();
		global_item_init("." + this.name, "name", "input", null, null, null, nameDev, this.xml_any.children("name").attr("maxlength"));
		$("#header-home-page2 .header_title").text(nameDev);
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "MENU")
		{
			if (conf.children("act").text() == "SAVE")
			{
				if (conf.children("res").text() == "SAVED")
				{
					$(".footer_container_btn_inside").trigger("any_saved");
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
	name: "widget_set_device_rem",
	xml_any: xml_any_tbl[any_ind],
	area_ins: [],
	area_dis: [],
	area_insp: [],
	events: [],
	events_array_init_flg: false,
	associative_xml_relay_domo_tbl: [],
	//
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
		save_item_name(".widget_set_device_rem", this);
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
	format_area_sl: function(str)
	{
		str = str.replace(/-/g, "");
		//
		for (var i = 0; i < area_list_ena_false.length; i++)
		{
			var regexArea = new RegExp(area_list_ena_false[i], "g");
			str = str.replace(regexArea, "");
		}
		//
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
		$("#header-home-page2 .close").off("click").click(function()
		{
			pag_change("#seeking-page .quadrant_abcd", "widget_device_wireless");
		});
		//
		$("#backTitle").html("{LANG_WIZARD_DEVICE_WIRELESS_TITLE_R}");
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
			//
			if (ena_save)
				startWaitingScr();
		}).on("any_saved", function()
		{
			stopWaitingScr();
			//
			var footer_type_str = xml_file_configuration
				.find("Categories")
				.find("Category[id='"+xml_any_tbl[any_ind].find("category").text()+"']")
				.find("Subcategories").find("Subcategory[id='"+xml_any_tbl[any_ind]
				.find("subcategory").text()+"']")
				.attr("name");
			pag_change("#seeking-page .quadrant_abcd.abcd", "widget_confirm", footer_type_str, xml_any_tbl[any_ind].children("name").text(), "widget_devices_add");
		});
		//
		footer_button_rotate();
		scrollList(this);
	}
};