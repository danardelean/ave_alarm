<?php
	//php version su reale : 5.0.4
	include("private/php/config.php");
	include("private/php/gp_fx.php");
	include("private/php/tmpl_fx.php");
	if (SIMUL)
	{
		//error_reporting(0);
	}
	else
	{
		error_reporting(0);
	}
	session_cache_limiter(false);
	session_start();
	Global $listOfFiles;
	$listOfFiles = list_files_dir("private/js/pag");
	//
	function setLanguage($lang)
	{
		$content = serialize($lang);
		file_put_contents(RAMDISK_PATH."lang.txt", $content);		
	}
	function getLanguage()
	{
		$lang = @unserialize(@file_get_contents(RAMDISK_PATH."lang.txt"));
		if (empty($lang))
			$lang = "";
		return($lang);
	}
	$tmp_png_file_count = 0;
	// SESSION!
	if (isset($_GET["gui_lang"]))
	{
		setLanguage($_GET["gui_lang"]);
		//header("location: http://".$_SERVER['SERVER_NAME'].":".$_SERVER['SERVER_PORT'].$_SERVER['PHP_SELF']);
		echo "OK";
		exit;
	}
	if (getLanguage() == "" || !load_lang(getLanguage()))
	{
		setLanguage('en');
		if (!load_lang(getLanguage()))
		{
			echo "Language Error!";
			exit;
		}
	}
	if (isset($_GET["tmpl"]))
	{
		$_SESSION["tmpl"] = $_GET["tmpl"];
		header("location: http://".$_SERVER['SERVER_NAME'].":".$_SERVER['SERVER_PORT'].$_SERVER['PHP_SELF']);
		exit;
	}
	if (!isset($_SESSION["tmpl"]) || !check_template($_SESSION["tmpl"]))
	{
		$_SESSION["tmpl"] = 'default';
		if (!check_template($_SESSION["tmpl"]))
		{
			echo "Template Error!";
			exit;
		}
	}
	// START!
	if (isset($_GET["cmd"]) && ($_GET['cmd'] == "getpag" || $_GET['cmd'] == "getphp" || $_GET['cmd'] == "getjs" || $_GET['cmd'] == "getcss"))
	{
		//header('Cache-Control: max-age: 31536000');
		//header_remove('Expires');
		$buf = false;
		if ($_GET['cmd'] == "getpag")
		{
			header('Content-Type: text/html');
			$buf = parse_template(get_php_parsed_contents(TMPL_DIR()."pag/pag_".$_GET['name'].".php"));
			if ($buf === false)
			{
				echo "Error: PAGE not found!";
				exit;
				//header("location: http://".$_SERVER['SERVER_NAME'].":".$_SERVER['SERVER_PORT'].$_SERVER['PHP_SELF']);
			}
			else
			{
				echo '<script language="javascript" type="text/javascript">';
				echo parse_template(get_php_parsed_contents("private/js/pag/pag_".$_GET['name'].".js"));
				echo '</script>';
				echo $buf;
			}
		}
		else if ($_GET['cmd'] == "getphp")
		{
			header('Content-Type: text/html');
			$buf = get_php_parsed_contents("private/php/".$_GET['name'].".php");
			if ($buf === false)
			{
				echo "Error: PHP not found!";
				exit;
				//header("location: http://".$_SERVER['SERVER_NAME'].":".$_SERVER['SERVER_PORT'].$_SERVER['PHP_SELF']);
			}
			else
				echo $buf;
		}
		else if ($_GET['cmd'] == "getjs")
		{
			header('Content-Type: application/javascript');
			$buf = parse_template(get_php_parsed_contents("private/js/".$_GET['name'].".js"));
			if ($buf === false)
			{
				echo "Error: JS not found!";
				exit;
				//header("location: http://".$_SERVER['SERVER_NAME'].":".$_SERVER['SERVER_PORT'].$_SERVER['PHP_SELF']);
			}
			else
				echo $buf;
		}
		else if ($_GET['cmd'] == "getcss")
		{
			header('Content-Type: text/css');
			$buf = parse_template(get_php_parsed_contents(TMPL_DIR()."res/".$_GET['name'].".css"));
			$buf = parse_css($buf);
			if ($buf === false)
			{
				echo "Error: css not found!";
				exit;
				//header("location: http://".$_SERVER['SERVER_NAME'].":".$_SERVER['SERVER_PORT'].$_SERVER['PHP_SELF']);
			}
			else
				echo $buf;
		}
	}
	else
	{
		header('Content-Type: text/html');
		$buf = parse_template(get_php_parsed_contents(TMPL_DIR()."tmpl_index.php"));
		if ($buf === false)
			echo "Template Runtime Error!";
		else
			echo $buf;
	}
?>
