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
        this.getScorecard().updateScore(scoreObj);
    }


});