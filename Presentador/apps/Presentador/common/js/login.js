/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var fixCssContent = function() {
	$('#contentLogin').css('min-height', $(window).height());
	$('#rightSideLogin').css('height', $(window).height());
	$('#leftSide').css('height', $(window).height());
	//$('#escritorio').css('width', $(window).width());
};
var checkNoEmpty = function(content) {
	return content.length === 0 ? false :
	true;
};

var formSubmit = function() {
	
	currentUser.type = 0;
	loadDesktop();
	
	/*if (checkNoEmpty($("#username").val()) && checkNoEmpty($("#pass").val())) {
		// window.location="desktop.html";
		currentUser.name = $("#username").val();
		currentUser.password = $("#pass").val();

		//*******Validar Usuario******************
		username = $("#username").val();
		password = $("#pass").val();
		if(username =="P"){

			currentUser.type = 0;
			loadDesktop();

		}else{
		var invocationData = {
				adapter : "Acceso",
				procedure : "submitAuthentication",
				parameters : [ username, password ]
			};

			singleStepAuthRealmChallengeHandler.submitAdapterAuthentication(invocationData, {});
		}
	} else {
		alert("error");
	}*/
};

var hideFormAtIndex = function(index) {
	var forms = [ "#userLogin", "#forgotPass", "#resetPass" ];
	for (i = 0; i < forms.length; i++) {
		$(forms[i]).css({
			"display" : "none"
		});
	}
	$(forms[index]).css({
		"display" : "block"
	});
};

var cargando = function () {
    var imgComingSoon = $('<img>', {id: 'theImg', src: 'images/snoopy.png', width: '75%'});
    modal.open({content: imgComingSoon, width: '75%'});
    //e.preventDefault();
};

$(document).ready(function() {

	screenWidth=$(window).width();
	screenHeight=$(window).height();

	fixCssContent();
	//$(window).on('resize', function() {
		//fixCssContent();
	//});

	$("#btnIngresar").click(function() {
		//
		//cargando();
		console.log("antes de get files");
		currentUser.type = 0;
		loadDesktop();
/*		getFilesSQL(function(infoArray){
			console.log("a que huele el omelet");
			downloadFiles(infoArray);
		}, function(textStatus, error){
			modal.close();
			console.log("puras chapuzas");
			alert("¡Error en la conexión de red! Verifica e intenta más tarde.");
		});*/
		console.log("después de get files");

	});
	$("#btnOlvide").click(function() {
		hideFormAtIndex(1);
	});

	$("#btnCancelaReset").click(function() {
		hideFormAtIndex(0);
	});

	$(document).on('keypress', 'input,select', function(e) {
		if (e.which == 13) {
			e.preventDefault();
			var $next = $('[tabIndex=' + (+this.tabIndex + 1) + ']');
			if (this.type === 'button') {
				$(this).trigger("click");
			}
			//console.log($next.length);
			if (!$next.length) {
				$next = $('[tabIndex=1]');
			}
			$next.focus();
		}
	});
	FastClick.attach(document.body);
});



var downloadFiles = function(files) {
	var plataformString = "";
	console.log("en el download de get files");
	if (WL.Client.getEnvironment() == WL.Environment.ANDROID) {
		plataformString = "com.Presentador.DownloadFileActivity";
	}
	else if (WL.Client.getEnvironment() == WL.Environment.IPAD) {
		plataformString = "DownloadViewController";
	}
	console.log("antes del show: " + plataformString);
	WL.NativePage.show(plataformString, function(data){

		var urlsDownloaded = data.urls;
		$.each(urlsDownloaded, function(i, fileURLDict){
				findFileSQL(fileURLDict.filename, function(foundFiles){
					for (var i=0; i < foundFiles.length; i++) {
                        console.log("sectionKey::" + foundFiles.item(i).sectionKey + "::" + fileURLDict.filename);
                        replaceURLForContent(foundFiles.item(i),fileURLDict.url);
                    }
				});
		});

		/*for (var i=0; i < urlsDownloaded.length; i++) {
			var fileURLDict = urlsDownloaded[i];
			findFileSQL(fileURLDict.filename, function(foundFiles){
				for (var i=0; i < foundFiles.length; i++) {
					console.log("sectionKey::" + foundFiles.item(i).sectionKey + ":: "+fileURLDict.url);
					replaceURLForContent(foundFiles.item(i),fileURLDict.url);
					console.log("sectionKey::" + foundFiles.item(i).sectionKey);
				}
			});
		}*/

		if (urlsDownloaded.lenght === 0){
			alert("El contenido no ha sido actualizado, intenta más tarde");
		}
		modal.close();
		formSubmit();
	}, {"files":files} );

};
