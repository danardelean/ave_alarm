<?php
	define("SIMUL", false);
	define("DEBUG_REMOTE_IP", "");	// Empty string su Release // 192.168.200.95:14001
	define("TMP", false);
	define("DEBUG_SW", SIMUL);
	//
	define("PROGRESS_LOADER_ELEMENTS_WELCOME", 28);
	define("PROGRESS_LOADER_ELEMENTS_HOME", 33);
	//
	define("SW_VER_STR", "V0.01.77");
	define("WS_PORT", 14001);
	if (SIMUL)
	{	// ***** SIMUL *****
		define("RAMDISK_PATH", "\\\\NasIS\\disco_f\\NICE\\HS3\\DIY\\SOM\\PC_WIN\\NEW\\");
		define("REMOTE_BACKUP_PATH", "\\\\NasIS\\disco_f\\NICE\\HS3\\DIY\\SOM\\PC_WIN\\NEW\\DOWNLOAD\\BACKUP\\");
	}
	else
	{	// ***** REALE *****
		define("RAMDISK_PATH", "/ramdisk/");
		define("REMOTE_BACKUP_PATH", "/home/user/new/backup_zip/");
	}
?>