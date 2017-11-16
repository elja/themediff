$( document ).ready(function() {

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

