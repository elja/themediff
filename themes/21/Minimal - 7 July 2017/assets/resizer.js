(function() {
    if (typeof jQuery !== 'undefined') {
        $(window).load(function() {
            var areaHeight, element, maxAreaHeight, parent, parentMinHeight, _i, _len, _ref;
            parent = $('.iframe-area');
            parentMinHeight = 200;
            maxAreaHeight = 0;
            _ref = parent.children();
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                element = _ref[_i];
                element = $(element);
                areaHeight = element.position().top + element.height();
                if (areaHeight > maxAreaHeight) maxAreaHeight = areaHeight;
            }
            return parent.height(maxAreaHeight > parentMinHeight ? maxAreaHeight : parentMinHeight);
        });
    }
}).call(this);
