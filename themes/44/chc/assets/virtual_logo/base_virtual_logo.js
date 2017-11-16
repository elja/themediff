(function () {

  window.BaseVirtualLogo = (function() {

    BaseVirtualLogo.prototype.defaultOptions = {
      dialog: {
        dialogClass: '',
        baseDialogClass: '',
        minHeight: '',
        width: '',
        zIndex: ''
      },
      classes: {
        selectedImage: 'selected',
        imageWrapper: ''
      },
      selector: {
        previewImageArea: '',
        previewImage: ''
      }
    };

    function BaseVirtualLogo(dialogContent, productName) {
      this.options = $.extend({}, this.defaultOptions, $.extend({}, this.additionalOptions()));
      this.dialog = $(dialogContent);
      this.productName = productName;
    }

    BaseVirtualLogo.prototype.additionalOptions = function() {
      return {};
    };

    BaseVirtualLogo.prototype._bindVerticalScrolling = function(container, options) {
      var imagesContainer;
      imagesContainer = $(container);
      if (!imagesContainer.data('scrollable')) {
        return imagesContainer.data('scrollable', new VerticalScrolling(options));
      }
    };

    BaseVirtualLogo.prototype.prepareDialog = function(dialogContent) {
      var options, self;
      self = this;
      options = self.options;
      if (dialogContent) {
        self.dialog = $(dialogContent);
      }
      if (!self.dialog.is(":data(dialog)")) {
        self.dialog = self.dialog.dialog({
          autoOpen: false,
          draggable: false,
          resizable: false,
          closeOnEscape: true,
          modal: true,
          stack: false,
          appendTo: 'body',
          minHeight: options.dialog.minHeight,
          width: options.dialog.width,
          zIndex: options.dialog.zIndex,
          title: self._dialogTitle(),
          dialogClass: self._dialogClass(),
          create: function() {
            return self._onDialogCreate();
          },
          open: function() {
            return self._onDialogOpen();
          }
        });
      }
      return self.dialog.dialog('open');
    };

    BaseVirtualLogo.prototype._onDialogCreate = function() {};

    BaseVirtualLogo.prototype._onDialogOpen = function() {};

    BaseVirtualLogo.prototype._dialogTitle = function() {};

    BaseVirtualLogo.prototype._dialogClass = function() {
      return [this.options.dialog.dialogClass, this.options.dialog.baseDialogClass].join(' ');
    };

    BaseVirtualLogo.prototype._imageClickAction = function(containerSelector) {
      var options, selector, self;
      self = this;
      options = self.options;
      selector = "" + containerSelector + " ." + options.classes.imageWrapper;
      return $(selector).die('click').live('click', function(event) {
        var imageWrapper, selectedImage;
        imageWrapper = $(this);
        selectedImage = self._getSelectedImage(containerSelector);
        if (selectedImage) {
          selectedImage.removeClass(options.classes.selectedImage);
        }
        imageWrapper.addClass(options.classes.selectedImage);
        self._applyVirtualLogo();
        return event.preventDefault();
      });
    };

    BaseVirtualLogo.prototype._applyVirtualLogo = function() {
      throw 'Not Implemented';
    };

    BaseVirtualLogo.prototype._replacePreviewImage = function(src) {
      return $(this.options.selectors.previewImage).attr('scr', src);
    };

    BaseVirtualLogo.prototype._getFirstImage = function(container) {
      var item;
      container = $(container);
      if ((item = _.first(container.find("." + this.options.classes.imageWrapper)))) {
        return $(item);
      } else {
        return item;
      }
    };

    BaseVirtualLogo.prototype._getSelectedImage = function(container) {
      var item;
      container = $(container);
      if ((item = _.first(container.find("." + this.options.classes.imageWrapper + "." + this.options.classes.selectedImage)))) {
        return $(item);
      } else {
        return item;
      }
    };

    return BaseVirtualLogo;

  })();

}).call(this);
