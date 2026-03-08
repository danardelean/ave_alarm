pag_table_new["widget_add_other_devices"] = {
	onload: function()
	{
		page_act("#seeking-page");
		schema_act("#seeking-page", "quadrant_abcd");
		//
		//
if (DEBUG_SW) d_time_b = Date.now() | 0;
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		//save_step(WS_WIZARD_STEP_ALARM_MOD);
		//
		//
		if (!device_saved_flg && injection_not_exec)
		{
			device_saved_flg = true;
			this.show_gui_device();
		}
		else
		{
			device_saved_flg = true;
			injection_not_exec = true;
			load_devices();
		}
		//
		summary_highlighter(this);
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
						device_saved_flg = true;
						injection_not_exec = true;
						load_devices();
					}
				}
				else if (conf.children("res").text() == "ERROR")
				{
					//
				}
			}
		}
	},
	onrecv_indication: function(indi)
	{
		if (indi.attr("type") == "MENU")
		{
			if (indi.children("page").text() == WS_DEV_STR)
			{
				if (indi.children("act").text() == "ALIGNED")
				{
					var dev_type = indi.find("par id").text();
					$("#widget_add_other_devices .add_other_devices_item.device[data-id='" + dev_type + "']").find(".cfg_flg").addClass("unavailableMode2 unavailable");
					injection_not_exec = false;
				}
				else if (indi.children("act").text() == "MISALIGNED")
				{
					//
				}
			}
		}
	},
	onclose: function()
	{
		//
	},
	//
	name: "widget_add_other_devices",
	title: "{LANG_WIZARD_ADD_OTHER_DEVICES_TITLE}",
	room_list_array: [],
	filter_device_associative_array: [],
	visible_count: 0,
	first_time_load: true,
	index_flgs: [],
	//
	filter_dev: function()
	{
		var area = filter_area.length;
		var type = filter_type.length;
		var room = filter_room.length;
		//
		if (area+type+room > 0)
		{
			$("#add_other_devices_container .add_other_devices_item.device:visible").hide();
			$("#add_other_devices_container .add_other_devices_item.device")
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
				$("#add_other_devices_container .add_other_devices_item.device:hidden").show();
		}
		this.gui_detail();
	},
	gui_detail: function()
	{
		var alen = filter_area.length;
		var rlen = filter_room.length;
		var tlen = filter_type.length;
		//
		$("#footer_central_container .foot_button.filter").removeClass("filter_activated").addClass("bg_azure_gr");
		if ((alen + rlen + tlen) != 0)
		{
			if (alen > 0)
				$("#footer_central_container .foot_button.filter.filter_area").removeClass("bg_azure_gr").addClass("filter_activated");
			if (rlen > 0)
				$("#footer_central_container .foot_button.filter.filter_room").removeClass("bg_azure_gr").addClass("filter_activated");
			if (tlen > 0)
				$("#footer_central_container .foot_button.filter.filter_type").removeClass("bg_azure_gr").addClass("filter_activated");
		}
	},
	show_gui_device: function()
	{
		var widget_obj = this;
		var gui_index = 0;
		this.visible_count = 0;
		//
		init_index_flgs(this.index_flgs);
		//
		var aodContainer = $("#add_other_devices_container");
		aodContainer.find(":not(.phantom_entire)").remove();
		//
		//
		//
		for (var index in xmlAnyTbl)
		{
			var currDevice = xmlAnyTbl[index];
			//
			var ord = currDevice["ord"].text();
			var subcategory = currDevice["subcategory"].text();	
			var enabledDevSonFlg = check_son_ena_new(ord, subcategory, currDevice);
			var enabledDevFlg = currDevice["ena"].text() === "1";	
			if (enabledDevSonFlg) // in caso di modifica aggiornare corrIdxAddDev()
			{
				this.visible_count++;
				//
				var indentSonClStr = "";
				//
				var nodeNumber = null;
				if ("bus_node" in currDevice)
				{
					var nodeNumberTmp = Number(currDevice["bus_node"].text());
					if (nodeNumberTmp == NODE_DEV_NONE || (nodeNumberTmp >= NODE_DEV_TOT_LB && nodeNumberTmp <= NODE_DEV_TOT_UB))
						nodeNumber = nodeNumberTmp;
				}
				//
				var tra_type_inner = device_associative_array[subcategory];
				//
				this.filter_device_associative_array[subcategory] = 1;//serve per select distinct dei filtri
				//
				var iii = -1;
				if (subcategory in this.index_flgs)
				{// in caso di modifica aggiornare corrIdxAddDev()
					if (ord != "0")
					{
						indentSonClStr = " indentSon";
						//
						if (!this.index_flgs[subcategory])
						{
							gui_index++;
							this.index_flgs[subcategory] = gui_index;
						}
						iii = this.index_flgs[subcategory]+String.fromCharCode(ord-1+97);
						//
						tra_type_inner += wired_type_str(subcategory, currDevice);
					}
					else
					{
						iii = ++gui_index;
						this.index_flgs[subcategory] = iii;
					}
				}
				else
				{
					iii = ++gui_index;
				}
				//
				var data_id = currDevice["id"].text();
				var name = currDevice["name"].text();
				//
				var class_type = "";
				var tra_area_inner = null;	
				if 
				(
					subcategory === WS_DEV_ALARM_RFID_STR 
					|| subcategory === WS_DEV_ALARM_BUS_TAG_READER_STR
				)
				{
					tra_area_inner = currDevice["area_ins"].text()
						+ "|" + currDevice["area_dis"].text()
						+ "|" + currDevice["area_insp"].text();
				}
				else if
				(
					subcategory === WS_DEV_ALARM_REM_STR
					|| subcategory === WS_DEV_ALARM_BUS_REM_STR
				)
				{
					var kkp = currDevice["keys"].find("key:lt(3) par");
					tra_area_inner = kkp.eq(0).text()+"|"+kkp.eq(1).text()+"|"+kkp.eq(2).text();
				}
				else if (currDevice["area_alarm"].length > 0)
				{
					tra_area_inner = currDevice["area_alarm"].text();
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
				var cfg_flg = currDevice["cfg_flg"].text() === "1";
				//
				var device_db_id = currDevice["tag"].text(); //ALXXX
				//
				if (subcategory == WS_DEV_ALARM_WIRED_STR)
				{
					if (currDevice["wire_type"].text() == "1")
					{
						if (wire_in_virt_tst(Number(currDevice["ord"].text())))
							class_type = " wire_in_virt";
					}
				}
				//
				aodContainer.append
				(
				"<div class='add_other_devices_item brb device" + indentSonClStr + "' data-id='" + data_id + "' data-ena='1'>"
					+"<p class='number'>"+iii+"</p>"
					+"<p class='name" + class_type + "'>" + name + "</p>"
					+"<div class='t_r_a'>"
						+"<p class='type'>{LANG_WIZARD_ADD_DEVICE_TYPE}: <span data-type='"+subcategory+"'>"+tra_type_inner+"</span></p>"
						+ (nodeNumber != null ? "<p class='room'>{LANG_BUS_NODE_STR}: <span>" + (nodeNumber == 0 ? "{LANG_ITEM_NONE}" : nodeNumber) + "</span></p>" : "")
						+ (tra_area_inner != null ? "<p class='area'>{LANG_WIZARD_ADD_DEVICE_AREA}: <span>"+tra_area_inner+"</span></p>" : "")
					+"</div>"
					+"<div class='cfg_flg" + (cfg_flg ? "" : " unavailableMode2 unavailable") + "'></div>"
					+"<div class='eye_binder" + (enabledDevFlg ? "" : " isolated") + "' data-index='"+index+"' data-type-e='" + subcategory + "'><div class='dev_id'>"+device_db_id+"</div></div>"
				+"</div>"
				);
			}
		}
		//
if (DEBUG_SW) d_time_e = Date.now() | 0;
		//
		//
		this.filter_dev();
		//
		$(".eye_binder", aodContainer).off("click").click(function()
		{
			here_context = $("." + widget_obj.name).parent();
			any_ind = $(this).attr("data-index");
			var dev_sub = $(this).attr("data-type-e");
			dev_list_scroll_pointer = $("#add_other_devices_container").scrollTop();
			polling_selettivo($(this).parent().attr("data-id"), $(this).attr("data-type-e"), true);
			//
			switch(dev_sub)
			{
				case WS_DEV_ALARM_RFID_STR:
					pag_change("HERE", "widget_mod_device_rfid");
					break;
				case WS_DEV_ALARM_SEN_MAG_STR:
					if (xmlAnyTbl[any_ind]["ord"].text() === "0")
						if (xmlAnyTbl[any_ind]["has_children"].text() === "0")
							pag_change("HERE", "widget_mod_device_magdet_fonly");
						else
							pag_change("HERE", "widget_mod_device_magdet_f");
					else
						pag_change("HERE", "widget_mod_device_magdet_s");
					break;
				case WS_DEV_ALARM_KBD_STR:
					pag_change("HERE", "widget_mod_device_kbd");
					break;
				case WS_DEV_ALARM_REM_STR:
					pag_change("HERE", "widget_mod_device_rem");
					break;
				case WS_DEV_ALARM_SEN_PIR_STR:
					var local_model = xmlAnyTbl[any_ind]["model"].text();
					if 
					(
						local_model === "AF965R-DBNOAC"
						|| local_model === "AF965R-DB"
						|| local_model === "MCPIR2"
						|| local_model === "057136"
					)
						pag_change("HERE", "widget_mod_device_double_pir");
					else if
					(
						local_model === "7120"
						|| local_model === "7121"
						|| local_model === "AF963R-DB"
						|| local_model === "AF963R-DBAC"
						|| local_model === "AF963R-DBPET"
						|| local_model === "AF963R-DBACPET"
						|| local_model === "AF963R-DBACBAR"
						|| local_model === "AF963R-DBBAR"
						|| local_model === "AF963R-DBLR"
						|| local_model === "AF963R-DBLRAC"
						|| local_model === "7160"
						|| local_model === "MPIR"
						|| local_model === "MPIRPET"
						|| local_model === "MPIRTVCC"
					)
						pag_change("HERE", "widget_mod_device_pir");
					break;
				case WS_DEV_ALARM_SEN_PHOTOPIR_STR:
					pag_change("HERE", "widget_mod_device_photopir");
					break;
				case WS_DEV_ALARM_SEN_DT_STR:
					pag_change("HERE", "widget_mod_device_dt");
					break;
				case WS_DEV_ALARM_PSTN_STR:
					pag_change("HERE", "widget_mod_device_pstn");
					break;
				case WS_DEV_ALARM_GSM_STR:
					pag_change("HERE", "widget_mod_device_gsm");
					break;
				case WS_DEV_ALARM_SIR_STR:
					pag_change("HERE", "widget_mod_device_sir");
					break;
				case WS_DEV_ALARM_SIRI_STR:
					pag_change("HERE", "widget_mod_device_siri");
					break;
				case WS_DEV_ALARM_SEN_SMO_STR:
					pag_change("HERE", "widget_mod_device_smo");
					break;
				case WS_DEV_ALARM_SEN_MIC_STR:
					if (xmlAnyTbl[any_ind]["ord"].text() === "0")
						pag_change("HERE", "widget_mod_device_mic");
					else
						pag_change("HERE", "widget_mod_device_mic_s");
					break;
				case WS_DEV_ALARM_SEN_FLO_STR:
					pag_change("HERE", "widget_mod_device_flo");
					break;
				case WS_DEV_ALARM_RELAY_STR:
					pag_change("HERE", "widget_mod_device_relay");
					break;
				case WS_DEV_ALARM_WIRED_STR:
					var local_type = xmlAnyTbl[any_ind]["wire_type"].text();
					if (local_type == 0)
						pag_change("HERE", "widget_mod_device_wired");
					else if (local_type == 1)
						pag_change("HERE", "widget_mod_device_wired_i");
					else if (local_type == 5)
						pag_change("HERE", "widget_mod_device_wired_o");
					else if (local_type == 3)
						pag_change("HERE", "widget_mod_device_wired_k");
					break;
				case WS_DEV_ALARM_SENUNI_STR:
					if (xmlAnyTbl[any_ind]["ord"].text() === "0")
						pag_change("HERE", "widget_mod_device_senuni");
					else
						pag_change("HERE", "widget_mod_device_senuni_s");
					break;
				case WS_DEV_ALARM_TVCC_STR:
					pag_change("HERE", "widget_mod_device_tvcc");
					break;
				case WS_DEV_ALARM_REPEATER_STR:
					pag_change("HERE", "widget_mod_device_repeater");
					break;
				case WS_DEV_ALARM_SEN_3T_STR:
					pag_change("HERE", "widget_mod_device_3t");
					break;
				case WS_DEV_ALARM_SEN_DUALPIR_LR_STR:
					pag_change("HERE", "widget_mod_device_dualpir_lr");
					break;
				case WS_DEV_ALARM_BUS_STR:
					pag_change("HERE", "widget_mod_device_bus");
					break;
				case WS_DEV_ALARM_BUS_SENIR_STR:
					pag_change("HERE", "widget_mod_device_bus_ir");
					break;
				case WS_DEV_ALARM_BUS_TAG_READER_STR:
					pag_change("HERE", "widget_mod_device_bus_tag_reader");
					break;
				case WS_DEV_ALARM_BUS_CONC_RF_STR:
					pag_change("HERE", "widget_mod_device_bus_conc_rf");
					break;
//				case WS_DEV_ALARM_BUS_CONC_STR:
//					if (xmlAnyTbl[any_ind]["ord"].text() == "0")
//						pag_change("HERE", "widget_mod_device_bus_conc");
//					else
//						pag_change("HERE", "widget_mod_device_bus_conc_s");
//					break;
				case WS_DEV_ALARM_BUS_INPUT_STR:
					if (xmlAnyTbl[any_ind]["ord"].text() == "0")
						pag_change("HERE", "widget_mod_device_bus_input");
					else
						pag_change("HERE", "widget_mod_device_bus_input_s");
					break;
				case WS_DEV_ALARM_BUS_REM_STR:
					pag_change("HERE", "widget_mod_device_bus_rem");
				break;
				case WS_DEV_ALARM_BUS_CONT_STR:
					pag_change("HERE", "widget_mod_device_bus_contact");
				break;
				case WS_DEV_ALARM_BUS_SENRF_STR:
					pag_change("HERE", "widget_mod_device_bus_senrf");
				break;
//				case WS_DEV_ALARM_BUS_SENDT_STR:
//					pag_change("HERE", "widget_mod_device_bus_dt");
//				break;
//				case WS_DEV_ALARM_BUS_SMALLPIR_STR:
//					pag_change("HERE", "widget_mod_device_bus_spir");
//				break; 
//				case WS_DEV_ALARM_BUS_WINDOWPIR_STR:
//					pag_change("HERE", "widget_mod_device_bus_wpir");
//				break;
				case WS_DEV_ALARM_BUS_RELAY_STR:
					pag_change("HERE", "widget_mod_device_bus_relay");
					break;
				case WS_DEV_ALARM_BUS_TERMIS_STR:
					pag_change("HERE", "widget_mod_device_bus_termis");
					break;
				default:
					tyu("NO GUI");
					break;
			}
		});
		//
		$(".t_r_a", aodContainer).off("click").click(function()
		{
			if (!$(this).hasClass("disabled") && !$(this).hasClass("invisible") && !$(this).hasClass("unavailable"))
			{
				dev_list_scroll_pointer = $("#add_other_devices_container").scrollTop();
				//
				var dev_id = Number($(this).siblings(".eye_binder").attr("data-index"));
				if (xmlAnyTbl[dev_id]["bus_node"].length > 0)
					pag_change("#JSdialog", "widget_diag", "bus_node_list", "{LANG_BUS_NODE_STR}", "#add_other_devices_container", "" + dev_id, "widget_add_other_devices", "t_r_a");
			}
		});
		//
		//binding menu filtro device
		global_apply_diag("#footer_home2", "footer_h2_a_a", "{LANG_WIZARD_ADD_OTHER_DEVICES_TYPE}", "filter_type", null, "widget_add_other_devices"); //TYPE
		//binding menu filtro aree
		global_apply_diag("#footer_home2", "footer_h2_a_b", "{LANG_WIZARD_ADD_OTHER_DEVICES_AREA}", "filter_area", null, "widget_add_other_devices"); //AREA
		//
		//
		if (dev_list_scroll_pointer == 0 && QT)
		{
			$(scrollControllers[widget_obj.name].up).addClass("disabled");
			if (this.visible_count > 6)
				$(scrollControllers[widget_obj.name].down).removeClass("disabled");
			else
				$(scrollControllers[widget_obj.name].down).addClass("disabled");
		}
		else
		{
			aodContainer.scrollTop(dev_list_scroll_pointer);
			scrollListArrowCheck(this, "#add_other_devices_container");
		}
		//
		//
if (DEBUG_SW) d_time_f = Date.now() | 0;
		
		if (DEBUG_SW)
		{
			$("#add_other_dev_debug").append("response: "+(d_time_c-d_time_b));//_FT_ debug timer
			$("#add_other_dev_debug").append("<BR>gui preload: "+(d_time_d-d_time_c));//_FT_ debug timer
			$("#add_other_dev_debug").append("<BR>gui show: "+(d_time_e-d_time_d));//_FT_ debug timer
			$("#add_other_dev_debug").append("<BR>gui filter: "+(d_time_f-d_time_e));//_FT_ debug timer
			$("#add_other_dev_debug").append("<BR>gui load: "+(d_time_f-d_time_c));//_FT_ debug timer
			$("#add_other_dev_debug").append("<BR>total: "+(d_time_f-d_time_b));//_FT_ debug timer
		}
		else
		{
			$("#add_other_dev_debug").remove();
		}
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			pag_change("#seeking-page .quadrant_abcd", "widget_devices_areas");
			file_conf_request();
		});
		//
		$("#backTitle").html("{LANG_WIZARD_ADD_DEVICE_TITLE}");
	},
	footer_home_switch: function()
	{
		var widget_obj = this;
		footer_home_switch_init();
		//
		//
		draw_footer_button("{LANG_WIZARD_ADD_OTHER_DEVICES_TYPE}", "footer_h2_a_a", null, "footer_h2_a_a smallerfont");
		draw_footer_button("{LANG_WIZARD_ADD_OTHER_DEVICES_AREA}", "footer_h2_a_b", null, "footer_h2_a_b smallerfont");
		draw_footer_button("{LANG_WIZARD_ADD_OTHER_DEVICES_TITLE}", "footer_h2_a_c", null, "footer_h2_a_c smallerfont");
		//
		$("#footer_h2_a_c").off("click").click(function()
		{
			pag_change("#seeking-page .quadrant_abcd", "widget_devices_add");
		});
		//
		$("#footer_h2_a_a .foot_button").addClass("filter filter_type");
		$("#footer_h2_a_b .foot_button").addClass("filter filter_area");
		//
		//
		footer_button_rotate();
		scrollList(this, "#add_other_devices_container");
	}
};