(function() {
    var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

    window.CountrySelectController = (function() {
        function CountrySelectController(country_selector, state_selector, for_custom_select, options) {
            if (for_custom_select == null) {
                for_custom_select = true;
            }
            if (options == null) {
                options = {};
            }
            this.change_country_handler = __bind(this.change_country_handler, this);
            this.debug = false;
            this.j_country = $(country_selector);
            this.j_state = $(state_selector);
            this.for_custom_select = for_custom_select;
            this.options = options;
            this.first_time_country = this.get_country_value();
            this.first_time_state = this.get_state_value();
            this.custom_update_handler = this.update_for_chosen_custom_select;
            this.finish_initialize();
        }

        CountrySelectController.prototype.finish_initialize = function() {
            if (this.for_custom_select) {
                this.j_country.chosen(this.options);
                this.j_state.chosen(this.options);
            }
			if(!this.first_time_country){
		        this.j_country.find("option[value='United States']").attr("selected", true);
            	this.change_country_handler();
            }
            return this.bind_events();
        };

        CountrySelectController.prototype.send_changed = function() {};

        CountrySelectController.prototype.set_country_state = function(country, state) {
            if (!this.first_time_country) {
                this.first_time_country = country;
                this.j_country.val(country);
            }
            this.first_time_state = state;
            this.j_state.val(state);
            return this.change_country_handler();
        };

        CountrySelectController.prototype.set_country_state_via_zip = function(country, state) {
            this.first_time_country = country;
            this.j_country.val(country);
            this.first_time_state = state;
            this.j_state.val(state);
            return this.change_country_handler();
        };

        CountrySelectController.prototype.update_for_chosen_custom_select = function() {
            this.j_country.trigger("liszt:updated");
            return this.j_state.trigger("liszt:updated");
        };

        CountrySelectController.prototype.bind_events = function() {
            if (this.debug) {
                console.log('bind onchange event for country select');
            }
            return this.j_country.change(this.change_country_handler);
        };

        CountrySelectController.prototype.get_country_value = function() {
            return this.j_country.val();
        };

        CountrySelectController.prototype.get_state_value = function() {
            return this.j_state.val();
        };

        CountrySelectController.prototype.change_country_handler = function(event) {
            var content, self, states;
            self = this;
            if (this.debug) {
                console.log('change states');
            }
            states = get_states(get_country_id(this.get_country_value()));
            if (this.debug) {
                console.log(states);
            }
            content = "<option value=''></option>";
            $.map(states, function(element) {
                if (this.debug) {
                    console.log(element);
                }
                return content += "<option" + (self.get_country_value() === self.first_time_country && self.first_time_state === element ? " selected " : "") + " value=\"" + element + "\">" + element + "</option>";
            });
            if (this.debug) {
                console.log(content);
            }
            this.j_state.html(content);
            if (this.custom_update_handler) {
                return this.custom_update_handler();
            }
        };

        CountrySelectController.prototype.set_custom_select_update_handler = function(function_var) {
            return this.custom_update_handler = function_var;
        };

        CountrySelectController.prototype.enable_postal_code = function(postal_code_selector, city_selector, street_selector) {
            var self;
            self = this;
            this.postlcode_field = $(postal_code_selector);
            this.city_field = $(city_selector);
            this.street_field = $(street_selector);
            return this.postlcode_field.keyup(function(event) {
                return get_address_by_postal_code(self);
            });
        };

        CountrySelectController.prototype.set_city_name = function(value) {
            return this.city_field.val(value);
        };

        CountrySelectController.prototype.set_street_name = function(value) {
            return this.street_field.val(value);
        };

        CountrySelectController.prototype.get_postal_code = function() {
            return this.postlcode_field.val();
        };

        return CountrySelectController;

    })();

}).call(this);