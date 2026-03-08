const WEB_SOCK_ADDR_LOCAL = "ws://127.0.0.1:14001";
const WEB_SOCK_ADDR_WIFI = "ws://192.168.100.1:14001";
var ws_connected_flg = false;
var ws = null;
//
function web_socket_start()
{
	if ("WebSocket" in window)
	{
		if (typeof webbridge !== 'undefined')
			ws = new WebSocket(WEB_SOCK_ADDR_LOCAL);
		else
			ws = new WebSocket(WEB_SOCK_ADDR_WIFI);
		ws.binaryType = "arraybuffer";
		ws.onopen = function()
		{
			ws_connected_flg = true; 
			fact_test_start();
		};
		ws.onmessage = web_socket_recv;
		ws.onclose = function()
		{
			if (ws_connected_flg)
				ws_connected_flg = false;
			fact_test_stop();
		};
		ws.onerror = function()
		{
			if (ws_connected_flg) 
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