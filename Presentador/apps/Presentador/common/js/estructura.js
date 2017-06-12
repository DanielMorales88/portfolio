var identificaPrivado = {
	"title" : "Identifica",
	"page" : "pages/identifica.html",
	"disabled" : false,
	"children" : [ {
		"title" : "Perfilador",
		"method" : "proximamente();",
		"disabled" : true
	}, {
		"title" : "Productos",
		"page" : "pages/productosPrivado.html",
		"disabled" : false
	} ]
};
var productosPrivado = [ {
	"title" : "Vida",
	"page" : "pages/vida.html",
	"disabled" : false,
	"children" : [ {
		"title" : "TotalLife",
		"page" : "totalLife.html",
		"disabled" : false
	}, {
		"title" : "TempoLife",
		"page" : "pages/tempoLife.html",
		"disabled" : false
	} ]
}, {
	"title" : "Retiro",
	"page" : "pages/retiro.html",
	"disabled" : false,
	"children" : [ {
		"title" : "Horizonte MetLife",
		"page" : "horizonte.html",
		"disabled" : false
	}, {
		"title" : "Flexi Sue&ntilde;os",
		"page" : "pages/flexiLifeSuenos.html",
		"disabled" : false
	} ]
}, {
	"title" : "Inversión y ahorro",
	"page" : "pages/inversion.html",
	"disabled" : false,
	"children" : [ {
		"title" : "MetaLife",
		"page" : "totalLife.html",
		"disabled" : false
	}, {
		"title" : "FlexiLife Inversi&oacute;n",
		"page" : "pages/tempoLife.html",
		"disabled" : false
	},{
		"title" : "FlexiLife Protecc&oacute;",
		"page" : "totalLife.html",
		"disabled" : false
	}, {
		"title" : "EducaLife",
		"page" : "pages/tempoLife.html",
		"disabled" : false
	},{
		"title" : "PerfectLife",
		"page" : "pages/tempoLife.html",
		"disabled" : false
	} ]
}, {
	"title" : "MedicaLife",
	"page" : "pages/medicaLife.html",
	"disabled" : false
} ];

var identificaPublico = {
	"title" : "Identifica",
	"page" : "pages/identifica.html",
	"disabled" : false,
	"children" : [ {
		"title" : "Perfilador",
		"page" : "pages/login.html",
		"disabled" : false
	}, {
		"title" : "Productos",
		"page" : "pages/productosPublico.html",
		"disabled" : false
	} ]
};

var navigationTree = {
	"title" : "Login",
	"page" : "pages/login.html",
	"disabled" : false,
	"children" : [ {
		"title" : "Home",
		"page" : "pages/desktop.html",
		"disabled" : false,
		"children" : [ {
			"title" : "Conoce",
			"page" : "pages/conoce.html",
			"disabled" : false,
			"children" : [ {
				"title" : "Agenda",
				"method" : "agenda();",
				"disabled" : false
			}, {
				"title" : "Calendario",
				"method" : "calendario()",
				"disabled" : false
			} ]
		}, {
			"title" : "Sensibiliza",
			"page" : "pages/sensibiliza.html",
			"disabled" : false
		}, identifica(), {
			"title" : "Prepara",
			"disabled" : true
		}, {
			"title" : "Aprende",
			"disabled" : true
		} ]
	} ]
};
