Ext.define('Othello.store.Messages', {
	extend   : 'Ext.data.Store',

    model    : 'Othello.model.Message',
    sorters  : [
        {
            property: 'timestamp',
            direction: 'ASC'
        }
    ],
    proxy: {
        type : 'memory'
    }
});