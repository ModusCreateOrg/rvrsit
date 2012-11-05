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
            scope: me,
            login: 'onLogin',
            online: 'onAppOnlinePlay',
            settings: 'onAppSettings',
            singleplayer: 'onAppSinglePlayer',
            setting: 'onAppSettingsChange',
            nomoves: 'onAppNoMoves',
            endgame: 'onAppEndGame',
            winner: 'onAppWinner',
            userupdate: 'onAppUserUpdate',
            chipflips: 'onGameChipFlips',
            messagesreceived: 'onMessagesReceived'
        });

        me.callParent();
    },

    onLogin: function() {
        this.getApplication().getController('scoreCard').hideLogin();
    },
    onLogout: function() {
        this.getApplication().getController('scoreCard').showLogin();
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

    onSoundCycle : function(btn) {
        ig.music.stop();
        localStorage.setItem('music', 'off');
    },

    controlChip : function(data) {
        Rvrsit.game.forceFlipChips(data);
    },

    onGameChipFlips             : function(data) {
        //        console.log('onGameChipFlips', data);
        var me = this,
            token = me.gameToken;

        if (!token) {
            return;
        }

        me.getApplication().rpc({
            method  : 'updateGame',
            params  : {
                chipData  : Ext.encode(data),
                gameToken : token.gameToken
            },
            scope   : me,
            success : me.onAfterUpdateGame
        });
    },
    onAfterUpdateGame           : function(gameToken) {
        Ext.apply(this.gameToken, gameToken);
    },



    onAppOnlinePlay : function() {
        var app = this.getApplication();
        if (!app.user) {
            Ext.Msg.alert('Info', 'Log In first.');
//            app.getController('Authentication').showView();
        }

//        this.getApplication().getController('Authentication').showView();
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
                //                console.log(msg.messageType, ' is an unsupported messageType.', msg);
            }
        });

    },

    handleChallenge : function(envelope) {
        var me = this,
            opponent = envelope.message.secondPlayer;

        Ext.Msg.show({
            title   : 'You are being challenged!',
            message : '<b>' + opponent.name + '</b>' + ' would like to challenge you to a game. Do you accept?',
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

    handleGameStart        : function(envelope) {
        var me = this,
            myUserId = me.getApplication().getUser().playerId,
            game = Rvrsit.game;
        me.gameToken = envelope.message || envelope.game;
        me.getApplication().getController('Authentication').hideView();
        console.log('my game token', me.gameToken);

        game.setMode('double remote');
        game.newGame();

        game.myColor = (myUserId == me.gameToken.firstPlayerId) ? 'black' : 'white';
    },
    acceptChallenge        : function(envelope) {
        //        debugger;
        var me = this;
        if (me.gameToken) {
            return;
        }

        me.getApplication().rpc({
            method  : 'acceptChallenge',
            params  : {
                challengeMessage : Ext.encode(envelope)
            },
            scope   : me,
            success : me.onAfterAcceptChallenge
        });
    },
    onAfterAcceptChallenge : function(gameData) {
        //        debugger;
        //        console.log('NEW TWO PLAYER GAME', gameData);
        this.handleGameStart(gameData);
    },
    declineChallenge       : function(envelope) {
        var me = this;

        me.getApplication().rpc({
            method : 'declineChallenge',
            params : {
                challengeMessage : Ext.encode(envelope)
            }
        });
    },

    isMyTurn : function(myUser) {
        debugger;
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

        var game = Rvrsit.game;

        Ext.each(lastMove, function(move) {
            game.forceFlipChips(move);
        });

    }
});