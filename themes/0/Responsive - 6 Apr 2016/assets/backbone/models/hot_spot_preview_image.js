(function() {
  var _ref,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BrightSites.Models.HotSpotPreviewImage = (function(_super) {
    __extends(HotSpotPreviewImage, _super);

    function HotSpotPreviewImage() {
      _ref = HotSpotPreviewImage.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    HotSpotPreviewImage.prototype.urlRoot = "/ecommerce/hot_spot_preview_images";

    return HotSpotPreviewImage;

  })(Backbone.Model);

}).call(this);
