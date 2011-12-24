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

    config: {
        unreadMsgs: 0
    },
    
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

        socket.on('receiveMsg', Ext.bind(me.receiveMsg, me));

        me.callParent();
    },


    /**
     * create, show, hide as needed.
     * Maybe remove entirely instead of hide?
     */
    showMsgBox: function() {
        var msgBox = this.getMessaging();
        if (!msgBox) {
            msgBox = this.getView('Messaging').create({store: this.getMessagesStore()});
            Ext.Viewport.add([
                msgBox
            ]);
        } else {
            msgBox.show();
        }

        this.setUnreadMsgs(0);

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
            msgBox  = this.getMessaging(),
            msgBtn,
            rec;

        rec = new model(msg);
        store.add(rec);

        //add badge
        if (!msgBox || msgBox.isHidden()) {
            me.setUnreadMsgs(++me.unreadMsgs);
        }
    },

    closeMsgBox: function() {
        this.getMessaging().hide();
    },

    applyUnreadMsgs: function(number) {
        var msgBtns = Ext.ComponentQuery.query('button[action=messaging]');
        Ext.each(msgBtns, function(btn) {
            btn.setBadge(number);
        });
        return number;
    }
});