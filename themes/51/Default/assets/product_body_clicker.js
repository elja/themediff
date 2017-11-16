function bind_product_body_clicker(product_list_selector, product_selector, product_url_attr) {
    if (product_url_attr == undefined) {
        product_url_attr = 'data-product-url';
    }

    $(product_list_selector).on('click', product_selector, function (event) {
        var element = $(event.target);
        var product_url = element.closest('.product').attr(product_url_attr);
        if (product_url && !element.is('a')) {
            window.location = product_url;
        }
    });
}