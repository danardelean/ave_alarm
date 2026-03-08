pag_table_new["widget_set_device_bus"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		//
		storing = false;
		//
		item_room(".widget_set_device_bus", this.xml_any);
		//
		if 
		(
			this.subcat == WS_DEV_ALARM_BUS_TAG_READER_STR
			|| this.subcat == WS_DEV_ALARM_BUS_REM_STR
		)
		{
			$("#set_area_standard").remove();
			//
			item_dev_areas("#set_area_selector", this);
		}
		else
		{
			$("#set_area_selector").remove();
			//
			global_load_areas_switcher("#area_container_set", this.xml_any, this);
			if (this.subcat == WS_DEV_ALARM_BUS_CONC_RF_STR)
				$("#area_container_set .switcher").trigger("switch_state_changer", [["disabled"]]);
		}
		//
		var widget_device_type_str = xml_file_configuration
			.find("Categories")
			.find("Category[id='" + xml_any_tbl[any_ind].find("category").text() + "']")
			.find("Subcategories").find("Subcategory[id='" + this.subcat + "']")
			.attr("name");
		if (this.xml_any.children("name").text() != "")
			widget_device_type_str = this.xml_any.children("name").text();
		//
		var nameDev = "";
		if (this.subcat == WS_DEV_ALARM_BUS_INPUT_STR)
			nameDev = widget_device_type_str + " #" + this.xml_any.find("prg").text();
		else
			nameDev = widget_device_type_str + " " + this.xml_any.find("prg").text();
		//
		global_item_init(".widget_set_device_bus", "name", "input", null, null, null, nameDev, this.xml_any.children("name").attr("maxlength"));
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
					tyu(conf.children("res").text() + ": " + conf.children("desc").text());
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
	name: "widget_set_device_bus",
	xml_any: xml_any_tbl[any_ind],
	subcat: xml_any_tbl[any_ind].find("subcategory:first").text(),
	area_ins: [],
	area_dis: [],
	area_insp: [],
	insp_def_flg: xml_any_tbl[any_ind].children("insp_def_flg").text(),
	sons: function()
	{
		var sonsList = [];
		if (xml_any_tbl[any_ind].children("has_children").text() == "1")
		{
			var i = 1;
			while 
			(
				(any_ind + i) in xml_any_tbl
				&& xml_any_tbl[any_ind + i].children("subcategory").text() == xml_any_tbl[any_ind].children("subcategory").text()
				&& !(xml_any_tbl[any_ind + i].children("ord").text() == "0")
			)
			{
				sonsList.push(xml_any_tbl[any_ind + i]);
				i++;
			}
		}
		return sonsList;
	}(),
	//
	par_save: function()
	{
		ena_save = true;
		//
		save_item_name("." + this.name, this);
		//
		this.xml_any.find("room").text(id_room_selected);
		//		
		if (this.subcat == WS_DEV_ALARM_BUS_TAG_READER_STR)
		{
			this.xml_any.find("area_ins").text(this.aa_to_str(this.area_ins, true));
			this.xml_any.find("area_dis").text(this.aa_to_str(this.area_dis, true));
			this.xml_any.find("area_insp").text(this.aa_to_str(this.area_insp, true));
			//
			this.xml_any.find("insp_def_flg").text(this.insp_def_flg);
		}
		else if (this.subcat == WS_DEV_ALARM_BUS_REM_STR)
		{
			this.xml_any.find("keys key[id='1'] par").text(this.aa_to_str(this.area_ins, true));
			this.xml_any.find("keys key[id='2'] par").text(this.aa_to_str(this.area_dis, true));
			this.xml_any.find("keys key[id='3'] par").text(this.aa_to_str(this.area_insp, true));
			//
			this.xml_any.find("keys key[id='1'] type").text("INS");
			this.xml_any.find("keys key[id='2'] type").text("DIS");
			this.xml_any.find("keys key[id='3'] type").text("INSP");
			//
			this.xml_any.find("insp_def_flg").text(this.insp_def_flg);
		}
		else
		{
			var area_str = save_item_area("#area_container_set", this);
		}
		//
		if (ena_save)
		{
			var inputName = $("." + this.name + " .name").first().val();
			var progressivo = "";
			//
			if (this.subcat == WS_DEV_ALARM_BUS_INPUT_STR)
			{
				progressivo = " - ";
				var extract_custom_prg = inputName.cutAround("#" , " ");
				if (isNaN(extract_custom_prg))
					progressivo += this.xml_any.find("prg").text();
				else
					progressivo += extract_custom_prg;
			}
			//
			for (var i = 0; i < this.sons.length; i++)
			{
				this.sons[i].children("name").text(inputName + progressivo + "." + (i + 1));
				this.sons[i].children("room").text(id_room_selected);
				this.sons[i].children("area_alarm").text(area_str);
			}
		}
	},
	aa_to_str: function(area_array, less)
	{
		return global_aa_to_str(area_array, less);
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
//		$("#header-home-page2 .close").off("click").click(function()
//		{
//			pag_change("#seeking-page .quadrant_abcd", "widget_device_wireless");
//		});
		$("#header-home-page2 .close").off("click").addClass("disabled");
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