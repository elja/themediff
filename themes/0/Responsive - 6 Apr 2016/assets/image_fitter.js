$(function () {
    var images = $('img[data-fit]');
    for (var i = 0; i < images.length; i++) {
        var image = $(images[i]);
        fit_image_square(image, parseFloat(image.data().fit));
    }
});

function fit_image_square (selector, size) {
    var image = $(selector);

    if (image.width() < image.height()) {
        image.css('width', size);
    }
    else {
        image.css('height', size);
    }
}