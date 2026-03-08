const WEBUPGRADE_MAX_FILE_SIZE = (64 * 1024 * 1024);
const WEBUPGRADE_CHUNK_SIZE = (32 * 1024);
var webUpgrade_chunkCb = null;
var webUpgrade_errorCb = null;
var webUpgrade_file = null;
var webUpgrade_type = "0";
var webUpgrade_fileSize = 0;
var webUpgrade_chunkN = 0;
var webUpgrade_chunkCnt = 0;
var webUpgrade_offset = 0;

function webUpgradeAbort(send_flg)
{
	if (send_flg)
	{
		xml_request = xml_request_head_build("MENU", "widget_utility");
		xml_par = $(XML("page")); xml_par.text("UTILITY"); xml_request.append(xml_par);
		xml_par = $(XML("act")); xml_par.text("FW_UPGRADE_STOP"); xml_request.append(xml_par);
		xml_par = $(XML("par")); xml_par.text("0"); xml_request.append(xml_par);
		xml_send(xml_request);
	}
	//
	webUpgrade_chunkCb = null;
	webUpgrade_errorCb = null;
	webUpgrade_file = null;
	webUpgrade_type = "0";
	webUpgrade_fileSize = 0;
	webUpgrade_chunkN = 0;
	webUpgrade_chunkCnt = 0;
	webUpgrade_offset = 0;
}

function webUpgradeProc(flg, type, chunkCb, errorCb)
{
	var res = false;
	
	if (flg)
	{
		res = (webUpgrade_file == null);
		if (res)
		{
			webUpgrade_chunkCb = chunkCb;
			webUpgrade_errorCb = errorCb;
			webUpgrade_type = type;
			webUpgrade_fileSize = 0;
			webUpgrade_chunkN = 0;
			webUpgrade_chunkCnt = 0;
			webUpgrade_offset = 0;
			//
			var input = $(document.createElement('input')); 
			input.attr("type", "file");
			input.change(function()
			{
				var f_arr = this.files;
				if (f_arr.length == 1)
				{
					webUpgrade_file = f_arr[0];
					webUpgrade_fileSize = webUpgrade_file.size;
				}
				if ((webUpgrade_fileSize > 0) && (webUpgrade_fileSize < WEBUPGRADE_MAX_FILE_SIZE))
				{
					webUpgrade_chunkN = (((webUpgrade_fileSize - 1) / WEBUPGRADE_CHUNK_SIZE) >> 0) + 1;
					webUpgrade_chunkCnt = 0;
					webUpgrade_offset = 0;
					//
					xml_request = xml_request_head_build("MENU", "widget_utility");
					xml_par = $(XML("page")); xml_par.text("UTILITY"); xml_request.append(xml_par);
					xml_par = $(XML("act")); xml_par.text("FW_UPGRADE_START"); xml_request.append(xml_par);
					if (!(webUpgrade_type == "1" || webUpgrade_type == "2"))
						tyu("Errore Parametrico");
					xml_par = $(XML("par")); xml_par.text(webUpgrade_type); xml_request.append(xml_par);
					xml_send(xml_request);
				}
				else
				{
					webUpgrade_errorCb();
					webUpgrade_chunkCb = null;
					webUpgrade_errorCb = null;
					webUpgrade_file = null;
					webUpgrade_type = "0";
					webUpgrade_fileSize = 0;
					webUpgrade_chunkN = 0;
					webUpgrade_chunkCnt = 0;
					webUpgrade_offset = 0;
				}
			}).trigger('click');
		}
	}
	else if (webUpgrade_file == null)
	{
		res = false;
	}
	else if (webUpgrade_offset < webUpgrade_fileSize)
	{
		var r = new FileReader();
		var blob = webUpgrade_file.slice(webUpgrade_offset, webUpgrade_offset + WEBUPGRADE_CHUNK_SIZE);
		var errorEventHandler = function(evt) 
		{
			xml_request = xml_request_head_build("MENU", "widget_utility");
			xml_par = $(XML("page")); xml_par.text("UTILITY"); xml_request.append(xml_par);
			xml_par = $(XML("act")); xml_par.text("FW_UPGRADE_STOP"); xml_request.append(xml_par);
			xml_par = $(XML("par")); xml_par.text("0"); xml_request.append(xml_par);
			xml_send(xml_request);
			webUpgrade_errorCb();
			webUpgrade_chunkCb = null;
			webUpgrade_errorCb = null;
			webUpgrade_file = null;
			webUpgrade_type = "0";
			webUpgrade_fileSize = 0;
			webUpgrade_chunkN = 0;
			webUpgrade_chunkCnt = 0;
			webUpgrade_offset = 0;
		}
		var readEventHandler = function(evt) 
		{
			if (evt.target.error == null) 
			{
				var binary = '';
				var bytes = new Uint8Array(evt.target.result);
				var len = bytes.byteLength;
				webUpgrade_offset += evt.target.result.byteLength;
				webUpgrade_chunkCnt += 1;
				for (var i = 0; i < len; i++)
					binary += String.fromCharCode(bytes[i]);
				xml_request = xml_request_head_build("MENU", "widget_utility");
				xml_par = $(XML("page")); xml_par.text("UTILITY"); xml_request.append(xml_par);
				xml_par = $(XML("act")); xml_par.text("FW_UPGRADE_CHUNK"); xml_request.append(xml_par);
				xml_par = $(XML("par")); xml_par.text(window.btoa(binary)); xml_request.append(xml_par);
				xml_send(xml_request);	
				webUpgrade_chunkCb(webUpgrade_chunkCnt, webUpgrade_chunkN);
				return(false);
			}
			errorEventHandler(evt);
			return(false);
		}
		r.onload = readEventHandler;
		r.onabort = errorEventHandler;
		r.onerror = errorEventHandler;
		r.readAsArrayBuffer(blob);
		res = true;
	}
	else
	{
		xml_request = xml_request_head_build("MENU", "widget_utility");
		xml_par = $(XML("page")); xml_par.text("UTILITY"); xml_request.append(xml_par);
		xml_par = $(XML("act")); xml_par.text("FW_UPGRADE_STOP"); xml_request.append(xml_par);
		xml_par = $(XML("par")); xml_par.text(webUpgrade_type); xml_request.append(xml_par);
		xml_send(xml_request);
		//
		webUpgrade_chunkCb = null;
		webUpgrade_errorCb = null;
		webUpgrade_file = null;
		webUpgrade_type = "0";
		webUpgrade_fileSize = 0;
		webUpgrade_chunkN = 0;
		webUpgrade_chunkCnt = 0;
		webUpgrade_offset = 0;
		res = true;
	}
	return(res);
}
