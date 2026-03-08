var pag_table_new = [];
//
function pag_change(parent, page, extra1, extra2, extra3, extra4, extra5, extra6, extra7, extra8, extra9, extra10)
{
//rtyu("caller is " + arguments.callee.caller.toString());
//jQuery._data(document.getElementById("welcome_content"), event);
	if (extra1 == null) extra1 = "none";
	if (extra2 == null) extra2 = "none";
	if (extra3 == null) extra3 = "none";
	if (extra4 == null) extra4 = "none";
	if (extra5 == null) extra5 = "none";
	if (extra6 == null) extra6 = "none";
	if (extra7 == null) extra7 = "none";
	if (extra8 == null) extra8 = "none";
	if (extra9 == null) extra9 = "none";
	if (extra10 == null) extra10 = "none";
	//
	if (parent == "HERE")
	{
		var container_tmp = here_context.closest("[data-curpage]");
		parent = "[data-curpage = " + container_tmp.attr("data-curpage") + "]";
		here_context = null;
	}
	//
	if (page in pagBufBox)
	{
		pag_func_close_new(parent);
		$(parent).empty();
		//
		var pagClone = pagBufBox[page].clone();
		initParams(page, pagClone, extra1, extra2, extra3, extra4, extra5, extra6, extra7, extra8, extra9, extra10);
		pagClone.appendTo(parent);
		afterLoadFinished(parent, page);
	}
	else
	{
		$("<div></div>").load("?cmd=getpag&name=" + page,
		{
			extra1: "extra1"
			, extra2: "extra2"
			, extra3: "extra3"
			, extra4: "extra4"
			, extra5: "extra5"
			, extra6: "extra6"
			, extra7: "extra7"
			, extra8: "extra8"
			, extra9: "extra9"
			, extra10: "extra10"
		}, function(responseText)
		{
			pag_func_close_new(parent);
			$(parent).empty();
			//
			pagBufBox[page] = $(responseText);
			//
			var pagClone = pagBufBox[page].clone();
			initParams(page, pagClone, extra1, extra2, extra3, extra4, extra5, extra6, extra7, extra8, extra9, extra10);
			pagClone.appendTo(parent);
			afterLoadFinished(parent, page);
		});
	}
}
function pag_preload(page, extra1, extra2, extra3, extra4, extra5, extra6, extra7, extra8, extra9, extra10)
{
	$("<div></div>").load("?cmd=getpag&name=" + page,
	{
		extra1: extra1
		, extra2: extra2
		, extra3: extra3
		, extra4: extra4
		, extra5: extra5
		, extra6: extra6
		, extra7: extra7
		, extra8: extra8
		, extra9: extra9
		, extra10: extra10
	}, function(responseText)
	{
		pagBufBox[page] = $(responseText);
		pagLoadedCount++;
	});
}
function afterLoadFinished(parent, page)
{
	glance_body_wrapper(pag_table_new[page]);
	$(parent).attr("data-curpage", page);
	pag_table_new[page].onload();
	applyKeyboard();
	autoScrollHunter(page);
	qtClassified(page);
	scaleFX();
}
function initParams(page, pagClone, extra1, extra2, extra3, extra4, extra5, extra6, extra7, extra8, extra9, extra10)
{
	var extras = {};
	extras["extra1"] = extra1;
	extras["extra2"] = extra2;
	extras["extra3"] = extra3;
	extras["extra4"] = extra4;
	extras["extra5"] = extra5;
	extras["extra6"] = extra6;
	extras["extra7"] = extra7;
	extras["extra8"] = extra8;
	extras["extra9"] = extra9;
	extras["extra10"] = extra10;
	//
	var listAttr = pagClone.filter("." + page)[0].attributes;
	for (var i = 0; i < listAttr.length; i++)
		if (listAttr[i].name.indexOf("data-") == 0)
			if (listAttr[i].value.indexOf("extra") == 0)
				listAttr[i].value = extras[listAttr[i].value];
}
function pag_clear(parent)
{
	pag_func_close_new(parent);
	//
	$(parent).empty();
	$(parent).removeAttr("data-curpage");
}
function pag_func_close_new(parent)
{
	try
	{
		$(parent).find("[data-curpage]").each(function()
		{
			if ($(this).attr("data-curpage") in pag_table_new)
			{
				delete scrollControllers[$(this).attr("data-curpage")];
				$(window).off("resize." + $(this).attr("data-curpage"));
				//
				pag_table_new[$(this).attr("data-curpage")].onclose();
				delete pag_table_new[$(this).attr("data-curpage")];
			}
		});
		//
		delete scrollControllers[$(parent).attr("data-curpage")];
		$(window).off("resize." + $(parent).attr("data-curpage"));
		//
		pag_table_new[$(parent).attr("data-curpage")].onclose();
		delete pag_table_new[$(parent).attr("data-curpage")];
	}
	catch(err)
	{
		if (!QT && SIMUL) 
		{
			if ($(parent).hasAttr("data-curpage"))
				rtyu("func_close ==> parent : "+parent+" // data-currpage : "+$(parent).attr("data-curpage")+" // "+err, true);
		}
	}
}