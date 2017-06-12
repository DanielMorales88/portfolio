
/* JavaScript content from js/coberturasList.js in folder common */

/* JavaScript content from js/coberturasList.js in folder common */

/* JavaScript content from js/coberturasList.js in folder common */
var coberturas = [ {
    "ide" : "h3Titular",
	"name" : "Coberturas Titular",
	"items" : [ {
		"name" : "Fallecimiento",
		"image" : "icon-met99-01.png",
		"type" : "toggle",
		"formName" : "fallecimiento",
		"coverage" :"BAS",
		"defecto" : true,
		"checked" : true
	}, {
		"name" : "Indemnización por Invalidez Total y Permanente",
		"image" : "icon-met99-02.png",
		"type" : "toggle",
		"formName" : "indeminizacion",
		"maxAge":55,
		"coverage":"CII",
		"defecto" : false,
		"checked" : true
	}, {
		"name" : "Indemnización por muerte accidental y/o perdidas orgánicas",
		"image" : "icon-met99-03.png",
		"type" : "toggle",
		"formName" : "tripleIndeminzacion",
		"coverage":"TIBA",
		"defecto" : false,
		"checked" : true,
		"event" : "titularEvent('muerte','tripleIndeminzacion');"
	}, {
		"name" : "Muerte accidental",
		"image" : "icon-met99-04.png",
		"type" : "toggle",
		"formName" : "muerte",
		"coverage": "MA",
		"defecto" : false,
		"checked" : false,
		"event" : "titularEvent('tripleIndeminzacion','muerte');"
	}, {
		"name" : "Gastos funerarios",
		"image" : "icon-met99-05.png",
		"type" : "toggle",
		"formName" : "funerarios",
		"coverage":"GFT",
		"defecto" : false,
		"checked" : false
	}, {
		"name" : "Cancer Titular",
		"image" : "icon-met99-12.png",
		"type" : "toggle",
		"formName" : "cancerTitular",
		"coverage":"CAT",
		"defecto" : false,
		"checked" : false
	}, {
		"name" : "Accidentes Personales Titular",
		"image" : "icon-met99-06.png",
		"type" : "toggle",
		"formName" : "accidentesTitular",
		"coverage":"APT",
		"maxAge":55,
		"defecto" : false,
		"checked" : false
	} ]
}, {
    "ide" : "h3Conyuge",
    "name" : "Coberturas Conyuge",
	"items" : [ {
		"name" : "Fallecimiento Conyugal",
		"image" : "icon-met99-07.png",
		"type" : "toggle",
		"formName" : "fallecimientoConyuge",
		"coverage":"BAS",
		"defecto" : false,
		"checked" : false
	}, {
		"name" : "Gastos funerarios Conyuge",
		"image" : "icon-met99-08.png",
		"type" : "toggle",
		"formName" : "funerariosConyuge",
		"coverage":"GFT",
		"defecto" : false,
		"checked" : false,
		"event" : "funeralConyuge();"
	} ]
}, {
    "ide" : "h3Hijos",
    "name" : "Coberturas Hijos",
	"items" : [ {
		"name" : "Gastos Funerarios Hijos",
		"image" : "icon-met99-09.png",
		"type" : "toggle",
		"formName" : "fallecimientoHijos",
		"coverage" : "",
		"defecto" : false,
		"checked" : false,
		"event" : "funeralHijos();"
	}, {
		"name" : "Garantia Escolar",
		"image" : "icon-met99-10.png",
		"type" : "toggle",
		"formName" : "garantiaEscolarForm",
		"coverage":"GE",
		"defecto" : false,
		"checked" : false,
		"event" : "garantiaEscolar();"
	} ]
}, {
    "ide" : "h3Complementarias",
    "name" : "Coberturas Complementarias",
	"items" : [ {
		"name" : "Fallecimiento Complementario",
		"image" : "icon-met99-11.png",
		"type" : "toggle",
		"formName" : "fallecimientoComplementario",
		"coverage":"BAS",
		"defecto" : false,
		"checked" : false,
		"event" : "complementarias();"
	}, {
		"name" : "Cancer complementario",
		"image" : "icon-met99-12.png",
		"type" : "toggle",
		"formName" : "cancerComplementario",
		"coverage":"CAT",
		"defecto" : false,
		"checked" : false,
		"event" : "cancerComplementario();"
	}, {
		"name" : "Gastos Funerarios Complementarios",
		"image" : "icon-met99-13.png",
		"type" : "toggle",
		"formName" : "funerarioComplementario",
		"coverage":"GFT",
		"defecto" : false,
		"checked" : false,
		"event" : "funeralComplementarios();"
	}, {
		"name" : "Accidentes Personales Complementarios",
		"image" : "icon-met99-14.png",
		"type" : "toggle",
		"formName" : "accidentesComplementario",
		"coverage":"APX",
		"defecto" : false,
		"checked" : false,
		"event" : "accidenteComplementarios();"
	} ]
} ];
/*var complementariosFunerariosHijos = {
	"name" : "Gastos funerarios hijos",
	"items" : [ {
		"name" : "1 hijo",
		"type" : "toggle",
		"formName" : "gastosFunerariosHijo1",
		"coverage":"GFH1",
		"defecto" : false,
		"checked" : false,
		"event" : "funerariosHijos(1);",
		"obj":{edad:0}
	}, {
		"name" : "2 hijos",
		"type" : "toggle",
		"formName" : "gastosFunerariosHijo2",
		"coverage":"GFH2",
		"defecto" : false,
		"checked" : false,
		"event" : "funerariosHijos(2);",
		"obj":{edad:0}
	}, {
		"name" : "3 o más hijos",
		"type" : "toggle",
		"formName" : "gastosFunerariosHijo3",
		"coverage":"GFH3",
		"defecto" : false,
		"checked" : false,
		"event" : "funerariosHijos(3);",
		"obj":{edad:0}
	} ]
};*/
var complementarioAdicional = {
	"name" : "Beneficio Adicional Complementario",
	"items" : [ {
		"name" : "Complementario 1",
		"type" : "toggle",
		"formName" : "complementarioAdicional",
		"coverage":"BAS", //Hombre fumador
		"defecto" : false,
		"checked" : false,
		"event" : "complementarioAdicional()"
	} ]
};
var cancerComplementarioList = {
	"name" : "Cáncer Complementario",
	"items" : [ {
		"name" : "Complementario 1",
		"type" : "toggle",
		"formName" : "cancerComp1",
		"coverage":"CAT",
		"defecto" : false,
		"checked" : false,
		"event" : "cancerComp(1);",
		"obj":{genero:'M',edad:0}
	}, {
		"name" : "Complementario 2",
		"type" : "toggle",
		"formName" : "cancerComp2",
		"coverage":"CAT",
		"defecto" : false,
		"checked" : false,
		"event" : "cancerComp(2);",
		"obj":{genero:'M',edad:0}
	}, {
		"name" : "Complementario 3",
		"type" : "toggle",
		"formName" : "cancerComp3",
		"coverage":"CAT",
		"defecto" : false,
		"checked" : false,
		"event" : "cancerComp(3);",
		"obj":{genero:'M',edad:0}
	} ]
};
var funerariosComplementarioList = {
	"name" : "Gastos Funerarios Complementario",
	"items" : [ {
		"name" : "Complementario 1",
		"type" : "toggle",
		"formName" : "funeralComp1",
		"coverage":"GFT",
		"defecto" : false,
		"checked" : false,
		"event" : "funeralComp(1)",
		"obj":{edad:0}
	}, {
		"name" : "Complementario 2",
		"type" : "toggle",
		"formName" : "funeralComp2",
		"coverage":"GFT",
		"defecto" : false,
		"checked" : false,
		"event" : "funeralComp(2)",
		"obj":{edad:0}
	}, {
		"name" : "Complementario 3",
		"type" : "toggle",
		"formName" : "funeralComp3",
		"coverage":"GFT",
		"defecto" : false,
		"checked" : false,
		"event" : "funeralComp(3)",
		"obj":{edad:0}
	} ]
};
var accidentesPersonales = {
	"name" : "Accidentes Personales Complementarios",
	"items" : [ {
		"name" : "Complementario 1",
		"type" : "toggle",
		"formName" : "accidenteComp1",
		"coverage":"APX",
		"defecto" : false,
		"checked" : false,
		"event" : "accidenteComp(1)",
		"obj":{edad:0}
	}, {
		"name" : "Complementario 2",
		"type" : "toggle",
		"formName" : "accidenteComp2",
		"coverage":"APX",
		"defecto" : false,
		"checked" : false,
		"event" : "accidenteComp(2)",
		"obj":{edad:0}
	}, {
		"name" : "Complementario 3",
		"type" : "toggle",
		"formName" : "accidenteComp3",
		"coverage":"APX",
		"defecto" : false,
		"checked" : false,
		"event" : "accidenteComp(3)",
		"obj":{edad:0}
	}, {
		"name" : "Complementario 4",
		"type" : "toggle",
		"formName" : "accidenteComp4",
		"coverage":"APX",
		"defecto" : false,
		"checked" : false,
		"event" : "accidenteComp(4)",
		"obj":{edad:0}
	} ]
};
