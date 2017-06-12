
/* JavaScript content from js/ADN.js in folder common */

/* JavaScript content from js/ADN.js in folder common */

/* JavaScript content from js/ADN.js in folder common */
var methodShowModalEdad = function() {
	/*var $textAndPic = $('<div></div>');
	$textAndPic.append('Los rangos de edades no corresponden <br />');
	BootstrapDialog.show({
	        title: "<span class='glyphicon glyphicon-exclamation-sign' style='margin-right:5px;'></span>Aviso",
	        size: BootstrapDialog.SIZE_SMALL,
	        message: $textAndPic,
	        closable: false,
	        buttons: [{
	            id: 'btn-ok',
	            //icon: 'glyphicon glyphicon-check',
	            label: 'ACEPTAR',
	            cssClass: 'btn-success',
	            autospin: false,
	            action: function(dialogRef){
	                dialogRef.close();
	            }
	        }]
	    });*/
	alert("El rango de edad debe ser de 15 a 70 años");
};
var arrayInsurance = [ {
	"title" : "Fallecimiento",
	"icon" : "icon-met99-01.png",
	"video" : "PRE005"
}, {
	"title" : "Fallecimiento Temprano",
	"icon" : "icon-met99-02.png",
	"video" : "PRE006"
}, {
	"title" : "Constancia de Protección",
	"icon" : "icon-met99-03.png",
	"video" : "PRE008"
}, {
	"title" : "Enfermedad Terminal",
	"icon" : "icon-met99-04.png",
	"video" : "PRE007"
}, {
	"title" : "Exención de Pago por Invalidez Total y Permanente",
	"icon" : "icon-met99-05.png",
	"video" : "PRE009"
}, {
	"title" : "Indemnización por Invalidez Total y Permanente ",
	"icon" : "icon-met99-07.png",
	"video" : "PRE011"
}, {
	"title" : "Muerte Accidental",
	"icon" : "icon-met99-08.png",
	"video" : "PRE012"
}, {
	"title" : "Indemnización por Muerte Accidental y/o perdidas Orgánicas",
	"icon" : "icon-met99-10.png",
	"video" : "PRE014"
}, {
	"title" : "Protección contra Cáncer",
	"icon" : "icon-met99-09.png",
	"video" : "PRE013"
}, {
	"title" : "Gastos Funerarios",
	"icon" : "icon-met99-11.png",
	"video" : "PRE015"
}, {
	"title" : "Accidentes Personales",
	"icon" : "icon-met99-12.png",
	"video" : "PRE016"
}, {
	"title" : "Fallecimiento Cónyuge",
	"icon" : "icon-met99-14.png",
	"video" : "PRE018"
}, {
	"title" : "Gastos Funerarios Cónyuge",
	"icon" : "icon-met99-13.png",
	"video" : "PRE017"
}, {
	"title" : "Garantía Escolar",
	"icon" : "icon-met99-15.png",
	"video" : "PRE019"
}, {
	"title" : "Gastos Funerarios para Hijos",
	"icon" : "icon-met99-18.png",
	"video" : "PRE022"
}, {
	"title" : "Fallecimiento Complementario",
	"icon" : "icon-met99-16.png",
	"video" : "PRE020"
}, {
	"title" : "Gastos Funerarios complementario",
	"icon" : "icon-met99-06.png",
	"video" : "PRE010"
}, {
	"title" : "Cáncer Complementario",
	"icon" : "icon-met99-17.png",
	"video" : "PRE021"
} ];

var arrayBinaryToDecimal = function(myArray) {
	var binaryString = myArray.toString().replace(/,/g, '');
	return parseInt(binaryString, 2);
};

var combinations = function(myVal) {
	var arrayToReturn;
	switch (myVal) {
	case 15:
		arrayToReturn = [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ];
		break;
	case 14:
		arrayToReturn = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ];
		break;
	case 13:
		arrayToReturn = [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1 ];
		break;
	case 12:
		arrayToReturn = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1 ];
		break;
	case 11:
		arrayToReturn = [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1 ];
		break;
	case 10:
		arrayToReturn = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1 ];
		break;
	case 9:
		arrayToReturn = [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1 ];
		break;
	case 8:
		arrayToReturn = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1 ];
		break;
	case 7:
		arrayToReturn = [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ];
		break;
	case 6:
		arrayToReturn = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1 ];
		break;
	case 5:
		arrayToReturn = [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0 ];
		break;
	case 4:
		arrayToReturn = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0 ];
		break;
	case 3:
		arrayToReturn = [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1 ];
		break;
	case 2:
		arrayToReturn = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1 ];
		break;
	case 1:
		arrayToReturn = [ 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ];
		break;
	case 0:
		arrayToReturn = [ 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0 ];
		break;
	}

	return arrayToReturn;
};

var arrayResult = function(myArray) {
	var newArray = [];
	$.each(myArray, function(id, option) {
		if (option)
			newArray.push(arrayInsurance[id]);
	});
	return newArray;
};
var esHombre = 0;
var serializeForm = function(form) {
	var obj = {};
	var formElement = $(form).serializeArray();
	formElement.forEach(function(element) {
		if (element.name !== ''){
			obj[element.name] = element.value;
		}
	});
	return obj;
};

var showADNVideo = function(sectionKey) {
	getContentForKey(sectionKey, function(url){
		if(url !==  ""){
			playMyVideo(url);
		}else{
			alert("Contendio no disponible. Intenta más tarde.");
		}
	}, function(errorDescription){
		alert("Contenido no disponible. Intenta más tarde");
	});
};

function populateProductos(select, data) {
	select.html('');
	var items = [];
	$.each(data,function(id, option) {
		var addClass = 'list-group-item clear-fix';
		if(option.title.length>50){
			addClass+=' doubleHeightRow';
		}
		var video = option.video.toString();
		var itm = $('<a/>',{'href':'javascript:showADNVideo(\''+video+'\');', 'class':addClass});
		var itmImg =$('<img/>',{ 'src':'images/icons/'+option.icon, 'class':'pull-left iconList'});
		itm.append(itmImg);
		itm.append(option.title);
		items.push(itm);
	});
	select.append(items);
}


var leerCombinacionForm = function(datos) {
	var arrayBinario = [];
	/*
	 * Estado Civil Hijos Dependientes Económicos Ya tiene MET99
	 */
	arrayBinario.push((datos.edoCivil === "Casado") ? 1 : 0);
	arrayBinario.push((datos.hijos > 0) ? 1 : 0);
	arrayBinario.push((datos.dependientes > 0) ? 1 : 0);
	arrayBinario.push((datos.met99 == "on") ? 1 : 0);
	return arrayBinario;
};
var updateResultView = function(datos) {
	// alert(JSON.stringify(datos));
	$("#nombreRegistrado").html(datos.nombre);
	$("#edadRegistrada").html(datos.edad);
	$("#edoCivilRegistrado").html(datos.edoCivil!==""?datos.edoCivil:"Soltero");
	$("#hijosRegistrados").html(datos.hijos);
	$("#dependientesRegistrados").html(datos.dependientes);
	$("#tieneMet99").html((datos.met99 == "on") ? "Si" : "No");

	var genero = $("<img/>", {
		"alt" : "Cliente",
		"src" : "images/" + (esHombre === 1 ? "charlie.png" : "lucy.png"),
		"class" : "charlie"
	});
	$("#imgGenero").append(genero);
};
$(document)
		.ready(
				function() {
					var $theForm = $("#met99Form");
					$("#ContainerResultado").hide();
					$theForm
							.on(
									'submit',
									function(event) {
										event.preventDefault();
										var datosForm = serializeForm(this);
										if (datosForm.edad > 14 && datosForm.edad < 71) {
											updateResultView(datosForm);
											// alert("Datos:
											// "+JSON.stringify(datosForm));
											var combinacion = arrayBinaryToDecimal(leerCombinacionForm(datosForm));
											// alert("Binario a Decimal:
											// "+combinacion);
											var resultado = combinations(combinacion);
											var arrayNuevo = arrayResult(resultado);
											populateProductos(
													$("#productosResultado"),
													arrayNuevo);
											$(this).hide();
											$("#ContainerResultado").show();
											this.reset();
										} else {
											methodShowModalEdad();
										}
									});
					// ".btn-group > .btn"
					$("#esHombre > .btn").click(
							function() {
								$(this).addClass("active").siblings()
										.removeClass("active");
								esHombre = $(this).text() === "Hombre" ? 1 : 0;
							});
					//$('.dropdown-toggle').dropdown();

					$('#edoCivilUl li').on('click', function() {
						edoCivilVal = $(this).find('a').html();
						$('#estadocivil').html("Estado civil: " + edoCivilVal);
					});
					$('#hijosUl li').on('click', function() {
						hijoVal = $(this).find('a').html();
						$('#hijos').html("Hijos: " + hijoVal);
					});
					$('#dependientesUl li').on(
							'click',
							function() {
								dependientesVal = $(this).find('a').html();
								$('#dependientes').html(
										"Dependientes econ&oacute;micos: " + dependientesVal);
							});
					/*
					 * $('#form').submit(function(){ $.ajax({ url:
					 * $('#form').attr('action'), type: post, data :
					 * $('#form').serialize(), success: function(){
					 * console.log('form submitted.'); } });
					 * serializeForm($("met99Form")); return false; });
					 */
				});
