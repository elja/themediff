(function() {
    var __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    window.EyewearHotSpotImage = (function(_super) {
        __extends(EyewearHotSpotImage, _super);

        function EyewearHotSpotImage(parentSelector, hotSpotsOptions, options) {
            if (options == null) {
                options = {};
            }
            EyewearHotSpotImage.__super__.constructor.call(this, parentSelector, hotSpotsOptions, options);
            this.parentContainer.data("eyewear-hot-spot-image", this);
        }

        EyewearHotSpotImage.prototype.additionalOptions = function() {
            return {
                prototypeHotSpotsContainerSelector: ".hot-spots-container",
                hotSpotSelector: ".hot-spot",
                leftHotSpotClass: "left-hotspot",
                rightHotSpotClass: "right-hotspot",
                leftHotSpotType: BrightSites.Models.EyewearHotSpotType.hot_spot_types.left,
                rightHotSpotType: BrightSites.Models.EyewearHotSpotType.hot_spot_types.right,
                hotSpotImageContainer: ".hot-spot-image-container",
                positionModifier: 25.5,
                calculatePositionModifier: 25.5,
                droppableOptions: {
                    activeClass: "ui-state-default",
                    accept: ":not(.hot-spot.set)"
                }
            };
        };

        EyewearHotSpotImage.prototype.createHotSpotsFromOptions = function(hotSpotsOptions) {
            var hotSpotOptions, _i, _len;

            this.hotSpots = [];
            for (_i = 0, _len = hotSpotsOptions.length; _i < _len; _i++) {
                hotSpotOptions = hotSpotsOptions[_i];
                this.hotSpots.push(new BrightSites.Models.HotSpot(hotSpotOptions));
            }
            return this.applyHotSpots();
        };

        EyewearHotSpotImage.prototype.additionalDraggableOptions = function() {
            return {
                cursorAt: {
                    top: this.options.positionModifier,
                    left: (-1) * this.options.positionModifier
                }
            };
        };

        EyewearHotSpotImage.prototype.bindGraphicModification = function(draggableElement, cloneElement, position, container) {
            var clone, draggableContainer, maxX, maxY, minX, minY, self;

            self = this;
            draggableElement.draggable("disable");
            clone = cloneElement.clone();
            clone.css("left", position.left);
            clone.css("top", position.top);
            clone.addClass("set");
            clone.appendTo(container);
            draggableContainer = this.parentContainer.find(this.options.hotSpotImageContainer);
            minX = draggableContainer.offset().left;
            maxX = minX + draggableContainer.outerWidth();
            minY = draggableContainer.offset().top;
            maxY = minY + draggableContainer.outerHeight();
            return clone.draggable({
                cursor: "crosshair",
                containment: [minX - this.options.positionModifier, minY - this.options.positionModifier, maxX - this.options.positionModifier, maxY - this.options.positionModifier],
                stop: function(event, ui) {
                    return self.updateHotspot(event, ui);
                }
            });
        };

        EyewearHotSpotImage.prototype.applyHotSpots = function() {
            var cloneElement, element, hotSpot, hotSpotClass, position, _i, _len, _ref, _results;

            _ref = this.hotSpots;
            _results = [];
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                hotSpot = _ref[_i];
                hotSpotClass = this.checkHotSpotClass(hotSpot.get("spot_type"));
                element = this.parentContainer.find(this.options.prototypeHotSpotsContainerSelector).find(this.options.hotSpotSelector + ("." + hotSpotClass));
                cloneElement = element.clone();
                position = this.setHotSpotPosition(hotSpot);
                _results.push(this.bindGraphicModification(element, cloneElement, position, this.parentContainer.find(this.options.hotSpotImageContainer)));
            }
            return _results;
        };

        EyewearHotSpotImage.prototype.dropHotSpot = function(caller, event, ui) {
            var hotSpot;

            hotSpot = EyewearHotSpotImage.__super__.dropHotSpot.call(this, caller, event, ui);
            return this.addSiblingHotspot(hotSpot, ui.position);
        };

        EyewearHotSpotImage.prototype.addSiblingHotspot = function(hotSpot, position) {
            var cloneElement, container, containerPosition, element, hotSpotClass, siblingPosition, siblingType, ui;

            siblingType = this.siblingHotSpotType(hotSpot.get("spot_type"));
            hotSpotClass = this.checkHotSpotClass(siblingType);
            element = this.parentContainer.find(this.options.prototypeHotSpotsContainerSelector).find(this.options.hotSpotSelector + ("." + hotSpotClass));
            cloneElement = element.clone();
            container = this.parentContainer.find(this.options.hotSpotImageContainer);
            containerPosition = BrightSites.Models.EyewearHotSpotType.getContainerPosition(this.parentContainer.find(this.options.hotSpotImageContainer));
            siblingPosition = {
                left: containerPosition.left + containerPosition.imageWidth - (position.left - containerPosition.left) - 2 * this.options.positionModifier,
                top: position.top
            };
            this.bindGraphicModification(element, cloneElement, siblingPosition, container);
            ui = {
                draggable: cloneElement,
                position: siblingPosition
            };
            return this.addHotspot(this, ui);
        };

        EyewearHotSpotImage.prototype.updateHotspot = function(event, ui) {
            var hotSpot, position, type;

            type = this.checkHotSpotType(ui.helper);
            hotSpot = BrightSites.Models.EyewearHotSpotType.getHotSpotByType(type, this.hotSpots);
            if (hotSpot != null) {
                position = this.getHotSpotPosition(ui);
                hotSpot.set("position_x", position.x);
                return hotSpot.set("position_y", position.y);
            }
        };

        EyewearHotSpotImage.prototype.hotSpotOptions = function(ui) {
            var options, position;

            position = this.getHotSpotPosition(ui);
            options = {
                spot_type: this.checkHotSpotType(ui.draggable),
                position_x: position.x,
                position_y: position.y
            };
            return options;
        };

        EyewearHotSpotImage.prototype.addHotspot = function(event, ui) {
            var hotSpot, options;

            options = this.hotSpotOptions(ui);
            hotSpot = new BrightSites.Models.HotSpot(options);
            this.hotSpots.push(hotSpot);
            return hotSpot;
        };

        EyewearHotSpotImage.prototype.siblingHotSpotType = function(type) {
            if (type === this.options.leftHotSpotType) {
                return this.options.rightHotSpotType;
            } else {
                if (type === this.options.rightHotSpotType) {
                    return this.options.leftHotSpotType;
                } else {
                    return null;
                }
            }
        };

        EyewearHotSpotImage.prototype.checkHotSpotType = function(hotspotElement) {
            if (hotspotElement.hasClass(this.options.leftHotSpotClass)) {
                return this.options.leftHotSpotType;
            } else {
                if (hotspotElement.hasClass(this.options.rightHotSpotClass)) {
                    return this.options.rightHotSpotType;
                } else {
                    return null;
                }
            }
        };

        EyewearHotSpotImage.prototype.checkHotSpotClass = function(hotspotType) {
            if (hotspotType === this.options.leftHotSpotType) {
                return this.options.leftHotSpotClass;
            } else {
                if (hotspotType === this.options.rightHotSpotType) {
                    return this.options.rightHotSpotClass;
                } else {
                    return null;
                }
            }
        };

        EyewearHotSpotImage.prototype.getHotSpotPosition = function(ui) {
            return BrightSites.Models.EyewearHotSpotType.getHotSpotPosition(ui, this.parentContainer.find(this.options.hotSpotImageContainer), this.options.calculatePositionModifier);
        };

        EyewearHotSpotImage.prototype.setHotSpotPosition = function(hotSpot) {
            return BrightSites.Models.EyewearHotSpotType.setHotSpotPosition(hotSpot, this.parentContainer.find(this.options.hotSpotImageContainer), this.options.calculatePositionModifier);
        };

        EyewearHotSpotImage.prototype.dataToForm = function() {
            var data, hotSpot, _i, _len, _ref;

            data = [];
            _ref = this.hotSpots;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                hotSpot = _ref[_i];
                data.push(hotSpot.toJSON());
            }
            return {
                hot_spots: data
            };
        };

        EyewearHotSpotImage.prototype.checkHotSpotPresent = function() {
            return this.hotSpots.length > 0;
        };

        EyewearHotSpotImage.prototype.update = function(hotSpotsOptions) {
            if (hotSpotsOptions == null) {
                hotSpotsOptions = [];
            }
            return EyewearHotSpotImage.__super__.update.call(this, hotSpotsOptions);
        };

        return EyewearHotSpotImage;

    })(window.BaseHotSpotImage);

}).call(this);