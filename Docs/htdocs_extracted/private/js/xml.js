var xml_root;
var xml_request;
var xml_node;
var xml_node2;
var xml_login;
var xml_par;
var xml_cen_sn = "1234567890";
<?php
	if (@empty($_SESSION["WS_TOKEN"])) 
		echo "var xml_my_sn = Date.now();\r\n";
	else
		echo "var xml_my_sn = \"".$_SESSION["WS_TOKEN"]."\"\r\n";
?>
var xml_file_configuration = null;
var xml_prot_tx_syn = 0;
//
function xml_menu_load_send(page, filter, filter_type, prot_tx_str, par)
{
	xml_request = xml_request_head_build("MENU", prot_tx_str);
	xml_par = $(XML("act")); xml_par.text("LOAD"); xml_request.append(xml_par);		
	xml_par = $(XML("page")); xml_par.text(page); xml_request.append(xml_par);		
	xml_par = $(XML("par")); xml_par.text(par != null ? par : ""); xml_request.append(xml_par);
	if (filter_type == null)
		filter_type = "filter";
	if (filter != null)
	{
		xml_par = $(XML(filter_type)); xml_par.text(filter); xml_request.append(xml_par);
	}
	return(xml_send(xml_request));
}
function xml_request_head_build(type, prot_tx_str)
{
	if (prot_tx_str == null)
		xml_prot_tx_syn = "00";
	else
		xml_prot_tx_syn = prot_tx_str;
	//
	xml_request = $(XML_ROOT("Request"));
	xml_request.attr("id", "" + xml_prot_tx_syn);
	xml_request.attr("source", xml_my_sn);
	xml_request.attr("target", xml_cen_sn);
	xml_request.attr("protocolVersion", "1.0");
	xml_request.attr("type", type);
	return(xml_request);
}
function xml_send(xmldata)
{
	if (xmldata.attr("id") == "00")
		printComm("RICHIESTA SENZA DESTINATARIO", xmldata, 2);
	else
		printComm("RICHIESTA", xmldata, 1);
	//
	if (xmldata.find("act").text() == "SAVE")
		saveModFlg = true;
	//
	var xmlStr;
	var len;
	if (window.ActiveXObject)
		xmlStr = xmldata[0].xml;
	else
		xmlStr = new XMLSerializer().serializeToString(xmldata[0]);
	xmlStr = String.fromCharCode(0x02) + "<" + "?xml version=\"1.0\" encoding=\"utf-8\"?>" + xmlStr + String.fromCharCode(0x03);
	if (!web_socket_send(xmlStr) && SIMUL)
		alert("KO " + xmlStr);
	return xml_prot_tx_syn;
}
function xml_send_ori(xmldata)
{
	var xmlStr;
	var len;
	if (window.ActiveXObject)
		xmlStr = xmldata[0].xml;
	else 
		xmlStr = new XMLSerializer().serializeToString(xmldata[0]);
	xmlStr = "<" + "?xml version=\"1.0\" encoding=\"utf-8\"?>" + xmlStr;
	len = 1 + xmlStr.length + 1;
	data = new Uint8Array(len);
	data[0] = 0x02;
	for (var i = 0; i < xmlStr.length; i++)
		data[1 + i] = xmlStr.charCodeAt(i);
	data[1 + xmlStr.length] = 0x03;
	if (!web_socket_send(data) && SIMUL)
		alert("KO " + xmlStr);
	return xml_prot_tx_syn;
}
function XML_ROOT(name)
{
	xml_root = $.parseXML("<" + "?xml version=\"1.0\" encoding=\"utf-8\"?" + "><" + name + "/>");
	return(xml_root.documentElement);
}
function XML(name)
{
	return(xml_root.createElement(name));
}	
