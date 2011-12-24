Ext.define('Othello.controller.Login', {
    extend : 'Ext.app.Controller',

    views : [
        'LoginWindow'
    ],

    refs : [
        {
            ref      : 'loginWindow',
            selector : 'loginWindow'
        }
    ],

    config: {
        loggedIn: false
    },

    init : function() {
        var me = this;
        
        me.control({
            'button[action=play]': {
                tap: me.showLoginWindow,
                scope: me
            },
            'button[action=login]': {
                tap: me.logIn,
                scope: me
            }
        });

        socket.on('auth', Ext.bind(me.validateAuth, me));

        me.callParent();
    },

    showLoginWindow: function() {
        var me = this,
            loginWin = me.getLoginWindow();

        // if already logged, show different window
        if (me.getLoggedIn()) return;

        //if login window already created, show it
        if (!loginWin) {
            loginWin = me.getView('LoginWindow').create();
            Ext.Viewport.add(loginWin);
        } else {
            loginWin.show();
        }

    },

    logIn: function(btn) {
        var form    = btn.up('formpanel'),
            values  = form.getValues();

        socket.emit('auth', values)
    },

    validateAuth: function(data) {
        var me = this;
        if (!data || data.success !== true) return me.authFailed();

        console.log('login successful');

        me.getLoginWindow().hide();

        //TODO: open playWindow
    },

    authFailed: function() {
        console.log('auth failed');
    }

});