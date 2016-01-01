var trans = [
    '國際組織匯率',
    '跨國手續',
    '本次交易金額',
    '現金回饋',
    '淨回饋收入',
    '實際支付金額'
];

var generator = (function(){

    var listview_li = function(obj) {

        var html = '<li class="ul-detail">' + obj.title +
                   '<span class="detail-note">' + obj.note +
                   '</span><span class="ui-li-count">' + obj.currency +
                   '</span></li>';

        return html;
    };

    var collapsibleset = function(obj, index) {

        var html = '<div data-role="collapsible" id="collapsible-' + index + '">' +
                   '<h2>' + obj.name +
                   '<span class="ui-li-count">' + obj.actual +
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

                for( var detail_index in card_array[index].arr ) {

                    $('#collapsible-' + index + ' .listview-ul').append(
                        listview_li(card_array[index].arr[detail_index])
                    );

                }

                // Apply List View style
                //$('#collapsible-' + index + ' .listview-ul').trigger('create');
                $('#collapsible-' + index + ' .listview-ul').listview().listview('refresh');
            }
        }
    }
})();

$(function(){

    generator.cards([
        {
            name: 'VISA Signature',
            actual: '200.0',
            arr: [
                {
                    title: '實際支付金額',
                    note: '(USD)',
                    currency: 200
                },
                {
                    title: '實際支付金額',
                    note: '(USD)',
                    currency: 200
                },
                {
                    title: '實際支付金額',
                    note: '(USD)',
                    currency: 200
                },
                {
                    title: '實際支付金額',
                    note: '(USD)',
                    currency: 200
                },{
                    title: '實際支付金額',
                    note: '(USD)',
                    currency: 200
                },
                {
                    title: '實際支付金額',
                    note: '(USD)',
                    currency: 200
                }
            ]
        },
        {
            name: 'MASTER Platium',
            actual: '200.0',
            arr: [
                {
                    title: '實際支付金額',
                    note: '(USD)',
                    currency: 200
                },
                {
                    title: '實際支付金額',
                    note: '(USD)',
                    currency: 200
                },
                {
                    title: '實際支付金額',
                    note: '(USD)',
                    currency: 200
                },
                {
                    title: '實際支付金額',
                    note: '(USD)',
                    currency: 200
                },{
                    title: '實際支付金額',
                    note: '(USD)',
                    currency: 200
                },
                {
                    title: '實際支付金額',
                    note: '(USD)',
                    currency: 200
                }
            ]
        }
    ], 'result');

});
