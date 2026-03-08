<?php include("private/php/param.php"); ?>
<div class="widget_confirm" id="widget_confirm" data-delay="<?php if (SIMUL) echo 2; else echo 3; ?>" data-redirect="<?php echo $redirect; ?>" data-type="<?php echo $type; ?>" data-name="<?php echo $name; ?>">
	<div class="confirm_container" id="confirm_container">
		<span id="widget_confirm_type"></span>
		<span id="widget_confirm_name"></span>
		<span id="widget_confirm_added">{LANG_WIZARD_MOD_DEVICE_CONFIRM_ADDED}</span>
	</div>
</div>