Ext.define('Othello.controller.ScoreCard', {
    extend : 'Ext.app.Controller', // TODO : push to container?

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
        return;
//        console.log('onAppScoreUpdate', arguments);
        var scoreCard = this.getScorecard(),
            imgLocations = scoreCard.getImgLocations();


        if (!scoreCard.playerTurnEl) {
            var scoreCardEl = scoreCard.el;
            scoreCard.playerTurnEl       = scoreCardEl.down('.othello-scorecard-player-turn').dom;
            scoreCard.whitePlayerScoreEl = scoreCardEl.down('.othello-scorecard-score-keeper-white').dom;
            scoreCard.blackPlayerScoreEl = scoreCardEl.down('.othello-scorecard-score-keeper-black').dom;
        }

        scoreCard.playerTurnEl.src = imgLocations[scoreObj.turn];

        scoreCard.whitePlayerScoreEl.innerHTML = scoreObj.white;
        scoreCard.blackPlayerScoreEl.innerHTML = scoreObj.black;
    }


});