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
            local_updated_at: null
        },
        mastercard: {
            EUR: {
                NTD: 1
            },
            date: null,
            local_updated_at: null
        },
        jcb: {
            EUR: {
                USD: 1,
                NTD: 1
            },
            date: null,
            local_updated_at: null
        },
        cash: {
            EUR: {
                NTD: 1
            }
        }
    },
    settings: {
        decimal: 'off',
        base_currency: 'EUR',
        app_title: 'PayWhich Beta'
    },
    api: {
        key: 'jp',
        url: {
            jp: 'http://api.paywhich.patricks.tw/jsonp/',
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

var refresh_currency = function() {

    $.jsonp({
         url: LOCAL.api.url[LOCAL.api.key],
         callback: 'func',
         callbackParameter: 'callback',
         beforeSend: function() {

            console.log('Retrieving currency data form API server...');
            console.log('Using server: ' + LOCAL.api.url[LOCAL.api.key]);

            display_status('匯率更新中...', false);
         },
         success: function(res, body, xhr){

             console.log('Got data from server');
             console.log(res);

             display_status('匯率更新成功', true);

             var date = moment().format('YYYY-MM-DD HH:mm:ss');

             if( res.visa.length == getObjectCount() ) {
                 LOCAL.currency.visa = res.visa;
                 LOCAL.currency.visa.local_updated_at = date
             } else {
                 display_status('VISA 匯率未更新', true);
             }

             if( res.mastercard.length == getObjectCount() ) {
                 LOCAL.currency.mastercard = res.mastercard;
                 LOCAL.currency.mastercard.local_updated_at = date;
             } else {
                 display_status('Master 匯率未更新', true);
             }

             if( res.jcb.length == getObjectCount() ) {
                 LOCAL.currency.jcb = res.jcb;
                 LOCAL.currency.jcb.local_updated_at = date;
             } else {
                 display_status('JCB 匯率未更新', true);
             }

             storage_save();
             display_overview();
             refresh_currency_menu();

         },
         error: function(err) {

             console.log('JSONP Error retrieving data');
             console.log(err);

             display_status('匯率更新失敗', true);
             refresh_currency_menu();
         }
     });
};

var display_status = function(msg, _resume) {

    var $obj = $('#app-title'),
        save = LOCAL.settings.app_title;

    $obj.html(msg);

    if(_resume) {
        setTimeout(function(){
            $('#app-title').html(save);
        }, 2500);
    }
};

var refresh_currency_menu = function() {

    $('#base_currency').html('');

    for( var cur in LOCAL.currency.visa ) {
        if( cur != 'date' && cur != 'local_updated_at' && cur != 'length') {
            $('#base_currency').prepend('<option value="' + cur + '">' + CURRENCY_MAP[cur] + '</option>');
        }
        LOCAL.currency.cash[cur] = {
            NTD: 1
        }
    }

    storage_save();

    // Resume last used base currency
    if( LOCAL.settings.base_currency != undefined || LOCAL.settings.base_currency == null ) {
        $("#base_currency").val(LOCAL.settings.base_currency);
        $("#base_currency option[value='" + LOCAL.settings.base_currency + "']").prop('selected', 'selected');
    }

    // Activate jqm
    $('#base_currency').selectmenu().selectmenu('refresh');
}
