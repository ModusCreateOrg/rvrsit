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
            userUpdate       : 'onAppUserUpdate',
            chipFlips        : 'onGameChipFlips',
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
        score.winner = (score.white > score.black) ? 'white' : 'black';

        Ext.Msg.alert('End game!', this.tpls.winner.apply(score));
    },

    onAppNoMoves : function(game, color) {
        Ext.Msg.alert(
            'Error', color + ' ' +
                'currently has no moves available!',
            this.onAfterNoMovesAlert,
            this
        );
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
                    game.setMode('double remote');
                    me.initDoubleRemoteMode();
                    //                    game.newGame();
                }
            }
        });
    },
    initSinglePlayerMode : function() {
        var game = Rvrsit.game;

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
        this.getApplication().setUser(userObj);
    },

    onAppPlay : function() {
        // TODO: Get multi-player working!
        this.onAppSinglePlayer();
        Rvrsit.game.iosInitSounds();

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

    onGameChipFlips             : function(data) {
        // TODO: Get multi-player working!

        //        if (this.getApplication().user.name == 'Slave') {
        //            return;
        //        }
        //        console.log('onGameChipFlips', data);
        //        this.getApplication().rpc('updateGame', {
        //            params : {
        //                id       : 1,
        //                user     : Ext.encode(this.user),
        //                chipData : Ext.encode(data)
        //            }
        //        })
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
            messageType = 'challenge',
            challenge,
            opponent;

        Ext.each(messages, function(msg) {
            if (msg.messageType == messageType)  {
                challenge = msg.message;
                return false;
            }
        });
        // TODO : render a list showing all challengers
        opponent = challenge.secondPlayer;


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
            fn      : function(btn) {
                console.log('btn pressed', btn);
                if (btn == 'yes') {
//                    me.initSinglePlayerMode();
                }
                else {
//                    game.setMode('double local');
//                    game.newGame();
                }
            }
        });



    }
});