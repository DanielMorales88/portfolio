var baseURL = "http://cristopherbg.xyz/contentenidoPresentador.txt";

var pagesHistory = [];
var currentPage = {};
var path = "";

var currentUser = {
	"name" : "",
	"password" : "",
	"type" : ""
};
var screenHeight;
var screenWidth;

var last_element;
function wlCommonInit() {

	// Special case for Windows Phone 8 only.
	if (WL.Client.getEnvironment() == WL.Environment.WINDOWS_PHONE_8) {
		path = "/www/default/";
	}

	loadLogin();
	 // Met99 calculator loading.
	 loadMet99Database();
}
var loadPage = function(page) {
	if (page !== "") {
		$("#pagePort").load(path + page, function() {
			pagesHistory.push(page);
		});
	}
};
var loadLogin = function() {
	loadPage("pages/login.html");
};
var loadDesktop = function() {
	// lert(JSON.stringify(currentUser));
	loadPage("pages/desktop.html");
	changeToLandscape();
};

var loadSensibiliza = function() {
	loadPage("pages/sensibiliza.html");
};
var loadConoce = function() {
	loadPage("pages/conoce.html");
};

var loadIdentifica = function() {
	changeToLandscape();
	loadPage("pages/identifica.html");
};

var loadProductosPrivado = function() {
	loadPage("pages/productosPrivado.html");
};

var loadProductosPublico = function() {
	loadPage("pages/productosPublico.html");
};

var loadMedicaLife = function() {
	loadPage("pages/medicaLife.html");
};

var loadInversion = function() {
	loadPage("pages/inversion.html");
};

var loadRetiro = function() {
	loadPage("pages/retiro.html");
};

var loadTempoLife = function() {
	loadPage("pages/tempoLife.html");
};

var loadTotalLife = function() {
	loadPage("pages/totalLife.html");
};

var loadVida = function() {
	loadPage("pages/vida.html");
};

var loadMetaLife = function() {
	loadPage("pages/metaLife.html");
};

var loadFlexiLifeInversion = function() {
	loadPage("pages/flexiLife.html");
};

var loadFlexiLifeProteccion = function() {
	loadPage("pages/flexiLifeProteccion.html");
};

var loadEducaLife = function() {
	loadPage("pages/educaLife.html");
};

var loadPerfectLife = function() {
	loadPage("pages/perfectLife.html");
};

var loadHorizonte = function() {
	loadPage("pages/horizonte.html");
};

var loadFlexiLifeSuenos = function() {
	loadPage("pages/flexiLifeSuenos.html");
};

var loadPdfReader = function() {
	loadPage("pages/pdfReader.html");
};

var loadMet99 = function() {
	if (currentUser.type === 0) {
		changeToPortrait();
		loadPage("pages/met99.html");
	} else {
		proximamente();
	}

};

var loadCotizaMet99 = function() {
	if (currentUser.type === 0) {
		changeToPortrait();
		loadPage("pages/cotizadorMet99.html");
	} else {
		proximamente();
	}

};

function onSuccess() {
	WL.Logger.info("App successfully opened");
}

function onFailure() {
	WL.Logger.info("App failed opening");
}

function backFromNativePage(data) {
	// alert("Received phone number is: " + data.phoneNumber);
}

var openContacts = function() {
	if (WL.Client.getEnvironment() == WL.Environment.ANDROID) {
		cordova.exec(onSuccess, onFailure, "OpenExternalApp", "openApp", []);
	} else {
		WL.NativePage.show("UIContactsTableViewController", backFromNativePage,
				{});
	}
};
var openCalendar = function() {
	if (WL.Client.getEnvironment() == WL.Environment.ANDROID) {
		cordova.exec(onSuccess, onFailure, "OpenExternalApp", "openCalendar",
				[]);
	} else {
		location.href = "CALSHOW://";
	}
};

var openPDF = function(pdf) {
	if (WL.Client.getEnvironment() == WL.Environment.ANDROID) {
		WL.NativePage.show("com.Presentador.PDFViewActivity",
				backFromNativePage, {"pdf":pdf});
	}
	else if (WL.Client.getEnvironment() == WL.Environment.IPAD) {
		WL.NativePage.show("PDFViewController",backFromNativePage, {"pdf":pdf});
	}
};

var landscape = true;

var changeToPortrait = function(){
	if(landscape){
		landscape = false;
	cordova.exec(onSuccess, onFailure, "OpenExternalApp", "changeToPortrait",
			[]);
	}
};

var changeToLandscape = function(){
	if(!landscape){
		landscape = true;
		cordova.exec(onSuccess, onFailure, "OpenExternalApp", "changeToLandscape",
				[]);
	}
};
var isAndroidLowerThant = function(ver){
	var androidversion = 0.0;
	var deviceAgent = navigator.userAgent;
	var agentIndex = deviceAgent.indexOf('Android');
	if (agentIndex != -1) {
		androidversion =parseFloat(deviceAgent
				.match(/Android\s+([\d\.]+)/)[1]);
	}
	return androidversion < ver;
};
var playMyVideo = function(video) {
	if (WL.Client.getEnvironment() == WL.Environment.ANDROID) {
		WL.NativePage.show("com.Presentador.StreamingVideoActivity",backFromNativePage, {"video":video});
	}else if (WL.Client.getEnvironment() == WL.Environment.IPAD) {
		WL.NativePage.show("VideoViewController",backFromNativePage, {"video":video});
	}
};

var downloadFiles = function(products){
	var queuePDF = [];
	var queueVideo = [];

	$.each(products, function(i, products) {
		$.each(products.content, function(i, content) {
			//TODO: Agregar logica lastUpdated
			if(content.type==="pdf"){
				queuePDF.push(content.url);
			}else{
				queueVideo.push(content.url);
			}

		});
	});

	alert(queuePDF.toString());
};

var descarga = function(filePath){
	var fileTransfer = new FileTransfer();
	var relativeFileLocation = 'data/output8.pdf';
	var fileSystemFileLocation = '/output8.pdf';
	var docsPath = fileSystem.root.fullPath;
	//"file:///android_asset/www/default/"
	var wwwPath = docsPath.substring(0, docsPath.lastIndexOf('/'))+'/testios27.app/www/';
	//var filePath = wwwPath+relativeFileLocation;
	fileTransfer.download(
	    'file://'+encodeURI(filePath),
	    theFileSystem.root.fullPath+'/output8.pdf', // Ouput path
	    onTransferComplete,
	    fail);
};

var getFiles = function(){
		$.getJSON( "http://cristopherbg.xyz/testContent.txt", {} )
		.done(function( json ) {
			downloadFiles(json.products);
		  //alert( "JSON Data: " + JSON.stringify(json) );
		})
		.fail(function( jqxhr, textStatus, error ) {
		  var err = textStatus + ", " + error;
		  alert( "Request Failed: " + err );
		});

};
