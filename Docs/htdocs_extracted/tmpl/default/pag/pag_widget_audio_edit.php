<?php include("private/php/param.php"); ?>
<div class="widget_audio_edit bg_bla" id="widget_audio_edit" data-id="<?php echo $audio_id; ?>" data-present="<?php echo $audio_present; ?>" data-sec="<?php echo $audio_sec; ?>" data-title="<?php echo $audio_name; ?>">
	<div class="audio_edit_header">
		<p class="title" id="audio_edit_title"></p>
		<p class="error" id="audio_error"></p>
	</div>
	<div class="audio_edit_body">
		<p class="desc">{LANG_READ_LABEL}</p>
		<div class="audio_edit_cmd">
			<div class="rec" data-checked="1"></div>
			<div class="stop" data-checked="1"></div>
			<div class="play" data-checked="1"></div>
		</div>
		<p class="sec">00:00</p>
	</div>
	<div class="audio_edit_footer" id="audio_edit_ok">
		<div>
			<div class="ok_audio_edit disableMode2 bg_red_gr"><span class="px-icon">{LANG_OK}</span></div>
		</div>
	</div>
</div>