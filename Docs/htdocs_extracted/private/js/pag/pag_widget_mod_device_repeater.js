pag_table_new["widget_mod_device_repeater"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		//
		//name
		global_item_init("#container_repeater", "name", "input", "name", this);
		//room
		item_room("#container_repeater", this.xml_any);
		//
		global_load_areas_switcher("#area_container_mod", this.xml_any, this);
		//
		//repeater devices
		var trovato = false;
		this.devList.children("dev").each(function()
		{
			if ($(this).attr("selected") == 1)
			{
				$("#container_repeater .dev_list .sl_selector").html("{LANG_ITEM_AT_LEAST_ONE}");
				trovato = true;
				return false;
			}
		});
		if (!trovato)
			$("#container_repeater .dev_list .sl_selector").html("{LANG_ITEM_NONE}");
		global_apply_diag("#container_repeater", "dev_list", "{LANG_REPEATER_DEVICE_LIST_STR}", "repeaterDeviceList", null, "widget_mod_device_repeater", null);
		//
		//
		item_protection("#container_repeater", this.xml_any, this);
		//led allarme
		item_led("#container_repeater", this.xml_any, this);
		//
		item_repeater_startstop("#container_repeater", this);
		//
		item_fw_ver("#container_repeater", this.xml_any);
		//
		item_delete("#container_repeater", this);
		//
		//
		picker("#container_repeater");
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
		if (indi.attr("type") == "MENU")
		{
			if (indi.children("act").text() == "DELETE")
			{
				if (indi.children("res").text() == "DELETED")
				{
					if (indi.children("page").text() == WS_DEV_STR)
					{
						$("#header-home-page2 .close").trigger("click", [true]);
					}
				}
			}
		}
		else if (indi.attr("type") == "STATE")
		{
			var child_state_str = indi.children("State").text();
			//
			if (child_state_str == WS_DEV_ALARM_REPEATER_PAIR_ON_STR)
			{
				if (this.allow_start)
				{
					clearTimeout(this.t_out_start);
					//
					$("#container_repeater #start_stop .item_tag")
						.html("{LANG_REPEATER_PROG_STOP_STR}")
						.parent().switchClass("disabled", "stop")
						.siblings(".switcher").switchClass("starting", "started");
					$("#container_repeater .bind_dev").append("<span>{LANG_IN_PROGRESS}</span>");
					//
					this.allow_start = false;
				}
			}
			else if (child_state_str == WS_DEV_ALARM_REPEATER_PAIR_OFF_STR)
			{
				if (this.allow_stop)
				{
					clearTimeout(this.t_out_stop);
					//
					$("#container_repeater #start_stop .item_tag")
						.html("{LANG_REPEATER_PROG_START_STR}")
						.parent().switchClass("disabled", "start")
						.siblings(".switcher").switchClass("starting", "stopped").trigger("switch_state_changer", [["off"]]);
					$("#container_repeater .bind_dev span").remove();
					//
					this.allow_stop = false;
				}
			}
		} 
	},
	onclose: function()
	{
		this.pair_stop("no_response");
	},
	//
	name: "widget_mod_device_repeater",
	xml_any: xml_any_tbl[any_ind],
	title: xml_any_tbl[any_ind].children("name").text(),
	devList: xml_any_tbl[any_ind].children("dev_list"),
	devListSave: xml_any_tbl[any_ind].children("dev_list").clone(),
	//
	t_out_start: null,
	t_out_start: null,
	allow_start: false,
	allow_stop: false,
	//
	par_save: function()
	{
		ena_save = true;
		//
		this.xml_any.find("room").text(id_room_selected);
		//
		save_item_name("#container_repeater", this);
		//
		save_item_protection("#container_repeater", this.xml_any, this);
		//
		save_item_led("#container_repeater", this.xml_any, this);
		//
		xml_any_tbl[any_ind].children("dev_list").html(this.devListSave.children());
		//
		save_item_area("#container_repeater", this);
	},
	pair_start: function()
	{
		xml_request = xml_request_head_build("MENU", "widget_mod_device_repeater");
		xml_par = $(XML("act")); xml_par.text("PROGRAM"); xml_request.append(xml_par);
		xml_par = $(XML("page")); xml_par.text(WS_DEV_STR); xml_request.append(xml_par);
		xml_par = $(XML("par"));
		xml_node = $(XML("item")); xml_node.attr("id", "1"); xml_par.append(xml_node); xml_request.append(xml_par);
		xml_node2 = $(XML("id")); xml_node2.text(this.xml_any.children("id").text()); xml_node.append(xml_node2);
		xml_node2 = $(XML("act")); xml_node2.text("entry"); xml_node.append(xml_node2);
		xml_send(xml_request);
	},
	pair_stop: function(response_flg)
	{
		xml_request = xml_request_head_build("MENU", response_flg == "no_response" ? null : "widget_mod_device_repeater");
		xml_par = $(XML("act")); xml_par.text("PROGRAM"); xml_request.append(xml_par);
		xml_par = $(XML("page")); xml_par.text(WS_DEV_STR); xml_request.append(xml_par);
		xml_par = $(XML("par"));
		xml_node = $(XML("item")); xml_node.attr("id", "1"); xml_par.append(xml_node); xml_request.append(xml_par);
		xml_node2 = $(XML("id")); xml_node2.text(this.xml_any.children("id").text()); xml_node.append(xml_node2);
		xml_node2 = $(XML("act")); xml_node2.text("exit"); xml_node.append(xml_node2);
		xml_send(xml_request);
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