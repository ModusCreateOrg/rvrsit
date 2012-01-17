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
            {
                name : 'TweakRAM',
                song : 'SnD_TweakRAM.caff'
            }
        ],
        init: function() {
            var me = this;
            Othello.game = me;

            me.initSound();
            me.initSettings();

            me.loadLevel( LevelTest );
            ig.input.initMouse();

            ig.input.bind(ig.KEY.MOUSE1, 'click');

            me.newGame();
        },

        initSound : function() {
            var me          = this,
                soundRoot   = me.soundRoot,
                settings    = me.getSettings(),
                fxRoot,
                musicRoot;

            if (settings.fx > 0 && ! me.fxInitialized) {
                fxRoot = soundRoot + 'sounds/';
//                debugger;
                var sounds = me.sounds,
                    sound,
                    name;

                for (name in this.sounds) {
                    sound = new ig.Sound(fxRoot + sounds[name], true);
                    sound.volume = settings.fx;
                    sounds[name] = sound;
                }

                me.sounds = sounds;
                me.fxInitialized = true;
            }

            if (settings.music > 0 && ! me.musicInitialized) {
                musicRoot = soundRoot + 'music/';

                Ext.each(this.music, function(song) {
                    ig.music.add(new ig.Sound(musicRoot + song.song));
                });

                ig.music.volume = settings.music;
                ig.music.random = true;

                ig.music.play();

                me.musicInitialized = true;
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
                visible,
                color,
                x,
                y,
                itemId,
                xIndex,
                chip;

            for (; yIndex < boardSize; ++yIndex) {
                row   = [];

                for (xIndex= 0; xIndex < boardSize; ++xIndex) {
                    y       = chipSize * yIndex;
                    x       = chipSize * xIndex;
                    color   = ((xIndex + yIndex) % 2)? black : white;
                    visible = ((xIndex == 3 || xIndex == 4) && (yIndex == 3 || yIndex == 4));
                    itemId  = 'ogp-' + xIndex + '-' + yIndex;

                    chip = ig.game.spawnEntity(EntityChip, x, y, {
                        color  : visible ? color : visible,
                        itemId : itemId,
                        row    : xIndex,
                        col    : yIndex
                    });
//                    debugger;
                    if (visible) {
                        visChips[itemId] = chip;
                    }
                    else {
                        blankChips[itemId] = chip;
                    }

                    allChips[itemId] = chip;
                    row.push(chip);
                }
                chips.push(row);
            }

            this.visChips = visChips;
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
//                console.log(itemId, color);
                if (color == 'white') {
                    whiteScore++;
                }
                else if (color == 'black') {
                    blackScore++;
                }

            }
//            console.log('white', whiteScore, 'black', blackScore)

            Othello.app.fireEvent('scoreupdate', this,  {
                turn  : this.turn,
                white : whiteScore,
                black : blackScore
            });

        },
        playSound : function(sound) {
            var me = this;
            if (me.getSetting('fx')) {
                if (! me.fxInitialized) {
                    this.initSound();
                }
                me.sounds[sound].play();
            }
        },
        setMusicVolume : function(vol) {
            ig.music.volume = vol;
        },
        setFxVolume : function(vol) {
            var sounds = this.sounds;
            for (var key in this.sounds) {
                sounds[key].volume = vol;
            }
        },
        initSettings : function() {
            if (localStorage.getItem('fx') == null) {
                this.applySettings({
                    fx    : .5,
                    music : .5
                });
            }
        },
        applySettings : function(settings) {
            for (var key in settings) {
                localStorage.setItem(key, settings[key]);
            }
        },
        getSetting : function(setting) {
            return localStorage.getItem(setting);
        },
        getSettings : function() {
            return {
                fx    : +this.getSetting('fx'),
                music : +this.getSetting('music')
            }
        },
        registerVisibleChip : function(chip) {
            this.visChips[chip.itemId] = chip;
        },
        clearSettings : function() {
            for (var k in localStorage) {
                delete localStorage[k];
                ig.music.stop();
                ig.music.volume = 0;
            }
        },
        flattenChipStacks : function(originItemId, chipStacks) {
            var chipsToFlip = [],
                duration,
                color,
                stack;

            Ext.each(chipStacks, function(stackObj) {
                stack = stackObj.chipStack;
                duration = 150;
                color = stackObj.turnColor;

                Ext.each(stackObj.chipStack, function(chip) {
                    if (chip.itemId != originItemId) {
                        chipsToFlip.push(chip);
                    }
                });
            });

            return chipsToFlip;

        },
        getRandomIndex : function() {
            return   + Math.floor((Math.random() * Math.random()) * 100).toString()[0];
        },
        findNextMove : function(color) {

            var me = this,
                nextMoves = [],
                visChips  = me.visChips,
                visibleChip,
                itemId,
                region,
                regionalChip,
                chipConnections,
                stacks;

            color = me.turn;

            for (itemId in visChips) {
                visibleChip = visChips[itemId];
                chipConnections = visibleChip.connections;

                for (region in chipConnections) {
                    regionalChip = chipConnections[region];
                    if (! regionalChip.color) {
                        stacks = regionalChip.getChipStacks();
                        if (stacks.length > 0) {
                            nextMoves.push({
                                chip   : regionalChip,
                                stacks : stacks
                            });
                        }

                    }
                }
            }

            // TODO: Push to logic that makes an intelligent decision

            var nextMoveIndex = -1,
                nextMove;
            while (! nextMove) {
                nextMoveIndex = this.getRandomIndex();
                nextMove = nextMoves[nextMoveIndex];
            }

            this.swapTurn();

            nextMove.chipsToFlip = me.flattenChipStacks(nextMove.chip.itemId, nextMove.stacks)
            nextMove.chip.startFlip(color);
            nextMove.chip.processChipStacks(nextMove.stacks);

        }
    });
});
