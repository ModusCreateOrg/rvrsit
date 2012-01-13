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
        soundRoot : 'node/public/impactjs/media/',


        turn : 'black',
        sounds : {
            badMove : 'bad_move.mp3',
            white   : 'chip_flip_white.mp3',
            black   : 'chip_flip_black.mp3',
            newGame : 'new_game.mp3'
        },
        music : [
            {
                name : 'Truepianos',
                song : 'Truepianos.caff'
            },
//            {
//                name : 'Sixeco',
//                song : 'media/music/Sixeco.caff'
//            },
            {
                name : 'TweakRAM',
                song : 'SnD_TweakRAM.caff'
            }
        ],
        init: function() {
            var me = this;
            me.initSounds();

            Othello.game = me;


            me.loadLevel( LevelTest );
            ig.input.initMouse();

            ig.input.bind(ig.KEY.MOUSE1, 'click');

            me.newGame();
        },
        checkSetting : function(setting) {
            return localStorage.getItem(setting) != 'off';
        },
        initSounds : function() {
//            debugger;
            var me           = this,
                soundRoot    = me.soundRoot,
                fxEnabled    = me.checkSetting('fx'),
                musicEnabled = me.checkSetting('music'),
                fxRoot,
                musicRoot;

            if (fxEnabled) {
                fxRoot       = soundRoot + 'sounds/';
                var sounds = this.sounds,
                    sound,
                    name;

                for (name in this.sounds) {
                    sound = sounds[name];
                    sounds[name] = new ig.Sound(fxRoot + sound, true);
                    sounds[name].play();
                }

                this.sounds = sounds;
            }

            if (musicEnabled) {
                musicRoot    = soundRoot + 'music/';

                Ext.each(this.music, function(song) {
                    ig.music.add(new ig.Sound(musicRoot + song.song));
                });
                ig.music.random = true;

                ig.music.play();
            }
        },
        newGame : function() {
            var me      = this,
                myChips = this.allChips;

            if (myChips) {
                for (var chip in myChips) {
                    me.removeEntity(myChips[chip]);
                }
            }
            me.chips = me.buildChips();
            me.turn  = 'black'; // TODO: fix
            me.swapTurn();
            me.calcScore();
            this.playSound('newGame');
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
//            console.log(this.turn + "'s turn");
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

//            console.log('Score: White: ', whiteScore, ' black: ', blackScore)
        },
        playSound : function(sound) {
            var me = this;
            if (me.checkSetting('fx')) {
                this.sounds[sound].play();
            }

        }

    });
});
