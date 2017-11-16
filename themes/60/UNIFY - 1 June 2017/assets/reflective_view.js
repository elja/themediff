// product page form inputs binder

(function() {
    var __hasProp = {}.hasOwnProperty,
        __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

    window.ReflectiveView = {};

    ReflectiveView.Binder = (function() {

        Binder.match = function(reflectiveInput, input) {
            throw Error('Should be implemented in subclasses.');
        };

        function Binder(input) {
            this.input = $(input);
        }

        Binder.prototype.bindOn = function(inputs) {
            return this._bind(inputs);
        };

        Binder.prototype._bind = function(inputs) {
            this._bindOnSelfChange(inputs);
            return this._bindOnInputsChange(inputs);
        };

        Binder.prototype._bindOnSelfChange = function(inputs) {
            throw Error('Should be implemented in subclasses.');
        };

        Binder.prototype._bindOnInputsChange = function(inputs) {
            throw Error('Should be implemented in subclasses.');
        };

        return Binder;

    })();

    ReflectiveView.BinderFactory = (function() {

        function BinderFactory() {}

        BinderFactory.binders = [];

        BinderFactory.getBinder = function(reflectiveInput, input) {
            return _.find(this.binders, function(klass) {
                return klass.match(reflectiveInput, input);
            });
        };

        BinderFactory.registerBinder = function(klass) {
            if ((new klass) instanceof ReflectiveView.Binder) {
                if (!_.include(this.binders, klass)) {
                    return this.binders.push(klass);
                }
            } else {
                throw Error('Binder class should be a subclass of ReflectiveView.Binder');
            }
        };

        return BinderFactory;

    })();

    ReflectiveView.DefaultBinder = (function(_super) {

        __extends(DefaultBinder, _super);

        function DefaultBinder() {
            return DefaultBinder.__super__.constructor.apply(this, arguments);
        }

        DefaultBinder.reflectiveInputFilterSelector = '*';

        DefaultBinder.inputFilterSelector = '*';

        DefaultBinder.match = function(reflectiveInput, input) {
            if ($(reflectiveInput).is(this.reflectiveInputFilterSelector) && this._filter(input)) {
                return true;
            }
        };

        DefaultBinder._filter = function(input) {
            if ($(input).is(this.inputFilterSelector)) {
                return true;
            }
        };

        return DefaultBinder;

    })(ReflectiveView.Binder);

    ReflectiveView.InputToInputBinder = (function(_super) {

        __extends(InputToInputBinder, _super);

        function InputToInputBinder() {
            return InputToInputBinder.__super__.constructor.apply(this, arguments);
        }

        InputToInputBinder.reflectiveInputFilterSelector = 'input';

        InputToInputBinder.filterSelector = 'input';

        InputToInputBinder.prototype._bindOnSelfChange = function(inputs) {
            var _this = this;
            return this.input.on('change', function() {
                return $(inputs).val(_this.input.val());
            });
        };

        InputToInputBinder.prototype._bindOnInputsChange = function(inputs) {
            var _this = this;
            return $(inputs).on('change', function() {
                return _this.input.val($(inputs).val());
            });
        };

        return InputToInputBinder;

    })(ReflectiveView.DefaultBinder);

    ReflectiveView.BinderFactory.registerBinder(ReflectiveView.InputToInputBinder);

    ReflectiveView.SelectToInputBinder = (function(_super) {

        __extends(SelectToInputBinder, _super);

        function SelectToInputBinder() {
            return SelectToInputBinder.__super__.constructor.apply(this, arguments);
        }

        SelectToInputBinder.reflectiveInputFilterSelector = 'select';

        SelectToInputBinder.prototype._bindOnSelfChange = function(inputs) {
            var _this = this;
            return this.input.on('change', function() {
                return $(inputs).val(_this.input.children('option:selected').val());
            });
        };

        SelectToInputBinder.prototype._bindOnInputsChange = function(inputs) {
            var _this = this;
            return $(inputs).on('change', function() {
                return _this.input.val('').children('option[value="' + $(inputs).val() + '"]').attr('selected', 'selected');
            });
        };

        return SelectToInputBinder;

    })(ReflectiveView.InputToInputBinder);

    ReflectiveView.BinderFactory.registerBinder(ReflectiveView.SelectToInputBinder);

    ReflectiveView.SelectToSelectBinder = (function(_super) {

        __extends(SelectToSelectBinder, _super);

        function SelectToSelectBinder() {
            return SelectToSelectBinder.__super__.constructor.apply(this, arguments);
        }

        SelectToSelectBinder.reflectiveInputFilterSelector = 'select';

        SelectToSelectBinder.filterSelector = 'select';

        SelectToSelectBinder.prototype._bindOnSelfChange = function(inputs) {
            var _this = this;
            return this.input.on('change', function() {
                return _this._copySelection(_this.input, inputs);
            });
        };

        SelectToSelectBinder.prototype._bindOnInputsChange = function(inputs) {
            var _this = this;
            return $(inputs).on('change', function() {
                return _this._copySelection(inputs, _this.input);
            });
        };

        SelectToSelectBinder.prototype._copySelection = function(src, dest) {
            var _this = this;
            return _.each(src.children('option'), function(option, i) {
                return dest.children('option:eq(' + i + ')').attr('selected', $(option).attr('selected'));
            });
        };

        return SelectToSelectBinder;

    })(ReflectiveView.DefaultBinder);

    ReflectiveView.BinderFactory.registerBinder(ReflectiveView.SelectToSelectBinder);

    ReflectiveView.SpanToSpanBinder = (function(_super) {

        __extends(SpanToSpanBinder, _super);

        function SpanToSpanBinder() {
            return SpanToSpanBinder.__super__.constructor.apply(this, arguments);
        }

        SpanToSpanBinder.reflectiveInputFilterSelector = 'span';

        SpanToSpanBinder.inputFilterSelector = 'span';

        SpanToSpanBinder.prototype._bindOnSelfChange = function(inputs) {
            var _this = this;
            return this.input.on('change', function() {
                return _this._copyUniqText(_this.input, inputs);
            });
        };

        SpanToSpanBinder.prototype._bindOnInputsChange = function(inputs) {
            var _this = this;
            return $(inputs).on('change', function() {
                return _this._copyUniqText(inputs, _this.input);
            });
        };

        SpanToSpanBinder.prototype._copyUniqText = function(src, dst) {
            return $(dst).text(_.uniq(_.map($(src), function(srcEl) {
                return $(srcEl).text();
            })));
        };

        return SpanToSpanBinder;

    })(ReflectiveView.DefaultBinder);

    ReflectiveView.BinderFactory.registerBinder(ReflectiveView.SpanToSpanBinder);

    ReflectiveView.TextareaToTextareaBinder = (function(_super) {

        __extends(TextareaToTextareaBinder, _super);

        function TextareaToTextareaBinder() {
            return TextareaToTextareaBinder.__super__.constructor.apply(this, arguments);
        }

        TextareaToTextareaBinder.reflectiveInputFilterSelector = 'textarea';

        TextareaToTextareaBinder.filterSelector = 'textarea';

        return TextareaToTextareaBinder;

    })(ReflectiveView.InputToInputBinder);

    ReflectiveView.BinderFactory.registerBinder(ReflectiveView.TextareaToTextareaBinder);

    ReflectiveView.View = (function() {

        View.prototype.inputsSelector = 'input, select, textarea, span';

        function View(reflectiveInputsContainer, inputsContainer) {
            this._bindInputs(reflectiveInputsContainer, inputsContainer);
        }

        View.prototype._filter = function(input, type, id) {
            if ($(input).data('type') === type && $(input).data('id') === id) {
                return true;
            }
        };

        View.prototype._bindInputs = function(reflectiveInputsContainer, inputsContainer) {
            var _this = this;
            return _.each($(reflectiveInputsContainer).find(this.inputsSelector), function(reflectiveInput) {
                var inputs;
                if (!$(reflectiveInput).data('type')) {
                    return;
                }
                inputs = _this._findInputsForBinding(reflectiveInput, inputsContainer);
                return _this._bindInput(reflectiveInput, inputs);
            });
        };

        View.prototype._bindInput = function(reflectiveInput, inputs) {
            var binder, binderClass;
            binderClass = ReflectiveView.BinderFactory.getBinder(reflectiveInput, inputs);
            binder = new binderClass(reflectiveInput);
            binder.bindOn(inputs);
            return $(inputs).trigger('change');
        };

        View.prototype._findInputsForBinding = function(reflectiveInput, inputsContainer) {
            var id, type,
                _this = this;
            type = $(reflectiveInput).data('type');
            id = $(reflectiveInput).data('id');
            return _.filter($(inputsContainer).find(this.inputsSelector), function(input) {
                return _this._filter(input, type, id);
            });
        };

        return View;

    })();

}).call(this);
