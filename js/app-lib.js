var custom_round = function(value, round_to_deciaml, do_sep) {

    // Round to decimal
    if( round_to_deciaml == undefined )
        round_to_deciaml = 1;

    if( do_sep == undefined )
        do_sep = true;

    var x = Math.round(value * Math.pow(10, round_to_deciaml)) / Math.pow(10, round_to_deciaml);

    if( x % 1 === 0 ) {
        // is int
        x += '.0';
    }

    // Thousands Seps
    if( do_sep )
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    else {
        return x;
    }
};

var refresh_decimal = function() {

    if( LOCAL.settings.decimal == 'off' ) {
        $('#inputbox').prop('step', '');
        $('#inputbox').prop('pattern', '[0-9]*');
    } else {
        $('#inputbox').prop('step', 'any');
        $('#inputbox').prop('pattern', '');
    }

};

var display_overview = function() {

    var card_array   = [];

    // Card record
    for( var card_index in LOCAL.cards ) {

        var detail_array = [];

        for( var key in LOCAL.cards[card_index] ) {

            if( key != 'name' ) {
                detail_array.push({
                    title: TRANS[key],
                    note : '',
                    value: LOCAL.cards[card_index][key] == null ? '-' : LOCAL.cards[card_index][key]
                });
            }
        }

        if( LOCAL.cards[card_index].type != 'cash' ) {
            detail_array.push({
                title: TRANS['opr'],
                note : '',
                value: {
                    html : TRANS['delete'],
                    class: 'delete-card',
                    id   : card_index
                }
            });
        }

        card_array.push([
            TRANS['cards'] + ' / ' + LOCAL.cards[card_index].name,
            '-',
            detail_array
        ]);
    }

    // Currency record
    for( var int_org in LOCAL.currency ) {

        var detail_array = [];

        for( var cur in LOCAL.currency[int_org] ) {

            if( cur != 'date' && cur != 'server_date' ) {

                if( int_org != 'jcb' ) {

                    // Reverse push
                    detail_array.unshift({
                        title: CURRENCY_MAP[cur] == undefined ? cur : CURRENCY_MAP[cur],
                        note : '',
                        value: 'NTD$ ' + custom_round(LOCAL.currency[int_org][cur].NTD, 4, false)
                    });

                } else {
                    
                    detail_array.push({
                        title: CURRENCY_MAP[cur] == undefined ? cur : CURRENCY_MAP[cur],
                        note : '',
                        value: 'NTD$ ' + custom_round(LOCAL.currency[int_org][cur].NTD, 4, false)
                    });
                }

            } else {

                if( int_org == 'cash' && (cur == 'date' || cur == 'server_date') )
                    continue;

                var note, val = LOCAL.currency[int_org][cur] == null ? '-' : LOCAL.currency[int_org][cur];

                if( val != '-' && cur == 'date' ) {
                    note = '(' + moment(val, 'MM/DD/YYYY').fromNow() + ')';
                }
                else if( val != '-' && cur == 'server_date') {
                    note = '(' + moment(val, 'YYYY/MM/DD HH:mm:ss').fromNow() + ')';
                }

                detail_array.push({
                    title: TRANS[cur],
                    note : note,
                    value: val
                });

            }
        }

        card_array.push([
            TRANS['currency'] + ' / ' + TRANS[int_org],
            '-',
            detail_array
        ]);

    }

    generator.cards(card_array, 'result');
};

var calculator = (function(){

    var percentage = function(value) {
        return value / 100;
    }

    return {
        card: function(base_value, base_currency, card_obj) {

            var int_currency = LOCAL.currency[card_obj.type][base_currency].NTD,
                foreign_fee  = base_value * int_currency * percentage(card_obj.foreign_fee_per),
                local_val    = base_value * int_currency + foreign_fee,
                cashback_val = base_value * int_currency * percentage(card_obj.cashback_per),
                gain_val     = cashback_val - foreign_fee,
                actual_val   = local_val - cashback_val,
                int_cur_date = moment(LOCAL.currency[card_obj.type].date, 'MM/DD/YYYY').fromNow();

            if( int_cur_date == 'Invalid date')
                int_cur_date = '';
            else
                int_cur_date = ', ' + int_cur_date;

            return {
                int_currency : [
                    custom_round(int_currency * base_value),
                    custom_round(int_currency, 3) + int_cur_date
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

        var html, value = obj.value;

        if( typeof(value) === 'object' ) {
            // Delete button
            html = '<li class="ul-detail ' + value.class + '" data-id="' + value.id + '">' + obj.title +
                   '<span class="detail-note"> ' + obj.note +
                   '</span><span data-id="' + value.id + '" class="ui-li-count ' + value.class + '">' + value.html +
                   '</span></li>';
        }
        else {
            html = '<li class="ul-detail">' + obj.title +
                   '<span class="detail-note"> ' + obj.note +
                   '</span><span class="ui-li-count">' + value +
                   '</span></li>';
        }

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

            // Clear
            $('#' + result_container_id).html('');

            for( var index in card_array ) {
                $('#' + result_container_id).append(
                    collapsibleset(
                        card_array[index], index
                    )
                );
            }

            // Apply jqueryMobile style and function first
            $('#' + result_container_id).collapsibleset().collapsibleset('refresh');

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
