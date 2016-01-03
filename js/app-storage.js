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
        },
        {
            type: 'cash',
            name: 'Cash',
            cashback_per    : 0,
            foreign_fee_per : 0
        },
    ],
    currency: {
        visa: {
            EUR: {
                NTD: 36.0503
            },
            date: '1/1/2016'
        },
        mastercard: {
            EUR: {
                NTD: 35.7313
            },
            date: '12/31/2015'
        },
        cash: {
            EUR: {
                NTD: 34.86
            },
            date: null
        }
    }
};

var STORAGE = new LocalStorage();
