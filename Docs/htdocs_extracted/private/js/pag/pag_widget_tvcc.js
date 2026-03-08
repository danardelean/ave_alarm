pag_table_new["widget_tvcc"] = {
	onload: function()
	{
		var widget_obj = this;
		//
		pag_clear(".home .JSdialog");
		dynamic_page_act(this);
		//
		this.header_home_switch();
		this.footer_home_switch();
		//
		away_from_home();
		//
		this.loaded = true;
		//
		//
		this.goto_quad();
		//
		$(".widget_tvcc .camSlide").off("click").click(function(event)
		{
			event.stopPropagation();
			if (!$(".camSlide_btn_inside", this).hasClass("disabled"))
			{
				var thisTvcc = $(this).parent();
				var nextTvcc = thisTvcc.next(":not([id^='notvcc'])");
				var prevTvcc = thisTvcc.prev(":not([id^='notvcc'])");
				if ($(this).hasClass("right"))
				{
					if (nextTvcc.length > 0)
					{
						$(".camSlide", thisTvcc).hide();
						thisTvcc.removeClass("fullscr g_bg_dark alwaysOnTop").addClass("quad");
						//
						nextTvcc.addClass("fullscr g_bg_dark alwaysOnTop").removeClass("quad");
						$(".camSlide", nextTvcc).show();
						//
						widget_obj.arrow_slide_cam();
					}
				}
				else if ($(this).hasClass("left"))
				{
					if (prevTvcc.length > 0)
					{
						$(".camSlide", thisTvcc).hide();
						thisTvcc.removeClass("fullscr g_bg_dark alwaysOnTop").addClass("quad");
						//
						prevTvcc.addClass("fullscr g_bg_dark alwaysOnTop").removeClass("quad");
						$(".camSlide", prevTvcc).show();
						//
						widget_obj.arrow_slide_cam();
					}
				}
				
			}
		});
		//
		camHolder.registerCams(this);
		camHolder.startCams();
	},
	onrecv_confirmation: function(conf)
	{
		var xml_img = conf.children("Image");
		camHolder.getResponse(xml_img.attr("device"), xml_img.text());
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
	name: "widget_tvcc",
	title: "{LANG_WIDGET_TVCC_TITLE}",
	loaded: false,
	//
	goto_quad: function()
	{
		$(".widget_tvcc .tvcc.quad").show();
		$(".widget_tvcc .tvcc.single").hide();
	},
	backto_single: function()
	{
		$(".widget_tvcc .tvcc.quad").hide();
		$(".widget_tvcc .tvcc.single").show();
	},
	arrow_slide_cam: function()
	{
		var currentTvcc = $("." + this.name + " .tvcc.quad .apportion.fullscr");
		var nextTvcc = currentTvcc.next(":not([id^='notvcc'])");
		var prevTvcc = currentTvcc.prev(":not([id^='notvcc'])");
		//
		if (nextTvcc.length > 0)
			$(".camSlide.right .camSlide_btn_inside", currentTvcc).removeClass("disabled");
		else
			$(".camSlide.right .camSlide_btn_inside", currentTvcc).addClass("disabled");
		//
		if (prevTvcc.length > 0)
			$(".camSlide.left .camSlide_btn_inside", currentTvcc).removeClass("disabled");
		else
			$(".camSlide.left .camSlide_btn_inside", currentTvcc).addClass("disabled");
	},
	header_home_switch: function()
	{
		var widget_obj = this;
		header_home_switch_init(this);
		//
		$("#header-home-page2 .close").off("click").click(function()
		{
			var fullscrCam = $("." + widget_obj.name + " .tvcc.quad .apportion.fullscr");
			if (fullscrCam.length > 0)
			{
				fullscrCam.removeClass("fullscr g_bg_dark alwaysOnTop").addClass("quad");
				fullscrCam.children(".camSlide").hide();
			}
			else
			{
				header_home_group(widget_obj);
			}
		});
		//
		$("#backTitle").html("{LANG_HOME}");
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