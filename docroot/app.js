//<debug>
Ext.Loader.setPath({
    'Ext' : 'sdk/src'
});
//</debug>

Ext.application({
    name : 'Rvrsit',

    controllers : [
        'Settings',
        'ScoreCard',
        'Authentication',
        'Viewport'
    ],

    icon : {
        57  : 'resources/icons/icon.png',
        72  : 'resources/icons/icon.png',
        114 : 'resources/icons/Icon@2x.png',
        144 : 'resources/icons/Icon~ipad@2x.png'
    },

    tabletStartupScreen : 'resources/loading/Homescreen~ipad.jpg',

    launch : function() {
        // Destroy the #appLoadingIndicator element
        var me = this,
            loader = Ext.get('appLoadingIndicator');
        loader && loader.destroy();
        Rvrsit.app = this;
        //            Rvrsit.heartbeat = new silk.Heartbeat();

        me.on({
            gameinitialized : me.onGameInitialized,
            userupdate      : me.getMessages,
            scope           : me
        });
    },

    onGameInitialized : function(game) {
        Rvrsit.game = this.game = game;
        this.getMessages();
    },
    startHeartbeat : function() {
        var me = this;
        if (me.heartbeatStarted) {
            return;
        }
        silk.Heartbeat.enable();
        silk.Heartbeat.stop();
        silk.Heartbeat.start(1);
        me.heartbeatStarted = true;
    },

    getMessages    : function() {
        var me = this,
            game = Rvrsit.game;

        me.user = me.getUser();
        if (me.user && ! game.halted) {

            if (! me.heartbeatStarted) {
                me.startHeartbeat();
            }

            silk.Heartbeat.enable();

            silk.Heartbeat.addMethod('getMessages', {
                scope    : this,
                method   : 'getMessages',
                params   : function() {
//                    var data = Ext.clone(me.user);
//                    data.status = game && game.halt ? 'halt' : 'playing';
                    //                        console.log('params', data);
                    return Ext.clone(me.user);
                },
                success : function(data) {
//                    if (me.user.name == 'Slave') {
//                        console.log('>> getMessages', turns);
//
//                        var game = Rvrsit.game;
//                        if (!game) {
//                            return;
//                        }
//                        Ext.each(turns, function(turn) {
//                            console.log(turn.turnColor, turn.chipItemIds);
//                            game.forceFlipChips(turn);
//                        });
//                    }
                    me.processMessages(data);
                    me.getMessages();

                },
                failure : function(data) {
//                    debugger;
                    if (data.errcode == 1)    {
                        silk.Heartbeat.disable();
                        me.getController('Authentication').doAuthentication(me.user);
                    }
                }
            });

        }
    },

    processMessages : function(envelope) {
        var me = this,
            messages = envelope.messages,
            messageIds = [];

        if (messages.length < 1) {
            return;
        }

        Ext.each(messages, function(msg, i) {
            messageIds[i] = msg.messageId
        });

        me.rpc({
            method  : 'ackMessages',
            params  : {
                messages : Ext.encode(messageIds)
            },
            success : function() {
                console.log(messageIds.join(), 'acknowledge');
            }
        });

        me.fireEvent('messagesreceived', messages);
    },


    rpc : function(config) {
        console.log('>>> RPC ' + config.method);

        config = config || {};
        Ext.Ajax.request({
            method  : 'POST',
            url     : '/rpc',
            params  : Ext.apply(config.params || {}, { method : config.method }),
            success : function(response) {
                var data = Ext.decode(response.responseText);
                console.log('RPC RESPONSE:', response.responseText);

                if (data.success) {
                    config.success && config.success.call(config.scope || window, data);
                }
                else {
                    config.failure && config.failure.call(config.scope || window, data);
                }

                config.callback && config.callback.call(config.scope || window, data);
            }
        });
    },

    setUser : function(user) {
        localStorage.setItem('user', Ext.encode(user));
        this.user = user;
    },

    getUser : function() {
        var thisUser = this.user;
        return thisUser ? thisUser : this.user = Ext.decode(localStorage.getItem('user'));
    },

    onUpdated : function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function() {
                window.location.reload();
            }
        );
    },
    isMyTurn : function() {
        var me = this;
        return me.getController('Viewport').isMyTurn(me.getUser());
    },
    simulateEndOfGame : function() {
        var move = {"turnColor":"black", "playerId": this.user.playerId,"turnNumber":1, chipItemIds : ["0-0", "1-0", "2-0", "3-0", "4-0", "5-0", "6-0", "7-0", "8-0", "9-0", "0-1", "1-1", "2-1", "3-1", "4-1", "5-1", "6-1", "7-1", "8-1", "9-1", "0-2", "1-2", "2-2", "3-2", "4-2", "5-2", "6-2", "7-2", "8-2", "9-2", "0-3", "1-3", "2-3", "3-3", "4-3", "5-3", "6-3", "7-3", "8-3", "9-3", "0-4", "1-4", "2-4", "3-4", "4-4", "5-4", "6-4", "7-4", "8-4", "9-4", "0-5", "1-5", "2-5", "3-5", "4-5", "5-5", "6-5", "7-5", "8-5", "9-5", "0-6", "1-6", "2-6", "3-6", "4-6", "5-6", "6-6", "7-6", "8-6", "9-6", "0-7", "1-7", "2-7", "3-7", "4-7", "5-7", "6-7", "7-7", "8-7", "9-7", "0-8", "1-8", "2-8", "3-8", "4-8", "5-8", "6-8", "7-8", "8-8", "9-8", "0-9", "1-9", "2-9", "3-9", "4-9", "5-9", "6-9", "7-9", "8-9", "9-9"]};

        console.log(move.turnColor, move.chipItemIds);
        Rvrsit.game.forceFlipChips(move);

        this.fireEvent('chipflips', move);
    }
});