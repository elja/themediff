(function() {
    window.TryItOnController = (function() {
        TryItOnController.prototype.options = {
            defaultImagesCount: 5,
            paginationStep: 1,
            tryItOnDialogClass: 'try-it-on-dialog',
            selectedImageClass: 'selected',
            imageWrapperClass: 'image-wrapper',
            webcamPictureClass: 'webcam-picture',
            webcamBtnsClass: 'webcam-btn',
            takeSnaphotBtnClass: 'take-snapshot',
            closeWebcamBtnClass: 'close-webcam',
            connectToWebcamBtnId: 'connect-to-webcam',
            disabledButtonClass: 'disabled',
            imagesPaginatorClass: 'image-paginator',
            tryItOnLabelSelector: 'div.try-it-on-label',
            hotspotImagesContainerSelector: 'div.hotspot-images',
            hotspotPreviewImagesContainerSelector: 'div.hotspot-preview-images',
            dialogFooterSelector: 'div.try-it-on-dialog div.ui-dialog-buttonpane',
            userPreviewImageSelector: '.user-preview-image',
            hotSpotPreviewImageContainer: '.try-it-on-preview-area',
            dialogContentSelector: '.try-it-on-dialog-content',
            imagesContainerSelector: '.images-container',
            imagesWrapperSelector: '.images'
        };

        function TryItOnController(dialog, hotSpotTypeId, productName, canUpload, customOptions) {
            this.hotSpotTypeId = hotSpotTypeId;
            this.productName = productName;
            this.canUpload = canUpload != null ? canUpload : false;
            if (customOptions == null) {
                customOptions = {};
            }
            this.dialog = dialog ? $(dialog) : $('<div/>');
            this.dialog = this.dialog.wrap('<div/>').parent();
            this.options = $.extend(this.options, customOptions);
            this.elements = [];
            this.bindLabelClickAction();
        }

        TryItOnController.prototype.bindLabelClickAction = function() {
            var options, self;

            self = this;
            options = this.options;
            return $(options.tryItOnLabelSelector).on('click', function(event) {
                if (!self.dialog.is(':data(dialog)')) {
                    self.dialog.dialog({
                        autoOpen: false,
                        draggable: false,
                        resizable: false,
                        closeOnEscape: true,
                        modal: true,
                        dialogClass: "front-dialog " + options.tryItOnDialogClass,
                        appendTo: 'body',
                        minHeight: 380,
                        width: 920,
                        zIndex: 4000,
                        stack: false,
                        title: "Try on <span>" + self.productName + "</span>",
                        open: function() {
                            self.bindHotspotImageClickAction();
                            self.bindHotspotPreviewImageClickAction();
                            self.bindScrollingToHotSpotImages();
                            self.bindScrollingToHotSpotPreviewImages();
                            self.bindFileUploader($(this).find('form'));
                            return self.chooseFirstImageAsSelected();
                        },
                        beforeClose: function() {
                            return self._closeWebcam();
                        },
                        close: function() {
                            var item, _i, _len, _ref, _results;

                            _ref = self.elements;
                            _results = [];
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                item = _ref[_i];
                                _results.push(item.remove());
                            }
                            return _results;
                        }
                    });
                    if (self.canUpload) {
                        self.dialog.dialog('option', 'buttons', [
                            {
                                text: 'upload new image',
                                "class": 'left-btn'
                            }, {
                                text: 'connect to webcam',
                                "class": 'right-btn',
                                id: options.connectToWebcamBtnId,
                                click: function() {
                                    return self.connectToCameraClickAction();
                                }
                            }
                        ]);
                    }
                }
                return self.dialog.dialog('open');
            });
        };

        TryItOnController.prototype.chooseFirstImageAsSelected = function() {
            var selector;

            selector = "." + this.options.tryItOnDialogClass + " " + this.options.hotspotImagesContainerSelector + " ." + this.options.imageWrapperClass;
            if ($("" + selector).find("." + this.options.selectedImageClass).length === 0) {
                return $("" + selector).first().addClass(this.options.selectedImageClass);
            }
        };

        TryItOnController.prototype.bindHotspotImageClickAction = function() {
            return this._imageClickAction(this.options.hotspotImagesContainerSelector);
        };

        TryItOnController.prototype.bindHotspotPreviewImageClickAction = function() {
            return this._imageClickAction(this.options.hotspotPreviewImagesContainerSelector);
        };

        TryItOnController.prototype.bindScrollingToHotSpotImages = function() {
            var imagesContainer, options;

            options = this.options;
            imagesContainer = $(options.hotspotImagesContainerSelector);
            if (!imagesContainer.data("scrollable")) {
                return imagesContainer.data("scrollable", new VerticalScrolling({
                    container: imagesContainer,
                    navButtonsIdsPrefix: "hot_spot_images",
                    itemsSelector: options.imagesWrapperSelector,
                    itemSelector: "." + options.imageWrapperClass
                }));
            }
        };

        TryItOnController.prototype.bindScrollingToHotSpotPreviewImages = function() {
            var imagesContainer, options;

            options = this.options;
            imagesContainer = $(options.hotspotPreviewImagesContainerSelector);
            if (!imagesContainer.data("scrollable")) {
                return imagesContainer.data("scrollable", new VerticalScrolling({
                    container: imagesContainer,
                    navButtonsIdsPrefix: "hot_spot_preview_imagess",
                    itemsSelector: options.imagesWrapperSelector,
                    itemSelector: "." + options.imageWrapperClass,
                    addItem: function(image) {
                        $(image).click();
                        return $(options.dialogContentSelector).hideLoading();
                    }
                }));
            }
        };

        TryItOnController.prototype.addPreviewImage = function(image) {
            return $(this.options.hotspotPreviewImagesContainerSelector).data('scrollable').addItem(image);
        };

        TryItOnController.prototype.deletePreviewImage = function(image) {
            return $(this.options.hotspotPreviewImagesContainerSelector).data('scrollable').deleteItem(image);
        };

        TryItOnController.prototype.bindFileUploader = function(form) {
            var self, uploader;

            self = this;
            form.appendTo(self.dialog.dialog('widget').find('.ui-dialog-buttonset'));
            uploader = form.find('input[type="file"]');
            if (uploader.is(":data(fileupload)")) {
                uploader.fileupload('destroy');
            }
            return uploader.fileupload({
                autoUpload: false,
                dataType: 'html',
                add: function(e, data) {
                    if (data && data.submit) {
                        $(self.options.dialogContentSelector).showLoading();
                        return data.submit();
                    }
                },
                done: function(e, data) {
                    var image;

                    image = $(data.result);
                    return self.addPreviewImage(image);
                }
            });
        };

        TryItOnController.prototype.connectToCameraClickAction = function() {
            var options, self;

            self = this;
            options = this.options;
            self._disableButtons();
            webcam.set_swf_url('/webcam.swf');
            webcam.set_api_url('/hot_spot_preview_images');
            webcam.set_quality(100);
            webcam.set_shutter_sound(true, '/shutter.mp3');
            webcam.set_hook('onLoad', function(response) {
                var csrf_param, csrf_token;

                csrf_param = $("meta[name=csrf-param]").attr("content");
                csrf_token = $("meta[name=csrf-token]").attr("content");
                return webcam.set_api_url("" + location.href + "/hot_spot_preview_images?" + csrf_param + "=" + (encodeURI(encodeURI(csrf_token))) + "&webcam=true");
            });
            webcam.set_hook('onComplete', function(responseText) {
                var image;

                image = $(responseText);
                self.addPreviewImage(image);
                self._closeWebcam();
                return self._enableButtons();
            });
            webcam.set_hook('onError', function(responseText) {
                alert('Sorry, no camera found!\nPlease check and try again.');
                if (webcam.loaded) {
                    webcam.reset();
                }
                self._closeWebcam();
                return self._enableButtons();
            });
            $('.hot-spot-preview-image-image').hide();
            self.webcamPictureArea = $("<div class='" + options.webcamPictureClass + "'/>").width(520).height(400).html(webcam.get_html(520, 400)).appendTo(self.dialog.find('div.try-it-on-preview-area')).show();
            self.takeSnaphotBtn = $("<div class='" + options.webcamBtnsClass + " " + options.takeSnaphotBtnClass + "'><span/></div>").appendTo(self.webcamPictureArea).show().click(function() {
                webcam.freeze();
                $(options.dialogContentSelector).showLoading();
                return window.setTimeout(function() {
                    return webcam.upload();
                }, 1000);
            });
            return self.closeWebsiteBtn = $("<div class='" + options.webcamBtnsClass + " " + options.closeWebcamBtnClass + "'><span/></div>").appendTo(self.webcamPictureArea).show().click(function() {
                self._closeWebcam();
                return self._enableButtons();
            });
        };

        TryItOnController.prototype.activateTryItOn = function() {
            var self, tryItOnData;

            self = this;
            tryItOnData = {
                type: "front",
                hot_spot_type_id: this.hotSpotTypeId,
                hot_spot_image_id: this._selectedHotSpotImage().data("id"),
                hot_spot_preview_image_id: this._selectedPreviewImage().data("id")
            };
            return $.ajax({
                type: "GET",
                url: "/hot_spot_preview_images/try_it_on",
                data: tryItOnData,
                beforeSend: function(jqXHR, settings) {
                    return $(self.options.hotSpotPreviewImageContainer).showLoading();
                },
                complete: function(jqXHR, textStatus, errorThrown) {
                    return $(self.options.hotSpotPreviewImageContainer).hideLoading();
                }
            });
        };

        TryItOnController.prototype._imageClickAction = function(containerSelector) {
            var options, selector, self;

            options = this.options;
            selector = "." + options.tryItOnDialogClass + " " + containerSelector + " ." + options.imageWrapperClass;
            self = this;
            return $("" + selector).die('click').live('click', function(event) {
                var imageWrapper;

                imageWrapper = $(this);
                $("" + selector + "." + options.selectedImageClass).removeClass(options.selectedImageClass);
                imageWrapper.addClass(options.selectedImageClass);
                self.activateTryItOn();
                return event.preventDefault();
            });
        };

        TryItOnController.prototype._selectedPreviewImage = function() {
            return $(this.options.hotspotPreviewImagesContainerSelector).find("." + this.options.selectedImageClass);
        };

        TryItOnController.prototype._selectedHotSpotImage = function() {
            return $(this.options.hotspotImagesContainerSelector).find("." + this.options.selectedImageClass);
        };

        TryItOnController.prototype._closeWebcam = function() {
            var self;

            self = this;
            self.takeSnaphotBtn && self.takeSnaphotBtn.hide().remove() && (self.takeSnaphotBtn = null);
            self.webcamPictureArea && self.webcamPictureArea.hide().remove() && (self.webcamPictureArea = null);
            return $('.hot-spot-preview-image-image').show();
        };

        TryItOnController.prototype._disableButtons = function() {
            var options;

            options = this.options;
            return $("" + options.dialogFooterSelector + " button").addClass(options.disabledButtonClass).attr('disabled', 'true');
        };

        TryItOnController.prototype._enableButtons = function() {
            var options;

            options = this.options;
            return $("" + options.dialogFooterSelector + " button").removeClass(options.disabledButtonClass).removeAttr('disabled');
        };

        return TryItOnController;

    })();

    window.UserHotSpotPreviewImagesController = (function() {
        UserHotSpotPreviewImagesController.prototype.options = {
            fileUploaderSelector: "div.add-new-face form input[type='file']"
        };

        function UserHotSpotPreviewImagesController() {
            this.bindOnUploadImageAction();
            this.bindImageScrolling();
        }

        UserHotSpotPreviewImagesController.prototype.deletePreviewImage = function(image) {
            var imagesContainer, index;

            image = $(image);
            imagesContainer = image.parent();
            image.remove();
            index = this.index;
            this._onScrollAction(imagesContainer);
            return this._scrollTo(imagesContainer, index);
        };

        UserHotSpotPreviewImagesController.prototype.addPreviewImage = function() {
            return location.reload();
        };

        UserHotSpotPreviewImagesController.prototype.bindOnUploadImageAction = function() {
            var uploader;
            var self = this;

            uploader = $(this.options.fileUploaderSelector);
            if (uploader.is(":data(fileupload)")) {
                uploader.fileupload('destroy');
            }
            return uploader.fileupload({
                autoUpload: true,
                dataType: 'html',
                add: function(e, data) {
                    if (data && data.submit) {
                        return data.submit();
                    }
                },
                done: function(e, data) {
                    return self.addPreviewImage();
                }
            });
        };

        UserHotSpotPreviewImagesController.prototype.bindImageScrolling = function() {
            var imagesContainer, self;

            self = this;
            imagesContainer = $('div.account-images');
            return $().ready(function() {
                return self._onScrollAction(imagesContainer);
            });
        };

        UserHotSpotPreviewImagesController.prototype._getImagesLeftIndent = function(images, index) {
            var i, indent;

            i = 0;
            indent = 0;
            while (i < index) {
                indent += $(images[i]).width() + 13;
                i++;
            }
            return indent;
        };

        UserHotSpotPreviewImagesController.prototype._getImagesRightIndent = function(images, index, totalWidth) {
            return totalWidth - this._getImagesLeftIndent(images, index);
        };

        UserHotSpotPreviewImagesController.prototype._scrollTo = function(imagesContainer, index) {
            var images, imagesScrollableContainer, left, self;

            self = this;
            images = imagesContainer.find('div.user-hot-spot-image');
            imagesScrollableContainer = imagesContainer.parent();
            if (index > self.totalCount) {
                index = self.totalCount;
            }
            left = index === self.visibleCount ? 0 : index > self.visibleCount ? self._getImagesRightIndent(images, index, imagesScrollableContainer.width()) - 13 : (self._getImagesLeftIndent(images, index)) * -1;
            self.index = index;
            if (index > self.visibleCount) {
                $('a.prev.disabled').removeClass('disabled');
            }
            return imagesContainer.css('left', "" + left + "px");
        };

        UserHotSpotPreviewImagesController.prototype._onScrollAction = function(imagesContainer) {
            var images, imagesScrollableContainer, self, totalWidth;

            self = this;
            totalWidth = 0;
            imagesScrollableContainer = imagesContainer.parent();
            $('a.prev').addClass('disabled');
            images = imagesContainer.find('div.user-hot-spot-image');
            self.totalCount = images.length;
            self.index = null;
            $.each(images, function(index, image) {
                totalWidth += $(image).width() + 13;
                if (totalWidth > imagesScrollableContainer.width() && !self.index) {
                    self.index = index;
                    self.indent = (images.width()) - (totalWidth - imagesScrollableContainer.width());
                    return self.visibleCount = index;
                }
            });
            if (self.index) {
                $('a.next').off('click').on('click', function(event) {
                    if (self.index < self.totalCount) {
                        self.index += 1;
                        $('a.prev.disabled').removeClass('disabled');
                        imagesContainer.css('left', "" + (self._getImagesRightIndent(images, self.index, imagesScrollableContainer.width()) - 13) + "px");
                        if (self.index === self.totalCount) {
                            return $(this).addClass('disabled');
                        }
                    }
                });
                return $('a.prev').off('click').on('click', function(event) {
                    var currentIndex;

                    if ((self.visibleCount - self.index) <= 0) {
                        self.index -= 1;
                        currentIndex = Math.abs(self.index - self.visibleCount);
                        imagesContainer.css('left', "-" + (self._getImagesLeftIndent(images, currentIndex)) + "px");
                        $('a.next.disabled').removeClass('disabled');
                        if (self.index === self.visibleCount) {
                            return $(this).addClass('disabled');
                        }
                    }
                });
            } else {
                $('a.next').addClass('disabled');
                return $('a.prev').addClass('disabled');
            }
        };

        return UserHotSpotPreviewImagesController;

    })();

}).call(this);
