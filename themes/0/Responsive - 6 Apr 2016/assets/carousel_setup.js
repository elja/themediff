
function setup_carousels (selector, start_class) {
    if (start_class == undefined) {
        start_class = 'start'
    }
    var carousel_containers = $(selector);
    for (var i = 0; i < carousel_containers.length; i++) {
        var start_index = 0;
        var carousel_container = $(carousel_containers[i]);
        var carousel_items = carousel_container.find('ul li');
        for (var j = 0; j < carousel_items.length; j++) {
            if ($(carousel_items[j]).hasClass(start_class)) {
                start_index = j;
                break;
            }
        }
        carousel_container.on('jcarousel:createend', function() {
            $(this).jcarousel('scroll', start_index, false);
        }).jcarousel({wrap: "circular"});
    }
}
