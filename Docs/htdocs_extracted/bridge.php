<?php 
	if (isset($_GET["command"]))
	{
		if ($_GET["command"] == "LSF")
		{
			include("private/php/config.php");	
			header('Content-Type: application/xml; charset=utf-8'); 
			@readfile(RAMDISK_PATH."bridge_lsf.xml");
		}
	}
	exit;
?>