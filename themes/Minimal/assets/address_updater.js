// this code is used on address book for update existing addresses

function bind_address_update_handler(selector) {
    var form = $(selector).is('form') ? $(selector) : $(selector).find('form');

    var clearNoticeFields = function() {
        form.find('.error, .success').html('');
    };

    var onSuccess = function(data) {
        clearNoticeFields();
        var address = data['address'];
        if ($.isEmptyObject(address['errors'])) {
            form.find('.success').html('Address updated');
        }
        else {
            for (var errorField in address['errors'])
            {
                form.find('.errors_for_'+errorField).html(address['errors'][errorField][0]);
            }
        }

    };

    var onError = function() {
        clearNoticeFields();
        form.find('.errors_for_form').html('Something went wrong. Try to reload page')
    };

    form.on('submit', function (event) {
        event.preventDefault();
        $.ajax(
            form.attr('action'),
            {
                type: 'POST',
                data: form.serialize(),
                success: onSuccess,
                error: onError
            }
        );
        return false;
    });
}

function bind_address_set_role_handler(addressListSelector, formSelector, addressRole) {
    var form = $(formSelector);
    var addressList = $(addressListSelector);

    var shippingAddressCheckboxes = addressList.find('input[type="checkbox"].default-'+addressRole+'-address');
    shippingAddressCheckboxes.on('change', function (event) {
        if (!form.attr('data-lock'))
        {
            form.attr('data-lock', true);
            var inputValue = null;
            if (this.checked)
            {
                for (var i = 0; i < shippingAddressCheckboxes.length; i++)
                {
                    var checkbox = shippingAddressCheckboxes[i];
                    if (checkbox != this)
                    {
                        checkbox.checked = false;
                    }
                }
                inputValue = $(this).attr('data-address-id');
            }
            form.find('input[name="website_user['+addressRole+'_address_id]"]').val(inputValue);
            form.submit();
            form.removeAttr('data-lock');
        }
    });
}
