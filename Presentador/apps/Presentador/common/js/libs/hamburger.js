/**
 * hamburger.js
 *
 * Mobile Menu Hamburger
 * =====================
 * A hamburger menu for mobile websites
 *
 * Created by Thomas Zinnbauer YMC AG  |  http://www.ymc.ch
 * Date: 21.05.13
 */
var proximamente = function () {
    var imgComingSoon = $('<img>', {id: 'theImg', src: 'images/ComingSoon.png', width: '75%'});
    modal.open({content: imgComingSoon, width: '75%'});
    //e.preventDefault();
};

var presentacion = function () {
    var imgComingSoon = $('<img>', {id: 'theImg', src: 'images/presentacion.jpg', width: '75%'});
    modal.open({content: imgComingSoon, width: '75%'});
    //e.preventDefault();
    
	/*
    $.get(path + "pages/slideshow.html", function(data){
		modal.open({content: data});
	});*/
};
var menuIsVisible = false;

var is_keyboard = false;
var initial_screen_size = window.innerHeight;

$(document).ready(function () {
	initial_screen_size = window.innerHeight;
    $("#navMenu").load(path + "pages/menu.html",function(){
    	$("#dialog-message").dialog({
    	    modal: true,
    	    draggable: false,
    	    resizable: false,
    	    position: ['center', 'top'],
    	    show: 'blind',
    	    hide: 'blind',
    	    width: 400,
    	    dialogClass: 'ui-dialog-osx',
    	    buttons: {
    	        "I've read and understand this": function() {
    	            $(this).dialog("close");
    	        }
    	    }
    	});
    });
    fixContentTo4_3();
    $(window).on('resize', function(){
        is_keyboard = (window.innerHeight < initial_screen_size);
        fixContentTo4_3();
    });
    $("input").bind("focus blur",function() {
        $(window).scrollTop(10);
        is_keyboard = $(window).scrollTop() > 0;
        $(window).scrollTop(0);
        fixContentTo4_3();
    });
    
    //$("#btnDesktop").click(loadDesktop);
    //Open the menu
    $("#hamburger").click(function () {
    	if(!menuIsVisible){
        	$('#content').css('min-height', $(window).height());

            $('nav').css('opacity', 1);

            //set the width of primary content container -> content should not scale while animating
            var contentWidth = $('#content').width();

            //set the content with the width that it has originally
            $('#content').css('width', contentWidth);

            //display a layer to disable clicking and scrolling on the content while menu is shown
            $('#contentLayer').css('display', 'block');

            //disable all scrolling on mobile devices while menu is shown
            $('#container').bind('touchmove', function (e) {
                e.preventDefault()
            });

            //set margin for the whole container with a jquery UI animation
            $("#container").animate({"marginLeft": ["25%", 'easeOutExpo']}, {
                duration: 70,
                complete: function () {
                	menuIsVisible=true;
                }
            });
    	}else{
    		$("#contentLayer").trigger( "click" );
    	}
    });

    /*
     $.get('ajax.html', function (data) {
     modal.open({content: data});
     });
     */
    //close the menu
    $("#contentLayer").click(function () {
    	//$('#contentLayer').css('background-color','none');
        //enable all scrolling on mobile devices when menu is closed
        $('#container').unbind('touchmove');

        //set margin for the whole container back to original state with a jquery UI animation
        $("#container").animate({"marginLeft": ["-1", 'easeOutExpo']}, {
            duration: 35,
            complete: function () {
                $('#content').css('width', '100%');
                $('#contentLayer').css('display', 'none');
                $('nav').css('opacity', 0);
                //$('#content').css('min-height', 'auto');
                menuIsVisible = false;
                
            }
        });
    });
});