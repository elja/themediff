// live product price updater for product page

(function() {

    window.ProductPriceUpdater = {};

    ProductPriceUpdater.UpdateHandler = (function() {

        UpdateHandler.prototype._defaultOptions = {
            triggersContainerSelector: 'form',
            triggerSelector: 'input, select, textarea',
            formSelector: 'form',
            url: '',
            success: null,
            error: null,
            ajax: {
                type: 'POST',
				dataType: 'script' //'json'
            },
            submitDelay: 300
        };

        function UpdateHandler(options) {
            if (options == null) {
                options = {};
            }
            this.options = $.extend(true, {}, this._defaultOptions, options);
            this.timeoutVariable = null;
            this._bind();
        }

        UpdateHandler.prototype.triggerUpdate = function() {
            return this._submitForm();
        };

        UpdateHandler.prototype._bind = function() {
            var _this = this;
            return $(this.options.triggersContainerSelector).on('change', this.options.triggerSelector, function() {
                if (_this.timeoutVariable) {
                    clearTimeout(_this.timeoutVariable);
                    _this.timeoutVariable = null;
                }
                return _this.timeoutVariable = setTimeout((function() {
                    return _this._submitForm();
                }), _this.options.submitDelay);
            });
        };

        UpdateHandler.prototype._submitForm = function() {
            return $.ajax(this.options.url, this._ajaxParams());
        };

        UpdateHandler.prototype._ajaxParams = function() {
            var defaultAjaxParams;
            defaultAjaxParams = {
                success: this.options.success,
                error: this.options.error,
                data: $(this.options.formSelector).serialize()
            };
            return $.extend(true, {}, defaultAjaxParams, this.options.ajax);
        };

        return UpdateHandler;

    })();

}).call(this);

