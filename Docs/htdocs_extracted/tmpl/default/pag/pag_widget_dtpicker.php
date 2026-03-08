<div class="widget_dtpicker">
	<div class="global_items_container scrollableContainer autoScrollPad" id="container_dtpicker">
		<div class="phantom_entire scrollableSize"></div>
		<div class="global_item row_1 full slot_picker day">
			<div class="side text">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_DTPICKER_DAY}</p></div>
			</div>
			<div class="side arrow left"><p>_</p>
			</div>
			<div class="side value"><p id="day_p">1</p>
			</div>
			<div class="side arrow right"><p>+</p>
			</div>
		</div>
		<div class="global_item row_2 full slot_picker month">
    		<div class="side text">
    			<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_DTPICKER_MONTH}</p></div>
    		</div>
    		<div class="side arrow left"><p>_</p>
    		</div>
    		<div class="side value"><p id="month_p">1</p>
    		</div>
    		<div class="side arrow right"><p>+</p>
    		</div>
		</div>
		<div class="global_item row_3 full slot_picker year">
    		<div class="side text">
    			<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_DTPICKER_YEAR}</p></div>
    		</div>
    		<div class="side arrow left"><p>_</p>
    		</div>
    		<div class="side value"><p id="year_p">1</p>
    		</div>
    		<div class="side arrow right"><p>+</p>
    		</div>
		</div>
		<div class="global_item row_4 full slot_picker hour">
			<div class="ampm c_ye">
				<p class="am">{LANG_AM}</p>
				<p class="pm">{LANG_PM}</p>
			</div>
			<div class="side text">
				<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_DTPICKER_HOUR}</p></div>
			</div>
			<div class="side arrow left"><p>_</p>
			</div>
			<div class="side value"><p data-digit="2" id="hour_p">1</p>
			</div>
			<div class="side arrow right"><p>+</p>
			</div>
		</div>
		<div class="global_item row_5 full slot_picker minute">
    		<div class="side text">
    			<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_DTPICKER_MINUTE}</p></div>
    		</div>
    		<div class="side arrow left"><p>_</p>
    		</div>
    		<div class="side value"><p data-digit="2" id="minute_p">1</p>
    		</div>
    		<div class="side arrow right"><p>+</p>
    		</div>
		</div>
		<div class="global_item row_6 full">
    		<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_DTPICKER_24}</p></div>
    		<div class="switcher off disableMode3 twentyfour" data-checked="0" id="twentyfour">
    			<p class="button_text c_dark on">{LANG_YES}</p>
    			<p class="button_text c_dark off">{LANG_NO}</p>
    			<div class="button_dot g_bg_dark"></div>
    			<div class="active_area"></div>
    		</div>
    	</div>
    	<div class="global_item row_7 full">
    		<div class="wrap_tag"><p class="item_tag">{LANG_WIZARD_DTPICKER_DST}</p></div>
    		<div class="switcher off disableMode3 dst" data-checked="0" id="dst">
    			<p class="button_text c_dark on">{LANG_YES}</p>
    			<p class="button_text c_dark off">{LANG_NO}</p>
    			<div class="button_dot g_bg_dark"></div>
    			<div class="active_area"></div>
    		</div>
    	</div>
    	<div class="global_item row_8 full gregorian">
			<div class="selector_container">
				<div class="wrap_tag"><p class="tt_selector">{LANG_WIZARD_DTPICKER_CALENDAR}</p></div>
				<p class="sl_selector">{LANG_GREGORIAN}</p>
				<div class="active_click"></div>
			</div>
		</div>
		<div class="global_item row_9 full time_zone">
			<div class="selector_container">
				<div class="wrap_tag"><p class="tt_selector">{LANG_WIZARD_DTPICKER_TIME_ZONE}</p></div>
				<p class="sl_selector"></p>
				<div class="active_click"></div>
			</div>
		</div>
	</div>
</div>