Ext.define('Othello.controller.Viewport', {
    extend : 'Ext.app.Controller',
    tpls : {
        winner : Ext.create('Ext.Template',
            '<b>{winner}</b> is the winner!<br />',
            '<b>Black: </b> {black}<br />',
            '<b>White: </b> {white}<br />'
        )
    },
    views : [
        'Viewport',
        'Navigation',
        'SocketDebug',
        'Messaging'
    ],
    turn : 'white',

    refs : [
        {
            ref      : 'titlebar',
            selector : '#titlebar'
        },
        {
            ref       : 'viewport',
            selector  : 'othelloNavigation',
            xtype     : 'othelloNavigation',
            autoCreate : true
            //selector : 'othelloviewport'
        },
        {
            ref        : 'gamePanel',
            xtype      : 'othelloviewport',
            selector   : 'othelloviewport',
            autoCreate : true
        },
        {
            ref        : 'socketDebug',
            xtype      : 'socketDebug',
            selector   : 'socketDebug',
            autoCreate : true
        },
        {
            ref        : 'messaging',
            xtype      : 'messaging',
            selector   : 'messaging',
            autoCreate : true
        }
    ],
    init : function() {

        var me = this;

        Ext.Viewport.add(me.getViewport());

        me.getViewport().add([
            //me.getMessaging(),
            me.getGamePanel(),
            me.getSocketDebug()
        ]);

        
        me.control({
            // intentionally long
            'othelloNavigation > toolbar[docked=bottom] > button[action=socketDebug]': {
                tap : me.onSocketDebugBtn
            },
            'othelloNavigation > toolbar[docked=bottom] > button[action=settings]': {
                tap : me.onSettingsBtn
            },
            'othelloNavigation > toolbar[docked=bottom] > button[action=newGame]': {
                tap : me.onNewGameBtn
            },
            'othelloNavigation > toolbar[docked=bottom] > button[action=soundToggle]': {
                tap : me.onNewGameBtn
            }
        });

        me.application.on({
            scope   : me,
            setting : me.onAppSettingsChange,
            nomoves : me.onAppNoMoves,
            endgame : me.onAppEndGame,
            winner  : me.onAppWinner
        });

        me.callParent();
    },
    onAppSettingsChange : function(field, setting, value) {
        localStorage.setItem(setting, value);

        if (setting == 'music')  {
            Othello.game.setMusicVolume(value);
        }

        if (setting == 'fx')  {
            Othello.game.setFxVolume(value);
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
    onAppWinner : function(game, color, score) {
        Ext.Msg.alert('Winner!', color + ' is the winner with ' + score + ' chips!');
    },
    onAfterNoMovesAlert : function() {
        Othello.game.swapTurn();
        Othello.game.nextMove();

    },
    onSettingsBtn : function() {
        this.getController('Settings').showSettings();
    },
    onNewGameBtn : function() {
        Othello.game.newGame();
    },
    onSoundCycle : function(btn) {
        ig.music.stop();

        localStorage.setItem('music', 'off');

    },
    showMessagingWindow: function() {

    },

    onSocketDebugBtn: function() {
        this.getViewport().push(this.getSocketDebug());
    },

    setTitle : function(title) {
        this.getDockedItems()[0].setTitle(title);
    }
});