$( document ).ready(function() {
	
	$('.navigation-bar ul.main-nav.navigation-menu > li > a:contains("Home")').hide();

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
});

