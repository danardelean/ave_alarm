pag_table_new["wizard"] = {
	onload: function()
	{
		welcome_loaded = false;
		footer_loaded = false;
		pag_change(".wizard .wizard_body", "widget_welcome");
		//pag_change(".wizard .wizard_footer_container", "footer_wizard");
	},
	onrecv_confirmation: function(conf)
	{
		//
	},
	onrecv_indication: function(indi)
	{
		//
	},
	onclose: function()
	{
		//
	},
	//
	name: "wizard"
};