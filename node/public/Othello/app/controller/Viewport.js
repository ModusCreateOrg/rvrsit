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
            ref      : 'viewport',
            selector : 'othelloNavigation',
            xtype    : 'othelloNavigation',
            autoCreate: true
            //selector : 'othelloviewport'
        },
        {
            ref      : 'gamePanel',
            xtype    : 'othelloviewport',
            selector : 'othelloviewport',
            autoCreate: true
        },
        {
            ref      : 'socketDebug',
            xtype    : 'socketDebug',
            selector : 'socketDebug',
            autoCreate: true
        },
        {
            ref      : 'messaging',
            xtype    : 'messaging',
            selector : 'messaging',
            autoCreate: true
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
                tap: me.showSocketDebug,
                scope: me
            }
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