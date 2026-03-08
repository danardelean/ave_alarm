pag_table_new["widget_room"] = {
	onload: function()
	{
		var widget_obj = this;
		$("#room_arrow_cont").css("left", $("#room_arrow_cont").parent().width()/2-$("#room_arrow_cont").width()/2);
		$(".home .JSdialog").addClass("full_scr");
		$(".JSdialog").show();
		//
		//
		this.local_room_list.children("item").filter(function()
		{
			if ($(this).children("ena").text() == 1)
			{
				widget_obj.local_room_list_enatrue_size++;
				return true;
			}
			else
			{
				return false;
			}
		})
		.each(function()
		{
			$("#room_container")
				.append("<div class=\"item\" data-id=\""+$(this).children("id").text()+"\" data-factory=\""+$(this).children("factory").text()+"\" name=\""+$(this).children("name").text()+"\">" +
							"<div class=\"room_del\"></div>" +
							"<div class=\"room_mod\" data-owner=\"#room_container .item[data-id='"+$(this).children("id").text()+"'] .input\"></div>" +
							"<div class=\"tick\"></div>" +
							(typeof webbridge === 'undefined' ? 
	/*maxlen maxpix here*/		"<input class=\"input\" type=\"text\" value=\""+$(this).children("desc").text()+"\" readonly />" : 
	/*maxlen maxpix here*/		"<p class=\"input\">"+$(this).children("desc").text()+"</p>") +
						"</div>");
		});
		//gui detail
		if ($("#room_container").children().length < 3)
			$("#room_container .item:last").addClass("btb");
		if (this.local_room_list_enatrue_size == this.local_room_list_max_size)
			$("#new_room").css("color", "rgba(255,255,255,0.4)");
		else
			$("#new_room").css("color", "rgba(255,255,255,1)");
		//
		var item = $("#room_container .item[data-id='"+id_room_selected+"']");
		item.children(".tick").attr("style", "background:url({TMPL_DIR}res/tick.png) no-repeat center center");
		item.children(".input").css("color", "rgba(255,255,255,1)");
		item.attr("data-checked", "true");
		//
		$("#room_container .item .room_mod").click(function()
		{
			if (typeof webbridge === 'undefined')
			{
				if ($(this).parent().attr("data-edit") == null)
				{
					//disattiva tutti gli edit attivi
					$("#room_container")
						.children(".item[data-edit]")
						.children(".room_mod")
						.each(function()
						{
							$(this).attr("style", "background:url({TMPL_DIR}res/mod.png) no-repeat center center;");
							$(this).siblings(".input").attr("readonly", "");
							//
							var gui_item = $(this).parent();
							widget_obj.local_room_list.children("item").filter(function()
							{
								if ($(this).children("id").text() == gui_item.attr("data-id"))
									return true;
								else
									return false;
							}).children("desc").text(gui_item.children(".input").val());
							//
							$(this).parent().removeAttr("data-edit");
						});
					//
					//attiva l'edit cliccato
					$(this).attr("style", "background:url({TMPL_DIR}res/mod_edit.png) no-repeat center center;");
					$(this).siblings(".input").removeAttr("readonly");
					$(this).siblings(".input").focus().select();
					$(this).parent().attr("data-edit", "true");
				}
				else
				{
					//disattiva l'edit cliccato
					$(this).attr("style", "background:url({TMPL_DIR}res/mod.png) no-repeat center center;");
					$(this).siblings(".input").attr("readonly", "");
					//
					var gui_item = $(this).parent();
					widget_obj.local_room_list.children("item").filter(function()
					{
						if ($(this).children("id").text() == gui_item.attr("data-id"))
							return true;
						else
							return false;
					}).children("desc").text(gui_item.children(".input").val());
					//
//					$("#room_container .item .room_mod").attr("style", "background:url({TMPL_DIR}res/mod.png) no-repeat center center;");
//					$("#room_container .item .input").attr("readonly", "");
//					$("#room_container .item").removeAttr("data-edit");
					//
					$(this).parent().removeAttr("data-edit");
					$(this).parent().css("background-color", "");
				}
			}
			else
			{
				$(".head_button").hide();
				var desc_text = webbridge.openKeyboard("FREE", $($(this).attr("data-owner")).text(), $($(this).attr("data-owner")).text(), $(this).siblings(".input").attr("maxlength"), $(this).siblings(".input").attr("data-maxpix"));
				$(".head_button").show();
				$($(this).attr("data-owner")).text(desc_text);
				//aggiorna trama
				var gui_item = $(this).parent();
				widget_obj.local_room_list.children("item").filter(function()
				{
					if ($(this).children("id").text() == gui_item.attr("data-id"))
						return true;
					else
						return false;
				}).children("desc").text(desc_text);
			}	
		});
		$("#room_container .item[data-factory='0'] .room_del").click(function()
		{
			if ($(this).parent().attr("data-checked") === "true") //se selezionato, prima di eliminarlo sceglie il primo factory default disponibile
				$("#room_container .item[data-factory='1']:first .input").trigger("click");
			//
			var gui_item = $(this).parent();
			widget_obj.local_room_list
				.children("item")
				.filter(function()
				{
					if ($(this).children("id").text() == gui_item.attr("data-id"))
						return true;
					else
						return false;
				})
				.children("ena").text("0");
			//
			widget_obj.local_room_list_enatrue_size--;
			//
			$("#new_room").css("color", "rgba(255,255,255,1)");
			//
			$(this).parent().remove();
			//
			if ($("#room_container").children().length < 3)
				$("#room_container .item:last").addClass("btb");
		});
		$("#room_container .item[data-factory='1'] .room_del").css("opacity", "0.4");
		//parte di init
		//
		$("#room_esc").click(function()
		{
			pag_clear(".JSdialog");
		});
		//
		$("#ok_room_diag").click(function()
		{
			if (typeof webbridge === 'undefined')
			{
				//rimozone di eventuali edit in corso
				$("#room_container")
					.children(".item[data-edit]")
					.children(".room_mod")
					.each(function()
					{
						$(this).attr("style", "background:url({TMPL_DIR}res/mod.png) no-repeat center center;");
						$(this).siblings(".input").attr("readonly", "");
						//
						var gui_item = $(this).parent();
						widget_obj.local_room_list.children("item").filter(function()
						{
							if ($(this).children("id").text() == gui_item.attr("data-id"))
								return true;
							else
								return false
						}).children("desc").text(gui_item.children(".input").val());
						//
						$(this).parent().removeAttr("data-edit");
					});
			}
			//
			//controllo nomi room vuoti
			var trovato = false;
			$("#room_container .item").each(function()
			{
				if ($.trim(typeof webbridge === 'undefined' ? $(this).children(".input").val() : $(this).children(".input").text()).length < 1)
				{
					if (!trovato)
					{
						if (typeof webbridge === 'undefined') $(this).children(".room_mod").trigger("click");
					}
					trovato = true;
					$(this).css("background-color", "rgba(255,0,0,0.2)");
				}
				else
				{
					$(this).css("background-color", "");
				}
			});
			//innesco almeno una selezione
			if ($("#room_container .item[data-checked='true']").length == 0)
				$("#room_container .item:last .input").trigger("click");
			//
			if (!trovato)
			{
				xml_request = xml_request_head_build("MENU", "widget_room");
				xml_par = $(XML("act")); xml_par.text("SAVE"); xml_request.append(xml_par);
				xml_par = $(XML("page")); xml_par.text(WS_ROOM_STR); xml_request.append(xml_par);
				xml_par = widget_obj.local_room_list; xml_request.append(xml_par);
				xml_send(xml_request);
			}
		}).show();
		//
		$("#room_container .item .input").click(function()
		{
			if ($(this).attr("readonly") != null || !(typeof webbridge === 'undefined'))
			{
				if ($(this).parent().attr("data-checked") != "true")
				{
					$("#room_container .item").attr("data-checked", "false");
					$("#room_container .item").children(".tick").removeAttr("style");
					$("#room_container .item").children(".input").css("color", "rgba(255,255,255,0.4)");
					$(this).parent().children(".tick").attr("style", "background:url({TMPL_DIR}res/tick.png) no-repeat center center");
					$(this).parent().children(".input").css("color", "rgba(255,255,255,1)");
					$(this).parent().attr("data-checked", "true");
				}
				else
				{
					$("#room_container .item").attr("data-checked", "false");
					$("#room_container .item").children(".tick").removeAttr("style");
					$("#room_container .item").children(".input").css("color", "rgba(255,255,255,0.4)");
				}
			}
		});
		$("#room_container .item .tick").click(function()
		{
			$(this).siblings(".input").trigger("click");
		});
		//nuovo item
		$("#new_room").click(function()
		{
			if (widget_obj.local_room_list_enatrue_size < widget_obj.local_room_list_max_size)
			{
				if (typeof webbridge === 'undefined')
				{
					//rimozone di eventuali edit in corso
					$("#room_container")
						.children(".item[data-edit]")
						.children(".room_mod")
						.each(function()
						{
							$(this).attr("style", "background:url({TMPL_DIR}res/mod.png) no-repeat center center;");
							$(this).siblings(".input").attr("readonly", "");
							//
							var gui_item = $(this).parent();
							widget_obj.local_room_list.children("item").filter(function()
							{
								if ($(this).children("id").text() == gui_item.attr("data-id"))
									return true;
								else
									return false;
							}).children("desc").text(gui_item.children(".input").val());
							//
							$(this).parent().removeAttr("data-edit");
						});
				}
				//
				//sistemazione grafica
				$("#room_container .item:last").removeClass("btb");
				//creazione nuovo item
				var new_item = null;
				widget_obj.local_room_list.children().each(function()
				{
					if ($(this).children("ena").text() == 0)
					{
						new_item = $(this);
						return false;
					}
				});
				if (new_item != null)
				{
					new_item.children("ena").text("1");
					new_item.children("desc").text("");
					widget_obj.local_room_list_enatrue_size++;
				}
				//
				if (new_item != null)
				{
					$("#room_container")
						.append("<div class=\"item\" data-id=\""+new_item.children("id").text()+"\" data-factory=\""+new_item.children("factory").text()+"\" data-checked='false' name=\""+new_item.children("name").text()+"\">" +
								"<div class=\"room_del\"></div>" +
								"<div class=\"room_mod\" data-owner=\"#room_container .item[data-id='"+new_item.children("id").text()+"'] .input\"></div>" +
								"<div class=\"tick\"></div>" +
								(typeof webbridge === 'undefined' ? 
									"<input class=\"input\" type=\"text\" value=\""+$(this).children("desc").text()+"\" />" : 
									"<p class=\"input\">"+$(this).children("desc").text()+"</p>") +
								"</div>");
				}
				//
				if (!(typeof webbridge === 'undefined'))
				{
					$(".head_button").hide();
					$(this).attr("data-owner", "#room_container .item[data-id='"+new_item.children("id").text()+"'] .input");
					$(".head_button").show();
					var desc_text = webbridge.openKeyboard("FREE", $($(this).attr("data-owner")).text(), $($(this).attr("data-owner")).text(), $(this).attr("maxlength"), $(this).attr("data-maxpix"));
					$($(this).attr("data-owner")).text(desc_text);
					//aggiorna trama
					var gui_item = $("#room_container").children(".item:last-child");
					widget_obj.local_room_list.children("item").filter(function()
					{
						if ($(this).children("id").text() == gui_item.attr("data-id"))
							return true;
						else
							return false;
					}).children("desc").text(desc_text);
				}
				//aggiornamento grafico
				if ($("#room_container").children().length < 3)
					$("#room_container .item:last").addClass("btb");
				//abilitazione modifica nome item
				if (typeof webbridge === 'undefined')
				{
					$("#room_container").children(".item:last-child").children(".input").focus().select();
					$("#room_container").children(".item:last-child").children(".room_mod").attr("style", "background:url({TMPL_DIR}res/mod_edit.png) no-repeat center center;");
					$("#room_container").children(".item:last-child").attr("data-edit", "");
				}
				//
				//binding del e mod nel nuovo item
				$("#room_container .item:last-child .room_mod").click(function()
				{
					if (typeof webbridge === 'undefined')
					{
						if ($(this).parent().attr("data-edit") == null)
						{
							//disattiva tutti gli edit attivi
							$("#room_container")
								.children(".item[data-edit]")
								.children(".room_mod")
								.each(function()
								{
									$(this).attr("style", "background:url({TMPL_DIR}res/mod.png) no-repeat center center;");
									$(this).siblings(".input").attr("readonly", "");
									//
									var gui_item = $(this).parent();
									widget_obj.local_room_list.children("item").filter(function()
									{
										if ($(this).children("id").text() == gui_item.attr("data-id"))
											return true;
										else
											return false;
									}).children("desc").text(gui_item.children(".input").val());
									//
									$(this).parent().removeAttr("data-edit");
								});
							//
							//attiva l'edit cliccato
							$(this).attr("style", "background:url({TMPL_DIR}res/mod_edit.png) no-repeat center center;");
							$(this).siblings(".input").removeAttr("readonly");
							$(this).siblings(".input").focus().select();
							$(this).parent().attr("data-edit", "");
						}
						else
						{
							//disattiva l'edit cliccato
							$(this).attr("style", "background:url({TMPL_DIR}res/mod.png) no-repeat center center;");
							$(this).siblings(".input").attr("readonly", "");
							//
							var gui_item = $(this).parent();
							widget_obj.local_room_list.children("item").filter(function()
							{
								if ($(this).children("id").text() == gui_item.attr("data-id"))
									return true;
								else
									return false
							}).children("desc").text(gui_item.children(".input").val());
							//
							$(this).parent().removeAttr("data-edit");
							$(this).parent().css("background-color", "");
						}
					}
					else
					{
						$(".head_button").hide();
						var desc_text = webbridge.openKeyboard("FREE", $($(this).attr("data-owner")).text(), $($(this).attr("data-owner")).text(), $(this).siblings(".input").attr("maxlength"), $(this).siblings(".input").attr("data-maxpix"));
						$(".head_button").show();
						$($(this).attr("data-owner")).text(desc_text);
						//aggiorna trama
						var gui_item = $(this).parent();
						widget_obj.local_room_list.children("item").filter(function()
						{
							if ($(this).children("id").text() == gui_item.attr("data-id"))
								return true;
							else
								return false;
						}).children("desc").text(desc_text);
					}
				});
				//delete binding
				$("#room_container .item:last-child .room_del").click(function()
				{
					if ($(this).parent().attr("data-checked") === "true") //se selezionato, prima di eliminarlo sceglie il primo factory default disponibile
						$("#room_container .item[data-factory='1']:first .input").trigger("click");
					//
					var gui_item = $(this).parent();
					widget_obj.local_room_list
						.children("item")
						.filter(function()
						{
							if ($(this).children("id").text() == gui_item.attr("data-id"))
								return true;
							else
								return false;
						})
						.children("ena").text("0");
					//
					widget_obj.local_room_list_enatrue_size--;
					//
					$("#new_room").css("color", "rgba(255,255,255,1)");
					//
					$(this).parent().remove();
					//
					if ($("#room_container").children().length < 3)
						$("#room_container .item:last").addClass("btb");
				});
				//
				var forced = true;
				$("#room_container .item:last-child .input").click(function()
				{
					if ($(this).attr("readonly") != null  || !(typeof webbridge === 'undefined') || forced)
					{
						if ($(this).parent().attr("data-checked") != "true")
						{
							$("#room_container .item").attr("data-checked", "false");
							$("#room_container .item").children(".tick").removeAttr("style");
							$("#room_container .item").children(".input").css("color", "rgba(255,255,255,0.4)");
							$(this).parent().children(".tick").attr("style", "background:url({TMPL_DIR}res/tick.png) no-repeat center center");
							$(this).parent().children(".input").css("color", "rgba(255,255,255,1)");
							$(this).parent().attr("data-checked", "true");
						}
						else
						{
							$("#room_container .item").attr("data-checked", "false");
							$("#room_container .item").children(".tick").removeAttr("style");
							$("#room_container .item").children(".input").css("color", "rgba(255,255,255,0.4)");
						}
					}
				}).trigger("click");
				$("#room_container .item:last-child .tick").click(function()
				{
					$(this).siblings(".input").trigger("click");
				});
				forced = false;
				//
				//aggiornamento grafico bottone new room
				if (widget_obj.local_room_list_enatrue_size == widget_obj.local_room_list_max_size)
					$("#new_room").css("color", "rgba(255,255,255,0.4)");
			}
			else
			{
				//max size reached
			}
		});
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "MENU")
		{
			if (conf.children("act").text() == "SAVE")
			{
				if (conf.children("res").text() == "SAVED")
				{
					if (conf.children("page").text() == WS_ROOM_STR)
					{
						room_list = this.local_room_list;
						//
						$(".room .sl_selector").html("");
						$(".room .sl_selector").html(typeof webbridge === 'undefined' ? $("#room_container .item[data-checked='true']").children(".input").val() : $("#room_container .item[data-checked='true']").children(".input").text());
						id_room_selected = "";
						id_room_selected = $("#room_container .item[data-checked='true']").attr("data-id");
						//
						pag_clear(".JSdialog");
					}
				}
				else if (conf.children("res").text() == "ERROR")
				{
					if (conf.children("page").text() == WS_ROOM_STR)
					{
						alert("ERROR");
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
		$(".JSdialog").hide();
		$(".home .JSdialog").removeClass("full_scr");
	},
	//
	name: "widget_room",
	local_room_list: room_list.clone(),
	local_room_list_enatrue_size: 0,
	local_room_list_max_size: room_list.children("item").last().attr("id")
};