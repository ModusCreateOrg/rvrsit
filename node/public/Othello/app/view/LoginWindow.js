Ext.define('Othello.view.LoginWindow', {
    extend : 'Ext.form.Panel',

    xtype : 'loginWindow',

    config : {
        title   : 'Login',
        floating: true,
        modal: true,
        width   : 360,
        height  : 240,
        centered: true,
        scrollable: true
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
                    text    : 'Play skirmish',
                    action  : 'skirmish'
                },
                { xtype: 'spacer' },
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
            title   : title
        };

        return new Ext.factory(config, Ext.Toolbar, this.getTitle());
    }

});