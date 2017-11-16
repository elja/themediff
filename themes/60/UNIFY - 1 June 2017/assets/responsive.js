$( document ).ready(function() {
	$('#website_order_custom_data_collections_attributes_95_custom_data_attributes_attributes_0_value').change(function(e){
	//IF BUSINESS THEN HIDE VISA CARD FIELDS AND MAKE GL CODE AVAILABLE FOR PAYMENT AND HIDE GIFT CERTIFICATE
	if($('#website_order_custom_data_collections_attributes_95_custom_data_attributes_attributes_0_value').val()=='Business'){
		$('.content-item.custom-data-collection .custom-data-collection:nth-child(3)').show();
		$('.content-item.custom-data-collection .custom-data-collection:nth-child(2)').hide();
		// $('.custom-data-collection:nth-child(4)').hide();
		// $('.custom-data-collection:nth-child(5)').hide();
		// $('.custom-data-collection:nth-child(6)').hide();
	}
	//IF PERSONAL THEN HIDE GL CODE AND MAKE GIFT CERTIFICATE AVAILABLE
	else if($('#website_order_custom_data_collections_attributes_95_custom_data_attributes_attributes_0_value').val()=='Personal'){
		$('.content-item.custom-data-collection .custom-data-collection:nth-child(2)').show();
		$('.content-item.custom-data-collection .custom-data-collection:nth-child(3)').hide();
		// $('.custom-data-collection:nth-child(4)').show();
		// $('.custom-data-collection:nth-child(5)').show();
		// $('.custom-data-collection:nth-child(6)').show();
	}
	});
	if( $('.checkout-cols .custom-data-collections.preview .data-collection:first-child .value').text() == "Business"){
		$('.content-item.payment .form-radio .available:first-child').show();
		$('.content-item.payment .form-radio .available:first-child input').prop('checked', true);
		$('.content-item.payment .form-radio .available:nth-child(2)').hide();
		$('.form-item.gift-certificate').hide();
	}
	else if( $('.checkout-cols .custom-data-collections.preview .data-collection:first-child .value').text() == "Personal"){
		$('.content-item.payment .form-radio .available:first-child').hide();
		$('.content-item.payment .form-radio .available:nth-child(2) input').prop('checked', true);
		$('.content-item.payment .form-radio .available:nth-child(2)').show();
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
		$("#right_content, #footer").fadeToggle("slow","linear");

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

	// CATEGORY HEIGHT
	var contentHeight;
	function fix_categories(){
		contentHeight = $("#right_content").innerHeight();
		if(contentHeight >= "600"){
			$('#category-navigation').css("min-height", contentHeight + 25);
		}else{
			$('#category-navigation').css("min-height", '600px');
		}
	}

	fix_categories();

	$(window).resize(function(){
		fix_categories();
	});

	$('.menu-title').click(function(){
		fix_categories();
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

	function fix_nav(){
		var newLeft;
		$(".category-navigation .container ul.level-0 li" ).has( "ul" ).hover(
			function(){
				newLeft = $(this).offset().left;
				$(this).find( "ul.level-1" ).css("left", newLeft);
			});
	}
	
});

