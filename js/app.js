var TRANS = {
    int_currency : '國際組織匯率',
    foreign_fee  : '跨國手續',
    local_val    : '本次交易金額',
    cashback_val : '現金回饋',
    gain_val     : '淨回饋收入',
    actual_val   : '實際支付金額'
};

var LOCAL = {
    cards: [
        {
            type: 'mastercard',
            name: 'Master Platium',
            cashback_per    : 0.5,
            foreign_fee_per : 1.5
        },
        {
            type: 'visa',
            name: 'VISA Signature',
            cashback_per    : 2,
            foreign_fee_per : 1.5
        }
    ],
    currency: {
        visa: {
            EUR: {
                TWD: 36.0503
            },
            date: '1/1/2016'
        },
        mastercard: {
            EUR: {
                TWD: 35.7313
            },
            date: '12/31/2015'
        },
    }
};

var calculator = (function(){

    var custom_round = function(value) {
        // Round to decimal 2
        var round_to_deciaml = 1;
        return Math.round(value * Math.pow(10, round_to_deciaml)) / Math.pow(10, round_to_deciaml);
    };

    var percentage = function(value) {
        return value / 100;
    }

    return {
        card: function(base_value, base_currency, card_obj) {

            var int_currency = LOCAL.currency[card_obj.type][base_currency].TWD,
                foreign_fee  = base_value * int_currency * percentage(card_obj.foreign_fee_per),
                local_val    = base_value * int_currency + foreign_fee,
                cashback_val = base_value * int_currency * percentage(card_obj.cashback_per),
                gain_val     = cashback_val - foreign_fee,
                actual_val   = local_val - cashback_val;

            return {
                int_currency : [
                    int_currency,
                    LOCAL.currency[card_obj.type].date
                ],
                foreign_fee  : [
                    custom_round(foreign_fee),
                    card_obj.foreign_fee_per + '%'
                ],
                local_val    : [
                    custom_round(local_val),
                    null
                ],
                cashback_val : [
                    custom_round(cashback_val),
                    card_obj.cashback_per + '%'
                ],
                gain_val     : [
                    custom_round(gain_val),
                    null
                ],
                actual_val   : [
                    custom_round(actual_val),
                    null
                ]
            };
        }
    }

})();

var generator = (function(){

    var listview_li = function(obj) {

        var html = '<li class="ul-detail">' + obj.title +
                   '<span class="detail-note"> ' + obj.note +
                   '</span><span class="ui-li-count">' + obj.value +
                   '</span></li>';

        return html;
    };

    var collapsibleset = function(obj, index) {

        var html = '<div data-role="collapsible" id="collapsible-' + index + '">' +
                   '<h2>' + obj[0] +
                   '<span class="ui-li-count">' + obj[1] +
                   '</span></h2><ul data-role="listview" class="listview-ul"></ul></div>';

        return html;
    }

    return {

        // Return function, actually been executed
        cards: function(card_array, result_container_id) {

            for( var index in card_array ) {
                $('#' + result_container_id).append(
                    collapsibleset(
                        card_array[index], index
                    )
                );
            }

            // Apply jqueryMobile style and function first
            $('#' + result_container_id).collapsibleset('refresh');

            // Deal with listview inside collapsibleset later
            for( var index in card_array ) {

                for( var detail_index in card_array[index][2] ) {

                    $('#collapsible-' + index + ' .listview-ul').append(
                        listview_li(card_array[index][2][detail_index])
                    );

                }

                // Apply List View style
                $('#collapsible-' + index + ' .listview-ul').listview().listview('refresh');
            }
        }
    }

})();

$(function(){

    //generator.cards();
    $('#input-form').submit(function(event){

        event.preventDefault();

        var base_value     = $('#number-pattern').val(),
            base_currency  = $('#base_currency').val(),
            card_array     = [],
            sortable       = [];

        for( var card_index in LOCAL.cards ) {

            var detail_raw = calculator.card(base_value, base_currency, LOCAL.cards[card_index]),
                datail_arr = [];

            console.log(detail_raw);

            for( var key in detail_raw ) {

                var note = detail_raw[key][1];

                if( note != null ) {
                    note = '(' + note + ')';
                }
                else {
                    note = ''
                }

                datail_arr.push({
                    title : TRANS[key],
                    note  : note,
                    value : detail_raw[key][0]
                });
            }

            card_array.push([
                LOCAL.cards[card_index].name,
                detail_raw.actual_val[0],
                datail_arr
            ]);
        }

        card_array.sort(function(a, b) {
            return a[1] - b[1];
        });

        generator.cards(card_array, 'result');

    });

});
