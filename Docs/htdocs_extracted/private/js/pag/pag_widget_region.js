pag_table_new["widget_region"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		//
		//save_step(WS_WIZARD_STEP_REGION);
		//
		var tema_light_flg = isTema("light_tema");
		//
		var region_button_id = [];
		var region_button_desc = [];
		xml_file_configuration.children("regions").children("region").each(function(index)
		{
			region_button_desc[index] = $(this).attr("desc");
			region_button_id[index] = $(this).attr("id");
		});
		this.item_button_sort(region_button_desc, region_button_id);
		//
		$("#region_button_container .region_button.item").remove();
		for (var i = 0; i < region_button_desc.length; i++)
		{
			$("#region_button_container").append("<div class='region_button item' data-id='" + region_button_id[i] + "'>" + region_button_desc[i] + "</div>");
		}
		//
		scrollListArrowCheck(this);
		//
		var offsetScroll = $("#region_button_container .region_button.item").off("click").click(function()
		{
			$(this)
				.attr("data-checked", "1")
				.attr("style", "background:url({TMPL_DIR}res/dot_light_green.png) no-repeat 70% center;")
				.css("color", tema_light_flg ? "rgba(0,0,0,1)" : "rgba(255,255,255,1)")
				.siblings(".region_button.item")
				.attr("data-checked", "0")
				.removeAttr("style")
				.css("color", tema_light_flg ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)");
		}).filter("[data-id='" + region + "']").trigger("click")[0].offsetTop;
		//
		scrollTo(this, offsetScroll);
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "MENU")
		{
			if (conf.find("act").text() == "SAVE")
			{
				if (conf.find("res").text() == "SAVED")
				{
					if (conf.find("page").text() == "SET")
					{
						cen_set_xml.children("region").text(this.local_region);
						cen_set_xml.children("new_region").text("0");
						//
						region = this.local_region;
						//
						$("#header-home-page2 .close").trigger("click");
					}
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
		//xml_any = null;
		$("#wizard_header_info").text("");
	},
	//
	name: "widget_region",
	title: "{LANG_WIZARD_REGION_TITLE}",
	local_region: "",
	//
	save_region: function()
	{
		this.local_region = $(".region_button.item[data-checked='1']").attr("data-id");
		//
		xml_request = xml_request_head_build("MENU", "widget_region");
		xml_par = $(XML("act")); xml_par.text("SAVE"); xml_request.append(xml_par);		
		xml_par = $(XML("page")); xml_par.text("SET"); xml_request.append(xml_par);		
		xml_par = $(XML("par")); xml_request.append(xml_par);		
		xml_item = $(XML("region")); xml_item.text(this.local_region); xml_par.append(xml_item);		
		xml_send(xml_request);
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
		$("#header-home-page2 .close").off("click").click(function()
		{
			header_nav_lang_naz_group();
		});
		//
		$("#backTitle").html("{LANG_NAV_SETTINGS_GENERIC_LANG_NAZ}");
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
			widget_obj.save_region();
		});
		//
		//
		footer_button_rotate();
		scrollList(this);
	}
};