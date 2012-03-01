Ext.define('Rvrsit.view.Waiting', {
    extend   : 'Ext.dataview.List',
    xtype    : 'waiting',
    requires : [ 'Rvrsit.store.Waiting' ],

    config : {
        title         : 'Choose a player!',
        floating      : true,
        modal         : true,
        centered      : true,
        scrollable    : false,
        hideOnMaskTap : false,
        height        : 500,
        width         : 400,

        itemTpl : '{name}'
    },

    initialize : function() {
        var me = this;

        me.setItems([
            me.getTitle(),
            me.createBottomTbar()
        ]);

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
                    action : 'listSinglePlayer',
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

    applyTitle : function(title) {
        var config = {
            docked : 'top',
            title  : title
        };

        return Ext.factory(config, Ext.Toolbar, this.getTitle());
    }
});