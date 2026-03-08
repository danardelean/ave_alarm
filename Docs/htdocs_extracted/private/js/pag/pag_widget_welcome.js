pag_table_new["widget_welcome"] = {
	onload: function()
	{
		if (already_started_com) 
		{
			welcome_init();
			//
			$("#connecting_point").hide();
			$("#welcome_content").fadeIn();
			$("#welcome_content_start").off("click").click(function()
			{
				pag_change(".wizard .wizard_body", "widget_lang");
			});
			if (NICE) $(".widget_welcome .welcome_title").attr("style", "background:url({TMPL_DIR}res/welcome_title.png) no-repeat 0% center;");
			else if (SIL) $(".wrapper.sil .footer_wizard").removeClass("g_bg_dark");
			else if (DIY) $(".widget_welcome .welcome_title").attr("style", "background:url({TMPL_DIR}res/welcome_title_diy.png) no-repeat 10% center;");
		}
		else
		{
			$("#welcome_content").hide();
			$("#connecting_point").show();
			var i = 0;
			var point_number = 4;
			var point = $("#connecting_point").attr("data-style");
			function cp()
			{
				if (point != $("#connecting_point").attr("data-style"))
				{
					point = $("#connecting_point").attr("data-style");
					i = point_number + 1;
				}
				if (i++ > point_number)
				{
					i = 0;
					$("#connecting_point").html(point);
				}
				else
					$("#connecting_point").append(point);
				if ($(".widget_welcome").length > 0)
					t_out_main_secondary = setTimeout(cp, 1000);
			}
			cp();
		}
		welcome_loaded = true;
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
	name: "widget_welcome"
};