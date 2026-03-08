const WEB_SOCK_ADDR = "ws://<?php 
if (DEBUG_REMOTE_IP == "")
{
	$arr = @split(":", $_SERVER['HTTP_HOST']);
	echo $arr[0].':'.WS_PORT;
}
else
{
	echo DEBUG_REMOTE_IP;
}	
						?>/";
const WEB_SOCK_CLOUD_OLD_ADDR = "ws://<?php 
if (DEBUG_REMOTE_IP == "")
{
	$arr = @split(":", $_SERVER['HTTP_HOST']);
	echo $arr[0].':'.($_SERVER['SERVER_PORT'] + 10000);
}
else
{
	echo DEBUG_REMOTE_IP;
}
						?>/";
var ws_check_version_flg = false;
var ws_connected_flg = false;
var ws = null;

window.addEventListener("message", function(event) {
		console.log("AF927: Received message from: " + event.data);
		if(event.data=="getCurrentLocation")
		{
			console.log("AF927: Responding:"+'{"command":"location","value":"'+document.location.href+'"}');
			window.top.postMessage('{"command":"location","value":"'+document.location.href+'"}',"*"); 
		}
		else
		{
			console.log("AF927: Unknown request");
		}
	});
//
function isCloudOldIp(ip)
{
	var isCloudOldIp = false;
	if (ip.substr(0,13) == "tunnel.ave.it")
		isCloudOldIp = true;
	else if (ip.substr(0,19) == "monitoraggio.ave.it")
		isCloudOldIp = true;
	return(isCloudOldIp);
}
//
function isLocalIp(ip)
{
	var isLocalIp = false;
	if (ip.substr(0,3) == "10.")
		isLocalIp = true;
	else if (ip.substr(0,7) == "172.16.")
		isLocalIp = true;
	else if (ip.substr(0,4) == "127.")
		isLocalIp = true;
	else if (ip.substr(0,8) == "192.168.") 
		isLocalIp = true;
	return(isLocalIp);
}
//
function web_socket_start()
{
	if ("WebSocket" in window)
	{
		if (isLocalIp(location.hostname))
		{
			ws = new WebSocket(WEB_SOCK_ADDR);
		}
		else if (isCloudOldIp(location.hostname))
		{
			ws = new WebSocket(WEB_SOCK_CLOUD_OLD_ADDR);
		}
		else
		{
			if (location.href.indexOf("/access2/")>=0)
				ws = new WebSocket("wss://" + location.hostname + "/WebSocketService2");
			else
				ws = new WebSocket("wss://" + location.hostname + "/WebSocketService");
		}
		ws.binaryType = "arraybuffer";
		ws.onopen = function()
		{
			cons("socket opened");
			ws_check_version_flg = true;
			ws_connected_flg = true;
			session_u_p = null;
			wizard_flg = false;
			role_str = "NOROLE";
			uname_str = "";
			//
			maintenance_flg = false;
			maint_ip_curr = null;
			maintenance_fwupd_txt = null;
		};
		ws.onmessage = function(e)
		{
			if (ws_check_version_flg)
			{
				if (SIMUL || (String.fromCharCode.apply(null, new Uint8Array(e.data)) == "<?php echo SW_VER_STR; ?>"))
				{
					cons("send pairing...");
					pairing_send();
					ws_check_version_flg = false;
				}
				else
				{
					window.location.replace("");
				}
			}
			else
			{
				onRecv_collector(e);
			}
		};
		ws.onclose = function()
		{
			if (ws_connected_flg)
			{
				first_state = false;
				already_started_com = false;
				//_FT_
//				session_u_p = null;
//				wizard_flg = false;
//				role_str = "NOROLE";
//				uname_str = "";
				ws_connected_flg = false;
				clearTimeout(t_out_main_secondary);
				clearInterval(t_out_cam_miss);
				pag_change("#wrapper", "wizard");
				cons("socket closed");
			}
			xml_file_configuration = null;
			setTimeout(function() { web_socket_start(); }, 1 * 1000);
			//
			printComm("CHIUSURA SOCKET", "SOCKET CHIUSO", 1);
		};
		ws.onerror = function()
		{
			printComm("ERRORE SOCKET", "SOCKET IN ERRORE", 1);
			ws.close();
		};
	}
	else
	{
		alert("WebSocket NOT supported by your Browser!");
	}
}
function web_socket_send(data)
{
	var res = false;
	if (ws_connected_flg)
	{
		ws.send(data);
		res = true;
	}
	return(res);
}