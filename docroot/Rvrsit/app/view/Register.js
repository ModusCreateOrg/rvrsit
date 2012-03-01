Ext.define('Rvrsit.view.Register', {
    extend : 'Ext.form.Panel',

    xtype : 'register',

    config : {
        title         : 'Login',
        floating      : true,
        modal         : true,
        centered      : true,
        scrollable    : false,
        hideOnMaskTap : false,
        width: 400,
        defaults : {
            labelWidth : '30%'
        }
    },

    initialize : function() {
        var me = this;

        me.setItems([
            me.getTitle(),
            me.createBottomTbar()
        ]);

        me.add(me.buildFields());
        me.callParent();
    },

    buildFields : function() {
        return [
            {
                xtype : 'textfield',
                name  : 'name',
                label : 'Name'
            },
            {
                xtype : 'textfield',
                name  : 'email',
                label : 'Email'
            }
        ]
    },

    createBottomTbar : function() {
        return{
            docked : 'bottom',
            xtype  : 'toolbar',
            items  : [
                {
                    text   : 'Single Player',
                    action : 'singlePlayer',
                    ui     : 'decline'
                },
                {
                    xtype : 'spacer'
                },
                {
                    text   : 'Login',
                    action : 'register',
                    ui     : 'confirm'
                }
            ]
        };
    },

    applyTitle : function(title) {
        var config = {
            docked : 'top',
            title  : title
        };

        return Ext.factory(config, Ext.Toolbar, this.getTitle());
    }

});