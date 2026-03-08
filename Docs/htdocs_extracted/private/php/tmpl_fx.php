<?php
	function parse_template($buf)
	{
		preg_match_all("~{TMPL_(.+?)}~", $buf, $match);
		$token_arr = array_unique($match[0]);
		$fx_arr = array_unique($match[1]);
		foreach($token_arr as $key => $token)
			$buf = str_replace($token, call_user_func("TMPL_".$fx_arr[$key]), $buf);
		//
		preg_match_all("~{LANG_(.+?)}~", $buf, $match);
		$token_arr = array_unique($match[0]);
		$lang_arr = array_unique($match[1]);
		foreach($token_arr as $key => $token)
			$buf = str_replace($token, l($lang_arr[$key]), $buf);
		//
		$buf = str_replace("{ANTICACHE}", "&ver=".SW_VER_STR, $buf);
		return($buf);
	}

	function parse_css($buf)
	{
		preg_match_all("/url\((.*?)\)/", $buf, $match);
		$token_arr = array_unique($match[1]);
		foreach($token_arr as $token)
			$buf = str_replace($token, $token."?ver=".SW_VER_STR, $buf);
		//
		$buf = str_replace("url(", "url(".call_user_func("TMPL_DIR")."res/", $buf);
		return $buf;
	}
	
	function check_template($name)
	{
		$file = "tmpl/".$name."/tmpl_index.php";
		return(file_exists($file));
	}
	
	// ***************************************************************************************************************************

	function TMPL_DIR()
	{
		return("tmpl/".$_SESSION["tmpl"]."/");
	}

	function TMPL_HEADER_JS()
	{
		$res = '<script language="javascript" type="text/javascript" src="?cmd=getjs&name=jquery-1.11.1.min"></script>
				<script language="javascript" type="text/javascript" src="?cmd=getjs&name=jquery-ui.min"></script>
				<script language="javascript" type="text/javascript" src="?cmd=getjs&name=jquery.base64"></script>
				<script language="javascript" type="text/javascript" src="?cmd=getjs&name=jquery.transit.min"></script>
                <script language="javascript" type="text/javascript" src="?cmd=getjs&name=swipe_catcher"></script>
				<script language="javascript" type="text/javascript" src="?cmd=getjs&name=term_def"></script>
				<script language="javascript" type="text/javascript" src="?cmd=getjs&name=xml"></script>
				<script language="javascript" type="text/javascript" src="?cmd=getjs&name=pag"></script>
				<script language="javascript" type="text/javascript" src="?cmd=getjs&name=web_socket"></script>
				<script language="javascript" type="text/javascript" src="?cmd=getjs&name=web_upgrade"></script>
				<script language="javascript" type="text/javascript" src="?cmd=getjs&name=main"></script>
				<script language="javascript" type="text/javascript" src="?cmd=getjs&name=util"></script>
				<script language="javascript" type="text/javascript" src="?cmd=getjs&name=util_nolang"></script>
				<script language="javascript" type="text/javascript" src="?cmd=getjs&name=rtc"></script>
				<script language="javascript" type="text/javascript" src="?cmd=getjs&name=date"></script>
				<script language="javascript" type="text/javascript" src="?cmd=getjs&name=date_it-IT"></script>
				<script language="javascript" type="text/javascript" src="?cmd=getjs&name=function_items"></script>
                <script language="javascript" type="text/javascript" src="?cmd=getjs&name=specialUserAgents"></script>
                <script language="javascript" type="text/javascript" src="?cmd=getjs&name=jquery.cookie"></script>
				<script language="javascript" type="text/javascript" src="?cmd=getjs&name=maskedinput"></script>';
		return($res);
	}

	function TMPL_WEBAPP_VER()
	{
		return(VERSION);
	}
?>