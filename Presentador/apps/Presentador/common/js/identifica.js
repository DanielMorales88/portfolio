/**
 * 
 */
$(document).ready(function(){
	$("#btnProductos").click(function(){
		if(currentUser.type===0){//PUBLICO
			loadProductosPublico();
		}else{
			loadProductosPrivado();
		}
	});
	
});