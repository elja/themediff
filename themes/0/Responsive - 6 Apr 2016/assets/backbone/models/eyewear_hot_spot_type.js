(function() {
    var _ref,
        __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    BrightSites.Models.EyewearHotSpotType = (function(_super) {
        __extends(EyewearHotSpotType, _super);

        function EyewearHotSpotType() {
            _ref = EyewearHotSpotType.__super__.constructor.apply(this, arguments);
            return _ref;
        }

        EyewearHotSpotType.activeImageClass = "active";

        EyewearHotSpotType.hot_spot_types = {
            left: "left",
            right: "right"
        };

        EyewearHotSpotType.getHotSpotByType = function(type, hotSpots) {
            var hotSpot;

            return ((function() {
                var _i, _len, _results;

                _results = [];
                for (_i = 0, _len = hotSpots.length; _i < _len; _i++) {
                    hotSpot = hotSpots[_i];
                    if (hotSpot.get("spot_type") === type) {
                        _results.push(hotSpot);
                    }
                }
                return _results;
            })())[0];
        };

        EyewearHotSpotType.getContainerPosition = function(container) {
            return {
                left: container.position().left,
                top: container.position().top,
                imageHeight: container.outerHeight(),
                imageWidth: container.outerWidth()
            };
        };

        EyewearHotSpotType.getHotSpotPosition = function(element, imageContainer, modifier) {
            var containerPosition, position;

            if (modifier == null) {
                modifier = 0;
            }
            position = element.position;
            containerPosition = this.getContainerPosition(imageContainer);
            return {
                x: (position.left - containerPosition.left + modifier) / containerPosition.imageWidth,
                y: (position.top - containerPosition.top + modifier) / containerPosition.imageHeight
            };
        };

        EyewearHotSpotType.setHotSpotPosition = function(hotSpot, imageContainer, modifier) {
            var containerPosition;

            if (modifier == null) {
                modifier = 0;
            }
            containerPosition = this.getContainerPosition(imageContainer);
            return {
                left: hotSpot.get("position_x") * containerPosition.imageWidth + containerPosition.left - modifier,
                top: hotSpot.get("position_y") * containerPosition.imageHeight + containerPosition.top - modifier
            };
        };

        return EyewearHotSpotType;

    })(Backbone.Model);

}).call(this);