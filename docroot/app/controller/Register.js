Ext.define('Rvrsit.controller.Register', {
    extend : 'Ext.app.Controller',

    config : {
        loggedIn : false,
        views    : [
            'Register'
        ]
    },

    init : function() {
        var me = this;

        me.control({
            'button[action=play]'         : {
                tap   : me.showLoginWindow,
                scope : me
            },
            'button[action=singlePlayer]' : {
                tap   : me.onSinglePlayer,
                scope : me
            },
            'button[action=register]'     : {
                tap   : me.onRegister,
                scope : me
            }
        });

        //socket.on('auth', Ext.bind(me.onUserAuthenticated, me));
        //socket.on('registerUser', Ext.bind(me.onUserRegistered, me));

        me.callParent();
    },

    showView : function() {
        Ext.Viewport.add({
            xclass : 'Rvrsit.view.Register'
        }).show();
    },

    onSinglePlayer : function(btn) {
        var registerWindow = Ext.ComponentQuery.query('register')[0];

        if (registerWindow) {
            registerWindow.hide();
            registerWindow.destroy();
        }
        this.getApplication().fireEvent('singleplayer');
    },

    /**
     * Submit person's registration data
     * @param btn
     */
    onRegister : function(btn) {
        var me = this,
            form = btn.up('formpanel'),
            values = form.getValues();

        if (!values.name.length || !values.email.length) {
            Ext.Msg.alert('Error!', 'You must enter a name and valid email address!');
            return;
        }

        this.getApplication().rpc('register', {
            params  : values,
            scope   : me,
            handler : me.onUserRegistered
        });
    },

    authFailed : function(data) {
        console.log('auth failed');
    },

    /**
     * Callback called on registration data received from server
     * Can be successful or failed
     * @param data
     */
    onUserRegistered : function(data) {

        var registerWindow = Ext.ComponentQuery.query('register')[0];

        if (registerWindow) {
            registerWindow.hide();
            registerWindow.destroy();
        }
        this.getApplication().fireEvent('userUpdate', data.user);
        this.getApplication().getController('Waiting').showView();
    }

});