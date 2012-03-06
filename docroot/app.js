
//<debug>
Ext.Loader.setPath({
    'Ext': 'sdk/src'
});
//</debug>

Ext.application({
    name        : 'Rvrsit',
    appFolder   : 'app',
    controllers : [
        'Settings',
        'ScoreCard',
        'Waiting',
        'Viewport',
        'Register'
    ],
    launch        : function() {
        Rvrsit.app = this;
//            Rvrsit.heartbeat = new silk.Heartbeat();

        this.on({
            gameInitialized : this.onGameInitialized,
            scope : this
        });

    },

    onGameInitialized : function(game) {
        Rvrsit.game = this.game = game;
        this.initHeartBeats();

    },
    initHeartBeats : function() {
        return;
        silk.heartbeat_enabled = true;
        var me = this,
            game = Rvrsit.game;

        me.user = me.getUser();
        if (me.user.name == 'Slave') {
            game.newGame();
        }
        if (me.user && ! me.hearbeatInitialized) {
            console.log('initializing heartbeat for ' + me.user.name)
            //            var n = 0;
            Rvrsit.heartbeat.addMethod('gameStatus', {
                scope    : this,
                method   : 'gameStatus',
                params   : function() {
                    var data = Ext.apply({}, me.user);
                    data.status = game && game.halt ? 'halt' : 'playing';
//                        console.log('params', data);
                    return data;
                },
                callback : function(turns) {
                    if (me.user.name == 'Slave') {
                        console.log('>> gameStatus', turns);
                        var game = Rvrsit.game;
                        if (! game) {
                            return;
                        }
                        Ext.each(turns, function(turn) {
                            console.log(turn.turnColor, turn.chipItemIds);
                            game.forceFlipChips(turn);
                        });
                    }
                }
            });

            me.hearbeatInitialized = false;
        }
    },

    rpc : function(method, config) {
        config = config || {};
        Ext.Ajax.request({
            method  : 'POST',
            url     : '/rpc',
            params  : Ext.apply(config.params || {}, { method : method }),
            success : function(response) {
                console.log('RPC RESPONSE:', response.responseText);
                var data = Ext.decode(response.responseText);
                config.handler && config.handler.call(config.scope || window, data);
            }
        });
    },

    setUser      : function(user) {
        localStorage.setItem('user', Ext.encode(user));
        this.user = user;
    },

    getUser      : function() {
        var thisUser = this.user;
        return thisUser ? thisUser : this.user = Ext.decode(localStorage.getItem('user'));
    }
});