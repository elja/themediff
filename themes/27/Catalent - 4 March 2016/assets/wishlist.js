$(function() {
  if($('#wishlist_quote_link').length) {
	var dialog = $('#wishlist_quote_dialog').dialog({
		autoOpen: false,
		dialogClass: 'wishlist-quote-dialog',
		modal: true,
		resizable: false,
		title: 'Wish list quote',
		draggable: false,
		minHeight: 0
	});
    $('#wishlist_quote_link').click(function(){
      dialog.dialog('open');
	  return false;
    });
  }
});
