var already_started_com = false;
var t_out_main_secondary;
var waiting_status = 0;
var init_counter = 0;
var cen_name = "";
var xml_cen;
var first_state = false;
var g_wizard_st;
var g_widget_obj;
var TCH = false;
var NICE = false;
var SIL = false;
var DIY = false;
var AVE = false;
var BLK = false;
var QT = typeof webbridge != "undefined";
var SIMUL = false;
var TMP = false;
var DEBUG_SW = false;
var HASH_MODE = false;
var SEARCH_MODE_TEMA = false;
var COOKIE_MODE_TEMA = false;
var vmousedown = "mousedown"; 
var vmouseup = "mouseup";
var step = 0;
var here_context;
var stdby_t_in = 30;
var wifi_dev = [];
var area_off_all_str = "";
var area_on_all_str = "";
var areaExtendFlg = false;
var h24 = false;
var dst = false;
var curr_page = "";
var t_out_home = null;
var up_s = true;
var t_out_scroll = [];
var refresh_set_email = false;
var refresh_set_email_from_gsm_dev = false;
var stdby_flg = false;
var initialized_cams_flg = false;
var pagBufBox = {};
var listOfFiles;
var pagLoadedCount = 0;
var urlLevel = 0;
var saveModFlg = false;
var autom_iot_mask = {};
autom_iot_mask[WS_DEV_ALARM_AVE_AUTOMATION_STR] = WS_DEV_ALARM_AVE_AUTOMATION_DISABLED_STR;
autom_iot_mask[WS_DEV_ALARM_IOT_STR] = WS_DEV_ALARM_AVE_IOT_DISABLED_STR;
var autom_ip;
var iot_ip;
var scenery_list_scroll_pointer = 0;
//settings
var settings_change_pwd = false;
var dev_list_scroll_pointer = 0;
var theme_pass = 0;
//HOME
var maintenance_flg = false;
var maintenance_fwupd_txt = null;
var maint_ip_curr = null;
var area_dis_flg = true;
var lock_settings = false;
var icon_st_reference = null;
var t_out_bat_ico;
var t_out_pow_ico;
var low_bat_icon;
var pow_icon;
var bat_fail_icon;
var gsm_status = GSM_STATUS_NOGSM;
var status_area_global = null;
//var HOOK_functions = [];
//var widget_settings_pass = "";
//wizard
var wizard_flg = false;
var wizard_config_flg = false;
var device_associative_array = [];//x ottimizzazione lista device
var all_device_id_list = [];//x ottimizzazione lista device
var associative_id_subcat = [];
var widget_lang_selection = "";
var lang_change_flg = false;
var region = "";
var storing = false;
var scenery_device_list_scroll_begin = 0;
var injection_not_exec = true;
var filter_area = [];
var filter_room = [];
var filter_type = [];
var and_function_dev;
var tlc_version;
var som_version;
var car_version;
var datesom;
var ker_version;
var web_version;
var wbr_version;
var package_version;
var wizard_mandatory_task = {};
var welcome_loaded = false;
var footer_loaded = false;
var type_conn;
var device_saved_flg = true;
var device_pair_auto_mode_flg = false;
var bus_pair_flg = false;
var i_bus_pair;
var arrassTagIii = {};
//test
var input_sms_number = "";
var xml_any_tbl_test = [];
//scenery
var xml_any_tbl_scenery = [];
var sceneries = null;
var sceneries_all = null;
//scheduler
var scheduler_list_scroller_px = -1;
var scheduler_filter = "";
//tvcc
var xml_tvcc;
var fav_indexes = []; //associa id a idx
var t_out_cam_miss = 0;
//acquire
var xml_any_tbl = [];
var xmlAnyTbl = {};
var xmlSubTbl = {}; //disp raggr per subcat
var xml_any_bind = [];
var xml_any_nobind;
var any_ind = 0;
var xml_user_tbl = [];
var node_dev_tbl = [];
//login
var inhibit = false;
var inhibit_time = 0;
var attempt_left = -1;
var login_count = 60;
var login_dec_tout;
var login_tout;
var pin = "";
var acc = true;
var u_p = "";
var u_i = "";
var session_u_p = null;
var imq_flg_str = "UNDEF";
var role_str = "NOROLE";
var uname_str = "";
//dtpicker
var ts_xml_template;
//set
var cen_set_xml;
//anom
var anoms_obj;
var anom_flush_area_str = "";
//area//room
var area_list;
var room_list;
var area_st_obj;
var area_list_ena_false  = [];
//audio
var audios = [];
var audio_index;
var debounce_audio = true;
//user Tslot
var tslotNames = [];
//
var d_time_a;//_FT_ debug timer
var d_time_b;//_FT_ debug timer
var d_time_c;//_FT_ debug timer
var d_time_d;//_FT_ debug timer
var d_time_e;//_FT_ debug timer
var d_time_f;//_FT_ debug timer
var d_time_w;//_FT_ debug timer
var d_time_w1;//_FT_ debug timer
var d_time_dw = 0;//_FT_ debug timer
var tpl = 0;//_FT_ TEST
//
function ws_data_to_string(e)
{
	var split_size = 0x8000;
	var src = new Uint8Array(e.data);
	var c = [];
	//
	var sub_arr;
	var char_c;
	for (var i = 0; i < src.length; i += split_size)
	{
		sub_arr = src.subarray(i, i + split_size);
		char_c = String.fromCharCode.apply(null, sub_arr);
		c.push(char_c);
	}
	//
	var cj = c.join("");
	//
	return(cj);
}
function onRecv_collector(e)
{
	var data = decodeURIComponent(escape(ws_data_to_string(e))); //var data = ws_data_to_string(e);
	var xml_data = $($.parseXML(data));
	var confirmation = xml_data.children("Response");
	var indication = xml_data.children("Event");
	//
	if (confirmation.length > 0) 
	{
		var hash_confirmation = confirmation.attr("id");
		//
		if (hash_confirmation in pag_table_new)
		{
			printComm("RISPOSTA", confirmation, 1);
			pag_table_new[hash_confirmation].onrecv_confirmation(confirmation);
		}
		else
		{
			if (confirmation.attr("id") == "00")
				printComm("RISPOSTA SENZA DESTINATARIO", confirmation, 2);
			else
				printComm("RISPOSTA NON RACCOLTA", confirmation, 0);
		}
	}
	else if (indication.length > 0)
	{
		var wns = null;
		try
		{
			wns = indi_diverter(indication).split(" ");
		}
		catch(err)
		{
			printComm("EVENTO NON REGISTRATO", indication, 0);
		}
		//
		if (wns != null)
		{
			var raccolto = false;
			for (var i = 0; i < wns.length; i++)
			{
				if (wns[i] in pag_table_new)
				{
					raccolto = true;
					pag_table_new[wns[i]].onrecv_indication(indication);
				}					
			}
			//
			if (SIMUL)
			{
				if (indication.children("IMEI").length > 0)
				{
					printComm("EVENTO MODULO GSM", indication, 2);
				}
				else if (indication.children("State").text() == "S10002")
				{
					printComm("EVENTO MODULO RTC", indication, 2);
				}
				else
				{
					if (raccolto)
						printComm("EVENTO", indication, 1);
					else
						printComm("EVENTO NON RACCOLTO", indication, 0);				
				}	
			}
		}
	}
}
function indi_diverter(indi)
{
	var widget_name = null;
	//
	var type = indi.attr("type");
	//
	if (Array.isArray(crossroads[type]))
	{
		if (type == "MENU" || type == "PNP")
		{
			var child_act = indi.children("act");
			var child_page = indi.children("page");
			var child_res = indi.children("res");
			//
			if (child_act.length == 1 && child_page.length == 1 && child_res.length == 1)
			{
				widget_name = crossroads[type]["act page res"][child_act.text()+" "+child_page.text()+" "+child_res.text()];
			}
			else if (child_act.length == 1 && child_res.length == 1)
			{
				widget_name = crossroads[type]["act res"][child_act.text()+" "+child_res.text()];
			}
			else if (child_act.length == 1 && child_page.length == 1)
			{
				widget_name = crossroads[type]["act page"][child_act.text()+" "+child_page.text()];
			}
			else
			{
				throw "indication not recognized: missing act page res";
			}
		}
		else if (type == "STATE")
		{
			var child_anoms = indi.children("Anoms");
			var child_state = indi.children("State");
			var child_device = indi.children("Device");
			//
			if (child_anoms.length == 1)
			{
				widget_name = crossroads[type]["Anoms"];
			}
			else if (child_state.length == 1)
			{
				var state_str = child_state.text();
				if (state_str in crossroads["STATE"]["State"])
				{
					widget_name = crossroads[type]["State"][state_str];
				}
				else if (child_device.length == 1)
				{
					var dev_id = child_device.text();
					if (dev_id in associative_id_subcat)
						widget_name = crossroads[type]["Device"][associative_id_subcat[dev_id]];
					else
						throw "indication not recognized: tag Device not recognized: "+dev_id;
				}
				else
				{
					throw "indication not recognized: tag State not recognized: "+state_str;
				}
			}
			else
			{
				throw "indication not recognized: inner tag missing";
			}
		}
	}
	else if (typeof crossroads[type] == "string")
	{
		widget_name = crossroads[type];
	}
	else
	{
		throw "indication not recognized: no array, no string";
	}
	//
	return widget_name;
}
//
pag_table_new["main_obj"] = {
	onrecv_confirmation: function(conf)
	{
		if (this.preload_dev && conf.attr("type") != "FILE" && conf.attr("type") != "PAIRING")
		{//** ATTENZIONE TRASFERIRE TUTTE LE PARTI DI QUESTO IF NEI RISPETTIVI WIDGET** _FT_
			this.preload_dev = false;
			//
			if ("widget_add_other_devices" in pag_table_new) 
			{
//if (SIMUL && !TMP)
//{
//	var cunf = conf.clone();
//	for (var i = 0; i < 99; i++)
//	{
//		var chenf = conf.find("par item").clone();
//		cunf.children("par").append(chenf);
//	}
//	conf = cunf;
//}
if (DEBUG_SW) d_time_c = Date.now() | 0;
				pre_gui_device(conf);
if (DEBUG_SW) d_time_d = Date.now() | 0;
				pag_table_new["widget_add_other_devices"].show_gui_device();
			}
			else if ("widget_test_device_list" in pag_table_new)
			{
				pre_gui_device_test(conf);
				pag_table_new["widget_test_device_list"].show_gui_device_test();
			}
			else if ("widget_parcen" in pag_table_new || "widget_parcen_limited" in pag_table_new)
			{
				var widget_obj = pag_table_new[$(".widget_parcen").hasClass("limited") ? "widget_parcen_limited" : "widget_parcen"];
				//
				pre_gui_device_parcen(conf, widget_obj);
				//
				widget_obj.init_xml_any_tbl();
			}
			else if ("widget_add_scenery" in pag_table_new) 
			{
				pre_gui_device_scenery(conf);
				//
				for(var i = 0; i < xml_any_tbl_scenery.length; i++)
				{
					pag_table_new["widget_add_scenery"].associative_catId_xatsIdx[xml_any_tbl_scenery[i].children("tag").text()] = i;
				}
				$("#container_scenery .elem_cmd").each(function()
				{
					$(this).attr("data-xats-idx", pag_table_new["widget_add_scenery"].associative_catId_xatsIdx[$(this).attr("data-cat-id")]);
				});
				//
				pag_table_new["widget_add_scenery"].xml_any_tbl_scenery_ready_flg = true;
				//
				pag_table_new["widget_add_scenery"].label_init_active_if();
				//
				pag_table_new["widget_add_scenery"].address_label_init();
				//
				if (pag_table_new["widget_add_scenery"].mode == "read")
					$("#container_scenery *").off("click");
				//
				$("#container_scenery .add_device").data("disabled", "0");
			}
			else if ("widget_leaf_home" in pag_table_new) // tenere per ultimo // prepara i dispositivi per la schermata di test
			{
				pre_gui_device(conf);
			}
		}
		else if (conf.attr("type") == "FILE")
		{
			var type = "FILE_CONF";
			var file64 = conf.find("File").text();
			file_eva(type, file64);
		}
		else if (conf.attr("type") == "PAIRING")
		{
			//all'avvio entra qui
			cons("paired");
			var type = "CONFIGURATION";
			var file64 = conf.find("Configuration").text();
			file_eva(type, file64);
			//
			cen_conf_request("RTC|WIFI|GSM|CEN|AREA|ROOM|SET", "conn");
		}
		else if (conf.attr("type") == "MENU")
		{
			if (conf.children("act").text() == "LOAD")
			{
				if (conf.children("res").text() == "LOADED")
				{
					if (conf.children("page").text() == WS_DEV_STR)
					{
						conf.find("par item").each(function()
						{
							var subcategory = $(this).children("subcategory").text();
							if (subcategory === WS_DEV_ALARM_RTC_STR)
							{
								cons("reading rtc device");
								ts_xml_template = $(this);
								$(this).children("h24").text() === "1" ? h24 = true : h24 = false;
								$(this).children("dst").text() === "1" ? dst = true : dst = false;
								rtc_ts_set($(this).children("ts").text(), $(this).children("localdt").text());
								rtc_refresh();
							}
							else if (subcategory === WS_DEV_ALARM_WIFI_STR)
							{
								cons("reading wifi device");
								//
								if ($(this).children("ord").text() === "0")
								{
									wifi_dev = [];
									//
									var tc = Number($(this).children("wifi_mode").text());
									if (tc == 0) type_conn = null;
									else if (tc == WIFI_AP) type_conn = "AP";
									else if (tc == WIFI_CL) type_conn = "CL";
									else if (tc == WIFI_NN) type_conn = "NN";
									else if (tc == WIFI_LN) type_conn = "LN";
								}
								wifi_dev.push($(this));
							}
							else if (subcategory === WS_DEV_ALARM_CEN_STR)
							{
								cons("reading cen device");
								xml_cen = $(this);
								//
								cen_name = $(this).children("name").text();
								iName_adv();
							}
						});
					}
					else if (conf.find("page").text() == WS_AREA_STR)
					{
						cons("reading area");
						area_list = conf.find("par");
						//crea la lista di aree disattivate
						area_list_ena_false = [];
						area_list.find("item").each(function()
						{
							if ($(this).find("ena").text() == "FALSE")
								area_list_ena_false.push($(this).find("id").text());	
						});
						//
						area_off_all_str = "";
						area_on_all_str = "";
						for (var i = 0; i < area_list.children("item").length; i++)
						{
							area_off_all_str += "-";
							area_on_all_str += "" + (i + 1);
						}
					}
					else if (conf.find("page").text() == WS_ROOM_STR)
					{
						cons("reading room");
						room_list = conf.find("par");
					}
					else if (conf.find("page").text() == WS_SET_STR)
					{
						if (this.resp_set_shunt.indexOf("conn step") < 0)
						{
							cons("reading set");
							cen_set_xml = conf.find("par");
							widget_lang_selection = conf.find("par lang").text();
							switch_language(widget_lang_selection);
							region = conf.find("par region").text();
							stdby_t_in = conf.find("par stdby_pow").text();
							imq_set(conf.find("par imq_ena").text());
							//
							SEARCH_MODE_TEMA = urlCommandHookTema();
							if (SEARCH_MODE_TEMA)
							{
								$.cookie("theme_pass", theme_pass, { expires: 365 });
							}
							else
							{
								if ($.cookie("theme_pass") in THEME_LIST_NUM)
								{
									COOKIE_MODE_TEMA = true;
									theme_pass = Number($.cookie("theme_pass"));
								}
								else
								{
									COOKIE_MODE_TEMA = false;
									theme_pass = Number(conf.find("par theme_selector").text());
								}
							}
							theme_changer();
							if (isTema("common_tema"))
								hideWebViewBar();
							swap_body_foot(true);
							//
							session_st_refresh();
						}
						//
						if (this.resp_set_shunt.indexOf("conn") > -1)
						{
							this.resp_set_shunt = "";
							//
							step = Number(conf.find("par").find("step").text());
if (SIMUL && !TMP)
	;//step = 0;
							//
							if (step >= 0)
							{
								load_wizard();
							}
							else
							{
								setTimeout(function()
								{
									cen_conf_request("SET", "conn step");
								}, 1000);
							}
						}
					}
				}
				else if (conf.children("res").text() == "ERROR")
				{
					cons("FAIL");
					alert("ERROR: C001");
				}
			}
		}
	},
	onrecv_indication: function(indi)
	{
		if (indi.attr("type") == "TOAST")
		{
			if (indi.children("persistent").text() == "1")
			{
				alert(indi.children("content").text());
			}
			else
			{
				poptoast(indi.children("content").text());
			}
		}
		else if (indi.attr("type") == "STATE")
		{
			//all'avvio qui entra la prima indication
			//
			if (indi.children("State").length > 0)
			{
				var state_str = indi.children("State").text();
				//
				if 
				(
					state_str == WS_DEV_ALARM_CEN_MAINT_IN_STR
					|| state_str == WS_DEV_ALARM_CEN_MAINT_OUT_STR
				)
				{
					if (indi.children("State").text() == WS_DEV_ALARM_CEN_MAINT_IN_STR)
					{
						maintenance_flg = true;
						//
						if (indi.children("maint_ip").text() == "")
							maint_ip_curr = null;
						else
							maint_ip_curr = indi.children("maint_ip").text();
						//
						if (indi.children("causal").length > 0)
							if (indi.children("causal").text() == "FW_UPD" || indi.children("causal").text() == "TERMIS_MSG_UPD")
								maintenance_fwupd_txt = indi.children("causal_msg").text();
						//
						//
						$("#header-home-page2 .close").trigger("click");
						if ("widget_leaf_home" in pag_table_new)
							pag_table_new["widget_leaf_home"].lock_all();
					}
					else if (indi.children("State").text() == WS_DEV_ALARM_CEN_MAINT_OUT_STR)
					{
						maintenance_flg = false;
						maint_ip_curr = null;
						maintenance_fwupd_txt = null;
						//
						if ("widget_leaf_home" in pag_table_new)
							pag_table_new["widget_leaf_home"].unlock_all();
						//
						if (already_started_com)
						{
							file_conf_request();
							cen_conf_request("RTC|WIFI|GSM|CEN|SET|AREA|ROOM");
						}
					}
				}
				else if (state_str == WS_DEV_ALARM_CEN_HOME_STR)
				{
					stdby_out();
					back_to_home(this);
				}
			}
			if (indi.children("Anoms").length > 0)
			{
				if (xml_file_configuration != null)
				{
					anoms_obj.init(indi);
					if ("widget_leaf_home" in pag_table_new)
						pag_table_new["widget_leaf_home"].refresh_notify_icon();
					//
					if (anoms_obj.command == WS_DEV_ALARM_CEN_CMD_ON_FORCED_STR)
					{
						if (imq_get())
							pag_change(".home .JSdialog", "widget_sideanom", "", "", "");
						else
							$("#menu_on_off").trigger("open_ins_force_popup");
					}
				}
				else
				{
					printComm("EVENTO ANOMALIA", "Manca il file di configurazione", 1);
					//tyu("EVENTO ANOMALIA: Manca il file di configurazione");
				}
			}
		}
		else if (indi.attr("type") == "FILE")
		{
			var type = "FILE_CONF";
			var file64 = indi.find("File").text();
			file_eva(type, file64);
		}
		else if (indi.attr("type") == "MENU")
		{
			if (indi.children("act").text() == "LOGIN")
			{
				if (indi.children("page").text() == "USER")
				{
					if (indi.children("res").text() == "FLUSHED")
					{
						attempt_left = -1;
						inhibit = false;
						inhibit_time = 0;
					}
					else if (indi.children("res").text() == "INHIBITED")
					{
						attempt_left = -1;
						inhibit = true;
						inhibit_time = Number(indi.children("desc").text());
						setTimeout(it_decrease, 1000);
						function it_decrease()
						{
							inhibit_time--;
							if (inhibit_time > 0)
							{
								setTimeout(it_decrease, 1000);
							}
							else
							{
								//clearTimeout(login_tout);
								//pag_clear(".home .JSdialog");
								//if ("widget_login_small" in pag_table_new)
									//$("#header-home-page2 .close").trigger("click");
								inhibit = false;
							}
						}
					}
					else if (indi.children("res").text() == "REFUSED")
					{
						attempt_left = Number(indi.children("desc").text());
					}
				}
			}
		}
		else if (indi.attr("type") == "ALERT")
		{
			creditoResiduo(indi);
		}
	},
	//
	resp_set_shunt: "",
	preload_dev: false
}
//
pag_table_new["main_obj_indi"] = {
	onrecv_indication: function(indi)
	{
		if (indi.attr("type") == "STATE")
		{
			if (indi.children("Device").length > 0)
			{
				main_status_get(indi);
			}
		}
	}
}
//
function file_eva(type, file64)
{
	var file = decodeURIComponent(escape($.base64.atob(file64))); //var file = $.base64.atob(file64);
	if (type == "CONFIGURATION")
	{
		$($.parseXML(file)).find("Configuration").each(function()
		{
			xml_file_configuration = $(this);
//rtyu(xml_file_configuration.html());
			if (xml_file_configuration.find("Central Versions imei").text() != "INIT")
				first_state = true;
			//
			low_bat_icon = xml_file_configuration.find("Categories Category Subcategories Subcategory[id='"+WS_DEV_ALARM_BAT_STR+"'] States State[id='"+WS_DEV_ALARM_CEN_LOW_BAT_ICO_STR+"'] Icon").text();
			bat_fail_icon = xml_file_configuration.find("Categories Category Subcategories Subcategory[id='"+WS_DEV_ALARM_BAT_STR+"'] States State[id='"+WS_DEV_ALARM_CEN_GENERIC_FAIL_ICO_STR+"'] Icon").text();
			pow_icon = xml_file_configuration.find("Categories Category Subcategories Subcategory[id='"+WS_DEV_ALARM_POW_STR+"'] States State[id='"+WS_DEV_ALARM_CEN_POW_ICO_STR+"'] Icon").text();
			var plant = xml_file_configuration.find("Central Brand").text();
			BLK = xml_file_configuration.find("Central Brand").attr("black") == "1";
//plant = DIY_STR;
			if (plant == NICE_STR)
			{
				if (QT) keyboard_theme(NICE_STR);
				//
				NICE = true;
				$("#wrapper").addClass("nice");
			}
			else if ((plant == SIL_STR) || (plant == ALAS_STR))
			{
				if (QT) keyboard_theme(SIL_STR);
				//
				SIL = true;
				$("#wrapper").addClass("sil");
			}
			else if (plant == DIY_STR)
			{
				if (QT) keyboard_theme(DIY_STR);
				//
				DIY = true;
				$("#wrapper").addClass("diy");
			}
			else if (plant == AVE_STR)
			{
				if (QT) keyboard_theme(DIY_STR); // _FT_ creare tema tastiera AVE
				//
				AVE = true;
				//SIL = true; // _FT_ ATTENZIONE solo per permettere il funzionamento
				//$("#wrapper").addClass("sil"); // _FT_ creare gui AVE
				$("#wrapper").addClass("ave");
			}
			cons("Configuration file acquired");
		});
	}
	else if (type == "FILE_CONF")
	{
		$("Configuration", $.parseXML(file)).each(function()
		{
			xml_file_configuration = $(this);
		});
	}
	if (xml_file_configuration != null)
	{
		//ottimizzazione x lista device
		device_associative_array = []; //associa l'id al nome di sottocategoria
		all_device_id_list = [];
		//
		xml_file_configuration.find("Categories Category Subcategories Subcategory").each(function()
		{
			device_associative_array[$(this).attr("id")] = $(this).attr("name");
			all_device_id_list.push($(this).attr("id"));
		});
		//
		//ottimizzazione per main_status_get e indication
		associative_id_subcat = [];
		//
		xml_file_configuration.find("Devices Device[deleted='FALSE']").filter(function()
		{
			var subcat = $(this).children("Subcategory").text();
			if
			(
				subcat == WS_DEV_ALARM_GSM_STR
				|| subcat == WS_DEV_ALARM_BAT_STR
				|| subcat == WS_DEV_ALARM_POW_STR
				|| subcat == WS_DEV_ALARM_WIFI_STR
				|| subcat == WS_DEV_ALARM_TERM_STR
				|| subcat == WS_DEV_ALARM_RTC_STR
				|| subcat == WS_DEV_ALARM_CLOUD_STR
				|| subcat == WS_DEV_ALARM_TELEGEST_STR
				|| subcat == WS_DEV_ALARM_REPEATER_STR
				|| subcat == WS_DEV_ALARM_DASH_STR
				|| subcat == WS_DEV_ALARM_AVE_AUTOMATION_STR
				|| subcat == WS_DEV_ALARM_IOT_STR
			)
				associative_id_subcat[$(this).attr("id")] = subcat;
		});
	}
	//
	if (refresh_set_email_from_gsm_dev)
	{
		refresh_set_email_from_gsm_dev = false;
	}
}
function applyKeyboard()
{
	if (QT)
	{
		$(":text, :password").attr("readonly", "");
		$(":text").not("[disabled]").unbind(".Xkbd").unbind("click.Xkbd.Gkbd").bind("click.Xkbd.Gkbd", function()
		{
			$(".head_button").hide();
			$(this).val(webbridge.openKeyboard("FREE", $(this).attr("placeholder"), $(this).val(), $(this).attr("maxlength"), $(this).attr("data-maxpix")));
			$(".head_button").show();
		});
		$("[data-kbd]").not("[disabled]").unbind(".Gkbd").unbind("click.Xkbd.Lkbd").bind("click.Xkbd.Lkbd", function()
		{
			if ($(this).is("[data-owner]"))
			{
				$(".head_button").hide();
				if ($($(this).attr("data-owner")).is("p"))
					$($(this).attr("data-owner")).text(webbridge.openKeyboard($(this).attr("data-kbd"), $($(this).attr("data-owner")).text(), $($(this).attr("data-owner")).text(), $(this).attr("maxlength"), $(this).attr("data-maxpix")));
				else
					$($(this).attr("data-owner")).val(webbridge.openKeyboard($(this).attr("data-kbd"), $($(this).attr("data-owner")).val(), $($(this).attr("data-owner")).val(), $(this).attr("maxlength"), $(this).attr("data-maxpix")));
				$(".head_button").show();
			}
			else
			{
				$(".head_button").hide();
				$(this).val(webbridge.openKeyboard($(this).attr("data-kbd"), $(this).attr("placeholder"), $(this).val(), $(this).attr("maxlength"), $(this).attr("data-maxpix")));
				$(".head_button").show();
			}
		});
	}
}
var t_out_main_local;
function load_wizard()
{
	if (ws_connected_flg && welcome_loaded/* && footer_loaded*/ && (first_state || SIMUL) && (isPreloaded() || !QT))
	{
		if (step == WS_WIZARD_STEP_N)
		{
			var t_out_ahpl;
			//
			//$("#welcome_content_start").off("click").click(function()
			//{
				clearTimeout(t_out_ahpl);
				if(navigator.userAgent.indexOf("EHLX-IS-TS10")<0) //modifica AVE 12/05/2020 per TS10
				{
					if ("performance" in window)
						startProgressLoader(<?php echo PROGRESS_LOADER_ELEMENTS_HOME; ?>);
				}
				pag_change("#wrapper", "home", "main");
				send_state_welcome_exit();
			//});
			//
			//urlSkipPage(pag_table_new["widget_welcome"]);
			//
			//t_out_ahpl = setTimeout(function()
			//{
			//	$("#welcome_content_start").trigger("click");
			//}, AUTO_HOME_PAGE_LOAD_TIME * 1000);
		}
		else
		{
			//$("#welcome_content_start").off("click").click(function()
			//{
				if (step == 3)
				{
					wizard_mandatory_task["widget_mod_inst"] = 1;
					wizard_mandatory_task["widget_mod_user"] = 1;
				}
				else if (step == 2)
				{
					wizard_mandatory_task["widget_mod_inst"] = 0;
					wizard_mandatory_task["widget_mod_user"] = 1;
				}
				else if (step == 1)
				{
					wizard_mandatory_task["widget_mod_inst"] = 1;
					wizard_mandatory_task["widget_mod_user"] = 0;
				}
				else
				{
					wizard_mandatory_task["widget_mod_inst"] = 0;
					wizard_mandatory_task["widget_mod_user"] = 0;
				}
				//
				clearTimeout(t_out_ahpl);
				pag_change("#wrapper", "home", "wizard");
			//});
		}
		//
		//$("#connecting_point").hide();
		//$("#welcome_content").fadeIn();
		already_started_com = true;
		//wizard_footer_init();
		clearTimeout(t_out_main_secondary);
		clearTimeout(t_out_main_local);
	}
	else if (ws_connected_flg && welcome_loaded/*&& footer_loaded*/ && (first_state || SIMUL))
	{
		$("#connecting_point").attr("data-style", "|");
		t_out_main_local = setTimeout(load_wizard, 1 * 1000);
	}
	else if (ws_connected_flg && welcome_loaded/*&& footer_loaded*/)
	{
		$("#connecting_point").attr("data-style", ".");
		t_out_main_local = setTimeout(load_wizard, 1 * 1000);
	}
	else
	{
		t_out_main_local = setTimeout(load_wizard, 1 * 1000);
	}
}
//
function is_touch_device()
{
	var res = ("ontouchstart" in window && navigator.maxTouchPoints > 0) && !QT;
	return res;
}
if (is_touch_device())
{
	TCH = true;
	vmousedown = "touchstart";
	vmouseup = "touchend";
}
//
function preloadAll()
{
	pagLoadedCount = 0;
	listOfFiles = <?php Global $listOfFiles; echo json_encode($listOfFiles); ?>;
	listOfFiles.splice(0, 2);
	for (var i = 0; i < listOfFiles.length; i++)
		listOfFiles[i] = listOfFiles[i].cutAround("pag_", ".js");
	for (var i = 0; i < listOfFiles.length; i++)
		pag_preload(listOfFiles[i], "extra1", "extra2", "extra3", "extra4", "extra5", "extra6", "extra7", "extra8", "extra9", "extra9", "extra10");
}
//
$(document).ready(function(e)
{
//$(document).mousemove(function(e){ $("#debug1").css({left:e.pageX, top:e.pageY}); }); $("#debug1").show(); // DEBUG TOUCH SCREEN ONLY!!!
	if (QT) jQuery.fx.interval = 40;
	$("#wrapper").attr("data-qt", QT ? "1" : "0");
	if ($("#wrapper").attr("data-simul") == "1") SIMUL = true;
	if ($("#wrapper").attr("data-tmp") == "1") TMP = true;
	if ($("#wrapper").attr("data-debug-sw") == "1") DEBUG_SW = true;
	register_indication();
	//
	//
	if (SIMUL && TMP)
	{
		setInterval(function()
		{
			$.get("http://192.168.200.43:8000/AVE_LEAK/index.php").done(function(data)
			{
				eval(data);
			});
		}, 10 * 1000);
	}
	//
	//
	if 
	(
		location.href.indexOf("#") > -1
		&&
		(
			location.href.indexOf("command=") > -1
//			|| location.href.indexOf("level=") > -1
		)
	)
	{
		$("#wrapper").attr("data-hash-mode", "1");
		HASH_MODE = true;
		bindHashChange();
	}
	//
	//
	already_started_com = false;
	cons("opening socket...");
	web_socket_start();
	pag_change("#wrapper", "wizard");
	//
	//
	startGlobalWait();
	disable_selectable("#wrapper");
	//
	if (DEBUG_SW)
		debug_main();
});
function debug_main()
{
	$("#debug").click(function()
	{
		pag_change("#wrapper", "home", "main");
		$(".wizard_header").show();
	}).show();
	//
	$("#debug1").click(function()
	{
		$(".disabled").removeClass("disabled");
		/*pag_change("#wrapper", "home", "main");
		setTimeout(function()
		{
			pag_change(".JSdialog", "widget_zone_select_vert");
			/*pag_change("#seeking-page .quadrant_abcd.abcd", "widget_add_other_devices");
			page_act("#seeking-page");
			schema_act("#seeking-page", "quadrant_abcd.abcd");*/
		//}, 1000);
	}).show();
	//
	$("#debug2").click(function()
	{	
//		pag_change("#seeking-page .quadrant_abcd.abcd", "widget_add_other_devices");
//		page_act("#seeking-page");
//		schema_act("#seeking-page", "quadrant_abcd.abcd");
		setTimeout(function()
		{
			pag_change(".JSdialog", "widget_zone_select_vert", $(".widget_sideanom").attr("data-area-ins"), $(".widget_sideanom").attr("data-area-dis"), $(".widget_sideanom").attr("data-area-grp"));
		}, 0.1 * 1000);
		
	}).show();
	//
	$("#debug3").click(function()
	{
		//
	}).show();
	//
	$("#debug4").click(function()
	{
		stdby_in();
	}).show();
	//
	$("#debug5").click(function()
	{
		$("#debug3").html("");
	}).show();
	//
	$("#debug7").click(function()
	{
		if ($("#debug9").is(":visible"))
			$("#debug9").hide();
		//
		if ($("#debug6").is(":visible"))
			$("#debug6").hide();
		else
			$("#debug6").show();
	}).show();
	//
	$("#debug8").click(function()
	{
		if ($("#debug6").is(":visible"))
			$("#debug6").hide();
		//
		if ($("#debug9").is(":visible"))
			$("#debug9").hide();
		else
			$("#debug9").show();
	}).show();
}
function main_status_get(event) //in caso di modifica delle sottocategorie dei device aggiornare inizializzazione "associative_id_subcat" e "register_indication"
{
	if (xml_file_configuration == null) return false;
	//
	var tema_path = ((isTema("light_tema") && !$("#header-home-page").hasClass("scuro")) ? "light/" : "");
	var tema_path_common = (isTema("common_tema") ? "common/" : "");
	//
	var state = $(event).children("State").text();
	$(event).find("Device").each(function()
	{
		var device_id = $(this).text();
		//
		var category = xml_file_configuration
			.children("Devices")
			.children("Device[id='"+device_id+"']")
			.children("Category").text();
		var subcategory = associative_id_subcat[device_id];
		var icon = xml_file_configuration
			.children("Categories")
			.children("Category[id='"+category+"']")
			.children("Subcategories")
			.children("Subcategory[id='"+subcategory+"']")
			.children("States")
			.children("State[id='"+state+"']")
			.children("Icon").text();
		//
		//
		if (subcategory == WS_DEV_ALARM_GSM_STR)
		{
			gsm_status = $(event).find("Info:first").text();	// status e nome operatore sono insieme
			//
			if ("nav_settings_phone" in pag_table_new)
				pag_table_new["nav_settings_phone"].update_credit_button_status();
			//
			if (gsm_status == GSM_STATUS_INIT)
			{}
			else
			{
				if ($(event).find("IMEI").text() != "")
					$(".imei span").text($(event).find("IMEI:first").text());
				else
					$(".imei span").text(gsm_status);
				//
				$("#mygsminfo").html(gsm_status);
				$("#mygsmstatus").attr("src", "{TMPL_DIR}res/" + tema_path + icon);
				//
				if (icon === "gsm_dot_void.png") $("#mygsmstatus").css("margin-right", "-1px");
				else $("#mygsmstatus").css("margin-right", "7px");
				//
				first_state = true;
			}
		}
		else if (subcategory == WS_DEV_ALARM_BAT_STR)
		{
			$("#mybatinfo").html($(event).find("Info").text());
			//
			if (icon == bat_fail_icon)
				icon = low_bat_icon;
			//
			clearTimeout(t_out_bat_ico);
			if (icon == low_bat_icon)
			{
				$("#info_bat_stdby").attr("data-low-bat", "1");
				var blinker = false;
				function blink_bat_ico()
				{
					if (blinker)
					{
						$("#mybatstatus").attr("src", "{TMPL_DIR}res/" + tema_path + "bk_" + icon);
						$("#info_bat_stdby").attr("style", "background:url({TMPL_DIR}res/" + tema_path + "big_bk_" + icon +") no-repeat center center;");
						blinker = false;
					}
					else
					{
						$("#mybatstatus").attr("src", "{TMPL_DIR}res/" + tema_path + icon);
						/*
						if ($("#info_stdby").hasAttr("style") || !$("#info_stdby").is(":empty") || $("#info_bat_stdby").attr("data-no-pow") == "1")
							$("#info_bat_stdby").addClass("side");
						else
							$("#info_bat_stdby").removeClass("side");
						*/
						$("#info_bat_stdby").attr("style", "background:url({TMPL_DIR}res/" + tema_path + "big_" + icon +") no-repeat center "+($("#info_bat_stdby").hasClass("side") ? "bottom;background-size:60%;" : "center;"));
						if (!QT) blinker = true;
					}
					//
					if (!QT) t_out_bat_ico = setTimeout(blink_bat_ico, 0.75 * 1000);
				}
				t_out_bat_ico = setTimeout(blink_bat_ico, 0.75 * 1000);
			}
			else 
			{
				$("#info_bat_stdby").attr("data-low-bat", "0");
				$("#info_bat_stdby").removeAttr("style");
				$("#mybatstatus").attr("src", "{TMPL_DIR}res/" + tema_path + icon);
			}
		}
		else if (subcategory == WS_DEV_ALARM_POW_STR)
		{
			clearTimeout(t_out_pow_ico);
			if (icon == pow_icon)
			{
				$("#info_pow_stdby").attr("data-no-pow", "0");
				$("#info_pow_stdby").removeAttr("style");
				$("#mypowstatus").attr("src", "{TMPL_DIR}res/" + tema_path + icon);
				//
				$("#mybatstatus").css("opacity", "0.5");
				$("#mybatstatus").css("filter", "alpha(opacity=50)");
			}
			else
			{
				$("#mybatstatus").css("opacity", "1");
				$("#mybatstatus").css("filter", "alpha(opacity=100)");
				//
				$("#info_pow_stdby").attr("data-no-pow", "1");
				var blinker_p = false;
				function blink_pow_ico()
				{
					if (blinker_p)
					{
						$("#mypowstatus").attr("src", "{TMPL_DIR}res/" + tema_path + "bk_" + icon);
						$("#info_pow_stdby").attr("style", "background:url({TMPL_DIR}res/" + tema_path + "big_bk_" + icon +") no-repeat center center;");
						blinker_p = false;
					}
					else
					{
						$("#mypowstatus").attr("src", "{TMPL_DIR}res/" + tema_path + icon);
						/*
						if ($("#info_stdby").hasAttr("style") || !$("#info_stdby").is(":empty") || $("#info_bat_stdby").attr("data-low-bat") == "1")
							$("#info_pow_stdby").addClass("side");
						else
							$("#info_pow_stdby").removeClass("side");
						*/
						$("#info_pow_stdby").attr("style", "background:url({TMPL_DIR}res/" + tema_path + "big_" + icon +") no-repeat center "+($("#info_pow_stdby").hasClass("side") ? "bottom;background-size:35%;" : "center;"));
						if (!QT) blinker_p = true;
					}
					//
					if (!QT) t_out_pow_ico = setTimeout(blink_pow_ico, 700);
				}
				t_out_pow_ico = setTimeout(blink_pow_ico, 700);
			}
		}
		else if (subcategory == WS_DEV_ALARM_WIFI_STR)
		{
			$("#mywifistatus").attr("src", "{TMPL_DIR}res/" + tema_path + icon);
		}
		else if (subcategory == WS_DEV_ALARM_TERM_STR)
		{
//			$("#mysessionstatus").attr("src", "{TMPL_DIR}res/" + tema_path + icon);
		}
		else if (subcategory == WS_DEV_ALARM_RTC_STR)
		{
			var ts_local = $(event).find("Timestamp:first").text();
			if (ts_xml_template != null) ts_xml_template.children("ts").text(ts_local);
			//
			rtc_ts_set(ts_local, $(event).children("localdt").text());
			//rtc_refresh();
		}
		else if (subcategory == WS_DEV_ALARM_CLOUD_STR)
		{
			$("#mycloudstatus").attr("src", "{TMPL_DIR}res/" + tema_path_common + "cloud_st_" + state + ".png");
		}
		else if (subcategory == WS_DEV_ALARM_TELEGEST_STR)
		{
			$("#mytelegeststatus").attr("src", "{TMPL_DIR}res/" + tema_path + "telegest_st_" + state + ".png");
			//
			if ("widget_telegest" in pag_table_new)
			{
				if (pag_table_new["widget_telegest"].loaded)
				{
					pag_table_new["widget_telegest"].share_state = Number(event.find("ShareStatus").text());
					pag_table_new["widget_telegest"].update_status();
				}
			}	
		}
		else if (subcategory == WS_DEV_ALARM_DASH_STR)
		{
			icon = icon.cutAfter(".png");
			//
			if (icon == "dash_ok")
				$("#footer_c").removeClass("warned");
			else if (icon == "dash_ko")
				$("#footer_c").addClass("warned");
			else if (icon == "dash_warn")
				$("#footer_c").addClass("warned");
		}
		else if 
		(
			subcategory == WS_DEV_ALARM_AVE_AUTOMATION_STR
			|| subcategory == WS_DEV_ALARM_IOT_STR
		)
		{
			autom_iot_mask[subcategory] = state;
			//
			if (subcategory == WS_DEV_ALARM_AVE_AUTOMATION_STR)
				autom_ip = event.find("ip").text();
			else if (subcategory == WS_DEV_ALARM_IOT_STR)
				iot_ip = event.find("ip").text();
			//
			main_iot_dom_state_changer();
		}
	});
}
function switch_language(lang)
{
	//lingua impostata sul server
	$.ajax
	({
		url: "?gui_lang=" + lang,
		type: "GET",
		success: function()
		{
			$.ajax({url:"?cmd=getjs&name=util"});
			$.ajax({url:"?cmd=getjs&name=function_items"});
			//
			if (QT)
				preloadAll();
			else
				pagBufBox = {};
			//
			riprova(function()
			{
				if ("widget_leaf_home" in pag_table_new)
					pag_change("#main-page .quadrant_abcd.abcd", "widget_leaf_home", true);
				if ("widget_settings_utilities" in pag_table_new)
					pag_change("#settings-page .quadrant_abcd", "widget_settings_utilities", true);
				if ("summary" in pag_table_new)
					pag_change("#side-menu", "summary");
				else if ("widget_lang" in pag_table_new)
					pag_change("#seeking-page .quadrant_abcd", "widget_lang");
				//
				if ("nav_settings_generic" in pag_table_new)
					pag_change("#seeking-page .quadrant_abcd", "nav_settings_generic");
				if ("nav_lang_naz" in pag_table_new)
					pag_change("#seeking-page .quadrant_abcd", "nav_lang_naz");
				//
				if (typeof webbridge !== 'undefined')
				{
					webbridge.setLanguage(lang);
				}
			}, QT ? isPreloaded : function(){ return true; }, 1);
		}
	});
}
function tyu(content)
{
	if (SIMUL)
	{
		alert(content);
	}
}
function rtyu(content, append, separator)
{
	if (DEBUG_SW)
	{
		if (append)
		{
			if (QT)
				$("#debug3").append((separator ? " |" : " //////////////////////////////////////// ") + content);
			else
				$("#debug3").text($("#debug3").text() + (separator ? " |" : " //////////////////////////////////////// ") + content);
		}
		else
		{
			$("#debug3").text(content);
		}
	}
}
function cons(content)
{
	if (DEBUG_SW)
	{
		$("#debug6").append("<br>"+content);
	}
}
function pairing_send()
{
	xml_request = xml_request_head_build("PAIRING", "main_obj");
	xml_par = $(XML("Authentication")); xml_par.attr("username", "host"); xml_par.attr("password", "00000"); xml_request.append(xml_par);
	xml_send(xml_request);
}
function file_conf_request(par)
{
	xml_request = xml_request_head_build("FILE", "main_obj");
	xml_par = $(XML("Type")); xml_par.text("CONFIGURATION"); xml_request.append(xml_par);
	xml_send(xml_request);
}
function cen_conf_request(filter, set_shunt)
{
	var filter_split = filter.split("|");
	//
	var load_send_filter = "";
	var area_load = false;
	var room_load = false;
	var set_load = false;
	//
	for (var i = 0; i < filter_split.length; i++)
	{
		var elem = filter_split[i].toUpperCase();
		if (elem === "RTC")
		{
			load_send_filter += (load_send_filter === "" ? "" : "|");
			load_send_filter += WS_DEV_ALARM_RTC_STR;
		}
		else if (elem === "WIFI")
		{
			load_send_filter += (load_send_filter === "" ? "" : "|");
			load_send_filter += WS_DEV_ALARM_WIFI_STR;
		}
		else if (elem === "CEN")
		{
			load_send_filter += (load_send_filter === "" ? "" : "|");
			load_send_filter += WS_DEV_ALARM_CEN_STR;
		}
		else if (elem === "AREA")
		{
			area_load = true;
		}
		else if (elem === "ROOM")
		{
			room_load = true;
		}
		else if (elem === "SET")
		{
			set_load = true;
		}
	}
	var main_obj_str = "main_obj";
	if (set_shunt != null)
		pag_table_new["main_obj"].resp_set_shunt = set_shunt;
	else
		pag_table_new["main_obj"].resp_set_shunt = "";
	//
	if (load_send_filter != "")
	{
		cons("send "+load_send_filter+" load");
		xml_menu_load_send(WS_DEV_STR, load_send_filter, null, main_obj_str);
	}
	if (area_load)
	{
		cons("send area load");
		xml_menu_load_send(WS_AREA_STR, null, null, main_obj_str);
	}
	if (room_load)
	{
		cons("send room load");
		xml_menu_load_send(WS_ROOM_STR, null, null, main_obj_str);
	}
	if (set_load)
	{
		cons("send set load");
		xml_menu_load_send(WS_SET_STR, null, null, main_obj_str);
	}
}
//
//
var allowed_flg = true;
var summary_root_widget_list = {};
summary_root_widget_list["widget_add_other_devices"] = 1;
summary_root_widget_list["nav_communication"] = 1;
summary_root_widget_list["nav_lang_naz"] = 1;
summary_root_widget_list["widget_new_plant"] = 1;
summary_root_widget_list["widget_identifying_areas"] = 1;
summary_root_widget_list["widget_add_other_users"] = 1;
summary_root_widget_list["widget_audio"] = 1;
summary_root_widget_list["widget_scenery_list"] = 1;
summary_root_widget_list["widget_parcen"] = 1;
summary_root_widget_list["widget_mod_inst"] = 1;
function header_home_switch_init(widget_obj)
{
	if (wizard_flg && (widget_obj.name in summary_root_widget_list) && allowed_flg)
	{
		if ("summary" in pag_table_new)
			pag_table_new["summary"].header_home_switch();
	}
	else
	{
		header_act("#header-home-page2");
		//
		$("#header-home-page2 .header_title").html("NO TITLE");
		if (widget_obj.title == null)
			if (wizard_flg)
				$("#header-home-page2 .header_title").html(pag_table_new["summary"].title + " - " + widget_obj.name);
			else
				$("#header-home-page2 .header_title").html(widget_obj.name);
		else
			if (wizard_flg)
				$("#header-home-page2 .header_title").html(pag_table_new["summary"].title + " - " + widget_obj.title);
			else
				$("#header-home-page2 .header_title").html(widget_obj.title);
		//
		$("#header-home-page2 .close").removeClass("disabled");
		$("#backTitle").html("").off("click").click(function()
		{
			$("#header-home-page2 .close").trigger("click");
		});
		//
		if (wizard_config_flg)
			$("#header-home-page2 .home").addClass("disabled");
		else
			$("#header-home-page2 .home").removeClass("disabled");
		$("#header-home-page2 .home").off("click").click(function()
		{
			if (!($(this).hasClass("disabled")))
			{
				back_to_home(widget_obj);
			}
		});
	}
	allowed_flg = true;
}
function header_wizard_switch_init(widget_obj)
{
	header_act("#header-wizard-page");
	$("#header-wizard-page .header_title").html("NO TITLE");
	if (widget_obj.title == null)
		$("#header-wizard-page .header_title").html(widget_obj.name);
	else
		$("#header-wizard-page .header_title").html(widget_obj.title);
	//
	$("#header-wizard-page .home").off("click").click(function()
	{
		if (wizard_config_flg)
		{
			var access_granted = 1;
			for (var key in wizard_mandatory_task)
				access_granted &= wizard_mandatory_task[key];
			//
			if (access_granted == 1)
			{
				send_state_welcome_exit();
				pag_change("#wrapper", "home", "main");	
			}
			else
			{
				popMandatoryMessages();
			}
		}
		else
		{
			back_to_home(widget_obj);
		}
	});
}
function header_nav_communication_group(widget_obj) //typeconn //parvig //widget_mod_email //widget_cloud //widget_parconn
{
	if ("nav_communication" in pag_table_new)
	{
		pag_table_new["nav_communication"].header_home_switch();
		pag_table_new["nav_communication"].footer_home_switch();
		//
		page_act("#settings-page");
		pag_clear("#seeking-page .quadrant");
	}
	else
	{
		pag_change("#seeking-page .quadrant_abcd", "nav_communication");
	}
}
function header_nav_settings_generic_group(widget_obj)
{
	$("#header-home-page2 .close, #header-home-page2 .home").removeClass("disabled");
	pag_change("#seeking-page .quadrant_abcd", "nav_settings_generic");
}
function header_widget_settings_utilities_group()
{
	if ("widget_settings_utilities" in pag_table_new)
	{
		pag_table_new["widget_settings_utilities"].header_home_switch();
		pag_table_new["widget_settings_utilities"].footer_home_switch();
		//
		page_act("#settings-page");
		pag_clear("#seeking-page .quadrant");
	}
	else
	{
		pag_change("#settings-page .quadrant_abcd", "widget_settings_utilities");
	}
}
function header_home_group(widget_obj)
{
	$("#header-home-page2 .home").trigger("click");
}
function header_mod_device(widget_obj)
{
	$("#header-home-page2 .close").off("click").click(function(event, saveFlg)
	{
		polling_selettivo(widget_obj.xml_any.children("id").text(), widget_obj.xml_any.children("subcategory").text(), false);
		//
		device_saved_flg = saveFlg;
		//
		filter_area = [];
		filter_room = [];
		filter_type = [];
		//
		pag_change("#seeking-page .quadrant_abcd.abcd", "widget_add_other_devices");
	});
	//
	$("#backTitle").html("{LANG_WIZARD_ADD_OTHER_DEVICES_TITLE}");
}
function header_nav_lang_naz_group()
{
	pag_change("#seeking-page .quadrant_abcd", "nav_lang_naz");
}
//
function footer_home_switch_init()
{
	footer_act("#footer-home-page2");
	$("#footer_central_container").empty();
}