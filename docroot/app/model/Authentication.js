Ext.define('Rvrsit.model.Authentication', {
    extend: 'Ext.data.Model',

    config: {
         fields : [
            'name',
            'playerId',
            {
                name : 'lastActivity',
                type : 'int'
            }
        ]
    }
});