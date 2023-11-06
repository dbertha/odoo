odoo.define('point_of_sale.models_limits', function(require) {
    "use strict";
    /*
        This JavaScript file, 'point_of_sale.models_limits', is intended for limiting the number of records loaded from the server in a testing environment.
        The object 'Test_env_limits_array' specifies the limits for each model that needs to be restricted. 
        For models not requiring limitation, the limit is set to 0. For models that do need to be limited, the limit is set to a positive number.
        If the limit is set to a negative number, the limit is ignored.
    */
    const Test_env_limits_array = {
        'product.product': 10,
        'res.partner': 10,
    };
    var exports = {};
    exports.is_a_test_pos = function(posConfigId) {
        var test_pos_ids = [1, 2];
        return test_pos_ids.indexOf(posConfigId) !== -1;
    }

    exports.add_limits = function(model) {
        let limitedModel;
        for (limitedModel in Test_env_limits_array) {
            if (model.model === limitedModel) {
                var limit = Test_env_limits_array[limitedModel];
                console.log(`--------Limiting model: ${limitedModel} to ${limit}----- as this pos config is for testing environment`);
                // Add limit to the loaded records
                if (limit && typeof limit === 'number' && limit > 0) {
                    model.limit = limit;
                }
                return model;
            }

        }
        return model;

    }

    return exports;
});