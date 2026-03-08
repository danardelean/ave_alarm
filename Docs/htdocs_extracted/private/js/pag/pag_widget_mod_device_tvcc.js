pag_table_new["widget_mod_device_tvcc"] = {
	onload: function()
	{
		var widget_obj = this;
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		//name
		$("#container_tvcc .name").val(this.xml_any.children("name").text() + (this.binding ? " " + this.xml_any.children("prg").text() : ""));
		//room
		item_room("#container_tvcc", this.xml_any);
		//
		picker("#container_tvcc");
		//
		global_item_init("#container_tvcc", "tvcc_mac", "input", "sn", this);
		global_item_init("#container_tvcc", "tvcc_ip", "input", "ip", this);
		//
		global_item_init("#container_tvcc", "tvcc_port", "input", "port", this);
		//
		global_item_init("#container_tvcc", "tvcc_path", "input", "url", this);
		//
		item_address_mode("#container_tvcc", this);
		//
		global_item_init("#container_tvcc", "user", "input", "user", this);
		//
		global_item_init("#container_tvcc", "pass", "input", "pwd", this);
		//
		item_frame("#container_tvcc", this);
		//
		if (!this.binding)
			item_visual("#container_tvcc", this, this.xml_any.children("tag").text());
		//
		item_photo("#container_tvcc", this);
		//
		item_fw_ver("#container_tvcc", this.xml_any);
		//
		if (!this.binding)
			item_delete("#container_tvcc", this);
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
		else if (conf.attr("type") == "DEVICE_CMD")
		{
			clearTimeout(this.t_out_visual);
			this.t_out_visual = setTimeout(function()
			{
				$("#container_tvcc .visual .info").html("");
				$("#container_tvcc .visual").removeAttr("style");
				$("#container_tvcc #get_frame").removeClass("disabled");
			}, 10*1000);
			if (conf.children("Image").text() != "")
				$("#container_tvcc .visual .info").html("");
			$("#container_tvcc .visual").attr("style", "background-image: url(data:image/jpg;base64,"+conf.children("Image").text()+");");
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
		else if (indi.attr("type") == "PNP")
		{
			if (indi.children("act").text() == "STORE")
			{
				if (indi.children("res").text() == "STORED")
				{
					//
				}
				else if (indi.children("res").text() == "ABORTED")
				{
					//
				}
				else if (indi.children("res").text() == "ERROR")
				{				
					//
				}
			}
		}
	},
	onclose: function()
	{
		//
	},
	//
	name: "widget_mod_device_tvcc",
	xml_any: $(".widget_mod_device_tvcc").attr("data-context") == "binding" ? xml_tvcc : xml_any_tbl[any_ind],
	title: $(".widget_mod_device_tvcc").attr("data-context") == "binding" ? xml_tvcc.children("name").text() : xml_any_tbl[any_ind].children("name").text(),
	binding: $(".widget_mod_device_tvcc").attr("data-context") == "binding",
	uansciot_fleg: true,
	t_out_visual: null,
	//
	par_save: function()
	{
		ena_save = true;
		//
		save_item_name("#container_tvcc", this);
		//save_room
		this.xml_any.find("room").text(id_room_selected);
		//
		var addrm = Number(this.xml_any.children("ip_address_mode_flg").text());
		if (addrm == 0)
			$("#container_tvcc .tvcc_mac").global_save_item_val({trama_ptr: this.xml_any.children("sn"), position: 1, check_func: this.mac_check});
		else if (addrm == 1)
			$("#container_tvcc .tvcc_ip").global_save_item_val({trama_ptr: this.xml_any.children("ip"), position: 1, check_func: this.ip_check});
		//
		if (addrm == 0)
			if (this.xml_any.children("sn").text().length == 17)
				this.xml_any.children("sn").html(this.xml_any.children("sn").text().split(":"));
		//
		$("#container_tvcc .tvcc_port").global_save_item_val({trama_ptr: this.xml_any.children("port"), position: 1, check_func: this.port_check});
		//
		save_item_global("#container_tvcc", "tvcc_path", "input", "url", this);
		//
		save_item_global("#container_tvcc", "user", "input", "user", this);
		//
		save_item_global("#container_tvcc", "pass", "input", "pwd", this);
		//
		save_item_picker("#container_tvcc", "snapshot_frame_cnt", "frame", this.xml_any);
		//
		save_item_picker("#container_tvcc", "snapshot_delay_sec", "photo", this.xml_any);
	},
	par_send: function()
	{
		this.par_save();
		//
		xml_request = xml_request_head_build("PNP", "widget_mod_device_tvcc");
		xml_par = $(XML("act")); xml_par.text("STORE"); xml_request.append(xml_par);
		xml_par = $(XML("par")); xml_request.append(xml_par);
		xml_par.append(this.xml_any);
		if (ena_save) xml_send(xml_request);
	},
	port_check: function()
	{
		var value_str = "";
		value_str += $(this).val();
		if (isNaN(value_str))
			return false;
		if (value_str >= 1 && value_str <= 65535)
			return true;
		else
			return false;
	},
	ip_check: function()
	{
		var val_array = $.trim($(this).val()).split(".");
		if (val_array.length != 4)
		{
			return false;
		}
		else
		{
			for (var i = 0; i < val_array.length; i++)
			{
				if (isNaN(val_array[i]))
					return false;
				else if (val_array[i] < 0 || val_array[i] > 255 || val_array[i] == "")
					return false;
			}
		}
		return true;
	},
	mac_check: function()
	{
		var value_str = "";
		value_str += $(this).val();
		$(this).val($(this).val().toUpperCase());
		if (value_str.search(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/g) == -1)	
			if (value_str.search(/[a-f0-9]{12}/i) == -1)
				return false;
			else
				return true;
		else
			return true;
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		if (!this.binding)
			header_mod_device(this);
		else
			$("#header-home-page2 .close").off("click").click(function()
			{
				pag_change("#seeking-page .quadrant_abcd.abcd", "widget_devices_add");
			});
	},
	footer_home_switch: function()
	{
		var widget_obj = this;
		footer_home_switch_init();
		//
		draw_footer_button("{LANG_OK}", "footer_h2_a_a");
		if (!this.binding)
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