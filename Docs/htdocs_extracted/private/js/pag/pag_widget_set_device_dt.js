pag_table_new["widget_set_device_dt"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		//
		storing = false;
		//
		item_room(".widget_set_device_dt", this.xml_any);
		//
		global_load_areas_switcher("#area_container_set", this.xml_any, this);
		//
		var widget_device_type_str = xml_file_configuration
			.find("Categories")
			.find("Category[id='" + xml_any_tbl[any_ind].find("category").text() + "']")
			.find("Subcategories").find("Subcategory[id='"+ this.xml_any
			.find("subcategory").text() + "']")
			.attr("name");
		if (this.xml_any.children("name").text() != "")
			widget_device_type_str = this.xml_any.children("name").text();
		//
		var nameDev = widget_device_type_str + " " + this.xml_any.find("prg").text();
		global_item_init(".widget_set_device_dt", "name", "input", null, null, null, nameDev, this.xml_any.children("name").attr("maxlength"));
		$("#header-home-page2 .header_title").text(nameDev);
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "MENU")
		{
			if (conf.children("act").text() == "SAVE")
			{
				if (conf.children("res").text() == "SAVED")
				{
					$(".footer_container_btn_inside").trigger("any_saved");
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
		//
	},
	//
	name: "widget_set_device_dt",
	xml_any: xml_any_tbl[any_ind],
	//
	par_save: function()
	{
		ena_save = true;
		//
		save_item_name(".widget_set_device_dt", this);
		//
		this.xml_any.find("room").text(id_room_selected);
		//
		save_item_area("#area_container_set", this);
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			pag_change("#seeking-page .quadrant_abcd", "widget_device_wireless");
		});
		//
		$("#backTitle").html("{LANG_WIZARD_DEVICE_WIRELESS_TITLE_R}");
	},
	footer_home_switch: function()
	{
		var widget_obj = this;
		footer_home_switch_init();
		//
		draw_footer_button("{LANG_OK}", "footer_h2_a_a");
		//
		$("#footer_h2_a_a").click(function()
		{
			global_send_dev_mod_save(widget_obj);
			//
			if (ena_save)
				startWaitingScr();
		}).on("any_saved", function()
		{
			stopWaitingScr();
			//
			var footer_type_str = xml_file_configuration
				.find("Categories")
				.find("Category[id='"+xml_any_tbl[any_ind].find("category").text()+"']")
				.find("Subcategories").find("Subcategory[id='"+xml_any_tbl[any_ind]
				.find("subcategory").text()+"']")
				.attr("name");
			pag_change("#seeking-page .quadrant_abcd.abcd", "widget_confirm", footer_type_str, xml_any_tbl[any_ind].children("name").text(), "widget_devices_add");
		});
		//
		footer_button_rotate();
		scrollList(this);
	}
};