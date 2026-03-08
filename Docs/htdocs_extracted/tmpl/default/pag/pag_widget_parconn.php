<div class="widget_parconn">
    <!-- ------- -- ------- -->
	<!-- ------- CL ------- -->
	<!-- ------- -- ------- -->
	<div class="global_items_container scrollableContainer autoScrollPad" id="container_cl">
		<div class="phantom_entire scrollableSize"></div>
		<div id="wps_trigger" style="display: none;"></div>
		<div id="wps_trigger1" style="display: none;"></div>
		<div class="entire row_1">
			<div class="global_item row_1 left ssid">
				<div class="selector_container">
					<div class="wrap_tag"><p class="tt_selector">{LANG_WIZARD_PARCONN_SSID}</p></div>
					<p class="sl_selector web_client_ssid" id="web_client_ssid">{LANG_NAME_AP}</p>
					<div class="active_click"></div>
				</div>
			</div>
			<div class="global_item row_1 right">
				<div class="wrap_tag"><p class="item_tag">{LANG_ITEM_MAC}</p></div>
				<div class="wrap_tag"><p class="item_value_v mediumFont" id="cl_mac"></p></div>
			</div>
			<div class="global_item row_2 left auth">
				<div class="selector_container">
					<div class="wrap_tag"><p class="tt_selector">{LANG_WIZARD_PARCONN_AUTH}</p></div>
					<p class="sl_selector"></p>
					<div class="active_click"></div>
				</div>
			</div>
			<div class="global_item row_2 right">
				<div class="wrap_tag"><p class="item_tag">{LANG_WPASS}</p></div>
				<input class="item_input web_client_password" type="text" data-kbd="FREE" id="web_client_password"/>
			</div>
			<div class="global_item row_3 left region_conn">
				<div class="selector_container">
					<div class="wrap_tag"><p class="tt_selector">{LANG_REGION_ALL_CAPS}</p></div>
					<p class="sl_selector"></p>
					<div class="active_click"></div>
				</div>
			</div>
			<div class="global_item row_3 right phy_prot">
				<div class="wrap_tag"><p class="item_tag">{LANG_WPROT}</p></div>
				<p class="item_value mediumFont" id="cl_phy_prot"></p>
			</div>
			<div class="global_item row_4 left" id="cl_dhcp">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_PARCONN_DHCP}</p></div>
				<div class="switcher off cl_dhcp" data-checked="0">
					<p class="button_text c_dark on">{LANG_YES}</p>
					<p class="button_text c_dark off">{LANG_NO}</p>
					<div class="button_dot g_bg_dark"></div>
					<div class="active_area"></div>
				</div>
			</div>
			<div class="global_item row_4 right">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_PARCONN_IPCENTRAL}</p></div>
				<input class="item_input mediumFont" type="text" id="web_client_ip" data-kbd="IP"/>
			</div>
			<div class="global_item row_5 left">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_PARCONN_PRIMARY_DNS}</p></div>
				<input class="item_input mediumFont" type="text" id="web_dns1" data-kbd="IP"/>
			</div>
			<div class="global_item row_5 right">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_PARCONN_SUBNETMASK}</p></div>
				<input class="item_input mediumFont" type="text" id="web_client_netmask" data-kbd="IP"/>
			</div>
			<div class="global_item row_6 left">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_PARCONN_SECONDARY_DNS}</p></div>
				<input class="item_input mediumFont" type="text" id="web_dns2" data-kbd="IP"/>
			</div>
			<div class="global_item row_6 right">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_PARCONN_GATEWAY}</p></div>
				<input class="item_input mediumFont" type="text" id="web_client_gateway" data-kbd="IP"/>
			</div>
		</div>
	</div>
	<!-- ------- -- ------- -->
	<!-- ------- AP ------- -->
	<!-- ------- -- ------- -->
	<div class="global_items_container scrollableContainer autoScrollPad" id="container_ap">
		<div class="entire row_1">
			<div class="global_item row_1 left">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_PARCONN_SSID}</p></div>
				<input class="item_input ap_web_ssid" type="text" id="ap_web_ssid" placeholder="{LANG_NAME_AP}"/>
			</div>
			<div class="global_item row_1 right">
				<div class="wrap_tag"><p class="item_tag">{LANG_ITEM_MAC}</p></div>
				<div class="wrap_tag"><p class="item_value_v mediumFont" id="ap_mac"></p></div>
			</div>
			<div class="global_item row_2 left auth">
				<div class="selector_container">
					<div class="wrap_tag"><p class="tt_selector">{LANG_WIZARD_PARCONN_AUTH}</p></div>
					<p class="sl_selector"></p>
					<div class="active_click"></div>
				</div>
			</div>
			<div class="global_item row_2 right">
				<div class="wrap_tag"><p class="item_tag">{LANG_WPASS}</p></div>
				<input class="item_input ap_web_password" type="password" data-kbd="FREE" id="ap_web_password"/>
			</div>
			<div class="global_item row_3 left region_conn">
				<div class="selector_container">
					<div class="wrap_tag"><p class="tt_selector">{LANG_REGION_ALL_CAPS}</p></div>
					<p class="sl_selector"></p>
					<div class="active_click"></div>
				</div>
			</div>
			<div class="global_item row_3 right phy_prot">
				<div class="wrap_tag"><p class="item_tag">{LANG_WPROT}</p></div>
				<p class="item_value mediumFont" id="ap_phy_prot"></p>
			</div>
    		<div class="global_item row_4 left slot_picker ap_web_client_chan">
    			<div class="side text">
    				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_PARCONN_CHAN}</p></div>
    			</div>
    			<div class="side arrow left"><p>_</p>
    			</div>
    			<div class="side value"><p data-lbound="1" data-rbound="11" class="pick_ap_web_chan">-1</p>
    			</div>
    			<div class="side arrow right"><p>+</p>
    			</div>
    		</div>
    		<div class="global_item row_4 right" id="ap_dhcp">
    			<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_PARCONN_DHCP}</p></div>
    			<div class="switcher off ap_dhcp" data-checked="0">
					<p class="button_text c_dark on">{LANG_YES}</p>
					<p class="button_text c_dark off">{LANG_NO}</p>
					<div class="button_dot g_bg_dark"></div>
					<div class="active_area"></div>
				</div>
    		</div>
    		<div class="global_item row_5 left">
    			<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_PARCONN_IPCENTRAL}</p></div>
    			<input class="item_input mediumFont" type="text" id="ap_web_ip" data-kbd="IP"/>
    		</div>
    		<div class="global_item row_5 right">
    			<div class="wrap_tag"><p class="item_tag">{LANG_START_IP}</p></div>
    			<input class="item_input mediumFont" type="text" id="ap_web_ip_start" data-kbd="IP"/>
    		</div>
    		<div class="global_item row_6 left">
    			<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_PARCONN_SUBNETMASK}</p></div>
    			<input class="item_input mediumFont" type="text" id="ap_web_netmask" data-kbd="IP"/>
    		</div>
    		<div class="global_item row_6 right">
    			<div class="wrap_tag"><p class="item_tag">{LANG_END_IP}</p></div>
    			<input class="item_input mediumFont" type="text" id="ap_web_ip_end" data-kbd="IP"/>
    		</div>
    	</div>
	</div>
	<!-- ------- -- ------- -->
    <!-- ------- LN ------- -->
    <!-- ------- -- ------- -->
	<div class="global_items_container scrollableContainer autoScrollPad" id="container_ln">
		<div class="phantom_entire scrollableSize"></div>
		<div class="entire row_1">
			<div class="global_item row_1 left" id="ln_dhcp">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_PARCONN_DHCP}</p></div>
				<div class="switcher off ln_dhcp" data-checked="0">
					<p class="button_text c_dark on">{LANG_YES}</p>
					<p class="button_text c_dark off">{LANG_NO}</p>
					<div class="button_dot g_bg_dark"></div>
					<div class="active_area"></div>
				</div>
			</div>
			<div class="global_item row_1 right">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_PARCONN_IPCENTRAL}</p></div>
				<input class="item_input mediumFont" type="text" id="web_lan_ip" data-kbd="IP"/>
			</div>
			<div class="global_item row_2 left">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_PARCONN_PRIMARY_DNS}</p></div>
				<input class="item_input mediumFont" type="text" id="web_lan_dns1" data-kbd="IP"/>
			</div>
			<div class="global_item row_2 right">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_PARCONN_SUBNETMASK}</p></div>
				<input class="item_input mediumFont" type="text" id="web_lan_netmask" data-kbd="IP"/>
			</div>
			<div class="global_item row_3 left">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_PARCONN_SECONDARY_DNS}</p></div>
				<input class="item_input mediumFont" type="text" id="web_lan_dns2" data-kbd="IP"/>
			</div>
			<div class="global_item row_3 right">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_PARCONN_GATEWAY}</p></div>
				<input class="item_input mediumFont" type="text" id="web_lan_gateway" data-kbd="IP"/>
			</div>
			<div class="global_item row_4 full">
				<div class="wrap_tag"><p class="item_tag">{LANG_ITEM_MAC}</p></div>
				<div class="wrap_tag"><p class="item_value_v mediumFont" id="ln_mac"></p></div>
			</div>
		</div>
	</div>
</div>