Ext.define('Othello.view.LoginWindow', {
    extend : 'Ext.form.Panel',

    xtype : 'loginWindow',

    config : {
        title   : 'Login',
        floating: true,
        modal: true,
        width   : 360,
        height  : 240,
        centered: true
    },

    initialize : function() {
        var me = this;
        me.setItems([
            me.getTitle(),
            me.createBottomTbar()
        ]);
        
        me.add(me.createFields());
        me.callParent();
    },

    createFields: function() {
        return [
            {
                xtype   : 'textfield',
                name    : 'email',
                label   : 'E-mail'
            },
            {
                xtype   : 'passwordfield',
                name    : 'password',
                label   : 'Password'
            }
        ]
    },

    createBottomTbar: function() {
        return{
            docked  : 'bottom',
            xtype   : 'toolbar',
            items   : [
                {
                    text    : 'Register',
                    action  : 'showRegWin'
                },
                {
                    text    : 'Forgot password',
                    action  : 'forgotpassword'
                },
                {
                    xtype   : 'spacer'
                },
                {
                    text    : 'Login',
                    action  : 'login',
                    ui      : 'confirm'
                }
            ]
        };
    },

    applyTitle: function(title) {
        var config = {
            docked  : 'top',
            title   : title,
            items   : [
                {
                    text    : 'Skirmish',
                    action  : 'skirmish',
                    ui      : 'decline'
                }
            ]
        };

        return new Ext.factory(config, Ext.Toolbar, this.getTitle());
    }

});