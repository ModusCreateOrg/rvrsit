Othello.ScoreCardPanel = Ext.extend(Ext.Panel, {
    style  : 'margin-left: 10px; border: 1px solid #9E9E9E; -webkit-border-radius: 5px;',
    cssClasses : {
        white : 'ogp-white',
        black : 'ogp-black'
    },
    html :  [
        '<div>',
            '<div class="othello-scorecard-player"> Player :: ',
                '<span class="othello-scorecard-player-turn"></span>',
            '</div>',
            '<div class="othello-scorecard-score-keeper">',
                '<span style="displ">White ::</span> <span class="othello-scorecard-score-keeper-white"></span><br />',
                'Black :: <span class="othello-scorecard-score-keeper-black"></span><br />',
            '</div>',
        '</div>',
        '<div style="padding: 20px;">',
           '<div style="height: 58px; width: 58px; font-size: 12px;" class="othello-gamepiece"></div>',
        '</div>'
    ].join(''),

    initComponent : function() {
        this.dockedItems = this.buildDockedItems();
        Othello.ScoreCardPanel.superclass.initComponent.call(this);
        this.on({
            scope       : this,
            afterrender : this.onAfterRender
        });
    },

    buildDockedItems : function() {
        return {
            xtype       : 'container',
            dock        : 'bottom',
            height      : 50,
            defaultType : 'button',
            layout      : {
                type  : 'hbox',
                pack  : 'center'
            },
            items : [
                {
                    text    : 'New Game',
                    scope   : this,
                    handler : this.onNewGameBtn
                }
            ]
        }
    },
    onNewGameBtn : function() {
        this.fireEvent('newGame');
    },
    updateScores : function(scores) {
        if (!this.playerTurnEl) {
            var thisEl = this.el;
            this.playerTurnEl = thisEl.down('.othello-scorecard-player-turn').dom;
            this.whitePlayerScoreEl = thisEl.down('.othello-scorecard-score-keeper-white').dom;
            this.blackPlayerScoreEl = thisEl.down('.othello-scorecard-score-keeper-black').dom;
        }

        this.playerTurnEl.innerHTML = scores.turn;


        var thisCss = this.cssClasses,
            turn    = scores.turn,
            white   = 'white',
            gamePc  = this.gamePieceEl,
            newCls  = turn   == white ? thisCss.white : thisCss.black,
            oldCls  = newCls == white ? thisCss.white : thisCss.black ;

        gamePc.replaceCls(oldCls, newCls);
        this.whitePlayerScoreEl.innerHTML = scores.white;
        this.blackPlayerScoreEl.innerHTML = scores.black;
    },
    onAfterRender : function() {
        this.gamePieceEl = this.el.down('.othello-gamepiece');
        new Ext.util.Draggable(this.gamePieceEl.dom, {
            revert : true,
            group : 'othello-gamepiece'
        });

    }
});

Ext.reg('Othello_ScoreCardPanel',Othello.ScoreCardPanel);