function updateProductPrice (data) {

  var multipleQuantitySubOptionsContainer = 'div.multiple-quantity-product-option';
  var multipleQuantitySubOptionWrapper = 'div.product-sub-option';

  var lineItems = data.line_items;

  var notBlankLineItem = _.find(lineItems, function(li) {
    return parseFloat(li.price_with_quantity_discount);
  }) || lineItems[0];

  var form = $('form');

  var summaryContent = form.find('table.product-summary tbody');
  summaryContent.html('');

  var multipleQuantitySubOptions = $(multipleQuantitySubOptionsContainer).find(multipleQuantitySubOptionWrapper);

  var priceWithQuantityDiscount;
  if (multipleQuantitySubOptions.is('*')) {
    priceWithQuantityDiscount = parseFloat(notBlankLineItem.price_with_quantity_discount)
      - parseFloat(notBlankLineItem.options_price);
  } else {
    priceWithQuantityDiscount = parseFloat(notBlankLineItem.price_with_quantity_discount);
  }

  var findMultipleQuantitySubOption = function (lineItem) {
    if (lineItem.choices) {
      var choice = _.find(lineItem.choices, function (choice) {
        if (choice.product_option) {
          return choice.product_option.multiple_quantity;
        }
        return false;
      });
      if (choice) {
        return choice.product_sub_option;
      }
    }
    return null;
  }

  var replacePrice = function (selector, price) {
    var regex = /^([^\d]*)\d+(?:\.\d{1,2})?(.*)/;
    var current_value = $(selector).html();
    $(selector).html(current_value.replace(regex, '$1'+parseFloat(price).toFixed(2)+'$2'));
  }

  var showSetupCharge = function(lineItems, totalPrice) {
    var containerSelector = 'div.product-info table.product-summary tfoot';
    var totalPriceSelector = 'table.product-summary tfoot tr.total';
    var itemsTotalSelector = 'tr.items-total';

    var buildTableRow = function(rowClass, price, label) {
      var tableRow = $('<tr>').addClass(rowClass);
      tableRow.append($('<th>').attr('colspan', 2).css('paddingTop', '10px').text(label));
      tableRow.append($('<td>').css('paddingTop', '10px').text('$' + price));

      return tableRow;
    };

    var removeAddedRows = function() {
      $(containerSelector + ' ' + itemsTotalSelector).remove();
    };

    var lineItem = _.find(lineItems, function(li) {
      return parseFloat(li.quantity) != 0;
    });
    if (lineItem) {
      var quantity    = lineItem.quantity;
      var setupCharge = lineItem.setup_charge;

      if (setupCharge && quantity != 0 && setupCharge != 0) {
        var container = $(containerSelector);

        if (!container.find(itemsTotalSelector).is('*')) {
          $(totalPriceSelector).before(buildTableRow('items-total', parseFloat(totalPrice).toFixed(2), 'items total:'));
          replacePrice(form.find(totalPriceSelector + ' td'), (parseFloat(totalPrice) + parseFloat(setupCharge)).toFixed(2));
        } else {
          replacePrice(form.find(itemsTotalSelector + ' td'), parseFloat(totalPrice).toFixed(2));
          replacePrice(form.find(totalPriceSelector + ' td'), (parseFloat(totalPrice) + parseFloat(setupCharge)).toFixed(2));
        }
      } else if (quantity == 0) {
        removeAddedRows();
      }
    } else {
      removeAddedRows();
    }
  }

  var updateStockInfo = function (lineItem, stockFieldSelector) {
    var stockField = $(stockFieldSelector);
    if (lineItem['check_in_stock']){
      stockField.removeClass('out-of-stock').addClass('in-stock');
      stockField.html(lineItem['display_stock']);
    }
    else {
      stockField.removeClass('in-stock').addClass('out-of-stock');
      stockField.html(lineItem.errors['quantity'])
    }

  }

  var totalPrice = 0.0;
  $.each(lineItems, function (i, lineItem) {
    var lineItemTotalPrice = parseFloat(lineItem.total_price_with_quantity_discount);

    if ((lineItemTotalPrice > 0) || (lineItem.show_inventory === true)) {
      var multipleQuantityProductSubOption = findMultipleQuantitySubOption(lineItem);
      if (multipleQuantityProductSubOption) {
        var subOptionName = multipleQuantityProductSubOption.name;
        var row = $('<tr><th class="name" colspan="2">'+subOptionName+'</th><td class="quantity">'+lineItem.quantity+'</td><td class="price">$0.0</td></tr>');
        replacePrice(row.find('.price'), lineItemTotalPrice);
        summaryContent.append(row);
        updateStockInfo(lineItem, multipleQuantitySubOptions.eq(i).find('span.stock'));
      } else {
        updateStockInfo(lineItem, 'div.total-info span.stock');
      }

      totalPrice += lineItemTotalPrice;
    }
  });

  replacePrice(form.find('table.product-summary tfoot tr.total td'), totalPrice);
  replacePrice(form.find('table.product-summary tfoot tr.discounted-price-per-item td'), priceWithQuantityDiscount);
  showSetupCharge(lineItems, totalPrice);
}
