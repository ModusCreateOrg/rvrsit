Ext.define('Rvrsit.controller.Viewport', {
    extend : 'Ext.app.Controller',
    tpls   : {
        winner : Ext.create('Ext.Template',
            '<b>{winner}</b> is the winner!<br />',
            '<b>Black: </b> {black}<br />',
            '<b>White: </b> {white}<br />'
        )
    },
    views  : [
        'Viewport'
    ],
    turn   : 'white',

    refs : [
        {
            ref      : 'titlebar',
            selector : '#titlebar'
        },
        {
            ref      : 'viewport',
            selector : 'othelloviewport',
            xtype    : 'viewport'
        }
    ],

    init : function() {

        var me = this;

        Ext.Viewport.add({
            xtype : 'othelloviewport'
        });

        me.control({
            'othelloNavigation > toolbar[docked=bottom] > button[action=newGame]'     : {
                tap : me.onAppPlay
            },
            'othelloNavigation > toolbar[docked=bottom] > button[action=soundToggle]' : {
                tap : me.onAppPlay
            }
        });

        me.application.on({
            scope        : me,
            play         : me.onAppPlay,
            settings     : me.onAppSettings,
            singleplayer : me.onAppSinglePlayer,
            setting      : me.onAppSettingsChange,
            nomoves      : me.onAppNoMoves,
            endgame      : me.onAppEndGame,
            winner       : me.onAppWinner,
            userUpdate   : me.onAppUserUpdate
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
        var game = Rvrsit.game;

        if (game.mode == 'single') {
            game.newGame();
            return;
        }

        Ext.Msg.alert(
            'Single player mode selected',
            'In single player mode, you will be playing against the computer as the black piece.' +
                'You are first. Press OK to begin!',
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
        Rvrsit.game.swapTurn();
        Rvrsit.game.nextMove();
    },

    onAppSettings : function() {
        this.getController('Settings').showSettings();
    },

    onAppUserUpdate : function(userObj) {
        this.application.setUser(userObj);
    },

    onAppPlay    : function() {
        var game = Rvrsit.game;

        if (game.mode == 'single') {
            game.newGame();
            return;
        }

        var user = this.application.getUser();

        if (! user) {
            this.getController('Register').showView();
        }
        else {
            this.getController('Waiting').showView();
        }
    },

    onSoundCycle : function(btn) {
        ig.music.stop();
        localStorage.setItem('music', 'off');
    }
});