var ts = 0;
var tsTout = null;
var date_obj = null;
var date_cen = [];
var date_cen_str = "";
var resolution = (QT ? 30 : 5); //tempo di aggiornamento orologio (secondi)
//
function rtc_refresh()
{
	clearTimeout(tsTout);
	tsTout = setTimeout(rtc_refresh, resolution*1000);
	if ($(".widget_dtpicker").length < 1)
	{
		$("#myrtc, #myrtc2").html(week_day_month());
		var time_str = ampm_time(QT ? date_obj : date_cen);
		$("#myrtc, #myrtc2").append(" "+time_str);
		$("#myrtc_stdby").html(time_str);
		$("#date_stdby").html(week_day_month());
	}
	ts += resolution;
	date_obj.setTime(date_obj.getTime()+(resolution*1000));
}
function rtc_ts_set(myts, localdt)
{
	myts = Number(myts);
	ts = myts;
	date_obj = from_timestamp_to_date_obj(myts);
	date_cen = from_localdt_to_datacen(localdt);
	date_cen_str = localdt;
}
//
function get_timestamp()
{
	return ts;
}
function get_hours()
{
	var hour = 0;
	if (QT)
	{
		hour = date_obj.getHours();	
	}
	else
	{
		hour = Number(date_cen[K_HOUR]);
	}
	return (hour < 10 ? "0" + hour : hour);
}
function get_hours_h()
{
	var hour = 0;
	if (QT)
	{
		hour = date_obj.getHours();	
	}
	else
	{
		hour = Number(date_cen[K_HOUR]);
	}
	if (!h24)
	{
		if (hour == 0)
			hour = "12 AM";
		else if (hour == 12)
			hour = "12 PM";
		else if (hour > 12)
			hour = hour - 12 + " PM";
		else
			hour += " AM";
	}
	hour = hour+"";
	if (hour.split(" ")[0] < 10)
		hour = "0"+hour;
	return hour;
}
function get_minutes()
{
	var min = 0;
	if (QT)
	{
		min = date_obj.getMinutes();
	}
	else
	{
		min = Number(date_cen[K_MIN]);
	}
	return (min < 10 ? "0" + min : min);
}
function get_seconds()
{
	var sec = 0;
	if (QT)
	{
		sec = date_obj.getSeconds();
	}
	else
	{
		sec = Number(date_cen[K_SEC]);
	}
	return (sec < 10 ? "0" + sec : sec);
}
function get_day()
{
	var day = 0;
	if (QT)
	{
		day = date_obj.getDate();
	}
	else
	{
		day = Number(date_cen[K_DAY]);
	}
	return (day);
}
function get_day_2str()
{
	var day = 0;
	if (QT)
	{
		day = date_obj.getDate();
	}
	else
	{
		day = Number(date_cen[K_DAY]);
	}
	return (day < 10 ? "0" + day : day);
}
function get_month()
{
	var month = 0;
	if (QT)
	{
		month = date_obj.getMonth() + 1;
	}
	else
	{
		month = Number(date_cen[K_MONTH]);
	}
	return (month);
}
function get_month_2str()
{
	var month = 0;
	if (QT)
	{
		month = date_obj.getMonth() + 1;
	}
	else
	{
		month = Number(date_cen[K_MONTH]);
	}
	return (month < 10 ? "0" + month : month);
}
function get_year()
{
	var year = 0;
	if (QT)
	{
		year = date_obj.getFullYear();
	}
	else
	{
		year = Number(date_cen[K_YEAR]);
	}
	return (year);
}
function get_day_week()
{
	var dow = 0;
	if (QT)
	{
		dow = date_obj.getDay();
	}
	else
	{
		dow = Number(date_cen[K_DOW]);
	}
	return (dow);
}
function get_human()
{
	return get_year()+""+get_month()+""+get_day()+""+get_hours()+""+get_minutes();
}
//
//DO
function get_day_week_do(date_obj_par)
{
	var dow = 0;
	if (date_obj_par instanceof Date)
	{
		dow = date_obj_par.getDay();
	}
	else
	{
		dow = Number(date_obj_par[K_DOW]);
	}
	return (dow);
}
function get_day_do(date_obj_par)
{
	var day = 0;
	if (date_obj_par instanceof Date)
	{
		day = date_obj_par.getDate();
	}
	else
	{
		day = Number(date_obj_par[K_DAY]);
	}
	return (day);
}
function get_month_do(date_obj_par)
{
	var month = 0;
	if (date_obj_par instanceof Date)
	{
		month = date_obj_par.getMonth() + 1;
	}
	else
	{
		month = Number(date_obj_par[K_MONTH]);
	}
	return (month);
}
function get_year_do(date_obj_par)
{
	var year = 0;
	if (date_obj_par instanceof Date)
	{
		year = date_obj_par.getFullYear();
	}
	else
	{
		year = Number(date_obj_par[K_YEAR]);
	}
	return (year);
}
function get_hours_do(date_obj_par)
{
	var hour = 0;
	if (date_obj_par instanceof Date)
	{
		hour = date_obj_par.getHours();	
	}
	else
	{
		hour = Number(date_obj_par[K_HOUR]);
	}
	return (hour < 10 ? "0" + hour : hour);
}
function get_minutes_do(date_obj_par)
{
	var min = 0;
	if (date_obj_par instanceof Date)
	{
		min = date_obj_par.getMinutes();
	}
	else
	{
		min = Number(date_obj_par[K_MIN]);
	}
	return (min < 10 ? "0" + min : min);
}
function get_seconds_do(date_obj_par)
{
	var sec = 0;
	if (date_obj_par instanceof Date)
	{
		sec = date_obj_par.getSeconds();
	}
	else
	{
		sec = Number(date_obj_par[K_SEC]);
	}
	return (sec < 10 ? "0" + sec : sec);
}
//
//funzione da applicare per tradurre un timestamp in un oggetto date
function from_timestamp_to_date_obj(timestamp)
{
	var newDate = new Date(timestamp * 1000);
	if (!dst && !QT)
		newDate.dst_remover();
	return newDate;
}
//
//funzione da applicare per tradurre un oggetto date in un timestamp in secondi
function from_date_obj_to_timestamp(local_date_obj)
{
	if (!dst && !QT)
		local_date_obj.dst_adder();
	return Math.round(local_date_obj.getTime()/1000);
}
//
function from_localdt_to_datacen(localdt)
{
	return localdt.split("-");
}