odoo.define('barcodes.FormViewBarcodeHandler', function(require) {
"use strict";

var core = require('web.core');
var utils = require('web.utils');
var common = require('web.form_common');
var BarcodeEvents = require('barcodes.BarcodeEvents');
var BarcodeHandlerMixin = require('barcodes.BarcodeHandlerMixin');
var KanbanRecord = require('web_kanban.Record');
var KanbanView = require('web_kanban.KanbanView');
var ListView = require('web.ListView');
var Dialog = require('web.Dialog');

var _t = core._t;


var barcode_error_play_sound = (function error_beep() {
    var snd = new Audio("data:audio/mpeg;base64,SUQzAwAAAAAAJlRQRTEAAAAcAAAAU291bmRKYXkuY29tIFNvdW5kIEVmZmVjdHMA//uSwAAAAAABLBQAAAL9Q+IPK0ACAAAAAAAAo8DLR2Axkf/A26eQONlnwMtCADLZD8D/qQAjn4GTFgacWG4/xGgYhCw4DJAP/BzgBQMBnBQDVQBoV/+BnBQB1gEQIDLBgDpAcF//gBEAFFAn8MSBYoOsk///xzhWoWzCgMQRAOFgobDpQCh////gWRh7oBQsCR8UUGx8CQseBBMOXKH///7N1niNGWD1A8wsoLKAWCCcgbGARDBOQNjAFhgt3////////+FsAtIHsToHqMXCOIKJ3FGAQBQZCIbEgbDYSDiaEgNPD0MpCCOSi7MXBHXkpsYwBgYvhKQBWYqBA5VUKg8YdA4YrAIND7zI4qkaNmjMgwTVpQUENmtNGNNYjMulMnBpddTjMyrNinAS8GzzcJAEVMol/WVYhDmVLgJGX5MOPBhYxQ4Oghj8rF7/94gJGLGAqDBRMDIGErJSDBS8INmKHDoTHX/+SV4KCNQd8tolZOK3JuDgYcABANM5AFl//+OJagDAFYFkFkEBjBi4BehP8HCwcyAyQFAB0FFQMMAgDf/7ksBmgCYVe2253SQEl69uNzmmgGX/llvH0m0qEBgcDbIpYDgb5u4XHUvLhsLjbIU/WRpIKEqw0bQP/H///1/z5Z8tGtdRcsmhWxEs+XTTgQzL1hwBo4YVAQ8GgyAK7iCcdAgAMhgnCj8jswQODjw+v9yP/pjhSKgAEBAQFg0FgMGEwmg0GWSUbIZh9sJmLx27TtGfg8RBcxISwg/O9owQIDEgGMpgQWEdNLjltzQjwGjOiS+sPAzToTRpTVpjDqRkPTfkAnZmBSsKG5k1hh6piIZlCuX6yNMeMsQEgjKAIEMKBCocEERY0NIv1l+kKDFg0N54DAyyadZQHDixhwAhBrTy/WX+JA0FHhV2YwMBgi/ACEGSYgHpelwxUKFBeX6y/8lhC/iSAGFrXuAIGWnT7FgxWJUDSaEiQKFIhrDlsv/L/y/8mmPGwcBBEADyKkRMVgQBvOWCIgHsBQnjokKC0Rh4ehmjkJFv/X/r/1/0hbdAOyecaW08tAppIFSJCL0Trk4OJKHrHMCAHA4iDx1VMqBxAFV0gejOmMLDmKCENmP/+5LAAYAXOX2DubekAv6zLic08EhRyOR2OxttxyMR1BOn8cgcDxW7NIjghQYUFggLt5MzbcmCBYGx0KWXwAiJPCuqDwT4lQhpKIlbTras0bYsxdzglzS8VnxaIQU9C5kuP21cY3eHPEeVOQ6S/ItiP3WsZ/vHtEeZjpCKhyTZ1CmN///s8kRkljucCJAUSdeqlXMTthrjP18ZxEh7j01EvvdFy4PlMzulbAc1dL//////q/xrd90pW98RGFqfsTawMr5jjMLVViwlbKgARRyTyihjyj8unPegY0d+ATJebEhClgQPUF/0M2yIE0kPw6i0CHB2f8MMwyoFzLqqv/zhF6McTQFILsXEWP//ncfqPR5oJNDjEUid///T6GqpCFYpzjU7chikXf///hMzgr2tqmUavXnBkX3L////pVC0MUytVarTjej1I4KhPv1GnNf////9lcmSA32cnBna4TgxwnJgguLPR2yf//////9waFewMT1nfsENlclY2N8d0q3jMyMatc2BmdM712AAIEIIcBAIBQIFAPHhxmRnihxA6gP+//uSwAsAF+GZiVmnhpMJszC3NPDQAkgkXTrCCn+mghomY2n4NMuhbxef8fgpaQHgEfKP/8KwCXRQ/D1GSDLFf//5Y3yoMuMYiEq1QHh//+yHW7iIe5oFRuKNOdF///+ijZ8K9n2vxV2u1A4q3/H+f+r2fbGzx37PHgMipZ8srOr2//////qc62drQ9VtqHqt6h8SG1qyIywoDi5x////////Hq/jzP480OPNDjxIbCznWn05O3n4pHTM3OCPWwAAwWBAYDQYA6HjAYDK1oFDjQJB+2Xjy8MQF8wsPFiX+7zLBY0gd+APwkYhYx/+OsyGsCEGKDN//QsFQJocA5XEd4bP//c2xUC5k7LIsRjHRC///c9Q2c6FAaSNOl6oHGv//tExAiHWr46dRC6swLhTf/1r/7sbOdCgiPGBwVKVWJmg6WJTU/////51q+d+xuagZNPGCMplMu3F4xtqhaXL///////xFG/2/Y46siaeMERXx7uaqVyna7N65YYznDhOQAwCAgEAkIgiESwoRAIaaVAELEYEfQvES9Gtl0AgAAAeQP/7ksAQgBmJmXm5t4SDEDMu6zlAEgOqynasYsEoBq8IOeg9QV1s6LALAkwBKF6Bo4zrA6wY5sD8BZD2ECDZzr50ZC+q0Lai/k1JkpCxf//s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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+5LApgAAAAEsAAAAAAAAJYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uSwP+AAAABLAAAAAAAACWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7ksD/gAAAASwAAAAAAAAlgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+5LA/4AAAAEsAAAAAAAAJYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uSwP+AAAABLAAAAAAAACWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7ksD/gAAAASwAAAAAAAAlgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+5LA/4AAAAEsAAAAAAAAJYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAA//uSwP+AAAABLAAAAAAAACWAAAAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAAA==");  
    return function() {     
        snd.play(); 
    }
})();

var barcode_confirm_play_sound = (function error_beep() {
    var snd = new Audio("data:audio/mpeg;base64,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AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7ksCKgBOhUsgHvM2IAAAlgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+5LA/4AAAAEsAAAAAAAAJYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uSwP+AAAABLAAAAAAAACWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7ksD/gAAAASwAAAAAAAAlgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+5LA/4AAAAEsAAAAAAAAJYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//uSwP+AAAABLAAAAAAAACWAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7ksD/gAAAASwAAAAAAAAlgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/+5LA/4AAAAEsAAAAAAAAJYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAA//uSwP+AAAABLAAAAAAAACWAAAAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAIAAgACAAAA==");  
    return function() {     
        snd.play(); 
    }
})();

// web_kanban.Record and web.list_common.Record do not implement the
// same interface and are thus inherently incompatible with each
// other. Luckily barcodes keeps things pretty simple when it comes to
// the records it wants to use. So if we give the KanbanRecord a get()
// function that behaves like the one of web.list.Record, everything
// is fine.
KanbanRecord.include({
    get: function (key) {
        return this.values[key] && this.values[key].value;
    },
});
var should_scroll = false;
var last_scanned_barcode;

ListView.include({
    reload_record: function (record) {
        if (this.model === "stock.pack.operation" || this.model === "stock.inventory.line") {
            $(window).scrollTop(record.$el.offset().top);
            barcode_confirm_play_sound();
        }
        return this._super.apply(this,arguments);
    }
});


KanbanView.include({
    reload_record: function (record) {
        if (this.model === "stock.pack.operation" || this.model === "stock.inventory.line") {
            $(window).scrollTop(record.$el.offset().top);
            barcode_confirm_play_sound();
        }
        return this._super.apply(this,arguments);
    },
    do_search: function () {
        self = this;
        return this._super.apply(this,arguments).then(function(){
            if (should_scroll && (self.model === "stock.pack.operation" || self.model === "stock.inventory.line")) {
                var record_to_scroll = _.find(self.widgets, function (record) {
                    return record.get('product_barcode') === last_scanned_barcode;
                });
                if (! record_to_scroll){
                    record_to_scroll = _.find(self.widgets, function (record) {
                    // be sure that the product_barcode is not false before substring-ing it. this situation should
                    // not happen but empty records (that somehow bypassed the required mechanism in the view) lead
                    // to tracebacks here.

                    var record_barcode = record.get('product_barcode');
                    if (! record_barcode) {
                        return false;
                    }
                    return record_barcode.substring(0,7) === last_scanned_barcode.substring(0,7);
                });
                }
                if (record_to_scroll){
                    //barcode_confirm_play_sound();
                    $(window).scrollTop(record_to_scroll.$el.offset().top)
                }
                else{
                    barcode_error_play_sound();
                }
                should_scroll = false;
                last_scanned_barcode = undefined;
            }
        });
    }
});

var FormViewBarcodeHandler = common.AbstractField.extend(BarcodeHandlerMixin, {
    init: function(parent, context) {
        this.__quantity_listener = _.bind(this._set_quantity_listener, this);
        BarcodeHandlerMixin.init.apply(this, arguments);

        this.process_barcode_mutex = new utils.Mutex();

        return this._super.apply(this, arguments);
    },

    start: function() {
        this._super();
        this.form_view = this.field_manager;
        // Hardcoded barcode actions
        this.map_barcode_method = {
            'O-CMD.NEW': _.bind(this.form_view.on_button_new, this.form_view),
            'O-CMD.EDIT': _.bind(this.form_view.on_button_edit, this.form_view),
            'O-CMD.CANCEL': _.bind(this.form_view.on_button_cancel, this.form_view),
            // FIXME: on_button_save shouldn't mix view and model concerns (it expects to be used as onclick handler)
            'O-CMD.SAVE': _.bind(this.form_view.on_button_save, this.form_view, {target: $('.o_cp_buttons .o_form_button_save')}),
        };
        // Old design pager actions
        if (this.form_view.execute_pager_action) {
            this.map_barcode_method['O-CMD.PAGER-PREV'] = _.bind(this.form_view.execute_pager_action, this.form_view, 'previous');
            this.map_barcode_method['O-CMD.PAGER-NEXT'] = _.bind(this.form_view.execute_pager_action, this.form_view, 'next');
        // New design pager actions
        } else if (this.form_view.pager) {
            this.map_barcode_method['O-CMD.PAGER-PREV'] = _.bind(this.form_view.pager.previous, this.form_view.pager);
            this.map_barcode_method['O-CMD.PAGER-NEXT'] = _.bind(this.form_view.pager.next, this.form_view.pager);
        }
    },

    destroy: function () {
        this.stop_listening();
        this._super.apply(this, arguments);
    },

    _display_no_edit_mode_warning: function() {
        this.do_warn(_t('Error : Document not editable'), _t('To modify this document, please first start edition.'));
    },

    _display_no_last_scanned_warning: function() {
        this.do_warn(_t('Error : No last scanned barcode'), _t('To set the quantity please scan a barcode first.'));
    },

    _set_quantity_listener: function(event) {
        var self = this;
        var character = String.fromCharCode(event.which);

        // only catch the event if we're not focused in
        // another field and it's a number
        if ($(event.target).is('body') && /[0-9]/.test(character)) {
            if (this.form_view.get('actual_mode') === 'view') {
                this._display_no_edit_mode_warning();
            } else {
                var field = this.form_view.fields[this.m2x_field];
                var view = field.viewmanager.active_view;
                var $content = $('<div>').append($('<input>', {type: 'text', class: 'o_set_qty_input'}));

                if (this.last_scanned_barcode) {
                    this.dialog = new Dialog(this, {
                        title: _t('Set quantity'),
                        buttons: [{text: _t('Select'), classes: 'btn-primary', close: true, click: function () {
                            var new_qty = this.$content.find('.o_set_qty_input').val();
                            var record = _.find(self._get_records(field), function (record) {
                                return record.get('product_barcode') === self.last_scanned_barcode;
                            });
                            if (record) {
                                var values = {};
                                values[self.quantity_field] = parseFloat(new_qty);
                                field.data_update(record.get('id'), values).then(function () {
                                    view.controller.reload_record(record);
                                });
                            } else {
                                self._display_no_last_scanned_warning();
                            }
                        }}, {text: _t('Discard'), close: true}],
                        $content: $content,
                    }).open();
                    // This line set the value of the key which triggered the _set_quantity in the input
                    this.dialog.$content.find('.o_set_qty_input').focus().val(character);

                    var $selectBtn = this.dialog.$footer.find('.btn-primary');
                    core.bus.on('keypress', this.dialog, function(event){
                        if (event.which === 13) {
                            event.preventDefault();
                            $selectBtn.click();
                        }
                    });
                } else {
                    this._display_no_last_scanned_warning();
                }
            }
        }
    },

    start_listening: function() {
        if (this.quantity_field && ! this.is_listening) {
            core.bus.on('keypress', this, this.__quantity_listener);
        }

        BarcodeHandlerMixin.start_listening.call(this);
    },

    stop_listening: function() {
        if (this.quantity_field && this.is_listening) {
            core.bus.off('keypress', this, this.__quantity_listener);
            delete this.last_scanned_barcode;
        }

        BarcodeHandlerMixin.stop_listening.call(this);
    },

    // Let subclasses add custom behaviour before onchange. Must return a deferred.
    // Resolve the deferred with true proceed with the onchange, false to prevent it.
    pre_onchange_hook: function(barcode) {
        return $.Deferred().resolve(true);
    },

    on_barcode_scanned: function(barcode) {
        var self = this;
        self.last_scanned_barcode = barcode;
        // Execute a harcoded action
        var action = this.map_barcode_method[barcode];
        if (typeof action === "function")
            return $.when(action());
        if (_.any(BarcodeEvents.ReservedBarcodePrefixes, function(prefix) { return barcode.indexOf(prefix) === 0 }))
            return;
        // Warn the user if form view is not editable
        else if (this.form_view.get('actual_mode') === 'view')
            this._display_no_edit_mode_warning();
        else {
            var process_barcode = function () {
                // this function can be passed to `Mutex.exec` in order to make sure
                // that every ongoing onchanges in the form view are done
                var form_onchanges_mutex = function () {
                    return self.form_view.onchanges_mutex.def;
                }

                // before setting the barcode field with the received barcode, we commit
                // every fields of the form view and we wait for their hypothetical ongoing
                // onchanges to finish
                var commit_mutex = new utils.Mutex();
                _.each(self.form_view.fields, function (field) {
                    commit_mutex.exec(function () {
                        return field.commit_value();
                    });
                    commit_mutex.exec(form_onchanges_mutex);
                });

                return commit_mutex.def.then(function () {
                    return self.pre_onchange_hook(barcode).then(function (proceed) {
                        if (proceed) {
                            should_scroll = true;
                            last_scanned_barcode = barcode;

                            self.set_value(barcode);       // set the barcode field with the received one

                            return form_onchanges_mutex(); // wait for its onchange to finish
                        }
                    });
                });
            };

            this.process_barcode_mutex.exec(process_barcode);
        }
    },

    _get_records: function(field) {
        var active_view = field.viewmanager.active_view;
        if (! active_view) {
            return [];
        }
        if (active_view.type === "kanban") {
            return active_view.controller.widgets;
        } else {
             // tree view case
            return active_view.controller.records.records;
        }
    },
});

core.form_widget_registry.add('barcode_handler', FormViewBarcodeHandler);

return FormViewBarcodeHandler;

});
