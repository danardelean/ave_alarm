pag_table_new["widget_diag"] = {
	onload: function()
	{
		if ($(".widget_diag").closest(".JSdialog2").length > 0)
			this.diag_container = ".JSdialog2";
		//
		$("#home " + this.diag_container).addClass("full_scr");
		$(this.diag_container).show();
		//
		var widget_obj = this;
		//
		$("#title_diag").html(this.diag_title);
		$("#escape_diag").click(function()
		{
			pag_clear(widget_obj.diag_container);
		});
		if (this.item_name[0] == "#")
			this.max_selection_flg = $(this.item_name).hasAttr("data-max-selection");
		else
			this.max_selection_flg = $(this.container + " ." + this.item_name).hasAttr("data-max-selection");
		//
		var quick_select = false;
		var pos = 0;
		//***********
		//**begin container
		if (this.data_identifier === "and_match")
		{
			var and_match_str = ["{LANG_WIZARD_AND_MATCH_ITEM_OR_DESC}", "{LANG_WIZARD_AND_MATCH_ITEM_AND_DESC}"];
			for (var i = 0; i < and_match_str.length; i++)
				$("#container_diag").append("<div class='diag_button item ex alo scrollableSize' data-id='" + i + "'><p>" + and_match_str[i] + "</p>" + this.switchHTML() + "</div>");
			//
			this.bindSwitcher();
			$("#container_diag .diag_button[data-id='" + this.wo_primary.and_match + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier === "not_ena")
		{
			for (var i = 0; i < this.wo_primary.xml_any_tbl_parcen_bkp.length; i++)
			{
				var ena_value = -2;
				if (this.wo_primary.xml_any_tbl_parcen_bkp[i].children("ena").length > 0)
					ena_value = this.wo_primary.xml_any_tbl_parcen_bkp[i].children("ena").text();
				//
				if (ena_value == "0" || ena_value == "1")
					$("#container_diag").append("<div class='diag_button item scrollableSize' data-index='" + i + "' data-id='" + this.wo_primary.xml_any_tbl_parcen_bkp[i].children("id").text() + "'><p>" + this.wo_primary.xml_any_tbl_parcen_bkp[i].children("name").text() + "</p>" + this.switchHTML(1 - ena_value) + "</div>");
			}
			//
			this.bindSwitcher();
			//
			this.upshot();
		}
		else if (this.data_identifier === "auth")
		{
			$("#container_diag").html
			(
				"<div class='diag_button item ex alo scrollableSize' name='NONE' data-auth='0' id='auth_none'><p class='valueStr'>{LANG_WIZARD_PARCONN_AUTH_NONE}</p><hr/>" + this.switchHTML() + "</div>"
				+ (typeconn.mode == "CL" ? "<div class='diag_button item ex alo' name='WPA' data-auth='1' id='auth_wpa'><p class='valueStr'>{LANG_WIZARD_PARCONN_AUTH_WPA}</p><hr/>" + this.switchHTML() + "</div>" : "")
				+ "<div class='diag_button item ex alo' name='WPA2' data-auth='2' id='auth_wpa2'><p class='valueStr'>{LANG_WIZARD_PARCONN_AUTH_WPA2}</p><hr/>" + this.switchHTML() + "</div>"
				+ (typeconn.mode == "CL" ? "<div class='diag_button item ex alo' name='WEP' data-auth='3' id='auth_wep'><p class='valueStr'>{LANG_WIZARD_PARCONN_AUTH_WEP}</p><hr/>" + this.switchHTML() + "</div>" : "")
			);
			//
			this.bindSwitcher();
			$("#container_diag .diag_button[data-auth='" + this.wo_primary.auth + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier === "time_zone")
		{
			xml_file_configuration.find("Timezones Timezone").each(function(index)
			{
				$("#container_diag").append("<div class='diag_button item ex alo scrollableSize' data-value='" + $(this).attr("id") + "'><p>" + $(this).attr("desc") + "</p>" + widget_obj.switchHTML() + "</div>");
			});
			//
			this.wo_primary.utc_value = this.wo_primary.utc_value || -1;
			this.bindSwitcher();
			$("#container_diag .diag_button[data-value='" + this.wo_primary.utc_value + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier === "filter_area")
		{
			area_list.children("item").each(function()
			{
				$("#container_diag").append("<div class='diag_button item scrollableSize' data-value='" + $(this).children("name").text() + "'><p>" + $(this).children("desc").text() + "</p>" + widget_obj.switchHTML() + "</div>");
			});	
			//
			this.bindSwitcher();
			for (var i = 0; i < filter_area.length; i++)
				$("#container_diag .diag_button[data-value='" + filter_area[i] + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier === "filter_room")
		{
			for (var i = 0; i < this.wo_primary.room_list_array.length; i++)
				if (this.wo_primary.room_list_array[i].length > 0)
					$("#container_diag").append("<div class='diag_button item scrollableSize' data-value='" + (i - 1 + 2) + "'><p>" + this.wo_primary.room_list_array[i] + "</p>" + this.switchHTML() + "</div>");
			//
			this.bindSwitcher();
			for (var i = 0; i < filter_room.length; i++)
				$("#container_diag .diag_button[data-value='" + filter_room[i] + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier === "filter_type")
		{
			for (var i = 0; i < all_device_id_list.length; i++)
				if (this.wo_primary.filter_device_associative_array[all_device_id_list[i]] == 1)
					$("#container_diag").append("<div class='diag_button item scrollableSize' data-value='" + all_device_id_list[i] + "'><p>" + device_associative_array[all_device_id_list[i]] + "</p>" + this.switchHTML() + "</div>");
			//
			this.bindSwitcher();
			for (var i = 0; i < filter_type.length; i++)
				$("#container_diag .diag_button[data-value='" + filter_type[i] + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier === "region_conn")
		{
			xml_file_configuration.find("WifiRegions WifiRegion").each(function()
			{
				$("#container_diag").append("<div class='diag_button item ex alo scrollableSize' data-value='" + $(this).attr("id") + "'><p class='small_txt'>" + $(this).attr("desc") + "</p>" + widget_obj.switchHTML() + "</div>");
			});
			//
			this.bindSwitcher();
			$("#container_diag .diag_button[data-value='" + $(this.container + " .region_conn").attr("data-value") + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier === "and_function_dev")
		{
			$("#container_diag").append("<div class='diag_button item ex alo scrollableSize' data-id='0'><p>{LANG_DISABLED}</p>" + this.switchHTML() + "</div>");
			for (var i = 0; i < xml_any_tbl.length; i++)
			{
				var subcategory = xml_any_tbl[i].children("subcategory").text();
				if 
				(
					xml_any_tbl[i].children("id").text() != this.wo_primary.xml_any.children("id").text()
					&& xml_any_tbl[i].children("ena").text() == "1"
					&&
					(
						(
							subcategory == WS_DEV_ALARM_SEN_MAG_STR
							&& 
							(
								xml_any_tbl[i].children("ord").text() == "0"
								|| xml_any_tbl[i].children("phy_mode").text() != SENMAG_N_DISABLED
							)
						)
						|| subcategory == WS_DEV_ALARM_SEN_PIR_STR
						|| subcategory == WS_DEV_ALARM_SEN_PHOTOPIR_STR
						|| subcategory == WS_DEV_ALARM_SEN_3T_STR
						|| subcategory == WS_DEV_ALARM_SEN_DT_STR
						|| subcategory == WS_DEV_ALARM_SEN_DUALPIR_LR_STR
						||
						(
							subcategory == WS_DEV_ALARM_SEN_MIC_STR
							&&
							(
								xml_any_tbl[i].children("ord").text() == "0"
								|| xml_any_tbl[i].children("alarm_mode").text() != "0"
							)
						)
//						|| subcategory == WS_DEV_ALARM_SEN_FLO_STR
//						|| subcategory == WS_DEV_ALARM_SEN_SMO_STR
//						||
//						(
//							subcategory == WS_DEV_ALARM_SENUNI_STR
//							&&
//							(
//								xml_any_tbl[i].children("ord").text() == "0"
//								|| xml_any_tbl[i].children("phy_mode").text() != SENUNI_N_DISABLED
//							)
//						)
						||
						(
							subcategory == WS_DEV_ALARM_WIRED_STR
							&& xml_any_tbl[i].children("wire_type").text() == "1"
							&& xml_any_tbl[i].children("cfg_wire_in_mode").text() != WIRE_N_DISABLED
						)
						|| subcategory == WS_DEV_ALARM_BUS_SENIR_STR
						|| subcategory == WS_DEV_ALARM_BUS_SENDT_STR
						|| subcategory == WS_DEV_ALARM_BUS_SMALLPIR_STR
						|| subcategory == WS_DEV_ALARM_BUS_WINDOWPIR_STR
						|| subcategory == WS_DEV_ALARM_BUS_TRANSPONDER_STR
						|| subcategory == WS_DEV_ALARM_BUS_CONT_STR
						|| 
						(
							subcategory == WS_DEV_ALARM_BUS_SENRF_STR
							&&
							(
								xml_any_tbl[i].children("mode").text() == DELAYED
								|| xml_any_tbl[i].children("mode").text() == MATCH_DEV
								|| xml_any_tbl[i].children("mode").text() == MATCH_AREA
							)
						)
						||
						(
							(
								subcategory == WS_DEV_ALARM_BUS_SENSORI_STR
							)
							&& 
							(
								xml_any_tbl[i].children("ord").text() == "0"
								|| xml_any_tbl[i].children("child_valid").text() == "1"
							)
						)
						||
						(
							(
								subcategory == WS_DEV_ALARM_BUS_CONC_STR
								|| subcategory == WS_DEV_ALARM_BUS_INPUT_STR
							)
							&& Number(xml_any_tbl[i].children("ord").text()) > 0
							&& xml_any_tbl[i].children("child_valid").text() == "1"
						)
					)
				)
					$("#container_diag").append("<div class='diag_button item ex alo' data-id='" + xml_any_tbl[i].children("id").text() + "' data-checked='0'><p>" + xml_any_tbl[i].children("name").text() + "</p>" + widget_obj.switchHTML() + "</div>");
			}
			//
			this.bindSwitcher();
			$("#container_diag .diag_button[data-id='" + and_function_dev + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier === "gsm_priority")
		{
			var local_gsm_priority = this.wo_primary.gsm_priority;
			//
			for (var i = 0; i < gsm_priority_str.length; i++)
				$("#container_diag").append("<div class='diag_button item ex alo scrollableSize' data-id='" + i + "' data-checked='0'><p>" + gsm_priority_str[i] + "</p>" + this.switchHTML() + "</div>");
			//
			this.bindSwitcher();
			$("#container_diag .diag_button[data-id='" + local_gsm_priority + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier === "phy_mode")
		{
			var h24 = false;
			if ("mode_bus_rf" in this.wo_primary)
				if (this.wo_primary.mode_bus_rf == ALA_MODE_T)
					h24 = true;
			//
			$("#container_diag").append
			(
					"<div class='diag_button item ex alo en50131 scrollableSize' data-id='" + this.wo_primary.NC + "'><p>{LANG_NCLOSED}</p>" + this.switchHTML() + "</div>"
				+	"<div class='diag_button item ex alo en50131' data-id='" + this.wo_primary.NO + "'><p>{LANG_NOPENED}</p>" + this.switchHTML() + "</div>"
				+	(h24 ? "" : "<div class='diag_button item ex alo en50131' data-id='" + this.wo_primary.NC_CONTAIMPULSI + "'><p>{LANG_ICOUNT}</p>" + this.switchHTML() + "</div>")
				+	"<div class='diag_button item ex alo' data-id='" + this.wo_primary.NC_BILANCIATO + "'><p>{LANG_BALANCED}</p>" + this.switchHTML() + "</div>"
				+	"<div class='diag_button item ex alo' data-id='" + this.wo_primary.NC_DOPPIO_BILANCIAMENTO + "'><p>{LANG_DBALANCED}</p>" + this.switchHTML() + "</div>"
				+	(h24 ? "" : "<div class='diag_button item ex alo' data-id='" + this.wo_primary.NC_BILANCIATO_CONTAIMPULSI + "'><p>{LANG_IBALANCED}</p>" + this.switchHTML() + "</div>")
				+	"<div class='diag_button item ex alo' data-id='" + this.wo_primary.NC_DUAL + "'><p>{LANG_NCDUAL}</p>" + this.switchHTML() + "</div>"
			);
			//
			this.bindSwitcher();
			//
			$("#container_diag .diag_button[data-id='" + this.wo_primary.phy_mode + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier == "user_events")
		{
			var evetype = this.data_extra;
			//
			xml_file_configuration.find("MsgEvents MsgEvent").each(function()
			{
				if (evetype == "push") 
					if ($(this).attr("id") == "11" || $(this).attr("id") == "12")
						return;
				//
				$(".container_diag").append("<div class='diag_button item scrollableSize' data-value='" + $(this).attr("id") + "'><p>" + $(this).attr("desc") + "</p>" + widget_obj.switchHTML() + "</div>");
			});
			//
			if (evetype === "vox")
				this.wo_primary.local_msk = this.wo_primary.vox_msk;
			else if (evetype === "sms")
				this.wo_primary.local_msk = this.wo_primary.sms_msk;
			else if (evetype === "push")
				this.wo_primary.local_msk = this.wo_primary.cloud_push_msk;
			//
			this.bindSwitcher();
			//
			$("#container_diag .diag_button .switcher").each(function()
			{
				var index = Number($(this).parent().attr("data-value"));
				//
				var single_eve = widget_obj.wo_primary.local_msk.charAt(index);
				if (single_eve == "-" || single_eve == "")
					$(this).trigger("switch_state_changer", [["off"]]);
				else
					$(this).trigger("switch_state_changer", [["on"]]);
			});
			//
			this.upshot();
		}
		else if (this.data_identifier === "notification")
		{
			/**
			 * l'autorizzazzione a selezionare le aree e il nome dell'elemento si trovano
			 * nel "xml" di configurazione mentre le aree effettivamente selezionate si recuperano 
			 * dalla "load (notifyStruct)". La chiave "id" collega la "load" al file "xml"
			 */
			var guiId = this.data_extra;
			//
			xml_file_configuration.find("VigEvents VigEvent").each(function()
			{
				var area_flg = false;
				var area_str = "";
				var notifId = $(this).attr("id");
				//
				if ($(this).attr("area_select") == "true")
				{
					area_flg = true;
					var areas = widget_obj.wo_primary.notifyStruct[guiId].events[notifId].areas;
					for (var i = 0; i < areas.length; i++)
						if (areas.charAt(i) != "-")
							area_str += "" + areas.charAt(i);
				}
				//
				$("#container_diag").append
				(
					"<div class='diag_button item scrollableSize' data-id='" + notifId + "'><p>" + $(this).attr("desc") + " " + (area_flg ? area_str : "") + "</p>" + widget_obj.switchHTML(widget_obj.wo_primary.notifyStruct[guiId].events[notifId].ena) + "</div>"
				);
			});
			//
			this.bindSwitcher();
			//
			this.upshot();
		}
		else if (this.data_identifier === "transmission")
		{
			var guiId = this.data_extra;
			//
			$("#container_diag").append
			(
				"<div class='diag_button item ex alo scrollableSize' data-id='0'><p>{LANG_DIRECT}</p>" + widget_obj.switchHTML() + "</div>"
			+	"<div class='diag_button item ex alo' data-id='1'><p>{LANG_INVERSE}</p>" + widget_obj.switchHTML() + "</div>"
			);
			//
			this.bindSwitcher();
			$("#container_diag .diag_button[data-id='" + widget_obj.wo_primary.notifyStruct[guiId].invFlag + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier === "tcpudp")
		{
			var guiId = this.data_extra;
			//
			$("#container_diag").append
			(
				"<div class='diag_button item ex alo scrollableSize' data-id='0'><p>{LANG_TCP}</p>" + widget_obj.switchHTML() + "</div>"
			+	"<div class='diag_button item ex alo' data-id='1'><p>{LANG_UDP}</p>" + widget_obj.switchHTML() + "</div>"
			);
			//
			this.bindSwitcher();
			$("#container_diag .diag_button[data-id='" + widget_obj.wo_primary.notifyStruct[guiId].udpFlag + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier === "prot")
		{
			var guiId = this.data_extra;
			//
			$("#container_diag").append
			(
				"<div class='diag_button item ex alo scrollableSize' data-id='2'><p>{LANG_SIA_ADEM_CID}</p>" + widget_obj.switchHTML() + "</div>"
			+	"<div class='diag_button item ex alo' data-id='3'><p>{LANG_SIA_DCS}</p>" + widget_obj.switchHTML() + "</div>"
			);
			//
			this.bindSwitcher();
			$("#container_diag .diag_button[data-id='" + widget_obj.wo_primary.notifyStruct[guiId].prot + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier === "mode_alarm")
		{
			var mre_list = xml_file_configuration.find("ReleModeRepeatEvents ReleModeRepeatEvent");
			var busRelayFlg = this.wo_primary.xml_any.children("subcategory").text() == WS_DEV_ALARM_BUS_RELAY_STR;
			//
			$("#container_diag").append
			(
				"<div class='diag_button item ex alo scrollableSize' data-id='1' data-sec-lbound='1' data-sec-ubound='999' data-sec-def='180'><p>{LANG_RELAY_MONOSTABLE}</p>" + widget_obj.switchHTML() + "</div>"
			+	"<div class='diag_button item ex alo' data-id='2' data-sec-lbound='0' data-sec-ubound='0' data-sec-def='0'><p>{LANG_RELAY_BISTABLE}</p>" + widget_obj.switchHTML() + "</div>"
			+	(busRelayFlg ? "" : "<div class='diag_button item ex alo' data-id='3' data-sec-lbound='1' data-sec-ubound='120' data-sec-def='20'><p>{LANG_RELAY_BLIND}</p>" + widget_obj.switchHTML() + "</div>")
			);
			mre_list.each(function()
			{
				$("#container_diag").append("<div class='diag_button item ex alo' data-id='" + ($(this).attr("id") - 1 + 4) + "' data-sec-lbound='" + $(this).attr("sec_lbound")+"' data-sec-ubound='" + $(this).attr("sec_ubound") + "' data-sec-def='" + $(this).attr("default") + "'><p>" + $(this).attr("desc") + "</p>" + widget_obj.switchHTML() + "</div>");
			});
			//
			this.bindSwitcher();
			if (this.wo_primary.mode == "1")
				$("#container_diag .diag_button[data-id='" + (this.wo_primary.mode_repeat_eve - 1 + 4) + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			else if (this.wo_primary.mode == "2")
				$("#container_diag .diag_button[data-id='" + this.wo_primary.cfg_relay_mode + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier === "abilitation")
		{
			$("#container_diag").append("<div class='diag_button item ex alo scrollableSize' data-id='0'><p>{LANG_NO_SETUP}</p>" + widget_obj.switchHTML() + "</div>");
			for (var i = 0; i < this.wo_primary.xml_sen_oc_tbl.length; i++)
			{
				$("#container_diag").append
				(
					  "<div class='diag_button item ex alo' data-id='" + this.wo_primary.xml_sen_oc_tbl[i].children("id").text() + "'>"
					+		"<p>" + this.wo_primary.xml_sen_oc_tbl[i].children("name").text() + "</p>"
					+ 		widget_obj.switchHTML()
					+ "</div>"
				);
			}
			//
			this.bindSwitcher();
			$("#container_diag .diag_button[data-id='" + this.wo_primary.mode_domo_sen_trigger_id + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier === "trigger_relay")
		{
			$("#container_diag").append("<div class='diag_button item ex alo scrollableSize' data-id='0'><p>{LANG_NO_SETUP}</p>" + widget_obj.switchHTML() + "</div>");
			var device_list = this.wo_primary.cfg_relay_mode == 2 ? this.wo_primary.xml_sen_oc_tbl : this.wo_primary.xml_sen_tbl;
			for (var i = 0; i < device_list.length; i++)
			{
				$("#container_diag").append
				(
					"<div class='diag_button item alo' data-id='" + device_list[i].children("id").text() + "'>"
					+	"<p>" + device_list[i].children("name").text() + "</p>" 
					+	widget_obj.switchHTML()
					+"</div>"
				);
			}
			//
			this.bindSwitcher();
			if 
			(
				this.wo_primary.mode_domo_sen_a_id == "0"
				&& this.wo_primary.mode_domo_sen_b_id == "0"
				&& this.wo_primary.mode_domo_sen_c_id == "0"
			)
				$("#container_diag .diag_button[data-id='0'] .switcher").trigger("switch_state_changer", [["on"]]);
			else
			{
				if (this.wo_primary.mode_domo_sen_a_id != "0")
					$("#container_diag .diag_button[data-id='" + this.wo_primary.mode_domo_sen_a_id + "'] .switcher").trigger("switch_state_changer", [["on"]]);
				if (this.wo_primary.mode_domo_sen_b_id != "0")
					$("#container_diag .diag_button[data-id='" + this.wo_primary.mode_domo_sen_b_id + "'] .switcher").trigger("switch_state_changer", [["on"]]);
				if (this.wo_primary.mode_domo_sen_c_id != "0")
					$("#container_diag .diag_button[data-id='" + this.wo_primary.mode_domo_sen_c_id + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			}
			//
			this.upshot();
		}
		else if (this.data_identifier === "real_relay")
		{
			$("#container_diag").append("<div class='diag_button item ex alo scrollableSize' data-id='0'><p>{LANG_NO_SETUP}</p>" + this.switchHTML() + "</div>");
			$("#container_diag").append("<div class='diag_button item ex alo' data-id='1'><p>{LANG_RELAY_MOR_NC}</p>" + this.switchHTML() + "</div>");
			$("#container_diag").append("<div class='diag_button item ex alo' data-id='2'><p>{LANG_RELAY_MOR_NO}</p>" + this.switchHTML() + "</div>");
			//
			this.bindSwitcher();
			$("#container_diag .diag_button[data-id='" + this.wo_primary.cfg_relay_cfm_exe_ext + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier === "diag_areas")
		{
			var ins_dis_insp = this.data_extra;
			//
			$("#container_diag").append
			(
					"<div class='diag_button item scrollableSize' data-id='1'><p class='area_label'></p>" + this.switchHTML() + "</div>"
				+	"<div class='diag_button item' data-id='2'><p class='area_label'></p>" + this.switchHTML() + "</div>"
				+	"<div class='diag_button item' data-id='3'><p class='area_label'></p>" + this.switchHTML() + "</div>"
				+	"<div class='diag_button item' data-id='4'><p class='area_label'></p>" + this.switchHTML() + "</div>"
				+	"<div class='diag_button item' data-id='5'><p class='area_label'></p>" + this.switchHTML() + "</div>"
				+	"<div class='diag_button item' data-id='6'><p class='area_label'></p>" + this.switchHTML() + "</div>"
			);
			//
			//
			this.bindSwitcher();
			//
			load_areas_diag("#container_diag", this.wo_primary, ins_dis_insp);
			//
			scrollList(this);
		}
		else if (this.data_identifier === "diag_areas_local")
		{
			var mask = area_off_all_str;
			if (this.caller_name = "widget_mod_device_rem")
			{
				if (this.wo_primary.guiRemId[this.item_name].change_flg) // se il valore è già cambiato viene caricato dalla memoria altrimenti dalla trama salvata in centrale
				{
					if (this.wo_primary.remToggleId[this.wo_primary.guiRemId[this.item_name].save_type].mode == REM_MODE_1)
						mask = this.wo_primary.guiRemId[this.item_name].save_par;
				}
				else
				{
					var remToggleIdObj = this.wo_primary.remToggleId[this.wo_primary.xml_any.find("keys key[id='" + this.wo_primary.guiRemId[this.item_name].trama_idx + "'] type").text()];
					if (remToggleIdObj != null && remToggleIdObj.mode == REM_MODE_1)
						mask = this.wo_primary.xml_any.find("keys key[id='" + this.wo_primary.guiRemId[this.item_name].trama_idx + "'] par").text();
				}
			}
			//
			for (var i = 0; i < area_off_all_str.length; i++)
				$("#container_diag").append("<div class='diag_button item scrollableSize' data-id='" + (i + 1) + "'><p class='area_label'></p>" + this.switchHTML() + "</div>");
			//
			this.bindSwitcher();
			//
			load_areas_diag_mask("#container_diag", mask);
			//
			scrollList(this);
		}
		else if (this.data_identifier === "diag_events")
		{
			var events_index = this.data_extra;
			var all_areas_selected_str = "";
			area_list.children("item").each(function()
			{
				all_areas_selected_str += $(this).children("id").text();
			});
			//
			$("#container_diag").append("<div class='diag_button item ex alo scrollableSize' data-type='VOID' data-par='" +all_areas_selected_str + "'><p>{LANG_NO_SETUP}</p>" + this.switchHTML() + "</div>");
			$("#container_diag").append("<div class='diag_button item ex alo' data-type='M' data-par='" + all_areas_selected_str + "'><p>{LANG_FIRST_AID}</p>" + this.switchHTML() + "</div>");
			$("#container_diag").append("<div class='diag_button item ex alo' data-type='R' data-par='" + all_areas_selected_str + "'><p>{LANG_AGGRESSION}</p>" + this.switchHTML() + "</div>");
			$("#container_diag").append("<div class='diag_button item ex alo' data-type='P' data-par='" + all_areas_selected_str + "'><p>{LANG_PANIC}</p>" + this.switchHTML() + "</div>");
			//
			for (var key in this.wo_primary.associative_xml_relay_domo_tbl)
				$("#container_diag").append("<div class='diag_button item ex alo' data-type='DOMO' data-par='" + this.wo_primary.associative_xml_relay_domo_tbl[key].children("id").text() + "'><p>" + this.wo_primary.associative_xml_relay_domo_tbl[key].children("name").text() + "</p>" + this.switchHTML() + "</div>");
			//
			xml_file_configuration.find("Scenes Scene:not([id='S1']):not([id='S2']):not([id='S3'])").each(function()
			{
				$("#container_diag").append("<div class='diag_button item ex alo' data-type='SCENE' data-par='" + $(this).attr("id").cutBefore("S") + "'><p>" + $(this).attr("desc") + "</p>" + widget_obj.switchHTML() + "</div>");
			});
			//
			this.bindSwitcher();
			$("#container_diag .diag_button[data-type='" + this.wo_primary.events[events_index].type + "'][data-par='" + this.wo_primary.events[events_index].par + "'] .switcher").trigger("switch_state_changer", [["on"]]);
		}
		else if (this.data_identifier === "log_date")
		{
			$("#container_diag").append
			(
				"<div class='diag_button item' data-id='0'>"
			+		"<p class='log_dis'>{LANG_ENABLED}</p>"
			+		this.switchHTML(this.wo_primary.filter_date_ini_flg ? 1 : 0)
			+	"</div>"
			+	"<div class='date_item scrollableSize'>"
			+		"<div class='date_diag label'>{LANG_FROM}"
			+		"</div>"
			+		"<div class='date_diag'>"
			+			"<div class='wrap_tag'><p class='item_tag'>{LANG_WIZARD_DTPICKER_DAY}</p></div>"
			+			"<input type='text' class='item_input date_log' id='day_ini' maxlength='2'/>"
			+		"</div>"
			+		"<div class='date_diag'>"
			+			"<div class='wrap_tag'><p class='item_tag'>{LANG_WIZARD_DTPICKER_MONTH}</p></div>"
			+			"<input type='text' class='item_input date_log' id='month_ini' maxlength='2'/>"
			+		"</div>"
			+		"<div class='date_diag'>"
			+			"<div class='wrap_tag'><p class='item_tag'>{LANG_WIZARD_DTPICKER_YEAR}</p></div>"
			+			"<input type='text' class='item_input date_log' id='year_ini' maxlength='4'/>"
			+		"</div>"
			+	"</div>"
			+	"<div class='diag_button item' data-id='1'>"
			+		"<p class='log_dis'>{LANG_ENABLED}</p>"
			+		this.switchHTML(this.wo_primary.filter_date_end_flg ? 1 : 0)
			+	"</div>"
			+	"<div class='date_item'>"
			+		"<div class='date_diag label'>{LANG_TO}"
			+		"</div>"
			+		"<div class='date_diag'>"
			+			"<div class='wrap_tag'><p class='item_tag'>{LANG_WIZARD_DTPICKER_DAY}</p></div>"
			+			"<input type='text' class='item_input date_log' id='day_end' maxlength='2'/>"
			+		"</div>"
			+		"<div class='date_diag'>"
			+			"<div class='wrap_tag'><p class='item_tag'>{LANG_WIZARD_DTPICKER_MONTH}</p></div>"
			+			"<input type='text' class='item_input date_log' id='month_end' maxlength='2'/>"
			+		"</div>"
			+		"<div class='date_diag'>"
			+			"<div class='wrap_tag'><p class='item_tag'>{LANG_WIZARD_DTPICKER_YEAR}</p></div>"
			+			"<input type='text' class='item_input date_log' id='year_end' maxlength='4'/>"
			+		"</div>"
			+	"</div>"
			);
			//
			if (false)
			{
				var date_log_ini_date_obj = from_timestamp_to_date_obj(this.wo_primary.date_log_ini);
				var date_log_end_date_obj = from_timestamp_to_date_obj(this.wo_primary.date_log_end);
				$("#year_ini").val(get_year_do(date_log_ini_date_obj));
				$("#month_ini").val(get_month_do(date_log_ini_date_obj));
				$("#day_ini").val(get_day_do(date_log_ini_date_obj));
				$("#year_end").val(get_year_do(date_log_end_date_obj));
				$("#month_end").val(get_month_do(date_log_end_date_obj));
				$("#day_end").val(get_day_do(date_log_end_date_obj));
			}
			else
			{
				var date_log_ini_date_arr = from_localdt_to_datacen(this.wo_primary.localdt_ini);
				var date_log_end_date_arr = from_localdt_to_datacen(this.wo_primary.localdt_end);
				$("#year_ini").val(get_year_do(date_log_ini_date_arr));
				$("#month_ini").val(get_month_do(date_log_ini_date_arr));
				$("#day_ini").val(get_day_do(date_log_ini_date_arr));
				$("#year_end").val(get_year_do(date_log_end_date_arr));
				$("#month_end").val(get_month_do(date_log_end_date_arr));
				$("#day_end").val(get_day_do(date_log_end_date_arr));
			}
			//
			this.bindSwitcher();
			//
			$("#container_diag .diag_button[data-id='0'] .switcher").on("toggle_tick_click", function()
			{
				$("#year_ini, #month_ini, #day_ini").prop("disabled", $(this).attr("data-checked") == "0" ? true : false);
				applyKeyboard();
			}).trigger("toggle_tick_click");
			$("#container_diag .diag_button[data-id='1'] .switcher").on("toggle_tick_click", function()
			{
				$("#year_end, #month_end, #day_end").prop("disabled", $(this).attr("data-checked") == "0" ? true : false);
				applyKeyboard();
			}).trigger("toggle_tick_click");
			//
			this.all_tick_flg = false;
			//
			scrollList(this);
		}
		else if (this.data_identifier === "log_event")
		{
			$("#container_diag").append("<div class='diag_button item log_event_i ex alo scrollableSize' data-type='-1'><p>{LANG_DISABLED}</p>" + this.switchHTML() + "</div>");
			xml_file_configuration.find("Logs LogEvents LogEvent").each(function()
			{
				if ($(this).hasAttr("excludeForWeb"))
				{
					if ($(this).attr("excludeForWeb") == "false")
						$("#container_diag").append("<div class='diag_button item log_event_i ex alo' data-type='" + $(this).attr("type") + "'><p>" + $(this).attr("desc") + "</p>" + widget_obj.switchHTML() + "</div>");	
				}
				else
				{
					$("#container_diag").append("<div class='diag_button item log_event_i ex alo' data-type='" + $(this).attr("type") + "'><p>" + $(this).attr("desc") + "</p>" + widget_obj.switchHTML() + "</div>");
				}
			});
			//
			this.bindSwitcher();
			$("#container_diag .diag_button[data-type='" + this.wo_primary.filter_eve_type + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier === "wired")
		{		
			if (this.item_name.indexOf("wired_input") > -1)
			{
				var deac = false;
				if (this.wo_primary.xml_wired_i_tbl[this.data_extra].children("cfg_wire_in_mode").text() == "" + WIRE_N_DISABLED) deac = true;  //_FT_ applicare anche su sil e nice
				$("#container_diag").append("<div class='diag_button item ex alo scrollableSize' data-value='off'><p>{LANG_DISABLED}</p>" + widget_obj.switchHTML(deac ? "1" : "0") + "</div>");
				$("#container_diag").append("<div class='diag_button item ex alo' data-value='on'><p>" + this.wo_primary.xml_wired_i_tbl[this.data_extra].children("name").text() + "</p>" + widget_obj.switchHTML(deac ? "0" : "1") + "</div>");
			}
			else if (this.item_name.indexOf("wired_output") > -1)
			{
				var deac = false;
				if (this.wo_primary.xml_wired_o_tbl[this.data_extra].children("wire_out_mode").text() == "0") deac = true;
				$("#container_diag").append("<div class='diag_button item ex alo scrollableSize' data-value='off'><p>{LANG_DISABLED}</p>" + widget_obj.switchHTML(deac ? "1" : "0") + "</div>");
				$("#container_diag").append("<div class='diag_button item ex alo' data-value='on'><p>"+this.wo_primary.xml_wired_o_tbl[this.data_extra].children("name").text()+"</p>" + widget_obj.switchHTML(deac ? "0" : "1") + "</div>");
			}
			else if (this.item_name.indexOf("wired_key") > -1)
			{
				var deac = false;
				if (this.wo_primary.xml_wired_k_tbl[this.data_extra].children("wire_key_mode").text() == "0") deac = true;
				$("#container_diag").append("<div class='diag_button item ex alo scrollableSize' data-value='off'><p>{LANG_DISABLED}</p>" + widget_obj.switchHTML(deac ? "1" : "0") + "</div>");
				$("#container_diag").append("<div class='diag_button item ex alo' data-value='on'><p>"+this.wo_primary.xml_wired_k_tbl[this.data_extra].children("name").text()+"</p>" + widget_obj.switchHTML(deac ? "0" : "1") + "</div>");
			}
			//
			this.bindSwitcher();
		}
		else if (this.data_identifier === "wired_mode")
		{		
			var mre_list = xml_file_configuration.find("ReleModeRepeatEvents ReleModeRepeatEvent");
			//
			$("#container_diag").append
			(
				"<div class='diag_button item ex alo scrollableSize' data-id='1' data-sec-lbound='1' data-sec-ubound='999' data-sec-def='180'><p>{LANG_RELAY_MONOSTABLE}</p>" + widget_obj.switchHTML() + "</div>"
			+	"<div class='diag_button item ex alo' data-id='2' data-sec-lbound='0' data-sec-ubound='0' data-sec-def='0'><p>{LANG_RELAY_BISTABLE}</p>" + widget_obj.switchHTML() + "</div>"
			);
			mre_list.each(function()
			{
				$("#container_diag").append("<div class='diag_button item ex alo' data-id='" + ($(this).attr("id") - 1 + 3) + "' data-sec-lbound='" + $(this).attr("sec_lbound")+"' data-sec-ubound='"+$(this).attr("sec_ubound") + "' data-sec-def='" + $(this).attr("default") + "'><p>" + $(this).attr("desc") + "</p>" + widget_obj.switchHTML() + "</div>");
			});
			//
			this.bindSwitcher();
			if (this.wo_primary.wire_out_mode == "1")
			{
				$("#container_diag .diag_button[data-id='" + (this.wo_primary.wire_out_mode_repeat_eve - 1 + 3) + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			}
			else if (this.wo_primary.wire_out_mode == "2")
			{
				if (this.wo_primary.wire_out_mode_domo_par == "0")
					$("#container_diag .diag_button[data-id='2'] .switcher").trigger("switch_state_changer", [["on"]]);
				else
					$("#container_diag .diag_button[data-id='1'] .switcher").trigger("switch_state_changer", [["on"]]);
			}
			//
			this.upshot();
		}
		else if (this.data_identifier === "tvcc_list")
		{
			this.wo_primary.tvccs.children("tvcc").each(function()
			{
				if ($(this).children("id").text() != 0)
				{
					$("#container_diag").append("<div class='diag_button item scrollableSize' data-id='" + $(this).attr("id") + "'><p>" + $(this).children("name").text() + "</p>" + widget_obj.switchHTML($(this).children("ena").text()) + "</div>");
				}
			});
			//
			this.bindSwitcher();
			//
			this.upshot();
		}
		else if (this.data_identifier === "wired_pulse")
		{
			$("#container_diag").append("<div class='diag_button item ex alo scrollableSize' data-value='0'><p>{LANG_RELAY_BISTABLE}</p>" + widget_obj.switchHTML() + "</div>");
			$("#container_diag").append("<div class='diag_button item ex alo' data-value='1'><p>{LANG_WIZARD_WIRED_PULSEMODE}</p>" + widget_obj.switchHTML() + "</div>");
			//
			this.bindSwitcher();
			$("#container_diag .diag_button[data-value='" + this.wo_primary.pulse_flg + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier === "triggered_by")
		{
			var mre_list = xml_file_configuration.find("SceneTriggerEvents SceneTriggerEvent");
			//
			mre_list.each(function()
			{
				$("#container_diag").append("<div class='diag_button item scrollableSize ex alo' data-id='" + $(this).attr("id") + "' data-sec-lbound='" + $(this).attr("sec_lbound") + "' data-sec-ubound='" + $(this).attr("sec_ubound") + "' data-sec-def='" + $(this).attr("default") + "'><p>" + $(this).attr("desc") + "</p>" + widget_obj.switchHTML() + "</div>");
			});
			for (var i = 0; i < xml_any_tbl_scenery.length; i++)
			{
				if 
				(
					(
						xml_any_tbl_scenery[i].children("subcategory").text() == WS_DEV_ALARM_IOT_STR
						//|| xml_any_tbl_scenery[i].children("subcategory").text() == WS_DEV_ALARM_THERMOSTAT_STR
					)
					&& xml_any_tbl_scenery[i].children("ena").text() == "1"
				)
					$("#container_diag").append("<div class='diag_button item scrollableSize ex alo' data-id='" + xml_any_tbl_scenery[i].children("id").text() + "'><p>" + xml_any_tbl_scenery[i].children("name").text() + "</p>" + widget_obj.switchHTML() + "</div>");
			}
			//
			this.bindSwitcher();
			$("#container_diag .diag_button[data-id='" + this.wo_primary.triggered_by + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier === "repeaterDeviceList")
		{
			for(var i = 0; i < xml_any_tbl.length; i++)
			{
				var subcategory = xml_any_tbl[i].children("subcategory").text();
				var id = xml_any_tbl[i].children("id").text();
				var ord = xml_any_tbl[i].children("ord").text();
				if
				(
					subcategory == WS_DEV_ALARM_CEN_STR
					|| subcategory == WS_DEV_ALARM_LCD_STR
					|| subcategory == WS_DEV_ALARM_GSM_STR
					|| subcategory == WS_DEV_ALARM_PSTN_STR
					|| subcategory == WS_DEV_ALARM_KBD_STR
					|| subcategory == WS_DEV_ALARM_RFID_STR
					|| subcategory == WS_DEV_ALARM_TVCC_STR
					|| subcategory == WS_DEV_ALARM_REPEATER_STR
					|| subcategory == WS_DEV_ALARM_WIRED_STR
					|| subcategory == WS_DEV_ALARM_RTC_STR
					|| subcategory == WS_DEV_ALARM_POW_STR
					|| subcategory == WS_DEV_ALARM_WIFI_STR
					|| subcategory == WS_DEV_ALARM_TERM_STR
					|| subcategory == WS_DEV_ALARM_BAT_STR
					|| subcategory == WS_DEV_ALARM_CARRIER_STR
					|| subcategory == WS_DEV_ALARM_CLOUD_STR
					|| subcategory == WS_DEV_ALARM_TELEGEST_STR
					|| subcategory == WS_DEV_ALARM_DASH_STR
					|| subcategory == WS_DEV_ALARM_AVE_AUTOMATION_STR
					|| subcategory == WS_DEV_ALARM_IOT_STR
					|| subcategory == WS_DEV_ALARM_THERMOSTAT_STR
					|| ord > 0
					|| this.wo_primary.devList.children("dev[id='"+id+"']").length == 0
				)
				;
				else
					$("#container_diag").append("<div class='diag_button item scrollableSize' data-id='" + xml_any_tbl[i].children("id").text() + "'><p>" + xml_any_tbl[i].children("name").text() + "</p>" + widget_obj.switchHTML() + "</div>");
			}
			//
			this.bindSwitcher();
			this.wo_primary.devList.children("dev").each(function()
			{
				if ($(this).attr("selected") == "1")
					$("#container_diag .diag_button[data-id='" + $(this).attr("id") + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			});
			//
			this.upshot();
		}
		else if (this.data_identifier === "rem_mode")
		{
			for (var key in this.wo_primary.remToggleId)
				$("#container_diag").append("<div class='diag_button item ex alo scrollableSize' data-id='" + key + "'><p>" + this.wo_primary.remToggleId[key].tag + "</p>" + this.switchHTML() + "</div>");
			//
			$(".widget_diag").append("<div class='rem_btn_img'><div id='rem_btn_img_" + this.item_name + "'></div></div>");
			//
			this.bindSwitcher();
			//
			var gui_data_id = "-1";
			if (this.wo_primary.guiRemId[this.item_name].change_flg) // se il valore è già cambiato viene caricato dalla memoria altrimenti dalla trama salvata in centrale
				gui_data_id = this.wo_primary.guiRemId[this.item_name].save_type;
			else
				gui_data_id = this.wo_primary.xml_any.find("keys key[id='" + this.wo_primary.guiRemId[widget_obj.item_name].trama_idx + "'] type").text();
			//
			$("#container_diag .diag_button[data-id='" + gui_data_id + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier === "rem_autom")
		{
			for (var i = 0; i < 6; i++)
				$("#container_diag").append("<div class='diag_button item ex alo scrollableSize' data-id='" + i + "'><p>" + "{LANG_REM_AUTOMATION}" + " " + (i + 1) + "</p>" + this.switchHTML() + "</div>");
			//
			var gui_data_id = "-1";
			if (this.wo_primary.guiRemId[this.item_name].change_flg) // se il valore è già cambiato viene caricato dalla memoria altrimenti dalla trama salvata in centrale
			{
				if (this.wo_primary.remToggleId[this.wo_primary.guiRemId[this.item_name].save_type].mode == REM_MODE_4)
					gui_data_id = this.wo_primary.guiRemId[this.item_name].save_par;
			}
			else
			{
				var remToggleIdObj = this.wo_primary.remToggleId[this.wo_primary.xml_any.find("keys key[id='" + this.wo_primary.guiRemId[this.item_name].trama_idx + "'] type").text()];
				if (remToggleIdObj != null && remToggleIdObj.mode == REM_MODE_4)
					gui_data_id = this.wo_primary.xml_any.find("keys key[id='" + this.wo_primary.guiRemId[this.item_name].trama_idx + "'] par").text();
			}
			//
			this.bindSwitcher();
			$("#container_diag .diag_button[data-id='" + gui_data_id + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier === "rem_domo")
		{
			for (var key in this.wo_primary.associative_xml_relay_domo_tbl)
				$("#container_diag").append("<div class='diag_button item ex alo scrollableSize' data-id='" + this.wo_primary.associative_xml_relay_domo_tbl[key].children("id").text() + "'><p>" + this.wo_primary.associative_xml_relay_domo_tbl[key].children("name").text() + "</p>" + this.switchHTML() + "</div>");			
			//
			var gui_data_id = "-1";
			if (this.wo_primary.guiRemId[this.item_name].change_flg) // se il valore è già cambiato viene caricato dalla memoria altrimenti dalla trama salvata in centrale
			{
				if (this.wo_primary.remToggleId[this.wo_primary.guiRemId[this.item_name].save_type].mode == REM_MODE_2)
					gui_data_id = this.wo_primary.guiRemId[this.item_name].save_par;	 	
			}
			else
			{
				var remToggleIdObj = this.wo_primary.remToggleId[this.wo_primary.xml_any.find("keys key[id='" + this.wo_primary.guiRemId[this.item_name].trama_idx + "'] type").text()];
				if (remToggleIdObj != null && remToggleIdObj.mode == REM_MODE_2)
					gui_data_id = this.wo_primary.xml_any.find("keys key[id='" + this.wo_primary.guiRemId[this.item_name].trama_idx + "'] par").text();
			}
			//
			this.bindSwitcher();
			$("#container_diag .diag_button[data-id='" + gui_data_id + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier === "rem_scene")
		{
			xml_file_configuration.find("Scenes Scene:not([id='S1']):not([id='S2']):not([id='S3'])").each(function()
			{
				$("#container_diag").append("<div class='diag_button item ex alo scrollableSize' data-id='" + $(this).attr("id").cutBefore("S") + "' data-checked='0'><p>" + $(this).attr("desc") + "</p>" + widget_obj.switchHTML() + "</div>");
			});
			//
			var gui_data_id = "-1";
			if (this.wo_primary.guiRemId[this.item_name].change_flg) // se il valore è già cambiato viene caricato dalla memoria altrimenti dalla trama salvata in centrale
			{
				if (this.wo_primary.remToggleId[this.wo_primary.guiRemId[this.item_name].save_type].mode == REM_MODE_3)
					gui_data_id = this.wo_primary.guiRemId[this.item_name].save_par;	 	
			}
			else
			{
				var remToggleIdObj = this.wo_primary.remToggleId[this.wo_primary.xml_any.find("keys key[id='" + this.wo_primary.guiRemId[this.item_name].trama_idx + "'] type").text()];
				if (remToggleIdObj != null && remToggleIdObj.mode == REM_MODE_3)
					gui_data_id = this.wo_primary.xml_any.find("keys key[id='" + this.wo_primary.guiRemId[this.item_name].trama_idx + "'] par").text();
			}
			//
			this.bindSwitcher();
			$("#container_diag .diag_button[data-id='" + gui_data_id + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier === "region")
		{
			var region_button_id = [];
			var region_button_desc = [];
			var xml_region_path = "regions region";
			if (this.wo_primary.xml_any.children("subcategory").text() == WS_DEV_ALARM_PSTN_STR)
				xml_region_path = "PstnCountries PstnCountry";
			xml_file_configuration.find(xml_region_path).each(function(index)
			{
				region_button_desc[index] = $(this).attr("desc");
				region_button_id[index] = $(this).attr("id");
			});
			this.wo_primary.item_button_sort(region_button_desc, region_button_id);
			for (var i = 0; i < region_button_desc.length; i++)
			{
				$("#container_diag").append("<div class='diag_button item ex alo scrollableSize' data-id='" + region_button_id[i] + "'><p>" + region_button_desc[i] + "</p>" + widget_obj.switchHTML() + "</div>");
			}
			//
			this.bindSwitcher();
			$("#container_diag .diag_button[data-id='" + this.wo_primary.local_region_pstn + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier === "address_mode")
		{
			$("#container_diag").append
			(
				"<div class='diag_button item ex alo scrollableSize' data-id='0'><p>{LANG_TVCC_MAC}</p>" + widget_obj.switchHTML() + "</div>"
			+	"<div class='diag_button item ex alo' data-id='1'><p>{LANG_TVCC_IP}</p>" + widget_obj.switchHTML() + "</div>"
			);
			//
			this.bindSwitcher();
			//
			var addrm = Number(this.wo_primary.xml_any.children("ip_address_mode_flg").text());
			if (addrm == 0)
				$("#container_diag .diag_button[data-id='" + 0 + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			else if (addrm == 1)
				$("#container_diag .diag_button[data-id='" + 1 + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier === "bus_node_list")
		{
			var dev_idx = Number(this.data_extra);
			var xml_any_o = xml_any_tbl[dev_idx];
			var node_dev_num_ub = NODE_DEV_OTHER_UB;
			var node_dev_num_lb = NODE_DEV_OTHER_LB;
			var wire_type = xml_any_o.children("wire_type").text();
			if (wire_type == "1") //in
			{
				node_dev_num_ub = NODE_DEV_WIRE_IN_UB;
				node_dev_num_lb = NODE_DEV_WIRE_IN_LB;
			}
			else if (wire_type == "5") //out
			{
				node_dev_num_ub = NODE_DEV_WIRE_OUT_UB;
				node_dev_num_lb = NODE_DEV_WIRE_OUT_LB;
			}
			//
			$("#container_diag").append
			(
				"<div class='diag_button item ex alo scrollableSize' data-id='0'><p>{LANG_ITEM_NONE}</p>" + widget_obj.switchHTML() + "</div>"
			);
			for(var i = node_dev_num_lb; i <= node_dev_num_ub; i++)
			{
				var node_label = "";
				var nodeState = 0;
				var node_disabled_flg = false;
				//
				if (node_dev_tbl[i] != -1)
				{
					nodeState = 1;
					if (node_dev_tbl[i] != dev_idx)
					{
						node_disabled_flg = true;
						node_label = " - " + xml_any_tbl[node_dev_tbl[i]].children("name").text();
					}
				}
				//
				$("#container_diag").append
				(
					"<div class='diag_button item ex alo' data-id='" + i + "'><p>" + i + node_label + "</p>" + widget_obj.switchHTML(nodeState, node_disabled_flg) + "</div>"
				);
			}
			//
			this.bindSwitcher();
			//
			$("#container_diag .diag_button[data-id='" + xml_any_o.children("bus_node").text() + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier === "dev_ala_eve")
		{
			var ala_eve_msk_idx = Number(this.data_extra);
			//
			for (var i = 0; i < widget_obj.wo_primary.ala_eve_state_str.length; i++)
			{
				var elem = $("<div class='diag_button item ex alo scrollableSize'><p>" + widget_obj.wo_primary.ala_eve_state_str[i] + "</p>" + widget_obj.switchHTML(Number(widget_obj.wo_primary.ala_eve_msk[ala_eve_msk_idx]) == i ? "1" : "0") + "</div>").appendTo("#container_diag");
				elem.data("dev_ala_eve_st_val", i);
			}
			//
			this.bindSwitcher();
			//
			this.upshot();
		}
		else if (this.data_identifier === "conc_bus")
		{
			var on = false;
			if (this.wo_primary.xml_bus_conc_tbl[this.data_extra].children("child_valid").text() == "1") on = true;
			$("#container_diag").append("<div class='diag_button item btt ex alo scrollableSize' data-value='off'><p>{LANG_DISABLED}</p>" + widget_obj.switchHTML(on ? "0" : "1") + "</div>");
			$("#container_diag").append("<div class='diag_button item btt ex alo scrollableSize' data-value='on'><p>" + this.wo_primary.xml_bus_conc_tbl[Number(this.data_extra)].children("name").text() + "</p>" + widget_obj.switchHTML(on ? "1" : "0") + "</div>");
			//
			this.bindSwitcher();
			//
			this.upshot();
		}
		else if (this.data_identifier === "input_bus")
		{
			var on = false;
			if (this.wo_primary.xml_bus_input_tbl[this.data_extra].children("child_valid").text() == "1") on = true;
			$("#container_diag").append("<div class='diag_button item btt ex alo scrollableSize' data-value='off'><p>{LANG_DISABLED}</p>" + widget_obj.switchHTML(on ? "0" : "1") + "</div>");
			$("#container_diag").append("<div class='diag_button item btt ex alo scrollableSize' data-value='on'><p>" + this.wo_primary.xml_bus_input_tbl[this.data_extra].children("name").text() + "</p>" + widget_obj.switchHTML(on ? "1" : "0") + "</div>");
			//
			this.bindSwitcher();
			//
			this.upshot();
		}
		else if (this.data_identifier === "mode_bus_rf")
		{
			$("#container_diag").append("<div class='diag_button item btt ex alo s_shift' data-id='" + DELAYED + "'><p>" + this.wo_primary.mode_bus_rf_label[DELAYED] + "</p>" + widget_obj.switchHTML() + "</div>");
			if (this.caller_name == "widget_mod_device_bus_senrf")
			{
				$("#container_diag").append("<div class='diag_button item btt ex alo s_shift' data-id='" + ALA_MODE_SIR + "'><p>" + this.wo_primary.mode_bus_rf_label[ALA_MODE_SIR] + "</p>" + widget_obj.switchHTML() + "</div>");
//				$("#container_diag").append("<div class='diag_button item btt ex alo s_shift' data-id='" + MATCH_DEV + "'><p>" + this.wo_primary.mode_bus_rf_label[MATCH_DEV] + "</p>" + widget_obj.switchHTML() + "</div>");
//				$("#container_diag").append("<div class='diag_button item btt ex alo s_shift' data-id='" + MATCH_AREA + "'><p>" + this.wo_primary.mode_bus_rf_label[MATCH_AREA] + "</p>" + widget_obj.switchHTML() + "</div>");
				$("#container_diag").append("<div class='diag_button item btt ex alo s_shift' data-id='" + ALA_MODE_M + "'><p>" + this.wo_primary.mode_bus_rf_label[ALA_MODE_M] + "</p>" + widget_obj.switchHTML() + "</div>");
				$("#container_diag").append("<div class='diag_button item btt ex alo s_shift' data-id='" + ALA_MODE_R + "'><p>" + this.wo_primary.mode_bus_rf_label[ALA_MODE_R] + "</p>" + widget_obj.switchHTML() + "</div>");
				$("#container_diag").append("<div class='diag_button item btt ex alo s_shift' data-id='" + ALA_MODE_P + "'><p>" + this.wo_primary.mode_bus_rf_label[ALA_MODE_P] + "</p>" + widget_obj.switchHTML() + "</div>");
			}
			else if 
			(
				this.caller_name == "widget_mod_device_wired_i"
				|| this.caller_name == "widget_mod_device_bus_input_s"
			)
			{
				$("#container_diag").append("<div class='diag_button item btt ex alo s_shift' data-id='" + ALA_MODE_R + "'><p>" + this.wo_primary.mode_bus_rf_label[ALA_MODE_R] + "</p>" + widget_obj.switchHTML() + "</div>");
				$("#container_diag").append("<div class='diag_button item btt ex alo s_shift' data-id='" + ALA_MODE_P + "'><p>" + this.wo_primary.mode_bus_rf_label[ALA_MODE_P] + "</p>" + widget_obj.switchHTML() + "</div>");
			}
			$("#container_diag").append("<div class='diag_button item btt ex alo s_shift' data-id='" + ALA_MODE_T + "'><p>" + this.wo_primary.mode_bus_rf_label[ALA_MODE_T] + "</p>" + widget_obj.switchHTML() + "</div>");
			//
			this.bindSwitcher();
			if (this.wo_primary.mode_bus_rf == MATCH_DEV || this.wo_primary.mode_bus_rf == MATCH_AREA)
				$("#container_diag .diag_button[data-id='" + DELAYED + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			else
				$("#container_diag .diag_button[data-id='" + this.wo_primary.mode_bus_rf + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier === "season_pass")
		{
			var season_pass_str = ["{LANG_THERMO_SUMMER}", "{LANG_THERMO_WINTER}"];
			for (var i = 0; i < season_pass_str.length; i++)
				$("#container_diag").append("<div class='diag_button item ex alo scrollableSize' data-id='" + i + "'><p>" + season_pass_str[i] + "</p>" + this.switchHTML() + "</div>");
			//
			this.bindSwitcher();
			$("#container_diag .diag_button[data-id='" + this.wo_primary.season_pass + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier === "theme_pass")
		{
			for (var i = 0; i < this.wo_primary.theme_pass_str.length; i++)
				$("#container_diag").append("<div class='diag_button item ex alo scrollableSize' data-id='" + i + "'><p>" + this.wo_primary.theme_pass_str[i] + "</p>" + this.switchHTML() + "</div>");
			//
			this.bindSwitcher();
			$("#container_diag .diag_button[data-id='" + this.wo_primary.theme_pass_local + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		else if (this.data_identifier === "theme_pass2")
		{
			for (var i = 0; i < this.wo_primary.theme_pass_str.length; i++)
				$("#container_diag").append("<div class='diag_button item ex alo scrollableSize' data-id='" + i + "'><p>" + this.wo_primary.theme_pass_str[i] + "</p>" + this.switchHTML() + "</div>");
			//
			this.bindSwitcher();
			$("#container_diag .diag_button[data-id='" + this.wo_primary.theme_pass_local_web + "'] .switcher").trigger("switch_state_changer", [["on"]]);
			//
			this.upshot();
		}
		//**end container
		//***********
		//
		//all_tick switch
		if (this.all_tick_flg && !quick_select && $("#container_diag .diag_button:not(.ex)").length > 0 && !this.max_selection_flg)
		{
			global_switcher_binder(".widget_diag", "wd_tick", null, "0", null);
			//
			function all_tick_func()
			{
				if ($("#container_diag .diag_button:not(.ex) .switcher[data-checked='1']").length == $("#container_diag .diag_button:not(.ex)").length)
				{
					$(".widget_diag .wd_tick").trigger("switch_state_changer", [["on"], true]);
				}
				else
				{
					$(".widget_diag .wd_tick").trigger("switch_state_changer", [["off"], true]);
				}
			}
			//
			$(".widget_diag .wd_tick").on("toggle_tick_click", function()
			{
				if ($(this).attr("data-checked") == "1")
				{
					$("#container_diag .diag_button:not(.ex) .switcher:not(.disabled)").trigger("switch_state_changer", [["on"], true]);
					//
					$("#container_diag .diag_button.ex .switcher, #container_diag .diag_button.alo .switcher").first().trigger("switch_state_changer", [["off"], true]);
				}
				else
				{
					$("#container_diag .diag_button:not(.ex) .switcher:not(.disabled)").trigger("switch_state_changer", [["off"], true]);
					//
					$("#container_diag .diag_button.ex .switcher").trigger("switch_state_changer", [["on"], true]);
				}
			});
			$("#container_diag .diag_button:not(.ex)").on("toggle_tick_click", function()
			{
				all_tick_func();
			}).trigger("toggle_tick_click");
		}
		else
		{
			$("#wd_tick").hide();
		}
		//
		//
		$("#ok_diag").click(function()
		{
			widget_obj.diag_ena_save = true; //resetta diag_ena_save
			widget_obj.par_save();
		}).children(".ok_diag_btn_inside").removeClass("disabled");
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
		xml_any_tmp = null;
		//
		$(this.diag_container).hide();
		$(".home "+this.diag_container).removeClass("full_scr");
	},
	//
	name: "widget_diag",
	data_identifier: $(".widget_diag").attr("data-identifier"),
	container: $(".widget_diag").attr("data-container"),
	caller_name: $(".widget_diag").attr("data-widget"),
	wo_primary: pag_table_new[$(".widget_diag").attr("data-widget")],
	item_name: $(".widget_diag").attr("data-item-name"),
	max_selection_flg: null,
	data_extra: $(".widget_diag").attr("data-extra"),
	diag_ena_save: true,
	all_tick_flg: true,
	tick_flg: true,
	diag_container: ".JSdialog",
	diag_title: $(".widget_diag").attr("data-title").toLowerCase().replace("<br>", " ").toUpperCase(),
	scrollControllers: {up: "#arrow_up", down: "#arrow_down"},
	scrollOffset: 0,
	//
	par_save: function()
	{
		var widget_obj = this;
		//
		if (this.data_identifier === "not_ena")
		{
			$("#container_diag .item .switcher").each(function()
			{
				widget_obj.wo_primary.xml_any_tbl_parcen_bkp[$(this).parent().attr("data-index")].children("ena").text(1 - $(this).attr("data-checked"));
			});
			//
			if ($("#container_diag .item .switcher[data-checked='1']").length > 0)
				$(this.container + " .not_ena .sl_selector").html("{LANG_ITEM_AT_LEAST_ONE}");
			else
				$(this.container + " .not_ena .sl_selector").html("{LANG_ITEM_NONE}");
		}
		if (this.data_identifier === "and_match")
		{
			this.wo_primary.and_match = $("#container_diag .diag_button .switcher[data-checked='1']").parent().attr("data-id");
			if (this.wo_primary.and_match == 0)
				$(this.container + " .and_match .sl_selector").html("{LANG_WIZARD_AND_MATCH_ITEM_OR}");
			else
				$(this.container + " .and_match .sl_selector").html("{LANG_WIZARD_AND_MATCH_ITEM_AND}");
		}
		else if (this.data_identifier === "auth")
		{
			var checkedOne = $("#container_diag .diag_button .switcher[data-checked='1']");
			if (checkedOne.length > 0)
			{
				this.wo_primary.auth = checkedOne.parent().attr("data-auth");
				$(this.container + " .auth .sl_selector").html(checkedOne.parent().attr("name"));
				if (this.wo_primary.auth == "0")
					$("#web_client_password, #ap_web_password").parent().addClass("invisible");
				else
					$("#web_client_password, #ap_web_password").parent().removeClass("invisible");
			}
		}
		else if (this.data_identifier === "time_zone")
		{
			this.wo_primary.utc_value = $("#container_diag .diag_button .switcher[data-checked='1']").parent().attr("data-value");
			$(this.container + " .time_zone .sl_selector").html($("#container_diag .diag_button .switcher[data-checked='1']").siblings("p").text());
			//
			this.wo_primary.only_dst_tzone = true;
			global_send_dev_mod_save(this.wo_primary, false);
		}
		else if (this.data_identifier === "filter_area")
		{
			filter_area = [];
			$("#container_diag .item .switcher[data-checked='1']").each(function()
			{
				filter_area.push($(this).parent().attr("data-value"));
			});
			//
			this.wo_primary.filter_dev();
		}
		else if (this.data_identifier === "filter_room")
		{
			filter_room = [];
			$("#container_diag .item .switcher[data-checked='1']").each(function()
			{
				filter_room.push($(this).parent().attr("data-value"));
			});
			//
			this.wo_primary.filter_dev();
		}
		else if (this.data_identifier === "filter_type")
		{
			filter_type = [];
			$("#container_diag .item .switcher[data-checked='1']").each(function()
			{
				filter_type.push($(this).parent().attr("data-value"));
			});
			//
			this.wo_primary.filter_dev();
		}
		else if (this.data_identifier === "region_conn")
		{
			$(this.container + " .region_conn .sl_selector").html($("#container_diag .diag_button .switcher[data-checked='1']").siblings("p").text());
			$(this.container + " .region_conn").attr("data-value", $("#container_diag .diag_button .switcher[data-checked='1']").parent().attr("data-value"));
		}
		else if (this.data_identifier === "and_function_dev")
		{
			$(this.container + " .and_function_dev .sl_selector").html($("#container_diag .diag_button .switcher[data-checked='1']").siblings("p").text());
			and_function_dev = $("#container_diag .diag_button .switcher[data-checked='1']").parent().attr("data-id");
			$(this.container + " .and_function_dev").trigger("ok_diag");
		}
		else if (this.data_identifier === "gsm_priority")
		{
			$(this.container + " .gsm_priority .sl_selector").html($("#container_diag .diag_button .switcher[data-checked='1']").siblings("p").text());
			this.wo_primary.gsm_priority = $("#container_diag .diag_button .switcher[data-checked='1']").parent().attr("data-id");
		}
		else if (this.data_identifier === "phy_mode")
		{
			if ($("#container_diag .item .switcher[data-checked='1']").length > 0)
			{
				var sel_item = $("#container_diag .item .switcher[data-checked='1']").parent();
				this.wo_primary.phy_mode = sel_item.attr("data-id");
				if (sel_item.hasClass("en50131"))
					$(this.container + " .phy_mode .sl_selector").addClass("red");
				else
					$(this.container + " .phy_mode .sl_selector").removeClass("red");
				$(this.container + " .phy_mode .sl_selector").html(sel_item.children("p").html());
				//
				if (this.wo_primary.phy_mode == this.wo_primary.NC_CONTAIMPULSI || this.wo_primary.phy_mode == this.wo_primary.NC_BILANCIATO_CONTAIMPULSI)
				{
					this.wo_primary.force_to_open = true;
					$(this.container+" .reed").addClass("disabled");
					$(this.container+" .reed .roc").css("color", "rgba(255,255,255,1)");
					$(this.container+" .reed .roc").attr("data-checked", "0");
					$(this.container+" .reed .roc.open_close").attr("data-checked", "1");
					$(this.container+" .impulse").removeClass("disabled");
				}
				else
				{
					this.wo_primary.force_to_open = false;
					$(this.container+" .reed").removeClass("disabled");
					$(this.container+" .reed .roc[data-checked='0']").css("color", "rgba(255,255,255,0.4)");
					$(this.container+" .reed .open[data-checked='1']").css("color", "rgba(255,0,0,1)");
					$(this.container+" .reed .open_close[data-checked='1']").css("color", "rgba(255,255,255,1)");
					$(this.container+" .impulse").addClass("disabled");
				}
			}
		}
		else if (this.data_identifier === "user_events")
		{
			$("#container_diag .item .switcher").each(function()
			{
				var index = Number($(this).parent().attr("data-value"));
				//
				if ($(this).attr("data-checked") === "1")
					widget_obj.wo_primary.local_msk = widget_obj.wo_primary.local_msk.replaceAt(index, String.fromCharCode(65 + index));
				else
					widget_obj.wo_primary.local_msk = widget_obj.wo_primary.local_msk.replaceAt(index, "-");
			});
			//
			var evetype = this.data_extra;
			if (evetype === "vox")
			{
				this.wo_primary.vox_msk = this.wo_primary.local_msk;
				//
				if ((this.wo_primary.vox_msk.match(new RegExp("-", "g")) || []).length === this.wo_primary.vox_msk.length)
					$("#container_mod_user .events[data-evetype='vox'] .sl_selector").html("{LANG_ITEM_NONE}");
				else
					$("#container_mod_user .events[data-evetype='vox'] .sl_selector").html("{LANG_ITEM_AT_LEAST_ONE}");
			}
			else if (evetype === "sms")
			{
				this.wo_primary.sms_msk = this.wo_primary.local_msk;
				//
				if ((this.wo_primary.sms_msk.match(new RegExp("-", "g")) || []).length === this.wo_primary.sms_msk.length)
					$("#container_mod_user .events[data-evetype='sms'] .sl_selector").html("{LANG_ITEM_NONE}");
				else
					$("#container_mod_user .events[data-evetype='sms'] .sl_selector").html("{LANG_ITEM_AT_LEAST_ONE}");
			}
			else if (evetype === "push")
			{
				this.wo_primary.cloud_push_msk = this.wo_primary.local_msk;
				//
				if ((this.wo_primary.cloud_push_msk.match(new RegExp("-", "g")) || []).length === this.wo_primary.cloud_push_msk.length)
					$(widget_obj.container + " .events[data-evetype='push'] .sl_selector").html("{LANG_ITEM_NONE}");
				else
					$(widget_obj.container + " .events[data-evetype='push'] .sl_selector").html("{LANG_ITEM_AT_LEAST_ONE}");
			}
		}
		else if (this.data_identifier === "notification")
		{
			var trovato = false;
			var guiId = this.data_extra;
			$("#container_diag .diag_button .switcher[data-checked='1']").each(function()
			{
				trovato = true;
				widget_obj.wo_primary.notifyStruct[guiId].events[$(this).parent().attr("data-id")].ena = "1";
				if (xml_file_configuration.find("VigEvents VigEvent[id='" + $(this).parent().attr("data-id") + "']").attr("area_select") == "true")
					widget_obj.wo_primary.notifyStruct[guiId].events[$(this).parent().attr("data-id")].areas = area_on_all_str;
			});
			//
			$(this.container + " .vig[data-id=" + guiId + "] ." + this.data_identifier + " .sl_selector").html(trovato ? "{LANG_ITEM_AT_LEAST_ONE}" : "{LANG_DISABLED}");
			//
			$("#container_diag .diag_button .switcher[data-checked='0']").each(function()
			{
				widget_obj.wo_primary.notifyStruct[guiId].events[$(this).parent().attr("data-id")].ena = "0";
				if (xml_file_configuration.find("VigEvents VigEvent[id='" + $(this).parent().attr("data-id") + "']").attr("area_select") == "true")
					widget_obj.wo_primary.notifyStruct[guiId].events[$(this).parent().attr("data-id")].areas = area_off_all_str;
			});
		}
		else if (this.data_identifier === "transmission")
		{
			var guiId = this.data_extra;
			//
			widget_obj.wo_primary.notifyStruct[guiId].invFlag = $("#container_diag .diag_button .switcher[data-checked='1']").parent().attr("data-id");
			$(this.container + " .vig[data-id=" + guiId + "] ." + this.data_identifier + " .sl_selector").html(widget_obj.wo_primary.notifyStruct[guiId].invFlag == 0 ? "{LANG_DIRECT}" : "{LANG_INVERSE}");
		}
		else if (this.data_identifier === "tcpudp")
		{
			var guiId = this.data_extra;
			//
			widget_obj.wo_primary.notifyStruct[guiId].udpFlag = $("#container_diag .diag_button .switcher[data-checked='1']").parent().attr("data-id");
			$(this.container + " .vig[data-id=" + guiId + "] ." + this.data_identifier + " .sl_selector").html(widget_obj.wo_primary.notifyStruct[guiId].udpFlag == 0 ? "{LANG_TCP}" : "{LANG_UDP}");
		}
		else if (this.data_identifier === "prot")
		{
			var guiId = this.data_extra;
			//
			if (widget_obj.wo_primary.aeskey_check_diag($(this.container + " .vig[data-id=" + guiId + "] .aeskey_val").val()))
			{
				$(this.container + " .vig[data-id=" + guiId + "] .aeskey_val").removeClass("fault");
				//
				widget_obj.wo_primary.notifyStruct[guiId].prot = $("#container_diag .diag_button .switcher[data-checked='1']").parent().attr("data-id");
				$(this.container + " .vig[data-id=" + guiId + "] ." + this.data_identifier + " .sl_selector").html(widget_obj.wo_primary.notifyStruct[guiId].prot == "2" ? "{LANG_SIA_ADEM_CID}" : "{LANG_SIA_DCS}");
				//
				if (widget_obj.wo_primary.notifyStruct[guiId].prot == "2")
				{
					$(this.container + " .vig[data-id=" + guiId + "] .transmission").removeClass("unavailable");
					$(this.container + " .vig[data-id=" + guiId + "] .aeskey").addClass("hider");
				}
				else
				{
					$(this.container + " .vig[data-id=" + guiId + "] .transmission").addClass("unavailable");
					$(this.container + " .vig[data-id=" + guiId + "] .aeskey").removeClass("hider");
				}
			}
			else
			{
				$(this.container + " .vig[data-id=" + guiId + "] .aeskey_val").addClass("fault");
			}
		}
		else if (this.data_identifier === "mode_alarm")
		{
			//salvataggio e dipendenze varie
			var item_selected = $("#container_diag .diag_button .switcher[data-checked='1']").parent();
			if (item_selected.attr("data-id") < 4)
			{
				this.wo_primary.cfg_relay_mode = item_selected.attr("data-id");
				$(this.container + " .mode_alarm .sl_selector").html($("p:first", item_selected).text());
				this.wo_primary.mode = "2";
				//
				if (item_selected.attr("data-sec-def") == "0")
				{
					$(this.container + " .timing").addClass("disabled");
					$(this.container + " .pick_timing").text("0");
				}
				else
				{
					$(this.container + " .timing").removeClass("disabled");
				}
				//
				if (item_selected.attr("data-id") == 1)
				{
					$(this.container + " .pick_timing").text(this.wo_primary.mode_domo_mono_sec);
				}
				else if (item_selected.attr("data-id") == 2)
				{
					//
				}
				else if (item_selected.attr("data-id") == 3)
				{
					$(this.container + " .pick_timing").text(this.wo_primary.mode_domo_blind_sec);
				}
				$(this.container + " .pick_timing").attr("data-lbound", item_selected.attr("data-sec-lbound"));//modifica dei bounds del picker temporizzazione
				$(this.container + " .pick_timing").attr("data-rbound", item_selected.attr("data-sec-ubound"));
				//
				$(this.container + " .abilitation").removeClass("disabled");
				//
				$(this.container + " .trigger_relay .sl_selector").html("{LANG_NO_SETUP}");
				$(this.container + " .trigger_relay").removeClass("disabled");
				if (item_selected.attr("data-id") == 3)
					$(this.container + " .trigger_relay").addClass("disabled");
				this.wo_primary.mode_domo_sen_a_id = "0";
				this.wo_primary.mode_domo_sen_b_id = "0";
				this.wo_primary.mode_domo_sen_c_id = "0";
			}
			else
			{
				this.wo_primary.mode_repeat_eve = item_selected.attr("data-id") - 3;
				$(this.container + " .mode_alarm .sl_selector").html($("p:first", item_selected).text());
				this.wo_primary.mode = "1";
				//
				$(this.container + " .pick_timing").text(item_selected.attr("data-sec-def"));
				this.wo_primary.mode_repeat_par = item_selected.attr("data-sec-def");
				if (item_selected.attr("data-sec-def") == 0)
				{
					$(this.container + " .timing").addClass("disabled");
				}
				else
				{
					$(this.container + " .timing").removeClass("disabled");
					//
					var lb = xml_file_configuration.find("ReleModeRepeatEvents ReleModeRepeatEvent[id='" + this.wo_primary.mode_repeat_eve + "']").attr("sec_lbound");
					var ub = xml_file_configuration.find("ReleModeRepeatEvents ReleModeRepeatEvent[id='" + this.wo_primary.mode_repeat_eve + "']").attr("sec_ubound");
					$(this.container + " .pick_timing").attr("data-lbound", lb);
					$(this.container + " .pick_timing").attr("data-rbound", ub);
				}
				//
				$(this.container + " .abilitation .sl_selector").html("{LANG_RELAY_NO_ENABLED}");
				$(this.container + " .abilitation").addClass("disabled");
				this.wo_primary.mode_domo_sen_trigger_id = 0;
				//
				$(this.container + " .trigger_relay").addClass("disabled");
				//
				if (item_selected.attr("data-sec-lbound") == "0" && item_selected.attr("data-sec-ubound") == "0")
					this.wo_primary.cfg_relay_mode = "2";
				else
					this.wo_primary.cfg_relay_mode = "1";
			}
		}
		else if (this.data_identifier === "abilitation")
		{
			var item_selected = $("#container_diag .diag_button .switcher[data-checked='1']").parent();
			this.wo_primary.mode_domo_sen_trigger_id = item_selected.attr("data-id");
			$(this.container + " .abilitation .sl_selector").html($("p:first", item_selected).text());
		}
		else if (this.data_identifier === "trigger_relay")
		{
			var item_selected = [];
			for (var i = 0; i < $("#container_diag .diag_button .switcher[data-checked='1']").length; i++)
				item_selected[i] = $("#container_diag .diag_button .switcher[data-checked='1']").eq(i).parent();
			//
			if (item_selected.length == 1)
			{
				this.wo_primary.mode_domo_sen_a_id = item_selected[0].attr("data-id");
				this.wo_primary.mode_domo_sen_b_id = "0";
				this.wo_primary.mode_domo_sen_c_id = "0";
				//
				if (this.wo_primary.mode_domo_sen_a_id == "0")
					$(this.container+" .trigger_relay .sl_selector").html("{LANG_NO_SETUP}");
				else
					$(this.container+" .trigger_relay .sl_selector").html("{LANG_ITEM_AT_LEAST_ONE}");
			}
			else if (item_selected.length == 2)
			{
				this.wo_primary.mode_domo_sen_a_id = item_selected[0].attr("data-id");
				this.wo_primary.mode_domo_sen_b_id = item_selected[1].attr("data-id");
				this.wo_primary.mode_domo_sen_c_id = "0";
				//
				$(this.container+" .trigger_relay .sl_selector").html("{LANG_ITEM_AT_LEAST_ONE}");
			}
			else if (item_selected.length == 3)
			{
				this.wo_primary.mode_domo_sen_a_id = item_selected[0].attr("data-id");
				this.wo_primary.mode_domo_sen_b_id = item_selected[1].attr("data-id");
				this.wo_primary.mode_domo_sen_c_id = item_selected[2].attr("data-id");
				//
				$(this.container+" .trigger_relay .sl_selector").html("{LANG_ITEM_AT_LEAST_ONE}");
			}
		}
		else if (this.data_identifier === "real_relay")
		{
			var item_selected = $("#container_diag .diag_button .switcher[data-checked='1']").parent();
			this.wo_primary.cfg_relay_cfm_exe_ext = item_selected.attr("data-id");
			$(this.container + " .real_relay .sl_selector").html($("p:first", item_selected).text());
		}
		else if (this.data_identifier === "diag_areas")
		{
			var widget_obj = this;
			var area_type = this.data_extra;
			//
			var area_array = [];
			if (area_type == "INS")
				area_array = this.wo_primary.area_ins;
			else if (area_type == "DIS")
				area_array = this.wo_primary.area_dis;
			else if (area_type == "INSP")
				area_array = this.wo_primary.area_insp;
			//
			$("#container_diag .diag_button.item").each(function()
			{
				if (!($(".switcher", this).hasClass("disabled")))
				{
					if (area_type == "INS")
					{
						if (Number($(".switcher", this).attr("data-checked")) == 0)
							widget_obj.wo_primary.area_insp[$(this).attr("data-id") - 1] = -1;
						else
						{
							if (widget_obj.wo_primary.area_insp[$(this).attr("data-id") - 1] == -1) 
								widget_obj.wo_primary.area_insp[$(this).attr("data-id") - 1] = 0;
						}
					}
					area_array[$(this).attr("data-id") - 1] = Number($(".switcher", this).attr("data-checked"));
				} 
			});
			//
			$(this.container + " .area_ins .sl_selector").html(this.wo_primary.aa_to_str(this.wo_primary.area_ins));
			$(this.container + " .area_dis .sl_selector").html(this.wo_primary.aa_to_str(this.wo_primary.area_dis));
			$(this.container + " .area_insp .sl_selector").html(this.wo_primary.aa_to_str(this.wo_primary.area_insp));
		}
		else if (this.data_identifier === "diag_areas_local")
		{
			var newMask = "";
			$("#container_diag .diag_button.item").each(function()
			{
				if ($(".switcher", this).attr("data-checked") == "1")
					newMask += $(this).attr("data-id");
				else
					newMask += "-";
			});
			//
			if (this.caller_name = "widget_mod_device_rem")
			{
				if (newMask == area_off_all_str)
				{
					this.wo_primary.guiRemId[widget_obj.item_name].save_type = "VOID";			
					this.wo_primary.guiRemId[widget_obj.item_name].save_par = newMask;
					this.wo_primary.guiRemId[widget_obj.item_name].change_flg = true;
					//
					$(this.container + " ." + this.item_name + " .sl_selector").text(this.wo_primary.remToggleId["VOID"].tag);
				}
				else
				{
					this.wo_primary.guiRemId[widget_obj.item_name].save_type = this.data_extra;			
					this.wo_primary.guiRemId[widget_obj.item_name].save_par = newMask;
					this.wo_primary.guiRemId[widget_obj.item_name].change_flg = true;
					//
					$(this.container + " ." + this.item_name + " .sl_selector").text(this.wo_primary.format_area_sl(newMask));
				}
			}
		}
		else if (this.data_identifier === "diag_events")
		{
			var events_index = this.data_extra;
			//
			var item_selected = $("#container_diag .diag_button .switcher[data-checked='1']").parent();
			this.wo_primary.events[events_index].type = item_selected.attr("data-type");
			this.wo_primary.events[events_index].par = item_selected.attr("data-par");
			//
			switch(this.wo_primary.events[events_index].type)
			{
				case "VOID":
					$(this.container + " .event:eq(" + events_index + ") .sl_selector").html("{LANG_NO_SETUP}");
					break;
				case "M":
					$(this.container + " .event:eq(" + events_index + ") .sl_selector").html("{LANG_FIRST_AID}");
					break;
				case "R":
					$(this.container + " .event:eq(" + events_index + ") .sl_selector").html("{LANG_AGGRESSION}");
					break;
				case "P":
					$(this.container + " .event:eq(" + events_index + ") .sl_selector").html("{LANG_PANIC}");
					break;
				case "DOMO":
					$(this.container + " .event:eq(" + events_index + ") .sl_selector").html(this.wo_primary.associative_xml_relay_domo_tbl[this.wo_primary.events[events_index].par].children("name").text());
					break;
				case "SCENE":
					$(this.container + " .event:eq(" + events_index + ") .sl_selector").html(xml_file_configuration.find("Scenes Scene[id='S" + this.wo_primary.events[events_index].par + "']").attr("desc"));
					break;
				default:
					break;
			}
		}
		else if (this.data_identifier === "log_date")
		{
			var res_ini = true;
			var res_end = true;
			//
			var day_ini = $("#day_ini").val();
			var month_ini = $("#month_ini").val();
			var year_ini = $("#year_ini").val();
			var local_ts_ini = this.wo_primary.from_value_to_timestamp(day_ini, month_ini, year_ini, true);
			var localdt_ini = this.wo_primary.from_value_to_localdt(day_ini, month_ini, year_ini, true);
			//
			var day_end = $("#day_end").val();
			var month_end = $("#month_end").val();
			var year_end = $("#year_end").val();
			var local_ts_end = this.wo_primary.from_value_to_timestamp(day_end, month_end, year_end, false);
			var localdt_end = this.wo_primary.from_value_to_localdt(day_end, month_end, year_end, false);
			//
			var enable_ini = $("#container_diag .diag_button[data-id='0'] .switcher").attr("data-checked") == "1" ? true : false;
			var enable_end = $("#container_diag .diag_button[data-id='1'] .switcher").attr("data-checked") == "1" ? true : false;
			//
			if (enable_ini)
			{
				if (local_ts_ini == "NODATE")
				{
					res_ini = false;
					$("#day_ini, #month_ini, #year_ini").css("background-color", "rgba(255,0,0,0.2)");
				}
				else
				{
					res_ini = true;
					$("#day_ini, #month_ini, #year_ini").css("background-color", "rgba(255,255,255,0.1)");
				}
			}
			if (enable_end)
			{
				if (local_ts_end == "NODATE")
				{
					res_end = false;
					$("#day_end, #month_end, #year_end").css("background-color", "rgba(255,0,0,0.2)");
				}
				else
				{
					res_end = true;
					$("#day_end, #month_end, #year_end").css("background-color", "rgba(255,255,255,0.1)");
				}
			}
			//
			this.diag_ena_save = res_ini && res_end;
			//
			if (this.diag_ena_save)
			{
				if (enable_ini)
				{
					this.wo_primary.filter_date_ini_flg = true;
					this.wo_primary.date_log_ini = local_ts_ini;
					this.wo_primary.localdt_ini = localdt_ini;
				}
				else
				{
					this.wo_primary.filter_date_ini_flg = false;
				}				
				if (enable_end)
				{
					this.wo_primary.filter_date_end_flg = true;
					this.wo_primary.date_log_end = local_ts_end;
					this.wo_primary.localdt_end = localdt_end;
				}
				else
				{
					this.wo_primary.filter_date_end_flg = false;
				}
			}
			//
			this.wo_primary.send_request_logs();
		}
		else if (this.data_identifier === "log_event")
		{
			this.wo_primary.filter_eve_type = $("#container_diag .diag_button .switcher[data-checked='1']").parent().attr("data-type");
			//
			this.wo_primary.send_request_logs();
		}
		else if (this.data_identifier === "wired")
		{
			var checked_item = $("#container_diag .diag_button .switcher[data-checked='1']").parent();
			if (this.item_name.indexOf("wired_input") > -1)
			{
				if (checked_item.attr("data-value") == "on")
				{
					if (wire_in_tst(Number(this.wo_primary.xml_wired_i_tbl[this.data_extra].children("ord").text())))
					{
						this.wo_primary.xml_wired_i_tbl[Number(this.data_extra)].children("cfg_wire_in_mode").text("" + WIRE_NC_BILANCIATO);
						this.wo_primary.xml_wired_i_tbl[Number(this.data_extra) + 8].children("cfg_wire_in_mode").text("" + WIRE_N_DISABLED);
					}
				}
				else if (checked_item.attr("data-value") == "off")
				{
					if (wire_in_tst(Number(this.wo_primary.xml_wired_i_tbl[this.data_extra].children("ord").text())))
					{
						this.wo_primary.xml_wired_i_tbl[Number(this.data_extra)].children("cfg_wire_in_mode").text("" + WIRE_N_DISABLED);
						this.wo_primary.xml_wired_i_tbl[Number(this.data_extra) + 8].children("cfg_wire_in_mode").text("" + WIRE_N_DISABLED);
					}
				}
			}
			else if (this.item_name.indexOf("wired_output") > -1)
			{
				if (checked_item.attr("data-value") == "on")
				{
					this.wo_primary.xml_wired_o_tbl[this.data_extra].children("wire_out_mode").text("2");
					this.wo_primary.xml_wired_o_tbl[this.data_extra].children("wire_out_mode_domo_par").text("0");
				}
				else if (checked_item.attr("data-value") == "off")
				{
					this.wo_primary.xml_wired_o_tbl[this.data_extra].children("wire_out_mode").text("0");
				}
			}
			else if (this.item_name.indexOf("wired_key") > -1)
			{
				if (checked_item.attr("data-value") == "on")
				{
					this.wo_primary.xml_wired_k_tbl[this.data_extra].children("wire_key_mode").text("1");
				}
				else if (checked_item.attr("data-value") == "off")
				{
					this.wo_primary.xml_wired_k_tbl[this.data_extra].children("wire_key_mode").text("0");
				}
			}
			$(this.container + " ." + this.item_name + " .sl_selector").html($("p:first", checked_item).text());
		}
		else if (this.data_identifier === "wired_mode")
		{
			var item_selected = $("#container_diag .diag_button .switcher[data-checked='1']").parent();
			if (item_selected.attr("data-id") < 3)
			{
				this.wo_primary.wire_out_mode = "2";
				//
				if (item_selected.attr("data-id") == "2")
					$(this.container + " .timing").addClass("disabled");
				else
					$(this.container + " .timing").removeClass("disabled");
				//
				this.wo_primary.wire_out_mode_domo_par = item_selected.attr("data-sec-def");
				$(this.container + " .pick_timing").text(this.wo_primary.wire_out_mode_domo_par);
			}
			else
			{
				this.wo_primary.wire_out_mode = "1";
				//
				$(this.container + " .timing").removeClass("disabled");
				//
				this.wo_primary.wire_out_mode_repeat_par = item_selected.attr("data-sec-def");
				$(this.container + " .pick_timing").text(this.wo_primary.wire_out_mode_repeat_par);
				this.wo_primary.wire_out_mode_repeat_eve = item_selected.attr("data-id") - 2;
				//
				if (this.wo_primary.wire_out_mode_repeat_par == "0")
					$(this.container + " .timing").addClass("disabled");
			}
			$(this.container + " .mode_alarm .sl_selector").html($("p:first", item_selected).text());
			$(this.container + " .pick_timing").attr("data-lbound", item_selected.attr("data-sec-lbound"));
			$(this.container + " .pick_timing").attr("data-rbound", item_selected.attr("data-sec-ubound"));
		}
		else if (this.data_identifier === "tvcc_list")
		{
			widget_obj.wo_primary.attivata_tvcc = false;
			//
			$("#container_diag .diag_button").each(function()
			{
				if ($(".switcher", this).attr("data-checked") == "1")
					widget_obj.wo_primary.attivata_tvcc = true;
				widget_obj.wo_primary.tvccs.children("tvcc[id='" + $(this).attr("data-id") + "']").children("ena").text($(".switcher", this).attr("data-checked"));
			});
			//
			if (widget_obj.wo_primary.attivata_tvcc)
			{
				$(this.container + " ." + this.item_name + " .sl_selector").html("{LANG_ITEM_AT_LEAST_ONE}");
				$(this.container + " ." + this.data_extra).removeClass("invisible");
			}
			else
			{
				$(this.container + " ." + this.item_name + " .sl_selector").html("{LANG_ITEM_NONE}");
				$(this.container + " ." + this.data_extra).addClass("invisible");
			}
		}
		else if (this.data_identifier === "wired_pulse")
		{
			widget_obj.wo_primary.pulse_flg = $("#container_diag .diag_button .switcher[data-checked='1']").parent().attr("data-value");
			$(this.container + " ." + this.item_name + " .sl_selector").html($("#container_diag .diag_button .switcher[data-checked='1']").siblings("p:first").html());
		}
		else if (this.data_identifier === "triggered_by")
		{
			var item_selected = $("#container_diag .diag_button .switcher[data-checked='1']").parent();
			//
			this.wo_primary.triggered_by = item_selected.attr("data-id");
			this.wo_primary.active_if_mem = $("p:first", item_selected).text();
			this.wo_primary.draw_value_active_if();
		}
		else if (this.data_identifier === "repeaterDeviceList")
		{
			var items_selected = $("#container_diag .diag_button .switcher[data-checked='1']").parent();
			var items_unselected = $("#container_diag .diag_button .switcher[data-checked='0']").parent();
			//
			items_selected.each(function()
			{
				widget_obj.wo_primary.devListSave.children("dev[id='" + $(this).attr("data-id") + "']").attr("selected", "1");
			});
			items_unselected.each(function()
			{
				widget_obj.wo_primary.devListSave.children("dev[id='" + $(this).attr("data-id") + "']").attr("selected", "0");
			});
			//
			if (items_selected.length > 0)
				$(this.container + " ." + this.item_name + " .sl_selector").html("{LANG_ITEM_AT_LEAST_ONE}");
			else
				$(this.container + " ." + this.item_name + " .sl_selector").html("{LANG_ITEM_NONE}");
		}
		else if (this.data_identifier === "rem_mode")
		{
			var items_selected = $("#container_diag .diag_button .switcher[data-checked='1']").parent();
			//
			if (items_selected.length > 0)
			{
				if (this.wo_primary.remToggleId[items_selected.attr("data-id")].scelta)
				{
					if (this.wo_primary.remToggleId[items_selected.attr("data-id")].mode == REM_MODE_1) //area
					{
						this.diag_ena_save = false;
						pag_change(".JSdialog", "widget_diag", "diag_areas_local", this.diag_title, this.container, items_selected.attr("data-id"), this.caller_name, this.item_name);
					}
					else if (this.wo_primary.remToggleId[items_selected.attr("data-id")].mode == REM_MODE_2) //domo
					{
						this.diag_ena_save = false;
						pag_change(".JSdialog", "widget_diag", "rem_domo"       , this.diag_title, this.container, items_selected.attr("data-id"), this.caller_name, this.item_name);
					}
					else if (this.wo_primary.remToggleId[items_selected.attr("data-id")].mode == REM_MODE_3) //"scene"
					{
						this.diag_ena_save = false;
						pag_change(".JSdialog", "widget_diag", "rem_scene"       , this.diag_title, this.container, items_selected.attr("data-id"), this.caller_name, this.item_name);
					}
					else if (this.wo_primary.remToggleId[items_selected.attr("data-id")].mode == REM_MODE_4) //autom
					{
						this.diag_ena_save = false;
						pag_change(".JSdialog", "widget_diag", "rem_autom"       , this.diag_title, this.container, items_selected.attr("data-id"), this.caller_name, this.item_name);
					}
				}
				else
				{
					this.wo_primary.guiRemId[widget_obj.item_name].save_type = items_selected.attr("data-id");
					this.wo_primary.guiRemId[widget_obj.item_name].save_par = area_on_all_str;
					this.wo_primary.guiRemId[widget_obj.item_name].change_flg = true;
					$(this.container + " ." + this.item_name + " .sl_selector").text(this.wo_primary.remToggleId[items_selected.attr("data-id")].tag);
				}
			}
		}
		else if (this.data_identifier === "rem_autom")
		{
			var items_selected = $("#container_diag .diag_button .switcher[data-checked='1']").parent();
			//
			if (items_selected.length > 0)
			{
				this.wo_primary.guiRemId[widget_obj.item_name].save_type = this.data_extra;
				this.wo_primary.guiRemId[widget_obj.item_name].save_par = items_selected.attr("data-id");
				this.wo_primary.guiRemId[widget_obj.item_name].change_flg = true;
				//
				$(this.container + " ." + this.item_name + " .sl_selector").html("{LANG_REM_AUTOMATION}" + " " + (Number(items_selected.attr("data-id")) + 1));
			}
		}
		else if (this.data_identifier === "rem_domo")
		{
			var items_selected = $("#container_diag .diag_button .switcher[data-checked='1']").parent();
			//
			if (items_selected.length > 0)
			{
				this.wo_primary.guiRemId[widget_obj.item_name].save_type = this.data_extra;
				this.wo_primary.guiRemId[widget_obj.item_name].save_par = items_selected.attr("data-id");
				this.wo_primary.guiRemId[widget_obj.item_name].change_flg = true;
				//
				$(this.container + " ." + this.item_name + " .sl_selector").text(this.wo_primary.associative_xml_relay_domo_tbl[items_selected.attr("data-id")].children("name").text());
			}
		}
		else if (this.data_identifier === "rem_scene")
		{
			var items_selected = $("#container_diag .diag_button .switcher[data-checked='1']").parent();
			//
			if (items_selected.length > 0)
			{
				this.wo_primary.guiRemId[widget_obj.item_name].save_type = this.data_extra;
				this.wo_primary.guiRemId[widget_obj.item_name].save_par = items_selected.attr("data-id");
				this.wo_primary.guiRemId[widget_obj.item_name].change_flg = true;
				//
				$(this.container + " ." + this.item_name + " .sl_selector").text(xml_file_configuration.find("Scenes Scene[id='S" + items_selected.attr("data-id") + "']").attr("desc"));
			}
		}
		else if (this.data_identifier === "region")
		{
			this.wo_primary.local_region_pstn = $("#container_diag .item .switcher[data-checked='1']").parent().attr("data-id");
			$(this.container + " ." + this.item_name + " .sl_selector").html($("#container_diag .item .switcher[data-checked='1']").siblings("p:first").html());
		}
		else if (this.data_identifier === "address_mode")
		{
			var addrm = Number($("#container_diag .item .switcher[data-checked='1']").parent().attr("data-id"));
			if (addrm == 0)
			{
				$(this.container + " .tvcc_mac").parent().removeClass("unavailable");
				$(this.container + " .tvcc_ip").parent().addClass("unavailable");
				$(this.container + " ." + this.item_name + " .sl_selector").html("{LANG_TVCC_MAC}");
			}
			else if (addrm == 1)
			{
				$(this.container + " .tvcc_mac").parent().addClass("unavailable");
				$(this.container + " .tvcc_ip").parent().removeClass("unavailable");
				$(this.container + " ." + this.item_name + " .sl_selector").html("{LANG_TVCC_IP}");
			}
			this.wo_primary.xml_any.children("ip_address_mode_flg").text(addrm);
		}
		else if (this.data_identifier === "bus_node_list")
		{
			var dev_idx = Number(this.data_extra);
			var xml_any_o = xml_any_tbl[dev_idx];
			var bus_id_prev = Number(xml_any_o.children("bus_node").text());
			var bus_id = Number($("#container_diag .item .switcher[data-checked='1']:not(.disabled)").parent().attr("data-id"));
			if (bus_id_prev != bus_id)
			{
				//node_dev_tbl[bus_id_prev] = -1; //ridondante
				//node_dev_tbl[bus_id] = dev_idx; //ridondante
				xml_any_o.children("bus_node").text(bus_id);
				//
				global_send_dev_mod_save(this.wo_primary, null, false, null, true, null, xml_any_o);
			}
		}
		else if (this.data_identifier === "dev_ala_eve")
		{
			var ala_eve_msk_idx = Number(this.data_extra);
			var dev_ala_eve_st_val_selected = $("#container_diag .item .switcher[data-checked='1']:not(.disabled)").parent().data("dev_ala_eve_st_val");
			$(this.item_name + " .sl_selector").html(widget_obj.wo_primary.ala_eve_state_str[dev_ala_eve_st_val_selected]);
			widget_obj.wo_primary.ala_eve_msk = widget_obj.wo_primary.ala_eve_msk.replaceAt(ala_eve_msk_idx, dev_ala_eve_st_val_selected);
		}
		else if (this.data_identifier === "conc_bus")
		{
			var checked_item = $("#container_diag .item").filter(function()
			{
				if ($(".switcher[data-checked='1']", this).length > 0) return true;
				else return false;
			});
			if (checked_item.attr("data-value") == "on")
			{
				this.wo_primary.xml_bus_conc_tbl[this.data_extra].children("child_valid").text("1");
			}
			else if (checked_item.attr("data-value") == "off")
			{
				this.wo_primary.xml_bus_conc_tbl[this.data_extra].children("child_valid").text("0");
			}
			$(this.container + " ." + this.item_name + " .sl_selector").html(checked_item.children("p").text());
		}
		else if (this.data_identifier === "input_bus")
		{
			var checked_item = $("#container_diag .item").filter(function()
			{
				if ($(".switcher[data-checked='1']", this).length > 0) return true;
				else return false;
			});
			if (checked_item.attr("data-value") == "on")
			{
				this.wo_primary.xml_bus_input_tbl[this.data_extra].children("child_valid").text("1");
			}
			else if (checked_item.attr("data-value") == "off")
			{
				this.wo_primary.xml_bus_input_tbl[this.data_extra].children("child_valid").text("0");
			}
			$(this.container + " ." + this.item_name + " .sl_selector").html(checked_item.children("p").text());
		}
		else if (this.data_identifier === "mode_bus_rf")
		{
			var initial_state = mode_bus_rf_dynamic_area_flg(this.container, this.wo_primary);
			var item_selected = $("#container_diag .item").filter(function()
			{
				if ($(".switcher[data-checked='1']", this).length > 0) return true;
				else return false;
			});
			//
			function shutdown_area_dev()
			{
				if (Number($(widget_obj.container + " .area_and").attr("data-checked")) > 0) 
					$(widget_obj.container + " .area_and").trigger("click");
				//
				if (and_function_dev != "0")
				{
					$(widget_obj.container + " .and_function_dev .sl_selector").html("{LANG_DISABLED}");
					and_function_dev = "0";
				}
				$(widget_obj.container + " .and_function_dev").trigger("ok_diag");
			}
			//
			if 
			(
				item_selected.attr("data-id") == DELAYED
				|| item_selected.attr("data-id") == MATCH_DEV
				|| item_selected.attr("data-id") == MATCH_AREA
			)
			{
				if (item_selected.attr("data-id") == DELAYED)
				{
					mode_bus_rf_dynamic_gui(this.container, this.wo_primary, true);
					shutdown_area_dev();
				}
				else if (item_selected.attr("data-id") == MATCH_DEV)
				{
					$(this.container + " .and_function_dev").trigger("click");
				}
				else if (item_selected.attr("data-id") == MATCH_AREA)
				{
					mode_bus_rf_dynamic_gui(this.container, this.wo_primary, true);
					if (Number($(this.container + " .area_and").attr("data-checked")) == 0) 
						$(this.container + " .area_and").trigger("click");
				}
			}
			else
			{
				shutdown_area_dev();
				//
				$(this.container + " .sound .son").trigger("click");
				$(this.container + " .pick_delay").text("0");
				if ($(this.container + " .chime").attr("data-checked") != "0")
					$(this.container + " .chime").trigger("click");
				$(this.container + " .tvcc .sl_selector").html("{LANG_ITEM_NONE}");
				this.wo_primary.tvccs.find("tvccs tvcc").each(function()
				{
					$(this).find("ena").text("0");
				});
				//
				$(this.container + " .reed .roc").attr("data-checked", "0").css("color", "rgba(255,255,255,0.4)");
				$(this.container + " .reed .roc.open").attr("data-checked", "1").css("color", "rgba(255,0,0,1)");
				//
				if ("phy_mode" in this.wo_primary)
				{
					if (this.wo_primary.phy_mode == WIRE_NC_CONTAIMPULSI || this.wo_primary.phy_mode == WIRE_NC_BILANCIATO_CONTAIMPULSI)
					{
						this.wo_primary.phy_mode = WIRE_NC_BILANCIATO;
						$(this.container + " .phy_mode .sl_selector").html("{LANG_BALANCED}").removeClass("red");
						$(this.container + " .impulse").addClass("disabled");
						$(this.container + " .reed").removeClass("disabled");
					}
				}
				//
				$(this.container + " .initial_delay_sec").addClass("invisible");
				$(this.container + " .pick_initial_delay_sec").text("0");
				//
				this.wo_primary.mode_bus_rf = Number(item_selected.attr("data-id"));
				$(this.container + " ." + this.item_name + " .sl_selector").html(this.wo_primary.mode_bus_rf_label[this.wo_primary.mode_bus_rf]);
				mode_bus_rf_dynamic_gui(this.container, this.wo_primary, false);
			}
			//
			if (mode_bus_rf_dynamic_area_flg(this.container, this.wo_primary) != initial_state)
			{
				if (mode_bus_rf_dynamic_area_flg(this.container, this.wo_primary))
					$("#area_container_mod .switcher").trigger("switch_state_changer", [["enabled"]]);
				else
					$("#area_container_mod .switcher").trigger("switch_state_changer", [["disabled", "on"]]);
			}
		}
		else if (this.data_identifier === "season_pass")
		{
			this.wo_primary.season_pass = parseInt($("#container_diag .diag_button .switcher[data-checked='1']").parent().attr("data-id"));
			if (this.wo_primary.season_pass == 0)
				$(this.container + " .season_pass .sl_selector").html("{LANG_THERMO_SUMMER}");
			else
				$(this.container + " .season_pass .sl_selector").html("{LANG_THERMO_WINTER}");
		}
		else if (this.data_identifier === "theme_pass")
		{
			this.wo_primary.theme_pass_local = Number($("#container_diag .diag_button .switcher[data-checked='1']").parent().attr("data-id"));
			$(this.container + " .theme_pass .sl_selector").html(this.wo_primary.theme_pass_str[this.wo_primary.theme_pass_local]);
			if
			(
				!QT
				&&
				(
					SEARCH_MODE_TEMA
					|| COOKIE_MODE_TEMA
					|| this.wo_primary.theme_pass_local_web != this.wo_primary.theme_pass_local
				)
			)
				pag_change(".home .JSdialog2", "widget_popwarn", "{LANG_WARNING}", "{LANG_THEME_VAR}", "ok", null);
		}
		else if (this.data_identifier === "theme_pass2")
		{
			this.wo_primary.theme_pass_local_web = Number($("#container_diag .diag_button .switcher[data-checked='1']").parent().attr("data-id"));
			$(this.container + " .theme_pass2 .sl_selector").html(this.wo_primary.theme_pass_str[this.wo_primary.theme_pass_local_web]);
		}
		//
		if (this.diag_ena_save) pag_clear(this.diag_container);
	},
	switchHTML: function(state, disable_flg)
	{
		if (state == null)
			state = "0";
		return (
			  "<div class='switcher off disableMode3" + (disable_flg ? " disabled" : "") + "' data-checked='" + state + "'>"
			+ 	"<p class='button_text c_dark on'>{LANG_YES}</p>"
			+ 	"<p class='button_text c_dark off'>{LANG_NO}</p>"
			+ 	"<div class='button_dot g_bg_dark'></div>"
			+ 	"<div class='active_area'></div>"
			+ "</div>"
		);
	},
	bindSwitcher: function()
	{
		var widget_obj = this;
		//
		$("#container_diag .diag_button .switcher").each(function(index)
		{
			global_switcher_binder("#container_diag", ":eq(" + index + ")", null, "GUI", $(this).parent().hasClass("en50131") ? {condizione: "1", messaggio: "{LANG_EN50131}"} : null);				
		});
		$("#container_diag .diag_button .switcher:not(.disabled)").off("click.ex").on("click.ex", function()
		{
			if ($(this).attr("data-checked") == "1")
			{
				if ($(this).parent().hasClass("ex"))
					$(this).parent().siblings(".diag_button").children(".switcher:not(.disabled)").trigger("switch_state_changer", [["off"]], true);
				else
					$(this).parent().siblings(".diag_button.ex").children(".switcher:not(.disabled)").trigger("switch_state_changer", [["off"]], true);
			}
		});
		$("#container_diag .diag_button.alo .switcher:not(.disabled)").off("click.alo").on("click.alo", function()
		{
			if
			(
				$(this).attr("data-checked") == "0"
				&& $(this).parent().siblings(".diag_button.alo").children(".switcher:not(.disabled)[data-checked='1']").length == 0
			)
				$(this).trigger("switch_state_changer", [["on"]], true);
		});
	},
	upshot: function()
	{
		var firstSelected = $("#container_diag .item .switcher[data-checked='1']:not(.disabled):first");
		if (firstSelected.length > 0)
			var pos = firstSelected.parent()[0].offsetTop;
		scrollTo(this, pos);
		//
		scrollList(this);
	}
};