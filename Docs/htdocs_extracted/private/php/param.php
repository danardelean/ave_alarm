<?php
	if (isset($_GET["name"]) && isset($_POST["extra1"]) && isset($_POST["extra2"]) && isset($_POST["extra3"]) && isset($_POST["extra4"]) && isset($_POST["extra5"]) && isset($_POST["extra6"]) && isset($_POST["extra7"]) && isset($_POST["extra8"]) && isset($_POST["extra9"]) && isset($_POST["extra10"]))
	{
		if ($_GET["name"] == "widget_device")
		{
			$info = "false";
			if (!($_POST["extra1"] == "none"))
			{
				$info = $_POST["extra1"];
			}
		}
		else if ($_GET["name"] == "widget_confirm")
		{
			$type = "";
			$name = "";
			$redirect = "";
			if (!($_POST["extra1"] == "none" || $_POST["extra2"] == "none" || $_POST["extra3"] == "none"))
			{
				$type = $_POST["extra1"];
				$name = $_POST["extra2"];
				$redirect = $_POST["extra3"];
			}
		}
		else if ($_GET["name"] == "widget_mod_user")
		{
			$u_index = "-1";
			if (!($_POST["extra1"] == "none"))
			{
				$u_index = $_POST["extra1"];
			}
		}
		else if ($_GET["name"] == "widget_login")
		{
			$pag_dest = "";
			$login_par = "";
			if (!($_POST["extra1"] == "none") && !($_POST["extra2"] == "none"))
			{
				$pag_dest = $_POST["extra1"];
				$login_par = $_POST["extra2"];
			}
			else if (!($_POST["extra1"] == "none"))
			{
				$pag_dest = $_POST["extra1"];
			}
		}
		else if ($_GET["name"] == "home")
		{
			$page = "none";
			if (!($_POST["extra1"] == "none"))
			{
				$page = $_POST["extra1"];
			}
		}
		else if ($_GET["name"] == "widget_popwarn")
		{
			$pw_title = "none";
			$pw_message = "none";
			$pw_footer = "none";
			$pw_exf = "none";
			$pw_extra = "none";
			$pw_okAbortStr = "none";
			if (!($_POST["extra1"] == "none"))
			{
				$pw_title = $_POST["extra1"];
			}
			if (!($_POST["extra2"] == "none"))
			{
			    $pw_message = $_POST["extra2"];
			}
			if (!($_POST["extra3"] == "none"))
			{
                $pw_footer = $_POST["extra3"];
			}
			if (!($_POST["extra4"] == "none"))
			{
				$pw_exf = $_POST["extra4"];
			}
			if (!($_POST["extra5"] == "none"))
			{
				$pw_extra = $_POST["extra5"];
			}
			if (!($_POST["extra6"] == "none"))
			{
			    $pw_okAbortStr = $_POST["extra6"];
			}
		}
		else if ($_GET["name"] == "widget_audio_edit")
		{
			$audio_id = "none";
			$audio_name = "none";
			$audio_present = "none";
			$audio_sec = "none";
			if (!($_POST["extra1"] == "none") && !($_POST["extra2"] == "none") && !($_POST["extra3"] == "none") && !($_POST["extra4"] == "none"))
			{
				$audio_id = $_POST["extra1"];
				$audio_name = $_POST["extra2"];
				$audio_present = $_POST["extra3"];
				$audio_sec = $_POST["extra4"];
			}
		}
		else if ($_GET["name"] == "widget_user_events")
		{
			$evetype = "none";
			if (!($_POST["extra1"] == "none"))
			{
				$evetype = $_POST["extra1"];
			}
		}
		else if ($_GET["name"] == "widget_diag")
		{
			$diag_identifier = "none";
			$diag_title = "none";
			$diag_container = "none";
			$diag_extra = "none";
			$diag_widget = "none";
			$item_name = "none";
			if (!($_POST["extra1"] == "none") && !($_POST["extra2"] == "none"))
			{
				$diag_identifier = $_POST["extra1"];
				$diag_title = $_POST["extra2"];
			}
			if (!($_POST["extra3"] == "none"))
			{
				$diag_container = $_POST["extra3"];
			}
			if (!($_POST["extra4"] == "none"))
			{
				$diag_extra = $_POST["extra4"];
			}
			if (!($_POST["extra5"] == "none"))
			{
				$diag_widget = $_POST["extra5"];
			}
			if (!($_POST["extra6"] == "none"))
			{
				$item_name = $_POST["extra6"];
			}
		}
		else if ($_GET["name"] == "widget_test_device_detail")
		{
			$tdd_type = "none";
			$tdd_room = "none";
			$tdd_area = "none";
			$tdd_type_code = "none";
			$tdd_dev_id = "none";
			$tdd_name = "none";
			if (!($_POST["extra1"] == "none"))
			{
				$tdd_type = $_POST["extra1"];
			}
			if (!($_POST["extra2"] == "none"))
			{
				$tdd_room = $_POST["extra2"];
			}
			if (!($_POST["extra3"] == "none"))
			{
				$tdd_area = $_POST["extra3"];
			}
			if (!($_POST["extra4"] == "none"))
			{
				$tdd_type_code = $_POST["extra4"];
			}
			if (!($_POST["extra5"] == "none"))
			{
				$tdd_dev_id = $_POST["extra5"];
			}
			if (!($_POST["extra6"] == "none"))
			{
				$tdd_name = $_POST["extra6"];
			}
		}
		else if ($_GET["name"] == "widget_keypad")
		{
			$origin = "none";
			$detail = "none";
			$extra = "none";
			$title = "none";
			if (!($_POST["extra1"] == "none") && !($_POST["extra2"] == "none") && !($_POST["extra4"] == "none"))
			{
				$origin = $_POST["extra1"];
				$detail = $_POST["extra2"];
				$title = $_POST["extra4"];
			}
			if (!($_POST["extra3"] == "none"))
			{
				$extra = $_POST["extra3"];
			}
		}
		else if ($_GET["name"] == "widget_stdby")
		{
			$preload = "none";
			if (!($_POST["extra1"] == "none"))
			{
				$preload = $_POST["extra1"];
			}
		}
		else if ($_GET["name"] == "widget_test_device_list")
		{
			$type_of_list = "none";
			if (!($_POST["extra1"] == "none"))
			{
				$type_of_list = $_POST["extra1"];
			}
		}
		else if ($_GET["name"] == "widget_mod_device_tvcc")
		{
			$context = "none";
			if (!($_POST["extra1"] == "none"))
			{
				$context = $_POST["extra1"];
			}
		}
		else if ($_GET["name"] == "widget_cmd_device_cen")
		{
			$scen_mode = "none";
			$devid = "none";
			$name_device = "none";
			$subcat = "none";
			$selected = "none";
			$idx = "none";
			$xml_any_tbl_idx = "none";
			if (!($_POST["extra1"] == "none"))
			{
				$scen_mode = $_POST["extra1"];
			}
			if (!($_POST["extra2"] == "none"))
			{
				$devid = $_POST["extra2"];
			}
			if (!($_POST["extra3"] == "none"))
			{
				$name_device = $_POST["extra3"];
			}
			if (!($_POST["extra4"] == "none"))
			{
				$subcat = $_POST["extra4"];
			}
			if (!($_POST["extra5"] == "none"))
			{
				$selected = $_POST["extra5"];
			}
			if (!($_POST["extra6"] == "none"))
			{
				$idx = $_POST["extra6"];
			}
			if (!($_POST["extra7"] == "none"))
			{
				$xml_any_tbl_idx = $_POST["extra7"];
			}
		}
		else if ($_GET["name"] == "widget_thermostat_device")
		{
		    $scen_mode = "none";
		    $devid = "none";
		    $name_device = "none";
		    $subcat = "none";
		    $selected = "none";
		    $idx = "none";
		    $xml_any_tbl_idx = "none";
		    if (!($_POST["extra1"] == "none"))
		    {
		        $scen_mode = $_POST["extra1"];
		    }
		    if (!($_POST["extra2"] == "none"))
		    {
		        $devid = $_POST["extra2"];
		    }
		    if (!($_POST["extra3"] == "none"))
		    {
		        $name_device = $_POST["extra3"];
		    }
		    if (!($_POST["extra4"] == "none"))
		    {
		        $subcat = $_POST["extra4"];
		    }
		    if (!($_POST["extra5"] == "none"))
		    {
		        $selected = $_POST["extra5"];
		    }
		    if (!($_POST["extra6"] == "none"))
		    {
		        $idx = $_POST["extra6"];
		    }
		    if (!($_POST["extra7"] == "none"))
		    {
		        $xml_any_tbl_idx = $_POST["extra7"];
		    }
		}
		else if ($_GET["name"] == "widget_add_scenery")
		{
			$scene_id = "none";
			$mode = "none";
			$shortcut_mode = "none";
			if (!($_POST["extra1"] == "none"))
			{
				$scene_id = $_POST["extra1"];
			}
			if (!($_POST["extra2"] == "none"))
			{
				$mode = $_POST["extra2"];
			}
			if (!($_POST["extra3"] == "none"))
			{
			    $shortcut_mode = $_POST["extra3"];
			}
		}
		//***********//
		//****AVE****//
		//***********//
		else if ($_GET["name"] == "widget_login_small")
		{
		    $pag_dest = "";
		    $login_par = "";
		    if (!($_POST["extra1"] == "none") && !($_POST["extra2"] == "none"))
		    {
		        $pag_dest = $_POST["extra1"];
		        $login_par = $_POST["extra2"];
		    }
		    else if (!($_POST["extra1"] == "none"))
		    {
		        $pag_dest = $_POST["extra1"];
		    }
		}
		else if ($_GET["name"] == "widget_zone_select_vert")
		{
		    $area_ins = "none";
		    $area_dis = "none";
		    $area_grp = "none";
		    $devid = "none";
		    $dev_name = "none";
		    $idx = "none";
		    $cmd_code = "none";
		    $mode = "none";
		    $area_part_selected = "none";
		    if (!($_POST["extra1"] == "none") && !($_POST["extra2"] == "none") && !($_POST["extra3"] == "none"))
		    {
		        $area_ins = $_POST["extra1"];
		        $area_dis = $_POST["extra2"];
		        $area_grp = $_POST["extra3"];
		    }
		    if (!($_POST["extra4"] == "none") && !($_POST["extra5"] == "none"))
		    {
		        $devid = $_POST["extra4"];
		        $dev_name = $_POST["extra5"];
		    }
		    if (!($_POST["extra6"] == "none"))
		    {
		        $idx = $_POST["extra6"];
		    }
		    if (!($_POST["extra7"] == "none"))
		    {
		        $cmd_code = $_POST["extra7"];
		    }
		    if (!($_POST["extra8"] == "none"))
		    {
		        $mode = $_POST["extra8"];
		    }
		    if (!($_POST["extra9"] == "none"))
		    {
		        $area_part_selected = $_POST["extra9"];
		    }
		}
		else if ($_GET["name"] == "widget_sideanom")
		{
		    $area_ins = "none";
		    $area_dis = "none";
		    $area_grp = "none";
		    if (!($_POST["extra1"] == "none") && !($_POST["extra2"] == "none") && !($_POST["extra3"] == "none"))
		    {
		        $area_ins = $_POST["extra1"];
		        $area_dis = $_POST["extra2"];
		        $area_grp = $_POST["extra3"];
		    }
		}
		else if ($_GET["name"] == "widget_waiting")
		{
		    $countdown = "none";
		    if (!($_POST["extra1"] == "none"))
		    {
		        $countdown = $_POST["extra1"];
		    }
		}
		else if ($_GET["name"] == "widget_settings_utilities")
		{
		    $loadButHide_flg = "none";
		    if (!($_POST["extra1"] == "none"))
		    {
		        $loadButHide_flg = $_POST["extra1"];
		    }
		}
		else if ($_GET["name"] == "widget_leaf_home")
		{
		    $loadButHide_flg = "none";
		    if (!($_POST["extra1"] == "none"))
		    {
		        $loadButHide_flg = $_POST["extra1"];
		    }
		}
		else if ($_GET["name"] == "widget_scenery_list")
		{
		    $edit_mode = "none";
		    $shortcut_mode = "none";
		    if (!($_POST["extra1"] == "none"))
		    {
		        $edit_mode = $_POST["extra1"];
		    }
		    if (!($_POST["extra2"] == "none"))
		    {
		        $shortcut_mode = $_POST["extra2"];
		    }
		}
	}
?>