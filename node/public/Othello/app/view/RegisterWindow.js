Ext.define('Othello.view.RegisterWindow', {
    extend : 'Ext.form.Panel',

    xtype : 'registerWindow',

    config : {
        title       : 'Register',
        floating    : true,
        modal       : true,
        width       : 380,
        height      : 335,
        centered    : true,
        scrollable  : false,

        defaults    : {
            labelWidth: "40%"
        }
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
                name    : 'name',
                label   : 'Name'
            },
            {
                xtype   : 'emailfield',
                name    : 'email',
                label   : 'E-mail'
            },
            {
                xtype   : 'textfield',
                name    : 'gameName',
                label   : 'Game name'
            },
            {
                xtype   : 'passwordfield',
                name    : 'password',
                label   : 'Password'
            },
            {
                xtype   : 'passwordfield',
                name    : 'password2',
                label   : 'Repeat pwd'
            }
        ]
    },

    createBottomTbar: function() {
        return{
            docked  : 'bottom',
            xtype   : 'toolbar',
            items   : [
                {
                    text    : 'Skirmish',
                    action  : 'skirmish',
                    ui      : 'decline'
                },
                {
                    xtype   : 'spacer'
                },
                {
                    text    : 'Register',
                    action  : 'register',
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