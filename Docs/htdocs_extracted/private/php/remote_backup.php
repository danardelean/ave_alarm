<?php
	$backupPath = REMOTE_BACKUP_PATH.$_GET['act'];
	if (file_exists($backupPath))
	{
		header('Content-Type: application/zip');
		header('Content-Disposition: attachment; filename="'.$_GET['act'].'"');
		header('Content-Length: '.filesize($backupPath));
		//
	// 	readfile($backupPath);
		$chunksize = 1 * (512 * 1024);
		$buffer = '';
		$handle = @fopen($backupPath, 'r');
		if ($handle)
		{
			while (!feof($handle))
			{
				print(@fread($handle, $chunksize));
				ob_flush();
				flush();
			}
			fclose($handle);
		}
		//
		unlink($backupPath);
	}
	else
	{
		header('location: http://'.$_SERVER['HTTP_HOST'].'/');
	}
	exit;
?>