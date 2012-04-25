Ext.define('Rvrsit.view.Waiting', {
    extend   : 'Ext.dataview.List',
    xtype    : 'waiting',
    requires : [ 'Rvrsit.store.Waiting' ],

    config : {
        ui                : 'dark',
        loginTitle        : 'Please login.',
        choosePlayerTitle : 'Choose a player!',
        showAnimation     : 'pop',
        hideAnimation     : 'slide',
        floating          : true,
        modal             : true,
        centered          : true,
        hideOnMaskTap     : false,
        height            : 200,
        width             : 400,
        layout            : 'card',
        itemTpl           : '{name}'
    },

    initialize : function() {
        var me = this;

        me.setItems([
            me.buildTopToolbar(),
            me.buildForm(),
            me.buildBottomTbar()
        ]);

        me.callParent();
    },

    buildForm : function() {
        return {
            xtype  : 'formpanel',
            layout : 'fit',
            items  : {
                xtype : 'fieldset',
                items : [
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
            }
        }
    },

    buildBottomTbar : function() {
        return{
            docked : 'bottom',
            xtype  : 'toolbar',
            items  : [
                {
                    text   : 'Cancel',
                    action : 'cancel',
                    ui     : 'decline'
                },
                {
                    xtype : 'spacer'
                },
                {
                    text   : 'Refresh List',
                    action : 'listRefreshList'
                },
                {
                    text   : 'Play',
                    action : 'listPlayUser',
                    ui     : 'confirm'
                }
            ]
        };
    },

    buildTopToolbar : function() {
        return {
            xtype  : 'toolbar',
            docked : 'top',
            title  : this.getLoginTitle()
        };

    }
});