pag_table_new["widget_waiting"] = {
	onload: function()
	{
		var infinite_wait = false;
		var max_wait = 20;
		if (this.countdown != "none")
			max_wait = Number(this.countdown);
		if (max_wait == 0)
			infinite_wait = true;
		//
		//
		if (waiting_status == 1)
		{
			$("[data-curpage='widget_waiting']").show();
			var i = 0;
			$("#waiting_point").html("");
			function points_builder()
			{
				if (!infinite_wait)
					max_wait--;
				else
					max_wait = 1;
				//
				if (i++ > 4)
				{
					i = 0;
					$("#waiting_point").html(".");
				}
				else
				{
					$("#waiting_point").append(".");
				}
				//
				if (("widget_waiting" in pag_table_new) && (max_wait > 0) && $("[data-curpage='widget_waiting']").is(":visible") && waiting_status == 1)
					setTimeout(points_builder, 1000);
				else
					$("[data-curpage='widget_waiting']").hide();
			}
			points_builder();
		}
		else
		{
			$("[data-curpage='widget_waiting']").hide();
		}
	},
	onrecv_confirmation: function(conf)
	{
		//
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
	name: "widget_waiting",
	countdown: $(".widget_waiting").attr("data-countdown")
};