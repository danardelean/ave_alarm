<div class="widget_mod_device widget_mod_device_gsm">
	<div class="global_items_container scrollableContainer autoScrollPad" id="container_gsm">
		<div class="phantom_entire scrollableSize"></div>
		<div class="entire row_1">
			<div class="global_item row_1 full">
				<div class="wrap_tag"><p class="item_tag">{LANG_NAME}</p></div>
				<input type="text" class="item_input undecies name"/>
			</div>
			<div class="global_item row_2 left">
				<div class="wrap_tag"><p class="item_tag">{LANG_SIM_PRESENT}</p></div>
				<input type="text" class="item_input pin" data-kbd="09"/>
			</div>
			<div class="global_item row_2 right">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_DEVICE_SERIALNO}</p></div>
				<p class="item_value serial"/>
			</div>
			<div class="global_item row_3 left">
				<div class="wrap_tag"><p class="item_tag">{LANG_PHONE_OPERATOR}</p></div>
				<p class="item_value ope"/>
			</div>
			<div class="global_item row_3 right slot_picker simexp">	
				<div class="side text">
				<div class="wrap_tag"><p class="item_tag">{LANG_COMM_SIMEXP}</p></div>
					</div>
					<div class="side arrow left"><p>_</p>
					</div>
					<div class="side value"><p data-lbound="0" data-rbound="99" data-speed="100" class="pick_simexp">x</p>
					</div>
					<div class="side arrow right"><p>+</p>
				</div>
			</div>
			<div class="global_item row_4 left">
				<div class="wrap_tag"><p class="item_tag">{LANG_REQ_CREDIT_CASE}</p></div>
				<input type="text" class="item_input credit"/>
			</div>
			<div class="global_item row_4 right">
				<div class="wrap_tag"><p class="item_tag">{LANG_OPERATOR_NUMBER}</p></div>
				<input type="text" class="item_input prov" data-kbd="TEL"/>
			</div>
			<div class="global_item row_5 left scrollableSize">
				<div class="wrap_tag"><p class="item_tag">{LANG_IP_SERVER}</p></div>
				<input type="text" class="item_input ip" data-kbd="IP"/>
			</div>
			<div class="global_item row_5 right">
				<div class="wrap_tag"><p class="item_tag">{LANG_COMM_APN}</p></div>
				<input type="text" class="item_input apn"/>
			</div>
			<div class="global_item row_6 left">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_PARCONN_USER}</p></div>
				<input type="text" class="item_input user"/>
			</div>
			<div class="global_item row_6 right">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_PARCONN_PASS}</p></div>
				<input type="password" class="item_input pwd" data-kbd="FREE"/>
			</div>
			<div class="global_item row_7 full slot_picker gsm_vol_msg">
				<div class="side text">
					<div class="wrap_tag"><p class="item_tag">{LANG_VOC_VOL}</p></div>
				</div>
				<div class="side arrow left"><p>_</p>
				</div>
				<div class="side value"><p data-lbound="1" data-rbound="4" class="pick_gsm_vol_msg">x</p>
				</div>
				<div class="side arrow right"><p>+</p>
				</div>
			</div>
			<div class="global_item row_8 left">
				<div class="wrap_tag"><p class="item_tag">{LANG_MOBILE_DATA}</p></div>
				<div class="switcher off disableMode3 data_ena_flg" data-checked="0">
					<p class="button_text c_dark on">{LANG_YES}</p>
					<p class="button_text c_dark off">{LANG_NO}</p>
					<div class="button_dot g_bg_dark"></div>
					<div class="active_area"></div>
				</div>
			</div>
			<div class="global_item row_8 right">
				<div class="wrap_tag"><p class="item_tag">{LANG_DATA_ONLY}</p></div>
				<div class="switcher off disableMode3 data_sms_only_flg" data-checked="0">
					<p class="button_text c_dark on">{LANG_YES}</p>
					<p class="button_text c_dark off">{LANG_NO}</p>
					<div class="button_dot g_bg_dark"></div>
					<div class="active_area"></div>
				</div>
			</div>
			<div class="global_item row_9 full">
				<div class="wrap_tag"><p class="item_tag">{LANG_FIRMWARE_VERSION}</p></div>
				<p class="item_value firmware_version"></p>
			</div>
		</div>
	</div>
</div>