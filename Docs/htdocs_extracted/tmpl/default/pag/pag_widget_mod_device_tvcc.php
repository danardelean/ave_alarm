<?php include("private/php/param.php"); ?>
<div class="widget_mod_device widget_mod_device_tvcc" data-context="<?php echo $context; ?>">
	<div class="global_items_container scrollableContainer autoScrollPad" id="container_tvcc">
		<div class="phantom_entire scrollableSize"></div>
		<div class="entire row_1">
			<div class="global_item row_1 full scrollableSize">
				<div class="wrap_tag"><p class="item_tag">{LANG_DEVICE_NAME}</p></div>
				<input type="text" class="item_input undecies name" value=""/>
			</div>
			<div class="global_item row_2 full room">
				<div class="selector_container">
					<div class="wrap_tag"><p class="tt_selector">{LANG_WIZARD_SET_DEVICE_ROOM_SELECTOR}</p></div>
					<p class="sl_selector"></p>
					<div class="active_click"></div>
				</div>
			</div>
			<div class="global_item row_3 left">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_PARCONN_USER}</p></div>
				<input type="text" class="item_input user" value=""/>
			</div>
			<div class="global_item row_3 right">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_PARCONN_PASS}</p></div>
				<input type="text" class="item_input pass" value=""/>
			</div>
			<div class="global_item row_4 full">
				<div class="wrap_tag"><p class="item_tag">{LANG_LINK_ADDRESS}</p></div>
				<input type="text" class="item_input undecies tvcc_path" placeholder="{LANG_WIZARD_MOD_DEVICE_PLACEHOLDER_PATH_TVCC}"/>
			</div>
			<div class="global_item row_5 full ip_address_mode_flg">
				<div class="selector_container">
					<div class="wrap_tag"><p class="tt_selector">{LANG_TVCC_MAC_IP}</p></div>
					<p class="sl_selector"></p>
					<div class="active_click"></div>
				</div>
			</div>
			<div class="global_item row_6 full unavailableMode2">
				<div class="wrap_tag"><p class="item_tag">{LANG_ITEM_MAC_TVCC}</p></div>
				<input type="text" class="item_input undecies tvcc_mac" data-kbd="HEX" maxlength="17" placeholder="{LANG_WIZARD_MOD_DEVICE_PLACEHOLDER_MAC_TVCC}"/>
			</div>
			<div class="global_item row_6 full unavailableMode2">
				<div class="wrap_tag"><p class="item_tag">{LANG_TVCC_IP}</p></div>
				<input type="text" class="item_input undecies tvcc_ip" data-kbd="IP" maxlength="15" placeholder="{LANG_TVCC_IP}"/>
			</div>
			<div class="global_item h179 row_7 right visual">
				<div class="info c_wsmt"></div>
				<div class="get_frame" id="get_frame"></div>
			</div>
			<div class="global_item row_7 left">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_PARCONN_TCP_PORT}</p></div>
				<input type="text" class="item_input tvcc_port" data-kbd="09" value=""/>
			</div>
			<div class="global_item row_8 left slot_picker photo">
					<div class="side text">
						<div class="wrap_tag"><p class="item_tag">{LANG_TIME_FRAME}</p></div>
					</div>
					<div class="side arrow left"><p>_</p>
					</div>
					<div class="side value"><p data-lbound="1" data-rbound="5" class="pick_photo">-1</p>
					</div>
					<div class="side arrow right"><p>+</p>
					</div>
				</div>
			<div class="global_item row_9 left slot_picker frame">
					<div class="side text">
						<div class="wrap_tag"><p class="item_tag">{LANG_FRAME}</p></div>
					</div>
					<div class="side arrow left"><p>_</p>
					</div>
					<div class="side value"><p data-lbound="1" data-rbound="5" class="pick_frame">-1</p>
					</div>
					<div class="side arrow right"><p>+</p>
					</div>
			</div>
		</div>
	</div>
</div>