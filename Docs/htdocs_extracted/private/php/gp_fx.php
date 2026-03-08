<?php
	function get_php_parsed_contents($filename)
	{
		if (is_file($filename))
		{
			ob_start();
			include $filename;
			$contents = ob_get_contents();
			ob_end_clean();
			return $contents;
		}
		return false;
	}
	function load_lang($lang)
	{
		$file = "private/lang/".$lang.".php";
		if (file_exists($file))
		{
			include($file);
			return true;
		}
		else
		{
			return false;
		}
	}
	function l($key, $substr_arr = "")
	{
		Global $l;
		
		if (empty($key))
		{
			return($l);
		}
		else
		{
			$str = $l[$key];
			if (is_array($substr_arr))
			{
				while (list($key, $value) = each($substr_arr))
					$str = str_replace('{'.$key.'}', $value, $str);
			}
			return($str);
		}
	}
	function check_key($name)
	{
		$key = md5(time() * rand());
		$res = false;
		if (isset($_SESSION["key".$name]))
		{
			if ($_SESSION["key".$name] == $_GET["key"])
				$res = true;
		}
		$_SESSION["key".$name] = $key;
		return($res);
	}
	function DEBUG($obj, $exit_flg = true)
	{
		echo "<pre>";
		print_r($obj);
		echo "</pre>";
		if ($exit_flg)
			exit;
	}
	function list_files_dir($pathX)
	{
	    $filesX = scandir($pathX);
	    return ($filesX);
	}
	if(!function_exists('json_encode'))
	{
	    function json_encode($a=false)
	    {
	        // Some basic debugging to ensure we have something returned
	        if (is_null($a)) return 'null';
	        if ($a === false) return 'false';
	        if ($a === true) return 'true';
	        if (is_scalar($a))
	        {
	            if (is_float($a))
	            {
	                // Always use '.' for floats.
	                return floatval(str_replace(',', '.', strval($a)));
	            }
	            if (is_string($a))
	            {
	                static $jsonReplaces = array(array('\\', '/', "\n", "\t", "\r", "\b", "\f", '"'), array('\\\\', '\\/', '\\n', '\\t', '\\r', '\\b', '\\f', '\"'));
	                return '"' . str_replace($jsonReplaces[0], $jsonReplaces[1], $a) . '"';
	            }
	            else
	                return $a;
	        }
	        $isList = true;
// 	        for ($i = 0, reset($a); true; $i++) {
// 	            if (key($a) !== $i)
// 	            {
// 	                $isList = false;
// 	                break;
// 	            }
// 	        }
	        $result = array();
	        if ($isList)
	        {
	            foreach ($a as $v) $result[] = json_encode($v);
	            return '[' . join(',', $result) . ']';
	        }
	        else
	        {
	            foreach ($a as $k => $v) $result[] = json_encode($k).':'.json_encode($v);
	            return '{' . join(',', $result) . '}';
	        }
	    }
	}
?>