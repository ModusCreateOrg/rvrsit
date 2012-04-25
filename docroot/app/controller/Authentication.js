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

        me.getApplication().rpc({
            method   : 'auth',
            params   : userCreds,
            scope    : me,
            callback : me.onAfterSubmit
        });
    },

    onAfterSubmit : function(data) {
        var me = this;

        me.getApplication().setUser(data.user);
        me.onRefreshList();
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
        var app = this.getApplication();
        if (! data.success) {
            app.setUser(null);
        }
        var view = this.view;

        if (view) {
            this.onRefreshList();
        }
        else {
            view = this.view = Ext.Viewport.add({
                xclass : 'Rvrsit.view.Authentication',
                user   : app.getUser(),
                store  : Ext.create('Rvrsit.store.Authentication', {
                    data : data
                })
            });
        }

        view.show();
    },

    onRefreshList : function() {
        var me = this;

        me.getApplication().rpc({
            method   : 'listAvailablePlayers',
            scope    : me,
            callback : me.onAfterRefreshList
        });
    },

    onAfterRefreshList : function(data) {
        var authWindow = this.view;

        authWindow.getStore().setData(data);
        authWindow.setState('list');
    },
    onCancel : function() {
        var view = this.view;
        view.hide();

        // TODO : purge any existing challenges
    },
    onChallengePlayer : function() {

    }
});