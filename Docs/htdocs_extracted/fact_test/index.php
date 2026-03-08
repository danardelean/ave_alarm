<?php
	include("../private/php/config.php");
?>
<html>
	<head>
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=yes"/>
		<title>HS3 FACTORY TEST</title>
		<link href="res/style.css" rel="stylesheet" type="text/css">
		<link rel="shortcut icon" href="res/favicon.png" type="image/x-icon"/>
		<script language="javascript" type="text/javascript" src="jquery-1.11.1.min.js"></script>
		<script language="javascript" type="text/javascript" src="jquery-ui.min.js"></script>
		<script language="javascript" type="text/javascript" src="web_socket.js"></script>
		<script language="javascript" type="text/javascript" src="xml.js"></script>
		<script language="javascript" type="text/javascript" src="fact_test.js"></script>
	</head>
	<body id="body">
		<div id="fact_title"><p>HS3 Factory Test</p></div>
		<div id="fact_test_0" class="fact_test_main fact_invisible">
			<table width="500px" class="fact_test_center">
				<tr><td>TLC Version:</td><td id="fact_test_0_tlc_ver" align="center"></td></tr>
				<tr><td>SOM Version:</td><td id="fact_test_0_som_ver" align="center"></td></tr>
				<tr><td>CARRIER Version:</td><td id="fact_test_0_car_ver" align="center"></td></tr>
				<tr><td>KERNEL Version:</td><td id="fact_test_0_ker_ver" align="center"></td></tr>
				<tr><td>WEB Version:</td><td align="center"><?php echo SW_VER_STR; ?></td></tr>
				<tr><td>QT Version:</td><td id="fact_test_0_qt_ver" align="center"></td></tr>
				<tr><td>ALIM. 220V:</td><td id="fact_test_0_pow_present" align="center"></td></tr>
				<tr><td>BATTERIA:</td><td id="fact_test_0_bat_present" align="center"></td></tr>
				<tr><td>PSTN:</td><td id="fact_test_0_pstn_present" align="center"></td></tr>
				<tr><td>GSM Version:</td><td id="fact_test_0_gsm_ver" align="center"></td></tr>
				<tr><td>GSM IMEI:</td><td id="fact_test_0_gsm_imei" align="center"></td></tr>
			</table>
		</div>
		<div id="fact_test_1" class="fact_test fact_invisible">
			<table width="400px" class="fact_test_center">
				<tr><td width="50%">Stato Ampolla:</td><td id="fact_test_1_st" align="center"></td></tr>
				<tr><td style="font-size: 30px;" colspan="2"><br /><br /></td></tr>
				<tr><td id="fact_test_1_act" style="font-size: 50px;" colspan="2"align="center"></td></tr>
			</table>
		</div>
		<div id="fact_test_2" class="fact_test fact_invisible">
			<table width="400px" class="fact_test_center">
				<tr><td width="50%">Stato Tamper:</td><td id="fact_test_2_st" align="center"></td></tr>
				<tr><td style="font-size: 30px;" colspan="2"><br /><br /></td></tr>
				<tr><td id="fact_test_2_act" style="font-size: 50px;" colspan="2"align="center"></td></tr>
			</table>
		</div>
		<div id="fact_test_3" class="fact_test fact_invisible">
			<table width="400px" class="fact_test_center">
				<tr><td width="50%">Ultimo TAG letto:</td><td id="fact_test_3_rfid" align="center"></td></tr>
				<tr><td style="font-size: 30px;" colspan="2"><br /><br /></td></tr>
				<tr><td id="fact_test_3_act" style="font-size: 50px;" colspan="2"align="center"></td></tr>
			</table>
		</div>
		<div id="fact_test_4" class="fact_test fact_invisible">
			<table width="400px" class="fact_test_center">
				<tr><td width="30%">Stato Audio:</td><td id="fact_test_4_st" align="center" colspan="4"></td></tr>
				<tr><td style="font-size: 30px;" colspan="5"><br /><br /></td></tr>
				<tr>
					<td id="fact_test_4_stop" class="fact_but_blue" align="center">STOP</td>
					<td style="font-size: 30px;">&nbsp;&nbsp;&nbsp;</td>
					<td id="fact_test_4_rec" class="fact_but_red" align="center">REC</td>
					<td style="font-size: 30px;">&nbsp;&nbsp;&nbsp;</td>
					<td id="fact_test_4_play" class="fact_but_green" align="center">PLAY</td>
				</tr>
			</table>
		</div>
		<div id="fact_test_5" class="fact_test fact_invisible">
			<table width="400px" class="fact_test_center">
				<tr><td width="50%">Stato sirena interna:</td><td id="fact_test_5_st" align="center" colspan="2">Spenta</td></tr>
				<tr><td style="font-size: 30px;" colspan="3"><br /><br /></td></tr>
				<tr>
					<td id="fact_test_5_off" class="fact_but_red" align="center">DISATTIVA</td>
					<td style="font-size: 30px;">&nbsp;&nbsp;&nbsp;</td>
					<td id="fact_test_5_on" class="fact_but_green" align="center">ATTIVA</td>
				</tr>
			</table>
		</div>
		<div id="fact_test_6" class="fact_test fact_invisible">
			<table width="400px" class="fact_test_center">
				<tr><td width="50%">Numero di telefono:</td><td align="center" colspan="2"><input data-kbd="09" id="fact_test_6_tel" type="text" align="center"></input></td></tr>
				<tr><td>Stato PSTN:</td><td id="fact_test_6_st" align="center" colspan="2">Idle</td></tr>
				<tr><td style="font-size: 20px;" colspan="3"><br /><br /></td></tr>
				<tr>
					<td id="fact_test_6_hangup" class="fact_but_red" align="center">AGGANCIA</td>
					<td style="font-size: 30px;">&nbsp;&nbsp;&nbsp;</td>
					<td id="fact_test_6_call" class="fact_but_green" align="center">CHIAMA</td>
				</tr>
			</table>
		</div>
		<div id="fact_test_7" class="fact_test fact_invisible">
			<table width="400px" class="fact_test_center">
				<tr><td width="50%">Numero di telefono:</td><td align="center" colspan="2"><input data-kbd="09" id="fact_test_7_tel" type="text" align="center"></input></td></tr>
				<tr><td>Stato GSM:</td><td id="fact_test_7_st" align="center" colspan="2">Idle</td></tr>
				<tr><td style="font-size: 20px;" colspan="3"><br /><br /></td></tr>
				<tr>
					<td id="fact_test_7_hangup" class="fact_but_red" align="center">AGGANCIA</td>
					<td style="font-size: 30px;">&nbsp;&nbsp;&nbsp;</td>
					<td id="fact_test_7_call" class="fact_but_green" align="center">CHIAMA</td>
				</tr>
			</table>
		</div>
		<div id="fact_test_8" class="fact_test fact_invisible">
			<table width="400px" class="fact_test_center">
				<tr><td width="50%" style="font-size: 20px;">Nome AP:</td><td id="fact_test_8_ap" align="center" colspan="2">Attendere...</td></tr>
				<tr><td style="font-size: 20px;">Canale:</td><td id="fact_test_8_chan" align="center" colspan="2">Attendere...</td></tr>
			</table>
		</div>
		<div id="fact_test_9" class="fact_test fact_invisible">
			<table width="400px" class="fact_test_center">
				<tr><td width="50%" style="font-size: 20px;">Test Radio 433:</td><td id="fact_test_9_st_433" align="center" colspan="2">Attesa</td></tr>
				<tr><td style="font-size: 20px;">Test Radio 868:</td><td id="fact_test_9_st_868" align="center" colspan="2">Attesa</td></tr>
			</table>
		</div>
		<div id="fact_test_10" class="fact_test fact_invisible">
			<table width="400px" class="fact_test_center">
				<tr><td width="50%"></td><td align="center"></td></tr>
				<tr><td style="font-size: 20px;" colspan="2"><br /><br /></td></tr>
				<tr><td id="fact_test_10_lowpow" colspan="2" class="fact_but_blue" align="center">ENTRA IN LOW POWER</td>
			</table>
		</div>
		<div id="fact_footer"><p id="fact_test_title"></p></div>
		<div id="fact_prev" class="fact_but_dis"><p>Indietro</p></div>
		<div id="fact_next" class="fact_but_dis"><p>Avanti</p></div>
	</body>
</html>
