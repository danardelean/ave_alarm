<?php include("private/php/param.php"); ?>
<div class="widget_test_device_detail" data-type="<?php echo $tdd_type; ?>" data-room="<?php echo $tdd_room; ?>" data-area="<?php echo $tdd_area; ?>" data-type-code="<?php echo $tdd_type_code; ?>" data-dev-id="<?php echo $tdd_dev_id; ?>" data-dev-name="<?php echo $tdd_name; ?>">
	<div class="global_items_container scrollableContainer autoScrollPad" id="container_test_device_detail">
		<div class="entire row_1" id="TD_nogui">
			<div class="quadrant ad">
				<div class="info_dev">
					<p class='name'></p>
					<p class='type'>{LANG_WIZARD_ADD_DEVICE_TYPE}&#58;&#32;</p>
					<p class='room'>{LANG_WIZARD_ADD_DEVICE_ROOM}&#58;&#32;</p>
					<p class='area'>{LANG_WIZARD_ADD_DEVICE_AREA}&#58;&#32;</p>
				</div>
			</div>
			<div class="quadrant bc">
				<div class="btn top"></div>
				<div class="btn middle"></div>
				<div class="btn bottom"></div>
			</div>
		</div>
		<div class="entire row_1" id="TD_sir">
			<div class="quadrant ad">
				<div class="info_dev">
					<p class='name'></p>
					<p class='type'>{LANG_WIZARD_ADD_DEVICE_TYPE}&#58;&#32;</p>
					<p class='room'>{LANG_WIZARD_ADD_DEVICE_ROOM}&#58;&#32;</p>
					<p class='area'>{LANG_WIZARD_ADD_DEVICE_AREA}&#58;&#32;</p>
				</div>
			</div>
			<div class="quadrant bc">
				<div class="btn top">
					<div class="info">
						{LANG_TEST_SIREN_S}
					</div>
					<div class="start a">
						{LANG_START}
					</div>
					<div class="stop a">
						{LANG_STOP}
					</div>
				</div>
				<div class="btn middle">
					<div class="info">
						{LANG_TEST_SIREN_V1}
					</div>
					<div class="start b">
						{LANG_START}
					</div>
					<div class="stop b">
						{LANG_STOP}
					</div>
				</div>
				<div class="btn bottom">
					<div class="info">
						{LANG_TEST_SIREN_V2}
					</div>
					<div class="start c">
						{LANG_START}
					</div>
					<div class="stop c">
						{LANG_STOP}
					</div>
				</div>
			</div>
		</div>
		<div class="entire row_1" id="TD_gsm">
			<div class="quadrant ad">
				<div class="info_dev">
					<p class='name'></p>
					<p class='type'>{LANG_WIZARD_ADD_DEVICE_TYPE}&#58;&#32;</p>
					<p class='room'>{LANG_WIZARD_ADD_DEVICE_ROOM}&#58;&#32;</p>
					<p class='area'>{LANG_WIZARD_ADD_DEVICE_AREA}&#58;&#32;</p>
				</div>
			</div>
			<div class="quadrant bc">
				<div class="btn one scrollableSize">
					<div class="insert a">
						{LANG_TEST_GSM_V}
					</div>
				</div>
				<div class="btn two">
					<div class="insert b">
						{LANG_TEST_GSM_SMS}
					</div>
				</div>
				<div class="btn three">
					<div class="insert c disabled" data-id="1">
						{LANG_TEST_GSM_D1}
					</div>
				</div>
				<div class="btn four">
					<div class="insert d disabled" data-id="2">
						{LANG_TEST_GSM_D2}
					</div>
				</div>
				<div class="btn five">
					<div class="insert e disabled" data-id="3">
						{LANG_TEST_GSM_S1}
					</div>
				</div>
				<div class="btn six">
					<div class="insert f disabled" data-id="4">
						{LANG_TEST_GSM_S2}
					</div>
				</div>
				<div class="btn seven">
					<div class="insert g">
						{LANG_TEST_GSM_E}
					</div>
				</div>
			</div>
		</div>
		<div class="entire row_1" id="TD_pstn">
			<div class="quadrant ad">
				<div class="info_dev">
					<p class='name'></p>
					<p class='type'>{LANG_WIZARD_ADD_DEVICE_TYPE}&#58;&#32;</p>
					<p class='room'>{LANG_WIZARD_ADD_DEVICE_ROOM}&#58;&#32;</p>
					<p class='area'>{LANG_WIZARD_ADD_DEVICE_AREA}&#58;&#32;</p>
				</div>
			</div>
			<div class="quadrant bc">
				<div class="btn top">
					<div class="insert tris a">
						{LANG_TEST_PSTN_V}
					</div>
				</div>
				<div class="btn middle">
					<div class="insert tris b disabled" data-id="1">
						{LANG_TEST_PSTN_D1}
					</div>
				</div>
				<div class="btn bottom">
					<div class="insert tris c disabled" data-id="2">
						{LANG_TEST_PSTN_D2}
					</div>
				</div>
			</div>	
		</div>
		<div class="entire row_1" id="TD_wifi">
			<div class="quadrant ad">
				<div class="info_dev">
					<p class='name'></p>
					<p class='type'>{LANG_WIZARD_ADD_DEVICE_TYPE}&#58;&#32;</p>
					<p class='room'>{LANG_WIZARD_ADD_DEVICE_ROOM}&#58;&#32;</p>
					<p class='area'>{LANG_WIZARD_ADD_DEVICE_AREA}&#58;&#32;</p>
				</div>
			</div>
			<div class="quadrant bc">
				<div class="btn top">
					<div class="insert tris a disabled" data-id="3">
						{LANG_TEST_WIFI_S1}
					</div>
				</div>
				<div class="btn middle">
					<div class="insert tris b disabled" data-id="4">
						{LANG_TEST_WIFI_S2}
					</div>
				</div>
				<div class="btn bottom">
					<div class="insert tris c">
						{LANG_TEST_WIFI_E}
					</div>
				</div>
			</div>		
		</div>
		<div class="entire row_1" id="TD_relay">
			<div class="quadrant ad">
				<div class="info_dev">
					<p class='name'></p>
					<p class='type'>{LANG_WIZARD_ADD_DEVICE_TYPE}&#58;&#32;</p>
					<p class='room'>{LANG_WIZARD_ADD_DEVICE_ROOM}&#58;&#32;</p>
					<p class='area'>{LANG_WIZARD_ADD_DEVICE_AREA}&#58;&#32;</p>
				</div>
			</div>
			<div class="quadrant bc one">
				<div class="btn up">
					<div class="insert a">
						{LANG_ON}
					</div>
				</div>
				<div class="btn down">
					<div class="insert c">
						{LANG_OFF}
					</div>
				</div>
			</div>
			<div class="quadrant bc two">
				<div class="btn top">
					<div class="insert tris a">
						{LANG_UP}
					</div>
				</div>
				<div class="btn middle">
					<div class="insert tris b">
						{LANG_STOP}
					</div>
				</div>
				<div class="btn bottom">
					<div class="insert tris c">
						{LANG_DOWN}
					</div>
				</div>
			</div>
		</div>
		<div class="entire row_1" id="TD_tvcc">
			<div class="quadrant ad">
				<div class="info_dev">
					<p class='name'></p>
					<p class='type'>{LANG_WIZARD_ADD_DEVICE_TYPE}&#58;&#32;</p>
					<p class='room'>{LANG_WIZARD_ADD_DEVICE_ROOM}&#58;&#32;</p>
					<p class='area'>{LANG_WIZARD_ADD_DEVICE_AREA}&#58;&#32;</p>
				</div>
			</div>
			<div class="quadrant bc">
				<div class="visual"></div>
				<div class="get_frame"></div>
			</div>
		</div>
	</div>
</div>