Ext.ns("Othello");

Othello.GameBoard = Ext.extend(Ext.Panel, {
    boardSize  : 8,
    tileSize   : 70, // px
    fullscreen : true,
    cls        : 'othello-gameboard',
    title      : 'Othello Beta',
    turn       : 'white',
    bodyStyle  : 'padding: 10px; background-color: #FEFEFE',
    layout     : {
        type  : 'hbox',
        align : 'stretch',
        pack  : 'center'
    },
    initComponent : function() {
        this.items = this.buildItems();
        this.height = this.boardSize * this.tileSize;

        this.dockedItems = [
            {
                dock  : 'top',
                xtype : 'toolbar',
                title : '<img src="images/modus_logo_small.gif" style="-webkit-border-radius: 5px; position: relative; top: 7px;"/> <span>Othello</span>',
                items : [
                    {
                        xtype : 'spacer'
                    },
                    {
                        text : 'info'
                    }
                ]
            }
        ];

        Othello.GameBoard.superclass.initComponent.call(this);

        this.on({
            scope       : this,
            afterrender : this.onAfterRenderInitGamePcs
        });
    },

    buildItems : function() {
        var size = this.tileSize * this.boardSize;
        return [
            {
                xtype  : 'container',
                itemId : 'chipsContainer',
                width  : size,
                height : size,
                items  : this.buildChips(),
                layout : {
                    type   : 'vbox',
                    align  : 'stretch'
                }
            },
            {
                xtype     : 'Othello_ScoreCardPanel',
                width     : 200,
                height    : size,
                itemId    : 'scoreCard',
                listeners : {
                    scope   : this,
                    newgame : this.onScoreCardPanelNewBtn
                }
            }
        ]
    },

    buildChips : function() {
        var chips   = [],
            yIndex  = 0,
            xEnd    = this.boardSize,
            yEnd    = this.boardSize,
            gpSize  = this.tileSize - 12,
            defType = 'Othello_GamePiece',
            hbox    = {
                type  : 'hbox',
                align : 'stretch'
            },
            xIndex;

        for (; yIndex < yEnd; ++yIndex) {
            var row   = [],
                black = 'black',
                white = 'white',
                hidden,
                itemId;

            for (xIndex = 0; xIndex < xEnd; ++xIndex) {

                hidden = ((xIndex == 3 || xIndex == 4) && (yIndex == 3 || yIndex == 4)),
                itemId = 'ogp-' + xIndex + '-' + yIndex;

                row.push({
                    height     : gpSize,
                    width      : gpSize,
                    flex       : 1,
                    itemId     : itemId,
                    style      :' -webkit-border-radius: 10px;',//background-color: #EAEAEA;',
                    color      : ((xIndex + yIndex) % 2)? black : white,
                    initHidden : ! hidden,
                    gameBoard  : this,
                    coords     : {
                        x : xIndex,
                        y : yIndex
                    }
                });
            }

            chips.push({
                xtype       : 'container',
                items       : row,
//                style       : 'padding: 2px;',
                width       : this.boardSize * this.tileSize,
                height      : this.tileSize,
                defaultType : defType,
                layout      : hbox
            });
        }

        return chips;
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
    getScoreCard : function() {
        var scoreCard = this.scoreCard;
        return scoreCard ? scoreCard : this.scoreCard = this.query('Othello_ScoreCardPanel')[0];
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
            scoreCard  = this.getScoreCard(),
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

        scoreCard.updateScores(scores);
    }
});




Ext.setup({
    onReady : function() {
        new Othello.GameBoard();
    }
});