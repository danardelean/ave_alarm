pag_table_new["widget_test_field_meter"] = {
	onload: function()
	{
		page_act("#seeking-page");
		schema_act("#seeking-page", "quadrant_abcd");
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		var widget_obj = this;
		//
		//
		/*this.ctx433_1 = document.getElementById("g433_1").getContext("2d");
		this.ctx433_2 = document.getElementById("g433_2").getContext("2d");
		this.ctx868_1 = document.getElementById("g868_1").getContext("2d");
		this.ctx868_2 = document.getElementById("g868_2").getContext("2d");*/
		//
		/*$(window).off("resize." + widget_obj.name).on("resize." + widget_obj.name, function ()
		{
			widget_obj.canvasWidth = $("#container_field_meter .graph:first").width() + 1;
			$("#g433_1").attr("width", widget_obj.canvasWidth + "px");
			$("#g433_2").attr("width", widget_obj.canvasWidth + "px");
			$("#g868_1").attr("width", widget_obj.canvasWidth + "px");
			$("#g868_2").attr("width", widget_obj.canvasWidth + "px");
			widget_obj.numRectTot = Math.ceil(widget_obj.canvasWidth / (26 + 7));
			widget_obj.ctx433_1.fillStyle = "#f7b600";
			widget_obj.ctx433_2.fillStyle = "#f7b600";
			widget_obj.ctx868_1.fillStyle = "#f7b600";
			widget_obj.ctx868_2.fillStyle = "#f7b600";
			if (widget_obj.g_ys_str[widget_obj.ctx433_1.canvas.id] != null)
				widget_obj.bar_drawer(widget_obj.ctx433_1, widget_obj.g_ys_str[widget_obj.ctx433_1.canvas.id]);
			if (widget_obj.g_ys_str[widget_obj.ctx433_2.canvas.id] != null)
				widget_obj.bar_drawer(widget_obj.ctx433_2, widget_obj.g_ys_str[widget_obj.ctx433_2.canvas.id]);
			if (widget_obj.g_ys_str[widget_obj.ctx868_1.canvas.id] != null)
				widget_obj.bar_drawer(widget_obj.ctx868_1, widget_obj.g_ys_str[widget_obj.ctx868_1.canvas.id]);
			if (widget_obj.g_ys_str[widget_obj.ctx868_2.canvas.id] != null)
				widget_obj.bar_drawer(widget_obj.ctx868_2, widget_obj.g_ys_str[widget_obj.ctx868_2.canvas.id]);
		}).trigger("resize." + widget_obj.name);*/
		//
		xml_request = xml_request_head_build("MENU");
		xml_par = $(XML("act")); xml_par.text("START"); xml_request.append(xml_par);		
		xml_par = $(XML("page")); xml_par.text(WS_TEST_STR); xml_request.append(xml_par);		
		xml_par = $(XML("par")); xml_par.text(DEVICE_TEST_FIELD); xml_request.append(xml_par);
		xml_send(xml_request);
	},
	onrecv_confirmation: function(conf)
	{
		//
	},
	onrecv_indication: function(indi)
	{
		if (indi.attr("type") == "MENU")
		{
			if (indi.children("page").text() == WS_TEST_STR)
			{
				if (indi.children("act").text() == "METER")
				{
					var widget_obj = this;
					//
					var level_chan_1 = indi.find("par item[id='1'] value").text();//Math.round(100*Math.random());
					var level_chan_2 = indi.find("par item[id='2'] value").text();
					var level_chan_3 = indi.find("par item[id='3'] value").text();
					var level_chan_4 = indi.find("par item[id='4'] value").text();
					//
					/*if (level_chan_1 != "-1") this.bar_drawer(this.ctx433_1, level_chan_1);
					if (level_chan_2 != "-1") this.bar_drawer(this.ctx433_2, level_chan_2);
					if (level_chan_3 != "-1") this.bar_drawer(this.ctx868_1, level_chan_3);
					if (level_chan_4 != "-1") this.bar_drawer(this.ctx868_2, level_chan_4);
					*/
					var level_chan_1_num = Number(level_chan_1);
					var level_chan_2_num = Number(level_chan_2);
					var level_chan_3_num = Number(level_chan_3);
					var level_chan_4_num = Number(level_chan_4);
					if (level_chan_1_num < 0) level_chan_1 = "0";
					else if (level_chan_1_num > 100) level_chan_1 = "100";
					if (level_chan_2_num < 0) level_chan_2 = "0";
					else if (level_chan_2_num > 100) level_chan_2 = "100";
					if (level_chan_3_num < 0) level_chan_3 = "0";
					else if (level_chan_3_num > 100) level_chan_3 = "100";
					if (level_chan_4_num < 0) level_chan_4 = "0";
					else if (level_chan_4_num > 100) level_chan_4 = "100";
					//
					//
					this.prettyprinter("g433_1", level_chan_1);
					this.prettyprinter("g433_2", level_chan_2);
					this.prettyprinter("g868_1", level_chan_3);
					this.prettyprinter("g868_2", level_chan_4);
				}
			}
		}
	},
	onclose: function()
	{
		//
	},
	//
	name: "widget_test_field_meter",
	title: "{LANG_WIZARD_FIELD_METER_TITLE}",
	xml_any: xml_any_tbl[any_ind],
	bodyWrapper: "set elsewhere",
	bar_mem:
	{
		g433_1:
		{
			delay_flg: true
			, t_out_delay: 0
		}
		, g433_2:
		{
			delay_flg: true
			, t_out_delay: 0
		}
		, g868_1:
		{
			delay_flg: true
			, t_out_delay: 0
		}
		, g868_2:
		{
			delay_flg: true
			, t_out_delay: 0
		}
	},
	clean_page: function()
	{
		xml_request = xml_request_head_build("MENU");
		xml_par = $(XML("act")); xml_par.text("STOP"); xml_request.append(xml_par);		
		xml_par = $(XML("page")); xml_par.text(WS_TEST_STR); xml_request.append(xml_par);		
		xml_par = $(XML("par")); xml_par.text(DEVICE_TEST_FIELD); xml_request.append(xml_par);
		xml_send(xml_request);
		//
		pag_clear("#seeking-page .quadrant");
	},
	prettyprinter: function(gui_id, level_chan)
	{
		var widget_obj = this;
		//
		if ($("#" + gui_id).width()/$("#" + gui_id).parent().width()*100 >= 20 && level_chan < 20)
		{
			if (this.bar_mem[gui_id].delay_flg)
			{
				this.bar_mem[gui_id].delay_flg = false;
				this.bar_mem[gui_id].t_out_delay = setTimeout(function()
				{
					widget_obj.bar_mem[gui_id].delay_flg = true;
					$("#" + gui_id).finish().animate({width: level_chan + "%"}, "fast");
					$("#" + gui_id).closest(".field").find(".fm_title span").html("&nbsp;&nbsp;" + level_chan + "%");
				}, 2 * 1000);
			}
		}
		else
		{
			this.bar_mem[gui_id].delay_flg = true;
			clearTimeout(this.bar_mem[gui_id].t_out_delay);
			$("#" + gui_id).finish().animate({width: level_chan + "%"}, "fast");
			$("#" + gui_id).closest(".field").find(".fm_title span").html("&nbsp;&nbsp;" + level_chan + "%");
		}
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
		footer_button_rotate();
		scrollList(this);
	}
};