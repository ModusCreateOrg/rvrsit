Ext.define('Rvrsit.controller.Viewport', {
    extend : 'Ext.app.Controller',
    tpls   : {
        winner : Ext.create('Ext.Template',
            '<b>{winner}</b> is the winner!<br />',
            '<b>Black: </b> {black}<br />',
            '<b>White: </b> {white}<br />'
        )
    },
    turn   : 'white',
    config : {
        views  : [
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
    init : function() {

        var me = this;

        Ext.Viewport.add({
            xtype : 'othelloviewport'
        });

        me.getApplication().on({
            scope        : me,
            play         : me.onAppPlay,
            settings     : me.onAppSettings,
            singleplayer : me.onAppSinglePlayer,
            setting      : me.onAppSettingsChange,
            nomoves      : me.onAppNoMoves,
            endgame      : me.onAppEndGame,
            winner       : me.onAppWinner,
            userUpdate   : me.onAppUserUpdate,
            chipFlips    : me.onGameChipFlips
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

    onAppSinglePlayer : function() {
        var me = this,
            game = Rvrsit.game;

//        if (game.mode == 'single') {
//            game.newGame();
//            return;
//        }

        Ext.Msg.show({
            title   : 'Choose game mode:',
            buttons : [
                {
                    itemId : 'yes',
                    text   : '1 Player'
                },
                {
                    itemId : 'no',
                    text   : '2 Player'
                }
            ],
            fn : function(btn) {
                if (btn == 'yes') {
                    me.initSinglePlayerMode();
                }
                else {
                    game.setMode('double');
                    game.newGame();
                }
            }
        })

    },
    initSinglePlayerMode : function() {
        var game = Rvrsit.game;

        Ext.Msg.alert(
            'Single player mode selected',
            'You will be playing against the computer as the black piece.' +
                ' You are first.',
            function(btn) {
                game.setMode('single');
                game.newGame();
            }
        );
    },

    onAppWinner : function(game, color, score) {
        Ext.Msg.alert('Winner!', color + ' is the winner with ' + score + ' chips!');
    },

    onAfterNoMovesAlert : function() {
        Rvrsit.game.swapTurn();
        Rvrsit.game.nextMove();
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
//        var user = this.getApplication().getUser(),
//            controller = ! user ? 'Register' : 'Waiting';
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
    }
});