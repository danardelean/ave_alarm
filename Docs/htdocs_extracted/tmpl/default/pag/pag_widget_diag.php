<?php include("private/php/param.php"); ?>
<div class="widget_diag" data-identifier="<?php echo $diag_identifier; ?>" data-title="<?php echo $diag_title; ?>" data-container="<?php echo $diag_container; ?>" data-extra="<?php echo $diag_extra; ?>" data-widget="<?php echo $diag_widget; ?>" data-item-name="<?php echo $item_name; ?>">
	<div class="header_diag">
		<p class="title" id="title_diag">{LANG_WIZARD_REGION_TITLE}</p>
		<div class="all_tick" id="wd_tick">
			<div class="switcher off wd_tick" data-checked="0">
				<p class="button_text c_dark on">{LANG_YES}</p>
				<p class="button_text c_dark off">{LANG_NO}</p>
				<div class="button_dot g_bg_dark"></div>
				<div class="active_area"></div>
			</div>
		</div>
	</div>
	<div class="container_diag scrollableContainer autoScroll" id="container_diag">
		<div class="phantom_entire scrollableSize"></div>
	</div>
	<div class="footer_diag">
		<div class="escape" id="escape_diag">
			<div class="escape_btn_inside disableMode2 bg_red_gr"><span class="px-icon">{LANG_ESC}</span></div>
		</div>
		<div class="arrow_container" id="arrow_diag_cont">
			<div class="common_arrow left shift shift_up disableMode3" id="arrow_up"></div>
			<div class="common_arrow right shift shift_down disableMode3" id="arrow_down"></div>
		</div>
		<div class="ok" id="ok_diag">
			<div class="ok_diag_btn_inside disableMode2 disabled bg_red_gr"><span class="px-icon">{LANG_OK}</span></div>
		</div>
	</div>
</div>