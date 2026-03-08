pag_table_new["widget_mod_device_pstn"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		//
		//
		picker("#container_pstn");
		//name
		global_item_init("#container_pstn", "name", "input", "name", this);
		//
		$("#container_pstn .region .sl_selector").html(xml_file_configuration.children("regions").children("region[id='" + this.xml_any.children("country").text() + "']").attr("desc"));
		global_apply_diag("#container_pstn", "region", "{LANG_WIZARD_REGION_TITLE}", "region", null, "widget_mod_device_pstn");
		//
		global_switcher_binder("#container_pstn", "force", null, this.xml_any.children("force_flg").text(), {condizione: "1", messaggio: "{LANG_EN50131}"});
		//
		global_switcher_binder("#container_pstn", "switchboard_ena", null, this.xml_any.children("pabx_ena_flg").text());
		$("#container_pstn .switchboard_ena").on("toggle_tick_click", function()
		{
			if ($(this).attr("data-checked") == "0")
				$("#container_pstn .switchboard").parent().addClass("invisible");
			else if ($(this).attr("data-checked") == "1")
				$("#container_pstn .switchboard").parent().removeClass("invisible");
		}).trigger("toggle_tick_click");
		//
		$("#container_pstn .switchboard").val(this.xml_any.children("pabx_val").text());
		//
		global_picker_init("#container_pstn", "ring_answ_cnt", null, this);
		//
		item_delete("#container_pstn", this);
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
				else if (indi.children("res").text() == "ERROR")
				{
					if (indi.children("page").text() == WS_DEV_STR)
					{
						alert(indi.children("res").text()+": "+indi.children("desc").text());
					}
				}
			}
		}
	},
	onclose: function()
	{
		//
	},
	//
	name: "widget_mod_device_pstn",
	xml_any: xml_any_tbl[any_ind],
	title: xml_any_tbl[any_ind].children("name").text(),
	local_region_pstn: xml_any_tbl[any_ind].children("country").text(),
	//
	par_save: function()
	{
		ena_save = true;
		//
		save_item_name("#container_pstn", this);
		//
		this.xml_any.children("country").text(this.local_region_pstn);
		//
		save_item_toggled("#container_pstn", "force_flg", "force", this.xml_any);
		//
		save_item_toggled("#container_pstn", "pabx_ena_flg", "switchboard_ena", this.xml_any);
		//
		save_item_picker("#container_pstn", "ring_answ_cnt", "ring_answ_cnt", this.xml_any);
		//
		$("#container_pstn .switchboard").global_save_item_val({trama_ptr: this.xml_any.children("pabx_val"), position: 0, check_func: this.check_switchboard});
	},
	check_switchboard: function()
	{
		if ($.trim($("#container_pstn .switchboard").val()).length == 1 && $.isNumeric($.trim($("#container_pstn .switchboard").val())))
			return true;
		else
			return false;
	},
	item_button_sort: function(ib_desc, ib_id)
	{
		var temp = 0;
		var j = ib_desc.length-1;
		while (j > 0) 
		{
			for (var i = 0; i < j; i++) 
			{
				if (ib_desc[i].toLowerCase() > ib_desc[i+1].toLowerCase())
				{
					temp = ib_desc[i];
					ib_desc[i] = ib_desc[i+1];
					ib_desc[i+1] = temp;
					//
					temp = ib_id[i];
					ib_id[i] = ib_id[i+1];
					ib_id[i+1] = temp;
				}
			}
			j--;
		}	
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