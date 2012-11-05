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
                play     : 'onScoreCardPanelPlay',
                settings : 'onScoreCardPanelSettings'
            }
        }
    },

    init : function() {
        this.getApplication().on({
            scope       : this,
            scoreupdate : this.onAppScoreUpdate
        });
    },

    onScoreCardPanelPlay : function() {
        this.getApplication().fireEvent('play');
    },

    onScoreCardPanelSettings : function() {
        this.getApplication().fireEvent('settings');
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