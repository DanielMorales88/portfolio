
/* JavaScript content from js/cotizaMet99.js in folder common */

/* JavaScript content from js/cotizaMet99.js in folder common */
var titular = {
    edad : 0,
    genero : "",
    fumador : false,
    sumaAsegurada : 0
};
var garantiaEscolarValues = {
    edad : 0,
    genero : 'H',
sumaAsegurada:0
};
var funerariosConyugeObj = {
    edad : 0,
    genero : 'H'
};
var sumaTitular;
var currentCoverage;
var arrayCoberturas = [];

var currentChecked;

var updateSumaAsegurada2 = function(reference) {
    var newValue = $(reference).text().replace('$', '').replace(',', '');
    garantiaEscolarValues.sumaAsegurada  = $(newValue).val();
    $("#sumaAseguradaGarantiaTxt").val(newValue);
};

var updateArrayWithNewPrice = function(newPrice) {
    var newArrayCov = [];
    $.each(arrayCoberturas, function(index, cover) {
           if(cover.ide==="garantiaEscolarForm"){
           newArrayCov.push(cover);
           }else{
           var coverageToAdd = {
           age : cover.age,
           coverage : cover.coverage,
           descriptionName : cover.descriptionName,
           gender : cover.gender,
           ide : cover.ide,
           rate : newPrice,
           smoker : cover.smoker
           };
           newArrayCov.push(coverageToAdd);
           }
           });
    arrayCoberturas = newArrayCov;
    updatePagoQuincenal();
};
var deleteCobertura = function(item){

    var newArrayCov = [];
    //console.log("Item a borrar " + JSON.stringify(item));
    $.each(arrayCoberturas, function(index, cover) {
           if (cover.ide !== item.formName) {
           //console.log("Borrando " + JSON.stringify(cover));
           /*} else {*/
           newArrayCov.push(cover);
           }
           // alert( index + ": " + value );
           });
    arrayCoberturas = newArrayCov;
    updatePagoQuincenal();
};

var getBtnChecked = function(btn){
    if (WL.Client.getEnvironment() == WL.Environment.ANDROID) {
        return btn.is(":checked");
    }
    else{
        if(btn.hasClass("switch-on")){
            btn.removeClass("switch-on");
            btn.addClass("switch-off");
            return false;
        }else{
            btn.removeClass("switch-off");
            btn.addClass("switch-on");
            return true;
        }
    }
}

var getCoberturaTitular = function(ide){
    var items = coberturas[0].items;
    var foundCover = null;
    $.each(items, function(index, cover) {
        if(cover["formName"]===ide){
           foundCover =  cover;
        }
    });
    return foundCover;
};
var titularEvent = function(excluir,ide){
    if (WL.Client.getEnvironment() == WL.Environment.ANDROID) {
        if($("#"+excluir).is(":checked")){
            $("#"+ide).prop("checked", false);
        }else{
            updateTitular($("#"+ide), getCoberturaTitular(ide));
        }
    }else{
        if($("#"+excluir).hasClass("switch-on")){
            $("#"+ide).removeClass("switch-on");
            $("#"+ide).addClass("switch-off");
        }else{
            updateTitular($("#"+ide), getCoberturaTitular(ide));
        }
    }
};

var updateTitular = function (checkedItem, item) {
    if (getBtnChecked(checkedItem)) {
        // Agrega coberturas del titular
        var coverageToAdd = {
            rate : parseInt($('#price').val()),
            gender : esHombre ? 'H' : 'M',
            smoker : titular.fumador ? 1 : 0,
            coverage : item.coverage,
            age : parseInt(titular.edad),
            ide : item.formName,
            descriptionName : item.name
        };
        arrayCoberturas.push(coverageToAdd);
        // alert("Covertura: " + JSON.stringify(arrayCoberturas));

        updatePagoQuincenal();

    } else {
        deleteCobertura(item);
    }
};
var updateListCoverage = function(checkedItem, item) {
    if ('event' in item) {
        hasEvent =true;
        currentCoverage = item;
        currentChecked = $(checkedItem).attr('id');
        $.globalEval(item.event);
    }else{
        updateTitular(checkedItem, item);
    }
};
var createToggle = function(item) {
    if (WL.Client.getEnvironment() == WL.Environment.ANDROID) {
        var label = $("<label/>", {
                      "class" : "switch"
                      });
        var checkBx = $("<input/>", {
                        "type" : "checkbox",
                        "class" : "switch-input",
                        "name" : item.formName,
                        "id" : item.formName
                        });
        label.append(checkBx);
        if (event !== "") {
            $(checkBx).change(function() {
                updateListCoverage($(this), item);
            });
        }
        if (item.defecto)
            $(checkBx).attr('disabled', '');

        label.append($("<span/>", {
                       "class" : "switch-label fa"
                       }));
        label.append($("<span/>", {
                       "class" : "switch-handle"
                       }));
        if (item.checked) {
            $(checkBx).prop("checked", true);
            if(!checkMaxAgeList(item)){
                addDefaultTitular(item,checkBx);
            }
        }
        return label;
    }else{
        var checkBx = $("<button/>", {
                        "class" : "switch-off",
                        "name" : item.formName,
                        "id" : item.formName
                        });
        if (event !== "") {
            $(checkBx).click(function() {
                updateListCoverage($(this), item);
            });
        }
        if (item.defecto)
            $(checkBx).prop("disabled", true);

        if (item.checked) {
            if(!checkMaxAgeList(item)){
                addDefaultTitular(item,checkBx);
            }
        }
        return checkBx;
    }

};
var checkMaxAgeList = function(item){
    var edadTitular = $("#edadTitularTxt").val();
    var hasMaxAge = item.hasOwnProperty('maxAge');
    if(hasMaxAge && edadTitular>item.maxAge)
        return true;
    else
        return false;
};
var paso = 1;

var funeralConyuge = function() {
    if(getBtnChecked($("#funerariosConyuge"))){
        // alert("Funeral conyuge");
        paso = 3;
        $("#steperOptions").hide();
        $("#coberturaList").hide();
        $("#datosConyuge").show();
    }else{
        deleteCobertura({formName:"funerariosConyuge"});
        updatePagoQuincenal();
    }
};
var funeralHijos = function() {
    var garantiaCobChecked= getBtnChecked($("#fallecimientoHijos"));

    console.log("garantiaEscolar "+garantiaCobChecked);

    if(garantiaCobChecked){
        paso = 3;
        $("#steperOptions").hide();
        $("#coberturaList").hide();
        $("#funerariosHijo").show();
    }else{
        deleteCobertura({formName:"fallecimientoHijos"});
        updatePagoQuincenal();
    }
};
var garantiaEscolar = function() {
    var garantiaCobChecked= getBtnChecked($("#garantiaEscolarForm"));

    console.log("garantiaEscolar "+garantiaCobChecked);

    if(garantiaCobChecked){
        paso = 3;
        $("#steperOptions").hide();
        $("#coberturaList").hide();
        $("#sCGarantiaEscolar").show();
    }else{
        deleteCobertura({formName:"garantiaEscolarForm"});
        updatePagoQuincenal();
    }
};
var complementarias = function() {
    if(getBtnChecked($("#fallecimientoComplementario"))){
        paso = 3;
        $("#steperOptions").hide();
        $("#coberturaList").hide();
        $("#complementario").show();
    }else{
        deleteCobertura({formName:"fallecimientoComplementario"});
        updatePagoQuincenal();
    }
};
var cancerComplementario = function() {
    paso = 3;
    currentChecked = "cancerComplementario";
    $("#steperOptions").hide();
    $("#coberturaList").hide();
    $("#complementarioCancer").show();
    $("#complementariosCancer1").show();
    $("#cancerCompInfo1").hide();
    $("#cancerCompInfo2").hide();
    $("#cancerCompInfo3").hide();

};
var funeralComplementarios = function() {
    paso = 3;
    $("#steperOptions").hide();
    $("#coberturaList").hide();
    $("#gastosFunerariosComplementarios").show();
};

var accidenteComplementarios = function() {
    paso = 3;
    $("#steperOptions").hide();
    $("#coberturaList").hide();
    $("#accidentes").show();
};

var cancerComp = function(hijo) {
    console.log("cancerComp hijo:"+hijo);
    var cancerCobChecked = getBtnChecked($("#cancerComp"+hijo));
    cancerComplementarioList.items[hijo].checked = cancerCobChecked;
    if(cancerCobChecked){
        paso = 4;
        $("#complementariosCancer1").hide();
        $("#complementariosCancer2").show();
        $("#cancerCompInfo" + hijo).show();
    }else{
        currentChecked = "cancerComplementario";
    }
};

//85 75 29 82
var accidenteComp = function(hijo){
    //console.log("accidenteComp "+hijo);
    var funeralHijoIde = "accidenteComp"+hijo;
    var isSelectedThis = getBtnChecked($("#"+funeralHijoIde));
    if (isSelectedThis){
        $("#"+funeralHijoIde+"DivTxt").removeClass("itemHidden");
    } else {
        $("#"+funeralHijoIde+"DivTxt").addClass("itemHidden");
    }
    accidentesPersonales.items[hijo-1].checked = isSelectedThis;
    currentChecked = "accidentesComplementario";
};

var addSubItem = function(newCover){
    var noEncontrado = true;
    $.each(arrayCoberturas, function(index, cover) {
           if(newCover.formName === cover.ide){
           noEncontrado = false;
           //console.log("addSubItem Encontrado");
           }
           });
    if(noEncontrado){
        var coverageToAdd = {
            rate : parseInt($('#price').val()),
            gender : esHombre ? 'H' : 'M',
            smoker : titular.fumador ? 1 : 0,
            coverage : newCover.coverage,
            age : parseInt($("#edadTitularTxt").val()),
            ide : newCover.formName,
            descriptionName : newCover.name
        };

        arrayCoberturas.push(coverageToAdd);
    }
};
var funeralComp = function(hijo){
    var funeralCompIde = "funeralComp"+hijo;
    var isSelectedThis = getBtnChecked($("#"+funeralCompIde));
    if (isSelectedThis){
        $("#"+funeralCompIde+"DivTxt").removeClass("itemHidden");
    } else {
        $("#"+funeralCompIde+"DivTxt").addClass("itemHidden");
    }
    funerariosComplementarioList.items[hijo-1].checked = isSelectedThis;
    currentChecked = "funerarioComplementario";
    ////console.log(JSON.stringify(funerariosComplementarioList.items));
};

var methodShowModalEdad = function() {
    alert("Recuerdad que la edad de contratación es de 15 a 60 años");
};
var methodShowModalSuma = function() {
    alert("Selecciona una suma asegurada");
};
var serializeForm = function(form) {
    var obj = {};
    var formElement = $(form).serializeArray();
    formElement.forEach(function(element) {
                        if (element.name !== '') {
                        obj[element.name] = element.value === "on" ? 1 : element.value;
                        }
                        });
    return obj;
};
var updatePagoQuincenal = function() {
    console.log(JSON.stringify(arrayCoberturas));
    getBiweeklyFee(arrayCoberturas, function(finalFee) {
                   // alert(finalFee);
                   $("#pagoQuincenalText").html(finalFee);
                   $("#pagoQuincenalFinal").text(finalFee);
                   });
};
var addDefaultTitular = function(itm,checkBx) {
    if (WL.Client.getEnvironment() == WL.Environment.IPAD) {
        checkBx.removeClass("switch-off");
        checkBx.addClass("switch-on");
    }
    var obj1 = {
        rate : parseInt($('#price').val()),
        gender : esHombre ? 'H' : 'M',
        smoker : titular.fumador ? 1 : 0,
        coverage : itm.coverage,
        age : parseInt(titular.edad),
        ide : itm.formName,
        descriptionName : itm.name
    };
    arrayCoberturas.push(obj1);
    // alert("añadidas: " + JSON.stringify(arrayCoberturas));
    updatePagoQuincenal();
};
var showFirstScreenStep = function (cancelar){
    $("#coberturaList").show();
    $("#steperOptions").show();
    $("#datosConyuge").hide();
    $("#funerariosHijo").hide();
    $("#sCGarantiaEscolar").hide();
    $("#complementarioCancer").hide();
    $("#complementario").hide();
    $("#gastosFunerariosComplementarios").hide();
    $("#accidentes").hide();
    if (cancelar) {
        //console.log("cancelado "+currentChecked);
        if (WL.Client.getEnvironment() == WL.Environment.ANDROID) {
            $("#" + currentChecked).prop("checked", false);
        }else{
            if($("#" + currentChecked).hasClass("switch-on")){
                $("#" + currentChecked).removeClass("switch-on");
                $("#" + currentChecked).addClass("switch-off");
            }
        }
    }
};
var paso1 = function(cancelar) {
    //console.log("paso1 "+paso+" current"+currentChecked);
    switch (paso) {
        case 2:
            /*
             * $("#paso2").hide(); $("#paso1").show();
             */
            if (cancelar) {
                loadCotizaMet99();
            }else{
                showFirstScreenStep(cancelar);
            }
            break;
        case 3:
            showFirstScreenStep(cancelar);
            break;
        case 4:
            if (currentChecked.indexOf("cancerComp") >= 0) {
                $("#" + currentChecked).prop("checked", cancelar);
                validarCancerComplementario();
            }
            break;
    }
};
var validarFunerariosConyuge = function (){
    // Anexo 1.5
    var edadStr = $('#edadFunerariosConyuge').val();
    var edad = parseInt(edadStr);
    //alert("validarPaso " + edadStr + " "+edad);

    if (edad < 15 || edad > 60) {
        alert("No cumple con el rango de edad");
    } else {
        funerariosConyugeObj.edad = edad;
        var obj1 = {
            rate : parseInt($('#price').val()),
            gender : 'H',//funerariosConyugeObj.genero,
            smoker : 1,
            coverage : "GFT",
            age : funerariosConyugeObj.edad,
            ide : "funerariosConyuge",
            descriptionName : "Gastos funerarios Conyuge"
        };
        arrayCoberturas.push(obj1);
        //console.log("Metiendo "+JSON.stringify(obj1));
        updatePagoQuincenal();

        paso=2;
        paso1(false);
    }
};

var validarFunerariosHijos = function (){
    var contadorHijos = $("#hijosFunerariosN").val();
    if(contadorHijos!==0){
        var coverageToAdd = {
            rate : parseInt($('#price').val()),
            gender : esHombre ? 'H' : 'M',
            smoker : titular.fumador ? 1 : 0,
            coverage : "GFH"+contadorHijos,
            age : 18,
            ide : "fallecimientoHijos",
            descriptionName : "Gastos funerarios hijos ("+contadorHijos+")",
        };
        console.log("funerarios hijos: "+JSON.stringify(coverageToAdd));
        arrayCoberturas.push(coverageToAdd);
        updatePagoQuincenal();
    }

    paso=2;
    paso1(false);
};

/*-------*/
var addFunCompItem = function(newCover){
    console.log(JSON.stringify(newCover));
    var noEncontrado = true;
    $.each(arrayCoberturas, function(index, cover) {
           if(newCover.formName === cover.ide){
           noEncontrado = false;
           console.log("addSubItem Encontrado");
           }
           });
    if(noEncontrado){
        var obj3 = {
            rate : parseInt($('#price').val()),
            gender : 'H',
            smoker : 1,
            coverage : "GFT",
            age : newCover.obj.edad,
            ide : newCover.formName,
            descriptionName : "Gastos funerarios Complementario"
        };
        console.log(JSON.stringify(obj3));
        arrayCoberturas.push(obj3);
    }
};
var addFunComplementarios = function(){
    //console.log(JSON.stringify(cancerComplementarioList));
    $.each(funerariosComplementarioList.items, function(i, cover) {
           if(cover.checked){
           addFunCompItem(cover);
           }else{
           deleteCobertura(cover);
           }
           });
};
/*------*/

var validarFunerariosComp = function (){

    var error = false;
    $.each(funerariosComplementarioList.items, function(i, cover) {
           if (cover.checked) {
           cover.obj.edad=$("#"+cover.formName+"Txt").val();
           if(cover.obj.edad<15){
           alert("Ingrese una edad valida para el complementario");
           error = true;
           }
           }
           });

    if(!error){
        addFunComplementarios();
        updatePagoQuincenal();
        paso=2;
        var regresar=isEmptyArray(funerariosComplementarioList.items);
        $("#funerarioComplementario").prop("checked", !regresar);
        paso1(false);

    }
};


var validarAccidentesComp= function (){
    var error = false;
    $.each(accidentesPersonales.items, function(i, cover) {
           if (cover.checked) {
           cover.obj.edad=$("#"+cover.formName+"Txt").val();
           console.log("validarAccidentesComp "+JSON.stringify(cover));
           if(cover.obj.edad<15){
           alert("Ingrese una edad valida para el complementario");
           error = true;
           }
           }
           });
    if(!error){
        $.each(accidentesPersonales.items, function(i, cover) {
               if(cover.checked){
               var obj1 = {
               rate : parseInt($('#price').val()),
               gender : 'H',
               smoker : 1,
               coverage : cover.coverage,
               age : cover.obj.edad,
               ide : cover.formName,
               descriptionName : "Accidentes Personales (APX) "
               };
               arrayCoberturas.push(obj1);
               ////console.log("Metiendo "+JSON.stringify(obj1));
               }else{
               deleteCobertura(cover);
               }
               });
        updatePagoQuincenal();
        paso=2;
        paso1(false);
    }
};
var validarFallecimientoComplementario = function (){
    var edadComplementarioStr = $("#edadComplementario").val();
    var edadComplementario = parseInt(edadComplementarioStr);
    if(edadComplementario<15 || edadComplementario >60){
        alert("Verifique el rango de edad");
    }else{
        var obj1 = {
            rate : parseInt($('#price').val()),
            gender : 'H',
            smoker : 1,
            coverage : "BAS",
            age : parseInt(edadComplementario),
            ide : "fallecimientoComplementario",
            descriptionName : "Fallecimiento Complementario"
        };
        arrayCoberturas.push(obj1);
        //console.log("Metiendo "+JSON.stringify(obj1));
        updatePagoQuincenal();
        paso=2;
        paso1(false);
    }
};
var addGarantiaEscolar = function(){
    var obj1 = {
        //Usar datos del titular
        rate : parseInt($("#sumaAseguradaGarantiaTxt").val()),
        gender : esHombre ? 'H' : 'M',//garantiaEscolarValues.genero,
        smoker : titular.fumador ? 1 : 0,
        coverage : "GE",
        age : parseInt(titular.edad),//parseInt(garantiaEscolarValues.edad),
        ide : "garantiaEscolarForm",
        descriptionName : "Garantia Escolar"
    };
    arrayCoberturas.push(obj1);
    //console.log("Metiendo "+JSON.stringify(obj1));
};
var validarGarantiaEscolar = function (){
    addGarantiaEscolar();
    updatePagoQuincenal();
    paso=2;
    paso1(false);
};
var addCancerItem = function(newCover){
    //console.log(JSON.stringify(newCover));
    var noEncontrado = true;
    $.each(arrayCoberturas, function(index, cover) {
           if(newCover.formName === cover.ide){
           noEncontrado = false;
           //console.log("addSubItem Encontrado");
           }
           });
    if(noEncontrado){
        var edadItmCancer ;
        if(newCover.formName==="cancerTitular"){
            edadItmCancer=parseInt(titular.edad);
        }else{
            edadItmCancer=parseInt(newCover.obj.edad);
        }
        var obj3 = {
            rate : parseInt($('#price').val()),
            gender : newCover.obj.genero,
            smoker : titular.fumador ? 1 : 0,
            coverage : "CAT",
            age : edadItmCancer,
            ide : newCover.formName,
            descriptionName : "Cáncer Complementario"
        };
        console.log(JSON.stringify(obj3));
        arrayCoberturas.push(obj3);
    }
};
var addCancerComplementarios = function(){
    //console.log(JSON.stringify(cancerComplementarioList));
    $.each(cancerComplementarioList.items, function(i, cover) {
           if(cover.checked){
           addCancerItem(cover);
           }else{
           deleteCobertura(cover);
           }
           });
};

var isEmptyArray = function(myArray){
    console.log(JSON.stringify(myArray));
    var counterComp = 0;
    $.each(myArray, function(i, cover) {
           if(cover.checked){
           counterComp++;
           }
           });
    return counterComp===0?true:false;
};

var validarCancerComplementario = function (){
    console.log("validarCancerComplementario currentChecked "+currentChecked);
    if(currentChecked==="cancerComplementario"||currentChecked==="cancerTitular"){
        addCancerComplementarios();
        updatePagoQuincenal();
        paso=2;
        var regresar=isEmptyArray(cancerComplementarioList.items);
        $("#cancerComplementario").prop("checked", !regresar);
        paso1(false);
    }else{
        var index = parseInt(currentChecked.slice(-1));
        cancerComplementarioList.items[index].checked = false;
        $("#"+currentChecked).prop("checked", false);
        cancerComplementario();
    }
};

var validarSegundoPaso = function(ide) {
    //console.log(ide);
    if (currentChecked.indexOf("cancerComp") >= 0) {
        //$("#" + currentChecked).prop("checked", cancelar);
        var edadCancerStr = $("#"+currentChecked+"EdadTxt").val();
        var edadCancer = parseInt(edadCancerStr);
        if(edadCancer<15 || edadCancer >65){
            alert("El rango de edad no es valido");
        }else{
            var index = parseInt(ide.slice(-1));
            cancerComplementarioList.items[index].obj.edad = edadCancer;
            cancerComplementario();
        }
    }
};
var validarPaso = function(ide) {
    //console.log(ide);
    switch(ide){
        case "cancerComplementario":
            validarCancerComplementario();
            break;
        case "garantiaEscolarForm":
            // Anexo 1.5
            validarGarantiaEscolar();
            break;
        case "funerariosConyuge":
            validarFunerariosConyuge();
            break;
        case "fallecimientoHijos":
            validarFunerariosHijos();
            break;
        case "fallecimientoComplementario":
            //Solo edad
            validarFallecimientoComplementario();
            break;
        case "funerarioComplementario":
            validarFunerariosComp();
            break;
        case "accidentesComplementario":
            validarAccidentesComp();
            break;
    }

};

var updateResultadoFinal = function() {
    //console.log("updateResultadoFinal");
    $.each(arrayCoberturas, function(idx2, cover) {
           var itm = $("<a/>", {
                       "class" : "list-group-item"
                       }).append($("<span/>",{"class":"customSpan",
                                   "text" : cover.descriptionName,"style":"margin-left:10px;"}));
           $("#totalSeleccionados").append(itm);
           });
};
var continuar = function() {
    //console.log(JSON.stringify(arrayCoberturas));
    //console.log("continuar paso "+paso)
    switch (paso) {
        case 2:
            $("#paso2").hide();
            $("#pasoFinal").show();
            updateResultadoFinal();

            break;
        case 3:
            // alert();
            validarPaso(currentChecked);
            break;
        case 4:
            validarSegundoPaso(currentChecked);
            break;
        default:
            break;
    }
};

$(".input-number").keydown(
                           function(e) {
                           // Allow: backspace, delete, tab, escape, enter and .
                           if ($.inArray(e.keyCode, [ 46, 8, 9, 27, 13, 190 ]) !== -1 ||
                               // Allow: Ctrl+A
                               (e.keyCode == 65 || e.ctrlKey === true) ||
                               // Allow: home, end, left, right
                               (e.keyCode >= 35 || e.keyCode <= 39)) {
                           // let it happen, don't do anything
                           return;
                           }
                           // Ensure that it is a number and stop the keypress
                           if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                           e.preventDefault();
                           }
                           });
var makeListGroup = function(items, selectable,txtField) {

    var listGroup = $('<div/>', {
                      "class" : "list-group",
                      });
    $.each(items, function(idx2, item) {
           var hasImage = item.hasOwnProperty('image');
           var listItem = $("<div/>", {
                            "class" : "list-group-item clear-fix" + (!selectable ? " list-gpi2" : ""),
                            "id":"itemList"+item.formName
                            });

           if (hasImage) {
           var imageItem = $("<div/>", {
                             "class" : "col-xs-1  v-center"
                             }).append($("<span/>", {
                                         "class" : "customSpan"
                                         }).append($("<img/>", {
                                                     "src" : "images/icons/" + item.image,
                                                     "style" : "width:20px;height:20px;margin-left:10px;"
                                                     })));
           $(listItem).append(imageItem);
           }

           var title = $("<div/>", {
                         "class" : hasImage ? "col-xs-7  v-center" : "col-xs-8  v-center"
                         });
           var span = $("<div/>", {
                        "class" : "col-xs-4  v-center"
                        });
           var titleSpan = $("<span/>", {
                             "text" : item.name,
                             "class" : "customSpan"
                             });
           titleSpan.appendTo(title);

           $(listItem).append(title);

           var rightContent = $("<span/>", {
                                "class" : "customSpan"
                                }).append(createToggle(item));
           rightContent.appendTo(span);

           span.appendTo(listItem);
           listItem.appendTo(listGroup);

           if(txtField){
           var listItem2 = $("<div/>", {
                             "class" : "list-group-item list-gpi2 itemHidden clear-fix","id":item.formName+"DivTxt"
                             });
           var inputTxt = $("<input/>",{"type":"number","placeholder":"Edad","id":item.formName+"Txt"});
           listItem2.append(inputTxt);
           listItem2.appendTo(listGroup);
           }
           if(checkMaxAgeList(item))
           listItem.addClass("itemHidden");

           });
    return listGroup;
};

var populateCoberturas = function() {
    $("#accordion").empty();
    $.each(coberturas, function(idx, cob) {
           var panelTitle = $('<h3/>', {
                              "text" : " " + cob.name,
                              "id"  : cob.ide
                              });

           var listGroup = makeListGroup(cob.items, false,false);

           panelTitle.appendTo("#accordion");
           listGroup.appendTo("#accordion");
           });
    var icons = {
        header : "fa fa-angle-down fa-iconXl",
        activeHeader : "fa fa-angle-up fa-iconXl"
    };
    $("#accordion").accordion({
                              collapsible : true,
                              icons : icons,
                              heightStyle : "content"
                              });
    $("#accordion").addClass("overthrow");
    $("#h3Titular").click();

};
var esFumador = false;
var esHombre = true;

var updateGeneroVar = function(ide, valor) {
    //console.log("UpdateGeneroVar - ide "+ide+" valor "+valor);
    switch (ide) {
        case "generoCliente":
            esHombre = valor;
            break;
        case "generoFunerariosConyuge":
            //console.log("updateGeneroVar "+valor);
            funerariosConyugeObj.genero = valor ? 'H' : 'M';
            break;
        case "generoCancerComplementario1":
        case "generoCancerComplementario2":
        case "generoCancerComplementario3":
            var index = parseInt(ide.slice(-1));
            cancerComplementarioList.items[index].obj.genero = valor ? 'H' : 'M';
            break;
    }
};
var updateSumaAsegurada = function(reference) {
    var newValue = $(reference).text().replace('$', '');
    titular.sumaAsegurada = $(newValue).val();
    $("#price").val(newValue);
    $("#sumaAseguradaFinal").text("$"+newValue);
    $("#sumaAseguradaTit").text("$"+newValue);
};
var firstScreen = function() {
    $("#paso1").on('submit', function(event) {
                   event.preventDefault();
                   var edadTit = $("#edadTitularTxt").val() ;//serializeForm(this)["edad"];
                   if (edadTit < 15 || edadTit > 60) {
                   methodShowModalEdad();
                   }else{
                   if (titular.sumaAsegurada != "0") {
                   $(this).hide();
                   $("#paso2").show();
                   titular.edad = edadTit;
                   paso = 2;
                   populateCoberturas();
                   } else {
                   methodShowModalSuma();
                   }
                   }
                   });
    $("#pasoFinal").on('submit', function(event) {
                       event.preventDefault();
                       loadIdentifica();
                       });
    $('#sumaAseguradaList a').click(function(e) {
                                    $(this).siblings().removeClass("active");
                                    $(this).addClass("active");
                                    $(this).scroll();
                                    updateSumaAsegurada(this);
                                    });
    $('#sumaAseguradaGarantia a').click(function(e) {
                                        $(this).siblings().removeClass("active");
                                        $(this).addClass("active");
                                        updateSumaAsegurada2(this);
                                        });

    $('.genero img').click(function(e) {
                           $(this).siblings().removeClass("avatar");
                           $(this).addClass("avatar");
                           var parentId = $(this).closest('div').attr('id');
                           if ($(this).hasClass("mujer") && $(this).hasClass("avatar")) {
                           updateGeneroVar(parentId, false);
                           } else {
                           updateGeneroVar(parentId, true);
                           }
                           // alert("Es hombre:"+esHombre);
                           });
    $('#esFumador').click(function(e) {
                          esFumador = !esFumador;
                          if (esFumador) {
                          $(this).addClass("avatar");
                          titular.fumador = 1;
                          } else {
                          $(this).removeClass("avatar");
                          titular.fumador = 0;
                          }
                          });
};
var secondScreen = function() {
    $("#paso2").on('submit', function(event) {
                   event.preventDefault();
                   // alert(JSON.stringify(serializeForm(this)));
                   // proximamente();
                   });
    $("#paso2").hide();

    $('#price').on('change', function() {
                   // //console.log('Change event.');
                   var val = $('#price').val();
                   // $('#price').text(val !== '' ? val : '(empty)');
                   titular.sumaAsegurada = val;
                   });
    $('#price').number(true, 2);
};

/*var populateComplementariosFuneralHijos = function() {
	var panelTitle1 = $('<h3/>', {
 "text" : " " + complementariosFunerariosHijos.name
	});

	var listGroup1 = makeListGroup(complementariosFunerariosHijos.items, false,false);

	panelTitle1.appendTo("#complementariosFuneralHijos");
	listGroup1.appendTo("#complementariosFuneralHijos");
 };*/
var populateComplementariosCancer = function() {
    var panelTitle1 = $('<h3/>', {
                        "text" : " " + cancerComplementarioList.name
                        });

    var listGroup1 = makeListGroup(cancerComplementarioList.items, false,false);
    panelTitle1.appendTo("#complementariosCancer1");
    listGroup1.appendTo("#complementariosCancer1");

    for (var i = 1; i < 4; i++) {
        var rowWrapperComp = $("<div/>", {
                               "id" : "cancerCompInfo" + i
                               });
        var rowGender = $("<div/>", {
                          "class" : "row"
                          });
        var genderCompDiv = $("<div/>", {
                              "class" : "genero col-xs-12",
                              "style" : "text-align: center;",
                              "id" : "generoCancerComplementario" + i
                              });
        var genderCompImg1 = $("<img/>", {
                               "class" : "hombre avatar",
                               "src" : "images/charlie.png",
                               "style" : "height: 130px; margin: auto;"
                               });
        var genderCompImg2 = $("<img/>", {
                               "class" : "mujer",
                               "src" : "images/lucy.png",
                               "style" : "height: 130px; margin-left: 10px"
                               });

        genderCompDiv.appendTo(rowGender);
        genderCompImg1.appendTo(genderCompDiv);
        genderCompImg2.appendTo(genderCompDiv);

        var rowAge = $("<div/>", {
                       "class" : "row",
                       "style" : "margin-top: 5vh;"
                       });
        var ageCompDiv = $("<div/>", {
                           "class" : "col-xs-12"
                           });
        var ageCompInput = $("<input/>", {
                             "type" : "number",
                             "class" : "form-controll",
                             "placeholder" : "Edad",
                             "id" : "cancerComp" + i+"EdadTxt"
                             });

        ageCompDiv.appendTo(rowAge);
        ageCompInput.appendTo(ageCompDiv);

        var tittleComp = $("<h3/>", {
                           "text" : "Cancer complementario " + i
                           });

        rowWrapperComp.append(tittleComp);
        rowWrapperComp.append(rowGender);
        rowWrapperComp.append(rowAge);

        rowWrapperComp.appendTo("#complementariosCancer2");
    }

};
var populateFunerariosComplementarios = function() {
    var panelTitle1 = $('<h3/>', {
                        "text" : " " + funerariosComplementarioList.name
                        });

    var listGroup1 = makeListGroup(funerariosComplementarioList.items, false,true);
    panelTitle1.appendTo("#gastosFunerariosComplementarios2");
    listGroup1.appendTo("#gastosFunerariosComplementarios2");

};

var populateAccidentes = function() {
    var panelTitle1 = $('<h3/>', {
                        "text" : " " + accidentesPersonales.name
                        });

    var listGroup1 = makeListGroup(accidentesPersonales.items, false,true);
    panelTitle1.appendTo("#accidentes2");
    listGroup1.appendTo("#accidentes2");

};

var changePrice = function (valueToAdd){
    var currentPrice = $("#price").val();
    var newPrice = parseInt(currentPrice) + parseInt(valueToAdd);
    if(newPrice>=150000 && newPrice<=500000){
        console.log("Nuevo precio "+newPrice);
        $("#price").val(newPrice);
        $("#sumaAseguradaTit").text('$' + parseFloat(newPrice, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,").toString());
        updateArrayWithNewPrice(newPrice);
    }

};

$(document).ready(function() {
                  console.log("Empezando cotizador");
                  $(document).delegate(".ui-content", "scrollstart", false);
                  $("#pasoFinal").hide();
                  //populateComplementariosFuneralHijos();
                  populateComplementariosCancer();
                  populateFunerariosComplementarios();
                  //populateComplementarios();
                  populateAccidentes();
                  firstScreen();
                  secondScreen();

                  });
