
/* JavaScript content from js/libs/fixContentTo4_3.js in folder common */
/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var fixBackgroundDesktop= function (){
    /*var aspectRatio = $(window).width() / screenHeight;
    if (aspectRatio === 4 / 3) {
        //16:10
        var heightBackground =  screenHeight * 0.67;
        $('#content').css('background-size', screenHeight * 1.6 + 'px ' +  screenHeight + 'px');
    }*/
};

var fixContentTo4_3 = function (){
    $('#content').css('min-height',  screenHeight);
    $('#hamburger').css('top',  screenHeight * 0.88);
    $('#rightSide').css('height',  screenHeight);
    $('#leftSide').css('height',  screenHeight);
    $('#escritorio').css('width',  screenHeight * (4 / 3));
};