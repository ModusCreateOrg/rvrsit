Ext.define('Othello.controller.Messaging', {
    extend : 'Ext.app.Controller',

    models: [
        'Message'
    ],

    stores: [
        'Messages'
    ],

    views : [
        'Messaging'
    ],

    refs : [
        {
            ref      : 'messaging',
            selector : 'messaging'
        }
    ],
    init : function() {
        var me = this;
        
        me.control({
            'button[action=messaging]': {
                tap: me.showMsgBox,
                scope: me
            },
            'button[action=closeMsgPanel]': {
                tap: me.closeMsgBox,
                scope: me
            }
        });

        socket.on('receiveMsg', Ext.callback(me.receiveMsg, me));

        me.callParent();
    },


    /**
     * create, show, hide as needed.
     * Maybe remove entirely instead of hide?
     */
    showMsgBox: function() {
        var msging = this.getMessaging();
        if (!msging) {
            msging = this.getView('Messaging').create({store: this.getMessagesStore()});
            Ext.Viewport.add([
                msging
            ]);
        } else {
            msging.show();
        }

    },

    sendMsg: function(msg) {
        socket.emit('sendMsg', {text: msg});
    },

    /**
     * Add msg to the store and display it in the list
     * @param msg {Object} msg object received from the server (model)
     */
    receiveMsg: function(msg) {
        var me      = this,
            store   = me.getMessagesStore(),
            model   = me.getMessageModel(),
            rec;

        rec = new model(msg);
        store.add(rec);
    },

    closeMsgBox: function() {
        this.getMessaging().hide();
    }
});