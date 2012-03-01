Ext.define('Rvrsit.controller.ScoreCard', {
    extend : 'Ext.app.Controller',

    views : [
        'ScoreCard'
    ],

    refs : [
        {
            ref      : 'scorecard',
            selector : '[itemId="scoreCard"]'
        }
    ],

    init : function() {
        this.application.on({
            scope       : this,
            scoreupdate : this.onAppScoreUpdate
        });

        this.control({
            'scorecard' : {
                play     : this.onScoreCardPanelPlay,
                settings : this.onScoreCardPanelSettings
            }
        })
    },

    onScoreCardPanelPlay : function() {
        this.application.fireEvent('play');
    },
    onScoreCardPanelSettings : function() {
        this.application.fireEvent('settings');
    },

    onAppScoreUpdate : function(game, scoreObj) {
        this.getScorecard().updateScore(scoreObj);
    }


});