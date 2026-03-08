<?php 
	include("private/php/config.php");	
	header('Content-Type: application/xml; charset=utf-8'); 
	@readfile(RAMDISK_PATH."revealcode.xml");
?>
