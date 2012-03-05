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

        me.application.fireEvent('singleplayer');
    },
    onPlayUser         : function(btn) {
        var me = this,
            list = btn.up('waiting'),
            selected = list.getSelected();

        if (selected) {
            me.application.fireEvent('playUser', selected.data);
        }
        else {
            Ext.Msg.alert('Error', 'You must select a player to enage!');
        }
    },
    showView           : function(data) {
        var me = this,
            view = me.getView('Waiting').create({
                store : Ext.create('Rvrsit.store.Waiting')
            });

        Ext.Viewport.add(view);
        view.show();
        this.onRefreshList();
    },
    onRefreshList      : function() {
        var me = this;

        me.application.rpc('getWaitingList', {
            scope   : me,
            handler : me.onAfterRefreshList,
            params  : me.application.getUser()
        });
    },
    onAfterRefreshList : function(data) {
        var list = Ext.Viewport.down('waiting');

        list.getStore().loadData(data);
    }
});