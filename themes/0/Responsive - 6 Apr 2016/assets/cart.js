$(function() {
  var cartContainer = $('div.shopping-cart');

  if (cartContainer.is('*')) {
    $('a.empty-cart').on('click', function(event) {
      cartContainer.find('div.cart-item div.item-quantity input.quantity').val(0);
      $('form.edit_website_order').submit();
      event.preventDefault();
    })
  }
});
