Ext.define('Rvrsit.controller.Waiting', {
    extend : 'Ext.app.Controller',

    config : {
        views   : [ 'Waiting' ],
        control : {
            '[action="listSinglePlayer"]' : {
                tap : 'onSinglePlayer'
            },
            '[action="listPlayUser"]'     : {
                tap : 'onPlayUser'
            },
            '[action="listRefreshList"]'  : {
                tap : 'onRefreshList'
            }
        }
    },

    onSinglePlayer     : function(btn) {
        var me = this,
            list = btn.up('waiting');

        if (list) {
            list.hide();
            list.destroy();
        }

        me.getApplication().fireEvent('singleplayer');
    },
    onPlayUser         : function(btn) {
        var me = this,
            list = btn.up('waiting'),
            selected = list.getSelected();

        if (selected) {
            me.getApplication().fireEvent('playUser', selected.data);
        }
        else {
            Ext.Msg.alert('Error', 'You must select a player to enage!');
        }
    },
    showView           : function(data) {
        Ext.Viewport.add({
            xclass : 'Rvrsit.view.Waiting',
            store  : Ext.create('Rvrsit.store.Waiting')
        });

        this.onRefreshList();
    },
    onRefreshList      : function() {
        var me = this;

        me.getApplication().rpc('getWaitingList', {
            scope   : me,
            handler : me.onAfterRefreshList,
            params  : me.getApplication().getUser()
        });
    },
    onAfterRefreshList : function(data) {
        var list = Ext.Viewport.down('waiting');

        list.getStore().loadData(data);
    }
});