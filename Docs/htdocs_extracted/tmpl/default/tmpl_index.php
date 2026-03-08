<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=yes"/>
		<title>AVE AF927PLUS</title>
 		<div class="progressLoader" id="progressLoader"></div>
		<link href="{TMPL_DIR}res/progressLoader.css" rel="stylesheet" type="text/css">
		<script language="javascript" type="text/javascript" src="?cmd=getjs&name=progressLoader"></script>
		<link href="?cmd=getcss&name=style{ANTICACHE}" rel="stylesheet" type="text/css">
        <!-- <link href="?cmd=getcss&name=style_sil{ANTICACHE}" rel="stylesheet" type="text/css"> -->
		<link href="?cmd=getcss&name=style_ave{ANTICACHE}" rel="stylesheet" type="text/css">
		<link href="?cmd=getcss&name=style_ave_tema{ANTICACHE}" rel="stylesheet" type="text/css">
		<!-- <link href="?cmd=getcss&name=public/css/elegant{ANTICACHE}" rel="stylesheet" type="text/css"> -->
		<link href="{TMPL_DIR}res/public/css/elegant.css" rel="stylesheet" type="text/css">
		<link href="{TMPL_DIR}res/style_diy.css" rel="stylesheet" type="text/css">
		<link rel="shortcut icon" href="{TMPL_DIR}res/favicon.png" type="image/ico"/>
		{TMPL_HEADER_JS}
	</head>
	<body>
		<div id="wrapper" class="wrapper" 
			data-web-version="<?php echo SW_VER_STR; ?>" 
			data-tmp="<?php echo TMP; ?>" 
			data-debug-sw="<?php echo DEBUG_SW; ?>" 
			data-simul="<?php echo SIMUL; ?>"
			data-hash-mode="0"></div>
<?php
	if (DEBUG_SW)
	{
?>
		<div id="debug"></div>
		<div id="debug1"></div>
		<div id="debug2" class="debug2"></div>
		<div id="debug3"></div>
		<div id="debug4">extra</div>
		<div id="debug5">cln green</div>
		<div id="debug6"></div>
		<div id="debug7"></div>
		<div id="debug8"></div>
		<div id="debug9"></div>
<?php
	}
?>
	</body>
</html>