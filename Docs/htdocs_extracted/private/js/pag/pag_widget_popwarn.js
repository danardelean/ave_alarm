pag_table_new["widget_popwarn"] = {
	onload: function()
	{
		var widget_obj = this;
		//
		//
		//
		if ($(".widget_popwarn").closest(".JSdialog2").length > 0)
			this.pw_container = ".JSdialog2";
		//
		$(".home "+this.pw_container).addClass("full_scr");
		$(this.pw_container).show();
		//
		$("#popwarn_title").html($(".widget_popwarn").attr("data-titlep"));
		$("#popwarn_message").html($(".widget_popwarn").attr("data-message"));
		//
		if ($(".widget_popwarn").attr("data-okAbortStr") != "none")
		{
			var okStr = $(".widget_popwarn").attr("data-okAbortStr").cutBefore("|");
			var abortStr = $(".widget_popwarn").attr("data-okAbortStr").cutAfter("|");
			$("#popwarn_ok span, #popwarn_ok2 span").html(okStr);
			$("#popwarn_abort span, #popwarn_abort2 span").html(abortStr);
		}
		//
		$(window).off("resize." + widget_obj.name).on("resize." + widget_obj.name, function ()
		{
			var centering = ($("#popwarn_message").parent().height() - $("#popwarn_message").height()) / 2;
			if (centering > 0) $("#popwarn_message").css("top", centering + "px");
		}).trigger("resize." + widget_obj.name);
		if (QT)
			$(window).off("resize." + widget_obj.name);
		//
		$(".popwarn_footer > div").hide();
		//
		this.popMode = $(".widget_popwarn").attr("data-cmd");
		if (this.popMode == "ok")
		{
			$("#popwarn_ok2")
				.show()
				.unbind()
				.click(function()
				{
					$($(".widget_popwarn").attr("data-exf").replace(/\\/g, '')).trigger("on_pw_ok");
					pag_clear(widget_obj.pw_container);
				});
		}
		else if (this.popMode == "okab")
		{
			$("#popwarn_abort")
				.show()
				.unbind()
				.click(function()
				{
					pag_clear(widget_obj.pw_container);
				});
			$("#popwarn_ok")
				.show()
				.unbind()
				.click(function()
				{
					$($(".widget_popwarn").attr("data-exf").replace(/\\/g, '')).trigger("on_pw_ok");
					pag_clear(widget_obj.pw_container);
				});
		}
		else if (this.popMode == "okab_act")
		{
			$("#popwarn_abort")
				.show()
				.unbind()
				.click(function()
				{
					$($(".widget_popwarn").attr("data-exf").replace(/\\/g, '')).trigger("on_pw_ab");
					pag_clear(widget_obj.pw_container);
				});
			$("#popwarn_ok")
				.show()
				.unbind()
				.click(function()
				{
					$($(".widget_popwarn").attr("data-exf").replace(/\\/g, '')).trigger("on_pw_ok");
					pag_clear(widget_obj.pw_container);
				});
		}
		else if (this.popMode == "ab")
		{
			$("#popwarn_abort2")
				.show()
				.unbind()
				.click(function()
				{
					$($(".widget_popwarn").attr("data-exf").replace(/\\/g, '')).trigger("on_pw_ab");
					pag_clear(widget_obj.pw_container);
				});
		}
		else if (this.popMode == "input")
		{
			$("#popwarn_message").remove();
			$("#popwarn_input").attr("placeholder", $(".widget_popwarn").attr("data-message"));
			$("#popwarn_input").val(this.extra).show();
			//
			$("#popwarn_abort")
				.show()
				.unbind()
				.click(function()
				{
					$($(".widget_popwarn").attr("data-exf").replace(/\\/g, '')).trigger("on_pw_ab");
					pag_clear(widget_obj.pw_container);
				});
			$("#popwarn_ok")
				.show()
				.unbind()
				.click(function()
				{
					if (!$(this).hasClass("disabled"))
					{
						$($(".widget_popwarn").attr("data-exf").replace(/\\/g, '')).trigger("on_pw_ok");
						//pag_clear(widget_obj.pw_container); PUT THIS INTO "on_pw_ok"	
					}
				});
		}
		else if (this.popMode == "input_hex")
		{
			$("#popwarn_message").remove();
			$("#popwarn_input").attr("placeholder", $(".widget_popwarn").attr("data-message"));
			$("#popwarn_input").val(this.extra).show();
			$("#popwarn_input").attr("data-kbd", "HEX");
			//
			$("#popwarn_abort")
				.show()
				.unbind()
				.click(function()
				{
					$($(".widget_popwarn").attr("data-exf").replace(/\\/g, '')).trigger("on_pw_ab");
					pag_clear(widget_obj.pw_container);
				});
			$("#popwarn_ok")
				.show()
				.unbind()
				.click(function()
				{
					if (!$(this).hasClass("disabled"))
					{
						$($(".widget_popwarn").attr("data-exf").replace(/\\/g, '')).trigger("on_pw_ok");
						//pag_clear(widget_obj.pw_container); PUT THIS INTO "on_pw_ok"	
					}
				});
		}
		else if (this.popMode == "input_telegest")
		{
			$("#popwarn_message").remove();
			$("#popwarn_input").attr("placeholder", $(".widget_popwarn").attr("data-message"));
			$("#popwarn_input").val(this.extra).show();
			//
			$("#popwarn_abort")
				.show()
				.unbind()
				.click(function()
				{
					$($(".widget_popwarn").attr("data-exf").replace(/\\/g, '')).trigger("on_pw_ab");
				}).find("span").html("{LANG_STOP}");
			$("#popwarn_ok")
				.show()
				.unbind()
				.click(function()
				{
					$($(".widget_popwarn").attr("data-exf").replace(/\\/g, '')).trigger("on_pw_ok");
				}).find("span").html("{LANG_START}");
			//
			$("#popwarn_input").attr("data-kbd", "09");
			//$("#popwarn_icon").show();
		}
		else if (this.popMode == "wbar")
		{
			var canvasElem = document.getElementById("move_bar");
			this.ctx = canvasElem.getContext("2d");			
			//
			$("#popwarn_abort2")
				.show()
				.off("click")
				.click(function()
				{
					$($(".widget_popwarn").attr("data-exf").replace(/\\/g, '')).trigger("on_pw_ab_w");
					pag_clear(widget_obj.pw_container);
				});
			//
			$("#popwarn_message").css("top", "20px");
			$("#popwarn_input").remove();
			$("#pw_bar").show();
			//
			//
			var fill_color = "#f7b600";
			if (isTema("light_tema"))
				fill_color = "#00A5B4";
			else if (isTema("teal_tema"))
				fill_color = "#00FFFF";
			this.canvasWidth = $("#pw_bar").width() + 1;
			canvasElem.width = this.canvasWidth;
			this.numRectTot = Math.ceil(this.canvasWidth / (26 + 7));
			this.ctx.fillStyle = fill_color;
			this.popBar_drawer(this.extra);
			$(window).off("resize." + widget_obj.name).on("resize." + widget_obj.name, function ()
			{
				widget_obj.canvasWidth = $("#pw_bar").width() + 1;
				canvasElem.width = widget_obj.canvasWidth;
				widget_obj.numRectTot = Math.ceil(widget_obj.canvasWidth / (26 + 7));
				widget_obj.ctx.fillStyle = fill_color;
				if (widget_obj.g_ys_str != "")
					widget_obj.popBar_drawer(widget_obj.g_ys_str);
			});
		}
		else if (this.popMode == "wbar_nobtn")
		{
			var canvasElem = document.getElementById("move_bar");
			this.ctx = canvasElem.getContext("2d");
			//
			$("#popwarn_message").css("top", "20px");
			$("#popwarn_input").remove();
			$("#pw_bar").show();
			//
			//
			var fill_color = "#f7b600";
			if (isTema("light_tema"))
				fill_color = "#00A5B4";
			else if (isTema("teal_tema"))
				fill_color = "#00FFFF";
			this.canvasWidth = $("#pw_bar").width() + 1;
			canvasElem.width = this.canvasWidth;
			this.numRectTot = Math.ceil(this.canvasWidth / (26 + 7));
			this.ctx.fillStyle = fill_color;
			this.popBar_drawer(this.extra);
			$(window).off("resize." + widget_obj.name).on("resize." + widget_obj.name, function ()
			{
				widget_obj.canvasWidth = $("#pw_bar").width() + 1;
				canvasElem.width = widget_obj.canvasWidth;
				widget_obj.numRectTot = Math.ceil(widget_obj.canvasWidth / (26 + 7));
				widget_obj.ctx.fillStyle = fill_color;
				if (widget_obj.g_ys_str != "")
					widget_obj.popBar_drawer(widget_obj.g_ys_str);
			});
		}
		else if (this.popMode == "new_okab_act")
		{
			$(".widget_popwarn .popwarn_body").children().not(".new_message_wrap").hide();
			$(".widget_popwarn .popwarn_body .new_message_wrap").css("display", "table");
			$("#popwarn_new_message").html($(".widget_popwarn").attr("data-message"));
			//
			$("#popwarn_abort")
				.show()
				.unbind()
				.click(function()
				{
					$($(".widget_popwarn").attr("data-exf").replace(/\\/g, '')).trigger("on_pw_ab");
					pag_clear(widget_obj.pw_container);
				});
			$("#popwarn_ok")
				.show()
				.unbind()
				.click(function()
				{
					$($(".widget_popwarn").attr("data-exf").replace(/\\/g, '')).trigger("on_pw_ok");
					pag_clear(widget_obj.pw_container);
				});
		}
		else if (this.popMode == "new_ok")
		{
			$(".widget_popwarn .popwarn_body").children().not(".new_message_wrap").hide();
			$(".widget_popwarn .popwarn_body .new_message_wrap").css("display", "table");
			$("#popwarn_new_message").html($(".widget_popwarn").attr("data-message"));
			//
			$("#popwarn_ok2")
				.show()
				.unbind()
				.click(function()
				{
					$($(".widget_popwarn").attr("data-exf").replace(/\\/g, '')).trigger("on_pw_ok");
					pag_clear(widget_obj.pw_container);
				});
		}
		else if (this.popMode == "nobtn")
		{
			//
		}
		else if (this.popMode == "nobtn_trig")
		{
			$($(".widget_popwarn").attr("data-exf").replace(/\\/g, '')).trigger("on_pw_trig");
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
		$(this.pw_container).hide();
		$(".home " + this.pw_container).removeClass("full_scr");
	},
	//
	name: "widget_popwarn",
	pw_container: ".JSdialog",
	popMode: "none",
	extra: $(".widget_popwarn").attr("data-extra"),
	ctx: null,
	canvasWidth: 0,
	numRectTot: 0,
	g_ys_str: "", 
	//
	popBar_drawer: function(g_ys) //funzione da chiamare esternamente per impostare la barra di progresso, formato variabile "g_ys" = "parte/totale"
	{
		this.g_ys_str = g_ys;
		var curt = this.g_ys_str.split("/");
		var numRect = Math.round((this.numRectTot/curt[1])*curt[0]);
		//
		this.ctx.beginPath();
		this.ctx.clearRect(0, 0, this.canvasWidth, 40);
		for (var i = 0; i < numRect; i++)
			this.ctx.fillRect((i*7)+(26*i), 0, 26, 40);
	}
};