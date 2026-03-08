<?php
	error_reporting(0);
	//include("private/php/config.php");
	session_start();
	/*
	if (SIMUL)
	{
		define("DB_DIY_PATH", "hs3_diy.db");
		define("DB_SIL_PATH", "hs3_sil.db");
		define("DB_NICE_PATH", "hs3_nice.db");
		define("CFG_XML_PATH", "configuration.xml");
		define("DEBUG_LOG_PATH", "log.txt");
		define("DEBUG_RF_PATH", "rf.txt");
	}
	else
	{
		define("DB_DIY_PATH", "/home/user/new/hs3_diy.db");
		define("DB_SIL_PATH", "/home/user/new/hs3_sil.db");
		define("DB_NICE_PATH", "/home/user/new/hs3_nice.db");
		define("CFG_XML_PATH", "/ramdisk/configuration.xml");
		define("DEBUG_LOG_PATH", "/ramdisk/log.txt");
		define("DEBUG_RF_PATH", "/ramdisk/rf.txt");
	}
	*/
	define("DB_DIY_PATH", "/home/user/new/hs3_diy.db");
	define("DB_SIL_PATH", "/home/user/new/hs3_sil.db");
	define("DB_NICE_PATH", "/home/user/new/hs3_nice.db");
	define("CFG_XML_PATH", "/ramdisk/configuration.xml");
	define("DEBUG_LOG_PATH", "/ramdisk/log.txt");
	define("DEBUG_RF_PATH", "/ramdisk/rf.txt");
	//
	$self = basename($_SERVER['PHP_SELF']);
	if (!isset($_SESSION['cmd_result']))
		$_SESSION['cmd_result'] = "Attesa di un comando";
	if (isset($_GET['action']))
	{
		$_SESSION['cmd'] = $_GET['action'];
		if ($_SESSION['cmd'] == "download_diy")
		{
			$path = DB_DIY_PATH;
			$res = file_exists($path);
			if ($res)
				$res = filesize($path) > 0;
			if ($res)
				$_SESSION['cmd_result'] = "Download Database DIY eseguito.";
			else
				$_SESSION['cmd_result'] = "Impossibile scaricare Database DIY!";
		}
		else if ($_SESSION['cmd'] == "download_sil")
		{
			$path = DB_SIL_PATH;
			$res = file_exists($path);
			if ($res)
				$res = filesize($path) > 0;
			if ($res)
				$_SESSION['cmd_result'] = "Download Database SIL eseguito.";
			else
				$_SESSION['cmd_result'] = "Impossibile scaricare Database SIL!";
		}
		else if ($_SESSION['cmd'] == "download_nice")
		{
			$path = DB_NICE_PATH;
			$res = file_exists($path);
			if ($res)
				$res = filesize($path) > 0;
			if ($res)
				$_SESSION['cmd_result'] = "Download Database NICE eseguito.";
			else
				$_SESSION['cmd_result'] = "Impossibile scaricare Database NICE!";
		}
		else if ($_SESSION['cmd'] == "download_cfg")
		{
			$path = CFG_XML_PATH;
			$res = file_exists($path);
			if ($res)
				$res = filesize($path) > 0;
			if ($res)
				$_SESSION['cmd_result'] = "Download Configuration.xml eseguito.";
			else
				$_SESSION['cmd_result'] = "Impossibile scaricare Configuration.xml!";
		}
		else if ($_SESSION['cmd'] == "download_debug_log")
		{
			$path = DEBUG_LOG_PATH;
			$res = file_exists($path);
			if ($res)
				$res = filesize($path) > 0;
			if ($res)
				$_SESSION['cmd_result'] = "Download Debug Log eseguito.";
			else
				$_SESSION['cmd_result'] = "Impossibile scaricare Debug Log!";
		}
		else if ($_SESSION['cmd'] == "download_debug_rf")
		{
			$path = DEBUG_RF_PATH;
			$res = file_exists($path);
			if ($res)
				$res = filesize($path) > 0;
			if ($res)
				$_SESSION['cmd_result'] = "Download Debug Rf eseguito.";
			else
				$_SESSION['cmd_result'] = "Impossibile scaricare Debug Rf!";
		}
		else if ($_SESSION['cmd'] == "download_diy_file" || 
				 $_SESSION['cmd'] == "download_sil_file" || 
				 $_SESSION['cmd'] == "download_nice_file" || 
				 $_SESSION['cmd'] == "download_debug_log_file" || 
				 $_SESSION['cmd'] == "download_debug_rf_file" || 
				 $_SESSION['cmd'] == "download_cfg_file")
		{
			$path = "";
			$file_name = "";
			if ($_SESSION['cmd'] == "download_diy_file")
			{
				$path = DB_DIY_PATH;
				$file_name = "hs3_diy.db";
			}
			else if ($_SESSION['cmd'] == "download_sil_file")	
			{
				$path = DB_SIL_PATH;
				$file_name = "hs3_sil.db";
			}
			else if ($_SESSION['cmd'] == "download_nice_file")	
			{
				$path = DB_NICE_PATH;
				$file_name = "hs3_nice.db";
			}
			else if ($_SESSION['cmd'] == "download_cfg_file")
			{
				$path = CFG_XML_PATH;
				$file_name = "configuration.xml";
			}
			else if ($_SESSION['cmd'] == "download_debug_log_file")
			{
				$path = DEBUG_LOG_PATH;
				$file_name = "debug_log.txt";
			}
			else if ($_SESSION['cmd'] == "download_debug_rf_file")
			{
				$path = DEBUG_RF_PATH;
				$file_name = "debug_rf.txt";
			}
			header('Content-Type: text/plain');
			header('Content-Disposition: attachment; filename='.$file_name);
			header('Content-Length: '.@filesize($path));
			@readfile($path);
			$_SESSION['cmd'] = "";
			$_SESSION['cmd_result'] = "Attesa di un comando";
			exit;
		}
		else if ($_SESSION['cmd'] == "reset_diy")
		{
			$path = DB_DIY_PATH;
			$res = unlink($path);
			if ($res)
				$_SESSION['cmd_result'] = "Database DIY resettato. (Riavviare centrale per rendere operativi i cambiamenti)";
			else
				$_SESSION['cmd_result'] = "Errore durante reset Database DIY! (Forse gia' resettato?)";
		}
		else if ($_SESSION['cmd'] == "reset_sil")
		{
			$path = DB_SIL_PATH;
			$res = unlink($path);
			if ($res)
				$_SESSION['cmd_result'] = "Database SIL resettato. (Riavviare centrale per rendere operativi i cambiamenti)";
			else
				$_SESSION['cmd_result'] = "Errore durante reset Database SIL! (Forse gia' resettato?)";
		}
		else if ($_SESSION['cmd'] == "reset_nice")
		{
			$path = DB_NICE_PATH;
			$res = unlink($path);
			if ($res)
				$_SESSION['cmd_result'] = "Database NICE resettato. (Riavviare centrale per rendere operativi i cambiamenti)";
			else
				$_SESSION['cmd_result'] = "Errore durante reset Database NICE! (Forse gia' resettato?)";
		}
		else if ($_SESSION['cmd'] == "upload_diy" || $_SESSION['cmd'] == "upload_sil" || $_SESSION['cmd'] == "upload_nice")
		{
			$path = "";
			$file_name = "";
			$ok_msg = "";
			$ko_msg = "";
			if ($_SESSION['cmd'] == "upload_diy")
			{
				$path = DB_DIY_PATH;
				$file_name = "user_file_diy";
				$ok_msg = "Upload Database DIY eseguito. (Riavviare centrale per rendere operativi i cambiamenti)";
				$ko_msg = "Errore durante Upload del Database DIY!";
			}
			else if ($_SESSION['cmd'] == "upload_sil")	
			{
				$path = DB_SIL_PATH;
				$file_name = "user_file_sil";
				$ok_msg = "Upload Database SIL eseguito. (Riavviare centrale per rendere operativi i cambiamenti)";
				$ko_msg = "Errore durante Upload del Database SIL!";
			}
			else if ($_SESSION['cmd'] == "upload_nice")	
			{
				$path = DB_NICE_PATH;
				$file_name = "user_file_nice";
				$ok_msg = "Upload Database NICE eseguito. (Riavviare centrale per rendere operativi i cambiamenti)";
				$ko_msg = "Errore durante Upload del Database NICE!";
			}
			if (isset($_FILES[$file_name]))
			{
				$file = $_FILES[$file_name];
				$res = (($file['error'] == UPLOAD_ERR_OK) && (is_uploaded_file($file['tmp_name'])) && ($file['size'] > 15));
				if ($res)
				{
					$fp = fopen($file['tmp_name'], 'r');
					fseek($fp, 0);
					$data = fread($fp, 15);
					fclose($fp);
					$res = ($data == "SQLite format 3");
				}
				if ($res)
				{
					unlink($path);
					$res = move_uploaded_file($file['tmp_name'], $path);
					unlink($file['tmp_name']);
					$res = fflush($path);
				}
				if ($res)
					$_SESSION['cmd_result'] = $ok_msg;
				else
					$_SESSION['cmd_result'] = $ko_msg;				
			}
		}
		else
		{
			$_SESSION['cmd_result'] = "Comando invalido!";		
		}
		header('Location: '.$self.'?ts='.time());
	}
?>
<html>
    <head>
        <title>HS3 WebTools</title>
		<style>
			html
			{
				background-color: #1e1e1e;
			}
			html, body
			{
				width:100%;
				height:100%;
				margin:0px;
				border:0px;
				padding:0px;
				color: #ffffff;
				font-family:"roboto-normal", Arial, "Times New Roman";
			}
			#title
			{
				color: #ffbf00;
			}
			table
			{
				margin: 20px;
			}
			h1
			{
				margin: 20px;
				color: #ff4f00;
			}
			.cmd_result
			{
				color: #ffbf99;
			}
		</style>
		<script type="text/javascript">
			function js_start()
			{
			<?php
				if ($_SESSION['cmd'] == "download_diy")
				{
					$path = DB_DIY_PATH;
					$res = file_exists($path);
					if ($res)
						$res = filesize($path) > 0;
					if ($res)
						echo "location.href='".$self."?action=download_diy_file&ts=".time()."';";
				}
				else if ($_SESSION['cmd'] == "download_sil")
				{
					$path = DB_SIL_PATH;
					$res = file_exists($path);
					if ($res)
						$res = filesize($path) > 0;
					if ($res)
						echo "location.href='".$self."?action=download_sil_file&ts=".time()."';";
				}
				else if ($_SESSION['cmd'] == "download_nice")
				{
					$path = DB_NICE_PATH;
					$res = file_exists($path);
					if ($res)
						$res = filesize($path) > 0;
					if ($res)
						echo "location.href='".$self."?action=download_nice_file&ts=".time()."';";
				}
				else if ($_SESSION['cmd'] == "download_cfg")
				{
					$path = CFG_XML_PATH;
					$res = file_exists($path);
					if ($res)
						$res = filesize($path) > 0;
					if ($res)
						echo "location.href='".$self."?action=download_cfg_file&ts=".time()."';";
				}
				else if ($_SESSION['cmd'] == "download_debug_log")
				{
					$path = DEBUG_LOG_PATH;
					$res = file_exists($path);
					if ($res)
						$res = filesize($path) > 0;
					if ($res)
						echo "location.href='".$self."?action=download_debug_log_file&ts=".time()."';";
				}
				else if ($_SESSION['cmd'] == "download_debug_rf")
				{
					$path = DEBUG_RF_PATH;
					$res = file_exists($path);
					if ($res)
						$res = filesize($path) > 0;
					if ($res)
						echo "location.href='".$self."?action=download_debug_rf_file&ts=".time()."';";
				}
			?>
			}
		</script>
    </head>
    <body onload="js_start()">
		<center>
			<br><br>
			<h1><u>HS3 WebTools</u></h1>
			<br><br>
			<table>
				<tr>
					<td id="title">Database HS3 DIY</td>
				</tr>
				<tr>
					<td>
						<form method="post" action="<?php echo $self; ?>?action=upload_diy" enctype="multipart/form-data">
							<input type="button" value="Scarica Database" onClick="location.href='<?php echo $self; ?>?action=download_diy&ts=<?php echo time(); ?>';"/>
							<input type="submit" value="Carica Database" />
							<input type="button" value="Resetta Database" onClick="location.href='<?php echo $self; ?>?action=reset_diy&ts=<?php echo time(); ?>';"/>
							<input type="file" name="user_file_diy" />
						</form>
					</td>
				</tr>
				<tr>
					<td id="title">Database HS3 SIL</td>
				</tr>
				<tr>
					<td>
						<form method="post" action="<?php echo $self; ?>?action=upload_sil" enctype="multipart/form-data">
							<input type="button" value="Scarica Database" onClick="location.href='<?php echo $self; ?>?action=download_sil&ts=<?php echo time(); ?>';"/>
							<input type="submit" value="Carica Database" />
							<input type="button" value="Resetta Database" onClick="location.href='<?php echo $self; ?>?action=reset_sil&ts=<?php echo time(); ?>';"/>
							<input type="file" name="user_file_sil" />
						</form>
					</td>
				</tr>
				<tr>
					<td id="title">Database HS3 NICE</td>
				</tr>
				<tr>
					<td>
						<form method="post" action="<?php echo $self; ?>?action=upload_nice" enctype="multipart/form-data">
							<input type="button" value="Scarica Database" onClick="location.href='<?php echo $self; ?>?action=download_nice&ts=<?php echo time(); ?>';"/>
							<input type="submit" value="Carica Database" />
							<input type="button" value="Resetta Database" onClick="location.href='<?php echo $self; ?>?action=reset_nice&ts=<?php echo time(); ?>';"/>
							<input type="file" name="user_file_nice" />
						</form>
					</td>
				</tr>
				<tr>
					<td id="title">Configuration.xml</td>
				</tr>
				<tr>
					<td>
						<form>
							<input type="button" value="Scarica ultima Configurazione generata" onClick="location.href='<?php echo $self; ?>?action=download_cfg&ts=<?php echo time(); ?>';"/>
						</form>
					</td>
				</tr>
				<tr>
					<td id="title">Debug Log</td>
				</tr>
				<tr>
					<td>
						<form>
							<input type="button" value="Scarica Debug Log" onClick="location.href='<?php echo $self; ?>?action=download_debug_log&ts=<?php echo time(); ?>';"/>
						</form>
					</td>
				</tr>
				<tr>
					<td id="title">Debug Rf</td>
				</tr>
				<tr>
					<td>
						<form>
							<input type="button" value="Scarica Debug Rf" onClick="location.href='<?php echo $self; ?>?action=download_debug_rf&ts=<?php echo time(); ?>';"/>
						</form>
					</td>
				</tr>
				<tr>
					<td id="title"><br><br>Risultato ultima operazione: <div class="cmd_result"><?php echo $_SESSION['cmd_result']; ?></div></td>
				</tr>
			</table>
		</center>
	</body>
</html>
<?php
	if (!isset($_GET['action']))
	{
		$_SESSION['cmd'] = "";
		$_SESSION['cmd_result'] = "Attesa di un comando";
	}
?>
