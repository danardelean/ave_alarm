var xml_root;
var xml_request;
var xml_cen_sn = "1234567890";
var xml_my_sn = Date.now();
var xml_prot_tx_syn = 0;
//
function xml_request_head_build()
{
	xml_prot_tx_syn = "00";
	xml_request = $(XML_ROOT("Request"));
	xml_request.attr("id", "" + xml_prot_tx_syn);
	xml_request.attr("source", xml_my_sn);
	xml_request.attr("target", xml_cen_sn);
	xml_request.attr("protocolVersion", "1.0");
	xml_request.attr("type", "FACT_TEST");
	return(xml_request);
}
function xml_send(xmldata)
{
	var xmlStr;
	var len;
	if (window.ActiveXObject)
		xmlStr = xmldata[0].xml; 
	else 
		xmlStr = new XMLSerializer().serializeToString(xmldata[0]);
	xmlStr = "<" + "?xml version=\"1.0\" encoding=\"utf-8\"?>" + xmlStr;
	console.log("REQ: \r\n" + xmlStr + "\r\n");
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
