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
    },

    applyBottomToolbar: function(config) {
        if (config===true) {
            config = {
                docked  : 'bottom',
                ui      : 'light',
                items   : {
                    xtype: 'button',
                    iconMask: true,
                    iconCls: 'settings',
                    action: 'socketDebug'
                }
            }
        }
        return Ext.factory(config, Ext.Toolbar, this.getBottomToolbar());
    }

});