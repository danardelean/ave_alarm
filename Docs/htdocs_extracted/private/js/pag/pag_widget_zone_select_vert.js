pag_table_new["widget_zone_select_vert"] = {
	onload: function()
	{
		var widget_obj = this;
		//
		if ($(".widget_zone_select_vert").parent().hasClass("JSdialog2"))
			$(".JSdialog2").show();
		else
			$(".JSdialog").show();
		this.header_home_switch();
		this.footer_home_switch();
		//
		away_from_home();
		//
		if (this.areas_ins_msk == "none" || this.areas_ins_msk == "")
			this.areas_ins_msk = area_on_all_str;
		//
		if (this.mode == "scene" || imq_get())
		{
			$("#zone_select_title, #zone_select_container").remove();
			//			
			this.insdispar_associative[WS_DEV_ALARM_CEN_CMD_ON_STR] = "{LANG_WIZARD_MOD_USER_ENGAGE}";
			this.insdispar_associative[WS_DEV_ALARM_CEN_CMD_OFF_STR] = "{LANG_WIZARD_MOD_USER_DISENGAGE}";
			this.insdispar_associative[WS_DEV_ALARM_CEN_CMD_PART_STR] = "{LANG_WIZARD_MOD_USER_ENGAGE_PART}";
			//
			var last_action_selected;
			$("." + this.name + " .action_selector .area_action").click(function()
			{
				$(this).siblings(".area_action").removeClass("selected");
				$(this).toggleClass("selected");
				//
				if (last_action_selected == $(this).attr("id"))
				{
					last_action_selected = $(this).attr("id");
					$("." + widget_obj.name + " .areas_selector").toggleClass("hide_areas")
				}
				else
				{
					last_action_selected = $(this).attr("id");
					$("." + widget_obj.name + " .areas_selector")
						.removeClass("hide_areas")
						.attr("class", "areas_selector " + $(this).attr("class").cutAround("area_action ", " selected"));
					$("." + widget_obj.name + " .areas_selector tr").each(function()
					{
						if (!area_ena_check($(this).index() + 1))
							$(this).addClass("unavailableMode1 unavailable");
						if (last_action_selected == "area_action_dis")
						{
							if (widget_obj.mode == "scene")
							{
								if (widget_obj.areas_ins_msk[$(this).index()] == "-")
									$(this).removeClass("selected");
								else
									$(this).addClass("selected");
							}
							else
							{
								if (area_st_obj.filter("[id='" + ($(this).index() + 1) + "']").attr("st") == "0")
									$(this).removeClass("selected");
								else
									$(this).addClass("selected");	
							}
						}
						else
						{
							if (widget_obj.mode == "scene")
							{
								if (widget_obj.areas_dis_msk[$(this).index()] == "-")
									$(this).removeClass("selected");
								else
									$(this).addClass("selected");
							}
							else
							{
								if (area_st_obj.filter("[id='" + ($(this).index() + 1) + "']").attr("st") == "0")
									$(this).addClass("selected");
								else
									$(this).removeClass("selected");
							}
						}
					});
					if (last_action_selected == "area_action_dis")
					{
						var tmp_flg = false;
						$("." + widget_obj.name + " .areas_selector tr").each(function() { tmp_flg |= $(this).hasClass("selected"); });
						if (!tmp_flg)
							$("." + widget_obj.name + " .areas_selector tr").addClass("selected");
					}
				}
			});
			//
			$("." + this.name + " .areas_selector tr").click(function()
			{
				$(this).toggleClass("selected");
			});
			//
			area_list.children("item").each(function(index)
			{
				$("." + widget_obj.name + " .areas_selector tr:eq(" + index + ") td p").text($(this).children("name").text() + " - " + $(this).children("desc").text());
			});
			//
			if (this.mode == "scene")
			{
				if (this.area_cmd_selected == WS_DEV_ALARM_CEN_CMD_ON_STR)
				{
					$("#area_action_ins").trigger("click");
				}
				else if (this.area_cmd_selected == WS_DEV_ALARM_CEN_CMD_OFF_STR)
				{
					$("#area_action_dis").trigger("click");
				}
			}
		}
		else
		{
			stopWaitingScr();
			$("." + this.name + " table").remove();
			var trov = false;
			for (var i = 0; i < area_st_obj.length; i++)
			{
				if (Number(area_st_obj.filter("[id='" + (i + 1) + "']").attr("st")) > 0 && widget_obj.areas_dis_msk.charAt(i) != "-")
				{
					trov = true;
					break;
				}
			}
			//
			area_list.find("item").each(function()
			{
				var area_id = $(this).find("id").text();
				var utente_dis = widget_obj.areas_dis_msk.charAt(area_id - 1) != "-";
				var utente_ins = widget_obj.areas_ins_msk.charAt(area_id - 1) != "-";
				var st_attuale = Number(area_st_obj.filter("[id='" + area_id + "']").attr("st")) > 0;
				var enaFlg = $(this).find("ena").text() == "TRUE" ? true : false; 
				//
				widget_obj.onoffflg_prev[area_id] = st_attuale && !utente_dis;
				//
				var onoffflg = ((st_attuale && !utente_dis) || (utente_ins && !trov)) && enaFlg;
				//
				$("#zone_select_container").append
				(
					"<div class='zone_select_item " + (onoffflg ? "on" : "off") + (enaFlg ? "" : " unavailableMode1 unavailable") + "' data-id='" + $(this).children("id").text() + "'>"
					+	"<div class='itembox brb brt brl brr'></div>"
					+	"<div class='icon_wrapper'>"
					+		"<div class='icon'><div class='img'></div></div>"
					+	"</div>"
					+	"<div class='text_wrapper'>"
					+		"<div class='name'><div class='vname'>" + $(this).children("desc").text() + "</div></div>"
					+		"<div class='condition'><div class='vcondition'>" + (onoffflg ? "{LANG_WIDGET_ZONE_SELECT_VERT_INS}" : "{LANG_WIDGET_ZONE_SELECT_VERT_DIS}") + "</div></div>"
					+	"</div>"
					+"</div>"	
				);
			});
			//
			$("#zone_select_container .zone_select_item").off("click").click(function()
			{
				if ($(this).hasClass("off"))
				{
					$(this)
						.removeClass("off")
						.addClass("on")
						.find(".vcondition")
						.html("{LANG_WIDGET_ZONE_SELECT_VERT_INS}");
				}
				else
				{
					$(this)
						.removeClass("on")
						.addClass("off")
						.find(".vcondition")
						.html("{LANG_WIDGET_ZONE_SELECT_VERT_DIS}");
				}
				proceed_button_ena();
			});
			//
			function proceed_button_ena()
			{
				if ($("#zone_select_container .zone_select_item.on").length == 0)
					$("#footer_h2_a_a").addClass("disabled");
				else
					$("#footer_h2_a_a").removeClass("disabled");	
			}
			proceed_button_ena();
			//
			this.off_msk = widget_obj.areas_dis_msk;
			this.par_send(true);
		}
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
		if (this.mode == "scene")
			$(".JSdialog2").hide();	
		else
			$(".JSdialog").hide();
	},
	//
	name: "widget_zone_select_vert",
	title: "{LANG_ITEM_SELECT}",
	areas_cmd_msk: area_off_all_str,
	cmd_areas_all: [WS_DEV_ALARM_CEN_CMD_OFF_STR, WS_DEV_ALARM_CEN_CMD_ON_STR],
	cmd_areas: null,
	mode: $(".widget_zone_select_vert").attr("data-mode"),
	areas_ins_msk: $(".widget_zone_select_vert").attr("data-area-ins"),
	areas_dis_msk: $(".widget_zone_select_vert").attr("data-area-dis"),
	areas_part_msk: $(".widget_zone_select_vert").attr("data-area-grp"),
	on_msk: "",
	off_msk: "",
	onoffflg_prev: {},
	//per scene
	devid: $(".widget_zone_select_vert").attr("data-devid"),
	dev_name: $(".widget_zone_select_vert").attr("data-dev-name"),
	insdispar_associative: [],
	idx: $(".widget_zone_select_vert").attr("data-idx"),
	area_cmd_selected: $(".widget_zone_select_vert").attr("data-cmd-code"),
	area_part_selected: $(".widget_zone_select_vert").attr("data-area-part-selected"),
	//
	par_save: function()
	{
		if (this.mode == "scene" || imq_get())
		{
			this.areas_cmd_msk = area_off_all_str;
			//
			var widget_obj = this;
			$("." + this.name + " .areas_selector tr").each(function()
			{
				if ($(this).hasClass("selected") && !$(this).hasClass("unavailable"))
				{
					var index = $(this).index();
					widget_obj.areas_cmd_msk = widget_obj.areas_cmd_msk.replaceAt(index, index + 1);	
				}			
			});
			//
			this.cmd_areas = "";
			if (!$("." + this.name + " .areas_selector").hasClass("hide_areas"))
			{
				if ($("." + this.name + " .areas_selector").hasClass("total_on"))
					this.cmd_areas = WS_DEV_ALARM_CEN_CMD_ON_STR;
				else
					this.cmd_areas = WS_DEV_ALARM_CEN_CMD_OFF_STR;
			}
		}
		else
		{
			var widget_obj = this;
			this.on_msk = "";
			this.off_msk = "";
			//
			$("#zone_select_container .zone_select_item").each(function()
			{
				var area_id = $(this).attr("data-id");
				var utente_ins = widget_obj.areas_ins_msk.charAt(area_id - 1) != "-";
				//
				var onoffflg = $(this).hasClass("on") && utente_ins && !widget_obj.onoffflg_prev[area_id] && !$(this).hasClass("unavailable");
				widget_obj.on_msk += (onoffflg ? area_id : "-");
			});
		}
	},
	par_send: function(manual_onoff_flg)
	{
		//par_send non è utilizzata dalla modalità scenario (== scene)
		if (!manual_onoff_flg)
			this.par_save();
		//
		if (imq_get())
		{
			if (!$("." + this.name + " .areas_selector").hasClass("hide_areas"))
			{
				if (this.cmd_areas != null)
				{
					var cen_id = xml_file_configuration.find("Devices Device")
					.filter(function()
					{
						if ($(this).children("Subcategory").text() == WS_DEV_ALARM_CEN_STR)
							return true;
					}).attr("id");
					//
					xml_request = xml_request_head_build("DEVICE_CMD");
					xml_par = $(XML("Command")); xml_par.text(this.cmd_areas); xml_request.append(xml_par);
					xml_par = $(XML("Device")); xml_par.text(cen_id); xml_request.append(xml_par);
					xml_par = $(XML("Arguments")); xml_request.append(xml_par);
					xml_node = $(XML("Argument")); xml_node.attr("id", "PIN"); xml_node.text(u_p); xml_par.append(xml_node);
					xml_node = $(XML("Argument")); xml_node.attr("id", "AREAS"); xml_node.text(this.areas_cmd_msk); xml_par.append(xml_node);
					xml_send(xml_request);
				}
			}
		}
		else
		{
			var cen_id = xml_file_configuration.find("Devices Device")
			.filter(function()
			{
				if ($(this).children("Subcategory").text() == WS_DEV_ALARM_CEN_STR)
					return true;
			}).attr("id");
			//
			for (var i = 0; i < this.cmd_areas_all.length; i++)
			{
				var msk = "";
				if (this.cmd_areas_all[i] == WS_DEV_ALARM_CEN_CMD_ON_STR)
					msk = this.on_msk;
				else if (this.cmd_areas_all[i] == WS_DEV_ALARM_CEN_CMD_OFF_STR)
					msk = this.off_msk;
				else
					tyu("Area Mask ERROR: " + this.name);
				//
				if (msk == "" || msk == area_off_all_str)
					continue;
				//
				xml_request = xml_request_head_build("DEVICE_CMD");
				xml_par = $(XML("Command")); xml_par.text(this.cmd_areas_all[i]); xml_request.append(xml_par);
				xml_par = $(XML("Device")); xml_par.text(cen_id); xml_request.append(xml_par);
				xml_par = $(XML("Arguments")); xml_request.append(xml_par);
				xml_node = $(XML("Argument")); xml_node.attr("id", "PIN"); xml_node.text(u_p); xml_par.append(xml_node);
				xml_node = $(XML("Argument")); xml_node.attr("id", "AREAS"); xml_node.text(msk); xml_par.append(xml_node);
				xml_send(xml_request);
			}	
		}
		//
		if (!manual_onoff_flg)
			u_p = "";
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			if (widget_obj.mode == "scene")
			{
				if ("widget_scenery_device_list" in pag_table_new)
				{
					pag_table_new["widget_scenery_device_list"].header_home_switch();
					pag_table_new["widget_scenery_device_list"].footer_home_switch();
				}
				else if ("widget_add_scenery" in pag_table_new)
				{
					pag_table_new["widget_add_scenery"].header_home_switch();
					pag_table_new["widget_add_scenery"].footer_home_switch();
				}
				pag_clear(".JSdialog2");
			}
			else
			{
				header_home_group(widget_obj);	
			}
		});
		//
		if (widget_obj.mode == "scene")
		{
			if ("widget_scenery_device_list" in pag_table_new)
			{
				$("#backTitle").html("{LANG_SCENERY_CHOOSE_DEV}");
			}
			else if ("widget_add_scenery" in pag_table_new)
			{
				$("#backTitle").html("{LANG_SCENERY}");
			}
		}
		else
		{
			$("#backTitle").html("{LANG_HOME}");	
		}
	},
	footer_home_switch: function()
	{
		var widget_obj = this;
		footer_home_switch_init();
		//
		//
		if (widget_obj.mode == "scene")//modalita' scenario
		{
			var label_scenery_btn_str = "{LANG_S_ADD_SCENERY}";
			//
			if (widget_obj.areas_ins_msk == "none" && widget_obj.areas_dis_msk == "none" && widget_obj.areas_part_msk == "none")
				;
			else
				label_scenery_btn_str = "{LANG_S_MOD_SCENERY}";
			//
			draw_footer_button(label_scenery_btn_str, "footer_h2_a_a");
		}
		else
		{
			draw_footer_button("{LANG_OK_PROCEED}", "footer_h2_a_a");
		}
		//
		$("#footer_h2_a_a").click(function()
		{
			if (widget_obj.mode == "scene") //modalita' scenario
			{
				widget_obj.par_save();
				//
				if ("widget_add_scenery" in pag_table_new)
				{
					pag_table_new["widget_add_scenery"].header_home_switch();
					pag_table_new["widget_add_scenery"].footer_home_switch();
				}
				else
				{
					tyu("ERR: widget_add_scenery not present");
				}
				//
				if (widget_obj.idx == "none")
				{//id device catalogo, codice del comando, delay, nome device, nome comando, sottocategoria device
					pag_table_new["widget_add_scenery"].cmds.push
					(
						[
							widget_obj.devid
							, widget_obj.cmd_areas
							, 0
							, widget_obj.dev_name
							, widget_obj.insdispar_associative[widget_obj.cmd_areas]
							, WS_DEV_ALARM_CEN_STR
							, widget_obj.areas_cmd_msk
						]
					);
					pag_table_new["widget_add_scenery"].add_item_cmds_list();
					pag_table_new["widget_add_scenery"].footer_home_switch();
				}
				else
				{
					pag_table_new["widget_add_scenery"].cmds[widget_obj.idx] = 
					[
						widget_obj.devid
						, widget_obj.cmd_areas
						, pag_table_new["widget_add_scenery"].cmds[widget_obj.idx][2]
						, widget_obj.dev_name
						, widget_obj.insdispar_associative[widget_obj.cmd_areas]
						, WS_DEV_ALARM_CEN_STR
						, widget_obj.areas_cmd_msk
					];
					pag_table_new["widget_add_scenery"].refresh_item_cmds_list(widget_obj.idx);
				}
				pag_clear(".JSdialog2");
				pag_clear(".JSdialog");
				$(".JSdialog").hide();
			}
			else
			{
				if (!$(this).hasClass("disabled"))
				{
					widget_obj.par_send();
					$("#header-home-page2 .close").trigger("click");	
				}
			}
		});
		//
		//
		footer_button_rotate();
		scrollList(this);
	}
};