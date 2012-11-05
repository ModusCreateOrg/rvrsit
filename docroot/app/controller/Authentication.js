Ext.define('Rvrsit.controller.Authentication', {
    extend   : 'Ext.app.Controller',
    requires : [
        'Ext.Toolbar',
        'Ext.form.FieldSet',
        'Ext.form.Panel',
        'Ext.field.Text'
    ],
    config   : {
        views   : [ 'Authentication' ],
        control : {
            '[action="cancel"]' : {
                tap : 'onCancel'
            },

            '[action="submit"]' : {
                tap : 'onSubmit'
            },

            '[action="refreshList"]' : {
                tap : 'onRefreshList'
            },

            '[action="challengePlayer"]' : {
                tap : 'onChallengePlayer'
            }
        }
    },

    onSinglePlayer : function(btn) {
        var me = this,
            list = btn.up('authentication');

        if (list) {
            list.hide();
            list.destroy();
        }

        me.getApplication().fireEvent('singleplayer');
    },

    onSubmit : function(btn) {
        var me = this,
            authWindow = btn.up('authentication'),
            userCreds = authWindow.down('formpanel').getValues();

        me.doAuthentication(userCreds);
    },

    doAuthentication : function(creds) {
        var me = this;
        me.getApplication().rpc({
            method   : 'auth',
            params   : creds,
            scope    : me,
            callback : me.onAfterDoAuthentication
        });
    },

    onAfterDoAuthentication : function(data) {
        var me = this;

        me.getApplication().fireEvent('userupdate', data.user);
        if (me.view) {
            me.onRefreshList();
        }

    },

    onPlayUser : function(btn) {
        var me = this,
            authWindow = btn.up('authentication'),
            selected = authWindow.getSelected();

        if (selected) {
            me.getApplication().fireEvent('playUser', selected.data);
        }
        else {
            Ext.Msg.alert('Error', 'You must select a player to enage!');
        }
    },

    showView : function(data) {
        var me = this,
            app = this.getApplication(),
            view = me.view;

//        if (!data.success) {
//            app.fireEvent('userupdate', null);
//        }

        if (app.user) {
            me.onRefreshList();
        }
        else {
            view = me.view = Ext.Viewport.add({
                xtype : 'authentication',
                user  : app.getUser(),
                store : Ext.create('Rvrsit.store.Authentication', {
                    data : data
                })
            });
        }

        view.show();
    },
    hideView: function() {
        this.view && this.view.hide();
    },
    onRefreshList : function() {
        var me = this;

        me.getApplication().rpc({
            method   : 'listAvailablePlayers',
            scope    : me,
            callback : me.onAfterRefreshList
        });
    },

    onAfterRefreshList     : function(data) {
        var authWindow = this.view;

        if (authWindow) {
            authWindow.getStore().setData(data);
            authWindow.setState('list');
        }
    },
    onCancel               : function() {
        this.hideView();

        // TODO : purge any existing challenges
    },
    onChallengePlayer      : function() {
        var me = this,
            list = me.view.down('list'),
            opponent = list.getSelection()[0];

        if (!opponent || list.getStore().getCount() < 1) {
//            console.info('no opponent!');
            return;
        }

        me.getApplication().rpc({
            method  : 'challengePlayer',
            scope   : me,
            params  : opponent.getData(),
            success : me.onAfterChallengePlayer
        });

        me.view.setState('awaitingChallengeResponse');

    },
    onAfterChallengePlayer : function(data) {
        if (! data.success) {
            Ext.Msg.alert('Error', data.message);
            this.view.setState('list');
        }
//        debugger;
    }
});