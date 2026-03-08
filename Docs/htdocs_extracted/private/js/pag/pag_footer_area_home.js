pag_table_new["footer_area_home"] = {
	onload: function()
	{
		var widget_obj = this;
		//
		myrtc_placer();
		//
		$(".footer_area_home #footer_area_b").off("click").click(function()
		{
			$("#menu_on_off").trigger("click");
		});
		//
		this.loaded = true;
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
	name: "footer_area_home",
	loaded: false
};