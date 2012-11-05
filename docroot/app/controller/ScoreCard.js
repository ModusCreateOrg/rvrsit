//
Ext.define('Rvrsit.controller.ScoreCard', {
    extend : 'Ext.app.Controller',

    config : {
        views : [
            'ScoreCard'
        ],

        refs : {
            scorecard : {
                selector : '[itemId="scoreCard"]'
            }
        },
        control : {
            'scorecard' : {
                solo     : 'onScoreCardPanelSolo',
                online   : 'onScoreCardPanelOnline',
                settings : 'onScoreCardPanelSettings',
                login    : 'onLogin'
            }
        }
    },

    init : function() {
        this.getApplication().on({
            scope       : this,
            scoreupdate : this.onAppScoreUpdate
        });
    },

    onScoreCardPanelSolo : function() {
        this.getApplication().fireEvent('singleplayer');
    },

    onScoreCardPanelOnline : function() {
        this.getApplication().fireEvent('online');
    },

    onScoreCardPanelSettings : function() {
        this.getApplication().fireEvent('settings');
    },

    onLogin : function() {
        var app = this.getApplication();
        if (app.user) {
            // do logout
            app.user = null;
            Ext.get('login-button').setHtml('Log In');
            Ext.get('register-button-wrap').setVisibility(true);
        }
        else {
            app.getController('Authentication').showView();
        }

        return;
        var el = Ext.get('login-button');
        if (el) {
            if (el.getHtml() === 'Log In') {
                el.setHtml('Log Out');
            }
            else {
                el.setHtml('Log In');
            }
        }
//        console.log(Ext.get('login-button').getHtml());
//        Ext.get('login-button').setHtml('Log Out');
    },

    onAppScoreUpdate : function(game, scoreObj) {

        var me = this,
            gameToken = me.getApplication().getController('Viewport').gameToken;

        //override the score object from the game
        if (gameToken) {
            Rvrsit.game.turn = (gameToken.currentPlayer == gameToken.firstPlayer.playerId)  ? 'black' : 'white';
        }

        me.getScorecard().updateScore(scoreObj, gameToken);
        if (scoreObj.total == 100) {
            me.getApplication().fireEvent('endgame', scoreObj);
        }
    }
});