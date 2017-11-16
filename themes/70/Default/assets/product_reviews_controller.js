window.ProductReviewsController = (function() {

  function ProductReviewsController(productUrl) {
    this.productUrl = productUrl;
    this.reviewsContainer = $('div.product-reviews-container');
    this.reviewsListing = this.reviewsContainer.find('div.product-reviews');
    this.reviewFormContainer = this.reviewsContainer.find('div.add-review-form-container');
    this.newReviewForm = this.reviewFormContainer.find('form');
    this.afterSubmitText = 'Thank you! Your review has been submitted and will be published after site administrators approval.';

    this.initialize();
  }

  ProductReviewsController.prototype.initialize = function() {
    this.bindAddNewReviewClickAction();
    this.bindRatyToRating(0);
  };

  ProductReviewsController.prototype.bindRatyToRating = function(score) {
    this.newReviewForm.find('div.rating-stars').raty({
      score: score,
      half: true,
      scoreName: 'website_product_review[stars]'
    });

    return this;
  };

  ProductReviewsController.prototype.bindAddNewReviewClickAction = function() {
    var self = this;

    (self.addReviewBtn = self.reviewsContainer.find('a.add-review-btn')).off('click').on('click', function(event) {
      var addReviewBtn = $(this);

      if (!addReviewBtn.hasClass('inactive')) {
        self._deactivateListing();
        self._showForm();
        self._resetForm();
        self.reviewsContainer.find('div.review-preview-wrapper').remove();
      }

      event.preventDefault();
    });

    return this;
  };

  ProductReviewsController.prototype.bindCancelReviewClickAction = function() {
    var self = this;

    self.reviewsContainer.find('a.cancel-review').off('click').on('click', function(event) {
      self._hideForm();
      self._activateListing();
      self._resetForm();

      event.preventDefault();
    });

    return this;
  };

  ProductReviewsController.prototype.unbindCancelReviewClickAction = function() {
    this.reviewsContainer.find('a.cancel-review').off('click').on('click', function(event) {
      event.preventDefault();
    });

    return this;
  };

  ProductReviewsController.prototype.bindShowPreviewAction = function() {
    var self = this;

    self.newReviewForm.find('button.preview-review-btn').off('click').on('click', function(event) {
      self._onShowPreview();

      event.preventDefault();
    });
  };

  ProductReviewsController.prototype.unbindShowPreviewAction = function() {
    this.newReviewForm.find('button.preview-review-btn').off('click').on('click', function(event) {
      event.preventDefault();
    });

    return this;
  };

  ProductReviewsController.prototype.showReviewPreview = function(review) {
    this.reviewPreview = review;

    this.newReviewForm.find('.error').remove();
    this._hideForm();
    window.createReadonlyRating(review.find('.show-star'));
    review.insertBefore(this.reviewsListing);
    this._bindPreviewActions();

    return this;
  };

  ProductReviewsController.prototype.replaceReviewForm = function(reviewForm, score) {
    this._enableForm();
    this.newReviewForm.replaceWith(reviewForm);
    this.newReviewForm = reviewForm;
    this.bindShowPreviewAction();
    this.bindRatyToRating(score);

    return this;
  };

  ProductReviewsController.prototype.afterCreateActions = function() {
    this.reviewsContainer.find('.product-reviews-header.empty-set').remove();
    this.reviewPreview.addClass('submit').text(this.afterSubmitText);
    this._resetForm()._hideForm()._activateListing();

    return this;
  };

  ProductReviewsController.prototype._bindPreviewActions = function() {
    this._bindOnSubmitPreviewAction();
    this._bindOnEditPreviewAction();
    this._bindOnCancelPreviewAction();

    return this;
  };

  ProductReviewsController.prototype._bindOnSubmitPreviewAction = function() {
    var self = this;

    self.reviewPreview.find('a.submit-review-btn').off('click').on('click', function(event) {
      self._submitForm();

      event.preventDefault();
    });

    return this;
  };

  ProductReviewsController.prototype._bindOnEditPreviewAction = function() {
    var self = this;

    self.reviewPreview.find('a.edit-review').off('click').on('click', function(event) {
      self.reviewPreview.remove();
      self._showForm();
      self._enableForm();

      event.preventDefault();
    });

    return this;
  };

  ProductReviewsController.prototype._bindOnCancelPreviewAction = function() {
    var self = this;

    self.reviewPreview.find('a.cancel-review').off('click').on('click', function(event) {
      self.reviewPreview.remove();
      self._hideForm();
      self._resetForm();
      self._activateListing();

      event.preventDefault();
    });

    return this;
  };

  ProductReviewsController.prototype._onShowPreview = function() {
    this._disableForm();
    var reviewData = {
      title: this.newReviewForm.find('input.title').val(),
      body:  this.newReviewForm.find('textarea.body').val(),
      stars: this.newReviewForm.find('div.rating-stars').raty('score')
    };

    this._sendAjaxRequest('preview', 'post', {
      website_product_review: reviewData
    });

    return this;
  };

  ProductReviewsController.prototype._sendAjaxRequest = function(action, type, data) {
    if (!data) {
      data = {};
    }
    if (!type) {
      type = 'post';
    }

    var url = this.productUrl + '/reviews/' + action;

    $.ajax({
      url: url,
      type: type,
      data: data,
      dataType: 'script'
    }).error(function() {
      });

    return this;
  };

  ProductReviewsController.prototype._resetForm = function() {
    this._enableForm();
    this.newReviewForm.find("input[type=text], input[type=hidden], textarea").val("");  //this.newReviewForm.trigger('reset');
    this.newReviewForm.find('div.rating-stars').raty('reload');
    this.newReviewForm.find('div.rating-stars img').attr('src', '/assets/star-off.png');
    this.newReviewForm.find('.error').remove();
    this.unbindCancelReviewClickAction().bindCancelReviewClickAction();

    return this;
  };

  ProductReviewsController.prototype._disableForm = function() {
    this.reviewFormContainer.addClass('inactive');
    this.unbindCancelReviewClickAction().unbindShowPreviewAction();
    this.newReviewForm.find('div.rating-stars').raty('readOnly', true);
    this.newReviewForm.find('input[type="text"]').attr('disabled', 'disabled');
    this.newReviewForm.find('textarea').attr('disabled', 'disabled');

    return this;
  };

  ProductReviewsController.prototype._enableForm = function() {
    this.reviewFormContainer.removeClass('inactive');
    this.bindCancelReviewClickAction().bindShowPreviewAction();
    this.newReviewForm.find('div.rating-stars').raty('readOnly', false);
    this.newReviewForm.find('input[type="text"]').removeAttr('disabled');
    this.newReviewForm.find('textarea').removeAttr('disabled');

    return this;
  };

  ProductReviewsController.prototype._showForm = function() {
    this.reviewFormContainer.show(400);
    this.bindCancelReviewClickAction();
    this.bindShowPreviewAction();

    return this;
  };

  ProductReviewsController.prototype._hideForm = function() {
    this.reviewFormContainer.hide(400);

    return this;
  };

  ProductReviewsController.prototype._submitForm = function() {
    this.newReviewForm.find('input[type="text"]').removeAttr('disabled');
    this.newReviewForm.find('textarea').removeAttr('disabled');
    this.newReviewForm.submit();
    this.newReviewForm.find('input[type="text"]').attr('disabled', 'disabled');
    this.newReviewForm.find('textarea').attr('disabled', 'disabled');

    return this;
  };

  ProductReviewsController.prototype._activateListing = function() {
    this.reviewsListing.removeClass('inactive');
    this.addReviewBtn.removeClass('inactive');
    this.reviewsListing.find('div.reviews-paginator div.pagination-nav a').unbind('click', false);

    return this;
  };

  ProductReviewsController.prototype._deactivateListing = function() {
    this.addReviewBtn.addClass('inactive');
    this.reviewsListing.addClass('inactive');
    $('div.product-reviews.inactive div.reviews-paginator div.pagination-nav a').bind('click', false);

    return this;
  };

  return ProductReviewsController;
})();
