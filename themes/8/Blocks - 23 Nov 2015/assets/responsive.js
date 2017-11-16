$( document ).ready(function() {
	//$('.navigation-bar ul.main-nav.navigation-menu > li:first-child > ul > li > ul li a').attr("href", "http://www.converse.com/us/en/dyo/design-your-own-chuck-taylor/146639C10.html?metricId=764913445");
	//$('.navigation-bar ul.main-nav.navigation-menu > li:first-child > ul > li > ul li a').attr("target", "_blank");
	//$('.navigation-bar ul.main-nav.navigation-menu > li a:contains("Policy")').hide();
	$('.navigation-bar ul.main-nav.navigation-menu > li a:contains("Home")').hide();

	$('.custom-data-collection:nth-child(2)').addClass('business-purpose');
	$('.custom-data-collection:nth-child(3)').addClass('personal-or-business');
	$('.personal-or-business').insertAfter('.custom-data-collection:nth-child(1)');
	$('.custom-data-collection:nth-child(4)').addClass('cost-center');
	$('.custom-data-collection:nth-child(5)').addClass('order-notes');
	$('.cost-center option[value="N/A"]').hide();
	
	$('select#website_order_custom_data_collections_attributes_72_custom_data_attributes_attributes_0_value > option:empty').text('Please choose an option...');
	// $('.custom-data-collection textarea').val('');

	function personal() {
			$('.checkout-cols .custom-data-collection:not(:first-child) .input.website_order_custom_data_collections_custom_data_value select').val("Personal");
            $('.checkout-cols .custom-data-collection:not(:first-child):not(.personal-or-business):not(.order-notes)').hide();
			$('#website_order_custom_data_collections_attributes_71_custom_data_attributes_attributes_0_value').val('N/A');
            $('.cost-center option[value="N/A"]').attr('selected', 'selected');
			$('.cost-center option[value="N/A"]').addClass('not-available');
	}
	
	function business() {
	        $('.checkout-cols .custom-data-collection').show();
            $('.checkout-cols .custom-data-collection:not(:first-child) .input.website_order_custom_data_collections_custom_data_value input').val("");
            $('.checkout-cols .custom-data-collection:not(:first-child) .input.website_order_custom_data_collections_custom_data_value select').val("Business");
			$('.cost-center option[value="N/A"]').hide();
			$('.business-purpose textarea').val('');
	}
		// CUSTOM DATA COLLECTIONS
    $('#website_order_custom_data_collections_attributes_72_custom_data_attributes_attributes_0_value').change(function(){
        // console.log( $(this).val());
        if( $(this).val() == "Business" ) {
			business();
        } else if( $(this).val() == 'Personal') {
			personal();
        }

    });

			
	$(function() { 
		if( $('#website_order_custom_data_collections_attributes_72_custom_data_attributes_attributes_0_value').val() == "Personal") {
		  personal();
		}
	});
	
	// TOP NAVIGATION SLIDE
	$( "#dropdown" ).click(function() {

		if($('#top-menu').is(':hidden')){
			$("#open").fadeToggle("slow","linear", function(){
				$("#close").fadeToggle("slow","linear");
			});
		}else{
			$("#close").fadeToggle("slow","linear", function(){
				$("#open").fadeToggle("slow","linear");
			});
		}

		$("#top-menu").slideToggle("slow","linear");

	});

	// SEARCH
	$("#searchdropdown").click(function(){
		$("#search").slideToggle("slow", "linear");
	});

	// FILTERING
	$("#filter-button").click(function(){
		if($('#filter-system').is(':hidden')){
			$('#filter-system').slideToggle("slow", "linear");
			$("#filter-button").html("Filter <i class='fa fa-chevron-up'></i>");
		}else{
			$('#filter-system').slideToggle("slow", "linear");
			$("#filter-button").html("Filter <i class='fa fa-chevron-down'></i>");
		}
	});
	
	// SLIPPRY SLIDESHOW
	$('#slippry_slideshow').slippry({
		
	});
	
	

	// CATEGORY DROPDOWN IMAGE
	/*$( ".category-navigation .container ul.level-0 li" ).has( "ul" ).addClass("hasDrop");



	function fix_nav(){
		var newLeft;
		$(".category-navigation .container ul.level-0 li" ).has( "ul" ).hover(
			function(){
				newLeft = $(this).offset().left;
				$(this).find( "ul.level-1" ).css("left", newLeft);
			});
	}*/

	// SET COOKIE
	checkCookie();
});



function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

// GET COOKIE
function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i=0; i<ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1);
		if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
	}
	return "";
}

// CHECK COOKIE
function checkCookie() {
	var clicked=getCookie("clicked");
	if (clicked=="true") {
		console.log("clicked");
		$("#privacy_policy").hide();
		$("html, body").css("overflow-y","scroll");
	}else{
		console.log("not clicked");
		$("#privacy_policy").show();
	}
}

function clicked(){
	setCookie("clicked", "true", "30");
	checkCookie();
}

