var singleStepAuthRealmChallengeHandler = WL.Client.createChallengeHandler("PresentadorRealm");

singleStepAuthRealmChallengeHandler.isCustomResponse = function(response) {
	if (!response || !response.responseJSON	|| response.responseText === null) {
		return false;
	}
	if (typeof(response.responseJSON.authRequired) !== 'undefined'){
		return true;
	} else {
		return false;
	}
};


singleStepAuthRealmChallengeHandler.handleChallenge = function(response){
	var authRequired = response.responseJSON.authRequired;

	if (authRequired == true){
		if (response.responseJSON.errorMessage)
	    	alert("ERROR::::"+response.responseJSON.errorMessage);
	} else if (authRequired == false){
		//singleStepAuthRealmChallengeHandler.submitSuccess();
		alert("Acceso correcto");
		var perfil = response.responseJSON.perfil;
		var rol = response.responseJSON.role;
		var group = response.responseJSON.group;
		alert("user::"+perfil+" rol::"+rol+" group::"+group);
		if (perfil.toUpperCase() === "PRIVADO") {
			currentUser.type = 1;
			loadDesktop();
			WL.Client.logout('PresentadorRealm', {});
		} else if (perfil.toUpperCase() === "PUBLICO") {
			currentUser.type = 0;
			loadDesktop();
			WL.Client.logout('PresentadorRealm', {});
		} else {
			alert("Usuario incorrecto");
		}
	}
};