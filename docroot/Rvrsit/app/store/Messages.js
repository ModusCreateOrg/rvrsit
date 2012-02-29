Ext.define('Rvrsit.store.Messages', {
	extend   : 'Ext.data.Store',

    model    : 'Rvrsit.model.Message',
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