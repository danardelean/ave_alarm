pag_table_new["widget_mod_device_relay"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		//
		//
		this.init_new_dev_list_oc();
		this.init_new_dev_list_sen();
		this.init_remote_list();
		//
		//name
		global_item_init("#container_relay", "name", "input", "name", this);
		//room
		item_room("#container_relay", this.xml_any);
		//
		global_load_areas_switcher("#area_container_mod", this.xml_any, this);
		//
		picker("#container_relay");
		//
		item_mode_alarm("#container_relay", this);
		//
		item_timing("#container_relay", this);
		//
		item_abilitation("#container_relay", this);
		//
		item_trigger_relay("#container_relay", this);
		//
		item_real_relay("#container_relay", this);
		//
		item_fw_ver("#container_relay", this.xml_any);
		//
		item_delete("#container_relay", this);
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
						if (this.mode != "2")
							this.delete_relay_from_rem();
						//
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
						this.delete_relay_from_rem();
						//
						$("#header-home-page2 .close").trigger("click", [true]);
					}
				}
				else if (indi.children("res").text() == "ERROR")
				{
					alert(indi.children("res").text()+": "+indi.children("desc").text());
				}
			}
		}
	},
	onclose: function()
	{
		//
	},
	//
	name: "widget_mod_device_relay",
	xml_any: xml_any_tbl[any_ind],
	title: xml_any_tbl[any_ind].children("name").text(),
	xml_any_arr: [],
	xml_sen_oc_tbl: [],
	xml_sen_tbl: [],
	mode_domo_sen_a_id: xml_any_tbl[any_ind].children("mode_domo_sen_a_id").text(),
	mode_domo_sen_b_id: xml_any_tbl[any_ind].children("mode_domo_sen_b_id").text(),
	mode_domo_sen_c_id: xml_any_tbl[any_ind].children("mode_domo_sen_c_id").text(),
	mode: xml_any_tbl[any_ind].children("mode").text(),
	mode_repeat_eve: xml_any_tbl[any_ind].children("mode_repeat_eve").text(),
	mode_repeat_par: xml_any_tbl[any_ind].children("mode_repeat_par").text(),
	cfg_relay_cfm_exe_ext: xml_any_tbl[any_ind].children("cfg_rele_cfm_exe_ext").text(),
	cfg_relay_mode: xml_any_tbl[any_ind].children("cfg_rele_mode").text(),
	mode_domo_mono_sec: xml_any_tbl[any_ind].children("mode_domo_mono_sec").text(),
	mode_domo_blind_sec: xml_any_tbl[any_ind].children("mode_domo_blind_sec").text(),
	mode_domo_sen_trigger_id: xml_any_tbl[any_ind].children("mode_domo_sen_trigger_id").text(),
	//
	par_save: function()
	{
		ena_save = true;
		//
		save_item_name("#container_relay", this);
		//
		this.xml_any.find("room").text(id_room_selected);
		//
		this.xml_any.find("mode").text(this.mode);
		this.xml_any.find("mode_repeat_eve").text(this.mode_repeat_eve);
		this.xml_any.find("mode_repeat_par").text(this.mode_repeat_par);
		this.xml_any.find("cfg_rele_mode").text(this.cfg_relay_mode);
		this.xml_any.find("mode_domo_mono_sec").text(this.mode_domo_mono_sec);
		this.xml_any.find("mode_domo_blind_sec").text(this.mode_domo_blind_sec);
		this.xml_any.find("mode_domo_sen_trigger_id").text(this.mode_domo_sen_trigger_id);
		//
		this.xml_any.find("mode_domo_sen_a_id").text(this.mode_domo_sen_a_id);
		this.xml_any.find("mode_domo_sen_b_id").text(this.mode_domo_sen_b_id);
		this.xml_any.find("mode_domo_sen_c_id").text(this.mode_domo_sen_c_id);
		//
		this.xml_any.find("cfg_rele_cfm_exe_ext").text(this.cfg_relay_cfm_exe_ext);
		//
		save_item_area("#container_relay", this);
	},
	init_new_dev_list_oc: function()
	{
		var j = 0;
		for (var i = 0; i < xml_any_tbl.length; i++)
		{
			var subcategory = xml_any_tbl[i].children("subcategory").text();
			if 
			(
				(
					subcategory == WS_DEV_ALARM_SEN_MAG_STR 
					&& check_son_ena(xml_any_tbl[i].children("ord").text(), subcategory, xml_any_tbl[i]) 
					&& xml_any_tbl[i].children("alarm_mode").text() == "2"
					&& this.match_areas(xml_any_tbl[i], this.xml_any)
				)
				||
				(
					subcategory == WS_DEV_ALARM_SEN_MIC_STR
					&& check_son_ena(xml_any_tbl[i].children("ord").text(), subcategory, xml_any_tbl[i])
					&& xml_any_tbl[i].children("alarm_mode").text() == "2"
					&& this.match_areas(xml_any_tbl[i], this.xml_any)
				)
				||
				(
					subcategory == WS_DEV_ALARM_SENUNI_STR
					&& check_son_ena(xml_any_tbl[i].children("ord").text(), subcategory, xml_any_tbl[i])
					&& xml_any_tbl[i].children("alarm_mode").text() == "2"
					&& this.match_areas(xml_any_tbl[i], this.xml_any)
				)
				||
				(
					subcategory == WS_DEV_ALARM_WIRED_STR
					&& xml_any_tbl[i].children("wire_type").text() === "1" //ingressi
					&& check_son_ena(xml_any_tbl[i].children("ord").text(), subcategory, xml_any_tbl[i])
					&& xml_any_tbl[i].children("cfg_wire_in_alarm_mode").text() == "2"
					&& this.match_areas(xml_any_tbl[i], this.xml_any)
				)
			)
				this.xml_sen_oc_tbl[j++] = xml_any_tbl[i];
		}
	},
	init_new_dev_list_sen: function()
	{
		var j = 0;
		for (var i = 0; i < xml_any_tbl.length; i++)
		{
			var subcategory = xml_any_tbl[i].children("subcategory").text();
			if 
			(
				(
					(
						subcategory == WS_DEV_ALARM_SEN_MAG_STR
						|| subcategory == WS_DEV_ALARM_SEN_PIR_STR
						|| subcategory == WS_DEV_ALARM_SEN_DT_STR
						|| subcategory == WS_DEV_ALARM_SEN_SMO_STR
						|| subcategory == WS_DEV_ALARM_SEN_FLO_STR
						|| subcategory == WS_DEV_ALARM_SEN_MIC_STR
						||
						(
							subcategory == WS_DEV_ALARM_SENUNI_STR
							&& xml_any_tbl[i].children("ord").text() != "0"
						)
						|| subcategory == WS_DEV_ALARM_SEN_PHOTOPIR_STR
						||
						(
							subcategory == WS_DEV_ALARM_WIRED_STR
							&& xml_any_tbl[i].children("wire_type").text() === "1" //ingressi
						)
					)
					&& check_son_ena(xml_any_tbl[i].children("ord").text(), subcategory, xml_any_tbl[i])
					&& this.match_areas(xml_any_tbl[i], this.xml_any)
				)
			)
				this.xml_sen_tbl[j++] = xml_any_tbl[i];
		}
	},
	init_remote_list: function() /*inizializza la lista dei rem collegati al relay*/
	{
		var widget_obj = this;
		for (var i = 0; i < xml_any_tbl.length; i++)
		{
			if (xml_any_tbl[i].children("subcategory").text() == WS_DEV_ALARM_REM_STR)
			{
				xml_any_tbl[i].find("keys key")
				.filter(function()
				{
					if ($(this).children("type").text() == "DOMO")
						return true;
					else
						return false;
				})
				.each(function()
				{
					if ($(this).children("par").text() == widget_obj.xml_any.children("id").text())
					{
						widget_obj.xml_any_arr.push(xml_any_tbl[i]);
						return false;
					}
				});
			}
		}
	},
	delete_relay_from_rem: function()
	{
		var all_areas_selected_str = "";
		var widget_obj = this;
		if (this.xml_any_arr.length > 0)
		{
			area_list.children("item").each(function()
			{
				all_areas_selected_str += $(this).children("id").text();
			});
		}
		//
		for (var i = 0; i < this.xml_any_arr.length; i++)
		{
			this.xml_any_arr[i].find("keys key").each(function()
			{
				if ($(this).children("type").text() == "DOMO")
				{
					if ($(this).children("par").text() == widget_obj.xml_any.children("id").text())
					{
						$(this).children("type").text("VOID");
						$(this).children("par").text(all_areas_selected_str);
					}
				}
			});
		}
		//
		if (this.xml_any_arr.length > 0)
		{
			global_send_dev_mod_save(this, false, false);
		}
	},
	match_areas: function(trama1, trama2)
	{
		var tr1_areas = trama1.children("area_alarm").text();
		var tr2_areas = trama2.children("area_alarm").text();
		//
		for (var i = 0; i < tr1_areas.length; i++)
		{
			if (tr1_areas.charAt(i) != "-" && tr1_areas.charAt(i) == tr2_areas.charAt(i))
				return true;
		}
		//
		return false;
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