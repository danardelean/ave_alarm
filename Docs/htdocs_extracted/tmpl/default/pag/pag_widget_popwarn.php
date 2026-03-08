<?php include("private/php/param.php"); ?>
<div class="widget_popwarn bg_bla" data-titlep="<?php echo $pw_title; ?>" data-message="<?php echo $pw_message; ?>" data-cmd="<?php echo $pw_footer; ?>" data-exf="<?php echo $pw_exf; ?>" data-extra="<?php echo $pw_extra; ?>" data-okAbortStr="<?php echo $pw_okAbortStr; ?>">
	<div class="popwarn_header">
		<p class="title" id="popwarn_title"></p>
		<div class="icon" id="popwarn_icon"></div>
	</div>
	<div class="popwarn_body">
		<div class="new_message_wrap" id="popwarn_new_message_wrap">
			<div class="new_message" id="popwarn_new_message"></div>
		</div>
		<p class="message" id="popwarn_message"></p>
		<input type="text" class="pw_input" id="popwarn_input"/>
		<div class="pw_bar" id="pw_bar">
			<canvas id="move_bar" width="360px" height="40px"></canvas>
		</div>
	</div>
	<div class="popwarn_footer">
		<div class="popwarn_abort" id="popwarn_abort">
			<div class="abort_popwarn_btn_inside disableMode2 bg_red_gr"><span class="px-icon">{LANG_ABORT}</span></div>
		</div>
		<div class="popwarn_ok" id="popwarn_ok">
			<div class="ok_popwarn_btn_inside disableMode2 bg_red_gr"><span class="px-icon">{LANG_OK}</span></div>
		</div>
		<div class="popwarn_ok2" id="popwarn_ok2">
			<div class="ok_popwarn_btn_inside disableMode2 bg_red_gr"><span class="px-icon">{LANG_OK}</span></div>
		</div>
		<div class="popwarn_abort2" id="popwarn_abort2">
			<div class="abort_popwarn_btn_inside disableMode2 bg_red_gr"><span class="px-icon">{LANG_ABORT}</span></div>
		</div>
	</div>
</div>