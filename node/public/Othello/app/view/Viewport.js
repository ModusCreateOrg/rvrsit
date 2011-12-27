Ext.define('Othello.view.Viewport', {
    extend : 'Ext.Container',
    requires : [
        'Othello.view.GamePiece'
    ],

    xtype : 'othelloviewport',
    config : {
        boardSize  : 8,
        turn       : 'white',
        fullscreen : true,
        cls        : 'othello-gameboard',
        tileSize   : 70, // px
        title      : 'Othello Game',

        bodyStyle  : 'padding: 10px; background-color: #FEFEFE',
        layout     : {
            type  : 'hbox',
            align : 'stretch',
            pack  : 'center'
        }
    },
    initialize : function() {
        this.setItems([
            this.buildItems()
            //,this.buildDockedItems()
        ]);

        // TODO: push to CSS somehow
//        this.setHeight(this.getBoardSize() * this.getTileSize());

        Ext.each(this.query('gamepiece'), function(item) {
//            console.log(item);
            item.initPositionalAwareness();
        });

        this.callParent();
        this.on({
            scope   : this,
            buffer  : 500,
            painted : function() {
                //TODO: push to controller somehow
                ig.main( '#canvas', MyGame, 30, 384, 384, 1 );
            }
        })
    },

    buildItems : function() {
        return {
            xtype     : 'component',
            height    : 384,
            width     : 384,
            tpl       : '<canvas id="{id}">asdfsadf</canvas>',
            data      : { id : 'canvas'}
        };
    },

    buildScoreCard : function() {
        return {
            xtype     : 'Othello_ScoreCardPanel',
            width     : 200,
            height    : size,
            itemId    : 'scoreCard',
            listeners : {
                scope   : this,
                newgame : this.onScoreCardPanelNewBtn
            }
        };

    },

    buildChips : function() {
        var chips     = [],
            yIndex    = 0,
            boardSize = this.getBoardSize(),
            tileSize  = this.getTileSize(),
            chipWidth =  boardSize * tileSize,
            gpSize    = tileSize - 12,
            defType   = 'gamepiece',
            hbox      = {
                type  : 'hbox',
                align : 'stretch'
            },
            xIndex;

        for (; yIndex < boardSize; ++yIndex) {
            var row   = [],
                black = 'black',
                white = 'white',
                hidden,
                itemId;

            for (xIndex = 0; xIndex < boardSize; ++xIndex) {

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
//                style       : 'border: 1px solid #000',
                width       : chipWidth,
                height      : tileSize,
                defaultType : defType,
                layout      : hbox
            });
        }

        return chips;
    }
});