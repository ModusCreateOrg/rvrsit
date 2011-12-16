Ext.define('Othello.controller.Viewport', {
    extend : 'Ext.app.Controller',

    views : [
        'Viewport'
    ],
    turn : 'white',

    refs : [
        {
            ref      : 'titlebar',
            selector : '#titlebar'
        },
        {
            ref      : 'viewport',
            selector : 'othellowviewport'
        }
    ],
    init : function() {
        console.log(this.$className, 'init');

        this.getView('Viewport').create({
            fullscreen : true
        });


        this.application.on({
            scope    : this,
            newgame  : this.onNewGame,
            swapturn : this.onSwapTurn
        });

        this.turn = 'white';
        this.tallyScore();


    },

    onNewGame : function() {
        Ext.each(this.gamePieces, function(gp) {
            gp.reset();
        });

    },

    setTitle : function(title) {
        this.getDockedItems()[0].setTitle(title);
    },
    onSwapTurn : function() {
        this.turn = (this.turn === 'white') ? 'black' : 'white';
        console.info(this.turn);
        this.tallyScore();
    },
    getTurn : function() {
        return this.turn;
    },
    tallyScore : function() {
        return;
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