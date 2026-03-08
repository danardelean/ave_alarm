<?php
	//http://192.168.200.43:8000/tmp/?cmd=getphp&name=rf_test&act=download
	//http://192.168.200.43:8000/tmp/?cmd=getphp&name=rf_test&act=erase
	$rf_log_path = RAMDISK_PATH."rf.txt";
	$rf_log_path_err = RAMDISK_PATH."debug.txt";
	if (strtolower($_GET['act']) == "download")
	{
		header('Content-Type: text/plain');
		header('Content-Disposition: attachment; filename=rf_log.txt');
		header('Content-Length: '.@filesize($rf_log_path));
		//
		$chunksize = 1*(512*1024);
		$buffer = '';
		$handle = fopen($rf_log_path, 'r');
		while (!feof($handle))
		{
			$buffer = fread($handle, $chunksize);
			echo $buffer;
		}
		fclose($handle);
		
		
		
		
		//header('Content-Type: text/plain');
		//header('Content-Disposition: attachment; filename=rf_log.txt');
		//header('Content-Length: '.@filesize($rf_log_path));
		//@readfile($rf_log_path);

// 			$chunksize = 1*(1024*1024);
// 			$buffer = '';
// 			$handle = fopen($rf_log_path, 'r');
// 			while (!feof($handle))
// 			{
// 				$buffer = fread($handle, $chunksize);
// 			}
// 			fclose($handle);

// 			header('Content-Type: application/txt');
// 			$contents = fread($my_file, filesize($rf_log_path));
// 			fclose($my_file);
// 			header('Content-Length: '.strlen($contents));
// 			header('Content-Disposition: attachment; filename=rf_log.txt');
		
		
		
// 		header('Content-Type: application/txt');
// 		$my_file = fopen($rf_log_path, "r") or die("error");
// 		$contents = fread($my_file, filesize($rf_log_path));
// 		fclose($my_file);
// 		header('Content-Length: '.strlen($contents));
// 		header('Content-Disposition: attachment; filename=rf_log.txt');
	}
	else if (strtolower($_GET['act']) == "erase")
	{
		unlink($rf_log_path);
	}
	else if (strtolower($_GET['act']) == "download_err")
	{
		header('Content-Type: text/plain');
		header('Content-Disposition: attachment; filename=err_log.txt');
		header('Content-Length: '.@filesize($rf_log_path_err));
		@readfile($rf_log_path_err);
	}
	else if (strtolower($_GET['act']) == "erase_err")
	{
		unlink($rf_log_path_err);
	}
	exit;
?>