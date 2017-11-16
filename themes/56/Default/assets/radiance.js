/**
 * Page-specific call-backs
 * Called after dom has loaded.
 */
var RADIANCE = {
    template_index : {
        init: function(){
            if( $("#carousel").length > 0 ){
                $("#carousel").scrollable({
                        circular: true
                    }
                ).navigator({
                        navi: "#carousel-slide-menu",
                        naviItem: 'li'
                    }
                );
                if ( $("#carousel").find('.items li[class!=cloned]').length > 1 ) {
                    window.api = $("#carousel").autoscroll({
                            autoplay: true,
                            api: true,
                            interval: 7500
                        }
                    )
                    $("#carousel").hover(
                        function() {
                            api.pause();
                            $(this).find('.browse').fadeIn('fast');
                        }
                        ,
                        function() {
                            api.play();
                            $(this).find('.browse').fadeOut('fast');
                        }
                    );
                }
                $('#carousel-thumbs li:first a').addClass('active');
            }
        }
    }
}
/**
 * Fire function based upon attributes on the body tag.
 * This is the reason for "template{{ template | camelize }}" in layout/theme.liquid
 *
 * @see http://paulirish.com/2009/markup-based-unobtrusive-comprehensive-dom-ready-execution/
 */
var UTIL = {
    fire : function(func,funcname, args){
        var namespace = RADIANCE;
        funcname = (funcname === undefined) ? 'init' : funcname;
        if (func !== '' && namespace[func] && typeof namespace[func][funcname] == 'function'){
            namespace[func][funcname](args);
        }
    }
    ,
    loadEvents : function(){
        UTIL.fire('template_index');
    }
};
$(document).ready(UTIL.loadEvents);
