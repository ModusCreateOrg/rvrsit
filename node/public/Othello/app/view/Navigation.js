Ext.define('Othello.view.Navigation', {
    extend  : 'Ext.navigation.View',
    xtype   : 'othelloNavigation',

    requires: [
        'Ext.ActionSheet',
        'Ext.Button',
        'Ext.Toolbar'
    ],

    config: {
        fullscreen: true,
        bottomToolbar: true
    },

    initialize: function() {
        var me = this;

        me.setItems([
            me.getBottomToolbar()
        ]);

        me.callParent();

        me.getNavigationBar().add(
            [
                {
                    //iconCls  : 'compose',
                    text       : 'Msg',
                    align      : 'right',
                    action     : 'messaging',
                    badgeText  : '2'
                },
                {
                    text    : 'Stats',
                    action  : 'stats',
                    ui      : 'normal',
                    align   : 'right'
                },
                {
                    text    : 'Play',
                    action  : 'play',
                    ui      : 'action',
                    align   : 'right'
                }
            ]
        );
    },

    applyBottomToolbar: function(config) {
        if (config === true) {
            config = {
                docked : 'bottom',
                ui     : 'light',
                items  : [
                    {
                        xtype    : 'button',
                        iconMask : true,
                        iconCls  : 'settings',
                        action   : 'socketDebug'
                    },
                    {
                        xtype : 'spacer'
                    },
                    {
                        xtype    : 'button',
                        iconMask : true,
                        text     : 'New Game',
                        action   : 'newGame'
                    },
                    {
                        xtype    : 'button',
                        iconMask : true,
                        text     : 'Settings',
//                        iconCls  : 'settings',
                        action   : 'gameSettings'
                    }
                ]
            }
        }
        return Ext.factory(config, Ext.Toolbar, this.getBottomToolbar());
    }

});