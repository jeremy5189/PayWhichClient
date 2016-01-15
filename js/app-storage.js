var LOCAL = {
    cards: [
        {
            type: 'cash',
            name: 'Cash',
            cashback_per    : 0,
            foreign_fee_per : 0
        }
    ],
    currency: {
        visa: {
            EUR: {
                NTD: 1
            },
            date: null,
            server_date: null
        },
        mastercard: {
            EUR: {
                NTD: 1
            },
            date: null,
            server_date: null
        },
        cash: {
            EUR: {
                NTD: 1
            }
        }
    },
    settings: {
        decimal: 'off',
        base_currency: 'EUR'
    }
};

var STORAGE = new LocalStorage(),
    get_tmp = STORAGE.get('LOCAL');

if( get_tmp != null )
    LOCAL = get_tmp;

var storage_card_add = function(card_obj) {
    LOCAL.cards.push(card_obj);
    storage_save();
};

var storage_save = function() {
    try {
        STORAGE.save('LOCAL', LOCAL);
    }
    catch(e) {
        console.log('Storage error!');
        console.log(e);
    }
}

var refresh_currency = function(btn_obj) {

    var save;

    $.ajax({
         type: "get",
         async: false,
         url: "http://lost.ntust.edu.tw/upload/jsonp/",
         dataType: "jsonp",
         jsonp: "callback",
         jsonpCallback: 'currency',
         beforeSend: function() {

            console.log('Retrieving currency data form API server...');
            save = $(btn_obj).val();
            $(btn_obj).val('Loading...');

         },
         success: function(res){

             console.log('Got data from server');
             console.log(res);
             $(btn_obj).val(save);

             LOCAL.currency.visa = res.visa;
             LOCAL.currency.visa.server_date = moment().format('YYYY-MM-DD HH:mm:ss');
             LOCAL.currency.mastercard = res.mastercard;
             LOCAL.currency.mastercard.server_date = moment().format('YYYY-MM-DD HH:mm:ss');

             storage_save();
             display_overview();
             refresh_currency_menu();
         },
         error: function(err){
             console.log('Error retrieving data');
             console.log(err);
             $(btn_obj).val('Error!');
         }
     });
}

var refresh_currency_menu = function() {

    $('#base_currency').html('');

    for( var cur in LOCAL.currency.visa ) {
        if( cur != 'date' && cur != 'server_date' ) {
            $('#base_currency').prepend('<option value="' + cur + '">' + CURRENCY_MAP[cur] + '</option>');
        }
        LOCAL.currency.cash[cur] = {
            NTD: 1
        }
    }

    storage_save();

    if( LOCAL.settings.base_currency != undefined || LOCAL.settings.base_currency == null ) {
        $("#base_currency").val(LOCAL.settings.base_currency);
        $("#base_currency option[value='" + LOCAL.settings.base_currency + "']").prop('selected', 'selected');
    }

    // Activate jqm
    $('#base_currency').selectmenu().selectmenu('refresh');
}
