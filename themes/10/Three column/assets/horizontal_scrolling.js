(function () {
  window.HorizontalScrolling = (function () {

    HorizontalScrolling.prototype.options = {

      disabledButtonClass: 'disabled',
      itemClass: 'item',
      containerSelector: 'div.items',
      nextButtonSelector: 'a.nav.next',
      prevButtonSelector: 'a.nav.prev',

      displayedCount: 5,
      itemWidth: 60
    };

    function HorizontalScrolling(options) {
      this.options = $.extend(this.options, options);
      this.initialize();
    }

    HorizontalScrolling.prototype.initialize = function () {
      return this._bindScrolling();
    };

    HorizontalScrolling.prototype._bindScrolling = function () {
      var self = this;
      var options = this.options;

      this.containerSelector = $(options.containerSelector);
      this.logosCount = this.containerSelector.find('.' + options.itemClass).length;
      this.logosOverflow = this.logosCount - options.displayedCount;
      this.moving = false

      this.prevButton = $(options.prevButtonSelector).click(function () {
        self._moveLogos(false);
      });

      this.nextButton = $(options.nextButtonSelector).click(function () {
        self._moveLogos(true);
      });

      this._toggleNavigationButtons();
    };

    HorizontalScrolling.prototype._toggleNavigationButtons = function () {
      var options = this.options;
      var offset = parseInt(this.containerSelector.css('left'));

      if (this.logosOverflow <= 0) {
        this._disableButton(this.nextButton)._disableButton(this.prevButton);
      } else if (offset >= 0) {
        this._enableButton(this.nextButton)._disableButton(this.prevButton);
      } else if (offset < -options.itemWidth) {
        this._enableButton(this.prevButton)._disableButton(this.nextButton);
      } else {
        this._enableButton(this.nextButton)._enableButton(this.prevButton);
      }

      return this;
    }

    HorizontalScrolling.prototype._disableButton = function (button) {
      button.removeClass(this.options.disabledButtonClass).addClass(this.options.disabledButtonClass);

      return this;
    };

    HorizontalScrolling.prototype._enableButton = function (button) {
      button.removeClass(this.options.disabledButtonClass);

      return this;
    };

    HorizontalScrolling.prototype._moveLogos = function (forward) {
      var offset = parseInt(this.containerSelector.css('left'));

      if (forward) {
        offset -= this.options.itemWidth;
      } else {
        offset += this.options.itemWidth;
      }

      this.containerSelector.css('left', offset + 'px');
      return this._toggleNavigationButtons();
    };

    return HorizontalScrolling;

  })();
}).call(this);
