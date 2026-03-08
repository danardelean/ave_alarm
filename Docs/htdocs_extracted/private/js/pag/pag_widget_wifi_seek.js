pag_table_new["widget_wifi_seek"] = {
	onload: function()
	{
		var widget_obj = this;
		$(".home .JSdialog").addClass("full_scr");
		$(".JSdialog").show();
		//
		//
		$("#wifi_seek_esc").click(function()
		{
			widget_obj.stop_wifi_seeker();
			widget_obj.stop_point();
			pag_clear(".JSdialog");
		});
		//
		this.start_wifi_seeker();
	},
	onrecv_confirmation: function(conf)
	{
		if (conf.attr("type") == "MENU")
		{
			if (conf.children("page").text() == "SSID")
			{
				if (conf.children("act").text() == "LOAD")
				{
					if (conf.children("res").text() == "OK")
					{
						if (conf.children("par").length > 0)
						{
							var widget_obj = this;
							//
							$("#new_ap").html("{LANG_WIZARD_SET_DEVICE_NEWSSID}");
							this.stop_wifi_seeker();
							//
							this.ssid_list_xml = conf.find("par");
							//
							//
							conf.find("par item").each(function()
							{
								widget_obj.appendElem
								(
										$(this).attr("id")
										, $(this).children("custom").text()
										, $(this).children("name").text()
										, null
										, $(this).children("name").attr("minlength")
										, $(this).children("name").attr("maxlength")
										, Number($(this).children("wps_ena").text())
								);
							});
							//
							//tick
							this.click_binder();
							//
							$("#wifi_seek_container .diag_button").each(function()
							{
								if ($(this).children(".name_input").text() == pag_table_new["widget_parconn"].ssid_name)
								{
									$(".switcher", this).trigger("click");
									return false;
								}
							});
							this.upshot();
							//
							$("#ok_wifi_seek_diag").off("click").click(function()
							{
								if ($(this).data("enabled") == "on")
								{
									$(this).data("enabled", "off");
									setTimeout(function()
									{
										$("#ok_wifi_seek_diag").data("enabled", "on");
									}, 1000);
									//
									widget_obj.deleteCustoms();
									widget_obj.saveCustoms();
									//aggiorna la gui parconn senza attendere la conferma di salvataggio e cancellazione
									if (widget_obj.first_item_fault == null)//se non ci sono errori
									{
										if (widget_obj.selected_id == "")
										{
											pag_table_new["widget_parconn"].ssid_name = "";
											$("#container_cl #web_client_ssid.sl_selector").html("");
										}
										else
										{
											var item = widget_obj.ssid_list_xml.children("item[id='" + widget_obj.selected_id + "']");
											//
											var name = item.children("name").text();
											var auth = item.children("auth").text();
											var wps_ena = item.children("wps_ena").text();
											var mac_adr = item.children("mac_adr").text();
											pag_table_new["widget_parconn"].ssid_name = name;
											pag_table_new["widget_parconn"].auth = auth;
											pag_table_new["widget_parconn"].mac_adr = mac_adr;
											$("#container_cl .auth .sl_selector").html(widget_obj.auth[auth]);
											$("#container_cl #web_client_ssid.sl_selector").html(name);
											//
											if (auth == "0")
												$("#web_client_password").parent().addClass("invisible");
											else
												$("#web_client_password").parent().removeClass("invisible");
											//
											if (wps_ena == "1" && QT)
												pag_change(".JSdialog2", "widget_popwarn", "{LANG_WPS_ALERT_TITLE_A}", "{LANG_WPS_ALERT_DESC_A}", "okab", "#wps_trigger", null, "{LANG_NO}" + "|" + "{LANG_YES}");
										}
										//
										$("#wifi_seek_esc").trigger("click");
									}
								}
							}).data("enabled", "on").children(".ok_wifi_seek_diag_btn_inside").removeClass("disabled");
							//
							$("#new_ap").off("click").click(function()
							{
								xml_request = xml_request_head_build("MENU", "widget_wifi_seek");
								xml_node = $(XML("page")); xml_node.text("SSID"); xml_request.append(xml_node);
								xml_node = $(XML("act")); xml_node.text("NEW"); xml_request.append(xml_node);
								xml_send(xml_request);
							});
							//
							this.initCrud();
						}
					}
					this.stop_point();
				}
				else if (conf.children("act").text() == "NEW")
				{
					if (conf.children("res").text() == "CREATED")
					{
						this.ssid_list_xml.append(conf.find("par item").attr("id", "n"+this.new_item_id).attr("new", "1").clone()); //aggiunta ssid nuovi
						this.appendElem("n" + this.new_item_id, "1", conf.find("par item name").text(), true, conf.find("par item name").attr("minlength"), conf.find("par item name").attr("maxlength"));
						//
						this.initCrud();
						this.click_binder();
						//
						$("#wifi_seek_container .diag_button[data-item-id='"+"n"+this.new_item_id+"'] .click_zone").trigger("click");
						//
						this.new_item_id++;
					}
				}
				else if (conf.children("act").text() == "START")
				{
					if (conf.children("res").text() == "STARTING")
					{
						//
					}
					else if (conf.children("res").text() == "KO")
					{
						this.load_ssid_list();
						this.stop_point();
					}
				}
			}
		}
	},
	onrecv_indication: function(indi)
	{
		if (indi.attr("type") == "MENU")
		{
			if (indi.children("page").text() == "SSID")
			{
				if (indi.children("act").text() == "START")
				{
					if (indi.children("res").text() == "STARTED")
					{
						this.load_ssid_list();
					}
					else if (indi.children("res").text() == "ERROR")
					{
						this.stop_point();
						pag_clear(".home .JSdialog");
					}
				}
			}
		}
	},
	onclose: function()
	{
		this.stop_point();
		$(".JSdialog").hide();
		$(".home .JSdialog").removeClass("full_scr");
	},
	//
	name: "widget_wifi_seek",
	ssid_list_xml: null,
	ssid_add_xml: null,
	ssid_del_xml: null,
	new_item_id: 1,
	selected_id: "", //id del ssid selezionato riferito alle liste ssid_add_xml (per i nuovi ssid da salvare) e ssid_list_xml (per gli ssid gia' presenti)
	auth: ["NONE", "WPA", "WPA2", "WEP"],
	first_item_fault: null,
	scrollControllers: {up: "#wifi_seek_up", down: "#wifi_seek_down"},
	scrollOffset: 0,
	//
	saveCustoms: function()
	{
		var widget_obj = this;
		//rimozione modalita edit
		if (!QT)
		{
			$("#wifi_seek_container .diag_button[data-custom='1']").each(function()
			{
				if ($(this).children(".name_input").prop("tagName") == "INPUT")
					widget_obj.switchInput($(this), widget_obj.ssid_list_xml.children("item[id='"+$(this).attr("data-item-id")+"']"));
			});
		}
		//controllo che gli ssid non siano vuoti
		this.first_item_fault = null;
		var ssid_name_arr = [];
		this.ssid_list_xml.children("item").each(function()
		{
			if ($(this).children("custom").text() == "1" && !($(this).attr("delete") == "1"))
			{
				var res = true;
				//
				var name = $(this).children("name");
				var minlen = name.attr("minlength");
				var maxlen = name.attr("maxlength");
				//
				var txt = name.text().trim();
				//
				res =
				!(
					(
						minlen != null
						&& txt.length <= minlen
					)
					||
					(
						maxlen != null
						&& txt.length > maxlen
					)
					||
						txt == ""
				);
				//
				if (ssid_name_arr.indexOf(txt) > -1)
				{
					res = false;
				}
				else
				{
					ssid_name_arr.push(txt);
				}
				//
				if (res)
				{
					$("#wifi_seek_container .diag_button[data-item-id='"+$(this).attr("id")+"']").removeClass("fault");
				}
				else
				{
					var diag_elem = $("#wifi_seek_container .diag_button[data-item-id='"+$(this).attr("id")+"']").addClass("fault");
					if (widget_obj.first_item_fault == null)
						widget_obj.first_item_fault = diag_elem;
				}
			}
		});
		//
		if (this.first_item_fault != null)
		{
			return; //interrompe la funzione se almeno un ssid e' vuoto
		}
		//preparazione lista di salvataggio
		xml_par = $(XML("par"));
		this.ssid_add_xml = this.ssid_list_xml.clone();
		this.ssid_add_xml.children("item").each(function()
		{
			if
			(
				$(this).children("custom").text() == "1"
				&& $(this).attr("delete") != "1"
				&& 
				(
					$(this).attr("new") == "1"
					|| $(this).attr("modified") == "1"
				)
			)
			{
				xml_par.append($(this));
			}
		});
		//salvataggio
		if (xml_par.children("item").length > 0)
		{
			xml_request = xml_request_head_build("MENU", null);
			xml_node = $(XML("page")); xml_node.text("SSID"); xml_request.append(xml_node);
			xml_node = $(XML("act")); xml_node.text("SAVE"); xml_request.append(xml_node);
			xml_request.append(xml_par);
			xml_send(xml_request);
		}
	},
	deleteCustoms: function()
	{
		//preparazione lista di cancellazione
		xml_par = $(XML("par"));
		this.ssid_del_xml = this.ssid_list_xml.clone();
		this.ssid_del_xml.children("item").each(function()
		{
			if
			(
				$(this).children("custom").text() == "1"
				&& $(this).attr("delete") == "1"
			)
			{
				xml_par.append($(this));
			}
		});
		//cancellazione
		if (xml_par.children("item").length > 0)
		{
			xml_request = xml_request_head_build("MENU", null);
			xml_node = $(XML("page")); xml_node.text("SSID"); xml_request.append(xml_node);
			xml_node = $(XML("act")); xml_node.text("DELETE"); xml_request.append(xml_node);
			xml_request.append(xml_par);
			xml_send(xml_request);
		}
	},
	appendElem: function(id, custom, name, beforeFlg, minlen, maxlen, wps_ena)
	{
		var str = 
		"<div class='diag_button item ex' data-item-id='" + id + "' data-custom='" + custom + "'>"
			+ "<p class='name_input short'>" + name + "</p>"
			+ "<div class='click_zone'></div>"
			+ (custom == 1 ? "<div class='ssid del'></div>" : "")
			+ (custom == 1 ? "<div class='ssid mod'></div>" : "")
			+ (wps_ena == 1 ? "<div class='wps_ena'></div>" : "")
			+ this.switchHTML()
		+ "</div>";
		//
		if (beforeFlg == null || !beforeFlg)
			$("#wifi_seek_container").append(str);
		else if (beforeFlg)
			$("#wifi_seek_container").prepend(str);
		//
		if (minlen != null)
			$("#wifi_seek_container .diag_button[data-item-id='" + id + "']").data("minlen", minlen);
		if (maxlen != null)
			$("#wifi_seek_container .diag_button[data-item-id='" + id + "']").data("maxlen", maxlen);
	},
	initCrud: function()
	{
		var widget_obj = this;
		//
		$("#wifi_seek_container .diag_button[data-custom='1'] .ssid").off("click").click(function()
		{
			var diag_button = $(this).parent();
			var item = widget_obj.ssid_list_xml.children("item[id='"+diag_button.attr("data-item-id")+"']");
			//
			if ($(this).hasClass("del"))
			{
				if ($(".switcher", diag_button).attr("data-checked") == "1")
					widget_obj.selected_id = "";
				//
				item.attr("delete", "1");
				diag_button.remove();
			}
			else if ($(this).hasClass("mod"))
			{
				if (QT)
				{
					$(".head_button").hide();
					var desc_text = webbridge.openKeyboard("FREE", $(".name_input", diag_button).text(), $(".name_input", diag_button).text(), diag_button.data("maxlen"), null);
					$(".head_button").show();
					$(".name_input", diag_button).html(desc_text);
					item.attr("modified", "1");
					item.children("name").text(desc_text);
				}
				else
				{
					widget_obj.switchInput(diag_button, item); //trasforma da P a INPUT e viceversa
				}
			}
		});
	},
	click_binder: function()
	{
		/**
		 * al click viene aggiornata la variabile "selected_id"
		 * che poi servira' al tasto "ok_wifi_seek_diag" per valutare l'ssid selezionato
		 */
		var widget_obj = this;
		//
		$("#wifi_seek_container .diag_button .switcher").each(function(index)
		{
			global_switcher_binder("#wifi_seek_container", ":eq(" + index + ")", null, "GUI", null);
		})
		.on("toggle_tick_click", function()
		{
			if ($(this).attr("data-checked") == "1")
			{
				if ($(this).parent().hasClass("ex"))
					$(this).parent().siblings(".diag_button").children(".switcher").trigger("switch_state_changer", [["off"]], true);
				else
					$(this).parent().siblings(".diag_button.ex").children(".switcher").trigger("switch_state_changer", [["off"]], true);
			}
			//
			if ($(this).attr("data-checked") == "1")
				widget_obj.selected_id = $(this).parent().attr("data-item-id");
			else if ($(this).attr("data-checked") == "0")
				widget_obj.selected_id = "";
		});
	},
	switchInput: function(diag_button, item)
	{
		var elem_mod = $(".ssid.mod", diag_button);
		var elem_click = $(".click_zone", diag_button);
		var elem = $(".name_input", diag_button);
		var elem_type = elem.prop("tagName");
		//
		if (elem_type == "P")
		{
			var maxlen = diag_button.data("maxlen");
			var maxlen_str = "";
			if (maxlen != null)
				maxlen_str = "maxlength='"+maxlen+"'";
			//
			var val_str = elem.html();
			elem.replaceWith("<input class='name_input' type='text' "+maxlen_str+">");
			elem = $(".name_input", diag_button);
			elem.val(val_str);
			elem_mod.addClass("edit");
			elem_click.hide();
			elem.focus().select();
		}
		else if (elem_type == "INPUT")
		{
			item.children("name").text(elem.val());
			item.attr("modified", "1");
			elem.replaceWith("<p class='name_input short'>"+elem.val()+"</p>");
			elem_mod.removeClass("edit");
			elem_click.show();
			diag_button.removeClass("fault");
		}
	},
	start_wifi_seeker: function()
	{
		this.start_point();
		//
		xml_request = xml_request_head_build("MENU", this.name);
		xml_node = $(XML("page")); xml_node.text("SSID"); xml_request.append(xml_node);
		xml_node = $(XML("act")); xml_node.text("START"); xml_request.append(xml_node);
		xml_send(xml_request);
	},
	stop_wifi_seeker: function()
	{
		xml_request = xml_request_head_build("MENU", null);
		xml_node = $(XML("page")); xml_node.text("SSID"); xml_request.append(xml_node);
		xml_node = $(XML("act")); xml_node.text("STOP"); xml_request.append(xml_node);
		xml_send(xml_request);
	},
	load_ssid_list: function()
	{
		xml_request = xml_request_head_build("MENU", this.name);
		xml_node = $(XML("page")); xml_node.text("SSID"); xml_request.append(xml_node);
		xml_node = $(XML("act")); xml_node.text("LOAD"); xml_request.append(xml_node);
		xml_send(xml_request);
	},
	start_point: function()
	{
		$("#waiting_point_ssid").attr("data-run", "true");
		$("#waiting_point_ssid").parent().show();
		var max_wait = 100;
		var pointIdx = 3;
		//
		function points_builder()
		{
			max_wait--;
			//
			if (pointIdx++ > 2)
			{
				pointIdx = 0;
				$("#waiting_point_ssid").html(".");
			}
			else
			{
				$("#waiting_point_ssid").append(".");
			}
			if ($("#waiting_point_ssid").length > 0 && max_wait > 0)
				if ($("#waiting_point_ssid").attr("data-run") == "true")
					setTimeout(points_builder, 1000);
		}
		points_builder();
	},
	stop_point: function()
	{
		$("#waiting_point_ssid").html("").parent().hide();
		$("#waiting_point_ssid").attr("data-run", "false");
	},
	switchHTML: function(state)
	{
		if (state == null)
			state = "0";
		return (
			  "<div class='switcher off disableMode3' data-checked='" + state + "'>"
			+ 	"<p class='button_text c_dark on'>{LANG_YES}</p>"
			+ 	"<p class='button_text c_dark off'>{LANG_NO}</p>"
			+ 	"<div class='button_dot g_bg_dark'></div>"
			+ 	"<div class='active_area'></div>"
			+ "</div>"
		);
	},
	upshot: function()
	{
		var firstSelected = $("#wifi_seek_container .item .switcher[data-checked='1']:first");
		if (firstSelected.length > 0)
			var pos = firstSelected.parent()[0].offsetTop;
		scrollTo(this, pos);
		//
		scrollList(this);
	}
};