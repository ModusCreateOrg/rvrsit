Ext.define('Rvrsit.store.Waiting', {
    extend : 'Ext.data.Store',

    config : {
        model  : 'Rvrsit.model.Waiting',
        sorters : [
            {
                property  : 'timestamp',
                direction : 'ASC'
            }
        ],

        proxy : {
            type : 'memory'
        }
    }
});