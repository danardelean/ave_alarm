pag_table_new["widget_cmd_device_cen"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		//
		$(".JSdialog2").show();
		var widget_obj = this;
		//
		var tema_path = (isTema("light_tema") ? "light/" : "");
		//
		//COMMONS
		if (this.mode == "scene")
		{
			var cmds_str = xml_file_configuration.find("Devices Device[deleted='FALSE'][id='"+this.devid+"'] Commands").text();
			//
			var cmds_code = cmds_str.split(",");
			//
			var xml_cfg_cmd = xml_file_configuration.find("Categories Category[id='ALARM'] Subcategories Subcategory[id='"+this.subcat+"'] Commands");
			for (var i = 0; i < cmds_code.length; i++)
			{
				this.cmds[i] = [];
				this.cmds[i][0] = cmds_code[i];
				this.cmds[i][1] = xml_cfg_cmd.children("Command[id='"+cmds_code[i]+"']").attr("desc");
			}
			//
			$("#container_cmd_cen .quadrant.bc").children(":not(.f"+this.cmds.length+")").hide();
			//
			for (var i = 0; i < this.cmds.length; i++)
			{
				$("#container_cmd_cen .quadrant.bc div:visible div:eq("+i+") p")
					.text(this.cmds[i][1])
					.attr("data-code", this.cmds[i][0]);
			}
			//
			switch(this.subcat)
			{
				case WS_DEV_ALARM_RELAY_STR:
				case WS_DEV_ALARM_BUS_RELAY_STR:
					$("#container_cmd_cen .quadrant.ad").css("background-image", "url({TMPL_DIR}res/" + tema_path + "relay_icon.png)");
					break;
				case WS_DEV_ALARM_SIR_STR:
					$("#container_cmd_cen .quadrant.ad").css("background-image", "url({TMPL_DIR}res/" + tema_path + "sir_icon.png)");
					break;
				case WS_DEV_ALARM_SIRI_STR:
					$("#container_cmd_cen .quadrant.ad").css("background-image", "url({TMPL_DIR}res/" + tema_path + "sir_icon.png)");
					break;
				case WS_DEV_ALARM_WIRED_STR:
					$("#container_cmd_cen .quadrant.ad").css("background-image", "url({TMPL_DIR}res/" + tema_path + "relay_icon.png)");
					break;
				default:
					$("#container_cmd_cen .quadrant.ad").css("background-image", "url({TMPL_DIR}res/" + tema_path + "disabled.png)");
					break;
			}
			//
			if (SIL)
				$("#container_cmd_cen .info_dev .room").hide();
			else;
		}
		//
		if (this.mode == "scene")
		{
			$("#container_cmd_cen .quadrant.bc div:visible div").click(function()
			{
				if ($(this).children("p").hasAttr("data-code"))
				{
					$("#container_cmd_cen .quadrant.bc div:visible div").removeClass("yefnt").attr("data-checked", "0");
					//
					if ($(this).attr("data-checked") == "1")
					{
						$(this).removeClass("yefnt").attr("data-checked", "0");
					}
					else
					{
						$(this).addClass("yefnt").attr("data-checked", "1");
					}
				}
			});
			//
			$("#container_cmd_cen .quadrant.bc div:visible div p[data-code='" + this.selected + "']").parent().trigger("click");
			//
			$("#container_cmd_cen .info_dev .type").append(" " + device_associative_array[this.subcat]);
			$("#container_cmd_cen .info_dev .type").append(wired_type_str(this.subcat, xml_any_tbl_scenery[this.xml_any_tbl_idx]));
			$("#container_cmd_cen .info_dev .name").append(xml_any_tbl_scenery[this.xml_any_tbl_idx].children("name").text());
			$("#container_cmd_cen .info_dev .area").append(xml_any_tbl_scenery[this.xml_any_tbl_idx].children("area_alarm").text());
		}
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
		//
	},
	onclose: function()
	{
		$(".JSdialog2").hide();
	},
	//
	name: "widget_cmd_device_cen",
	title: "{LANG_SELECT_CMD}",
	//scenery var
	selected: $(".widget_cmd_device").attr("data-selected"),
	idx: $(".widget_cmd_device").attr("data-idx"),//index of cmds variable in "widget_add_scenery"
	//global var
	devid: $(".widget_cmd_device").attr("data-devid"),//id del device del catalogo da passare a cmds in "widget_add_scenery"
	subcat: $(".widget_cmd_device").attr("data-subcat"),//subcategory del device, disponibile anche in xml_any_tbl_scenery
	xml_any_tbl_idx: $(".widget_cmd_device").attr("data-xml-any-tbl-idx"),
	mode: $(".widget_cmd_device").attr("data-scenery-mode"),
	cmds: [],
	//
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			if (widget_obj.mode == "scene")
			{
				pag_clear(".JSdialog2");
				if (widget_obj.selected == "none")
				{
					if ("widget_scenery_device_list" in pag_table_new)
					{
						pag_table_new["widget_scenery_device_list"].header_home_switch();
						pag_table_new["widget_scenery_device_list"].footer_home_switch();
						pag_table_new["widget_scenery_device_list"].gui_detail();
					}
				}
				else
				{
					if ("widget_add_scenery" in pag_table_new)
					{
						pag_table_new["widget_add_scenery"].header_home_switch();
						pag_table_new["widget_add_scenery"].footer_home_switch();
						pag_table_new["widget_add_scenery"].func_item_cmds_list();
					}		
				}
			}
		});
		//
		if (widget_obj.mode == "scene")
		{
			if (widget_obj.selected == "none")
			{
				if ("widget_scenery_device_list" in pag_table_new)
				{
					$("#backTitle").html("{LANG_SCENERY_CHOOSE_DEV}");
				}
			}
			else
			{
				if ("widget_add_scenery" in pag_table_new)
				{
					$("#backTitle").html("{LANG_SCENERY}");
				}		
			}
		}
	},
	footer_home_switch: function()
	{
		var widget_obj = this;
		footer_home_switch_init();
		//
		//
		draw_footer_button("{LANG_OK}", "footer_h2_a_a");
		//
		$("#footer_h2_a_a").click(function()
		{
			if (widget_obj.mode == "scene")
			{
				if ($("#container_cmd_cen .quadrant.bc div:visible div[data-checked='1']").length == 1)
				{
					if (widget_obj.selected == "none")
					{	//id device catalogo, codice del comando, delay, nome device, nome comando, sottocategoria device 						
						pag_table_new["widget_add_scenery"].cmds.push
						(
							[
								widget_obj.devid
								, $("#container_cmd_cen .quadrant.bc div:visible div[data-checked='1'] p").attr("data-code")
								, 0
								, xml_any_tbl_scenery[widget_obj.xml_any_tbl_idx].children("name").text()
								, $("#container_cmd_cen .quadrant.bc div:visible div[data-checked='1'] p").text()
								, widget_obj.subcat
							]
						);
						pag_table_new["widget_add_scenery"].add_item_cmds_list();
					}
					else
					{
						pag_table_new["widget_add_scenery"].cmds[widget_obj.idx] = 
						[
							widget_obj.devid
							, $("#container_cmd_cen .quadrant.bc div:visible div[data-checked='1'] p").attr("data-code")
							, pag_table_new["widget_add_scenery"].cmds[widget_obj.idx][2]
							, pag_table_new["widget_add_scenery"].cmds[widget_obj.idx][3]
							, $("#container_cmd_cen .quadrant.bc div:visible div[data-checked='1'] p").text()
							, widget_obj.subcat
						];
						pag_table_new["widget_add_scenery"].refresh_item_cmds_list(widget_obj.idx);
					}
				}
				if ("widget_add_scenery" in pag_table_new)
				{
					pag_table_new["widget_add_scenery"].header_home_switch();
					pag_table_new["widget_add_scenery"].footer_home_switch();
				}
				pag_clear(".JSdialog2");
				pag_clear(".JSdialog");
			}
		});
		//
		//
		footer_button_rotate();
		scrollList(this);
	}
};