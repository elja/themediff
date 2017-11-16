$( document ).ready(function() {
	
	$('ul.main-nav.navigation-menu > li > a:contains("Home")').hide();
	
	// CUSTOM DATA COLLECTIONS
    $('.checkout-main .checkout-cols .custom-data-collection:first-child select#website_order_custom_data_collections_attributes_41_custom_data_attributes_attributes_0_value').change(function(){
        // console.log( $(this).val());
        if( $(this).val() == "Business" ){
            $('.checkout-cols .custom-data-collection').show();
            $('.checkout-cols .custom-data-collection:not(:first-child) .input.website_order_custom_data_collections_custom_data_value input').val("");
            $('.checkout-cols .custom-data-collection:not(:first-child) .input.website_order_custom_data_collections_custom_data_value select').val("");
			$('.checkout-cols .custom-data-collection:not(:first-child) .input.website_order_custom_data_collections_custom_data_value textarea').val("");

        }else{
            $('.checkout-cols .custom-data-collection:not(:first-child)').hide();
            $('.checkout-cols .custom-data-collection:not(:first-child) .input.website_order_custom_data_collections_custom_data_value input').val("Personal");
            $('.checkout-cols .custom-data-collection:not(:first-child) .input.website_order_custom_data_collections_custom_data_value select').val("Personal");
			$('.checkout-cols .custom-data-collection:not(:first-child) .input.website_order_custom_data_collections_custom_data_value textarea').val("Personal");

        }
    });

    // CUSTOM DATA COLLECTIONS COMPLETED
    if( $('.checkout-cols .custom-data-collections.preview .data-collection:first-child .value').text() == "Personal"){
        // console.log(  $('.checkout-cols .custom-data-collections.preview .data-collection:first-child .value').text() );
        $('.checkout-cols .custom-data-collections.preview .data-collection:not(:first-child)').hide();
        $('.content-item.payment .form-radio .available:first-child').hide();
        $('.content-item.payment #payment_source_84_5_details').hide();
        $(".content-item.payment .form-radio .available:nth-child(2) input").prop("checked", true);

    }else{
        // console.log(  $('.checkout-cols .custom-data-collections.preview .data-collection:first-child .value').text() );
        $('.content-item.payment .form-radio .available:last-child').hide();
    }

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
		$("#category-navigation").slideToggle("slow","linear");

	});


	// SCROLL FEATURE
	var stickyNavTop = $('#category-navigation').offset().top;
	// alert(stickyNavTop);
	$(window).scroll(function() { 

		var scrollTop = $(window).scrollTop(); 
		if (scrollTop >= stickyNavTop) {
			$('#category-navigation').addClass('fixed'); 
			$('.notification-area').addClass('fixed_content');
		} else {  
			$('#category-navigation').removeClass('fixed');
			$('.notification-area').removeClass('fixed_content'); 
		}
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

	// CATEGORY DROPDOWN IMAGE
	$( ".category-navigation .container ul.level-0 li" ).has( "ul" ).addClass("hasDrop");
	

	
	$( ".category-navigation .container  ul ul.level-1 > li:first-child " ).before("<div id='arrow-up'  class='arrow-up'/>");

	
	function fix_nav(){
		var newLeft;
		$(".category-navigation .container ul.level-0 li" ).has( "ul" ).hover(
			function(){
				newLeft = $(this).offset().left;
				$(this).find( "ul.level-1" ).css("left", newLeft);
			});
	}
});

