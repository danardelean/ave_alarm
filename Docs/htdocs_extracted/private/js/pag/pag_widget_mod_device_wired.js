pag_table_new["widget_mod_device_wired"] = {
	onload: function()
	{
		var widget_obj = this;
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		this.init_wired_i_tbl();
		this.init_wired_o_tbl();
		this.init_wired_k_tbl();
		//
		//name
		$("#container_wired .name").val(this.xml_any.children("name").text());
		//
		for (var i = 0; i < this.xml_wired_i_tbl.length; i++)
		{
			if (wire_in_tst(Number(this.xml_wired_i_tbl[i].children("ord").text())))
			{				
				var label = "{LANG_DISABLED}";
				if (this.xml_wired_i_tbl[i].children("cfg_wire_in_mode").text() != "" + WIRE_N_DISABLED)
					label = this.xml_wired_i_tbl[i].children("name").text();
				$("#container_wired .wired_input:eq(" + i + ") .sl_selector").html(label);
				global_apply_diag("#container_wired", "wired_input:eq(" + i + ")", "{LANG_WIZARD_WIRED_IN} "+(i+1), "wired", i, "widget_mod_device_wired");
			}
		}
		for (var i = 0; i < this.xml_wired_o_tbl.length; i++)
		{
			var label = "{LANG_DISABLED}";
			if (this.xml_wired_o_tbl[i].children("wire_out_mode").text() != "0")
				label = this.xml_wired_o_tbl[i].children("name").text();
			$("#container_wired .wired_output:eq(" + i + ") .sl_selector").html(label);
			global_apply_diag("#container_wired", "wired_output:eq(" + i + ")", "{LANG_WIZARD_WIRED_OUT} "+(i+1), "wired", i, "widget_mod_device_wired");
		}
		for (var i = 0; i < this.xml_wired_k_tbl.length; i++)
		{
			var label = "{LANG_DISABLED}";
			if (this.xml_wired_k_tbl[i].children("wire_key_mode").text() != "0")
				label = this.xml_wired_k_tbl[i].children("name").text();
			$("#container_wired .wired_key:eq(" + i + ") .sl_selector").html(label);
			global_apply_diag("#container_wired", "wired_key:eq(" + i + ")", "{LANG_WIZARD_WIRED_KEY} "+(i+1), "wired", i, "widget_mod_device_wired");
		}
		//
		item_fw_ver("#container_wired", this.xml_any);
		//
		item_delete("#container_wired", this);
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "MENU")
		{		
			if (conf.children("act").text() == "LOAD")
			{
				if (conf.children("res").text() == "LOADED")
				{
					if (conf.children("page").text() == WS_AREA_STR)
					{
						//
					}
				}
				else if (conf.children("res").text() == "ERROR")
				{
					//alert("_EO_1" + conf.children("res").text()+": "+conf.children("desc").text());
				}
			}
			else if (conf.children("act").text() == "SAVE")
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
					//alert("_EO_2" + conf.children("res").text()+": "+conf.children("desc").text());
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
					//alert("_EO_3" + conf.children("res").text()+": "+conf.children("desc").text());
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
	},
	onclose: function()
	{
		//
	},
	//	
	name: "widget_mod_device_wired",
	xml_any: xml_any_tbl[any_ind],
	title: xml_any_tbl[any_ind].children("name").text(),
	xml_wired_i_tbl: [],
	xml_wired_o_tbl: [],
	xml_wired_k_tbl: [],
	xml_any_arr: [],
	//
	par_save: function()
	{
		ena_save = true;
		//
		save_item_name("#container_wired", this);
		//
		this.xml_any_arr = this.xml_wired_i_tbl.concat(this.xml_wired_o_tbl.concat(this.xml_wired_k_tbl));
	},
	init_wired_i_tbl: function()
	{
		for (var i = 0; i < xml_any_tbl.length; i++)
		{
			if (xml_any_tbl[i].children("subcategory").text() == WS_DEV_ALARM_WIRED_STR)
				if (xml_any_tbl[i].children("wire_type").text() == "1")
					if (wire_in_tst(Number(xml_any_tbl[i].children("ord").text())))
						this.xml_wired_i_tbl.push(xml_any_tbl[i].clone());
		}
		for (var i = 0; i < xml_any_tbl.length; i++)
		{
			if (xml_any_tbl[i].children("subcategory").text() == WS_DEV_ALARM_WIRED_STR)
				if (xml_any_tbl[i].children("wire_type").text() == "1")
					if (wire_in_virt_tst(Number(xml_any_tbl[i].children("ord").text())))
						this.xml_wired_i_tbl.push(xml_any_tbl[i].clone());
		}
	},
	init_wired_o_tbl: function()
	{
		for (var i = 0; i < xml_any_tbl.length; i++)
		{
			if (xml_any_tbl[i].children("subcategory").text() == WS_DEV_ALARM_WIRED_STR)
				if (xml_any_tbl[i].children("wire_type").text() == "5")
					this.xml_wired_o_tbl.push(xml_any_tbl[i].clone());
		}
	},
	init_wired_k_tbl: function()
	{
		for (var i = 0; i < xml_any_tbl.length; i++)
		{
			if (xml_any_tbl[i].children("subcategory").text() == WS_DEV_ALARM_WIRED_STR)
				if (xml_any_tbl[i].children("wire_type").text() == "3")
					this.xml_wired_k_tbl.push(xml_any_tbl[i].clone());
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