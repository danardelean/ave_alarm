pag_table_new["widget_stdby"] = {
	onload: function()
	{
		$("#header_center_container_stdby").hide();
		//
		if ($(".widget_stdby").attr("data-preload") != "preload")
		{
			stdby_in();
		}
		$(".widget_stdby").unbind("click").click(function()
		{
			stdby_out();
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
	name: "widget_stdby",
	loaded: false
};