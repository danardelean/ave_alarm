const FACT_TEST_DEBUG_ENA = false;	// false on RELEASE
const FACT_TEST_N = 11;
var qt_ver = "Non Presente";
var fact_test_ind;
var fact_test_res_flg_tbl = [];

function ws_data_to_string(e)
{
	var split_size = 0x8000;
	var src = new Uint8Array(e.data);
	var c = [];
	//
	var sub_arr;
	var char_c;
	for (var i = 0; i < src.length; i += split_size)
	{
		sub_arr = src.subarray(i, i + split_size);
		char_c = String.fromCharCode.apply(null, sub_arr);
		c.push(char_c);
	}
	//
	var cj = c.join("");
	//
	return(cj);
}
function web_socket_recv(e)
{
	var data = ws_data_to_string(e);
	xml_data = $($.parseXML(data));
	var confirmation = xml_data.children("Response");
	var indication = xml_data.children("Event");
	
	if (confirmation.length > 0) 
	{
		if (confirmation.attr("type") == "FACT_TEST")
		{
			console.log("CFM: \r\n" + data + "\r\n");			
			fact_test_recv_conf(confirmation);
		}
	}
	else if (indication.length > 0)
	{
		if (indication.attr("type") == "FACT_TEST")
		{
			console.log("IND: \r\n" + data + "\r\n");			
			fact_test_recv_ind(indication);
		}
	}
}
function webbridge_start()
{
	if (typeof webbridge != "undefined")
	{
		qt_ver = webbridge.getVersion();
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
function fact_test_start()
{
	fact_test_ind = 0;
	fact_footer_prev_next_but_refresh();
	fact_test_change();
}
function fact_test_stop()
{
	fact_test_ind = -1;
	for (i = 0; i < FACT_TEST_N; i++)
	{
		$("#fact_test_" + i).removeClass("fact_visible").addClass("fact_invisible");
		fact_test_res_set(i, false);
	}
	web_socket_start();
}
$(document).ready(function(e)
{
	webbridge_start();
	disable_selectable("#body");
	$("#fact_next").click(fact_test_next);
	$("#fact_prev").click(fact_test_prev);
	// TEST 4
	$("#fact_test_4_stop").click(function()
	{
		if (!($("#fact_test_4_stop").hasClass("fact_but_grey")))
		{
			$("#fact_test_4_stop").removeClass("fact_but_blue").addClass("fact_but_grey");
			$("#fact_test_4_rec").removeClass("fact_but_red").addClass("fact_but_grey");
			$("#fact_test_4_play").removeClass("fact_but_green").addClass("fact_but_grey");
			xml_request = xml_request_head_build();
			xml_par = $(XML("type")); xml_par.text("test_4"); xml_request.append(xml_par);
			xml_par = $(XML("act")); xml_par.text("stop"); xml_request.append(xml_par);
			xml_send(xml_request);
		}
	});
	$("#fact_test_4_rec").click(function()
	{
		if (!($("#fact_test_4_rec").hasClass("fact_but_grey")))
		{
			$("#fact_test_4_rec").attr("data-st", "1");
			$("#fact_test_4_stop").removeClass("fact_but_blue").addClass("fact_but_grey");
			$("#fact_test_4_rec").removeClass("fact_but_red").addClass("fact_but_grey");
			$("#fact_test_4_play").removeClass("fact_but_green").addClass("fact_but_grey");
			xml_request = xml_request_head_build();
			xml_par = $(XML("type")); xml_par.text("test_4"); xml_request.append(xml_par);
			xml_par = $(XML("act")); xml_par.text("rec"); xml_request.append(xml_par);
			xml_send(xml_request);
		}
	});
	$("#fact_test_4_play").click(function()
	{
		if (!($("#fact_test_4_play").hasClass("fact_but_grey")))
		{
			if ($("#fact_test_4_rec").attr("data-st") == "1")
				$("#fact_test_4_play").attr("data-st", "1");
			$("#fact_test_4_stop").removeClass("fact_but_blue").addClass("fact_but_grey");
			$("#fact_test_4_rec").removeClass("fact_but_red").addClass("fact_but_grey");
			$("#fact_test_4_play").removeClass("fact_but_green").addClass("fact_but_grey");
			xml_request = xml_request_head_build();
			xml_par = $(XML("type")); xml_par.text("test_4"); xml_request.append(xml_par);
			xml_par = $(XML("act")); xml_par.text("play"); xml_request.append(xml_par);
			xml_send(xml_request);
		}
	});
	// TEST 5
	$("#fact_test_5_off").click(function()
	{
		xml_request = xml_request_head_build();
		xml_par = $(XML("type")); xml_par.text("test_5"); xml_request.append(xml_par);
		xml_par = $(XML("act")); xml_par.text("off"); xml_request.append(xml_par);
		xml_send(xml_request);
	});
	$("#fact_test_5_on").click(function()
	{
		xml_request = xml_request_head_build();
		xml_par = $(XML("type")); xml_par.text("test_5"); xml_request.append(xml_par);
		xml_par = $(XML("act")); xml_par.text("on"); xml_request.append(xml_par);
		xml_send(xml_request);
	});
	// TEST 6
	$("#fact_test_6_hangup").click(function()
	{
		xml_request = xml_request_head_build();
		xml_par = $(XML("type")); xml_par.text("test_6"); xml_request.append(xml_par);
		xml_par = $(XML("act")); xml_par.text("hangup"); xml_request.append(xml_par);
		xml_send(xml_request);
	});
	$("#fact_test_6_call").click(function()
	{
		xml_request = xml_request_head_build();
		xml_par = $(XML("type")); xml_par.text("test_6"); xml_request.append(xml_par);
		xml_par = $(XML("act")); xml_par.text("call"); xml_request.append(xml_par);
		xml_par = $(XML("par_a")); xml_par.text($("#fact_test_6_tel").val()); xml_request.append(xml_par);
		xml_send(xml_request);
	});
	$("#fact_test_6_tel").click(function()
	{
		var telnum = webbridge.openKeyboard("09", "Inserire Numero", $(this).val(), 20, 0);
		$("#fact_test_6_tel").val(telnum);
		$("#fact_test_7_tel").val(telnum);
	});	
	// TEST 7
	$("#fact_test_7_hangup").click(function()
	{
		xml_request = xml_request_head_build();
		xml_par = $(XML("type")); xml_par.text("test_7"); xml_request.append(xml_par);
		xml_par = $(XML("act")); xml_par.text("hangup"); xml_request.append(xml_par);
		xml_send(xml_request);
	});
	$("#fact_test_7_call").click(function()
	{
		xml_request = xml_request_head_build();
		xml_par = $(XML("type")); xml_par.text("test_7"); xml_request.append(xml_par);
		xml_par = $(XML("act")); xml_par.text("call"); xml_request.append(xml_par);
		xml_par = $(XML("par_a")); xml_par.text($("#fact_test_7_tel").val()); xml_request.append(xml_par);
		xml_send(xml_request);
	});
	$("#fact_test_7_tel").click(function()
	{
		var telnum = webbridge.openKeyboard("09", "Inserire Numero", $(this).val(), 20, 0);
		$("#fact_test_6_tel").val(telnum);
		$("#fact_test_7_tel").val(telnum);
	});	
	// TEST 10
	$("#fact_test_10_lowpow").click(function()
	{
		if (!($("#fact_test_10_lowpow").hasClass("fact_but_grey")))
		{
			$("#fact_test_10_lowpow").removeClass("fact_but_blue").addClass("fact_but_grey");
			$("#fact_prev").removeClass("fact_but_ena").addClass("fact_but_dis");
			$("#fact_next").removeClass("fact_but_ena").addClass("fact_but_dis");
			xml_request = xml_request_head_build();
			xml_par = $(XML("type")); xml_par.text("test_10"); xml_request.append(xml_par);
			xml_par = $(XML("act")); xml_par.text("lowpow"); xml_request.append(xml_par);
			xml_send(xml_request);
		}
	});
	//
	fact_test_stop();
});
function disable_selectable(target)
{
	$(target)
		.addClass("unselectable")
		.attr("unselectable", "on")
		.attr("draggable", "false")
		.on("dragstart", function() {return false;});
}
function fact_test_next()
{
	if (!($("#fact_next").hasClass("fact_but_dis")))
	{
		if (fact_test_ind < (FACT_TEST_N - 1) && fact_test_res_flg_tbl[fact_test_ind] == true)
		{
			$("#fact_test_" + fact_test_ind).removeClass("fact_visible").addClass("fact_invisible");
			fact_test_ind++;
			$("#fact_test_" + fact_test_ind).removeClass("fact_invisible").addClass("fact_visible");
			fact_test_change();
		}
		fact_footer_prev_next_but_refresh();
	}
}
function fact_test_prev()
{
	if (!($("#fact_prev").hasClass("fact_but_dis")))
	{
		if (fact_test_ind > 0)
		{
			$("#fact_test_" + fact_test_ind).removeClass("fact_visible").addClass("fact_invisible");
			fact_test_ind--;
			$("#fact_test_" + fact_test_ind).removeClass("fact_invisible").addClass("fact_visible");
			fact_test_change();
		}
		fact_footer_prev_next_but_refresh();
	}
}
function fact_test_change()
{
	if (FACT_TEST_DEBUG_ENA)
		fact_test_res_set(fact_test_ind, true);
	if (fact_test_ind == 9)
		fact_test_res_set(9, false);
	xml_request = xml_request_head_build();
	xml_par = $(XML("type")); xml_par.text("test_" + fact_test_ind); xml_request.append(xml_par);
	xml_par = $(XML("act")); xml_par.text("start"); xml_request.append(xml_par);
	xml_send(xml_request);
}
function fact_test_recv_conf(confirmation)
{
	if ((confirmation.children("type").text() == "test_0") && (confirmation.children("act").text() == "start") && (confirmation.children("res").text() == "1"))
	{
		$("#fact_test_0").removeClass("fact_invisible").addClass("fact_visible");
		$("#fact_test_0_tlc_ver").text(confirmation.children("tlc_ver").text());
		$("#fact_test_0_som_ver").text(confirmation.children("som_ver").text());
		$("#fact_test_0_car_ver").text(confirmation.children("car_ver").text());
		$("#fact_test_0_ker_ver").text(confirmation.children("ker_ver").text());
		$("#fact_test_0_qt_ver").text(qt_ver);
		if (confirmation.children("pstn_present_flg").text() == "1")
			$("#fact_test_0_pstn_present").text("Presente");
		else
			$("#fact_test_0_pstn_present").text("Non Presente");
		if (confirmation.children("pow_present_flg").text() == "1")
		{
			$("#fact_test_0_pow_present").text("OK");
			$("#fact_test_0_pow_present").attr("data-flg", "1");
		}
		else
		{
			$("#fact_test_0_pow_present").text("ASSENTE").css("color", "red");
		}
		if (confirmation.children("bat_present_flg").text() == "1")
		{
			$("#fact_test_0_bat_present").text("OK");
			$("#fact_test_0_bat_present").attr("data-flg", "1");
		}
		else
		{
			$("#fact_test_0_bat_present").text("ASSENTE").css("color", "red");
		}
		if (confirmation.children("gsm_present_flg").text() == "1")
		{
			$("#fact_test_0_gsm_ver").text("Attendere...");
			$("#fact_test_0_gsm_imei").text("Attendere...");
		}
		else
		{
			if (($("#fact_test_0_pow_present").attr("data-flg") == "1") && ($("#fact_test_0_bat_present").attr("data-flg") == "1"))
				fact_test_res_set(0, true);
			$("#fact_test_0_gsm_ver").text("Non Presente");
			$("#fact_test_0_gsm_imei").text("Non Presente");
		}
	}
	else if ((confirmation.children("type").text() == "test_1") && (confirmation.children("act").text() == "start") && (confirmation.children("res").text() == "1"))
	{
		$("#fact_test_1_act").attr("data-act", "");
		if (confirmation.children("st").text() == "1")
		{
			$("#fact_test_1_st").text("Aperta");
			$("#fact_test_1_st").attr("data-st", "1");
			$("#fact_test_1_act").text("Chiudere Ampolla");
		}
		else
		{
			$("#fact_test_1_st").text("Chiusa");
			$("#fact_test_1_st").attr("data-st", "0");
			$("#fact_test_1_act").text("Aprire Ampolla");
		}
	}
	else if ((confirmation.children("type").text() == "test_2") && (confirmation.children("act").text() == "start") && (confirmation.children("res").text() == "1"))
	{
		$("#fact_test_2_act").attr("data-act", "");
		if (confirmation.children("st").text() == "1")
		{
			$("#fact_test_2_st").text("Aperto");
			$("#fact_test_2_st").attr("data-st", "1");
			$("#fact_test_2_act").text("Chiudere Tamper");
		}
		else
		{
			$("#fact_test_2_st").text("Chiuso");
			$("#fact_test_2_st").attr("data-st", "0");
			$("#fact_test_2_act").text("Aprire Tamper");
		}
	}
	else if ((confirmation.children("type").text() == "test_3") && (confirmation.children("act").text() == "start") && (confirmation.children("res").text() == "1"))
	{
		$("#fact_test_3_act").text("Passare un TAG sul lettore RFID");
	}
	else if ((confirmation.children("type").text() == "test_4") && (confirmation.children("res").text() == "1"))
	{
	}
	else if ((confirmation.children("type").text() == "test_5") && (confirmation.children("res").text() == "1"))
	{
		if (confirmation.children("act").text() == "on")
		{
			$("#fact_test_5_st").text("Accesa");
		}
		else if (confirmation.children("act").text() == "off")
		{
			if ($("#fact_test_5_st").text() == "Accesa")
				fact_test_res_set(5, true);
			$("#fact_test_5_st").text("Spenta");
		}
	}	
	else if ((confirmation.children("type").text() == "test_6") && (confirmation.children("res").text() == "1"))
	{
		if (!(confirmation.children("pstn_present_flg").text() == "1"))
		{	
			$("#fact_test_6_st").text("Modulo Assente");
			fact_test_res_set(6, true);
		}
		else if (confirmation.children("act").text() == "call")
		{
			$("#fact_test_6_st").text("Attendere...");
			fact_test_res_set(6, false);
		}
		else if (confirmation.children("act").text() == "hangup")
		{
			if (!($("#fact_test_6_st").text() == "Idle"))
			{
				$("#fact_test_6_st").text("Idle");
				fact_test_res_set(6, true);
			}
		}
	}	
	else if ((confirmation.children("type").text() == "test_7") && (confirmation.children("res").text() == "1"))
	{
		if (!(confirmation.children("gsm_present_flg").text() == "1"))
		{	
			$("#fact_test_7_st").text("Modulo Assente");
			fact_test_res_set(7, true);
		}
		else if (confirmation.children("act").text() == "call")
		{
			$("#fact_test_7_st").text("Attendere...");
			fact_test_res_set(7, false);
		}
		else if (confirmation.children("act").text() == "hangup")
		{
			if (!($("#fact_test_7_st").text() == "Idle"))
			{
				$("#fact_test_7_st").text("Idle");
				fact_test_res_set(7, true);
			}
		}
	}	
	else if ((confirmation.children("type").text() == "test_8") && (confirmation.children("act").text() == "start"))
	{
		if (confirmation.children("res").text() == "1")
		{
			$("#fact_test_8_ap").text(confirmation.children("ap").text());
			$("#fact_test_8_chan").text(confirmation.children("chan").text());
			fact_test_res_set(8, true);
		}
		else
		{
			$("#fact_test_8_ap").text("Errore WIFI");
			$("#fact_test_8_chan").text("Errore WIFI");		
		}
	}	
	else if ((confirmation.children("type").text() == "test_9") && (confirmation.children("act").text() == "start") && (confirmation.children("res").text() == "1"))
	{
		$("#fact_test_9_st_433").text("In corso...");
		$("#fact_test_9_st_868").text("Attesa");
	}	
	else if ((confirmation.children("type").text() == "test_10") && (confirmation.children("act").text() == "lowpow") && (confirmation.children("res").text() == "1"))
	{
		fact_test_res_set(10, true);
	}	
}
function fact_test_recv_ind(indication)
{
	if (indication.children("act").text() == "0")
	{
		$("#fact_test_0_gsm_ver").text(indication.children("par_str").text());
		$("#fact_test_0_gsm_ver").attr("data-flg", "1");
		if ($("#fact_test_0_gsm_ver").attr("data-flg") == "1" && $("#fact_test_0_gsm_imei").attr("data-flg") == "1")
		{
			if (($("#fact_test_0_pow_present").attr("data-flg") == "1") && ($("#fact_test_0_bat_present").attr("data-flg") == "1"))
				fact_test_res_set(0, true);
		}
	}
	else if (indication.children("act").text() == "1")
	{
		$("#fact_test_0_gsm_imei").text(indication.children("par_str").text());	
		$("#fact_test_0_gsm_imei").attr("data-flg", "1");
		if ($("#fact_test_0_gsm_ver").attr("data-flg") == "1" && $("#fact_test_0_gsm_imei").attr("data-flg") == "1")
		{
			if (($("#fact_test_0_pow_present").attr("data-flg") == "1") && ($("#fact_test_0_bat_present").attr("data-flg") == "1"))
				fact_test_res_set(0, true);
		}
	}
	else if (indication.children("act").text() == "2")
	{
		if (!($("#fact_test_1_st").attr("data-st") == indication.children("par_dw").text()))
		{
			$("#fact_test_1_act").attr("data-act", $("#fact_test_1_act").attr("data-act") + "x");
			$("#fact_test_1_st").attr("data-st", indication.children("par_dw").text());
		}
		if (indication.children("par_dw").text() == "1")
		{
			$("#fact_test_1_st").text("Aperta");
			$("#fact_test_1_act").text("Chiudere Ampolla");
		}
		else
		{
			$("#fact_test_1_st").text("Chiusa");
			$("#fact_test_1_act").text("Aprire Ampolla");
		}
		if ($("#fact_test_1_act").attr("data-act").length > 1)
			fact_test_res_set(1, true);
	}
	else if (indication.children("act").text() == "3")
	{
		if (!($("#fact_test_2_st").attr("data-st") == indication.children("par_dw").text()))
		{
			$("#fact_test_2_act").attr("data-act", $("#fact_test_2_act").attr("data-act") + "x");
			$("#fact_test_2_st").attr("data-st", indication.children("par_dw").text());
		}
		if (indication.children("par_dw").text() == "1")
		{
			$("#fact_test_2_st").text("Aperto");
			$("#fact_test_2_act").text("Chiudere Tamper");
		}
		else
		{
			$("#fact_test_2_st").text("Chiuso");
			$("#fact_test_2_act").text("Aprire Tamper");
		}
		if ($("#fact_test_2_act").attr("data-act").length > 1)
			fact_test_res_set(2, true);
	}
	else if (indication.children("act").text() == "4")
	{
		$("#fact_test_3_rfid").text(indication.children("par_str").text());
		$("#fact_test_3_act").text("OK");
		fact_test_res_set(3, true);		
	}
	else if (indication.children("act").text() == "5")
	{
		if (indication.children("par_dw").text() == "1")
			$("#fact_test_9_st_433").text("OK");
		else
			$("#fact_test_9_st_433").text("Nessuna risposta");
		$("#fact_test_9_st_868").text("In corso...");
		//
		xml_request = xml_request_head_build();
		xml_par = $(XML("type")); xml_par.text("test_9"); xml_request.append(xml_par);
		xml_par = $(XML("act")); xml_par.text("continue"); xml_request.append(xml_par);
		xml_send(xml_request);
	}
	else if (indication.children("act").text() == "6")
	{
		if (indication.children("par_dw").text() == "1")
			$("#fact_test_9_st_868").text("OK");
		else
			$("#fact_test_9_st_868").text("Nessuna risposta");
		fact_test_res_set(9, true);
	}
	else if (indication.children("act").text() == "7")
	{
		$("#fact_test_6_st").text(indication.children("par_str").text());
		if ($("#fact_test_6_st").text() == "Idle")
			fact_test_res_set(6, true);
	}
	else if (indication.children("act").text() == "8")
	{
		$("#fact_test_7_st").text(indication.children("par_str").text());
		if ($("#fact_test_7_st").text() == "Idle")
			fact_test_res_set(7, true);
	}
	else if (indication.children("act").text() == "9")
	{
		if (indication.children("par_dw").text() == "1")
		{
			$("#fact_test_4_st").text("Idle");
			$("#fact_test_4_stop").removeClass("fact_but_blue").addClass("fact_but_grey");
			$("#fact_test_4_rec").removeClass("fact_but_grey").addClass("fact_but_red");
			$("#fact_test_4_play").removeClass("fact_but_grey").addClass("fact_but_green");
			if ($("#fact_test_4_play").attr("data-st") == "1")
				fact_test_res_set(4, true);
		}
		else if (indication.children("par_dw").text() == "2")
		{
			$("#fact_test_4_st").text("Play: " + indication.children("par_str").text());
			$("#fact_test_4_stop").removeClass("fact_but_grey").addClass("fact_but_blue");
			$("#fact_test_4_rec").removeClass("fact_but_red").addClass("fact_but_grey");
			$("#fact_test_4_play").removeClass("fact_but_green").addClass("fact_but_grey");
		}
		else if (indication.children("par_dw").text() == "3")
		{
			$("#fact_test_4_st").text("Rec: " + indication.children("par_str").text());
			$("#fact_test_4_stop").removeClass("fact_but_grey").addClass("fact_but_blue");
			$("#fact_test_4_rec").removeClass("fact_but_red").addClass("fact_but_grey");
			$("#fact_test_4_play").removeClass("fact_but_green").addClass("fact_but_grey");
		}
		else
		{
			$("#fact_test_4_st").text("Errore");
			$("#fact_test_4_stop").removeClass("fact_but_blue").addClass("fact_but_grey");
			$("#fact_test_4_rec").removeClass("fact_but_red").addClass("fact_but_grey");
			$("#fact_test_4_play").removeClass("fact_but_green").addClass("fact_but_grey");
		}
	}
}
function fact_test_res_set(ind, flg)
{
	fact_test_res_flg_tbl[ind] = flg;
	fact_footer_prev_next_but_refresh();
}
function fact_footer_prev_next_but_refresh()
{
	if (fact_test_ind == 0 || fact_test_ind == -1 || (fact_test_ind == 9 && !fact_test_res_flg_tbl[9]) || (fact_test_ind == 10 && fact_test_res_flg_tbl[10]))
		$("#fact_prev").removeClass("fact_but_ena").addClass("fact_but_dis");
	else
		$("#fact_prev").removeClass("fact_but_dis").addClass("fact_but_ena");
	//
	if (fact_test_ind == FACT_TEST_N)
		$("#fact_next").removeClass("fact_but_ena").addClass("fact_but_dis");
	else if (fact_test_res_flg_tbl[fact_test_ind] && (fact_test_ind < (FACT_TEST_N - 1)))
		$("#fact_next").removeClass("fact_but_dis").addClass("fact_but_ena");
	else
		$("#fact_next").removeClass("fact_but_ena").addClass("fact_but_dis");
	if (fact_test_ind == 0)
		$("#fact_test_title").text("Passo 1 di 11 - Informazioni Centrale");
	else if (fact_test_ind == 1)
		$("#fact_test_title").text("Passo 2 di 11 - Test Ampolla");
	else if (fact_test_ind == 2)
		$("#fact_test_title").text("Passo 3 di 11 - Test Tamper");
	else if (fact_test_ind == 3)
		$("#fact_test_title").text("Passo 4 di 11 - Test Lettore RFID");
	else if (fact_test_ind == 4)
		$("#fact_test_title").text("Passo 5 di 11 - Test Audio");
	else if (fact_test_ind == 5)
		$("#fact_test_title").text("Passo 6 di 11 - Test Sirena");
	else if (fact_test_ind == 6)
		$("#fact_test_title").text("Passo 7 di 11 - Test PSTN");
	else if (fact_test_ind == 7)
		$("#fact_test_title").text("Passo 8 di 11 - Test GSM");
	else if (fact_test_ind == 8)
		$("#fact_test_title").text("Passo 9 di 11 - Test Wifi");
	else if (fact_test_ind == 9)
		$("#fact_test_title").text("Passo 10 di 11 - Test RF");
	else if (fact_test_ind == 10)
		$("#fact_test_title").text("Passo 11 di 11 - Test Low Power");
	else
		$("#fact_test_title").text("Attendere prego...");
}