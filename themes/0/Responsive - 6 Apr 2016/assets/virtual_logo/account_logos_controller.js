window.AccountLogosController = (function () {

  AccountLogosController.prototype.options = {
    classes: {
      frontDialog: 'front-dialog',
      disabledButton: 'disabled',
      logo: 'logo',
      dialog: 'logo-dialog',
      fakeFileName: 'fake-file-name'
    },

    selectors: {
      logosScrollingContainer: 'div.logos-wrapper',
      logosContainer: 'div.logos-wrapper div.logos-container div.logos',
      nextButton: 'div.logos-wrapper a.nav.next',
      prevButton: 'div.logos-wrapper a.nav.prev',
      addNewLogoBtn: 'button#add-new-logo',
      imageCache: '.form input#website_logo_image_cache',
      logoFormWrapper: 'div.logo-form',
      logoForm: 'form.logo-form',
      fakeFileName: '.fake-file-name',
      editLogoLink: 'div.logo a.edit',
      deleteLogoLink: 'div.logo a.delete',
      dialog: 'div.logo-dialog'
    },

    scrolling: {
      displayedCount: 5,
      logoWidth: 144
    }
  };

  function AccountLogosController(newLogoUrl, logosUrl) {
    this.newLogoUrl = newLogoUrl;
    this.logosUrl = logosUrl;

    this.initialize();
  }

  AccountLogosController.prototype.initialize = function () {
    this.bindLogosScrolling();
    this.bindAddNewLogoClickAction();
    this.bindEditLogoClickAction();
  };

  AccountLogosController.prototype.bindAddNewLogoClickAction = function () {
    var self = this;
    var options = this.options;

    $(options.selectors.addNewLogoBtn).off('click').on('click', function (event) {
      $.get(self.newLogoUrl);

      event.preventDefault();
    });
  };

  AccountLogosController.prototype.bindEditLogoClickAction = function () {
    var options = this.options;

    $(options.selectors.editLogoLink).off('click').on('click', function (event) {
      $.get($(this).attr('href'));

      event.preventDefault();
    });
  };

  AccountLogosController.prototype.bindLogosScrolling = function () {
    var self = this;
    var options = this.options;

    this.logosContainer = $(options.selectors.logosContainer);
    this.logosCount = this.logosContainer.find('.' + options.classes.logo).length;
    this.logosOverflow = this.logosCount - options.scrolling.displayedCount;

    this.prevButton = $(options.selectors.prevButton).click(function () {
      self._moveLogos(false);
    });
    this.nextButton = $(options.selectors.nextButton).click(function () {
      self._moveLogos(true);
    });

    this._toggleNavigationButtons();
  };

  AccountLogosController.prototype.prepareDialog = function (content, title, saveButtonText, emulateImageUpload) {
    content = $(content);
    if (title === null) {
      title = 'Add new logo';
    }
    if (saveButtonText === null) {
      saveButtonText = 'Save';
    }
    if (emulateImageUpload == null) {
      emulateImageUpload = false;
    }

    var self = this;
    var options = this.options;

    var dialog = content.dialog({
      autoOpen: false,
      draggable: false,
      resizable: false,
      modal: true,
      title: title,
      width: 450,
      zIndex: 4500,
      dialogClass: [options.classes.frontDialog, options.classes.dialog].join(' '),
      buttons: [
        {
          text: 'Cancel',
          'class': 'left secondary',
          click: function () {
            $(this).dialog('close');
          }
        },
        {
          text: saveButtonText,
          'class': 'right primary',
          click: function () {
            var dialogSelector = '.' + options.classes.dialog;
            var data = $(dialogSelector).data('data');
            if (data && data.submit) {
              $(dialogSelector).showLoading();
              data.submit();
            }
          }
        }
      ],
      close: function (event, ui) {
        dialog.dialog('destroy');
        dialog.remove();
      },
      open: function (event, ui) {
        self._modalDialogIEFix(dialog);
        self.prepareDialogForm(dialog, emulateImageUpload);
      }
    });
    dialog.dialog('open');

    this.dialog = dialog;
  };

  AccountLogosController.prototype.prepareDialogForm = function (dialog, emulateImageUpload) {
    if (emulateImageUpload == null) {
      emulateImageUpload = false;
    }
    var options = this.options;

    var uploader = dialog.find("#uploader");
    var dialogSelector = '.' + options.classes.dialog;
    if (uploader.is(":data(fileupload)")) {
      uploader.fileupload('destroy');
    }

    uploader.fileupload({
      autoUpload:        false,
      dataType:          'script',
      acceptFileTypes:   /(\.|\/)(gif|jpe?g|png)$/i,
      add:    function (e, data) {
        $(dialogSelector + ' .' + options.classes.fakeFileName).text(_.first(data.files).name);
        $(dialogSelector).data('data', data);
      },
      submit: function (e, data) {
        if (data.fileInput) {
          $.each(data.fileInput, function(index, value) {
            if (!value) {
              data.fileInput.splice(index, 1);
            }
          });
        }

        data.formData = $(dialogSelector + ' form').serializeArray();
      }
    });

    this._setFakeFileName(dialog.find(options.selectors.imageCache), dialog);
    if(emulateImageUpload) {
      this._emulateFileUpload(uploader, dialog);
    }
  };

  AccountLogosController.prototype.onCreateAction = function (isValid, formContent) {
    if (isValid) {
      location.href = this.logosUrl;
    } else {
      this.updateDialogForm(formContent);
    }
  };

  AccountLogosController.prototype.onUpdateAction = function (isValid, formContent, emulateFileUpload) {
    if (isValid) {
      location.href = this.logosUrl;
    } else {
      this.updateDialogForm(formContent, emulateFileUpload);
    }
  };

  AccountLogosController.prototype.updateDialogForm = function (formContent, emulateImageUpload) {
    if (emulateImageUpload == null) {
      emulateImageUpload = false;
    }
    var self = this;
    var options = this.options;

    $("." + options.classes.dialog).hideLoading();
    var dialogForm = $(_.first($(options.selectors.logoFormWrapper))).html(formContent.html());
    self.prepareDialogForm(dialogForm, emulateImageUpload);
  }

  AccountLogosController.prototype._setFakeFileName = function (input, dialog) {
    var options = this.options;

    input = $(input);
    var fileName = _.last(input.val().split('/'));

    if (_.isEmpty(fileName) && input.data('value')) {
      fileName = _.last(input.data('value').split('/'));
    }

    if (!_.isEmpty(fileName)) {
      dialog.find(options.selectors.fakeFileName).text(fileName);
    }

    return this;
  }

  AccountLogosController.prototype._emulateFileUpload = function(uploader, dialog) {
    var file, self;
    self = this;

    if (!_.isEmpty(file = uploader.data('value'))) {
      uploader.fileupload('add', {
        files: [file]
      });
      self._setFakeFileName(uploader, dialog);
      uploader.removeData('value');
    }

    return this;
  };

  AccountLogosController.prototype._toggleNavigationButtons = function () {
    var options = this.options;
    var offset = Math.abs(parseInt(this.logosContainer.css('left')));

    if (this.logosOverflow <= 0) {
      this._disableButton(this.nextButton)._disableButton(this.prevButton);
    } else if (offset === 0) {
      this._enableButton(this.nextButton)._disableButton(this.prevButton);
    } else if (offset === (this.logosOverflow * options.scrolling.logoWidth)) {
      this._enableButton(this.prevButton)._disableButton(this.nextButton);
    } else {
      this._enableButton(this.nextButton)._enableButton(this.prevButton);
    }

    return this;
  }

  AccountLogosController.prototype._disableButton = function (button) {
    button.removeClass(this.options.classes.disabledButton).addClass(this.options.classes.disabledButton);

    return this;
  };

  AccountLogosController.prototype._enableButton = function (button) {
    button.removeClass(this.options.classes.disabledButton);

    return this;
  };

  AccountLogosController.prototype._moveLogos = function (forward) {
    var offset = parseInt(this.logosContainer.css('left'));

    if (forward) {
      offset -= this.options.scrolling.logoWidth;
    } else {
      offset += this.options.scrolling.logoWidth;
    }

    this.logosContainer.css('left', offset + 'px');
    return this._toggleNavigationButtons();
  };

  AccountLogosController.prototype._closeDialog = function () {
    this.dialog.hideLoading().dialog('close');
  };

  AccountLogosController.prototype._modalDialogIEFix = function(dialog) {
    var overlay = dialog.dialog('widget').next('.ui-widget-overlay').first();
    overlay.css('z-index', parseInt(overlay.css('z-index')) - 1);

    return this;
  };

  return AccountLogosController;
})();
