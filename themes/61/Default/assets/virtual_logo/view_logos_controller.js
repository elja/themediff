(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  window.ViewLogosController = (function(_super) {
    __extends(ViewLogosController, _super);

    function ViewLogosController(dialogContent, productName, enableCustomUpload, newLogoUrl, logosUrl) {
      ViewLogosController.__super__.constructor.call(this, dialogContent, productName);
      if (enableCustomUpload == null) {
        enableCustomUpload = true;
      }
      this.enableCustomUpload = enableCustomUpload;
      this.newLogoUrl = newLogoUrl;
      this.logosUrl = logosUrl;
      this.initialize();
    }

    ViewLogosController.prototype.additionalOptions = function() {
      return {
        dialog: {
          dialogClass: "view-logos",
          baseDialogClass: "front-dialog",
          minHeight: 380,
          width: 920,
          zIndex: 4000
        },
        classes: {
          dialog: "view-logos",
          frontDialog: "front-dialog",
          selectedImage: "selected",
          imageWrapper: "image-wrapper",
          logo: "website_logo"
        },
        selectors: {
          label: "div.view-logo-label",
          previewImageArea: "div.view-logo-dialog-content .logo-preview-area",
          previewImageWrapper: "div.view-logo-dialog-content .logo-preview-area .image-wrapper",
          previewImage: "div.view-logo-dialog-content .logo-preview-area .image-wrapper img",
          imagesWrapper: "div.items",
          logosContainer: "div.logo-images.logos",
          productImagesContainer: "div.logo-images.product-images",
          logosDropDown: ".msdropdown-select",
          deleteLogo: "a.delete-image"
        }
      };
    };

    ViewLogosController.prototype.initialize = function() {
      this.bindLabelClickAction();
      return this.prepareLogosController();
    };

    ViewLogosController.prototype.bindLabelClickAction = function() {
      var self;

      self = this;
      return $(this.options.selectors.label).off('click').on('click', function(event) {
        return self.prepareDialog();
      });
    };

    ViewLogosController.prototype._onDialogCreate = function() {
      var self;

      self = this;
      if (self.enableCustomUpload) {
        return self.dialog.dialog('option', 'buttons', [
          {
            text: 'upload new logo',
            "class": 'center-btn',
            click: function() {
              return $.get(self.newLogoUrl);
            }
          }
        ]);
      }
    };

    ViewLogosController.prototype._onDialogOpen = function() {
      this.bindLogoClickAction();
      this.bindProductImageClickAction();
      this.bindScrollingToLogos();
      this.bindScrollingToProductImages();
      this.bindClickDeleteLogoAction();
      return this._selectFirstLogoAndProductImages();
    };

    ViewLogosController.prototype._dialogTitle = function() {
      return "View <span> " + this.productName + " </span> logos";
    };

    ViewLogosController.prototype.bindLogoClickAction = function() {
      return this._imageClickAction(this.options.selectors.logosContainer);
    };

    ViewLogosController.prototype.bindProductImageClickAction = function() {
      return this._imageClickAction(this.options.selectors.productImagesContainer);
    };

    ViewLogosController.prototype.bindScrollingToProductImages = function() {
      var options;

      options = this.options;
      return this._bindVerticalScrolling(options.selectors.productImagesContainer, {
        container: options.selectors.productImagesContainer,
        navButtonsIdsPrefix: 'product_images',
        itemsSelector: options.selectors.imagesWrapper,
        itemSelector: "." + options.classes.imageWrapper
      });
    };

    ViewLogosController.prototype.bindScrollingToLogos = function() {
      var options, self;

      self = this;
      options = this.options;
      return this._bindVerticalScrolling(options.selectors.logosContainer, {
        container: options.selectors.logosContainer,
        navButtonsIdsPrefix: 'logos',
        itemsSelector: options.selectors.imagesWrapper,
        itemSelector: "." + options.classes.imageWrapper,
        addItem: self.onAddLogo
      });
    };

    ViewLogosController.prototype.onAddLogo = function(logo) {
      return logo.click();
    };

    ViewLogosController.prototype.bindClickDeleteLogoAction = function() {
      var options, self;

      self = this;
      options = this.options;
      return $(options.selectors.logosContainer + " " + options.selectors.deleteLogo).die("click").live("click", function(event) {
        var url;

        url = $(this).attr('href');
        $.ajax({
          url: url,
          dataType: 'json',
          type: 'POST',
          data: {
            _method: 'delete'
          },
          success: function(data) {
            var logo;

            logo = data;
            logo = $("#" + options.classes.logo + "_" + logo.id);
            $(options.selectors.logosContainer).data("scrollable").deleteItem(logo);
            var selectedProductImage = self._getSelectedImage(options.selectors.productImagesContainer);
            if (selectedProductImage != null){
              $(options.selectors.previewImage).attr("src", selectedProductImage.data("image"));
            }
            return true;
          }
        });
        return event.preventDefault();
      });
    };

    ViewLogosController.prototype._activeProductImage = function() {
      return $(this.options.selectors.productImagesContainer).find();
    };

    ViewLogosController.prototype._applyVirtualLogo = function() {
      var data, selectedLogoImage, selectedProductImage, self;

      self = this;
      selectedProductImage = this._getSelectedImage(this.options.selectors.productImagesContainer);
      selectedLogoImage = this._getSelectedImage(this.options.selectors.logosContainer);
      if ((selectedProductImage != null) && (selectedLogoImage != null)) {
        data = {
          type: "front",
          product_image_id: selectedProductImage.data("id"),
          logo_id: selectedLogoImage.data("id")
        };
        return $.ajax({
          type: "POST",
          url: "/logos/apply_logo",
          data: data,
          beforeSend: function(jqXHR, settings) {
            return $(self.options.selectors.previewImageArea).showLoading();
          }
        });
      }
    };

    ViewLogosController.prototype.prepareLogosController = function() {
      var logosContainer, options, self;

      self = this;
      options = this.options;
      this.LogosController = function() {};
      $.extend(this.LogosController.prototype, window.AccountLogosController.prototype, {
        initialize: function() {},
        onCreateAction: function(isValid, formContent, logoJson, logoHtml) {
          if (isValid) {
            self._addNewLogoToSelectBox(logoJson);
            self._addNewLogoToDialog(logoHtml);
            return this._closeDialog();
          } else {
            return this.updateDialogForm(formContent);
          }
        }
      });
      self.logosController = new self.LogosController();
      logosContainer = $("<div class=\"logos-container\"/>").data("controller", self.logosController);
      return $(options.selectors.label).after(logosContainer);
    };

    ViewLogosController.prototype._addNewLogoToDialog = function(logo) {
      logo = $(logo);
      return $(this.options.selectors.logosContainer).data("scrollable").addItem(logo);
    };

    ViewLogosController.prototype._addNewLogoToSelectBox = function(logo) {
      return $(this.options.selectors.logosDropDown).data("dd").add({
        text: logo.name,
        value: logo.id,
        title: logo.name,
        image: logo.image.url
      });
    };

    ViewLogosController.prototype._selectFirstLogoAndProductImages = function() {
      var container, firstImage, options, selectedImage, self, _i, _len, _ref, _results;

      self = this;
      options = this.options;
      _ref = [options.selectors.productImagesContainer, options.selectors.logosContainer];
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        container = _ref[_i];
        firstImage = self._getFirstImage(container);
        selectedImage = self._getSelectedImage(container);
        if (firstImage && !selectedImage) {
          _results.push(firstImage.click());
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    };

    ViewLogosController.prototype._getSelectedProductImage = function() {
      return this._getSelectedImage(options.selectors.productImagesContainer);
    };

    ViewLogosController.prototype._getSelectedLogo = function() {
      return this._getSelectedImage(options.selectors.logosContainer);
    };

    return ViewLogosController;

  })(window.BaseVirtualLogo);

}).call(this);
