<?php include("private/php/param.php"); ?>
<div class="widget_cmd_device widget_thermostat_device" id="widget_thermostat_device" data-scenery-mode="<?php echo $scen_mode; ?>" data-devid="<?php echo $devid; ?>" data-name-device="<?php echo $name_device; ?>" data-subcat="<?php echo $subcat; ?>" data-selected="<?php echo $selected; ?>" data-idx="<?php echo $idx; ?>" data-xml-any-tbl-idx="<?php echo $xml_any_tbl_idx; ?>">
	<div class="global_items_container scrollableContainer autoScrollPad" id="container_thermostat_device">
		<div class="entire row_1">
			<div class="global_item_dyn h62 full slot_picker temp_wint" style="width: 98% !important;">
				<div class="side text">
					<div class="wrap_tag"><p class="item_tag">{LANG_THERMO_TEMP_WINTER}</p></div>
				</div>
				<div class="side arrow left"><p>_</p>
				</div>
				<div class="side value"><p class="pick_temp_wint" id="pick_temp_wint">-1</p>
				</div>
				<div class="side arrow right"><p>+</p>
				</div>
			</div>
			<div class="global_item_dyn h62 full slot_picker temp_summ" style="width: 98% !important;">
				<div class="side text">
					<div class="wrap_tag"><p class="item_tag">{LANG_THERMO_TEMP_SUMMER}</p></div>
				</div>
				<div class="side arrow left"><p>_</p>
				</div>
				<div class="side value"><p class="pick_temp_summ" id="pick_temp_summ">-1</p>
				</div>
				<div class="side arrow right"><p>+</p>
				</div>
			</div>
		</div>
	</div>
</div>