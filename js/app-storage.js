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
            date: null
        },
        mastercard: {
            EUR: {
                NTD: 1
            },
            date: null
        },
        cash: {
            EUR: {
                NTD: 1
            },
            date: null
        }
    }
};

var STORAGE = new LocalStorage(),
    get_tmp = STORAGE.get('LOCAL');

if( get_tmp != null )
    LOCAL = get_tmp;

var storage_card_add = function(card_obj) {

    LOCAL.cards.push(card_obj);

    try {
        STORAGE.save('LOCAL', LOCAL);
    }
    catch(e) {
        console.log(e);
    }
};
