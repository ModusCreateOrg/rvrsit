Ext.define('Rvrsit.view.Authentication', {
    extend   : 'Ext.dataview.List',
    xtype    : 'authentication',
    requires : [ 'Rvrsit.store.Authentication' ],

    config : {
        ui            : 'dark',
        floating      : true,
        modal         : true,
        centered      : true,
        hideOnMaskTap : false,
        user          : false,
        height        : 225, // 185,
        width         : 400,
        layout        : 'card',
        showAnimation : {
            type     : 'popIn',
            duration : 350,
            easing   : 'ease-in'
        },
        hideAnimation : {
            type     : 'popOut',
            duration : 350,
            easing   : 'ease-in'
        },

        states : {
            login : {
                activeItem      : 0,
                height          : 195,
                animType        : 'fade',
                submit          : 'show',
                refreshList     : 'hide',
                challengePlayer : 'hide',
                title           : 'Please login.'
            },

            list : {
                activeItem      : 1,
                height          : 300,
                animType        : 'fade',
                submit          : 'hide',
                refreshList     : 'show',
                challengePlayer : 'show',
                title           : 'Choose a player!'
            },

            awaitingChallengeResponse : {
                activeItem      : 2,
                height          : 300,
                animType        : 'fade',
                submit          : 'hide',
                refreshList     : 'hide',
                challengePlayer : 'hide',
                title           : ' '
            }
        }
    },

    initialize : function() {
        var me = this;

        me.setItems([
            me.buildTopToolbar(),
            me.buildForm(),
            me.buildList(),
            me.buildAwaitingChallengeCard(),
            me.buildBottomTbar()
        ]);

        if (me.getUser()) {
            me.setState('list');
        }

        me.callParent();
    },

    buildForm : function() {
        return {
            xtype  : 'formpanel',
//            layout : 'fit',
//            height: 185,
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

    buildAwaitingChallengeCard : function() {
        return {
            xtype  : 'container',
            layout : 'fit',
            items  : {
                xtype   : 'loadmask',
                message : 'Awaiting challenge response...'
            }
        };
    },

    buildList : function() {
        return {
            xtype     : 'list',
            emptyText : '<div style="padding: 20px;">No players to challenge online. Perhaps try single player mode? <br/><br /> Press the refresh button above to check again!</div>',
            itemTpl   : '{name}',
            store     : this.getStore()
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
                    text   : 'Submit',
                    action : 'submit',
                    ui     : 'confirm'
                },
                {
                    text   : 'Challenge Player!',
                    action : 'challengePlayer',
                    ui     : 'confirm',
                    hidden : true
                }
            ]
        };
    },

    buildTopToolbar : function() {
        return {
            xtype  : 'toolbar',
            docked : 'top',
            title  : this.getStates().login.title,
            items  : [
                {
                    xtype : 'spacer'
                },
                {
                    action   : 'refreshList',
                    hidden   : true,
                    iconMask : true,
                    iconCls  : 'refresh'
                }
            ]
        };
    },

    setState : function(stateType) {
        var me = this,
            states = me.getStates()[stateType];
        if (!states) {
            throw stateType + ' is an invalid state type!';
        }

        me.setHeight(states.height);
        me.animateActiveItem(states.activeItem, states.animType);
        me.down('button[action=challengePlayer]')[states.challengePlayer]();
        me.down('button[action=refreshList]')[states.refreshList]();
        me.down('button[action=submit]')[states.submit]();
        me.down('toolbar[docked=top]').setTitle(states.title);
    }
});