Ext.define('Othello.controller.Login', {
    extend : 'Ext.app.Controller',

    views : [
        'LoginWindow',
        'RegisterWindow'
    ],

    refs : [
        {
            ref      : 'loginWindow',
            selector : 'loginWindow'
        },
        {
            ref      : 'regWindow',
            selector : 'registerWindow'
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
                tap: me.doLogIn,
                scope: me
            },
            'button[action=showRegWin]': {
                tap: me.showRegWindow,
                scope: me
            },
            'button[action=register]': {
                tap: me.doRegister,
                scope: me
            }
        });

        //socket.on('auth', Ext.bind(me.onUserAuthenticated, me));
        //socket.on('registerUser', Ext.bind(me.onUserRegistered, me));

        me.callParent();
    },

    /**
     * Show login window
     * TODO: window on tablets, navigation card on phones
     */
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

    /**
     * Show new user registration window
     * TODO: window on tablets, navigation card on phones
     */
    showRegWindow: function() {
        var me          = this,
            loginWindow = me.getLoginWindow(),
            regWindow   = me.getRegWindow();

        // close the log in window, if open
        if (loginWindow) loginWindow.hide();

        // no need to register if already logged in (hack?)
        if (me.getLoggedIn()) return;

        if (!regWindow) {
            regWindow = me.getView('RegisterWindow').create();
            Ext.Viewport.add(regWindow);
        } else {
            regWindow.show();
        }
    },

    /**
     * Submit login credentials to server
     * @param btn
     */
    doLogIn: function(btn) {
        var me      = this,
			form    = btn.up('formpanel'),
            values  = form.getValues();

		rpc('auth', {
			params: values,
			handler: function(o) {
				me.onUserAuthenticated(o);
			}

		});
//        Othello.socket.emit('auth', values, this.onUserAuthenticated, this);
    },

    /**
     * Submit person's registration data
     * @param btn
     */
    doRegister: function(btn) {
        var me      = this,
			form    = btn.up('formpanel'),
            values  = form.getValues();

		rpc('registerUser', {
			params: values,
			handler: function(o) {
				me.onUserRegistered(o);
			}
		});
//        Othello.socket.emit('registerUser', values, this.onUserRegistered, this);
    },

    /**
     * Callback called on auth data received from server
     * Can be successful or failed
     * @param data
     */
    onUserAuthenticated: function(data) {
        var me = this;

        console.log(data);
        if (!data || data.success !== true) return me.authFailed(data);

        me.getLoginWindow().hide();

        //TODO: open playWindow
    },

    /**
     * Executed if authentication fails
     */
    authFailed: function(data) {
        console.log('auth failed');
    },

    /**
     * Callback called on registration data received from server
     * Can be successful or failed
     * @param data
     */
    onUserRegistered: function(data) {
        console.log('registered', data);
    }

});