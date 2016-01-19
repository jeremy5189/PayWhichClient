
$(function(){

    // Init
    display_overview();
    refresh_decimal();
    addToHomescreen();
    refresh_currency();

    // Delete card
    $(document).on('click', '.delete-card', function() {
        var index = $(this).data('id');
        if( confirm('確定要刪除卡片: ' + LOCAL.cards[index].name) ) {
            LOCAL.cards.splice(index, 1);
            storage_save();
            display_overview();
        }
    });

    // Add popup close
    $('#add-cancel').click(function(){
        $("#popupAdd").popup( "close" );
    });

    // Refresh Button
    $(document).on('click', '#app-refresh', function(){
        refresh_currency('#app-refresh');
    });

    // Settings button
    $(document).on('click', '#app-settings', function() {

        var base = $('#base_currency').val();

        // Not defined yet
        if( LOCAL.currency.cash[base] == undefined ) {
            LOCAL.currency.cash[base] = {
                NTD: 1
            };
        }

        $('#cash_currency_rate').val(LOCAL.currency.cash[base].NTD);
        $('#decimal-flip').val(LOCAL.settings.decimal).slider('refresh');
        $('#cash_currency_rate_label').html('現金平均匯率 (目前: ' + base + ')')
    });

    // Clear LocalStorage
    $(document).on('click', '#app-clear', function() {
        if(confirm('請問是否要清除所有資料？您的卡片資料會全部遺失')) {
            STORAGE.nuke();
            location.reload();
            display_overview();
        }
    });

    // Deciaml flip
    $(document).on('change', '#decimal-flip', function() {
        LOCAL.settings.decimal = $(this).val();
        storage_save();
        refresh_decimal();
    });

    // Base curreny change
    $(document).on('change', '#base_currency', function() {
        LOCAL.settings.base_currency = $(this).val();
        storage_save();
        display_overview();
    });

    // Save cash currency rate
    $(document).on('input', '#cash_currency_rate', function() {

        if( $(this).val() != '' ) {

            var base = $('#base_currency').val();

            if( LOCAL.currency.cash[base] == undefined )
                LOCAL.currency.cash[base] = {};

            LOCAL.currency.cash[base].NTD = parseFloat($(this).val());
            console.log('Save cash curreny %s = %s', base, LOCAL.currency.cash[base].NTD)
            storage_save();
            display_overview();
        }
    });

    // Save popup
    $('#add-form').submit(function(event){

        event.preventDefault();

        var form_data = $(this).serializeArray(),
            card_obj  = {};

        //console.log(form_data);

        for( var index in form_data ) {

            if( form_data[index].name != 'name' && form_data[index].name != 'type' ) {
                card_obj[form_data[index].name] = parseFloat(form_data[index].value);
                if( isNaN(card_obj[form_data[index].name]) ) {
                    return false;
                }
            }
            else {

                card_obj[form_data[index].name] = form_data[index].value;

                if( card_obj[form_data[index].name] == 'none' || card_obj[form_data[index].name] == '') {
                    return false;
                }

            }
        }

        //console.log(card_obj);

        // Add to LOCAL
        storage_card_add(card_obj);

        // refresh
        display_overview();

        $("#popupAdd").popup("close");
    });

    // Calculate event
    $('#inputbox').on('input', function(event){

        var base_value     = $('#inputbox').val(),
            base_currency  = $('#base_currency').val(),
            card_array     = [];

        //console.log(base_value.length);

        if( base_value == '' || base_value.length == 0 ) {
            display_overview();
            return;
        }

        for( var card_index in LOCAL.cards ) {

            var detail_raw = calculator.card(base_value, base_currency, LOCAL.cards[card_index]),
                datail_arr = [];

            //console.log(detail_raw);

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
                TRANS[LOCAL.cards[card_index].type] + ' / ' + LOCAL.cards[card_index].name,
                detail_raw.actual_val[0], // arr[1]
                datail_arr
            ]);
        }

        // Sort actual value
        card_array.sort(function(a, b) {
            a[1] = parseFloat(a[1].toString().replace(/,/g, ''));
            b[1] = parseFloat(b[1].toString().replace(/,/g, ''));
            return a[1] - b[1];
        });


        for( var i = 0; i < card_array.length; i++ ) {

            //card_array[i][1] -= card_array[0][1];

            //if( card_array[i][1] > 0 )
            //    card_array[i][1] = '+' + card_array[i][1];

            card_array[i][1] = custom_round(card_array[i][1]);
        }

        //card_array[0][1] = custom_round(card_array[0][1]);

        generator.cards(card_array, 'result');

    });

});
