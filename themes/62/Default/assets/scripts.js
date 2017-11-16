/** clear hint input text **/
$(function () {
  $(".filter-rule h4").click(function () {
    $(this).toggleClass("closed").parent().find('.top-container').toggleClass("unvis");
  });
});
$(function () {
  var $window = $(window);

  function ContentResize() {
    $('#wrapper div.content').removeAttr('style');
    var winHeight = $('#main-container').height();
    var indentWrap = $('#wrapper').offset();
    var footHeight = $('.footer-main').height();

    //console.log(winHeight);

    var contHeight = winHeight - indentWrap.top - (footHeight + 120);
    if (contHeight > 500) {
      $('#wrapper div.content').css('min-height', contHeight + 'px');
      if ($(".content-page.two-col").size() > 0) {
        $('.content-page.two-col').css('min-height', contHeight + 'px');
      }
    }

  }

  ContentResize();
  $window.resize(function () {
    ContentResize();
  });
});
$(function () {
    $('.filtering .filter-rule > ul').each(function () {
        tree = $(this);
        if (tree.find('ul').is('*'))
          tree.treeview({collapsed: true});
      }
    );
  }
);
$(function () {
    $(".clearHint").each(function () {
        if ($(this).attr('rel') == $(this).val()) {
          $(this).addClass("with-hint");
          if ($(this).attr('type') == 'password') {
            //$(this).clone().attr('type','text').insertAfter(this).addClass("input-password");
            var inputString = '<input type="text" class="input-text clearHint with-hint input-password" value="' + $(this).val() + '" rel="' + $(this).val() + '" />';
            $(this).parent().append(inputString);
            $(this).hide().val('');
          }
        }
      }
    );
    $(".clearHint").click(function () {
        var defaultText = $(this).attr("rel");
        ClearHint($(this), defaultText);
      }
    );
    $(".clearHint").blur(function () {
        var defaultText = $(this).attr("rel");
        RecallHint($(this), defaultText);
      }
    );
  }
);
function ClearHint(obj, defaulttext) {
  if ($(obj).val() == defaulttext) {
    if ($(obj).hasClass("input-password")) {
      $(obj).prev().show().focus().removeClass("with-hint");
      $(obj).hide();
    }
    $(obj).val("");
    $(obj).removeClass("with-hint");
  }
}
function RecallHint(obj, defaulttext) {
  if ($(obj).val() == "") {
    if ($(obj).attr('type') == 'password') {
      $(obj).hide().next().show().val(defaulttext).addClass("with-hint");
    }
    else {
      $(obj).val(defaulttext).addClass("with-hint");
    }
  }
}
$(function () {
    setShadowHeight();
  }
);
$(window).load(function () {
    setShadowHeight();
  }
);
function setShadowHeight() {
  var pageHeight = '100%';
  $("#main-container > em").height(pageHeight);
  $("#main-container > i").height(pageHeight);
}
/** custom select **/
$(function () {
    $('select.order-select').each(function () {
        var title = $(this).attr('title');
        if ($('option:selected', this).val() != '') title = $('option:selected', this).text();
        $(this)
          .css({
              'z-index': 10, 'opacity': 0, '-khtml-appearance': 'none'
            }
          )
          .after('<span class="order-select">' + title + '</span>')
          .change(function () {
              val = $('option:selected', this).text();
              $(this).next().text(val);
            }
          )
      }
    );
  }
);
/** set subnav width **/
$(function () {
    $("ul.nav > li.parent-li ul a").each(function () {
        var parentWidth = $(this).parents("ul.nav > li.parent-li").width();
        $(this).width(parentWidth - 1);
      }
    );
    $("ul.nav > li:first-child.parent-li ul a").each(function () {
        var parentWidth = $(this).parents("ul.nav > li.parent-li").width();
        $(this).width(parentWidth - 3);
      }
    );
    $("ul.nav > li > ul > li > ul").each(function () {
        var parentWidth = $(this).parents("ul.nav > li.parent-li").width();
        $(this).css("left", parentWidth + 5);
      }
    );
  }
);
/** order history hide/show details **/
$(function () {
    $("table.recent-orders").on("click", "a.view-details", function () {
        $(this).hide();
        $(this).parent().find("a.hide-details").css("display", "block");
        $(this).parents("table.recent-orders tr").addClass("shown-details").next().show();
        setShadowHeight();
      }
    );
    $("table.recent-orders").on("click", "a.hide-details", function () {
        $(this).hide();
        $(this).parent().find("a.view-details").css("display", "block");
        $(this).parents("table.recent-orders tr").removeClass("shown-details").next().hide();
        setShadowHeight();
      }
    );
    $("table.recent-orders").on("click", "a.view-sub-details", function () {
        $(this).hide();
        var $parent = $(this).parents('.details-top > div');
        $parent.find("a.hide-sub-details").show();
        $parent.find('.hidden-options').show();
        setShadowHeight();
      }
    );
    $("table.recent-orders").on("click", "a.hide-sub-details", function () {
        $(this).hide();
        var $parent = $(this).parents('.details-top > div');
        $parent.find("a.view-sub-details").show();
        $parent.find('.hidden-options').hide();
        setShadowHeight();
      }
    );

    $("table.recent-orders").on("click", "a.view-shipments", function () {
        $(this).hide();
        var $parent = $(this).parents('.details-top > div');
        $parent.find("a.hide-shipments").show();
        $parent.find('.shipments-details').show();
        setShadowHeight();
      }
    );
    $("table.recent-orders").on("click", "a.hide-shipments", function () {
        $(this).hide();
        var $parent = $(this).parents('.details-top > div');
        $parent.find("a.view-shipments").show();
        $parent.find('.shipments-details').hide();
        setShadowHeight();
      }
    );
  }
);
/** shopping cart hide/show details **/
$(function () {
    $(".shopping-cart").on("click", "a.item-options", function () {
        $(this).parents(".cart-item").find(".hidden-options").show();
        $(this).hide();
        $(this).next().show();
      }
    );
    $(".shopping-cart").on("click", "a.hide-item-options", function () {
        $(this).parents(".cart-item").find(".hidden-options").hide();
        $(this).hide();
        $(this).prev().show();
      }
    );
  }
);
/** small custom select **/
$(function () {
    $('select.small-select').each(function () {
        var title = $(this).attr('title');
        if ($('option:selected', this).val() != '') title = $('option:selected', this).text();
        $(this)
          .css({
              'z-index': 10, 'opacity': 0, '-khtml-appearance': 'none'
            }
          )
          .after('<span class="small-select">' + title + '</span>')
          .change(function () {
              val = $('option:selected', this).text();
              $(this).next().text(val);
            }
          )
      }
    );
  }
);
/** big custom select **/
$(function () {
    $('select.big-select').each(function () {
        var title = $(this).attr('title') || '';
        if ($('option:selected', this).val() != '') title = $('option:selected', this).text();
        var span = $('<span class="big-select"><span class="select-text"></span></span>');
        span.children().text(title);
        span.offset($(this).position());
        span.css({position: 'absolute'});
        $(this)
          .css({
              'z-index': 10, 'opacity': 0, '-khtml-appearance': 'none'
            }
          )
          .after(span)
          .change(function () {
              val = $('option:selected', this).text();
              $(this).next().find('.select-text').text(val);
            }
          )
      }
    );
  }
);

/** msdropdown select **/
$(function () {
  $('select.msdropdown-select').each(function () {
    $(this).msDropdown({
      animStyle: 'none',
      enableAutoFilter: false
    });
  });
});


/** amount custom select **/
$(function () {
    $('select.amount-select').each(function () {
        var title = $(this).attr('title');
        if ($('option:selected', this).val() != '') title = $('option:selected', this).text();
        $(this)
          .css({
              'z-index': 10, 'opacity': 0, '-khtml-appearance': 'none'
            }
          )
          .after('<span class="amount-select">' + title + '</span>')
          .change(function () {
              val = $('option:selected', this).text();
              $(this).next().text(val);
            }
          )
      }
    );
  }
);
/** product tabs **/
$(function () {
    var selectedId = "#" + $(".product-tabs ul li.selected a").attr("rel");
    $(selectedId).show();
    $(".product-tabs ul").on("click", "a", function () {
        var selectedId = "#" + $(this).attr("rel");
        $(".product-tabs ul li").removeClass("selected");
        $(this).parent().addClass("selected");
        $(".tabs-body > div").hide();
        $(selectedId).show();
      }
    );
  }
);
$(function () {
    $(document).ready(function () {
        var image = $('div.top-area a.logo img');
        image.on('load', function (event) {
            var wrapper = image.parent();
            if (!(image.width() >= wrapper.width() || image.height() >= wrapper.height())) {
              if (image.width() > image.height()) {
                image.css({
                    'width': wrapper.css('width'),
                    'height': 'auto'
                  }
                );
              }
              else {
                image.css({
                    'height': wrapper.css('height'),
                    'width': 'auto'
                  }
                );
              }
            }
          }
        );
      }
    );
  }
);

function load_recently_viewed_products(container) {
  $.ajax({
    url: '/recently_viewed_products',
    cache: false,
    dataType: 'html',
    success: function (response, status) {
      var jContainer = $(container);
      if (status == "success" && jContainer.length > 0) {
        jContainer.append(response);
        jContainer.show();

        setup_carousels(jContainer.find('.product .image-carousel'));
        bind_product_body_clicker(jContainer, '.product');
      }
    }
  });
}
