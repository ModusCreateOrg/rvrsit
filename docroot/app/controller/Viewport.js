Ext.define('Rvrsit.controller.Viewport', {
    extend : 'Ext.app.Controller',

    requires : [
        'Ext.MessageBox'
    ],

    tpls   : {
        winner : Ext.create('Ext.Template',
            '<b>{winner}</b> is the winner!<br />',
            '<b>Black: </b> {black}<br />',
            '<b>White: </b> {white}<br />'
        )
    },
    turn   : 'white',
    config : {
        views : [
            'Viewport'
        ],

        refs : {
            titlebar : {
                selector : '#titlebar'
            },
            viewport : {
                selector : 'othelloviewport',
                xtype    : 'viewport'
            }
        }
    },
    init   : function() {
        var me = this;

        Ext.Viewport.add({
            xtype : 'othelloviewport'
        });

        me.getApplication().on({
            scope            : me,
            play             : 'onAppPlay',
            settings         : 'onAppSettings',
            singleplayer     : 'onAppSinglePlayer',
            setting          : 'onAppSettingsChange',
            nomoves          : 'onAppNoMoves',
            endgame          : 'onAppEndGame',
            winner           : 'onAppWinner',
            userupdate       : 'onAppUserUpdate',
            chipflips        : 'onGameChipFlips',
            messagesreceived : 'onMessagesReceived'
        });

        me.callParent();
    },

    onAppSettingsChange : function(field, setting, value) {
        localStorage.setItem(setting, value);

        if (setting == 'music') {
            Rvrsit.game.setMusicVolume(value);
        }

        if (setting == 'fx') {
            Rvrsit.game.setFxVolume(value);
        }
    },

    onAppEndGame : function(game, score) {
        var me = this;
        score.winner = (score.white > score.black) ? 'white' : 'black';

        Ext.Msg.alert('End game!', me.tpls.winner.apply(score));

        //TODO : push RPC
        this.getApplication().rpc({
            method   : 'endGame',
            scope    : me,
            callback : me.onAfterAppEndGame,
            params   : {
                gameToken : me.gameToken.gameToken
            }
        });

        Rvrsit.game.halt();

    },

    onAfterAppEndGame : function(envelope) {
        var me = this,
            myUserId = me.getApplication().getUser().playerId,
            game = Rvrsit.game;

        //TODO: Finish game
//        me.gameToken = envelope.message || envelope.game;
    },

    onAppNoMoves : function(game, color) {
        Ext.Msg.alert(
            'Error', color + ' ' +
                'currently has no moves available!',
            this.onAfterNoMovesAlert,
            this
        );

        //TODO : push no moves RPC
    },

    onAppSinglePlayer    : function() {
        var me = this,
            game = Rvrsit.game;

        Ext.Msg.show({
            title   : 'Choose game mode:',
            buttons : [
                {
                    itemId : 'yes',
                    text   : '1 Player'
                },
                {
                    itemId : 'no',
                    text   : '2 Player (local)'
                },
                {
                    itemId : 'cancel',
                    text   : '2 Player (internet)'
                }
            ],
            fn      : function(btn) {
                if (btn == 'yes') {
                    me.initSinglePlayerMode();
                }
                else if (btn == 'no') {
                    game.setMode('double local');
                    game.newGame();
                }
                else if (btn == 'cancel') {
                    me.initDoubleRemoteMode();
                    //                    game.newGame();
                }
            }
        });
    },
    initSinglePlayerMode : function() {
        var game = Rvrsit.game;
        delete this.gameToken;
        Ext.Msg.alert(
            'Single player mode selected',
            'You will be playing against the computer as the black piece.' +
                ' You are first.',
            function() {
                game.setMode('single');
                game.newGame();
            }
        );
    },

    onAppWinner : function(game, color, score) {
        Ext.Msg.alert('Winner!', color + ' is the winner with ' + score + ' chips!');
    },

    onAfterNoMovesAlert : function() {
        var game = Rvrsit.game;

        game.swapTurn();
        game.nextMove();
    },

    onAppSettings : function() {
        this.getApplication().getController('Settings').showSettings();
    },

    onAppUserUpdate : function(userObj) {
       var app = this.getApplication();

        app.setUser(userObj);
        app.getMessages();
    },

    onAppPlay : function() {
        // TODO: Get multi-player working!
        this.onAppSinglePlayer();
//        Rvrsit.game.iosInitSounds();

        //        var user = this.getApplication().getUser(),
        //            controller = ! user ? 'Register' : 'Authentication';
        //
        //        this.getController(controller).showView();
    },

    onSoundCycle : function(btn) {
        ig.music.stop();
        localStorage.setItem('music', 'off');
    },

    controlChip : function(data) {
        Rvrsit.game.forceFlipChips(data);
    },

    onGameChipFlips : function(data) {
        console.log('onGameChipFlips', data);
        var me = this;

        me.getApplication().rpc({
            method : 'updateGame',
            params : {
                chipData  : Ext.encode(data),
                gameToken : me.gameToken && me.gameToken.gameToken
            },
            scope : me,
            success : me.onAfterUpdateGame
        });
    },
    onAfterUpdateGame : function(gameToken) {
        Ext.apply(this.gameToken, gameToken);
    },
    initDoubleRemoteMode        : function() {
        this.getApplication().rpc({
            method   : 'listAvailablePlayers',
            scope    : this,
            callback : this.onAfterInitDoubleRemoteMode
        });
    },
    onAfterInitDoubleRemoteMode : function(data) {
        this.getApplication().getController('Authentication').showView(data);
        console.log('available users', data);
    },

    onMessagesReceived : function(messages) {
        var me = this,
            methodMatrix = {
                challenge        : 'handleChallenge',
                gameStart        : 'handleGameStart',
                gameUpdate       : 'handleGameUpdate',
                declineChallenge : 'handleDeclineChallenge'
            },
            method;

        // TODO : render a list showing all challengers

        Ext.each(messages, function(msg) {
            method = methodMatrix[msg.messageType];
            if (method) {
                me[method](msg)
            }
            else {
                console.log(msg.messageType, ' is an unsupported messageType.', msg);
            }
        });

    },

    handleChallenge : function(envelope) {
        var me = this,
            opponent = envelope.message.secondPlayer;

        Ext.Msg.show({
            title   : 'You are being challenged!',
            message : '<b>' + opponent.name  + '</b>' + ' would like to challenge you to a game. Do you accept?',
            buttons : [
                {
                    itemId : 'yes',
                    text   : 'Let\'s do it!'
                },
                {
                    itemId : 'no',
                    text   : 'No way!'
                }
            ],

            fn : function(btn) {
                Ext.Function.defer(function() {
                    if (btn == 'yes') {
                        me.acceptChallenge(envelope, true);
                    }
                    else {
                        me.declineChallenge(envelope);
                    }
                }, 500);
            }
        });
    },

    handleGameStart : function(envelope) {
        var me = this,
            myUserId = me.getApplication().getUser().playerId,
            game = Rvrsit.game;

        me.gameToken = envelope.message || envelope.game;
        me.getApplication().getController('Authentication').hideView();

        game.setMode('double remote');
        game.newGame();

        game.myColor = (myUserId == me.gameToken.firstPlayerId) ? 'black' : 'white';
    },
    acceptChallenge : function(envelope) {
//        debugger;
        var me = this;
        if (me.gameToken) {
            return;
        }

        me.getApplication().rpc({
            method : 'acceptChallenge',
            params : {
                challengeMessage : Ext.encode(envelope)
            },
            scope : me,
            success : me.onAfterAcceptChallenge
        });
    },
    onAfterAcceptChallenge : function(gameData) {
//        debugger;
        console.log('NEW TWO PLAYER GAME', gameData);
        this.handleGameStart(gameData);
    },
    declineChallenge : function(envelope) {
        var me = this;

        me.getApplication().rpc({
            method : 'declineChallenge',
            params : {
                challengeMessage : Ext.encode(envelope)
            }
        });
    },

    isMyTurn : function(myUser) {
       return myUser.playerId == this.gameToken.currentPlayer;
    },

    handleGameUpdate : function(envelope) {
//        debugger;
        var me = this,
            message = envelope.message,
            lastMove = message.lastMove;

        if (message.gameToken.status === 1) {
            Rvrsit.game.halt();
            delete me.gameToken;
            return;
        }

        Ext.apply(me.gameToken, message.gameToken);

        console.log('>> getMessages', lastMove);

        var game = Rvrsit.game;

        Ext.each(lastMove, function(move) {
            console.log(move.turnColor, move.chipItemIds);
            game.forceFlipChips(move);
        });

    }
});