String.prototype.replaceAt = function(index, character)
{
	character = character + "";
    return this.substr(0, index) + character + this.substr(index+character.length);
}
String.prototype.replaceAtStrict = function(index, character)
{
	var str = this.split("");
	str[index] = character;
	return str.join("");
}
String.prototype.replaceAtRegex = function(sea, wth) //può essere usata anche come removeAt
{
	var seaReg = new RegExp(sea, "g");
	return this.replace(seaReg, wth);	
}
String.prototype.removeAt = function(index)
{
	return this.slice(0, index) + this.slice(index + 1);
}
String.prototype.removeMatch = function(str)
{
	return this.split(str).join("");
}
String.prototype.cutBefore = function(str)
{
	var index = this.indexOf(str);
	if (index != -1 && index+str.length <= this.length)
    	return this.substr(index+str.length, this.length-index-str.length);
	else
		return this;
}
String.prototype.cutBeforeLast = function(str)
{
	var index = this.lastIndexOf(str);
	if (index != -1 && index+str.length <= this.length)
    	return this.substr(index+str.length, this.length-index-str.length);
	else
		return this;
}
String.prototype.cutAfter = function(str)
{
	var index = this.indexOf(str);
	if (index != -1 && index < this.length)
    	return this.substr(0, index);
	else
		return this;
}
String.prototype.cutAfterLast = function(str)
{
	var index = this.lastIndexOf(str);
	if (index != -1 && index < this.length)
    	return this.substr(0, index);
	else
		return this;
}
String.prototype.cutAround = function(str1, str2)
{
	var str_res = this.cutBefore(str1);
	str_res = str_res.cutAfter(str2);
	return str_res;
}
String.prototype.replaceAll = function(search, replacement)
{
	var target = this;
	return target.split(search).join(replacement);
}
String.prototype.numCatcher = function()
{
	return this.valueOf().match(/-?\d+/g).map(Number);	
}
String.prototype.zeroAdder = function(hManyDgt)
{
	var elem = this;
	for (var i = elem.length; i < hManyDgt; i++)
		elem = "0" + elem;
	return elem;
}
String.prototype.addAt = function(pos)
{
	var str = this;
	return str.slice(0, pos) + char + str.slice(pos);
}
//
$.fn.child = function(s)
{
    return $(this).children(s)[0];
}
//
function get_all_indexes(arr, val)
{
    var indexes = [];
    var i = -1;
    while ((i = arr.indexOf(val, i+1)) != -1)
        indexes.push(i);
    return indexes;
}
function del_occurs(arr, val)
{
	var indexes = get_all_indexes(arr, val);
	while(indexes.length > 0)
	{
		arr.splice(indexes.pop(), 1);
	}
}
function aa_size(aa)
{
	var size = 0;
	for (var key in aa)
		size++;
	return size;
}
function get_aa_elem(aa, idx)
{
	for (var key in aa)
		if (idx == 0)
			return aa[key];
		else
			idx--;
}
//
function uniGetDev(fromD, toD, par)
{
	var res = "none";
	if (fromD == "id" && toD == "subcategory")
	{
		for (var i = par.length; i < 3; i++)
			par = "0" + par;
		res = xml_file_configuration.find("Devices Device[id$=" + par + "]").children("subcategory").text();
	}
	else if (fromD == "tagId" && toD == "subcategory")
	{
		res = xml_file_configuration.find("Devices Device[id=" + par + "]").children("subcategory").text();
	}
	return res;
}
function isIoTType(cmdsLen, devSubcat, triggeredByEna) //passare: dimensione lista comandi, sottocategoria del primo comando, attiva se ena
{
	if 
	(
		cmdsLen == 1 
		&& devSubcat == WS_DEV_ALARM_IOT_STR 
		&& 
		(
			triggeredByEna == "FALSE"
			|| !triggeredByEna
		)
	)
		return true;
	else
		return false;
}
//
(function($)
{
    $.fn.hasTag = function(tag)
    {
    	return $(this).children(tag).length > 0;	
    }
}(jQuery));
//
//
function keyboard_theme(plant)
{
	if (plant == NICE_STR)
	{
		webbridge.setColorMainBg("#000000");
		webbridge.setColorGridBg("#424A5D");
		webbridge.setColorButtonBg("#141E36");
		webbridge.setColorButtonPressedBg("#1A1A5A");
		webbridge.setColorButtonFg("#FFFFFF");
		webbridge.setColorButtonPressedFg("#FFFFFF");
		webbridge.setColorButtonFxBg("#141E36");
		webbridge.setColorButtonFxPressedBg("#1A1A5A");
		webbridge.setColorButtonFxFg("#999999");
		webbridge.setColorButtonFxPressedFg("#FFFFFF");
		webbridge.setColorTitleFg("#FFFFFF");
		webbridge.setColorValueFg("#FFFFFF");
		webbridge.setColorLineLengthBg("#424A5D");
		webbridge.setColorLineLengthFg("#88C23F");
		webbridge.setColorLineLengthTitleFg("#88C23F");
	}
	else if (plant == SIL_STR)
	{
		webbridge.setColorMainBg("#000000");
		webbridge.setColorGridBg("#424A5D");
		webbridge.setColorButtonBg("#141E36");
		webbridge.setColorButtonPressedBg("#1A1A5A");
		webbridge.setColorButtonFg("#FFFFFF");
		webbridge.setColorButtonPressedFg("#FFFFFF");
		webbridge.setColorButtonFxBg("#141E36");
		webbridge.setColorButtonFxPressedBg("#1A1A5A");
		webbridge.setColorButtonFxFg("#999999");
		webbridge.setColorButtonFxPressedFg("#FFFFFF");
		webbridge.setColorTitleFg("#FFFFFF");
		webbridge.setColorValueFg("#FFFFFF");
		webbridge.setColorLineLengthBg("#424A5D");
		webbridge.setColorLineLengthFg("#88C23F");
		webbridge.setColorLineLengthTitleFg("#88C23F");
	}
	else if (plant == AVE_STR)
	{
		webbridge.setColorMainBg("#000000");
		webbridge.setColorGridBg("#424A5D");
		webbridge.setColorButtonBg("#141E36");
		webbridge.setColorButtonPressedBg("#1A1A5A");
		webbridge.setColorButtonFg("#FFFFFF");
		webbridge.setColorButtonPressedFg("#FFFFFF");
		webbridge.setColorButtonFxBg("#141E36");
		webbridge.setColorButtonFxPressedBg("#1A1A5A");
		webbridge.setColorButtonFxFg("#999999");
		webbridge.setColorButtonFxPressedFg("#FFFFFF");
		webbridge.setColorTitleFg("#FFFFFF");
		webbridge.setColorValueFg("#FFFFFF");
		webbridge.setColorLineLengthBg("#424A5D");
		webbridge.setColorLineLengthFg("#88C23F");
		webbridge.setColorLineLengthTitleFg("#88C23F");
	}
	else if (plant == DIY_STR)
	{
		webbridge.setColorMainBg("#000000");
		webbridge.setColorGridBg("#424A5D");
		webbridge.setColorButtonBg("#141E36");
		webbridge.setColorButtonPressedBg("#1A1A5A");
		webbridge.setColorButtonFg("#FFFFFF");
		webbridge.setColorButtonPressedFg("#FFFFFF");
		webbridge.setColorButtonFxBg("#141E36");
		webbridge.setColorButtonFxPressedBg("#1A1A5A");
		webbridge.setColorButtonFxFg("#999999");
		webbridge.setColorButtonFxPressedFg("#FFFFFF");
		webbridge.setColorTitleFg("#FFFFFF");
		webbridge.setColorValueFg("#FFFFFF");
		webbridge.setColorLineLengthBg("#424A5D");
		webbridge.setColorLineLengthFg("#88C23F");
		webbridge.setColorLineLengthTitleFg("#88C23F");
	}
}
//
(function($)
{
	$.fn.hasAttr = function(options)
	{
		if (typeof options != "string" || $(this).length == 0)
			return false;
		//
		var attr_str_list = [];
		var or_mode = options.indexOf("|") != -1;
		if (or_mode)	
		{
			attr_str_list = options.split("|");
			//
			for (var i = 0; i < attr_str_list.length; i++)
				if ($(this)[0].hasAttribute(attr_str_list[i]))
					return true;
			return false;
		}
		else
		{
			attr_str_list = options.split(" ");
			//
			for (var i = 0; i < attr_str_list.length; i++)
				if (!$(this)[0].hasAttribute(attr_str_list[i]))
					return false;
			return true;
		}
	};
	$.fn.swapClass = function(class1, class2)
	{
		return $(this).each(function()
		{
			$(this).removeClass(class1).addClass(class2);
		});
	};
}(jQuery));
//
(function($)
{
	$.fn.stopScroll = function(options)
	{
		options = $.extend(
		{
			delay: 100,
			callback: options
		}, options);
		//
		return this.each(function()
		{
			var element = this;
			$(this).scroll(function()
			{
				clearTimeout($.data(element, "scrollCheck"));
				$.data(element, "scrollCheck", setTimeout(function() {
					options.callback.call(element);
				}, options.delay));
			});
		});
	};
}(jQuery));
//
var scrollControllers = {};
function scrollList(widget_obj, scrollableContainerSelectorId)
{
	if ("scrollControllers" in widget_obj)
		scrollControllers[widget_obj.name] = {up: widget_obj.scrollControllers.up, down: widget_obj.scrollControllers.down};
	else
		scrollControllers[widget_obj.name] = {up: "#footer_h2_b_b", down: "#footer_h2_c_a"};
	var upScroller = scrollControllers[widget_obj.name].up;
	var downScroller = scrollControllers[widget_obj.name].down;
	var scrCont = $(scrollableContainerSelectorId || "." + widget_obj.name + " .scrollableContainer");
	//
	if (scrCont.length != 0)
	{
		var scrollOffset = setGetWObjScrollOffset(widget_obj, 0);
		var scrollSizeGuiObj = $("." + widget_obj.name + " .scrollableContainer .scrollableSize:first");
		//
		scrollListArrowCheck(widget_obj, scrollableContainerSelectorId);
		if (!QT)
		{
			$(window).off("resize." + widget_obj.name).on("resize." + widget_obj.name, function ()
			{
				scrollListArrowCheck(widget_obj, scrollableContainerSelectorId);
			});
			scrCont.off("stopScroll").stopScroll(function()
			{
				scrollListArrowCheck(widget_obj, scrollableContainerSelectorId); //stopscroll
			});
		}
		//
		setGetWObjScrollOffset(widget_obj, scrollOffset);
		$(upScroller).off("click").click(function()
		{
			scrollOffset -= scrollSizeGuiObj.outerHeight(true);
			if (scrollSizeGuiObj.hasClass("phantom_entire"))
				scrollOffset += scrollSizeGuiObj.outerHeight(true) % 60;
	    	scrCont.scrollTop(scrollOffset);
	    	scrollOffset = scrCont.scrollTop();
	    	setGetWObjScrollOffset(widget_obj, scrollOffset);
	    	if (QT)
	    		scrollListArrowCheck(widget_obj, scrollableContainerSelectorId);
		}).parent().show();
		$(downScroller).off("click").click(function()
		{
			scrollOffset += scrollSizeGuiObj.outerHeight(true);
			if (scrollSizeGuiObj.hasClass("phantom_entire"))
				scrollOffset -= scrollSizeGuiObj.outerHeight(true) % 60;
	    	scrCont.scrollTop(scrollOffset);
	    	scrollOffset = scrCont.scrollTop();
	    	setGetWObjScrollOffset(widget_obj, scrollOffset);
	    	if (QT)
	    		scrollListArrowCheck(widget_obj, scrollableContainerSelectorId);
		}).parent().show();
	}
	else
	{
		$(upScroller).addClass("disabled");
		$(downScroller).addClass("disabled");
	}
}
function setGetWObjScrollOffset(widget_obj, val)
{
	var res = 0;
	//
	if (widget_obj != null)
	{
		if (widget_obj.scrollOffset != null)
		{
			res = widget_obj.scrollOffset;
			widget_obj.scrollOffset = val;
		}
	}
	return res;
}
function scrollListArrowCheck(widget_obj, scrollableContainerSelectorId)
{
	var upScroller = scrollControllers[widget_obj.name].up;
	var downScroller = scrollControllers[widget_obj.name].down;
	//
	var containerScrollObj = $(scrollableContainerSelectorId || "." + widget_obj.name + " .scrollableContainer").get(0);
	//
	if (containerScrollObj.scrollTop == 0)
		$(upScroller).addClass("disabled");
	else
		$(upScroller).removeClass("disabled");
	//
	if (containerScrollObj.offsetHeight + containerScrollObj.scrollTop >= containerScrollObj.scrollHeight)
		$(downScroller).addClass("disabled");
	else
		$(downScroller).removeClass("disabled");
}
function scrollTo(widget_obj, offsetGui)
{
	$("." + widget_obj.name + " .scrollableContainer").scrollTop(offsetGui);
	setGetWObjScrollOffset(widget_obj, offsetGui);
}
//
$(document).off(".t_out_scroll").on(vmouseup+".t_out_scroll", function()
{
	up_s  = true;
	for(; t_out_scroll.length > 0;)
		clearTimeout(t_out_scroll.pop());
});
//
function riprova(funzione, f_condizione, risoluzione)
{
	var t_out_retry;
	//
	function retry()
	{
		if (f_condizione())
		{
			funzione();
		}
		else
		{
			t_out_retry = setTimeout(function()
			{
				retry();
			}, risoluzione * 1000);
		}
	}
	retry();
	return t_out_retry;
}
//
function check_son_ena(ord, subcategory, device)
{
	if (ord !== "0")
	{
		if (subcategory === WS_DEV_ALARM_SEN_MAG_STR)
		{
			if (Number(device.children("phy_mode").text()) < 1)
				return false;
		}
		else if (subcategory === WS_DEV_ALARM_SENUNI_STR)
		{
			if (Number(device.children("phy_mode").text()) < 1)
				return false;
		}
		else if (subcategory === WS_DEV_ALARM_SEN_MIC_STR)
		{
			if (Number(device.children("alarm_mode").text()) < 1)
				return false;
		}
		else if (subcategory === WS_DEV_ALARM_WIRED_STR)
		{
			if (device.children("wire_type").text() === "1") //ingressi
			{
				if (device.children("cfg_wire_in_mode").text() == "" + WIRE_N_DISABLED)
					return false;
			}
			else if (device.children("wire_type").text() === "5") //uscite
			{
				if (device.children("wire_out_mode").text() === "0")
					return false;
			}
			else if (device.children("wire_type").text() === "3") //key
			{
				if (device.children("wire_key_mode").text() === "0")
					return false;
			}
		}
		else if (subcategory === WS_DEV_ALARM_BUS_SENSORI_STR)
		{
			if (device.children("child_valid").text() === "0")
				return false;
		}
		else if (subcategory === WS_DEV_ALARM_BUS_CONC_STR)
		{
			if (device.children("child_valid").text() === "0")
				return false;
		}
		else if (subcategory === WS_DEV_ALARM_BUS_CONC_RF_STR)
		{
			if (device.children("child_valid").text() === "0")
				return false;
		}
		else if (subcategory === WS_DEV_ALARM_BUS_INPUT_STR)
		{
			if (device.children("child_valid").text() === "0")
				return false;
		}
	}
	return true;
}
function check_son_ena_new(ord, subcategory, device)
{
	if (ord !== "0")
	{
		if (subcategory === WS_DEV_ALARM_SEN_MAG_STR)
		{
			if (Number(device["phy_mode"].text()) < 1)
				return false;
		}
		else if (subcategory === WS_DEV_ALARM_SENUNI_STR)
		{
			if (Number(device["phy_mode"].text()) < 1)
				return false;
		}
		else if (subcategory === WS_DEV_ALARM_SEN_MIC_STR)
		{
			if (Number(device["alarm_mode"].text()) < 1)
				return false;
		}
		else if (subcategory === WS_DEV_ALARM_WIRED_STR)
		{
			if (device["wire_type"].text() === "1") //ingressi
			{
				if (device["cfg_wire_in_mode"].text() == "" + WIRE_N_DISABLED)
					return false;
			}
			else if (device["wire_type"].text() === "5") //uscite
			{
				if (device["wire_out_mode"].text() === "0")
					return false;
			}
			else if (device["wire_type"].text() === "3") //key
			{
				if (device["wire_key_mode"].text() === "0")
					return false;
			}
		}
		else if (subcategory === WS_DEV_ALARM_BUS_SENSORI_STR)
		{
			if (device["child_valid"].text() === "0")
				return false;
		}
		else if (subcategory === WS_DEV_ALARM_BUS_CONC_STR)
		{
			if (device["child_valid"].text() === "0")
				return false;
		}
		else if (subcategory === WS_DEV_ALARM_BUS_CONC_RF_STR)
		{
			if (device["child_valid"].text() === "0")
				return false;
		}
		else if (subcategory === WS_DEV_ALARM_BUS_INPUT_STR)
		{
			if (device["child_valid"].text() === "0")
				return false;
		}
	}
	return true;
}
function check_ena(ord, subcategory, device)
{
	if (ord === "0")
	{
		if (subcategory === WS_DEV_ALARM_THERMOSTAT_STR)
		{
			if (Number(device.children("ena").text()) == 0)
				return false;
		}
		else if (subcategory === WS_DEV_ALARM_IOT_STR)
		{
			if (Number(device.children("ena").text()) == 0)
				return false;
		}
	}
	return true;
}
//
function save_step(step)
{
	xml_request = xml_request_head_build("MENU");
	xml_par = $(XML("act")); xml_par.text("SAVE"); xml_request.append(xml_par);
	xml_par = $(XML("page")); xml_par.text("SET"); xml_request.append(xml_par);
	xml_par = $(XML("par")); xml_request.append(xml_par);
	xml_node = $(XML("step")); xml_node.text(step); xml_par.append(xml_node);
	return (xml_send(xml_request));
}
//
function page_act(page)
{
	$(".body_wrapper:not(#side-menu)").hide();
	$(page).show();
	curr_page = page;
	//
	if (page == "#main-page")
	{
		set_tout_stdby();
	}
	else
	{
		stopWaitingScr();
		clearTimeout(t_out_home);
	}
}
function dynamic_page_act(widget_obj)
{
	if ($("." + widget_obj.name).closest("#settings-page").length > 0)
	{
		page_act("#settings-page");
		schema_act("#settings-page", "quadrant_abcd");
	}
	else if ($("." + widget_obj.name).closest("#seeking-page").length > 0)
	{
		page_act("#seeking-page");
		schema_act("#seeking-page", "quadrant_abcd");
	}
	else if ($("." + widget_obj.name).closest(".JSdialog").length > 0)
	{
		$(".JSdialog").show();
	}
	else if ($("." + widget_obj.name).closest(".JSdialog2").length > 0)
	{
		$(".JSdialog2").show();
	}
	else
	{
		tyu("errore page act");
	}
}
//
function schema_act(page, schema)
{
	$(page + " > .quadrant").hide();
	$(page + " > ." + schema).show();
}
//
function footer_act(page)
{
	$(".footer_wrapper").hide();
	$(page).show();
}
//
function header_act(page)
{
	$(".header_wrapper").hide();
	$(page).show();
}
//
var test_device_saves = {
	gsm:
	{
		vocale: "",
		sms: "",
		digitale: "",
		digitale2: "",
		sia: "",
		sia2: "",
		email: ""
	},
	pstn:
	{
		vocale: "",
		digitale: "",
		digitale2: ""
	},
	wifi:
	{
		sia: "",
		sia2: "",
		email: ""
	},
	common:
	{
		phNum: "",
		digitale: "",
		digitale2: "",
		sia: "",
		sia2: "",
		email: ""
	}
}
//
var parconn = {
	ap_cl_nn: [],
	saved: false
}
var typeconn = {
	mode: null
}
anoms_obj = {
	anoms: [],
	flush_areas: "",
	command: "",
	login_code: "",
	cmd_area: "",
	warning: "",
	//
	getAnomIndex: function(index)
	{
		return this.anoms[index];
	},
	getAnoms: function()
	{
		return this.anoms;
	},
	getSize: function()
	{
		return this.anoms.length;
	},
	isWarning: function()
	{
		return this.warning == "1";
	},
	//
	init: function(anom_xml)
	{
		this.clean();
		//
		this.flush_areas = anom_xml.children("Anoms").attr("flush_area");
		this.cmd_area = anom_xml.children("Anoms").attr("cmd_area");
		this.command = anom_xml.children("Anoms").attr("command");
		this.login_code = anom_xml.children("Anoms").attr("login_code");
		this.warning = anom_xml.children("Anoms").attr("warning");
		//
		var local_anoms = this.anoms;
		anom_xml.find("Anoms Anom").each(function(index)
		{
			var count = $(this).children("cnt").text() || 0;
			var anom_id = xml_file_configuration
				.children("Devices")
				.children("Device[id='" + $(this).children("id").text() + "']")
				.attr("desc");
			var anom_desc = xml_file_configuration
				.children("Categories")
				.children("Category")
				.children("Subcategories")
				.children("Subcategory")
				.children("States")
				.children("State[id='" + $(this).children("State").text() + "']")
				.attr("desc");
			var anom_ts = $(this).children("Timestamp").text();
			var anom_localdt = $(this).children("localdt").text();
			local_anoms[index] = new Anom(anom_id, anom_desc, count, anom_ts, anom_localdt);
		});
	},
	clean: function()
	{
		this.anoms = [];
		this.flush_areas = "";
		this.login_code = "";
		this.command = "";
		this.cmd_area = "";
		this.warning = "";
	}
};
//
Date.prototype.std_timezone_offset = function()
{
	var jan = new Date(this.getFullYear(), 0, 1);
	var jul = new Date(this.getFullYear(), 6, 1);
	var jan_off = jan.getTimezoneOffset();
	var jul_off = jul.getTimezoneOffset();
	return [Math.max(jan_off, jul_off), jan_off-jul_off];
}
Date.prototype.dst_remover = function()
{
	var std_timezone = this.std_timezone_offset();
	if (this.getTimezoneOffset() < std_timezone[0])
	{
		var ts_mod = this.getTime()+(std_timezone[0]*60*1000);
		this.setTime(ts_mod);
	}
	return this.getTime();
}
Date.prototype.dst_adder = function()
{
	var std_timezone = this.std_timezone_offset();
	if (this.getTimezoneOffset() < std_timezone[0])
	{
		var ts_mod = this.getTime()-(std_timezone[0]*60*1000);
		this.setTime(ts_mod);
	}
	return this.getTime();
}
//
function send_state_stdby()
{
	xml_request = xml_request_head_build("STATE"); //STATE - INDICATION DI GUI
	xml_par = $(XML("type")); xml_par.text("STDBY"); xml_request.append(xml_par);
	xml_send(xml_request);
}
function send_state_home()
{
	xml_request = xml_request_head_build("STATE"); //STATE - INDICATION DI GUI
	xml_par = $(XML("type")); xml_par.text("HOME"); xml_request.append(xml_par);
	xml_send(xml_request);
}
function send_state_maint()
{
	xml_request = xml_request_head_build("STATE"); //STATE - INDICATION DI GUI
	xml_par = $(XML("type")); xml_par.text("MAINT"); xml_request.append(xml_par);
	xml_send(xml_request);
}
function send_state_welcome_exit()
{
	xml_request = xml_request_head_build("STATE"); //STATE - INDICATION DI GUI
	xml_par = $(XML("type")); xml_par.text("WELCOME_EXIT"); xml_request.append(xml_par);
	xml_send(xml_request);
}
function send_state_anom_flush(areas)
{
	xml_request = xml_request_head_build("STATE"); //STATE - INDICATION DI GUI
	xml_par = $(XML("type")); xml_par.text("ANOM_ACK"); xml_request.append(xml_par);
	xml_par = $(XML("value")); xml_par.text(areas); xml_request.append(xml_par);
	xml_send(xml_request);
}
function send_state_brightness(value)
{
	xml_request = xml_request_head_build("STATE"); //STATE - INDICATION DI GUI
	xml_par = $(XML("type")); xml_par.text("BRIGHT"); xml_request.append(xml_par);
	xml_par = $(XML("value")); xml_par.text(value); xml_request.append(xml_par);
	xml_send(xml_request);
}
function send_state_volume(value)
{
	xml_request = xml_request_head_build("STATE"); //STATE - INDICATION DI GUI
	xml_par = $(XML("type")); xml_par.text("VOL_LOCAL"); xml_request.append(xml_par);
	xml_par = $(XML("value")); xml_par.text(value); xml_request.append(xml_par);
	xml_send(xml_request);
}
function send_logOut()
{
	xml_request = xml_request_head_build("MENU");
	xml_par = $(XML("act")); xml_par.text("LOGOUT"); xml_request.append(xml_par);	
	xml_par = $(XML("page")); xml_par.text("USER"); xml_request.append(xml_par);
	xml_par = $(XML("par")); xml_request.append(xml_par);
	xml_send(xml_request);
}
//
function are_there_tvcc()
{
	var len = 0;
	len = xml_file_configuration.find("Devices Device[deleted='FALSE'] Subcategory").filter(function()
	{
		if
		(
			(
				$(this).text() == WS_DEV_ALARM_TVCC_STR
				//|| $(this).text() == WS_DEV_ALARM_SEN_PHOTOPIR_STR
			)
			&& $(this).siblings("Excluded").text() == "FALSE"
		)
			return true;
		else
			return false;
	}).length;
	if (len == 0)
		return false;
	else
		return true;
}
//
function summon_sideanom(lead)
{
	if ("widget_sideanom" in pag_table_new)
	{
		if (pag_table_new["widget_sideanom"].loaded)
		{
			if (lead == null || lead == "display")
			{
				pag_table_new["widget_sideanom"].refresh();
			}
			else if (lead == "hide")
			{
				pag_table_new["widget_sideanom"].hide();
			}
			else
			{
				tyu("non implementato");
			}
		}
	}
}
//stdby
function set_tout_stdby()
{
	clearTimeout(t_out_home);
	if (stdby_t_in != 0)
	{
		t_out_home = setTimeout(
			function()
			{
				if (curr_page == "#main-page")
				{
					if ($(".home .JSdialog").is(":hidden"))
					{
						if ($(".JSstdby").attr("data-curpage") != "widget_stdby")
						{
							pag_change(".JSstdby", "widget_stdby");
						}
						else
						{
							stdby_in();
						}
					}
					else
					{
						set_tout_stdby();
					}
				}
				else
				{
					set_tout_stdby();
				}
			}, stdby_t_in * 1000);
	}
}
$(document).off(".stdby").on(vmousedown+".stdby", function()
{
	set_tout_stdby();
});
function stdby_in()
{
	$(".header_center_container").hide();
	$("#header_center_container_stdby").show();
	$(".JSstdby").show();
	$("#header-home-page .head_button").hide();
	$("#mygsminfo").addClass("hide");
	dev_list_scroll_pointer = 0;
	$("#header-home-page").addClass("scuro");
	header_icons_reload();
	//
	stdby_flg = true;
	//
	send_state_stdby();
}
function stdby_out()
{
	stdby_flg = false;
	//
	if ($(".JSstdby").is(":visible"))
	{
		$(".header_center_container").show();
		$("#header_center_container_stdby").hide();
		$(".JSstdby").hide();
		$("#header-home-page .head_button").show();
		$("#mygsminfo").removeClass("hide");
		$("#header-home-page").removeClass("scuro");
		header_icons_reload();
		//
		send_state_home();
		//
		//start_tvcc();
	}
	set_tout_stdby();
}
//
function disable_selectable(target)
{
	$(target)
		.addClass("unselectable")
		.attr("unselectable", "on")
		.attr("draggable", "false")
		.on("dragstart", function() {return false;});
}
//
function load_devices_new(dev_filter, filter_type, widget_obj)
{
	if (dev_filter == null || widget_obj == null)
	{
		tyu("load_devices_new non impostata");
		return;
	}
	//
	xml_menu_load_send(WS_DEV_STR, dev_filter, filter_type, widget_obj.name);
}
function load_devices_cust(dev_array, dev_filter, filter_type)
{
	if (dev_array != null) dev_array = [];
	pag_table_new["main_obj"].preload_dev = true;
	xml_menu_load_send(WS_DEV_STR, dev_filter, filter_type, "main_obj");
}
function load_devices(other)
{
	other = other || "";
	xml_any_tbl = [];
	pag_table_new["main_obj"].preload_dev = true;
	xml_menu_load_send
	(
		WS_DEV_STR
		, other
		+ WS_DEV_ALARM_WIFI_STR
		+ "|" + WS_DEV_ALARM_TERM_STR
		+ "|" + WS_DEV_ALARM_CEN_STR
		+ "|" + WS_DEV_ALARM_LCD_STR
		+ "|" + WS_DEV_ALARM_POW_STR
		+ "|" + WS_DEV_ALARM_RTC_STR
		+ "|" + WS_DEV_ALARM_BAT_STR
		+ "|" + WS_DEV_ALARM_CARRIER_STR
		+ "|" + WS_DEV_ALARM_CLOUD_STR
		+ "|" + WS_DEV_ALARM_TELEGEST_STR
		+ "|" + WS_DEV_ALARM_DASH_STR
		+ "|" + WS_DEV_ALARM_AVE_AUTOMATION_STR
		+ "|" + WS_DEV_ALARM_IOT_STR
		+ "|" + WS_DEV_ALARM_THERMOSTAT_STR
		, "filter_not"
		, "main_obj"
	);
}
function pre_gui_device(all_devices)
{
	xmlAnyTbl = {};
	xmlSubTbl = {};
	xml_any_tbl = []; //retrocompatibilità
	var i = 0;
	var rieFlg = false;
	//
	for (var j = NODE_DEV_TOT_LB; j <= NODE_DEV_TOT_UB; j++)
		node_dev_tbl[j] = -1;
	//
	all_devices.find("par item")
	.each(function(index)
	{
		var currIndex = index;
		//
		//PRIMA PARTE che riordina i filari virtuali
		if (rieFlg)
		{
			i--;
			currIndex = index - (WIRE_I_VIRTUAL_ORD_OFFSET - WIRE_I_INPUT_ORD_OFFSET) - i - i;
			if (i == 0)
				rieFlg = false;
			//
			xml_any_tbl[currIndex + i] = $(this); //retrocompatibilità
		}
		else
		{
			xml_any_tbl.push($(this)); //retrocompatibilità
		}
		//FINE PRIMA PARTE
		//
		xmlAnyTbl[currIndex + i] = {};
		$(this).children().each(function()
		{
			xmlAnyTbl[currIndex + i][$(this)[0].nodeName] = $(this);
		});
		//
		var subcat = xmlAnyTbl[currIndex + i]["subcategory"].text();
		if (xmlSubTbl[subcat] == null)
			xmlSubTbl[subcat] = [];
		xmlSubTbl[subcat].push($(this));
		//
		if (xmlAnyTbl[currIndex + i]["bus_node"] != null)
		{
			var node =  Number(xmlAnyTbl[currIndex + i]["bus_node"].text());
			if (node >= NODE_DEV_TOT_LB && node <= NODE_DEV_TOT_UB)
				node_dev_tbl[node] = currIndex + i;
		}
		//
		//SECONDA PARTE che riordina i filari virtuali
		if (subcat == WS_DEV_ALARM_WIRED_STR)
		{
			var ord = Number(xmlAnyTbl[currIndex + i]["ord"].text());
			if (ord >= WIRE_I_ORD_OFFSET && ord <= WIRE_I_INPUT_ORD_OFFSET)
			{
				var idx = currIndex + i++ + 1;
				xmlAnyTbl[idx] = {};
				//
				xml_any_tbl.push({}); //retrocompatibilità
			}
			if (ord == WIRE_I_VIRTUAL_ORD_OFFSET && i == WIRE_NC_DUAL_NUMBER)
				rieFlg = true;
		}
		//FINE SECONDA PARTE
		//
	});
}
var associative_dbid_dev = [];
function pre_gui_device_test(all_devices)
{
	associative_dbid_dev = [];
	xml_any_tbl_test = [];
	//
	all_devices.find("par item").each(function(index)
	{
		xml_any_tbl_test[index] = $(this);
		associative_dbid_dev[$(this).children("id").text()] = index;
	});
}
function pre_gui_device_parcen(all_devices, widget_obj)
{
	widget_obj.xml_any_tbl_parcen = [];
	widget_obj.xml_any_tbl_parcen_bkp = [];
	//
	all_devices.find("par item").filter(function()
	{
		if
		(
			$(this).children("subcategory").text() == WS_DEV_ALARM_WIRED_STR
			&&
			(
				$(this).children("ord").text() == "0"
				|| $(this).children("wire_type").text() == "5"
			)
		)
			return false;
		else
			return true;
	}).each(function(index)
	{
		$(this).children().not("id, led, ena, name").remove();
		widget_obj.xml_any_tbl_parcen[index] = $(this);
		widget_obj.xml_any_tbl_parcen_bkp[index] = $(this).clone();
	});
}
function pre_gui_device_scenery(all_devices)
{
	xml_any_tbl_scenery = [];
	//
	all_devices.find("par item").filter(function()
	{
		if
		(
			(
				$(this).children("subcategory").text() == WS_DEV_ALARM_RELAY_STR
				&& $(this).children("mode").text() != "2"
			)
			||
			(
				$(this).children("subcategory").text() == WS_DEV_ALARM_WIRED_STR
				&& $(this).children("wire_out_mode").text() != "2"
			)
		)
			return false;
		else return true;
	}).each(function(index)
	{
		xml_any_tbl_scenery[index] = $(this);
	});
}
function gsm_check()
{
	return xml_file_configuration.find("Devices Device[deleted='FALSE']").filter(function()
	{
		if ($(this).children("Subcategory").text() == WS_DEV_ALARM_GSM_STR)
			return true;
		else
			return false;
	}).length > 0;
}
function pstn_check()
{
	return xml_file_configuration.find("Devices Device[deleted='FALSE']").filter(function()
	{
		if ($(this).children("Subcategory").text() == WS_DEV_ALARM_PSTN_STR)
			return true;
		else
			return false;
	}).length > 0;
}
//
function isHome()
{
	return $("#wrapper .home").length == 1;
}
function isWizard()
{
	return $("#wrapper .wizard").length == 1;
}
//
function global_clean_page()
{
	pag_clear(".home .JSdialog, .home .JSdialog2");
	//
	//
	u_p = "";
	u_i = "";
	$("#home .JSdialog").off("on_pw_ok");
	send_logOut();
	//
	pag_clear("#settings-page .quadrant_abcd");
	pag_clear("#seeking-page .quadrant_abcd");
}
function body_wrapper_cleaner(widget_obj)
{
	if (widget_obj != null)
	{
		if ("clean_page" in widget_obj)
			widget_obj.clean_page();
	}
	//
	global_clean_page();
}
function back_from_yellow_summary()
{
	wizard_flg = false;
	//
	if ("summary" in pag_table_new)
		if (pag_table_new["summary"].loaded)
			pag_table_new["summary"].decommit_cover();
	//
	page_act("#seeking-page");
	schema_act("#seeking-page", "quadrant_abcd");
	pag_clear("#side-menu");
	$("#gui_body .body_wrapper, .wizard_body .body_wrapper").removeClass("side_menu_mode");
	$("#side-menu").hide();
}
function back_to_home(widget_obj)
{
	if (wizard_flg)
		back_from_yellow_summary(); 
	wizard_flg = false;
	//
	$("#header-home-page2 .close, #header-home-page2 .home").removeClass("disabled");
	//
	body_wrapper_cleaner(widget_obj);
	//
	$("#footer_central_container").empty();
	//
	swap_body_foot(true);
	//
	schema_act("#main-page", pag_table_new["home"].schema);
	page_act("#main-page");
	footer_act("#footer-home-page");
	//
	clearTimeout(login_tout);
	clearTimeout(login_dec_tout);
	pag_clear(".home .JSdialog, .home .JSdialog2");
	$(".home .JSdialog, .home .JSdialog2").hide();
	//
	header_act("#header-home-page");
	$("#header-home-page2 .close").off("click");
	//
	if
	(
		widget_obj.name == "widget_login_small"
		|| widget_obj.name == "widget_tvcc"
		|| widget_obj.name == "widget_sideanom"
		|| widget_obj.name == "widget_test_device"
		|| widget_obj.name == "widget_log"
	)
	{
		//
	}
	else
	{
		if (saveModFlg)
		{
			saveModFlg = false;
			file_conf_request();
		}
	}
}
function away_from_home()
{
	swap_body_foot(false);
}
function swap_body_foot(ena_sw)
{
	if (isTema("common_tema"))
	{
		if (ena_sw)
		{
			$("#home").addClass("swap");
		}
		else
		{
			$("#home").removeClass("swap");
		}
	}
	else
	{
		$("#home").removeClass("swap");
	}
}
//
function login_permission_str_get(dest_page)
{
	var res = "";
	if (dest_page == "code_miss")
	{
		res = "USER|POWERUSER|INST"
	}
	else if (dest_page == "settings")
	{
		if (!imq_get())
			res = "POWERUSER|INST";
		else
			res = "POWERUSER";
	}
	else if (dest_page == "settings inst")
	{
		res = "INST";
	}
	else if (dest_page == "settings generic")
	{
		res = "POWERUSER|INST";
	}
	else if (dest_page == "zone_select")
	{
		res = "USER|POWERUSER";
	}
	else if (dest_page == "par_comm")
	{
		if (!imq_get())
			res = "POWERUSER|INST";
		else
			res = "POWERUSER";
	}
	else if (dest_page == "par_cloud")
	{
		if (!imq_get())
			res = "POWERUSER|INST";
		else
			res = "POWERUSER";
	}
	else if (dest_page == "mod_user")
	{
		if (!imq_get())
			res = "POWERUSER|INST";
		else
			res = "POWERUSER";
	}
	else if (dest_page == "mod_test")
	{
		if (!imq_get())
			res = "POWERUSER|INST";
		else
			res = "POWERUSER";
	}
	else if (dest_page == "mod_log")
	{
		if (!imq_get())
			res = "USER|POWERUSER|INST";
		else
			res = "USER|POWERUSER";
	}
	else if (dest_page == "login_tvcc")
	{
		if (!imq_get())
			res = "USER|POWERUSER|INST";
		else
			res = "USER|POWERUSER";
	}
	else if (dest_page == "scenery")
	{
		res = "USER|POWERUSER";
	}
	else if (dest_page == "scenery_edit")
	{
		res = "POWERUSER|INST";
	}
	return(res);
}
var loginType = "";
function send_login(dest_page, extra)
{
	loginType = "";
	//
	xml_request = xml_request_head_build("MENU", dest_page == "code_miss" ? null : "widget_login_small");
	//
	if (dest_page == "code_miss" && imq_get())
	{
		loginType = "SETTINGS";
		//
		xml_par = $(XML("filter")); xml_par.text(login_permission_str_get(dest_page)); xml_request.append(xml_par);
		//
		xml_par = $(XML("act")); xml_par.text("LOGIN"); xml_request.append(xml_par);
		xml_par = $(XML("page")); xml_par.text("USER"); xml_request.append(xml_par);
		xml_par = $(XML("par")); xml_request.append(xml_par);
		xml_item = $(XML("code")); xml_item.text("1"); xml_par.append(xml_item);
		xml_item = $(XML("type")); xml_item.text(loginType); xml_par.append(xml_item);
		xml_send(xml_request);
	}
	else if (dest_page == "home")
	{
		xml_request = xml_request_head_build("SCENE_CMD", "widget_login_small");
		xml_par = $(XML("Command")); xml_par.text("START"); xml_request.append(xml_par);
		xml_par = $(XML("Scene")); xml_par.text(extra); xml_request.append(xml_par);
		xml_par = $(XML("Arguments")); xml_request.append(xml_par);
		xml_node = $(XML("Argument")); xml_node.attr("id", "PIN"); xml_node.text(pin); xml_par.append(xml_node);
		xml_send(xml_request);
	}
	else if (dest_page == "settings")
	{
		loginType = "SETTINGS";
		//
		xml_par = $(XML("filter")); xml_par.text(login_permission_str_get(dest_page)); xml_request.append(xml_par);
		//
		xml_par = $(XML("act")); xml_par.text("LOGIN"); xml_request.append(xml_par);
		xml_par = $(XML("page")); xml_par.text("USER"); xml_request.append(xml_par);
		xml_par = $(XML("par")); xml_request.append(xml_par);
		xml_item = $(XML("code")); xml_item.text(pin); xml_par.append(xml_item);
		xml_item = $(XML("type")); xml_item.text(loginType); xml_par.append(xml_item);
		xml_send(xml_request);
	}
	else if (dest_page == "settings inst")
	{
		loginType = "SETTINGS_INST";
		//
		xml_par = $(XML("filter")); xml_par.text(login_permission_str_get(dest_page)); xml_request.append(xml_par);
		//
		xml_par = $(XML("act")); xml_par.text("LOGIN"); xml_request.append(xml_par);
		xml_par = $(XML("page")); xml_par.text("USER"); xml_request.append(xml_par);
		xml_par = $(XML("par")); xml_request.append(xml_par);
		xml_item = $(XML("code")); xml_item.text(pin); xml_par.append(xml_item);
		xml_item = $(XML("type")); xml_item.text(loginType); xml_par.append(xml_item);
		xml_send(xml_request);
	}
	else if (dest_page == "settings generic")
	{
		loginType = "SETTINGS";
		//
		xml_par = $(XML("filter")); xml_par.text(login_permission_str_get(dest_page)); xml_request.append(xml_par);
		//
		xml_par = $(XML("act")); xml_par.text("LOGIN"); xml_request.append(xml_par);
		xml_par = $(XML("page")); xml_par.text("USER"); xml_request.append(xml_par);
		xml_par = $(XML("par")); xml_request.append(xml_par);
		xml_item = $(XML("code")); xml_item.text(pin); xml_par.append(xml_item);
		xml_item = $(XML("type")); xml_item.text(loginType); xml_par.append(xml_item);
		xml_send(xml_request);
	}
	else if ((dest_page == "zone_select"))
	{
		loginType = "TERM_CODE";
		//
		xml_par = $(XML("filter")); xml_par.text(login_permission_str_get(dest_page)); xml_request.append(xml_par);
		//
		xml_par = $(XML("act")); xml_par.text("LOGIN"); xml_request.append(xml_par);
		xml_par = $(XML("page")); xml_par.text("USER"); xml_request.append(xml_par);
		xml_par = $(XML("par")); xml_request.append(xml_par);
		xml_item = $(XML("code")); xml_item.text(pin); xml_par.append(xml_item);
		xml_item = $(XML("type")); xml_item.text(loginType); xml_par.append(xml_item);
		xml_send(xml_request);
	}
	else if (dest_page == "par_comm")
	{
		loginType = "SETTINGS";
		//
		xml_par = $(XML("filter")); xml_par.text(login_permission_str_get(dest_page)); xml_request.append(xml_par);
		//
		xml_par = $(XML("act")); xml_par.text("LOGIN"); xml_request.append(xml_par);
		xml_par = $(XML("page")); xml_par.text("USER"); xml_request.append(xml_par);
		xml_par = $(XML("par")); xml_request.append(xml_par);
		xml_item = $(XML("code")); xml_item.text(pin); xml_par.append(xml_item);
		xml_item = $(XML("type")); xml_item.text(loginType); xml_par.append(xml_item);
		xml_send(xml_request);
	}
	else if (dest_page == "par_cloud")
	{
		loginType = "SETTINGS";
		//
		xml_par = $(XML("filter")); xml_par.text(login_permission_str_get(dest_page)); xml_request.append(xml_par);
		//
		xml_par = $(XML("act")); xml_par.text("LOGIN"); xml_request.append(xml_par);
		xml_par = $(XML("page")); xml_par.text("USER"); xml_request.append(xml_par);
		xml_par = $(XML("par")); xml_request.append(xml_par);
		xml_item = $(XML("code")); xml_item.text(pin); xml_par.append(xml_item);
		xml_item = $(XML("type")); xml_item.text(loginType); xml_par.append(xml_item);
		xml_send(xml_request);
	}
	else if (dest_page == "mod_user")
	{
		loginType = "SETTINGS";
		//
		xml_par = $(XML("filter")); xml_par.text(login_permission_str_get(dest_page)); xml_request.append(xml_par);
		//
		xml_par = $(XML("act")); xml_par.text("LOGIN"); xml_request.append(xml_par);
		xml_par = $(XML("page")); xml_par.text("USER"); xml_request.append(xml_par);
		xml_par = $(XML("par")); xml_request.append(xml_par);
		xml_item = $(XML("code")); xml_item.text(pin); xml_par.append(xml_item);
		xml_item = $(XML("type")); xml_item.text(loginType); xml_par.append(xml_item);
		xml_send(xml_request);
	}
	else if (dest_page == "mod_test")
	{
		loginType = "SETTINGS";
		//
		xml_par = $(XML("filter")); xml_par.text(login_permission_str_get(dest_page)); xml_request.append(xml_par);
		//
		xml_par = $(XML("act")); xml_par.text("LOGIN"); xml_request.append(xml_par);
		xml_par = $(XML("page")); xml_par.text("USER"); xml_request.append(xml_par);
		xml_par = $(XML("par")); xml_request.append(xml_par);
		xml_item = $(XML("code")); xml_item.text(pin); xml_par.append(xml_item);
		xml_item = $(XML("type")); xml_item.text(loginType); xml_par.append(xml_item);
		xml_send(xml_request);
	}
	else if (dest_page == "mod_log")
	{
		loginType = "TERM_CODE";
		//
		xml_par = $(XML("filter")); xml_par.text(login_permission_str_get(dest_page)); xml_request.append(xml_par);
		//
		xml_par = $(XML("act")); xml_par.text("LOGIN"); xml_request.append(xml_par);
		xml_par = $(XML("page")); xml_par.text("USER"); xml_request.append(xml_par);
		xml_par = $(XML("par")); xml_request.append(xml_par);
		xml_item = $(XML("code")); xml_item.text(pin); xml_par.append(xml_item);
		xml_item = $(XML("type")); xml_item.text(loginType); xml_par.append(xml_item);
		xml_send(xml_request);
	}
	else if (dest_page == "login_tvcc")
	{
		loginType = "TERM_CODE";
		//
		xml_par = $(XML("filter")); xml_par.text(login_permission_str_get(dest_page)); xml_request.append(xml_par);
		//
		xml_par = $(XML("act")); xml_par.text("LOGIN"); xml_request.append(xml_par);
		xml_par = $(XML("page")); xml_par.text("USER"); xml_request.append(xml_par);
		xml_par = $(XML("par")); xml_request.append(xml_par);
		xml_item = $(XML("code")); xml_item.text(pin); xml_par.append(xml_item);
		xml_item = $(XML("type")); xml_item.text(loginType); xml_par.append(xml_item);
		xml_send(xml_request);
	}
	else if (dest_page == "scenery")
	{
		loginType = "TERM_CODE";
		//
		xml_par = $(XML("filter")); xml_par.text(login_permission_str_get(dest_page)); xml_request.append(xml_par);
		//
		xml_par = $(XML("act")); xml_par.text("LOGIN"); xml_request.append(xml_par);
		xml_par = $(XML("page")); xml_par.text("USER"); xml_request.append(xml_par);
		xml_par = $(XML("par")); xml_request.append(xml_par);
		xml_item = $(XML("code")); xml_item.text(pin); xml_par.append(xml_item);
		xml_item = $(XML("type")); xml_item.text(loginType); xml_par.append(xml_item);
		xml_send(xml_request);
	}
	else if (dest_page == "scenery_edit")
	{
		loginType = "SETTINGS";
		//
		xml_par = $(XML("filter")); xml_par.text(login_permission_str_get(dest_page)); xml_request.append(xml_par);
		//
		xml_par = $(XML("act")); xml_par.text("LOGIN"); xml_request.append(xml_par);
		xml_par = $(XML("page")); xml_par.text("USER"); xml_request.append(xml_par);
		xml_par = $(XML("par")); xml_request.append(xml_par);
		xml_item = $(XML("code")); xml_item.text(pin); xml_par.append(xml_item);
		xml_item = $(XML("type")); xml_item.text(loginType); xml_par.append(xml_item);
		xml_send(xml_request);
	}
}
var camHolder =
{
	cams: {},
	//
	registerCams: function(widget_obj)
	{
		var camHolderObj = this;
		this.cams = {};
		var i = 0;
		xml_file_configuration.find("Devices Device").each(function()
		{
			if
			(
				$(this).children("Subcategory").text() == WS_DEV_ALARM_TVCC_STR
				&& $(this).attr("deleted") == "FALSE"
				&& $(this).children("Excluded").text() == "FALSE"
			)
			{
				var camId = $(this).attr("id");
				var camName = $(this).attr("desc");
				var camCommand = xml_file_configuration.find("Devices Device[id='" + camId + "'][deleted='FALSE'] Commands").text();
				//
				$("." + widget_obj.name + " .tvcc.quad .apportion").eq(i)
					.attr("id", camId)
					.click(function() 
					{
						$(this).addClass("fullscr g_bg_dark alwaysOnTop").removeClass("quad");
						$(this).children(".camSlide").show();
						//
						if ("widget_tvcc" in pag_table_new)
							if (pag_table_new["widget_tvcc"].loaded)
								pag_table_new["widget_tvcc"].arrow_slide_cam();
					})
					.children(".cam_name").text(camName);
				i++;
				//
				camHolderObj.cams[camId] =
				{
					id: camId,
					name: camName,
					command: camCommand,
					period: 1,
					requestFrame: function()
					{
						camHolderObj.sendRequest(this.id, this.command);			
					},
					receiveFrame: function(frame)
					{
						$("." + widget_obj.name + " .tvcc.quad .apportion[id='" + this.id + "'] .widget_tvcc_ima").attr("style", "background-image: url(data:image/jpg;base64," + frame + ");");
						//
						var camObj = this;
						setTimeout(function()
						{
							camObj.requestFrame();
						}, this.period * 1000);
					}					
				};
			}
		});
	},
	//
	startCams: function()
	{
		for (var key in this.cams)
		{
			this.cams[key].requestFrame();
		}
	},
	//
	sendRequest: function(cam_id, command_cam)
	{
		xml_request = xml_request_head_build("DEVICE_CMD", "widget_tvcc");
		xml_par = $(XML("Command")); xml_par.text(command_cam); xml_request.append(xml_par);
		xml_par = $(XML("Device")); xml_par.text(cam_id); xml_request.append(xml_par);
		xml_send(xml_request);
	},
	getResponse: function(cam_id, frame)
	{
		this.cams[cam_id].receiveFrame(frame);
	}
}
//
function draw_footer_button(label, id, prepend_flg, bclass)
{
	if ($(id).length > 0)
		return;
	//
	bclass = bclass || id;
	//
	var button_html =
	(
		"<div class='footer_container_btn_inside " + bclass + "' id='" + id + "'>"
		+ 		"<div class='foot_button disableMode2 bg_azure_gr'>"
		+			"<div class='label'>" + label + "</div>"
		+ 		"</div>"
		+ 	"</div>"
	);
	if (prepend_flg)
		$("#footer_central_container").prepend(button_html);
	else
		$("#footer_central_container").append(button_html);
}
//
function session_st_refresh()
{
	if (QT)
	{
		$("#mysessionstatus").hide();
	}
	else
	{
		var tema_path = (isTema("light_tema") ? "light/" : "");
		//
		$("#mysessionstatus").show();
		if (!imq_get())
		{
			$("#mysessionstatus").attr("src", "{TMPL_DIR}res/" + tema_path + "session_st_" + role_str.toLowerCase() + ".png");
			uname_str = (role_str == "NOROLE" ? "" : uname_str);
			$("#mysessionstatus").attr("title", uname_str);
		}
		else
		{
			$("#mysessionstatus").attr("src", "{TMPL_DIR}res/" + tema_path + "session_st_norole.png");			
			$("#mysessionstatus").attr("title", "");
		}
	}
}
//
function wizard_footer_init() //ex welcome_init
{
	if (QT) wbr_version = webbridge.getVersion();
	else wbr_version = null;
	web_version = $("#wrapper").attr("data-web-version");
	//
	tlc_version = xml_file_configuration.find("Central Versions tlc").text();
	som_version = xml_file_configuration.find("Central Versions som").text();
	car_version = xml_file_configuration.find("Central Versions carrier").text();
	ker_version = xml_file_configuration.find("Central Versions kernel").text();
	datesom = xml_file_configuration.find("Central Versions datesom").text();
	package_version = xml_file_configuration.find("Central Versions package").text();
	$(".footer_container_info").show();
	$("#upd span").text("  "+ package_version);
	$(".som span").text("  "+ som_version);
	$(".carrier span").text("  "+ car_version);
	if (xml_file_configuration.find("Central Versions imei").text() == "")
		$(".imei span").text(GSM_STATUS_NOGSM);
	else if (xml_file_configuration.find("Central Versions imei").text() == "INIT")
		$(".imei span").text(GSM_STATUS_INIT);
	else
		$(".imei span").text(xml_file_configuration.find("Central Versions imei").text());
}
//
var t_out_toast;
function poptoast(toastmsg)
{
	$("#JStoast").fadeOut("slow", function()
	{
		$("#JStoast").html("<div>" + toastmsg + "</div>");
		clearTimeout(t_out_toast);
		t_out_toast = setTimeout(function()
		{
			$("#JStoast").fadeOut("slow", function(){ $("#JStoast").empty(); });
		}, TOAST_TOUT_MS);
	});
	$("#JStoast").fadeIn("slow").css("display", "table");
}
function isToastBusy()
{
	return $("#JStoast").is(":visible");
}
//
function startWaitingScr(contoAllaRovescia, contenitore)
{
	if (waiting_status == 0)
	{
		if ("widget_waiting" in pag_table_new)
		{
			waiting_status = 1;
			pag_table_new["widget_waiting"].countdown = "none";
			if (contoAllaRovescia != null)
				pag_table_new["widget_waiting"].countdown = contoAllaRovescia;
			pag_table_new["widget_waiting"].onload();
		}
	}
}
function stopWaitingScr()
{
	if (waiting_status == 1)
	{
		waiting_status = 0;
		$(".JSwait").hide();
	}
}
//
function imq_set(str)
{
	if (!(imq_flg_str == str))
	{
		session_u_p = null;
		role_str = "NOROLE";
		uname_str = "";
		session_st_refresh();
	}
	imq_flg_str = str;
}
function imq_get()
{
	return(!(imq_flg_str == "0"));
}
//
function glance_body_wrapper(widget_obj)
{
	if (widget_obj != null)
	{
		if ("bodyWrapper" in widget_obj)
		{
			if ($("." + widget_obj.name).closest("#settings-page").length > 0)
				widget_obj.bodyWrapper = "#settings-page";
			else if ($("." + widget_obj.name).closest("#seeking-page").length > 0)
				widget_obj.bodyWrapper = "#seeking-page";
			else
				tyu("body_wrapper non registrato");
		}
	}
	else
	{
		tyu("glance_body_wrapper FAULT");
	}
}
//
function footer_button_rotate()
{
	if ($("#footer_central_container .footer_container_btn_inside").length > 1)
	{
		draw_footer_button("", "footer_h2_rot", true);
		//
		//
		var concealable_btn = $("#footer_central_container .footer_container_btn_inside:not(.footer_h2_rot)");
		concealable_btn.not(":first").addClass("conceal");
		//
		$("#footer_h2_rot").off("click").click(function()
		{
			var next_btn = concealable_btn.not(".conceal").addClass("conceal").next();
			if (next_btn.length == 0)
				concealable_btn.first().removeClass("conceal");
			else
				next_btn.removeClass("conceal");
		});
	}
}
//
function autoScrollHunter(page)
{
	var aS = $("[data-curpage='" + page + "'] .autoScroll");
	for (var i = 0; i < aS.length; i++)
		aS.css("right", "-" + (aS[i].offsetWidth - aS[i].clientWidth + 1) + "px");
	aS = $("[data-curpage='" + page + "'] .autoScrollPad");
	for (var i = 0; i < aS.length; i++)
		aS.css("padding-right", (aS[i].offsetWidth - aS[i].clientWidth + 1) + "px");
	//
	//pezzaccia _FT_
	if (page == "widget_audio")
		$("#audio_container_list").hide();
}
//
function summary_highlighter(widget_obj)
{
	if (wizard_flg)
	{
		$("#header-wizard-page .header_title").append(" - " + widget_obj.title);
		//
		$("#summary_menu .item")
			.removeClass("highlight")
			.filter("[data-anchor*='" + widget_obj.name + "']") //per via dell'asterisco, evitare nomi di widget simili
			.addClass("highlight");
	}
}
//
function qtClassified(page)
{
	if (!QT)
		$("[data-curpage='" + page + "'] .QTclassified").remove();
}
//
function printComm(title, content, level)
{
	if ((DEBUG_SW) && (level <= DEBUG_LEVEL))
	{
		rtyu(title + ": ", true);
		if (typeof content == "string")
		{
			rtyu(content, true);
		}
		else
		{
			if (QT)
				rtyu(content.text(), true);
			else
				rtyu(content[0].outerHTML, true);
		}
	}
}
//
function send_get_auto(widget_name)
{
	xml_request = xml_request_head_build("PNP", widget_name);
	xml_par = $(XML("act")); xml_par.text("GET_AUTO"); xml_request.append(xml_par);
	xml_send(xml_request);	
}
//
function urlCommandHookTema()
{
	var res = true;
	var invertedSmblFlg = false;
	//
	if (location.search.indexOf("?") == -1)
	{
		if (location.hash.indexOf("?") == -1)
			res = false;
		else
			invertedSmblFlg = true; //caso in cui ? viene dopo #
	}
	//
	if (res)
	{
		var urlstr = invertedSmblFlg ? location.hash.slice(1) : location.search.slice(1); //caso in cui ? viene dopo #
		var gui_idx = urlstr.indexOf("GUI=");
		if (gui_idx == -1)
		{
			res = false;
		}
		else
		{
			var gui_type = urlstr.cutAround("GUI=", "&");
			if (gui_type == "legacy")
			{
				theme_pass = 0;
			}
			else if (gui_type == "akomi")
			{
				var theme_idx = urlstr.indexOf("THEME=");
				if (theme_idx == -1)
				{
					res = false;
				}
				else
				{
					var gui_model = urlstr.cutAround("THEME=", "&");
					if (gui_model == "dark")
					{
						theme_pass = 1;
					}
					else if (gui_model == "light")
					{
						theme_pass = 2;
					}
					else if (gui_model == "teal")
					{
						theme_pass = 3;
					}
					else
					{
						res = false;
					}
				}
			}
			else
			{
				res = false;
			}
		}
	}
	//
	return res;
}
function urlCommandHook()
{
	if 
	(
		imq_get()
		|| !HASH_MODE
	)
		return;
	//
	var recuperoSearch = location.hash.cutBefore("?"); //caso in cui ? viene dopo #
	var localHash = location.hash.cutAfter("?");
	var par = localHash.slice(1).split("&");
	for (var i = 0; i < par.length; i++)
	{
		var item = par[i].split("=");
		if (item[0] == "command")
		{
			if (item[1] == "back")
			{
				$("#header-home-page2 .close").trigger("click");
			}
			else if (item[1] == "settings")
			{
				pag_change(".home .JSdialog", "widget_login_small", "settings generic");
			}
			else if (item[1] == "events")
			{
				if (curr_page == "#main-page")
					$("#menu_eventi").trigger("click");
			}
		}
	}
	/*rimuove command=xxxx*/
	localHash = localHash.replace("command=" + localHash.cutAround("command=", "&"), "").replace("&&", "&").replace("#&", "#");
	if (localHash[localHash.length - 1] == '&')
		localHash = localHash.cutAfterLast("&");
	if (location.hash.indexOf("?") > -1)
		location.hash = localHash + "?" + recuperoSearch; //caso in cui ? viene dopo #
	else
		location.hash = localHash;
}
function urlSkipPage(widget_obj)
{
	if (!HASH_MODE)
		return;
	//
	if (widget_obj.name == "widget_welcome")
	{
		if (location.hash.indexOf("command=") > -1)
		{
			$("#welcome_content_start").trigger("click");
		}
	}
}
function saveUrlLevel(level)
{
	if 
	(
		imq_get()
		|| !HASH_MODE
	)
		return;
	//
	stopGlobalWait();
	//
	urlLevel = level;
	//
	var recuperoSearch = location.hash.cutBefore("?"); //caso in cui ? viene dopo #
	var localHash = location.hash.cutAfter("?");
	var str = "#";
	var trovatoLivello = false;
	var trovatoQualcosa = false;
	var par = localHash.slice(1).split("&");
	for (var i = 0; i < par.length; i++)
	{
		var item = par[i].split("=");
		if (item[0] == "")
		{
			//
		}
		else if (item[0] == "level")
		{
			if (trovatoQualcosa)
				str += "&";
			item[1] = level;
			par[i] = item[0] + "=" + item[1];
			str += par[i];
			trovatoQualcosa = true;
			trovatoLivello = true;
		}
		else
		{
			if (trovatoQualcosa)
				str += "&";
			str += par[i];
			trovatoQualcosa = true;	
		}
	}
	if (!trovatoLivello)
	{
		if (trovatoQualcosa)
			str += "&";
		str += "level=" + level;
	}
	if (localHash != str)
	{
		if (location.hash.indexOf("?") > -1)
			location.hash = str + "?" + recuperoSearch; //caso in cui ? viene dopo #
		else
			location.hash = str;
	}
}
function bindHashChange()
{
	if ("onhashchange" in window)
	{
		unBindHashChange();
		$(window).on("hashchange", function()
		{
			urlCommandHook();
		});	
	}
}
function unBindHashChange()
{
	$(window).off("hashchange");
}
function startGlobalWait()
{
	if (!HASH_MODE)
		return;
	//
	$("body").append("<div id='global_wait'><div class='gwtext'></div><div>");
	manageGlobalWait();
}
function stopGlobalWait()
{
	if ($("#global_wait").length > 0)
		$("#global_wait").remove();
}
function manageGlobalWait()
{
	var count = 0;
	var gwint = setInterval(function()
	{
		if ($("#global_wait").length < 1)
			clearInterval(gwint);
		//
		if (count++ > 5)
		{
			count = 0;
			$("#global_wait .gwtext").text("");
		}
		$("#global_wait .gwtext").append(".");
		//
	}, 1 * 1000);	
}
//
function mode_bus_rf_dynamic_gui(container, widget_obj, swtFlg)
{
	if (swtFlg && widget_obj.mode_bus_rf_compact_gui_flg)
	{
		$(container + " .mode_bus_rf").nextAll().filter(function()
		{//filtro per gli ingressi filari
			if ($(this).hasClass("phy_mode"))
			{
				$(this).removeClass("row_7").addClass("row_10");
				return false;
			}
			else
			{
				return true;
			}
		}).show();
		scrollList(widget_obj);
		widget_obj.mode_bus_rf_compact_gui_flg = false;
	}
	else if (!swtFlg && !widget_obj.mode_bus_rf_compact_gui_flg)
	{
		$(container + " .mode_bus_rf").nextAll().filter(function()
		{//filtro per gli ingressi filari
			if ($(this).hasClass("phy_mode"))
			{
				$(this).removeClass("row_10").addClass("row_7");
				return false;
			}
			else
			{
				return true;
			}
		}).hide();
		scrollList(widget_obj);
		widget_obj.mode_bus_rf_compact_gui_flg = true;
	}
}
function mode_bus_rf_dynamic_area_flg(container, widget_obj)
{
	if 
	(
		widget_obj.mode_bus_rf == ALA_MODE_M 
		|| widget_obj.mode_bus_rf == ALA_MODE_P
		|| widget_obj.mode_bus_rf == ALA_MODE_R
		|| widget_obj.mode_bus_rf == ALA_MODE_T
	)
		return false;
	else
		return true;
}
//
function init_index_flgs(idx_flg)
{
	idx_flg[WS_DEV_ALARM_SEN_MAG_STR] = false;
	idx_flg[WS_DEV_ALARM_SEN_MIC_STR] = false;
	idx_flg[WS_DEV_ALARM_WIRED_STR] = false;
	idx_flg[WS_DEV_ALARM_SENUNI_STR] = false;
	idx_flg[WS_DEV_ALARM_BUS_CONC_STR] = false;
	idx_flg[WS_DEV_ALARM_BUS_INPUT_STR] = false;
	idx_flg[WS_DEV_ALARM_BUS_SENSORI_STR] = false;
}
/*funzione che ricava gli indici di lista, e li deposita in arrassTagIii, come se venisse composta la lista dispositivi di add_other_devices*/
/*mantenerne la congruenza con add_other_devices*/
function corrIdxAddDev()
{
	var gui_index = 0;
	var index_flgs = [];
	init_index_flgs(index_flgs);
	arrassTagIii = {};
	for (key in xmlAnyTbl)
	{
		var currDevice = xmlAnyTbl[key];
		var subcategory = currDevice["subcategory"].text();
		var ord = currDevice["ord"].text();
		if (check_son_ena_new(ord, subcategory, currDevice))
		{
			var iii = -1;
			if (subcategory in index_flgs)
			{
				if (ord != "0")
				{
					if (!index_flgs[subcategory])
					{
						gui_index++;
						index_flgs[subcategory] = gui_index;
					}
					if (subcategory == WS_DEV_ALARM_BUS_INPUT_STR)
						iii = index_flgs[subcategory] + "." + ord;
					else
						iii = index_flgs[subcategory] + String.fromCharCode(ord - 1 + 97);
				}
				else
				{
					iii = ++gui_index;
					index_flgs[subcategory] = iii;
				}
			}
			else
			{
				iii = ++gui_index;
			}
			arrassTagIii[currDevice["tag"].text()] = iii;
		}
	}
}
//
function polling_selettivo(devId, subcat, act_flg)
{
	if (isBus(subcat))
	{
		xml_request = xml_request_head_build("MENU", null);
		xml_par = $(XML("act")); xml_par.text(act_flg ? "TEST_ON" : "TEST_OFF"); xml_request.append(xml_par);		
		xml_par = $(XML("page")); xml_par.text(WS_DEV_STR); xml_request.append(xml_par);		
		xml_par = $(XML("par")); xml_request.append(xml_par);
		xml_node = $(XML("item")); xml_node.attr("id", "1"); xml_par.append(xml_node);
		xml_node2 = $(XML("id")); xml_node2.text(devId); xml_node.append(xml_node2);
		xml_send(xml_request);
	}
}
function isBus(subcategory_or_tagid)
{
	if (subcategory_or_tagid[2] != "A")
		subcategory_or_tagid = xml_file_configuration.find("Devices Device[id='" + subcategory_or_tagid + "'] Subcategory").text();
	return (xml_file_configuration.find("Categories Category Subcategories Subcategory[id='" + subcategory_or_tagid + "']").attr("ModelsGroup").indexOf("_BUS_") > -1); 
}
//
function isPreloaded()
{
	return listOfFiles && listOfFiles.length == pagLoadedCount
}
//
function pressed_char_filter(event, key, filter_type)
{
	if (filter_type == "HEX")
	{
		var charInput = null;
		if (key == charInput);
		else
			charInput = key[0].toLowerCase(); 
		return ( //la parentesi aperta deve stare qui
			charInput == "a"
			|| charInput == "b"
			|| charInput == "c"
			|| charInput == "d"
			|| charInput == "e"
			|| charInput == "f"
			|| charInput == "0"
			|| charInput == "1"
			|| charInput == "2"
			|| charInput == "3"
			|| charInput == "4"
			|| charInput == "5"
			|| charInput == "6"
			|| charInput == "7"
			|| charInput == "8"
			|| charInput == "9"
			|| charInput == null
		);
	}
}
//
function global_aa_to_str(area_array, less)
{
	less = less || false;
	//
	var area_str = "";
	for (var i = 0; i < area_array.length; i++)
	{
		if (less)
		{
			if (area_array[i] == 1)
				area_str += (i + 1);
			else
				area_str += "-";
		}
		else
		{
			if (area_array[i] == 1 && area_ena_check(i + 1))
				area_str += (i + 1);
		}
	}
	//
	return area_str;
}
//
function slotTextClick(container)
{
	$("#" + container + " .slot_wrapper .text").off("click").click(function()
	{
		$(this).siblings(".ico").trigger("click");
	});	
}
//
function theme_changer()
{
	$("#wrapper").removeClass("common_tema dark_tema light_tema teal_tema");
	switch(theme_pass)
	{
		case 0:
			break;
		case 1:
			$("#wrapper").addClass("common_tema dark_tema");
			break;
		case 2:
			$("#wrapper").addClass("common_tema light_tema");
			break;
		case 3:
			$("#wrapper").addClass("common_tema teal_tema");
			break;
		default:
			break;
	}
	header_icons_reload();
	myrtc_placer();
	iName_adv();
	settingsButton();
	exit_mode_manager();
}
function header_icons_reload()
{
	var tema_path = (isTema("light_tema") && !$("#header-home-page").hasClass("scuro") ? "light/" : "");
	var tema_path_common = (isTema("common_tema") ? "common/" : "");
	//
	$("#mywifistatus, #mysessionstatus, #mytelegeststatus, #mygsmstatus, #mypowstatus, #mybatstatus").each(function()
	{
		if ($(this).attr("src") != null && $(this).attr("src") != "")
			$(this).attr("src", "{TMPL_DIR}res/" + tema_path + $(this).attr("src").cutBeforeLast("/"));
	});
	$("#mycloudstatus").each(function()
	{
		if ($(this).attr("src") != null && $(this).attr("src") != "")
			$(this).attr("src", "{TMPL_DIR}res/" + tema_path_common + $(this).attr("src").cutBeforeLast("/"));	
	});
}
function isTema(tema)
{
	return $("#wrapper").hasClass(tema);
}
function getTema()
{
	if (isTema("dark_tema"))
		return "dark_tema";
	if (isTema("light_tema"))
		return "light_tema";
	if (isTema("teal_tema"))
		return "teal_tema";
	return "classic_tema";
}
function myrtc_placer()
{
	if (isTema("common_tema"))
	{
		$("#myrtc").hide();
		$("#myrtc2").show();
	}
	else
	{
		$("#myrtc").show();
		$("#myrtc2").hide();
	}
}
function iName_adv()
{
	if (getTema() == "classic_tema")
		$("#i_name").html(cen_name);
	else
		$("#i_name").empty();
}
function settingsButton()
{
	if (getTema() == "classic_tema")
	{
		$("#head_button_settings").removeClass("unavailable");
		$("#head_button_settings2").addClass("unavailable");
		$("#home_from_home").removeClass("unavailable");
	}
	else
	{
		$("#head_button_settings").addClass("unavailable");
		$("#head_button_settings2").removeClass("unavailable");
		$("#home_from_home").addClass("unavailable");
	}
}
function exit_mode_check()
{
	if
	(
		(
			isTSSmart()
			|| isAPPWebView()
		)
		&& isTema("common_tema")
	)
		return true;
	else return false; 
}
function exit_mode_manager()
{
	if (exit_mode_check())
	{
		$("#exit_from_home").removeClass("unavailable");
		$("#centermycontainer, #leftmycontainer, #head_button_settings2").addClass("exit_mode");
		$("#exit_from_home").off("click").click(function()
		{
			closeWebview();
		});
	}
	else	
	{
		$("#exit_from_home").addClass("unavailable");
		$("#centermycontainer, #leftmycontainer, #head_button_settings2").removeClass("exit_mode");
		$("#exit_from_home").off("click");
	}
}
//
function scaleFX()
{
	if (!QT && isTema("common_tema"))
	{
		$("#wrapper.ave.common_tema .slot_wrapper .ico").off("mouseenter touchstart").on("mouseenter touchstart", function()
		{
			if (!($(this).parent().hasClass("disabled")))
			{
				$(this).siblings(".text").css("transform", "scale(0.95)");
				$(this).css("transform", "scale(0.95)");
			}
		});
		$("#wrapper.ave.common_tema .slot_wrapper .text").off("mouseenter touchstart").on("mouseenter touchstart", function()
		{
			if (!($(this).parent().hasClass("disabled")))
			{
				$(this).siblings(".ico").css("transform", "scale(0.95)");
				$(this).css("transform", "scale(0.95)");
			}
		});
		$("#wrapper.ave.common_tema .slot_wrapper .ico").off("mouseleave touchend").on("mouseleave touchend", function()
		{
			$(this).siblings(".text").css("transform", "scale(1)");
			$(this).css("transform", "scale(1)");
		});
		$("#wrapper.ave.common_tema .slot_wrapper .text").off("mouseleave touchend").on("mouseleave touchend", function()
		{
			$(this).siblings(".ico").css("transform", "scale(1)");
			$(this).css("transform", "scale(1)");
		});
	}
	else	
	{
		$("#wrapper.ave .slot_wrapper .ico, #wrapper.ave .slot_wrapper .text").off("mouseenter touchstart").off("mouseleave touchend");
	}
}
//
//
var crossroads = [];
crossroads["STATE"] = [];
crossroads["STATE"]["State"] = [];
crossroads["STATE"]["Device"] = [];
crossroads["MENU"] = [];
crossroads["MENU"]["act page res"] = [];
crossroads["MENU"]["act page"] = [];
crossroads["PNP"] = [];
crossroads["PNP"]["act res"] = [];
//
crossroads["TEST"] = [];
crossroads["TEST"]["act res"] = [];
//
function register_indication()
{
	crossroads["DEVICE_CMD"] = "widget_tvcc widget_mod_device_photopir";
	//
	crossroads["TOAST"] = "main_obj";
	crossroads["FILE"] = "main_obj";
	crossroads["ALERT"] = "main_obj";
	crossroads["STATE"]["Anoms"] = "main_obj";
	crossroads["STATE"]["State"][WS_DEV_ALARM_CEN_MAINT_IN_STR] = "main_obj";
	crossroads["STATE"]["State"][WS_DEV_ALARM_CEN_MAINT_OUT_STR] = "main_obj";
	crossroads["STATE"]["State"][WS_DEV_ALARM_CEN_HOME_STR] = "main_obj";
	crossroads["STATE"]["State"][WS_DEV_ALARM_CEN_STATE_ON_STR] = "widget_leaf_home";
	crossroads["STATE"]["State"][WS_DEV_ALARM_CEN_STATE_OFF_STR] = "widget_leaf_home";
	crossroads["STATE"]["State"][WS_DEV_ALARM_CEN_STATE_PART_STR] = "widget_leaf_home";
	crossroads["STATE"]["State"][WS_DEV_ALARM_CEN_STATE_ALARM_STR] = "widget_leaf_home";
	//
	crossroads["STATE"]["Device"][WS_DEV_ALARM_GSM_STR] = "main_obj_indi"; //necessita di xml_file_configuration aggiornato //perchè l'indication ha l'id di database del device ma non la subcategoria, la quale deve essere ricavata dal file di configurazione
	crossroads["STATE"]["Device"][WS_DEV_ALARM_BAT_STR] = "main_obj_indi"; //necessita di xml_file_configuration aggiornato
	crossroads["STATE"]["Device"][WS_DEV_ALARM_CLOUD_STR] = "main_obj_indi"; //necessita di xml_file_configuration aggiornato
	crossroads["STATE"]["Device"][WS_DEV_ALARM_TELEGEST_STR] = "main_obj_indi"; //necessita di xml_file_configuration aggiornato
	crossroads["STATE"]["Device"][WS_DEV_ALARM_POW_STR] = "main_obj_indi"; //necessita di xml_file_configuration aggiornato
	crossroads["STATE"]["Device"][WS_DEV_ALARM_WIFI_STR] = "main_obj_indi"; //necessita di xml_file_configuration aggiornato
	crossroads["STATE"]["Device"][WS_DEV_ALARM_TERM_STR] = "main_obj_indi"; //necessita di xml_file_configuration aggiornato
	crossroads["STATE"]["Device"][WS_DEV_ALARM_RTC_STR] = "main_obj_indi"; //necessita di xml_file_configuration aggiornato
	crossroads["STATE"]["Device"][WS_DEV_ALARM_REPEATER_STR] = "widget_mod_device_repeater"; //necessita di xml_file_configuration aggiornato
	crossroads["STATE"]["Device"][WS_DEV_ALARM_DASH_STR] = "main_obj_indi"; //necessita di xml_file_configuration aggiornato
	crossroads["STATE"]["Device"][WS_DEV_ALARM_AVE_AUTOMATION_STR] = "main_obj_indi"; //necessita di xml_file_configuration aggiornato
	crossroads["STATE"]["Device"][WS_DEV_ALARM_IOT_STR] = "main_obj_indi"; //necessita di xml_file_configuration aggiornato
	//
	crossroads["MENU"]["act page res"]["LOGIN USER ACCEPTED"] = "widget_login_small";//prima sideanom
	crossroads["MENU"]["act page res"]["LOGIN USER PENDING"] = "widget_login_small";
	crossroads["MENU"]["act page res"]["LOGIN USER REFUSED"] = "widget_login_small main_obj";
	crossroads["MENU"]["act page res"]["LOGIN USER REFUSED_TSLOT"] = "widget_login_small";
	crossroads["MENU"]["act page res"]["LOGIN USER INHIBITED"] = "main_obj widget_login_small";
	crossroads["MENU"]["act page res"]["LOGIN USER NOTIFY"] = "widget_login_small";
	crossroads["MENU"]["act page res"]["LOGIN USER FLUSHED"] = "widget_login_small main_obj";
	//
	crossroads["MENU"]["act page"]["ALIGNED " + WS_DEV_STR] = "widget_add_other_devices";
	crossroads["MENU"]["act page"]["MISALIGNED " + WS_DEV_STR] = "widget_add_other_devices";
	//
	crossroads["MENU"]["act page"]["OK " + WS_TEST_STR] = "widget_keypad widget_test_device_detail";
	crossroads["MENU"]["act page"]["KO " + WS_TEST_STR] = "widget_keypad widget_test_device_detail";
	//
	crossroads["MENU"]["act page"]["ACQUIRED " + WS_TEST_STR] = "widget_test_device_detail";
	crossroads["MENU"]["act page"]["ERROR " + WS_TEST_STR] = "widget_test_device_detail";
	//
	crossroads["MENU"]["act page"]["CHECKED " + WS_TEST_STR] = "widget_test_device_list widget_rt_info2";
	//
	crossroads["MENU"]["act page"]["METER " + WS_TEST_STR] = "widget_test_field_meter";
	//
	crossroads["MENU"]["act page res"]["DELETE " + WS_DEV_STR + " DELETED"] = "";
	crossroads["MENU"]["act page res"]["DELETE " + WS_USER_STR + " DELETED"] = "widget_mod_user";
	//
	//
	crossroads["MENU"]["act page res"]["CLOUD_DOWNLOAD UTILITY OK"] = "widget_utility";
	crossroads["MENU"]["act page res"]["CLOUD_DOWNLOAD UTILITY KO"] = "widget_utility";
	crossroads["MENU"]["act page res"]["CLOUD_DOWNLOAD UTILITY PROGRESS"] = "widget_utility";
	crossroads["MENU"]["act page res"]["BACKUP_REMOTE UTILITY OK"] = "widget_utility";
	crossroads["MENU"]["act page res"]["BACKUP_REMOTE UTILITY KO"] = "widget_utility";
	crossroads["MENU"]["act page res"]["BACKUP_REMOTE UTILITY PROGRESS"] = "widget_utility";
	crossroads["MENU"]["act page res"]["BACKUP UTILITY OK"] = "widget_utility";
	crossroads["MENU"]["act page res"]["BACKUP UTILITY KO"] = "widget_utility";
	crossroads["MENU"]["act page res"]["BACKUP UTILITY PROGRESS"] = "widget_utility";
	//
	crossroads["MENU"]["act page res"]["START SSID STARTED"] = "widget_wifi_seek";
	crossroads["MENU"]["act page res"]["STOP SSID STOPPED"] = "widget_wifi_seek";
	crossroads["MENU"]["act page res"]["START SSID ERROR"] = "widget_wifi_seek";
	crossroads["MENU"]["act page res"]["STOP SSID ERROR"] = "widget_wifi_seek";
	crossroads["MENU"]["act page res"]["WPS_RESULT WPS_PAGE OK"] = "widget_parconn";
	crossroads["MENU"]["act page res"]["WPS_RESULT WPS_PAGE KO"] = "widget_parconn";
	//
	crossroads["PNP"]["act res"]["DETECTION DETECTED"] = "widget_device_wireless widget_device_bus_pair widget_devices_add widget_confirm widget_device";
	crossroads["PNP"]["act res"]["DETECTION EXISTING"] = "widget_device_wireless widget_device_bus_pair";
	crossroads["PNP"]["act res"]["DETECTION TOO_MANY"] = "widget_device_wireless widget_device_bus_pair";
	crossroads["PNP"]["act res"]["DETECTION NO_WIFI"] = "widget_device_wireless widget_device_bus_pair";
	crossroads["PNP"]["act res"]["DETECTION BIND_STORE_FULL"] = "widget_device_wireless widget_device_bus_pair";
	crossroads["PNP"]["act res"]["DETECTION BIND_ENTRY_FULL"] = "widget_device_wireless widget_device_bus_pair";
	crossroads["PNP"]["act res"]["DETECTION NO_WIFI"] = "widget_device_wireless widget_device_bus_pair";
	crossroads["PNP"]["act res"]["DETECTION COMPLETED"] = "widget_device_bus_pair";
	crossroads["PNP"]["act res"]["DETECTION EMPTY"] = "widget_device_wireless widget_device_bus_pair widget_confirm widget_device";
	crossroads["PNP"]["act res"]["ABORT ABORTED"] = "widget_device_wireless";
	crossroads["PNP"]["act res"]["START STARTED"] = "widget_device_wireless widget_device_bus_pair";
	crossroads["PNP"]["act res"]["START ERROR"] = "widget_device_wireless widget_device_bus_pair";
	//
	crossroads["PNP"]["act res"]["STORE STORED"] = "widget_device widget_mod_device_tvcc";
	crossroads["PNP"]["act res"]["STORE ABORTED"] = "widget_device widget_mod_device_tvcc";
	crossroads["PNP"]["act res"]["STORE ERROR"] = "widget_device widget_mod_device_tvcc";
}