pag_table_new["widget_thermostat_device"] = {
	onload: function()
	{
		pag_clear(".home .JSdialog");
		//
		dynamic_page_act(this);
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		$(".JSdialog2").show();
		var widget_obj = this;
		//
		//
		//COMMONS
		if (this.mode == "scene")
		{
			var cmds_str = xml_file_configuration.find("Devices Device[deleted='FALSE'][id='"+this.devid+"'] Commands").text();
			//
			var cmds_code = cmds_str.split(",");
			//
			var xml_cfg_cmd = xml_file_configuration.find("Categories Category[id='IOT'] Subcategories Subcategory[id='" + this.subcat + "'] Commands");
			for (var i = 0; i < cmds_code.length; i++)
			{
				this.cmds[i] = [];
				this.cmds[i][0] = cmds_code[i];
				this.cmds[i][1] = xml_cfg_cmd.children("Command[id='"+cmds_code[i]+"']").attr("desc");
			}
		}
		//
		picker("#container_thermostat_device");
		//
		if (widget_obj.selected == "none")
		{
			global_picker_init_simple("#container_thermostat_device", "temp_wint", "temp_wint", "200", null, "[50, 350]");
			global_picker_init_simple("#container_thermostat_device", "temp_summ", "temp_summ", "200", null, "[50, 350]");
		}
		else
		{
			var temperatures = pag_table_new["widget_add_scenery"].cmds[this.idx][6].split(",");
			var tempeWinter = this.removeFirstCharIfZero(temperatures[0].split(".").join(''));
			var tempeSummer = this.removeFirstCharIfZero(temperatures[1].split(".").join(''));
			global_picker_init_simple("#container_thermostat_device", "temp_wint", "temp_wint", tempeWinter, null, "[50, 350]");
			global_picker_init_simple("#container_thermostat_device", "temp_summ", "temp_summ", tempeSummer, null, "[50, 350]");
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
	name: "widget_thermostat_device",
	title: $("#widget_thermostat_device").attr("data-name-device"),
	//scenery var
	selected: $(".widget_thermostat_device").attr("data-selected"),
	idx: $(".widget_thermostat_device").attr("data-idx"),//index of cmds variable in "widget_add_scenery"
	//global var
	devid: $(".widget_thermostat_device").attr("data-devid"),//id del device del catalogo da passare a cmds in "widget_add_scenery"
	subcat: $(".widget_thermostat_device").attr("data-subcat"),//subcategory del device, disponibile anche in xml_any_tbl_scenery
	xml_any_tbl_idx: $(".widget_thermostat_device").attr("data-xml-any-tbl-idx"),
	mode: $(".widget_thermostat_device").attr("data-scenery-mode"),
	cmds: [],
	//
	removeFirstCharIfZero: function(str)
	{
		if (str.charAt(0) === '0')
		{
			return str.substring(1);
		}
		return str;
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
		if (widget_obj.mode == "scene")
		{
			$("#footer_h2_a_a").click(function()
			{
				var tempeWinter = $("#pick_temp_summ").text().zeroAdder(3);
				var tempeSummer = $("#pick_temp_wint").text().zeroAdder(3);
				var temperatures = tempeSummer[0] + tempeSummer[1] + "." + tempeSummer[2] + "," + tempeWinter[0] + tempeWinter[1] + "." + tempeWinter[2]; 
				//
				if (widget_obj.selected == "none")
				{	//id device catalogo, codice del comando, ritardo, nome dispositivo, nome comando, sottocategoria dispositivo, temperatura 						
					pag_table_new["widget_add_scenery"].cmds.push
					(
						[
							widget_obj.devid
							, widget_obj.cmds[0][0]
							, 0
							, xml_any_tbl_scenery[widget_obj.xml_any_tbl_idx].children("name").text()
							, widget_obj.cmds[0][1]
							, widget_obj.subcat
							, temperatures
						]
					);
					pag_table_new["widget_add_scenery"].add_item_cmds_list();
					pag_table_new["widget_add_scenery"].refresh_item_cmds_list(pag_table_new["widget_add_scenery"].cmds.length - 1);
				}
				else
				{
					pag_table_new["widget_add_scenery"].cmds[widget_obj.idx] = 
					[
						widget_obj.devid
						, pag_table_new["widget_add_scenery"].cmds[widget_obj.idx][1]
						, pag_table_new["widget_add_scenery"].cmds[widget_obj.idx][2]
						, pag_table_new["widget_add_scenery"].cmds[widget_obj.idx][3]
						, pag_table_new["widget_add_scenery"].cmds[widget_obj.idx][4]
						, widget_obj.subcat
						, temperatures
					];
					pag_table_new["widget_add_scenery"].refresh_item_cmds_list(widget_obj.idx);
				}
				//
				if ("widget_add_scenery" in pag_table_new)
				{
					pag_table_new["widget_add_scenery"].header_home_switch();
					pag_table_new["widget_add_scenery"].footer_home_switch();
				}
				pag_clear(".JSdialog2");
				pag_clear(".JSdialog");
			});
		}
		//
		footer_button_rotate();
		scrollList(this);
	}
};