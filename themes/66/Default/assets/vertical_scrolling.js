(function () {
  window.VerticalScrolling = (function () {

    VerticalScrolling.prototype.scrollingOptions = {
      defaultItemsCount: 5,
      step: 1,
      withoutScrollingClass: "without-scrolling",
      itemsSelector: ".items",
      itemSelector: ".item",
      navButtonsIdsPrefix: "scrolling",
      navigationClass: "items-scroller"
    };

    function VerticalScrolling(options) {
      this.container = $(options.container);
      this.onAddItem = options.addItem || (function () {
      });
      this.onDeleteItem = options.deleteItem || (function () {
      });
      this.options = {};
      this.options.itemsCount = options.itemsCount || this.scrollingOptions.defaultItemsCount;
      this.options.step = options.step || this.scrollingOptions.step;
      this.options.withoutScrollingClass = options.withoutScrollingClass || this.scrollingOptions.withoutScrollingClass;
      this.options.itemsSelector = options.itemsSelector || this.scrollingOptions.itemsSelector;
      this.options.itemSelector = options.itemSelector || this.scrollingOptions.itemSelector;
      this.options.navButtonsIdsPrefix = options.navButtonsIdsPrefix || this.scrollingOptions.navButtonsIdsPrefix;
      this.options.navigationClass = options.navigationClass || this.scrollingOptions.navigationClass;
      this.initialize();
      this._saveToDataAttribute();
    }

    VerticalScrolling.prototype.initialize = function () {
      return this._bindScrolling();
    };

    VerticalScrolling.prototype.addItem = function (item) {
      var itemsContainer, options;
      options = this.options;
      item = $(item);
      itemsContainer = this.container.find(options.itemsSelector);
      itemsContainer.append(item);
      itemsContainer.removeClass(options.withoutScrollingClass);
      this.refreshScrolling();
      this.scrollDown();
      return this.onAddItem.call(this, item);
    };

    VerticalScrolling.prototype.deleteItem = function (item) {
      item.remove();
      this.currentCount -= 1;
      this.refreshScrolling();
      return this.onDeleteItem.call(this, item);
    };

    VerticalScrolling.prototype.scrollDown = function () {
      var container, currentScrollVal, items, options, self;
      self = this;
      options = this.options;
      container = $(self.container);
      items = container.find(options.itemsSelector);
      if (self && self.scrollVal) {
        currentScrollVal = items.scrollTop();
        items.scrollTop(self.scrollVal * (self.totalCount - self.currentCount) + currentScrollVal);
        self.currentCount = self.totalCount;
        if (self.downButton) {
          self.downButton.css("visibility", "hidden");
        }
        if (self.upButton) {
          self.upButton.css("visibility", "visible");
        }
        return self._saveToDataAttribute();
      }
    };

    VerticalScrolling.prototype.scrollTop = function () {
    };

    VerticalScrolling.prototype.refreshScrolling = function () {
      this._deleteScrollingElements();
      return this._bindScrolling();
    };

    VerticalScrolling.prototype._bindScrolling = function () {
      var container, downButton, items, navButtonsIdsPrefix, options, sampleItem, self, upButton;
      self = this;
      options = this.options;
      navButtonsIdsPrefix = "" + options.navButtonsIdsPrefix + "_";
      container = this.container;
      items = container.find(options.itemsSelector);
      self.totalCount = container.find(options.itemSelector).length;
      self._deleteScrollingElements();
      if (self.currentCount) {
        self.currentCount = parseInt(self.currentCount);
      }
      if (self.totalCount > options.itemsCount) {
        sampleItem = $(items.find(options.itemSelector)[0]);
        self.scrollVal = self._calculateItemFullHeight(sampleItem) * self.options.step;
        if (self.currentCount == null) {
          self.currentCount = options.itemsCount;
        }
        upButton = self.upButton = $("<button id='" + navButtonsIdsPrefix + "up' class='" + options.navigationClass + " up'></button>").insertBefore(items).off("click").on("click", function (event) {
          return self._onUpButtonClick($(this), items);
        });
        downButton = self.downButton = $("<button id='" + navButtonsIdsPrefix + "down' class='" + options.navigationClass + " down'></button>").insertAfter(items).off("click").on("click", function (event) {
          return self._onDownButtonClick($(this), items);
        });
        if (self.currentCount === self.totalCount) {
          upButton.css("visibility", "visible");
          downButton.css("visibility", "hidden");
        } else if (self.currentCount <= options.itemsCount) {
          upButton.css("visibility", "hidden");
          downButton.css("visibility", "visible");
        }
        self._saveToDataAttribute();
      } else {
        items.addClass(options.withoutScrollingClass);
      }
      return this;
    };

    VerticalScrolling.prototype._deleteScrollingElements = function () {
      if (this.upButton) {
        this.upButton.remove();
      }
      if (this.downButton) {
        this.downButton.remove();
      }
      return this;
    };

    VerticalScrolling.prototype._calculateItemFullHeight = function (item) {
      var itemHeight, marginBottom, paddingBottom, paddingTop;
      item = $(item);
      itemHeight = parseInt(item.css('height')) || 0;
      marginBottom = parseInt(item.css('marginBottom')) || 0;
      paddingTop = parseInt(item.css('paddingTop')) || 0;
      paddingBottom = parseInt(item.css('paddingBottom')) || 0;
      return itemHeight + marginBottom + paddingTop + paddingBottom;
    };

    VerticalScrolling.prototype._onUpButtonClick = function (button, items) {
      var currentScrollVal, currentStep, options, self;
      self = this;
      options = this.options;
      currentScrollVal = items.scrollTop();
      currentStep = Math.min(options.step, self.currentCount - options.itemsCount);
      items.scrollTop(currentScrollVal - self.scrollVal * currentStep);
      self.currentCount -= currentStep;
      self.downButton.css("visibility", "visible");
      if (options.itemsCount === self.currentCount) {
        $(button).css("visibility", "hidden");
      } else {
        $(button).css("visibility", "visible");
      }
      return self._saveToDataAttribute();
    };

    VerticalScrolling.prototype._onDownButtonClick = function (button, items) {
      var currentScrollVal, currentStep, options, self;
      self = this;
      options = this.options;
      currentScrollVal = items.scrollTop();
      currentStep = Math.min(options.step, self.totalCount - self.currentCount);
      items.scrollTop(currentScrollVal + self.scrollVal * currentStep);
      self.currentCount += currentStep;
      self.upButton.css("visibility", "visible");
      if (self.totalCount === self.currentCount) {
        $(button).css("visibility", "hidden");
      } else {
        $(button).css("visibility", "visible");
      }
      return self._saveToDataAttribute();
    };

    VerticalScrolling.prototype._saveToDataAttribute = function () {
      this.container.data("scrollable", this);
      return this;
    };

    return VerticalScrolling;

  })();
}).call(this);
