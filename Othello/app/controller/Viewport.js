Ext.define('Othello.controller.Viewport', {
    extend : 'Ext.app.Controller',

    views : [
        'Viewport'
    ],

    refs : [
        {
            ref      : 'titlebar',
            selector : '#titlebar'
        }
    ],

    launch : function() {
        console.log(this.$className);
        this.application.on({
            newgame : this.onNewGame
        });
    },

    onNewGame : function() {
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
    tallyScore : function() {
        var i          = 0,
            gamePieces = this.gamePieces,
            len        = gamePieces.length,
            scores     = {
                turn  : this.turn,
                white : 0,
                black : 0
            },
            piece;


        for (; i < len; i++) {
            piece = gamePieces[i];
            if (! piece.hidden) {
                scores[piece.color]++;
            }
        }


        this.application.fireEvent('scoreupdate', scores)

    }


});