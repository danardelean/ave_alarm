<?php include("private/php/param.php"); ?>
<div class="widget_add_scenery" data-scene-id="<?php echo $scene_id; ?>" data-mode="<?php echo $mode; ?>" data-shortcut-mode="<?php echo $shortcut_mode; ?>">
	<div class="global_items_container scrollableContainer autoScrollPad" id="container_scenery">
		<div class="phantom_entire scrollableSize"></div>
		<div class="entire row_1">
			<div class="global_item row_1 full">
				<div class="wrap_tag"><p class="item_tag">{LANG_SCENARIO_NAME}</p></div>
				<input type="text" class="item_input name" value="" id='scenery_name'/>
			</div>
			<div class="global_item brt row_2 full">
				<div class="wrap_tag"><p class="item_tag">{LANG_TIMER}</p></div>
				<div class="switcher off disableMode3 date" data-checked="0" id="date_sw">
					<p class="button_text c_dark on">{LANG_YES}</p>
					<p class="button_text c_dark off">{LANG_NO}</p>
					<div class="button_dot g_bg_dark"></div>
					<div class="active_area"></div>
				</div>
			</div>
			<div class="global_item row_3 h119 full date">
					<div class="days_week c_clear week" data-val="Wk" data-checked="0">{LANG_WEEK}</div>
					<div class="days_week c_clear mon" data-val="Mo" data-checked="0">{LANG_MONDAY}</div>
					<div class="days_week c_clear tue" data-val="Tu" data-checked="0">{LANG_TUESDAY}</div>
					<div class="days_week c_clear wed" data-val="We" data-checked="0">{LANG_WEDNESDAY}</div>
					<div class="days_week c_clear thu" data-val="Th" data-checked="0">{LANG_THURSDAY}</div>
					<div class="days_week c_clear fry" data-val="Fr" data-checked="0">{LANG_FRIDAY}</div>
					<div class="days_week c_clear sat" data-val="Sa" data-checked="0">{LANG_SATURDAY}</div>
					<div class="days_week c_clear sun" data-val="Su" data-checked="0">{LANG_SUNDAY}</div>
			</div>
			<div class="global_item row_5 full slot_picker hours disabled">
				<div class="ampm">
					<p class="am">{LANG_AM}</p>
					<p class="pm">{LANG_PM}</p>
				</div>
				<div class="side text">
					<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_DTPICKER_HOUR}</p></div>
				</div>
				<div class="side arrow left"><p>_</p>
				</div>
				<div class="side value"><p data-lbound="0" data-rbound="23" data-digit="2" class="pick_hours">-1</p>
				</div>
				<div class="side arrow right"><p>+</p>
				</div>
			</div>
			<div class="global_item row_6 full slot_picker minutes disabled">
				<div class="side text">
					<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_DTPICKER_MINUTE}</p></div>
				</div>
				<div class="side arrow left"><p>_</p>
				</div>
				<div class="side value"><p data-lbound="0" data-rbound="59" data-digit="2" class="pick_minutes">-1</p>
				</div>
				<div class="side arrow right"><p>+</p>
				</div>
			</div>
			<div class="global_item brt row_7 full">
				<div class="wrap_tag"><p class="item_tag">{LANG_ENABLE_ACTIVE_IF}</p></div>
				<div class="switcher off disableMode3 active_if_sw" data-checked="0" id="active_if_sw">
					<p class="button_text c_dark on">{LANG_YES}</p>
					<p class="button_text c_dark off">{LANG_NO}</p>
					<div class="button_dot g_bg_dark"></div>
					<div class="active_area"></div>
				</div>
			</div>
			<div class="global_item row_8 full active_if_sel disabled">
				<div class="selector_container">
					<div class="wrap_tag"><p class="tt_selector">{LANG_ACTIVE_IF}</p></div>
					<p class="sl_selector"></p>
					<div class="active_click"></div>
				</div>
			</div>
			<div class="global_item brt row_9 full" id="sceAction">
				<p class="bottom_comand">{LANG_ACTIONS}</p>
			</div>
		</div>
	</div>
</div>