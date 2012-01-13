ig.module(
	'game.main'
)
.requires(
	'impact.game',
	'impact.font',

    'game.entities.chip',
    'game.levels.test'
//    'impact.debug.debug'
)
    .defines(function(){

    MyGame = ig.Game.extend({

        // Load a font
//        font: new ig.Font( 'media/04b03.font.png' ),

        turn : 'black',
        songs : [
            new ig.Sound('media/sounds/Sixeco.caff', true),
//            new ig.Sound('media/sounds/SnD_TweakRAM.caff'),
//            new ig.Sound('media/sounds/Sore_point.caff'),
//            new ig.Sound('media/sounds/faerie.caff')
        ],
        init: function() {
            Othello.app.game = this;
            // Initialize your game here; bind keys etc.
//            ig.input.bind( ig.KEY.UP_ARROW, 'up' );
            this.loadLevel( LevelTest );
            ig.input.initMouse();

            ig.input.bind(ig.KEY.MOUSE1, 'click');

            //fire sencha touch event
//            Othello.app.fireEvent('gameboardinit');
            this.newGame();
        },
        newGame : function() {
            var me      = this,
                myChips = this.allChips;


            this.songs[0].play();
            if (myChips) {
                for (var chip in myChips) {
                    me.removeEntity(myChips[chip]);
                }
            }
            me.chips = me.buildChips();
            me.turn = 'black'; // TODO: fix
            me.swapTurn();
        },
        update: function() {
            // Update all entities and backgroundMaps
            this.parent();

            // Add your own, additional update code here
        },

        draw: function() {
            // Draw all entities and backgroundMaps
            this.parent();

        },
        buildChips : function() {
            var blankChips = {},
                visChips   = {},
                chips      = [],
                allChips   = {},
                yIndex     = 0,
                boardSize  = 8,
                chipSize   = 48,
                black      = 'black',
                white      = 'white',
                row,
                blank,
                color,
                x,
                y,
                itemId,
                xIndex,
                chip;

            for (; yIndex < boardSize; ++yIndex) {
                row   = [];

                for (xIndex = 0; xIndex < boardSize; ++xIndex) {
                    y      = chipSize * yIndex;
                    x      = chipSize * xIndex;
                    color  = ((xIndex + yIndex) % 2)? black : white;
                    blank  = ((xIndex == 3 || xIndex == 4) && (yIndex == 3 || yIndex == 4));
                    itemId = 'ogp-' + xIndex + '-' + yIndex;

                    chip = ig.game.spawnEntity(EntityChip, x, y, {
                        color  : blank ? color : blank,
                        itemId : itemId,
                        row    : xIndex,
                        col    : yIndex
                    });

                    if (blank) {
                        blankChips[itemId] = chip;
                    }
                    else {
                        visChips[itemId] = chip;
                    }

                    allChips[itemId] = chip;
                    row.push(chip);
                }
                chips.push(row);
            }

            this.allChips = allChips;

            for (var key in allChips) {
                this.initPositionalAwareness(allChips[key]);
            }
            return chips;
        },
        initPositionalAwareness: function(chip) {
            var row = chip.row,
                col = chip.col;

            chip.isEdgePiece = (col === 0 || col=== 7 || row===0 || row===7);

            chip.connections = {};

            if (col === 0) {
                if (row === 0) {
                    this.setConnections(chip, 'e', row,col);
                    this.setConnections(chip, 'se', row,col);
                    this.setConnections(chip, 's', row,col);
                }
                else if (row === 7) {
                    //S, SW, W
                    this.setConnections(chip, 's', row,col);
                    this.setConnections(chip, 'sw',row,col);
                    this.setConnections(chip, 'w',row,col);
                }
                else {
                    // W, SW, S, SE, E
                    this.setConnections(chip, 'e',row,col);
                    this.setConnections(chip, 'se',row,col);
                    this.setConnections(chip, 's', row,col);
                    this.setConnections(chip, 'sw',row,col);
                    this.setConnections(chip, 'w', row,col);
                }

            }
            else if (col > 0 && col < 7) {
                if (row === 0) {
                    // N, NE, E, SE, S
                    this.setConnections(chip, 'n', row,col);
                    this.setConnections(chip, 'ne',row,col);
                    this.setConnections(chip, 'e',row,col);
                    this.setConnections(chip, 'se', row,col);
                    this.setConnections(chip, 's',row,col);
                }
                else if (row === 7) {
                    // N, S, SW, W, NW
                    this.setConnections(chip, 's', row,col);
                    this.setConnections(chip, 'sw',row,col);
                    this.setConnections(chip, 'w',row,col);
                    this.setConnections(chip, 'nw', row,col);
                    this.setConnections(chip, 'n',row,col);
                }
                else {
                    // All coords
                    this.setConnections(chip, 'n', row,col);
                    this.setConnections(chip, 'ne',row,col);
                    this.setConnections(chip, 'e',row,col);
                    this.setConnections(chip, 'se', row,col);
                    this.setConnections(chip, 's',row,col);
                    this.setConnections(chip, 'sw', row,col);
                    this.setConnections(chip, 'w',row,col);
                    this.setConnections(chip, 'nw',row,col);
                }

            }
            else if (col === 7) {
                if (row === 0) {
                    // N, NE, E
                    this.setConnections(chip, 'n', row,col);
                    this.setConnections(chip, 'ne',row,col);
                    this.setConnections(chip, 'e',row,col);
                }
                else if (row === 7) {
                    // N, W, NW
                    this.setConnections(chip, 'n', row,col);
                    this.setConnections(chip, 'w',row,col);
                    this.setConnections(chip, 'nw',row,col);
                }
                else {
                    // N, NE, E, W, NW
                    this.setConnections(chip, 'n', row,col);
                    this.setConnections(chip, 'ne',row,col);
                    this.setConnections(chip, 'e', row,col);
                    this.setConnections(chip, 'w', row,col);
                    this.setConnections(chip, 'nw',row,col);
                }
            }
//            console.log(chip.itemId, chip.connections)
        },
        setConnections : function(chip, position, x, y) {
            var itemId,
                ogp = 'ogp-';

            if (position === 'e') {
                itemId = ogp + (x + 1 ) + '-' + y;
            }
            else if (position == 'se') {
                itemId = ogp + (x + 1) + '-' + (y + 1);
            }
            else if (position == 's') {
                itemId = ogp + x + '-' + (y + 1);
            }
            else if (position == 'sw') {
                itemId = ogp + (x - 1) + '-' + (y + 1);
            }
            else if (position == 'w') {
                itemId = ogp + (x - 1) + '-' + y;
            }
            else if (position == 'nw') {
                itemId = ogp + (x - 1) + '-' + (y - 1);
            }
            else if (position == 'ne') {
                itemId = ogp + (x + 1) + '-' + (y - 1);
            }
            else if (position == 'n') {
                itemId = ogp + x + '-' + (y - 1);
            }

            chip.connections[position] = this.allChips[itemId];
        },
        sayTurn : function() {
            this.calcScore();
            console.log(this.turn + "'s turn");
        },
        swapTurn : function() {
            var oldTurn = this.turn;
            this.turn = (oldTurn == 'white') ? 'black' : 'white';

            return oldTurn;
        },
        calcScore : function() {

            var allChips   = this.allChips,
                whiteScore = 0,
                blackScore = 0,
                color,
                itemId,
                chip;

            for (itemId in allChips) {
                chip = allChips[itemId];
                color = chip.newColor || chip.color;

                if (color == 'white') {
                    whiteScore++;
                }
                else if (color == 'black') {
                    blackScore++;
                }

            }

            Othello.app.fireEvent('scoreupdate', this,  {
                turn  : this.turn,
                white : whiteScore,
                black : blackScore
            });

            console.log('Score: White: ', whiteScore, ' black: ', blackScore)
        }

    });
});
