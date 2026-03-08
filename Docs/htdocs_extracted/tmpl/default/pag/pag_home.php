<?php include("private/php/param.php"); ?>
<div class="home" id="home" data-title="{LANG_MENU}" data-page="<?php echo $page; ?>">
	<div id="gui_header" class="g_bg_dark">
		<div class="header_wrapper ibrb" id="header-home-page2">
			<?php include('pag_header_settings.php');?>
		</div>
		<div class="header_wrapper ibrb" id="header-wizard-page">
			<?php include('pag_header_wizard.php');?>
		</div>
		<div class="header_wrapper ibrb" id="header-home-page">
			<?php include('pag_header_home.php');?>
		</div>
	</div>
	<div id="gui_body" class="g_bg_dark">
		<div class="body_wrapper" id="main-page" style="display:none;">
			<?php include('pag_structure_a_bc_d.php');?>
			<?php include('pag_structure_abcd.php');?>
			<?php include('pag_structure_ad_bc.php');?>
		</div>
		<div class="body_wrapper" id="settings-page" style="display:none;">
			<?php include('pag_structure_abcd.php');?>
		</div>
		<div class="body_wrapper" id="test-page" style="display:none;">
			<?php include('pag_structure_abcd.php');?>
		</div>
		<div class="body_wrapper" id="side-menu" style="display:none;">
		</div>
		<div class="body_wrapper" id="seeking-page" style="display:none;">
			<?php include('pag_structure_abcd.php');?>
		</div>
		<div class="body_wrapper" id="scheduler-page" style="display:none;">
			<?php include('pag_structure_abcd.php');?>
		</div>
	</div>
	<div id="gui_footer" class="g_bg_dark">
		<div class="footer_wrapper" id="footer-home-page" style="display: none;"></div>
		<div class="footer_wrapper" id="footer-home-page2" style="display: none;"></div>
		<div id="footer-wizard-page" style="background-color: black;"></div>
	</div>
	<div class="JSdialog" id="JSdialog"></div>
	<div class="JSdialog2"></div>
	<div class="JSwait"></div>
	<div class="JScover unavailableMode1 unavailable"></div>
	<div class="JSstdby"></div>
	<div id="JStoast" class="bg_red_gr"></div>
</div>