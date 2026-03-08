pag_table_new["widget_mod_device_wired_o"] = {
	onload: function()
	{
		var widget_obj = this;
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		//name
		$("#container_wired .name").val(this.xml_any.children("name").text());
		//
		item_room("#container_wired", this.xml_any);
		//
		global_load_areas_switcher("#area_container_mod", this.xml_any, this);
		//
		item_mode_wired("#container_wired", this);
		//
		picker("#container_wired");
		//
		item_timing_wired("#container_wired", this);
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
	name: "widget_mod_device_wired_o",
	xml_any: xml_any_tbl[any_ind],
	title: xml_any_tbl[any_ind].children("name").text(),
	wire_out_mode: xml_any_tbl[any_ind].children("wire_out_mode").text(),
	wire_out_mode_domo_par: xml_any_tbl[any_ind].children("wire_out_mode_domo_par").text(),
	wire_out_mode_repeat_eve: xml_any_tbl[any_ind].children("wire_out_mode_repeat_eve").text(),
	wire_out_mode_repeat_par: xml_any_tbl[any_ind].children("wire_out_mode_repeat_par").text(),
	//
	par_save: function()
	{
		ena_save = true;
		//
		save_item_name("#container_wired", this);
		//
		this.xml_any.find("room").text(id_room_selected);
		//
		this.xml_any.children("wire_out_mode").text(this.wire_out_mode);
		this.xml_any.children("wire_out_mode_repeat_par").text(this.wire_out_mode_repeat_par);
		this.xml_any.children("wire_out_mode_domo_par").text(this.wire_out_mode_domo_par);
		this.xml_any.children("wire_out_mode_repeat_eve").text(this.wire_out_mode_repeat_eve);
		//
		save_item_area("#container_wired", this);
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