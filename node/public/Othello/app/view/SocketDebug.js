Ext.define('Othello.view.SocketDebug', {
    extend : 'Ext.Panel',

    xtype : 'socketDebug',

    config : {
        title   : 'Socket Debug',
        padding : 10,
        layout  : 'vbox'
    },

    initialize : function() {
        this.setItems([
            {
                xtype: 'button',
                text: 'Some socket.io action',
                handler: function() {
                    console.log('Pushed');
                }
            }
        ]);

        this.callParent();
    }
});