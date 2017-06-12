
/* JavaScript content from js/identifica.js in folder common */
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