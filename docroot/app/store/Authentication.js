Ext.define('Rvrsit.store.Authentication', {
    extend   : 'Ext.data.Store',
    requires : [ 'Rvrsit.model.Authentication' ],
    config   : {
        model   : 'Rvrsit.model.Authentication',
        sorters : [
            {
                property  : 'lastActivity',
                direction : 'ASC'
            }
        ],
        proxy   : {
            type   : 'memory',
            reader : {
                type         : 'json',
                rootProperty : 'availablePlayers'
            }
        }
    }
});