// ---------------------------------------- //
// CHANGE PRIMARY PRODUCT IMAGE ON HOVER
// ---------------------------------------- //

function storeMainImage() {
    var id = $('.gallery-main .main-img').data('id');
    var prevUrl = $('.gallery-main .main-img a').attr('href');
    $('.gallery-main .main-img').data('prev-image', {url: prevUrl, id: id});
};

function revertMainImage() {
    var prevImage = $('.gallery-main .main-img').data('prev-image');

    if (prevImage) {
        $('.gallery-main .main-img').data('id', prevImage.id);
        changePrimaryImage(prevImage.url);
    }
};

function changePrimaryImage(image_url_large){
    var primary_link = $("#primary_image_link");
    var primary_img = $("#primary_image");

    removeElevateZoomFor(primary_img);

    primary_link.attr("href", image_url_large );
    primary_img.attr("href", image_url_large );
    primary_img.attr("src", image_url_large);

    createElevateZoomFor(primary_img);
}

function createElevateZoomFor(img) {
    img.elevateZoom({
        constrainType: "height",
        zoomType: "inner",
        // zoomLens  : "false",
        containLensZoom: true,
        responsive: true
    });
}

function removeElevateZoomFor(img) {
    $('.zoomContainer').remove();
    $('.zoomWrapper img.zoomed').unwrap();

    img.removeData('elevateZoom');
    img.removeData('zoomImage');
}

// ---------------------------------------- //
// CHANGE PRIMARY PRODUCT IMAGE ON OPTION SELECT
// ---------------------------------------- //
function changePrimaryImageOption( selected ){
    var image_url = $(selected).find('option:selected').data("new-image");
    if( image_url ) { changePrimaryImage( image_url ); 	}
}

function revertDefaultPrimaryImage() {
    var a = $('.images-container .image.primary a');

    var href = a.attr('href');
    var id = a.closest('.image').data('id');

    changePrimaryImage(href);
    $('.gallery-main .main-img').data('id', id);

    storeMainImage();
}

function bindProductImagePreview() {
    storeMainImage();
    createElevateZoomFor($('#primary_image'));

    $('select[data-type="product-option"]').on('change', function (event) {
        changePrimaryImageOption(this);
        $('.gallery-main .main-img').data('id', null);

        var $thumbnails = $(this).closest('.product-options .select-area.thumbnail');
        $thumbnails.find('li').removeClass('selected').removeClass('is-selected');

        if ($thumbnails.length > 0) {
            var index = $(this).data('dd').get('selectedIndex');

            if (index > 0) {
                var $li = $thumbnails.find('li').eq(index);
                $li.data('should-select', true);
                $li.addClass('selected').addClass('is-selected');
            }
        }

        storeMainImage();
    });

    $('.product-options .select-area.thumbnail li').on('click', function () {
        var $li = $(this);
        $li.siblings().removeClass('selected').removeClass('is-selected');

        if ($li.data('should-select') == true ) {
            $li.data('should-select', false);
            $li.addClass('selected').addClass('is-selected');
        }
        else {
            $('select[data-type="product-option"]').val('')
              .trigger('change').data('dd').set('selectedIndex', 0);
            revertDefaultPrimaryImage();
        }
    });

    $('.product-options .select-area.thumbnail li').on('mouseover', function () {
        var jOption = findOptionByLi(this);
        var imageUrl = jOption.data('new-image');
        changePrimaryImage(imageUrl);
    });

    $('.product-options .select-area.thumbnail li').on('mouseout', function () {
        revertMainImage();
    });

    $(document).on('mouseover', '.images-container .image a', function () {
        var href = $(this).attr('href');
        var id = $(this).closest('.image').data('id');

        changePrimaryImage(href);
        $('.gallery-main .main-img').data('id', id);

        storeMainImage();
    });
};

function bindProductLogosPreview(productId) {
    var previewLogo = new PreviewLogo(productId);

    // Update hotspotted images on change logo
    $('select[data-type="virtual-logo"]').on('change', function () {
        var logoId = this.value;
        previewLogo.applyLogo(logoId);
        storeMainImage();
    });

    // If you roll over the thumb, and the main image is hospotted,
    // show the logo on the main image
    $('.logo-info .select-area.thumbnail li').on('mouseover', function () {
        var jOption = findOptionByLi(this);
        var logoId = jOption.val();
        previewLogo.applyLogo(logoId);
    });

    $('.logo-info .select-area.thumbnail li').on('mouseout', function () {
        var jSelect = findSelectByLi(this);
        var logoId = jSelect.val();
        previewLogo.applyLogo(logoId);
    });

    $('.logo-info .select-area.thumbnail li').on('click', function () {
        $('.logo-info .select-area.thumbnail li').not($(this)).removeClass('is-selected');
        $(this).toggleClass('is-selected');

        if (!$(this).hasClass('is-selected')) {
            $('select[data-type="virtual-logo"]').val('').trigger('change').data('dd').set('selectedIndex', 0);
        }
    });

    // Preload images
    $('.logo-info .select-area select option').each(function() {
        var logoId = $(this).val();
        previewLogo.preloadLogo(logoId);
    });
};
