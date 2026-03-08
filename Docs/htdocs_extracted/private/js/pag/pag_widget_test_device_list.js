pag_table_new["widget_test_device_list"] = {
	onload: function()
	{
		page_act("#seeking-page");
		schema_act("#seeking-page", "quadrant_abcd");
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		//
		if (this.type_of_list == DEVICE_TEST_TEL)
			$("#test_device_list_item_title").html("{LANG_WIZARD_TEST_DEVICE_LIST_TITLE_TEL}");
		else if (this.type_of_list == DEVICE_TEST_TVCC)
			$("#test_device_list_item_title").html("{LANG_WIZARD_TEST_DEVICE_LIST_TITLE_TVCC}");
		else if (this.type_of_list == DEVICE_TEST_SIR)
			$("#test_device_list_item_title").html("{LANG_WIZARD_TEST_DEVICE_LIST_TITLE_SIR}");
		else if (this.type_of_list == DEVICE_TEST_RELAY)
			$("#test_device_list_item_title").html("{LANG_WIZARD_TEST_DEVICE_LIST_TITLE_RELAY}");
		//
		if (this.type_of_list == DEVICE_TEST_SIR)
			this.associative_eye[WS_DEV_ALARM_SIR_STR] = true;
		if (this.type_of_list == DEVICE_TEST_SIR)
			this.associative_eye[WS_DEV_ALARM_SIRI_STR] = true;
		this.associative_eye[WS_DEV_ALARM_GSM_STR] = true;
		this.associative_eye[WS_DEV_ALARM_PSTN_STR] = true;
		this.associative_eye[WS_DEV_ALARM_WIFI_STR] = true;
		this.associative_eye[WS_DEV_ALARM_RELAY_STR] = true;
		this.associative_eye[WS_DEV_ALARM_BUS_RELAY_STR] = true;
		this.associative_eye[WS_DEV_ALARM_TVCC_STR] = true;
		if (this.type_of_list == DEVICE_TEST_TVCC)
			this.associative_eye[WS_DEV_ALARM_SEN_PHOTOPIR_STR] = true;
		//
		pag_table_new["main_obj"].preload_dev = true;
		xml_menu_load_send(WS_TEST_STR, null, null, "main_obj", this.type_of_list);
		//
		//
		this.widget_loaded = true;
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "MENU")
		{
			if (conf.children("page").text() == WS_TEST_STR)
			{
				if (conf.children("act").text() == "STOP")
				{
					$(".footer_container_btn_inside").trigger("test_stopped");
					if (this.type_of_list == DEVICE_TEST_TEL)
						$("#header-home-page2 .header_title").html("{LANG_WIZARD_TEST_DEVICE_LIST_RESULT_TITLE_TEL}");
					else if (this.type_of_list == DEVICE_TEST_TVCC)
						$("#header-home-page2 .header_title").html("{LANG_WIZARD_TEST_DEVICE_LIST_RESULT_TITLE_TVCC}");
					else if (this.type_of_list == DEVICE_TEST_SIR)
						$("#header-home-page2 .header_title").html("{LANG_WIZARD_TEST_DEVICE_LIST_RESULT_TITLE_SIR}");
					else if (this.type_of_list == DEVICE_TEST_RELAY)
						$("#header-home-page2 .header_title").html("{LANG_WIZARD_TEST_DEVICE_LIST_RESULT_TITLE_RELAY}");
					else
						$("#header-home-page2 .header_title").html("{LANG_WIZARD_TEST_DEVICE_LIST_RESULT_TITLE}");
				}
				else if (conf.children("act").text() == "START")
				{
					//
				}
				else
				{
					alert("ERROR: "+conf.children("act").text());
				}
			}
		}
	},
	onrecv_indication: function(indi)
	{
		if (indi.attr("type") == "MENU")
		{
			if (indi.children("page").text() == WS_TEST_STR)
			{
				if (indi.children("act").text() == "CHECKED" && this.type_of_list == DEVICE_TEST_SEN)
				{
					var id_dev = indi.find("par id").text();
					var id_eve = indi.find("par eve_id").text();
					this.draw_item(associative_dbid_dev[id_dev], id_eve);
					scrollListArrowCheck(this);
				}
			}
		}
	},
	onclose: function()
	{
		xml_any_tbl_test = [];
	},
	//
	name: "widget_test_device_list",
	title: "{LANG_WIZARD_TEST_DEVICE_LIST_TITLE}",
	room_list_array: [],
	filter_device_associative_array: [],
	associative_device_list: [],
	visible_count: 0,
	first_time_load: true,
	run_once: true, //true ==> fase 1 del test //false ==> fase dei risultati del test
	associative_eye: [],
	type_of_list: $(".widget_test_device_list").attr("data-type-of-list"),
	widget_loaded: false,
	gui_index: 0,
	index_flgs: [],
//	eve_arr: [],
	//
	filter_dev: function()
	{
		var area = filter_area.length;
		var type = filter_type.length;
		var room = filter_room.length;
		//
		if (area+type+room > 0)
		{
			$(".test_device_list_item.device:visible").hide();
			$(".test_device_list_item.device")
			.each(function()
			{
				if (area > 0 && room == 0 && type == 0)
				{
					var item_f = $(this);
					var area_f = item_f.find(".t_r_a .area span").text();
					for (var i = 0; i < filter_area.length; i++)
					{
						if (area_f.indexOf(filter_area[i]) > -1)
						{
							item_f.show();
							i = filter_area.length;
						}
					}
				}
				if (area == 0 && room > 0 && type == 0)
				{
					var item_f = $(this);
					var room_f = item_f.find(".t_r_a .room span").attr("data-id");
					for (var i = 0; i < filter_room.length; i++)
					{
						if (room_f == filter_room[i])
						{
							item_f.show();
							i = filter_room.length;
						}
					}
				}
				if (area == 0 && room == 0 && type > 0)
				{
					var item_f = $(this);
					var type_f = item_f.find(".t_r_a .type span").attr("data-type");
					for (var i = 0; i < filter_type.length; i++)
					{
						if (type_f == filter_type[i])
						{
							item_f.show();
							i = filter_type.length;
						}
					}
				}
				if (area > 0 && room > 0 && type == 0)
				{
					var item_f = $(this);
					var area_f = item_f.find(".t_r_a .area span").text();
					var room_f = item_f.find(".t_r_a .room span").attr("data-id");
					for (var i = 0; i < filter_area.length; i++)
					{
						if (area_f.indexOf(filter_area[i]) > -1)
						{
							item_f.show();
							i = filter_area.length;
						}
					}
					if (item_f.is(":visible"))
					{
						item_f.hide();
						for (var i = 0; i < filter_room.length; i++)
						{
							if (room_f == filter_room[i])
							{
								item_f.show();
								i = filter_room.length;
							}
						}
					}
				}
				if (area == 0 && room > 0 && type > 0)
				{
					var item_f = $(this);
					var type_f = item_f.find(".t_r_a .type span").attr("data-type");
					var room_f = item_f.find(".t_r_a .room span").attr("data-id");
					for (var i = 0; i < filter_type.length; i++)
					{
						if (type_f == filter_type[i])
						{
							item_f.show();
							i = filter_type.length;
						}
					}
					if (item_f.is(":visible"))
					{
						item_f.hide();
						for (var i = 0; i < filter_room.length; i++)
						{
							if (room_f == filter_room[i])
							{
								item_f.show();
								i = filter_room.length;
							}
						}
					}
				}
				if (area > 0 && room == 0 && type > 0)
				{
					var item_f = $(this);
					var type_f = item_f.find(".t_r_a .type span").attr("data-type");
					var area_f = item_f.find(".t_r_a .area span").text();
					for (var i = 0; i < filter_type.length; i++)
					{
						if (type_f == filter_type[i])
						{
							item_f.show();
							i = filter_type.length;
						}
					}
					if (item_f.is(":visible"))
					{
						item_f.hide();
						for (var i = 0; i < filter_area.length; i++)
						{
							if (area_f.indexOf(filter_area[i]) > -1)
							{
								item_f.show();
								i = filter_area.length;
							}
						}
					}
				}
				if (area > 0 && room > 0 && type > 0)
				{
					var item_f = $(this);
					var type_f = item_f.find(".t_r_a .type span").attr("data-type");
					var area_f = item_f.find(".t_r_a .area span").text();
					var room_f = item_f.find(".t_r_a .room span").attr("data-id");
					for (var i = 0; i < filter_type.length; i++)
					{
						if (type_f == filter_type[i])
						{
							item_f.show();
							i = filter_type.length;
						}
					}
					if (item_f.is(":visible"))
					{
						item_f.hide();
						for (var i = 0; i < filter_area.length; i++)
						{
							if (area_f.indexOf(filter_area[i]) > -1)
							{
								item_f.show();
								i = filter_area.length;
							}
						}
					}
					if (item_f.is(":visible"))
					{
						item_f.hide();
						for (var i = 0; i < filter_room.length; i++)
						{
							if (room_f == filter_room[i])
							{
								item_f.show();
								i = filter_room.length;
							}
						}
					}
				}
			});
		}
		else
		{
			if (this.first_time_load)
				this.first_time_load = false;
			else
				$(".test_device_list_item.device:hidden").show();
		}
		//this.gui_detail();
	},
	gui_detail: function()
	{
		var alen = filter_area.length;
		var rlen = filter_room.length;
		var tlen = filter_type.length;
		//
		$(".foot_button.filter").swapClass("yebg", "bg_azure_gr");
		if ((alen + rlen + tlen) != 0)
		{
			if (alen > 0)
				$(".foot_button.filter.filter_area").swapClass("bg_azure_gr", "yebg");
			if (rlen > 0)
				$(".foot_button.filter.filter_room").swapClass("bg_azure_gr", "yebg");
			if (tlen > 0)
				$(".foot_button.filter.filter_type").swapClass("bg_azure_gr", "yebg");
		}
	},
	show_gui_device_test: function()
	{
		this.visible_count = 0;
		$(".test_device_list_container *:not(.scrollableSize)").remove();
		this.gui_index = 0;
		//
		this.index_flgs[WS_DEV_ALARM_SEN_MAG_STR] = false;
		this.index_flgs[WS_DEV_ALARM_SEN_MIC_STR] = false;
		this.index_flgs[WS_DEV_ALARM_WIRED_STR] = false;
		this.index_flgs[WS_DEV_ALARM_SENUNI_STR] = false;
		//
		var populate = (NICE || DIY) ? true : !(this.run_once && this.type_of_list == DEVICE_TEST_SEN);
		//
		var dev_len = populate ? xml_any_tbl_test.length : 0;
		for (var index = 0; index < dev_len; index++)
		{
			this.draw_item(index);
		}
		scrollListArrowCheck(this);
		//
		//this.filter_dev();
		//
		$(".widget_test_device_list .eye_binder").click(function()
		{
			if (!this.run_once)
			{
				var dev_id_db = $(this).parent().attr("data-id");
				any_ind = $(this).attr("data-index");
				var dev_sub = $(this).siblings(".t_r_a").find(".type span").attr("data-type");
				var dev_name = xml_any_tbl_test[any_ind].children("name").text();
				//
				var type_str = $(this).siblings(".t_r_a").find(".type span").text() || "none";
				var room_str = $(this).siblings(".t_r_a").find(".room span").text() || "none";
				var area_str = $(this).siblings(".t_r_a").find(".area span").text() || "none";
				//
				pag_change(".JSdialog", "widget_test_device_detail", type_str, room_str, area_str, dev_sub, dev_id_db, dev_name);
			}
		});
		//
		//binding menu filtro room
		if (NICE || DIY) global_apply_diag(".widget_test_device_list", "filter_room", "{LANG_WIZARD_ADD_OTHER_DEVICES_ROOM}", null, null, "widget_test_device_list");
		//binding menu filtro device
		global_apply_diag(".widget_test_device_list", "filter_type", "{LANG_WIZARD_ADD_OTHER_DEVICES_TYPE}", null, null, "widget_test_device_list");
		//binding menu filtro aree
		global_apply_diag(".widget_test_device_list", "filter_area", "{LANG_WIZARD_ADD_OTHER_DEVICES_AREA}", null, null, "widget_test_device_list");
		//
		if (this.run_once)
		{
			xml_request = xml_request_head_build("MENU", "widget_test_device_list");
			xml_par = $(XML("act")); xml_par.text("START"); xml_request.append(xml_par);		
			xml_par = $(XML("page")); xml_par.text(WS_TEST_STR); xml_request.append(xml_par);		
			xml_par = $(XML("par")); xml_par.text(this.type_of_list); xml_request.append(xml_par);
			xml_send(xml_request);
		}
	},
	draw_item: function(index, eve_id)
	{
		var ord = xml_any_tbl_test[index].children("ord").text();
		var subcategory = xml_any_tbl_test[index].children("subcategory").text();
		//
		this.visible_count++;
		//
		var room = xml_any_tbl_test[index].children("room").text();
		var data_id = xml_any_tbl_test[index].children("id").text();
		//
		var tra_type_inner = device_associative_array[subcategory];
		//
		this.filter_device_associative_array[subcategory] = 1;//serve per select distinct dei filtri
		this.associative_device_list[data_id] = true;//serve per rimuovere il device tramite indication
		//controllo indici di lista
		var iii = -1;
		if (this.run_once && (SIL || AVE))
		{
			iii = ++this.gui_index;
		}
		else
		{
			if (subcategory in this.index_flgs)
			{
				if (ord != "0")
				{
					if (!this.index_flgs[subcategory])
					{
						this.gui_index++;
						this.index_flgs[subcategory] = this.gui_index;
					}
					iii = this.index_flgs[subcategory]+String.fromCharCode(ord-1+97);
					//
					tra_type_inner += wired_type_str(subcategory, xml_any_tbl_test[index]);
				}
				else
				{
					iii = ++this.gui_index;
					this.index_flgs[subcategory] = iii;
				}
			}
			else
			{
				iii = ++this.gui_index;
			}
		}
		//
		var name = xml_any_tbl_test[index].children("name").text();
		//
		var tra_area_inner = null;
		if (xml_any_tbl_test[index].children("areas").length > 0)
		{
			tra_area_inner = xml_any_tbl_test[index].children("areas").text();
		}
		//
		tra_area_inner = tra_area_inner.split("");
		for (var m = 0; m < area_list_ena_false.length; m++)
		{
			tra_area_inner[area_list_ena_false[m] - 1] = "X";
			if
			(
				subcategory === WS_DEV_ALARM_REM_STR
				|| subcategory === WS_DEV_ALARM_BUS_REM_STR
				|| subcategory === WS_DEV_ALARM_RFID_STR 
				|| subcategory === WS_DEV_ALARM_BUS_TAG_READER_STR
			)
			{
				tra_area_inner[(area_list_ena_false[m] - 1) + 7] = "X";
				tra_area_inner[(area_list_ena_false[m] - 1) + 14] = "X";
			}
		}
		tra_area_inner = tra_area_inner.join("");
		//
		var spv_flg = xml_any_tbl_test[index].attr("spv") === "1" && this.type_of_list == DEVICE_TEST_SEN;
		var bat_flg = xml_any_tbl_test[index].attr("bat") === "1" && spv_flg;
		var rf_flg = xml_any_tbl_test[index].attr("rf") === "1" && spv_flg;
		var ala_flg = xml_any_tbl_test[index].attr("ala") === "1" && spv_flg;
		var tam_flg = xml_any_tbl_test[index].attr("tam") === "1" && spv_flg;
		if (!this.run_once)
		{	// Andrebbe usato qualcosa del genere: xml_file_configuration.find("Logs LogEvents LogEvent[id='"+eve_id+"']").attr("desc")
			if (ala_flg && tam_flg)
				tra_area_inner += " ({LANG_TEST_DEV_STATE_ALARM} + {LANG_TEST_DEV_STATE_TAMPER})";
			else if (ala_flg)
				tra_area_inner += " ({LANG_TEST_DEV_STATE_ALARM})";
			else if (tam_flg)
				tra_area_inner += " ({LANG_TEST_DEV_STATE_TAMPER})";
		}
//		this.eve_arr = [];
//		if (xml_any_tbl_test[index].attr("ala") === "1") this.eve_arr.push(true);
//		if (xml_any_tbl_test[index].attr("tam") === "1") this.eve_arr.push(true);
		//
		var color_item_name = "";
		if (spv_flg)
			if (!bat_flg && !rf_flg)
				color_item_name = " green";
			else
				color_item_name = " red";
		//
		var eye_show = this.associative_eye[subcategory] || false;
		//
		if ((SIL || AVE) && this.run_once && this.type_of_list == DEVICE_TEST_SEN)
		{
			$(".test_device_list_container").prepend
			(
			"<div class='test_device_list_item device" + (eye_show ? " eyeshow" : "") + "' data-id='"+data_id+"'>"
				+"<p class='number'>"+iii+"</p>"
				+"<p class='name"+color_item_name+"'>"+name+"</p>"
				+"<div class='t_r_a'>"
					+ "<p class='type'>{LANG_WIZARD_ADD_DEVICE_TYPE}: <span data-type='"+subcategory+"'>"+tra_type_inner+"</span></p>"
					+ ((NICE || DIY) && room !== "" ? "<p class='room'>{LANG_WIZARD_ADD_DEVICE_ROOM}: <span data-id='"+room+"'>"+this.room_list_array[room-1]+"</span></p>" : "")
					+ (tra_area_inner != null ? "<p class='area'>{LANG_WIZARD_ADD_DEVICE_AREA}: <span>"+tra_area_inner+"</span></p>" : "")
				+"</div>"
				+"<div class='eve_desc'>"+xml_file_configuration.find("Logs LogEvents LogEvent[id='"+eve_id+"']").attr("desc")+"</div>"
			+"</div>"
			);
			//
			//this.filter_dev();
		}
		else
		{
//			for (var i = this.eve_arr.length == 0 ? -1 : 0; i < this.eve_arr.length; i++)
//			{
				$(".test_device_list_container").append
				(
				"<div class='test_device_list_item device" + (eye_show ? " eyeshow" : "") + "' data-id='"+data_id+"'>"
					+"<p class='number'>"+iii+"</p>"
					+"<p class='name"+color_item_name+"'>"+name+"</p>"
					+"<div class='t_r_a'>"
						+ "<p class='type'>{LANG_WIZARD_ADD_DEVICE_TYPE}: <span data-type='"+subcategory+"'>"+tra_type_inner+"</span></p>"
						+ ((NICE || DIY) && room !== "" ? "<p class='room'>{LANG_WIZARD_ADD_DEVICE_ROOM}: <span data-id='"+room+"'>"+this.room_list_array[room-1]+"</span></p>" : "")
						+ (tra_area_inner != null ? "<p class='area'>{LANG_WIZARD_ADD_DEVICE_AREA}: <span>"+tra_area_inner+"</span></p>" : "")
					+"</div>"
					+ (bat_flg ? "<div class='bat_flg"/*+(i > -1 ? " half_height" : "")*/+"'></div>" : "")
					+ (rf_flg ? "<div class='rf_flg"/*+(i > -1 ? " half_height" : "")*/+"'></div>" : "")
//					+ ((SIL || AVE) && this.type_of_list == DEVICE_TEST_SEN && i > -1 ? "<div class='eve_desc"+(!bat_flg && !rf_flg ? "" : "")+"'>"+this.from_attr_to_evestr(i)+"</div>" : "")
					+ (eye_show && this.run_once ? "<div class='eye_binder' data-index='"+index+"'></div>" : "")
				+"</div>"
				);
//			}
		}
	},
	from_attr_to_evestr: function(index)
	{
		switch(index)
		{
			case 0:
				return xml_file_configuration.find("Logs LogEvents LogEvent[id='1']").attr("desc");
				break;
			case 1:
				return xml_file_configuration.find("Logs LogEvents LogEvent[id='19']").attr("desc");
				break;
			default:
				return "NO LABEL";
		}
	},
	clean_page: function()
	{
		xml_request = xml_request_head_build("MENU");
		xml_par = $(XML("act")); xml_par.text("STOP"); xml_request.append(xml_par);		
		xml_par = $(XML("page")); xml_par.text(WS_TEST_STR); xml_request.append(xml_par);		
		xml_par = $(XML("par")); xml_par.text(this.type_of_list); xml_request.append(xml_par);
		xml_send(xml_request);
		//
		pag_clear("#seeking-page .quadrant");
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			widget_obj.clean_page();
			//
			if ("widget_test_device" in pag_table_new)
				pag_table_new["widget_test_device"].onload();
			else
				pag_change("#seeking-page .quadrant_abcd", "widget_test_device");
		});
		//
		$("#backTitle").html("{LANG_WIZARD_TEST_DEVICE_TITLE}");
	},
	footer_home_switch: function()
	{
		var widget_obj = this;
		footer_home_switch_init();
		//
		//
		draw_footer_button("{LANG_OK}", "footer_h2_a_a");
		//
		$("#footer_h2_a_a").off("click").click(function()
		{
			if (!widget_obj.run_once || widget_obj.type_of_list != DEVICE_TEST_SEN)
			{
				$("#header-home-page2 .close").trigger("click");
			}
			else
			{
				widget_obj.run_once = false;
				//
				xml_request = xml_request_head_build("MENU", "widget_test_device_list");
				xml_par = $(XML("act")); xml_par.text("STOP"); xml_request.append(xml_par);		
				xml_par = $(XML("page")); xml_par.text(WS_TEST_STR); xml_request.append(xml_par);		
				xml_par = $(XML("par")); xml_par.text(widget_obj.type_of_list); xml_request.append(xml_par);
				xml_send(xml_request);
			}
		})
		.off("test_stopped").on("test_stopped", function()
		{
			pag_table_new["main_obj"].preload_dev = true;
			xml_menu_load_send(WS_TEST_STR, null, null, "main_obj", widget_obj.type_of_list);
		});
		//
		//
		footer_button_rotate();
		scrollList(this);
	}
};