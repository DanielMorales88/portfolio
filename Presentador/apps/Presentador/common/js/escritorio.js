/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var previousPage = function(){
	//if(pagesHistory.length>1){
	/*	pagesHistory.pop();
		var last_element = pagesHistory[pagesHistory.length - 1];
		alert(pagesHistory);
		loadPage(last_element);*/					
	//}
	if(last_element!==""){
		loadPage(last_element);
	}else{
		$("#hamburger").trigger( "click" );
	}
};

$(document).ready(function() {
	fixBackgroundDesktop();
	fixContentTo4_3();
	$(window).on('resize', function() {
		fixBackgroundDesktop();
	});
	last_element="";
	$('div[data-role="page"]').swipe({
		swipe : function(event, direction, distance, duration, fingerCount) {
			if (direction === "right" && fingerCount === 2) {
				previousPage();
			}
		},
		fingers : 'all'
	});
	
	WL.App.overrideBackButton(function() {
		previousPage();
	});
});