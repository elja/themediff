/**
 * Created with JetBrains RubyMine.
 * User: s.ginkov
 * Date: 6/18/13
 * Time: 7:34 PM
 * To change this template use File | Settings | File Templates.
 */
(function() {
    window.BaseHotSpotImage = (function() {
        BaseHotSpotImage.prototype.default_options = {
            prototypeHotSpotsContainerSelector: "",
            hotSpotSelector: "",
            droppableOptions: {
                activeClass: "ui-state-default",
                accept: ""
            },
            draggableOptions: {
                helper: "clone",
                cursor: "move",
                scroll: false
            },
            messages: {
                errors: {
                    base: "Something went wrong.",
                    hot_spots_error: "Hot spots haven't been applied."
                }
            },
            notificationHelperMethod: function(type, error) {
                return NotificationHelper.showNotification(type, error);
            }
        };

        function BaseHotSpotImage(parentSelector, hotSpotsOptions, options) {
            if (options == null) {
                options = {};
            }
            this.options = $.extend({}, this.default_options, $.extend({}, this.additionalOptions(), options));
            this.parentContainer = $(parentSelector);
            this.bindDraggableToHotSpot();
            this.bindDroppableToHotSpotImageContainer();
            this.createHotSpotsFromOptions(hotSpotsOptions);
        }

        BaseHotSpotImage.prototype.additionalOptions = function() {
            return {};
        };

        BaseHotSpotImage.prototype.createHotSpotsFromOptions = function(hotSpotsOptions) {};

        BaseHotSpotImage.prototype.additionalDraggableOptions = function() {
            return {};
        };

        BaseHotSpotImage.prototype.bindDraggableToHotSpot = function() {
            return this.parentContainer.find(this.options.prototypeHotSpotsContainerSelector).find(this.options.hotSpotSelector).draggable($.extend({}, this.options.draggableOptions, this.additionalDraggableOptions()));
        };

        BaseHotSpotImage.prototype.dropHotSpot = function(caller, event, ui) {
            this.bindGraphicModification(ui.draggable, ui.helper, ui.position, caller);
            return this.addHotspot(event, ui);
        };

        BaseHotSpotImage.prototype.additionalDroppableOptions = function() {
            var self;

            self = this;
            return {
                drop: function(event, ui) {
                    return self.dropHotSpot(this, event, ui);
                }
            };
        };

        BaseHotSpotImage.prototype.bindDroppableToHotSpotImageContainer = function() {
            var droppableOptions;

            droppableOptions = $.extend({}, this.options.droppableOptions, this.additionalDroppableOptions());
            return this.parentContainer.find(this.options.hotSpotImageContainer).droppable(droppableOptions);
        };

        BaseHotSpotImage.prototype.bindGraphicModification = function(draggableElement, cloneElement, position, container) {};

        BaseHotSpotImage.prototype.addHotspot = function(event, ui) {};

        BaseHotSpotImage.prototype.hotSpotOptions = function(ui) {};

        BaseHotSpotImage.prototype.present = function(element) {
            return element.length() > 0;
        };

        BaseHotSpotImage.prototype.dataToForm = function() {
            return {};
        };

        BaseHotSpotImage.prototype.checkHotSpotPresent = function() {
            return true;
        };

        BaseHotSpotImage.prototype.sendRequest = function(method, url, container) {
            var self;

            self = this;
            if (this.checkHotSpotPresent()) {
                return $.ajax({
                    type: method,
                    url: url,
                    data: this.dataToForm(),
                    error: function(jqXHR, textStatus, errorThrown) {
                        container.hideLoading();
                        return self.options.notificationHelperMethod("error", self.options.messages.errors.base);
                    }
                });
            } else {
                container.hideLoading();
                return this.options.notificationHelperMethod("error", self.options.messages.errors.hot_spots_error);
            }
        };

        BaseHotSpotImage.prototype.update = function(hotSpotsOptions) {
            this.parentContainer.find(this.options.hotSpotSelector).draggable("enable");
            return this.createHotSpotsFromOptions(hotSpotsOptions);
        };

        return BaseHotSpotImage;

    })();

}).call(this);
