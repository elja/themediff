$( document ).ready(function() {

	// TOP NAVIGATION SLIDE
	$( "#dropdown" ).click(function() {

		if($('#menu').is(':hidden')){
			$("#open").fadeToggle("fast","linear", function(){
				$("#close").fadeToggle("fast","linear");
			});
		}else{
			$("#close").fadeToggle("fast","linear", function(){
				$("#open").fadeToggle("fast","linear");
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
});

