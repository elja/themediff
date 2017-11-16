window.RequestSample = (function() {
  function RequestSample(link) {
    this.$link = $(link);
    this.bindDialog();
  }

  RequestSample.prototype.bindForm = function() {
    this.bindCustomSelect();
    this.bindBigSelect();
    this.bindCountrySelect();
    this.bindExistingAddressSelect();
  };

  RequestSample.prototype.updateDialogContent = function() {
    var self = this;

    this.$dialog.empty();
    this.$dialog.showLoading();

    $.ajax({
      url: this.$link.data('url'),
      dataType: 'html',
      type: 'GET',
    }).always(function() {
      self.$dialog.hideLoading();
    }).done(function(html) {
      self.$dialog.html(html);
      self.bindForm();
    });
  };

  RequestSample.prototype.onDialogSend = function() {
    var self = this;
    this.$dialog.showLoading();
    var $form = this.$dialog.find('form');

    $.ajax({
      url: $form.prop('action'),
      data: $form.serialize(),
      type: 'POST',
      dataType: 'html'
    }).always(function() {
      self.$dialog.hideLoading();
    }).done(function() {
      notice = "<div class='notification notification-success'>Sample Request Submitted</div>"
      $('.notification-area').html(notice)
      self.$dialog.dialog('close');
      $(document).scrollTop(0);
    }).fail(function(xhr) {
      if (xhr.status == 422) {
        self.$dialog.html(xhr.responseText);
        self.bindForm();
      }
      else {
        console.log('Server Error!', xhr);
      }
    });
  };

  RequestSample.prototype.bindDialog = function() {
    var self = this;

    this.$dialog = $('<div></div>');
    this.$dialog.dialog({
      dialogClass: 'wishlist-quote-dialog request-sample-dialog',
      autoOpen: false,
      modal: true,
      resizable: false,
      draggable: false,
      title: 'Request for sample',
      width: 670,
      minHeight: 550,
      zIndex: 4000,
      open: function() { self.updateDialogContent() },
      buttons: [
        {
          text: "Send Request",
          class: 'right primary',
          click: function () { self.onDialogSend() }
        },
        {
          text: "Cancel",
          class: 'left secondary',
          click: function () { self.$dialog.dialog("close"); }
        }
      ]
    });

    this.$link.click(function(event) {
      event.preventDefault();
      self.$dialog.dialog('open');

      return false;
    });
  };

  RequestSample.prototype.bindBigSelect = function() {
    this.$dialog.find('select.big-select').each(function () {
      var title = $(this).attr('title') || '';
      if ($('option:selected', this).val() != '') {
        title = $('option:selected', this).text();
      }
      var span = $('<span class="big-select"><span class="select-text"></span></span>');

      span.children().text(title);
      span.offset($(this).position());
      span.css({position: 'absolute'});

      $(this)
        .css({'z-index': 5000, 'opacity': 0, '-khtml-appearance': 'none'})
        .after(span)
        .change(function () {
          val = $('option:selected', this).text();
          $(this).next().find('.select-text').text(val);
        });
    });
  };

  RequestSample.prototype.bindCustomSelect = function() {
    this.$dialog.find('select.msdropdown-select').each(function () {
      $(this).msDropdown({
        animStyle: 'none',
        enableAutoFilter: false
      });
    });
  };

  RequestSample.prototype.bindCountrySelect = function() {
    new CountrySelectController(
      this.$dialog.find('.country select'),
      this.$dialog.find('.state select')
    );
  };

  RequestSample.prototype.bindExistingAddressSelect = function() {
    var self = this;

    var container = this.$dialog;
    var select = container.find('select.address-dropdown');

    select.on('change', function(event) {
      var addressId = $(this).val();

      if (addressId != '-1') {
        $.ajax({
          url: '/account/addresses/' + addressId
        }).success(function(data, textStatus, jqXHR) {
          self._updateAddress(container, data.address);
        }).error(function(jqXHR, textStatus, errorThrown) {
          console.log("can't get address information.");
        });
      }
    });
  };

  RequestSample.prototype._updateAddress = function(selector, data) {
    var container = $(selector);
    container.find('input.company').val(data.company);
    container.find('input.first-address').val(data.first_address);
    container.find('input.second-address').val(data.second_address);
    container.find('input.city').val(data.city);
    container.find('.country select').val(data.country).trigger('change');;
    container.find('.state select').val(data.state).trigger('change');;
    container.find('input.zip').val(data.zip);
    container.find('input.first-name').val(data.first_name);
    container.find('input.last-name').val(data.last_name);
    container.find('input.email').val(data.email);
    container.find('input.phone').val(data.phone);

    container.find('select').trigger("liszt:updated");
  };

  return RequestSample;
})();

$(function() {
  var $link = $('#request-sample');
  if ($link.length > 0) { new RequestSample($link); }
});
