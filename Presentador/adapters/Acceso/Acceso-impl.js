/*
 *  Licensed Materials - Property of IBM
 *  5725-I43 (C) Copyright IBM Corp. 2011, 2013. All Rights Reserved.
 *  US Government Users Restricted Rights - Use, duplication or
 *  disclosure restricted by GSA ADP Schedule Contract with IBM Corp.
 */

function onAuthRequired(headers, errorMessage){
	errorMessage = errorMessage ? errorMessage : null;
	
	return {
		authRequired: true,
		errorMessage: errorMessage
	};
}


function getFeed(tag) {
	path = getPath(tag);

	var input = {
	    method : 'get',
	    returnedContentType : 'xml',
	    path : path
	};


	return WL.Server.invokeHttp(input);
}
/**
 *
 * @param tag
 *            must be either MobileFirst_Platform or MobileFirst_Playground
 * @returns json list of items
 */
function getFeedFiltered(tag) {
	path = getPath(tag);

	var input = {
	    method : 'get',
	    returnedContentType : 'xml',
	    path : path,
	    transformation : {
		    type : 'xslFile',
		    xslFile : 'filtered.xsl'
	    }
	};

	return WL.Server.invokeHttp(input);
}



function getPath(tag) {
	var path;
	if (tag === undefined || tag === '') {
		path = '/feed';
	}else {
		path = '/tag/' + tag + '/feed';
	}
	return 'mobilefirstplatform' + path;
}

function submitAuthentication(username, password) {


	var respuesta = com.metlife.presentador.utils.SecurityUtil.cipherDES(username, password);
   
	var user_encripted = respuesta[0];
	var pass_encripted = respuesta[1];
	
	
	//
	// ---------- Servicio de Login LDAP-----------------------------------
	var paramJSON = {
			"getLoginLDAPRequest" : {
				"TXLifeRequest" : {
					"OLifE" : {
						"userPassword" : pass_encripted,
						"userID" : user_encripted
						},
						"TransExeTime" : "17:06:00",
						"OLifEExtension" : {
							"SrceCountry" : "MX",
							"SrceSystem" : "81",
							"SrceCompany" : "ML"
						},
						"TransType" : {"" : "TEST","@tc" : 10},
						"TransRefGUID" : "123456",
						"TransExeDate" : "2015-09-08"
	             }
	         }
	    };
	
	var invocationData = {
			adapter : "ServiceLogin",
			procedure : "getLoginLDAP",
			parameters : [ paramJSON, {} ]
	};
	
	var result = WL.Server.invokeProcedure(invocationData);
	
	WL.Logger.warn(result);
	WL.Logger.warn("result after :::::::::::::::::::::: ");
	
	var olife = result.Envelope.Body.getLoginLDAPResponse.TXLifeResponse.OLifE;
	WL.Logger.warn(olife);
	if (olife.groups) {
	    var valida2 = roles(olife.roles.role);
	    WL.Logger.warn("Valida Rol ::::::::::::::::::::::::");
	    WL.Logger.warn(valida2);
	    
		if ( valida2 == "Privado" || "Publico") {
		
			userIdentity = {
					userId : olife.userID,
					displayName : olife.userID,
					attributes: {
						givenName : olife.givenName,
						sn: olife.sn,
						cn:	olife.cn,
						userLastPasswordChange: olife.userLastPasswordChange,
						email: olife.email,
						role: olife.roles.role,
						group:	olife.groups.group,
						perfil: valida2
					 }
			};
		
			WL.Server.setActiveUser("PresentadorRealm", userIdentity);
			WL.Logger.warn(userIdentity);
			WL.Logger.warn("User Identity  ::::::::::::::::::::::::");
		
			return {
				authRequired : false,
				role: olife.roles.role,
				group:	olife.groups.group,
				perfil: valida2
			};
		} else {
			return onAuthRequired(null, "Invalid login credentials");
			WL.Logger.warn("Invalid login credentials");
		}
	} else {
		WL.Logger.warn("Error en la petición");
		return onAuthRequired(null, "Invalid login credentials"); 
	}
}



function roles(FFVV){
	var resultRol = "NA";
	switch(FFVV){
	case "FFVV=Promotor":
			 resultRol = "Privado";
	break;
	case "FFVV=Agente":
			 resultRol = "Privado";
	break;
	case "FFVV=IndPubPromotor":	
		 resultRol = "Publico";
		break;
	case "FFVV=IndPubAgente":	
		 resultRol = "Publico";
		break;
	case "DN=Promotor":	
		 resultRol = "Publico";
		break;	
	case "DN=Agente":	
		 resultRol = "Publico";
		break;
	case "DN=Administrador":	
		 resultRol = "Publico";
		break;	
	default:
		resultRol = "NA";
		break;	
	}
	return resultRol;
}

function getSecret(){
userIdentity2 = WL.Server.getActiveUser();
WL.Logger.warn(userIdentity2);
WL.Logger.warn("::::::::::::::::::::::userIdentity2");
	return {
		secretData: JSON.stringify(userIdentity2)
	};
}

function onLogout() {
	WL.Server.setActiveUser("PresentadorRealm",null);
}


