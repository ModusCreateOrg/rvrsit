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
            scope : this,
            scoreupdate : this.onAppScoreUpdate
        });
    },
    onScoreCardPanelNewBtn : function() {
//        console.log('new game')
    },
    onAppScoreUpdate : function(game, scoreObj) {
         this.getScorecard().updateScore(scoreObj);
    }


});