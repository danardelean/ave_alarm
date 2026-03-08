<?php include("private/php/param.php"); ?>
<div class="widget_device" data-info="<?php echo $info; ?>">
	<div class="global_items_container scrollableContainer autoScrollPad">
		<div class="phantom_entire scrollableSize"></div>
		<div class="global_item row_1 full img" id="device_item_img">
			<!--div class="f_img"></div-->
		</div>
		<div class="global_item row_5 full scrollableSize desc code" id="device_item_code">
			<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_DEVICE_CODE}</p></div>
			<p class="item_value">DCODE</p>
		</div>
		<div class="global_item row_6 full desc number" id="device_item_number">
			<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_DEVICE_NUMBER}</p></div>
			<p class="item_value">X</p>
		</div>
		<div class="global_item row_7 full desc type" id="device_item_type">
			<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_DEVICE_TYPE}</p></div>
			<p class="item_value">EMPTY</p>
		</div>
		<div class="global_item row_8 full desc info" id="device_item_desc_info">
			<p></p>
		</div>
	</div>
</div>