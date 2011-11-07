Ext.define('Othello.controller.ScoreCard', {
    extend : 'Ext.Panel', // TODO : push to container?

    views : [
        'ScoreCard'
    ],
    refs : [
        {
            ref      : '',
            selector : ''
        }
    ],
    init : function() {
        this.application.on({
            scoreupdate : this.onAppScoreUpdate,
            newgame     : this.onNewGame

        })
    },

    onAppScoreUpdate : function() {

    },
    onScoreCardPanelNewBtn : function() {
        Ext.each(this.gamePieces, function(gp) {
            gp.reset();
        });
        this.turn = 'white';
        this.tallyScore();
    },
    onAfterRenderInitGamePcs :function() {
        var gamePcs = this.gamePieces = this.query('Othello_GamePiece');

        Ext.each(gamePcs, function(item) {
            item.initPositionalAwareness();
        });

        this.tallyScore();
    },
    setTitle : function(title) {
        this.getDockedItems()[0].setTitle(title);
    },
    swapTurn : function() {
        this.turn = (this.turn === 'white') ? 'black' : 'white';
        this.tallyScore();
    },
    getTurn : function() {
        return this.turn;
    },
    onAppScoreUpdate : function(scores) {


    }

//    getScoreCard : function() {
//        var scoreCard = this.scoreCard;
//        return scoreCard ? scoreCard : this.scoreCard = this.query('Othello_ScoreCardPanel')[0];
//    },

});