// This class is created specially for templates/product.liquid page
// It apply logo to gallery's images on the left side
//
// Usage example:
//   var previewLogo = new PreviewLogo(productId);
//   previewLogo.applyLogo(logoId);
//
// Server response example:
//   {
//     "76753":"/composite_images/logo/23_76753_view_logo_preview_admin_preview1435156503.png",
//     "76757":"/composite_images/logo/23_76757_view_logo_preview_admin_preview1435155952.png"
//   }
//
var PreviewLogo = function(productId) {
    'use strict';

    var self = this;

    // Make AJAX call to server and update images
    // It also cache results
    this.applyLogo = function(logoId) {
        this.fetchImages(logoId).done(this.update);
    };

    // Fetch images and load them in background
    this.preloadLogo = function(logoId) {
        this.fetchImages(logoId).done(this.preloadImage);
    };

    // Load images from response
    this.preloadImage = function(response) {
        $.each(response, function(id, url) {
            var img = new Image();
            img.src = url;
        });
    };

    // Update main and preview images
    this.update = function(response) {
        self.updateThumbs(response);
        self.updateMainImage(response);
    };

    // Cache variable.
    // Used only in #fetchImages
    var responseCache = {};

    // Make AJAX call and return Deferred object (Cache result)
    this.fetchImages = function(logoId) {
        if (responseCache[logoId]) {
            return responseCache[logoId];
        } else {
            return responseCache[logoId] = $.get('/logos/images', {
                logo_id: logoId,
                product_id: productId
            });
        };
    };

    // Update preview images
    this.updateThumbs = function(response) {
        var imagesContaner = $('.product-gallery .images-container');

        $.each(response, function(id, url) {
            var container = imagesContaner.find('[data-id="' + id + '"]');
            container.find('a').attr('href', url);
            container.find('img').attr('src', url);
        });
    };

    // Update big image
    this.updateMainImage = function(response) {
        var mainImageContaner = $('.product-gallery .main-img');
        var id = mainImageContaner.data('id');
        var url = response[parseInt(id)];

        if (url) {
            changePrimaryImage(url);
        };
    };
};
