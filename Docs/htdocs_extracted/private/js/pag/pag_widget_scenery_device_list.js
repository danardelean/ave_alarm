pag_table_new["widget_scenery_device_list"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		//
		dynamic_page_act(this);
		//
		//
		this.show_gui_device_scenery();
	},
	onrecv_confirmation: function(conf)
	{
		//
	},
	onrecv_indication: function(indi)
	{
		//
	},
	onclose: function()
	{
		$(".JSdialog").hide();
	},
	//
	name: "widget_scenery_device_list",
	title: "{LANG_SCENERY_CHOOSE_DEV}",
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
			$(".scenery_device_list_item.device:visible").hide();
			$(".scenery_device_list_item.device")
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
				$(".scenery_device_list_item.device:hidden").show();
		}
		this.gui_detail();
	},
	gui_detail: function()
	{
		var alen = filter_area.length;
		var rlen = filter_room.length;
		var tlen = filter_type.length;
		//
		//inizializzazioni filter e device borders eseguite dalla diag dei filtri
		//
		if (alen+rlen+tlen === 0)
		{//parte usata se i filtri non sono selezionati
			$(".scenery_device_list_item.filter .sl_selector").hide();
		}
		else
		{//parte usata dal filtro o da widget_add_other_devices con filtri selezionati
			var vis_len = $(".scenery_device_list_item.device:visible").length;
			//
			$(".scenery_device_list_item.filter .sl_selector").hide();
			if (alen > 0)
				$(".scenery_device_list_item.filter.filter_area .sl_selector").show();
			if (rlen > 0)
				$(".scenery_device_list_item.filter.filter_room .sl_selector").show();
			if (tlen > 0)
				$(".scenery_device_list_item.filter.filter_type .sl_selector").show();
		}
		scenery_device_list_scroll_begin = 0;
	},
	show_gui_device_scenery: function()
	{
		var widget_obj = this;
		//
		var gui_index = 0;
		this.visible_count = 0;
		//
		this.index_flgs[WS_DEV_ALARM_SEN_MAG_STR] = false;
		this.index_flgs[WS_DEV_ALARM_SEN_MIC_STR] = false;
		this.index_flgs[WS_DEV_ALARM_WIRED_STR] = false;
		this.index_flgs[WS_DEV_ALARM_SENUNI_STR] = false;
		//
		var dev_len = xml_any_tbl_scenery.length;
		for (var index = 0; index < dev_len; index++)
		{
			var ord = xml_any_tbl_scenery[index].children("ord").text();
			var subcategory = xml_any_tbl_scenery[index].children("subcategory").text();
			var build_item = 
				check_son_ena(ord, subcategory, xml_any_tbl_scenery[index])
				&& check_ena(ord, subcategory, xml_any_tbl_scenery[index]);
			if (build_item)
			{
				this.visible_count++;
				//
				var room = xml_any_tbl_scenery[index].children("room").text();
				//
				var data_devid = xml_any_tbl_scenery[index].children("tag").text();
				//
				this.filter_device_associative_array[subcategory] = 1;//serve per select distinct dei filtri
				//
				var tra_type_inner = device_associative_array[subcategory];
				//
				var iii = -1;
				if (subcategory in this.index_flgs)
				{
					if (ord != "0")
					{
						if (!this.index_flgs[subcategory])
						{
							gui_index++;
							this.index_flgs[subcategory] = gui_index;
						}
						iii = this.index_flgs[subcategory]+String.fromCharCode(ord-1+97);
						//
						tra_type_inner += wired_type_str(subcategory, xml_any_tbl_scenery[index]);
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
				var data_id = xml_any_tbl_scenery[index].children("id").text();
				var name = xml_any_tbl_scenery[index].children("name").text();
				//
				var tra_area_inner = null;	
				if (subcategory === WS_DEV_ALARM_RFID_STR)
				{
					tra_area_inner = xml_any_tbl_scenery[index].children("area_ins").text()
						+"|"+xml_any_tbl_scenery[index].children("area_dis").text()
						+"|"+xml_any_tbl_scenery[index].children("area_insp").text();
				}
				else if (subcategory === WS_DEV_ALARM_REM_STR)
				{
					var kkp = xml_any_tbl_scenery[index].find("keys key:lt(3) par");
					tra_area_inner = kkp.eq(0).text()+"|"+kkp.eq(1).text()+"|"+kkp.eq(2).text();
				}
				else if (xml_any_tbl_scenery[index].children("area_alarm").length > 0)
				{
					tra_area_inner = xml_any_tbl_scenery[index].children("area_alarm").text();
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
				//var cfg_flg = xml_any_tbl_scenery[index].children("cfg_flg").text() === "1";
				//
				$(".scenery_device_list_container").append
				(
				"<div class='scenery_device_list_item device' data-idx='"+index+"' data-id='"+data_id+"' data-ena='1' data-devid='"+data_devid+"'>"
					+"<p class='number'>"+iii+"</p>"
					+"<p class='name'>"+name+"</p>"
					+"<div class='t_r_a'>"
						+"<p class='type'>{LANG_WIZARD_ADD_DEVICE_TYPE}: <span data-type='"+subcategory+"'>"+tra_type_inner+"</span></p>"
						+ (!SIL && !AVE && room != "" ? "<p class='room'>{LANG_WIZARD_ADD_DEVICE_ROOM}: <span data-id='"+room+"'>"+this.room_list_array[room-1]+"</span></p>" : "")
						+ (tra_area_inner != null ? "<p class='area'>{LANG_WIZARD_ADD_DEVICE_AREA}: <span>"+tra_area_inner+"</span></p>" : "")
					+"</div>"
				+"</div>"
				);
			}
		}
if (DEBUG_SW) d_time_e = Date.now() | 0;
		//
		//this.filter_dev();
		//
		$(".widget_scenery_device_list .scenery_device_list_item.device").click(function()
		{
			//scenery_device_list_scroll_begin = Math.round($(".scenery_device_list_container").scrollTop()/$(".scenery_device_list_container .s_shift").outerHeight(true));
			//
			any_ind = $(this).attr("data-index");
			var dev_sub = $(this).find(".t_r_a .type span").attr("data-type");
			var data_devid = $(this).attr("data-devid");
			var data_name = $(this).children(".name").text();
			var xml_any_tbl_scenery_idx = $(this).attr("data-idx");
			var data_id = $(this).attr("data-id");
			//
			if (dev_sub == WS_DEV_ALARM_CEN_STR)
			{
				pag_change(".JSdialog2", "widget_zone_select_vert", null, null, null, data_devid, data_name, null, null, "scene");
			}
			else if (dev_sub == WS_DEV_ALARM_THERMOSTAT_STR)
			{
				pag_change(".JSdialog2", "widget_thermostat_device", "scene", data_devid, data_name, dev_sub, null, null, xml_any_tbl_scenery_idx);
			}
			else if (dev_sub == WS_DEV_ALARM_IOT_STR)
			{
				if ("widget_add_scenery" in pag_table_new)
				{
					pag_table_new["widget_add_scenery"].cmds.push
					(
						[
							data_devid
							, xml_file_configuration.find("Subcategory[id='" + dev_sub + "'] Commands Command").attr("id")
							, 0
							, xml_any_tbl_scenery[xml_any_tbl_scenery_idx].children("name").text()
							, xml_file_configuration.find("Subcategory[id='" + dev_sub + "'] Commands Command").attr("desc")
							, dev_sub
						]
					);
					pag_table_new["widget_add_scenery"].add_item_cmds_list();
					pag_table_new["widget_add_scenery"].header_home_switch();
					pag_table_new["widget_add_scenery"].footer_home_switch();
					pag_clear(".JSdialog");
				}
				else
				{
					tyu("Errore scenario iot");
				}
			}
			else
			{
				pag_change(".JSdialog2", "widget_cmd_device_cen", "scene", data_devid, data_name, dev_sub, null, null, xml_any_tbl_scenery_idx);
			}
		});
		//binding menu filtro room
		//global_apply_diag(".widget_scenery_device_list", "filter_room", "{LANG_WIZARD_ADD_OTHER_DEVICES_ROOM}", null, null, "widget_scenery_device_list", ".JSdialog2");
		//binding menu filtro device
		//global_apply_diag(".widget_scenery_device_list", "filter_type", "{LANG_WIZARD_ADD_OTHER_DEVICES_TYPE}", null, null, "widget_scenery_device_list", ".JSdialog2");
		//binding menu filtro aree
		//global_apply_diag(".widget_scenery_device_list", "filter_area", "{LANG_WIZARD_ADD_OTHER_DEVICES_AREA}", null, null, "widget_scenery_device_list", ".JSdialog2");
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			if ("widget_add_scenery" in pag_table_new)
			{
				pag_table_new["widget_add_scenery"].header_home_switch();
				pag_table_new["widget_add_scenery"].footer_home_switch();
				pag_table_new["widget_add_scenery"].func_item_cmds_list();
			}
			pag_clear(".JSdialog");
		});
		//
		$("#backTitle").html("{LANG_SCENERY}");
	},
	footer_home_switch: function()
	{
		var widget_obj = this;
		footer_home_switch_init();
		//
		//
		footer_button_rotate();
		scrollList(this);
	}
};