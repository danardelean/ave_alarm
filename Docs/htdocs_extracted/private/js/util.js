var logout_title_str = "{LANG_LOGOUT}";
var logout_str = "{LANG_LOGOUT_MSG}";
//
//
/*** DA RTC.JS ***/
function week_day_month()
{
	var week_day_month_str = "";
	//
	var dow = get_day_week();
	//
	if (dow == 0) week_day_month_str += "{LANG_SUNDAY}";
	else if (dow == 1) week_day_month_str += "{LANG_MONDAY}";
	else if (dow == 2) week_day_month_str += "{LANG_TUESDAY}";
	else if (dow == 3) week_day_month_str += "{LANG_WEDNESDAY}";
	else if (dow == 4) week_day_month_str += "{LANG_THURSDAY}";
	else if (dow == 5) week_day_month_str += "{LANG_FRIDAY}";
	else if (dow == 6) week_day_month_str += "{LANG_SATURDAY}";
	//
	week_day_month_str += " ";
	week_day_month_str += get_day();
	//
	week_day_month_str += " ";
	var mon = get_month();
	if (mon == 1) week_day_month_str += "{LANG_SHORT_JANUARY}";
	else if (mon == 2) week_day_month_str += "{LANG_SHORT_FEBRUARY}";
	else if (mon == 3) week_day_month_str += "{LANG_SHORT_MARCH}";
	else if (mon == 4) week_day_month_str += "{LANG_SHORT_APRIL}";
	else if (mon == 5) week_day_month_str += "{LANG_SHORT_MAY}";
	else if (mon == 6) week_day_month_str += "{LANG_SHORT_JUNE}";
	else if (mon == 7) week_day_month_str += "{LANG_SHORT_JULY}";
	else if (mon == 8) week_day_month_str += "{LANG_SHORT_AUGUST}";
	else if (mon == 9) week_day_month_str += "{LANG_SHORT_SEPTEMBER}";
	else if (mon == 10) week_day_month_str += "{LANG_SHORT_OCTOBER}";
	else if (mon == 11) week_day_month_str += "{LANG_SHORT_NOVEMBER}";
	else if (mon == 12) week_day_month_str += "{LANG_SHORT_DECEMBER}";
	//
	return (week_day_month_str);
}
function week_day_month_do(date_obj_par)
{
	var week_day_month_str = "";
	//
	var dow = get_day_week_do(date_obj_par);
	if (dow == 0) week_day_month_str += "{LANG_SUNDAY}";
	else if (dow == 1) week_day_month_str += "{LANG_MONDAY}";
	else if (dow == 2) week_day_month_str += "{LANG_TUESDAY}";
	else if (dow == 3) week_day_month_str += "{LANG_WEDNESDAY}";
	else if (dow == 4) week_day_month_str += "{LANG_THURSDAY}";
	else if (dow == 5) week_day_month_str += "{LANG_FRIDAY}";
	else if (dow == 6) week_day_month_str += "{LANG_SATURDAY}";
	//
	week_day_month_str += " ";
	week_day_month_str += get_day_do(date_obj_par);
	//
	week_day_month_str += " ";
	var mon = get_month_do(date_obj_par);
	if (mon == 1) week_day_month_str += "{LANG_SHORT_JANUARY}";
	else if (mon == 2) week_day_month_str += "{LANG_SHORT_FEBRUARY}";
	else if (mon == 3) week_day_month_str += "{LANG_SHORT_MARCH}";
	else if (mon == 4) week_day_month_str += "{LANG_SHORT_APRIL}";
	else if (mon == 5) week_day_month_str += "{LANG_SHORT_MAY}";
	else if (mon == 6) week_day_month_str += "{LANG_SHORT_JUNE}";
	else if (mon == 7) week_day_month_str += "{LANG_SHORT_JULY}";
	else if (mon == 8) week_day_month_str += "{LANG_SHORT_AUGUST}";
	else if (mon == 9) week_day_month_str += "{LANG_SHORT_SEPTEMBER}";
	else if (mon == 10) week_day_month_str += "{LANG_SHORT_OCTOBER}";
	else if (mon == 11) week_day_month_str += "{LANG_SHORT_NOVEMBER}";
	else if (mon == 12) week_day_month_str += "{LANG_SHORT_DECEMBER}";
	//
	return (week_day_month_str);
}
function week_day_month_for_dash(dow, day, month)
{
	var week_day_month_str = "";
	//
	if (dow == "Mo") week_day_month_str += "{LANG_MONDAY}";
	else if (dow == "Tu") week_day_month_str += "{LANG_TUESDAY}";
	else if (dow == "We") week_day_month_str += "{LANG_WEDNESDAY}";
	else if (dow == "Th") week_day_month_str += "{LANG_THURSDAY}";
	else if (dow == "Fr") week_day_month_str += "{LANG_FRIDAY}";
	else if (dow == "Sa") week_day_month_str += "{LANG_SATURDAY}";
	else if (dow == "Su") week_day_month_str += "{LANG_SUNDAY}";
	//
	week_day_month_str += " "+day+" ";
	//
	if (month == 1) week_day_month_str += "{LANG_SHORT_JANUARY}";
	else if (month == 2) week_day_month_str += "{LANG_SHORT_FEBRUARY}";
	else if (month == 3) week_day_month_str += "{LANG_SHORT_MARCH}";
	else if (month == 4) week_day_month_str += "{LANG_SHORT_APRIL}";
	else if (month == 5) week_day_month_str += "{LANG_SHORT_MAY}";
	else if (month == 6) week_day_month_str += "{LANG_SHORT_JUNE}";
	else if (month == 7) week_day_month_str += "{LANG_SHORT_JULY}";
	else if (month == 8) week_day_month_str += "{LANG_SHORT_AUGUST}";
	else if (month == 9) week_day_month_str += "{LANG_SHORT_SEPTEMBER}";
	else if (month == 10) week_day_month_str += "{LANG_SHORT_OCTOBER}";
	else if (month == 11) week_day_month_str += "{LANG_SHORT_NOVEMBER}";
	else if (month == 12) week_day_month_str += "{LANG_SHORT_DECEMBER}";
	//
	return week_day_month_str;
}
/**
 * PICKER - +
 * @param normalizer 	funzione associata per normalizzare il valore prima che venga variato
 * @param context 		classe contenitrice di tutti i picker
 */
var mouse_down_i = false;
var mouse_down_d = false;
var t_out_picker_i;
var t_out_picker_d;
var speed_countdown = 10;
$(document).unbind(vmouseup+".picker").bind(vmouseup+".picker", function(e)
{
	if ((e.button == 0 || TCH) && ($(".slot_picker, .slot_picker_scene").length > 0 || $(".widget_dtpicker").length > 0) && arrow_xml != null)
	{
		mouse_down_i = false;
		mouse_down_d = false;
		clearTimeout(t_out_picker_i);
		clearTimeout(t_out_picker_d);
		speed_countdown = 10;
		arrow_xml.trigger("pick_extra_func");
		arrow_xml = null;
	}
});
var arrow_xml;
function picker(context, normalizer)
{
	var warn_msg;
	$(context+" .side.value p").each(function()
	{
		//init color
		var data_red = $(this).attr("data-red");
		if (data_red != null)
		{
			var lb_str = data_red.split(",")[0];
			var ub_str = data_red.split(",")[1];
			var lb = parseInt(lb_str);
			var ub = parseInt(ub_str);
			if (isNaN(lb))
			{
				var vlr = Number($(this).text());
				if (vlr < ub)
					$(this).addClass("red");
				else
					$(this).removeClass("red");
			}
			else if (isNaN(ub))
			{
				var vlr = Number($(this).text());
				if (vlr > lb)
					$(this).addClass("red");
				else
					$(this).removeClass("red");
			}
			else if (isNaN(lb) && isNaN(ub))
			{
				$(this).addClass("red");
			}
			else if (lb_str.indexOf("o") > -1 || ub_str.indexOf("o") > -1)
			{
				var vlr = Number($(this).text());
				if (vlr > ub || vlr < lb)
					$(this).addClass("red");
				else
					$(this).removeClass("red");
			}
			else
			{
				var vlr = Number($(this).text());
				if (vlr > lb && vlr < ub)
					$(this).addClass("red");
				else
					$(this).removeClass("red");
			}
		}
	});
	//
	$(context+" .slot_picker .side.arrow, "+context+" .slot_picker_scene .side.arrow").off(vmousedown).on(vmousedown, function(e)
	{
		if ((e.button == 0 || TCH) && !$(this).parent().hasClass("disabled"))
		{
			arrow_xml = $(this);
			if ($(this).hasClass("left"))
			{
				mouse_down_d = true;
				decrease_value($(this));
			}
			else if ($(this).hasClass("right"))
			{
				mouse_down_i = true;
				increase_value($(this));
			}
		}
	});
	//
	var prev_value;
	function decrease_value(btn)
	{
		speed_countdown--;
		var left_on = true;
		var svp = btn.siblings(".side.value").children("p");
		var speed = 150;
		if (svp.attr("data-speed") != null) speed = svp.attr("data-speed");
		var value = svp.text();
		if (normalizer != null)
			value = normalizer(value, btn.parent(), btn);
		if (svp.attr("data-lbound") != null)
			if (value <= parseInt(svp.attr("data-lbound")))
				left_on = false;
		prev_value = value;
		if (left_on)
			svp.text(--value);
		//
		add_zero_digit(svp);
		//
		redden(svp, "d");
		//
		if (mouse_down_d)
			t_out_picker_d = setTimeout(function()
			{
				decrease_value(btn);
			}, speed_countdown < 0 ? speed/3 : speed);
	}
	function increase_value(btn)
	{
		speed_countdown--;
		var right_on = true;
		var svp = btn.siblings(".side.value").children("p");
		var speed = 150;
		if (svp.attr("data-speed") != null) speed = svp.attr("data-speed");
		var value = svp.text();
		if (!(normalizer == null))
			value = normalizer(value, btn.parent(), btn);
		if (!(svp.attr("data-rbound") == null))
			if (value >= parseInt(svp.attr("data-rbound")))
				right_on = false;
		prev_value = value;
		if (right_on)
			svp.text(++value);
		//
		add_zero_digit(svp);
		//
		redden(svp, "i");
		//
		if (mouse_down_i) 
			t_out_picker_i = setTimeout(function()
			{
				increase_value(btn);
			}, speed_countdown < 0 ? speed/3 : speed);
	}
	function add_zero_digit(svp)
	{
		if (!(svp.attr("data-digit") == null))
		{
			var num_zero_to_add = svp.attr("data-digit") - svp.text().length;
			for (var i = 0; i < num_zero_to_add; i++)
				$(svp).text("0"+$(svp).text());
		}
	}
	function redden(svp, i_d)
	{
		var data_red = svp.attr("data-red");
		if (data_red != null)
		{
			warn_msg = svp.attr("data-warn-msg") || "{LANG_EN50131}";
			var lb_str = data_red.split(",")[0];
			var ub_str = data_red.split(",")[1];
			var lb = parseInt(lb_str);
			var ub = parseInt(ub_str);
			if (isNaN(lb))
			{
				var vlr = Number(svp.text());
				if (vlr < ub)
					svp.addClass("red");
				else
					svp.removeClass("red");
				//
				if (i_d == "d")
					if (prev_value == ub)
						pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", warn_msg, "ok", null);
			}
			else if (isNaN(ub))
			{
				var vlr = Number(svp.text());
				if (vlr > lb)
					svp.addClass("red");
				else
					svp.removeClass("red");
				//
				if (i_d == "i")
					if (prev_value == lb)
						pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", warn_msg, "ok", null);
			}
			else if (isNaN(lb) && isNaN(ub))
			{
				svp.addClass("red");
			}
			else if (lb_str.indexOf("o") > -1 || ub_str.indexOf("o") > -1)
			{
				var vlr = Number(svp.text());
				if (vlr > ub || vlr < lb)
					svp.addClass("red");
				else
					svp.removeClass("red");
				//
				if (i_d == "i")
				{
					if (prev_value == ub)
						pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", warn_msg, "ok", null);
				}
				else 
				{
					if (prev_value == lb)
						pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", warn_msg, "ok", null);
				}
			}
			else
			{
				var vlr = Number(svp.text());
				if (vlr > lb && vlr < ub)
					svp.addClass("red");
				else
					svp.removeClass("red");
				//
				if (i_d == "i")
				{
					if (prev_value == lb)
						pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", warn_msg, "ok", null);
				}
				else 
				{
					if (prev_value == ub)
						pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", warn_msg, "ok", null);
				}
			}
		}
	}
}
//
function ampm_time(date)
{
	var res = "";
	var hours;
	var minutes;
	if (date instanceof Date)
	{
		hours = date.getHours();
		minutes = date.getMinutes();
	}
	else if (date instanceof Array)
	{
		hours = Number(date[K_HOUR]);
		minutes = Number(date[K_MIN]);
	}
	else
	{
		var date_arr = date.split(":");
		hours = date_arr[0];
		minutes = date_arr[1];
	}
	//
	if (h24)
	{	
		if (hours < 10)
			hours = "0"+hours;
		res += hours;
		res += ":";
		if (minutes < 10)
			minutes = "0"+minutes;
		res += minutes;
	}
	else	
	{
		var ampm = hours >= 12 ? "{LANG_PM}" : "{LANG_AM}";
		hours = hours % 12;
		hours = hours ? hours : 12;
		if (hours < 10)
			hours = "0"+hours;
		res += hours;
		res += ":";
		if (minutes < 10)
			minutes = "0"+minutes;
		res += minutes;
		res += " "+ampm;
	}
	//
	return res;
}
function set_visible_area_qt()
{
	if (typeof webbridge != "undefined")
	{
		webbridge.setString("0", "{LANG_AREA_VIS}");
	}
}
set_visible_area_qt();
//
function Anom(id, desc, count, ts, localdt)
{
    this.id = id;
    this.desc = desc;
    this.count = count;
    this.ts = ts;
    this.localdt = localdt;
}
//
function wired_type_str(subcategory, elem)
{
	if (subcategory == WS_DEV_ALARM_WIRED_STR)
	{
		if ($(elem).children("wire_type").text() == "1")
		{
			if (wire_in_tst(Number($(elem).children("ord").text())))
				return(" {LANG_WIRED_IN} " + $(elem).children("ord").text());
			else if (wire_in_virt_tst(Number($(elem).children("ord").text())))
				return(" {LANG_WIRED_IN} " + ($(elem).children("ord").text() - WIRE_I_VIRTUAL_ORD_OFFSET) + "b");
		}
		else if ($(elem).children("wire_type").text() == "5")
		{
			return(" {LANG_WIRED_OUT}");
		}
		else if ($(elem).children("wire_type").text() == "3")
		{
			return(" {LANG_WIRED_KEY}");
		}		
	}
	return "";
}
//
function popMandatoryMessages()
{
	var msg = "";
	if (wizard_mandatory_task["widget_mod_inst"] == 0)
		msg += "<br>{LANG_MANDATORY_MSG_WIDGET_MOD_INST} " + "{LANG_WIZARD_ADD_INSTALLER_TITLE}";
	if (wizard_mandatory_task["widget_mod_user"] == 0)
		msg += "<br>{LANG_MANDATORY_MSG_WIDGET_MOD_USER} " + "{LANG_USERS}";
	//
	pag_change(".JSdialog", "widget_popwarn", "{LANG_WARNING}", msg, "ok", null, "mandatory");	
}
//
function creditoResiduo(indi)
{
	pag_change(".JSdialog2", "widget_popwarn", "{LANG_ALERT}", indi.children("content").text(), "ok", null);	
}