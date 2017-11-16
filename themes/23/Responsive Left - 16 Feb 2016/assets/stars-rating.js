$.fn.raty.defaults.path = "/assets";
$.fn.raty.defaults.half_show = true;

function createActiveRating(selector){
    $(selector).raty({
        readOnly: true,
        score: function(){
            return $(this).attr('data-rating')
        },
        number: function() {
            return $(this).attr('data-star-count')
        },
        click: function(score, evt) {
            $.post('<%= Rails.application.class.routes.url_helpers.rate_path %>',
                {
                    score: score,
                    dimension: $(this).attr('data-dimension'),
                    id: $(this).attr('data-id'),
                    klass: $(this).attr('data-classname')
                },
                function(data) {
                    if(data) {
                        // success code goes here ...
                    }
                });
        }
    });

}

function createReadonlyRating(selector){
    $(selector).raty({
        readOnly: true,
        score: function(){
            return $(this).attr('data-rating')
        },
        number: function() {
            return $(this).attr('data-star-count')
        }
    });

}

$(function(){
    createActiveRating(".star");
    createReadonlyRating(".show-star");
});