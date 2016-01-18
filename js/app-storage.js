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
    },
    api: {
        key: 'nl',
        url: {
            jp: 'http://jp.api.paywhich.pw/jsonp/',
            nl: 'http://nl.api.paywhich.pw/json/'
        }
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

    $(document).ajaxError(function(err) {
      console.log('AJAX Error!');
      console.log(err);
    });

    $.ajax({
         type: "get",
         async: false,
         url: LOCAL.api.url[LOCAL.api.key],
         dataType: "jsonp",
         jsonp: "callback",
         jsonpCallback: 'currency',
         beforeSend: function() {

            console.log('Retrieving currency data form API server...');
            console.log('Using server: ' + LOCAL.api.url[LOCAL.api.key]);
            save = $(btn_obj).val();
            $(btn_obj).val('Loading...');

         },
         success: function(res, body, xhr){

             console.log(xhr);
             if( xhr.status == 200 ) {

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

             } else {

                 console.log('Error retrieving data');
                 console.log(err);
                 $(btn_obj).val('Error!');
                 alert('匯率取得失敗！使用離線匯率');

             }
         },
         error: function(err) {
             console.log(err);
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
