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
