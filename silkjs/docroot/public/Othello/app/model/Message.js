Ext.define('Othello.model.Message', {
    extend: 'Ext.data.Model',

    fields : [
        'id',
        'timestamp',
        'sent',
        'text'
    ]
});