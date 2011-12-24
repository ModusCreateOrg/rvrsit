Ext.define('Othello.view.Messaging', {
    extend : 'Ext.Panel',

    xtype : 'messaging',

    config : {
        title   : 'Messaging',
        floating: true,
        //modal: true,
        width   : 360,
        height  : 300,
        centered: true,
        scrollable: true,

        sendMsgBar: true,
        store: false
    },

    initialize : function() {
        var me = this;
        //console.log('store',me.getStore());
        me.callParent();
        me.setItems([
            me.getTitle(),
            me.createList(),
            me.getSendMsgBar()
        ]);


    },

    applyTitle: function(title) {
        var config = {
            docked  : 'top',
            title   : title,
            items   : [
                {
                    text    : 'X',
                    //iconCls: 'delete',
                    action  : 'closeMsgPanel'
                }
            ]
        };

        return new Ext.factory(config, Ext.Toolbar, this.getTitle());
    },

    applySendMsgBar: function(config) {
        if (config===true) {
            config = {
                docked  : 'bottom',
                items   : [
                    {
                        xtype   : 'textfield',
                        name    : 'sendMsgBar',
                        flex    : 1
                    }
                ]
            }
        }

        return new Ext.factory(config, Ext.Toolbar, this.getSendMsgBar());
    },

    createList: function() {
        var config = {
            itemTpl: '<div class="msgText">{text}</div><div class="msgFrom">{sent} ({timestamp})</div>',
            store: this.getStore()
        };

        return Ext.create('Ext.List', config);
    }

    
});