window.CheckoutController = (function() {

    function CheckoutController(state, contactJson, addressJson) {
        this.state = state;
        this.contactJson = contactJson;
        this.addressJson = addressJson;

        this.initialize();
    }

    CheckoutController.prototype.initialize = function() {
        this.prepareStateSelect();
        this.bindSubmitOnlyOneClick();
        this.activateStateDependencies();
    };

    CheckoutController.prototype.prepareStateSelect = function() {
        new CountrySelectController('.content-item.shipping .address .country select','.content-item.shipping .address .state select');
        new CountrySelectController('.content-item.payment .address .country select','.content-item.payment .address .state select');
    };

    CheckoutController.prototype.activateStateDependencies = function() {
        var self = this;

        switch (self.state) {
            case 'address':
                $('.content-item.shipping .method label').addClass('unavailable').find('input[type="radio"]').attr('disabled', true);
                self.prepareShippingMethods();
                self.bindExistingAddressSelect('shipping');
                break;
            case 'delivery':
                $('.content-item.shipping .contact input').attr('disabled', true);
                $('.content-item.shipping .address input').attr('disabled', true);
                $('.content-item.shipping .address select').attr('disabled', true).trigger("liszt:updated");
                self.prepareShippingMethods();
                self.bindSubmitDeliveryForm();
                break;
            case 'payment':
                self.bindPaymentMethodsSwitcher();
                self.preparePaymentMethods();
                self.bindDuplicateShippingAddressAction();
                self.bindDuplicateShippingContactAction();
                self.bindSmallCustomSelect();
                self.bindPromotionDeletion();
                self.bindExistingAddressSelect('payment');
                break;
        }
    };

    CheckoutController.prototype.prepareShippingMethods = function () {
        $('.content-item.shipping .form-radio label.unavailable input').attr('disabled', 'disabled');
    };

    CheckoutController.prototype.bindPaymentMethodsSwitcher = function () {
        $('.content-item.payment .form-radio label.available input').bind('change click', function(event) {
            $('.method .payment-method').hide();
            selector = '.payment-method-for-' + $(this).attr('id');

            if ($(this).is(':checked') == true) {
                $(selector).show();
            }
        });
    };

    CheckoutController.prototype.preparePaymentMethods = function () {
        $('.content-item.payment .form-radio label.unavailable input').attr('disabled', 'disabled');

        var checked = $('.content-item.payment .form-radio label.available input:checked');
        if (!checked.is('*'))
            $('.content-item.payment .form-radio label.available input:first').attr('checked', true).trigger('change');
        else
            checked.trigger('change');
    };

    CheckoutController.prototype.bindDuplicateShippingContactAction = function () {
        var self = this;

        $('.content-item.payment input#same-as-shipping-contact').live('click', function (event) {
            var container = $('.content-item.payment .contact');
            if ($(this).is(':checked')) {
                container.find('input[type="text"]').attr('disabled', true).removeClass('with-hint');
                container.find('input.first-name').val(self.contactJson.firstName);
                container.find('input.last-name').val(self.contactJson.lastName);
                container.find('input.email').val(self.contactJson.email);
                container.find('input.phone').val(self.contactJson.phone);
            } else {
                container.find('input[type="text"]').attr('disabled', false);
            }
        });
    };

    CheckoutController.prototype.bindDuplicateShippingAddressAction = function () {
        var self = this;

        $('.content-item.payment input#same-as-shipping-address').live('click', function (event) {
            var container = $('.content-item.payment .address');
            if ($(this).is(':checked')) {
                container.find('input[type="text"]').attr('disabled', 'disabled').removeClass('with-hint');
                self._updateAddress(container, self.addressJson);
            } else {
                container.find('input[type="text"]').attr('disabled', false);
            }
        });
    };

    CheckoutController.prototype.bindSubmitDeliveryForm = function () {
        var container = $('.content-item.shipping .method');
        container.find('input[type="submit"]').off('click').on('click', function(event) {
            if (!container.find('input[type="radio"]:checked').is('*')) {
                event.preventDefault();
            } else {
                $(this).off('click').on('click', function(event) {
                    event.preventDefault();
                })
            }
        });
    };

    CheckoutController.prototype.bindPromotionDeletion = function() {
        $('.promotions .fields').live('nested:fieldRemoved:promotion_adjustments', function() {
            form = $('.promotions .fields').parents('form');
            actsLikeApplyCode = $("<input type='hidden' name='apply_coupon_code' value='1'/>");
            form.append(actsLikeApplyCode);
            form.submit();
            actsLikeApplyCode.remove();
        });
    };

    CheckoutController.prototype.bindSmallCustomSelect = function() {
        $('.content-item.payment .payment-method select').each(function(){
            $(this).wrap("<div class='select-wrapper'></div>").parent().css({
                'position': 'relative',
                'float': 'left',
                'margin-left': '9px',
                'width': '95px',
                'margin-top' : '8px',
            });

            var title = $(this).attr('title');
            if( $('option:selected', this).val() != ''  ) title = $('option:selected',this).text();
            $(this)
                .css({'z-index':10,'opacity':0,'-khtml-appearance':'none'})
                .after('<span class="small-select">' + title + '</span>')
                .change(function(){
                    val = $('option:selected',this).text();
                    $(this).next().text(val);
                })
        });
        $('.content-item.payment .payment-method .select-wrapper:first').css({'margin-left': 0}).
            parent('p.field').css({'margin-bottom': '18px'});
    };

    CheckoutController.prototype.bindExistingAddressSelect = function(addressType) {
        var self = this;
        var container = $('.content-item.' + addressType + ' .address');
        var select = container.find('.form-select select.address-dropdown');

        select.on('change', function(event) {
            var addressId = $(this).val();

            if (addressId != '-1') {
                $.ajax({
                    url: '/account/addresses/' + addressId
                }).success(function(data, textStatus, jqXHR) {
                    self._updateAddress(container, data.address);
                }).error(function(jqXHR, textStatus, errorThrown) {
                    NotificationHelper.showNotification("error", "Can't get address information.");
                });
            }
        });
    };

    CheckoutController.prototype.bindSubmitOnlyOneClick = function() {
        $('form.edit_website_order input[type="submit"]').on('click', function(event) {
            $(this).off('click').on('click', function(event) {
                event.preventDefault();
            });
        })
    };

    CheckoutController.prototype._updateAddress = function(selector, data) {
        var container = $(selector);
        container.find('input.company').val(data.company);
        container.find('input.first-address').val(data.first_address);
        container.find('input.second-address').val(data.second_address);
        container.find('input.city').val(data.city);
        container.find('.country select').val(data.country).trigger('change');;
        container.find('.state select').val(data.state).trigger('change');;
        container.find('input.zip').val(data.zip);
        $('.content-item .address select').trigger("liszt:updated");
    };

    return CheckoutController;
})();
