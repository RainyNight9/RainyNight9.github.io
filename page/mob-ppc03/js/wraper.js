// JavaScript Document
function addsize(func){var old=window.onresize;if(typeof window.onresize!="function"){window.onresize=func;}else{window.onresize=function(){old();func();}}};
var liulanAU=navigator.userAgent.toLowerCase();
if(liulanAU.indexOf("iphone")>0||liulanAU.indexOf("ipad")>0||liulanAU.indexOf("android")>0)
{
	var zoom=function()
	{

		var cliWidth=document.body.clientWidth;
		var sca=cliWidth/320;
		var wraper = document.getElementById("wraper");
		//if(cliWidth>904) wraper.style.cssText ='';
		wraper.style.cssText ='transform: scale('+sca+');transform-origin: 0 0;-webkit-transform: scale('+sca+');-webkit-transform-origin: 0 0; min-width:'+100/sca+'%';
	};
	zoom();
	addsize(zoom);
}