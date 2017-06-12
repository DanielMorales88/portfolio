
/* JavaScript content from js/sensibiliza.js in folder common */
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function backFromNativePage(data) {

}

$(document).ready(function() {

	$("#btnPresentacion").click(function() {
		getContentForKey("PRE003", function(url){
			if(url !==  ""){
				openPDF(url);
			}else{
				alert("Contendio no disponible. Intenta más tarde.");
			}
		}, function(errorDescription){
			alert("Contenido no disponible intenta más tarde");
		});
	});

	$("#btnMet99").click(function() {
		getContentForKey("PRE002", function(url){
			if(url !==  ""){
				openPDF(url);
			}else{
				alert("Contendio no disponible. Intenta más tarde.");
			}
		}, function(errorDescription){
			alert("Contenido no disponible intenta más tarde");
		});
	});

	$("#btnComparativo").click(function() {
		getContentForKey("PRE025", function(url){

			if(url !==  ""){
				openPDF(url);
			}else{
				alert("Contendio no disponible. Intenta más tarde.");
			}

		}, function(errorDescription){
			alert("Contenido no disponible intenta más tarde");
		});
	});

	$('#myVideo').attr("height", $(window).height() / 3);
	$('#myVideo').attr('width', $(window).height() * (4 / 6));

    //$(".slideshow").swipeshow({ mouse: true, interval: 6000 });

}); // ready
