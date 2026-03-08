<?php include("private/php/param.php"); ?>
<div class="widget_mod_user" data-user-index="<?php echo $u_index; ?>">
	<div class="global_items_container scrollableContainer autoScrollPad" id="container_mod_user">
		<div class="phantom_entire scrollableSize"></div>
		<div class="entire row_1">
			<div class="global_item row_1 full">
				<div class="wrap_tag"><p class="item_tag">{LANG_NAME}</p></div>
				<input type="text" class="item_input quinquies name"/>
			</div>
			<div class="global_item row_2 full area_ins">
				<div class="selector_container">
					<div class="wrap_tag"><p class="tt_selector">{LANG_TOTAL_AREA_INS}</p></div>
					<p class="sl_selector"></p>
					<div class="active_click"></div>
				</div>
			</div>
			<div class="global_item row_3 full area_dis">
				<div class="selector_container">
					<div class="wrap_tag"><p class="tt_selector">{LANG_TOTAL_AREA_DIS}</p></div>
					<p class="sl_selector"></p>
					<div class="active_click"></div>
				</div>
			</div>
			<div class="global_item row_4 full area_insp">
				<div class="selector_container">
					<div class="wrap_tag"><p class="tt_selector">{LANG_PARTIAL_AREA_INS}</p></div>
					<p class="sl_selector"></p>
					<div class="active_click"></div>
				</div>
			</div>
			<div class="global_item scrollableSize row_5 left">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_USER_ENABLED}</p></div>
				<div class="switcher off disableMode3 ena" data-checked="0">
					<p class="button_text c_dark on">{LANG_YES}</p>
					<p class="button_text c_dark off">{LANG_NO}</p>
					<div class="button_dot g_bg_dark"></div>
					<div class="active_area"></div>
				</div>
			</div>
			<div class="global_item row_5 right">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_ADD_USER2_PIN}</p></div>
				<input type="text" class="item_input pass" id="mod_user_item_pass" data-kbd="PIN"/>
			</div>
			<div class="global_item row_6 left">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_MOD_USER_PHONE}</p></div>
				<input type="text" class="item_input phone" id="mod_user_item_phone" data-kbd="TEL"/>
			</div>
			<div class="global_item row_6 right">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_MOD_USER_DIRECT}</p></div>
				<div class="switcher off disableMode3 direct" data-checked="0">
					<p class="button_text c_dark on">{LANG_YES}</p>
					<p class="button_text c_dark off">{LANG_NO}</p>
					<div class="button_dot g_bg_dark"></div>
					<div class="active_area"></div>
				</div>
			</div>
			<div class="global_item row_7 left events" data-evetype="sms">
				<div class="selector_container">
					<div class="wrap_tag"><p class="tt_selector">{LANG_WIZARD_MOD_USER_SMS}</p></div>
					<p class="sl_selector"></p>
					<div class="active_click"></div>
				</div>
			</div>
			<div class="global_item row_7 right events" data-evetype="vox">
				<div class="selector_container">
					<div class="wrap_tag"><p class="tt_selector">{LANG_WIZARD_MOD_USER_VOX}</p></div>
					<p class="sl_selector"></p>
					<div class="active_click"></div>
				</div>
			</div>
			<div class="global_item row_8 left">
				<div class="wrap_tag"><p class="item_tag">{LANG_ENABLE_EMAIL_USER}</p></div>
				<div class="switcher off disableMode3 email" data-checked="0">
					<p class="button_text c_dark on">{LANG_YES}</p>
					<p class="button_text c_dark off">{LANG_NO}</p>
					<div class="button_dot g_bg_dark"></div>
					<div class="active_area"></div>
				</div>
			</div>
			<div class="global_item row_8 right">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_MOD_USER_EMAIL}</p></div>
				<input type="text" class="item_input email_txt" id="mod_user_item_email"/>
			</div>
			<div class="global_item row_9 left tslot">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_MOD_USER_TSLOT_ENA} 1</p></div>
				<div class="switcher off disableMode3 tslot_ena" id="tse0" data-checked="0">
					<p class="button_text c_dark on">{LANG_YES}</p>
					<p class="button_text c_dark off">{LANG_NO}</p>
					<div class="button_dot g_bg_dark"></div>
					<div class="active_area"></div>
				</div>
			</div>
			<div class="global_item row_9 right tslot">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_MOD_USER_TSLOT_ENA} 2</p></div>
				<div class="switcher off disableMode3 tslot_ena" id="tse1" data-checked="0">
					<p class="button_text c_dark on">{LANG_YES}</p>
					<p class="button_text c_dark off">{LANG_NO}</p>
					<div class="button_dot g_bg_dark"></div>
					<div class="active_area"></div>
				</div>
			</div>
			<div class="global_item row_10 left tslot">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_MOD_USER_TSLOT_ENA} 3</p></div>
				<div class="switcher off disableMode3 tslot_ena" id="tse2" data-checked="0">
					<p class="button_text c_dark on">{LANG_YES}</p>
					<p class="button_text c_dark off">{LANG_NO}</p>
					<div class="button_dot g_bg_dark"></div>
					<div class="active_area"></div>
				</div>
			</div>
			<div class="global_item row_10 right tslot">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_MOD_USER_TSLOT_ENA} 4</p></div>
				<div class="switcher off disableMode3 tslot_ena" id="tse3" data-checked="0">
					<p class="button_text c_dark on">{LANG_YES}</p>
					<p class="button_text c_dark off">{LANG_NO}</p>
					<div class="button_dot g_bg_dark"></div>
					<div class="active_area"></div>
				</div>
			</div>
			<div class="global_item row_11 left tslot">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_MOD_USER_TSLOT_ENA} 5</p></div>
				<div class="switcher off disableMode3 tslot_ena" id="tse4" data-checked="0">
					<p class="button_text c_dark on">{LANG_YES}</p>
					<p class="button_text c_dark off">{LANG_NO}</p>
					<div class="button_dot g_bg_dark"></div>
					<div class="active_area"></div>
				</div>
			</div>
			<div class="global_item row_11 right tslot">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_MOD_USER_TSLOT_ENA} 6</p></div>
				<div class="switcher off disableMode3 tslot_ena" id="tse5" data-checked="0">
					<p class="button_text c_dark on">{LANG_YES}</p>
					<p class="button_text c_dark off">{LANG_NO}</p>
					<div class="button_dot g_bg_dark"></div>
					<div class="active_area"></div>
				</div>
			</div>
			<div class="global_item row_12 left tslot">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_MOD_USER_TSLOT_ENA} 7</p></div>
				<div class="switcher off disableMode3 tslot_ena" id="tse6" data-checked="0">
					<p class="button_text c_dark on">{LANG_YES}</p>
					<p class="button_text c_dark off">{LANG_NO}</p>
					<div class="button_dot g_bg_dark"></div>
					<div class="active_area"></div>
				</div>
			</div>
			<div class="global_item row_12 right tslot">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_MOD_USER_TSLOT_ENA} 8</p></div>
				<div class="switcher off disableMode3 tslot_ena" id="tse7" data-checked="0">
					<p class="button_text c_dark on">{LANG_YES}</p>
					<p class="button_text c_dark off">{LANG_NO}</p>
					<div class="button_dot g_bg_dark"></div>
					<div class="active_area"></div>
				</div>
			</div>
			<div class="global_item row_13 left tslot">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_MOD_USER_TSLOT_ENA} 9</p></div>
				<div class="switcher off disableMode3 tslot_ena" id="tse8" data-checked="0">
					<p class="button_text c_dark on">{LANG_YES}</p>
					<p class="button_text c_dark off">{LANG_NO}</p>
					<div class="button_dot g_bg_dark"></div>
					<div class="active_area"></div>
				</div>
			</div>
			<div class="global_item row_13 right tslot">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_MOD_USER_TSLOT_ENA} 10</p></div>
				<div class="switcher off disableMode3 tslot_ena" id="tse9" data-checked="0">
					<p class="button_text c_dark on">{LANG_YES}</p>
					<p class="button_text c_dark off">{LANG_NO}</p>
					<div class="button_dot g_bg_dark"></div>
					<div class="active_area"></div>
				</div>
			</div>
		</div>
	</div>
</div>