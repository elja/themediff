$( document ).ready(function() {
	
	$('.navigation-bar ul.main-nav.navigation-menu > li > a:contains("Home")').hide();
	$(".category-navigation ul.level-0 > li > a:contains('View All')").attr("href","/products");

	// TOP NAVIGATION SLIDE
	$( "#dropdown" ).click(function() {

		if($('#menu').is(':hidden')){
			$("#open").toggle("fast","linear", function(){
				$("#close").toggle("fast","linear");
			});
		}else{
			$("#close").toggle("fast","linear", function(){
				$("#open").toggle("fast","linear");
			});
		}

		$("#menu, html").toggleClass("show");

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

