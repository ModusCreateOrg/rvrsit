Ext.define('Othello.controller.Viewport', {
    extend : 'Ext.app.Controller',

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
        console.log(this.$className, 'init');

        var me = this;

        Ext.Viewport.add(me.getViewport());

        me.getViewport().add([
            //me.getMessaging(),
            me.getGamePanel(),
            me.getSocketDebug()
        ]);

        
        me.application.on({
            scope    : me,
            newgame  : me.onNewGame,
            swapturn : me.onSwapTurn
        });

        me.turn = 'white';
        me.tallyScore();

        me.control({
            // intentionally long
            'othelloNavigation > toolbar[docked=bottom] > button[action=socketDebug]': {
                tap : me.showSocketDebug
            }
        });

        this.application.on({
            scope         : me,
            gameboardinit : me.onGameboardInit
        });

        me.callParent();
    },

    showMessagingWindow: function() {

    },

    showSocketDebug: function() {
        this.getViewport().push(this.getSocketDebug());
    },

    onNewGame : function() {
        Ext.each(this.gamePieces, function(gp) {
            gp.reset();
        });
    },

    setTitle : function(title) {
        this.getDockedItems()[0].setTitle(title);
    },
    onGameboardInit : function() {
        var chips     = [],
            yIndex    = 0,
            boardSize = 8,
            chipSize  = 48,
            black     = 'black',
            white     = 'white',
            row,
            color,
            x,
            y,
            itemId,
            xIndex;

        for (; yIndex < boardSize; ++yIndex) {
            row   = [];

            for (xIndex = 0; xIndex < boardSize; ++xIndex) {
                y = chipSize * yIndex;
                x = chipSize * xIndex;
                color = ((xIndex + yIndex) % 2)? black : white;
//                hidden = ((xIndex == 3 || xIndex == 4) && (yIndex == 3 || yIndex == 4)),
                itemId = 'ogp-' + xIndex + '-' + yIndex;

                ig.game.spawnEntity(EntityChip, x, y, {
                    color  : color,
                    itemId : itemId,
                    row    : xIndex,
                    col    : yIndex
                });
            }

        }

        return chips;
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