Ext.define('Rvrsit.controller.Waiting', {
    extend : 'Ext.app.Controller',

    views : [ 'Waiting' ],

    init           : function() {
        this.control({
            'waiting > [action="singlePlayer"]' : {
                tap : this.onSinglePlayer
            },
            'waiting > [action="playUser"]'     : {
                tap : this.onPlayUser
            },
            'waiting > [action="refreshList"]'  : {
                tap : this.onRefreshList
            }
        });

        this.callParent();
    },
    onSinglePlayer : function(btn) {
        var me = this,
            list = btn.up('waiting');

        if (list) {
            list.hide();
            list.destroy();
        }

        me.application.fireEvent('singleplayer');
    },
    onPlayUser     : function(btn) {
        var me = this,
            list = btn.up('waiting'),
            selected = list.getSelectedRecords()[0];

        if (selected) {
            me.application.fireEvent('playUser', selected.data);
        }

    },
    showView       : function(data) {
        var me = this,
            view = me.getView('Waiting').create();

        Ext.Viewport.add(view);
        view.show();
        this.onRefreshList();
    },
    onRefreshList  : function() {
        var me = this;

        me.application.rpc('getWaitingList', {
            scope   : me,
            handler : me.onAfterRefreshList
        });
    },
    onAfterRefreshList : function(data) {
        var list = Ext.Viewport.down('waiting');

        debugger;
        list.store.applyData(data);

    }
});