pag_table_new["widget_confirm"] = {
	onload: function()
	{
		this.header_home_switch();
		this.footer_home_switch();
		//
		//
		var guiConfirm = $("#widget_confirm");
		//
		$("#widget_confirm_type").html(guiConfirm.attr("data-type"));
		$("#widget_confirm_name").html("&#34;" + guiConfirm.attr("data-name") + "&#34;");
		//
		var count = parseInt(guiConfirm.attr("data-delay"));	
		confirm_delay();
		function confirm_delay()
		{
			count--;
			if (count < 0)
			{
				if (device_pair_auto_mode_flg)
				{//parte per gestire il pairing automatico multiplo
					send_get_auto(this.name);
				}
				else
				{
					here_context = guiConfirm.parent();
					pag_change("HERE", guiConfirm.attr("data-redirect"));
				}
			}
			else
			{
				setTimeout(confirm_delay, 1000);
			}
		}
	},
	onrecv_confirmation: function(conf)
	{//parte per gestire il pairing automatico multiplo
		if (conf.attr("type") == "PNP")
		{
			if (conf.children("act").text() == "GET_AUTO")
			{
				if (conf.children("res").text() == "GETTING")
				{
					//
				}
			}
		}
	},
	onrecv_indication: function(indi)
	{//parte per gestire il pairing automatico multiplo
		if (indi.attr("type") == "PNP")
		{
			if (indi.children("act").text() == "DETECTION")
			{
				xml_any_nobind = null;
				//
				if (indi.children("res").text() == "DETECTED")
				{
					xml_any_bind = indi.find("par item").first();
					//
					here_context = $("." + this.name).parent();
					pag_change("HERE", "widget_device");
				}
				else if (indi.children("res").text() == "EMPTY")
				{
					device_pair_auto_mode_flg = false;
					//
					this.abort_detection();
					here_context = $("." + this.name).parent();
					pag_change("HERE", "widget_devices_add");
				}
			}
		}
	},
	onclose: function()
	{
		//
	},
	//
	name: "widget_confirm",
	title: "",
	//
	//parte per gestire il pairing automatico multiplo
	abort_detection: function()
	{
		xml_request = xml_request_head_build("PNP");
		xml_par = $(XML("act")); xml_par.text("ABORT"); xml_request.append(xml_par);	
		xml_send(xml_request);
	},
	clean_page: function()
	{
		this.abort_detection();
	},
	//
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").addClass("disabled");
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