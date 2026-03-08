pag_table_new["widget_log_rf"] = {
	onload: function()
	{
		xml_request = xml_request_head_build("TEST");
		xml_par = $(XML("type")); xml_par.text("RF"); xml_request.append(xml_par);
		xml_par = $(XML("act")); xml_par.text("START");
		xml_request.append(xml_par);
		xml_send(xml_request);
	},
	onrecv_confirmation: function(conf)
	{
		//
	},
	onrecv_indication: function(indi)
	{
		if (indi.attr("type") == "TEST")
		{
			if (indi.children("type").text() == "RF")
			{
				if (indi.children("content").length > 0)
				{
					$("#log_rf_container .log_rf_item:nth-child("+this.log_count+") p").text(indi.children("content").text());
					$("#log_rf_container .log_rf_item:nth-child("+(this.log_count+1)+") p").text("");
					this.log_count++;
					if (this.log_count > 6) this.log_count = 1;
				}
			}
		}
	},
	onclose: function()
	{
		xml_request = xml_request_head_build("TEST");
		xml_par = $(XML("type")); xml_par.text("RF"); xml_request.append(xml_par);
		xml_par = $(XML("act")); xml_par.text("STOP");
		xml_request.append(xml_par);
		xml_send(xml_request);
		//
		send_logOut();
	},
	//
	name: "widget_log_rf",
	log_count: 1
};