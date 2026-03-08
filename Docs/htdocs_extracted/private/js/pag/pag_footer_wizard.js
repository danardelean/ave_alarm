pag_table_new["footer_wizard"] = {
	onload: function()
	{
		$("#footer-wizard-page .footer_container_btn").hide();
		$("#footer-wizard-page .footer_container_info").hide();
		footer_loaded = true;
		wizard_footer_init();
	},
	onrecv_confirmation: function()
	{
		//
	},
	onrecv_indication: function(indi)
	{
		//
	},
	onclose: function()
	{
		footer_loaded = false;
	}
};