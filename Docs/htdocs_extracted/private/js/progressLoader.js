var expectedElementNumber = 0;
var loadedElementNumber = 0;
var elementNumber = 0;
var progressLoaderGuiPtr = null;
var t_out_refresh;
var t_out_pl;
var percentualePrecendente;
function startProgressLoader(elementNumberPar)
{
	if (typeof webbridge == "undefined" && !(isNaN(Number(elementNumberPar))))
	{
		elementNumber = elementNumberPar;
		loadedElementNumber = getElementLoadedNum();
		expectedElementNumber = loadedElementNumber + elementNumber;
		//
		clearTimeout(t_out_refresh);
		percentualePrecendente = -1;
		progressLoaderGuiPtr.style.width = "0";
		progressLoaderGuiPtr.style.display = "block";
		progressLoaderRefresh();
	}
}
function stopProgressLoader()
{
	loadedElementNumber = expectedElementNumber;
}
function progressLoaderRefresh()
{
	loadedElementNumber = getElementLoadedNum();
	var percentuale = Math.round(100 * (1 + ((loadedElementNumber - expectedElementNumber) / elementNumber)));
	outOfTime(percentuale);
	progressLoaderGuiPtr.style.width = percentuale + "%";
	//
	t_out_refresh = setTimeout(function() 
	{
		if (loadedElementNumber < expectedElementNumber)
			progressLoaderRefresh();
		else
			progressLoaderGuiPtr.style.display = "none";
	}, 0.5 * 1000);
}
function getElementLoadedNum()
{
	return window.performance.getEntriesByType("resource").length;
}
function initProgressLoader()
{
	if (typeof webbridge == "undefined")
	{
		initProgressLoaderGuiPtr();
		startProgressLoader(<?php echo PROGRESS_LOADER_ELEMENTS_WELCOME; ?>);
	}
}
function initProgressLoaderGuiPtr()
{
	progressLoaderGuiPtr = document.getElementById("progressLoader");
	if (progressLoaderGuiPtr == null)
		setTimeout(function(){ initProgressLoaderGuiPtr(); }, 0.5 * 1000);		
}
function outOfTime(percentuale)
{
	if (percentuale != percentualePrecendente)
	{
		percentualePrecendente = percentuale;
		clearTimeout(t_out_pl);
		t_out_pl = setTimeout(function() { stopProgressLoader(); }, 15 * 1000);
	}
}
if ("performance" in window)
	initProgressLoader();