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

