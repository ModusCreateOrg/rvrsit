ig.module(
    'game.main'
)
    .requires(
    'impact.game',
    'impact.font',

    'game.entities.chip',
    'game.levels.main'
)
.defines(function() {

MyGame = ig.Game.extend({
    boardSize     : 100,
    soundRoot     : 'media/',
    computerColor : 'white',
    turn          : 'black',
    mode          : 'double', // two player
    sounds        : {
        badMove : 'bad_move.mp3',
        white   : 'chip_flip_white.mp3',
        black   : 'chip_flip_black.mp3',
        newGame : 'new_game.mp3'
    },
    music         : [
        {
            name : 'Truepianos',
            song : 'Truepianos.caff'
        },
        {
            name : 'TweakRAM',
            song : 'SnD_TweakRAM.caff'
        }
    ],
    init          : function() {
        var me = this;

        me.initSound();
        me.initSettings();

        me.loadLevel(LevelMain);
        ig.input.initMouse();

        ig.input.bind(ig.KEY.MOUSE1, 'click');

        Rvrsit.app.fireEvent('gameInitialized', me);
    },

    initSound : function() {
//        return;
        var me = this,
            soundRoot = me.soundRoot,
            settings = me.getSettings(),
            fxRoot,
            musicRoot;

        if (settings.fx > 0 && !me.fxInitialized) {
            fxRoot = soundRoot + 'sounds/';

            var sounds = me.sounds,
                sound,
                name;

            for (name in this.sounds) {
                sound = new ig.Sound(fxRoot + sounds[name], false);
                sound.volume = settings.fx;
                sounds[name] = sound;
            }

            me.sounds = sounds;
            me.fxInitialized = true;
        }

        if (settings.music > 0 && !me.musicInitialized) {
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
    newGame   : function() {
        var me = this,
            myChips = this.allChips;

        if (myChips) {
            for (var chip in myChips) {
                me.removeEntity(myChips[chip]);
            }
        }
        me.chips = me.buildChips();
        me.turn = 'white';

        me.swapTurn();
        me.calcScore();
        me.playSound('newGame');

        me.halt = false;
    },
    update    : function() {
        // Update all entities and backgroundMaps
        this.parent();

        // Add your own, additional update code here
    },

    draw                    : function() {
        // Draw all entities and backgroundMaps
        this.parent();
    },
    buildChips              : function() {
        var blankChips = {},
            visChips = {},
            chips = [],
            allChips = {},
            yIndex = 0,
            boardSize = 10,
            chipSize = 55,
            black = 'black',
            white = 'white',
            row,
            visible,
            color,
            x,
            y,
            itemId,
            xIndex,
            chip;

        for (; yIndex < boardSize; ++yIndex) {
            row = [];

            for (xIndex = 0; xIndex < boardSize; ++xIndex) {
                y = (chipSize * yIndex) + 5;
                x = (chipSize * xIndex) + 3;

                if (xIndex == boardSize - 1) {
                    x--;
                }
                if (yIndex == boardSize - 1) {
                    y--;
                }

                color = ((xIndex + yIndex) % 2) ? black : white;
                visible = ((xIndex == 4 || xIndex == 5) && (yIndex == 4 || yIndex == 5));
                itemId = 'ogp-' + xIndex + '-' + yIndex;

                chip = ig.game.spawnEntity(EntityChip, x, y, {
                    color  : visible ? color : visible,
                    //                        color  : color,
                    itemId : itemId,
                    row    : xIndex,
                    col    : yIndex
                });

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

    initPositionalAwareness : function(chip) {
        var row = chip.row,
            col = chip.col,
            max = 9;

        // for debugging
//        chip.isEdgePiece = (col === 0 || col === 9 || row === 0 || row === 9);

        chip.connections = {};

        if (col === 0) {
            if (row === 0) {
                this.setConnections(chip, 'e', row, col);
                this.setConnections(chip, 'se', row, col);
                this.setConnections(chip, 's', row, col);
            }
            else if (row === max) {
                //S, SW, W
                this.setConnections(chip, 's', row, col);
                this.setConnections(chip, 'sw', row, col);
                this.setConnections(chip, 'w', row, col);
            }
            else {
                // W, SW, S, SE, E
                this.setConnections(chip, 'e', row, col);
                this.setConnections(chip, 'se', row, col);
                this.setConnections(chip, 's', row, col);
                this.setConnections(chip, 'sw', row, col);
                this.setConnections(chip, 'w', row, col);
            }

        }
        else if (col > 0 && col < max) {
            if (row === 0) {
                // N, NE, E, SE, S
                this.setConnections(chip, 'n', row, col);
                this.setConnections(chip, 'ne', row, col);
                this.setConnections(chip, 'e', row, col);
                this.setConnections(chip, 'se', row, col);
                this.setConnections(chip, 's', row, col);
            }
            else if (row === max) {
                // N, S, SW, W, NW
                this.setConnections(chip, 's', row, col);
                this.setConnections(chip, 'sw', row, col);
                this.setConnections(chip, 'w', row, col);
                this.setConnections(chip, 'nw', row, col);
                this.setConnections(chip, 'n', row, col);
            }
            else {
                // All coords
                this.setConnections(chip, 'n', row, col);
                this.setConnections(chip, 'ne', row, col);
                this.setConnections(chip, 'e', row, col);
                this.setConnections(chip, 'se', row, col);
                this.setConnections(chip, 's', row, col);
                this.setConnections(chip, 'sw', row, col);
                this.setConnections(chip, 'w', row, col);
                this.setConnections(chip, 'nw', row, col);
            }

        }
        else if (col === max) {
            if (row === 0) {
                // N, NE, E
                this.setConnections(chip, 'n', row, col);
                this.setConnections(chip, 'ne', row, col);
                this.setConnections(chip, 'e', row, col);
            }
            else if (row === max) {
                // N, W, NW
                this.setConnections(chip, 'n', row, col);
                this.setConnections(chip, 'w', row, col);
                this.setConnections(chip, 'nw', row, col);
            }
            else {
                // N, NE, E, W, NW
                this.setConnections(chip, 'n', row, col);
                this.setConnections(chip, 'ne', row, col);
                this.setConnections(chip, 'e', row, col);
                this.setConnections(chip, 'w', row, col);
                this.setConnections(chip, 'nw', row, col);
            }
        }
    },
    setConnections          : function(chip, position, x, y) {
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
    sayTurn                 : function() {
        this.calcScore();
    },
    swapTurn                : function() {
        var oldTurn = this.turn;
        this.turn = (oldTurn == 'white') ? 'black' : 'white';

        return oldTurn;
    },
    getScore                : function() {
        var allChips = this.allChips,
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

        return {
            turn  : this.turn,
            white : whiteScore,
            black : blackScore
        }
    },
    calcScore               : function() {
        Rvrsit.app.fireEvent('scoreupdate', this, this.getScore());
    },
    playSound               : function(sound) {
//        return;
        var me = this;
        if (me.getSetting('fx')) {
            if (!me.fxInitialized) {
                this.initSound();
            }
            me.sounds[sound].play();
        }
    },

    setMode : function(mode) {
        this.mode = mode || 'single';
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

    getSetting  : function(setting) {
        return localStorage.getItem(setting);
    },

    //TODO: get ALL settings, not just this hard-coded stuff
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

    flattenChipStacks : function(chipStacks) {
        var chipsToFlip = [],
            stack;

        Ext.each(chipStacks, function(stackObj) {
            stack = stackObj.chipStack;

            Ext.each(stackObj.chipStack, function(chip) {
                chipsToFlip.push(chip);
            });
        });

        return chipsToFlip;

    },

    getRandomIndex : function() {
        return  +Math.floor((Math.random() * Math.random()) * 100).toString()[0];
    },

    nextMove      : function() {
        var me = this,
            app = Rvrsit.app,
            currentTurn = me.turn,
            computerColor = me.computerColor,
            nextMoves = me.findNextMoves(currentTurn),
            nextMoveIndex = -1,
            numVisibleChips = Object.keys(me.visChips).length,
            nextMove;

        if (nextMoves.length < 1) {
            // are all chips visible?
            if (numVisibleChips == me.boardSize) {
                // if so, calc score  & end game!
                me.halt = true;
                Rvrsit.app.fireEvent('endgame', this, this.getScore());
                return;
            }
            else /*if(currentTurn != computerColor)*/ {
                // Count the chips.  Are all black or white?
                var score = me.getScore();
                // if so, end game
                if (score.white == 0 || score.black == 0) {
                    app.fireEvent('winner', this, currentTurn, score[currentTurn]);
                    me.halt = true;
                    return;
                }
                app.fireEvent('nomoves', this, currentTurn);

            }

        }

        if (me.halt) {
            return;
        }

        if (currentTurn != computerColor || this.mode != 'single') {
            return;
        }

        // TODO: Game difficulty mode
        // Random choosing
        var chooseRandomMove = function() {
            while (!nextMove) {
                nextMoveIndex = me.getRandomIndex();
                nextMove = nextMoves[nextMoveIndex];
            }
        };

        //            debugger;
        // hard
        var moveIdx = 0,
            flattenedStack,
            potentialMove,
            moveCount = 0;

        for (; moveIdx < nextMoves.length; moveIdx++) {
            potentialMove = nextMoves[moveIdx];
            flattenedStack = me.flattenChipStacks(potentialMove.stacks);
            if (flattenedStack.length > moveCount) {
                nextMove = potentialMove;
            }
        }

        if (!nextMove) {
            return;
        }

        me.swapTurn();

        var chipsToFlip = me.flattenChipStacks(nextMove.stacks);

        nextMove.chip.startFlip(currentTurn);
        nextMove.chip.processChipStacks(currentTurn, chipsToFlip);


        // debug stuff
        var chipItemIds = [];

        Ext.each(chipsToFlip, function(chip, index) {
            chipItemIds[index] = chip.itemId;
        });

        Rvrsit.app.fireEvent('chipFlips', {
            turnColor   : currentTurn,
            chipItemIds : chipItemIds
        });
    },
    findNextMoves : function(color) {

        var me = this,
            nextMoves = [],
            visChips = me.visChips,
            visibleChip,
            itemId,
            region,
            regionalChip,
            chipConnections,
            stacks;

        color = me.turn;

        for (itemId in visChips) {
            visibleChip = visChips[itemId];
            if (visibleChip.color != color) {
                chipConnections = visibleChip.connections;

                for (region in chipConnections) {
                    regionalChip = chipConnections[region];
                    if (!regionalChip.color) {
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
        }

        return nextMoves;

    },
    playSelf      : function() {
        //            if (this.halt) {
        //                return;
        //            }
        var fn = Ext.Function.bind(function() {
            this.nextMove();
            setTimeout(fn, 1500);
        }, this);
        setTimeout(fn, 1500);
    },
    forceFlipChips : function(data) {
        console.log('forceFlipChips', data);
        var me         = this,
            totalChips = data.chipItemIds.length,
            duration   = 150,
            color      = data.turnColor,
            allChips   = me.allChips,
            itemIds    = data.chipItemIds,
            chip;

        me.wasClicked = true;
//        this.isFlipping = true;

        Ext.each(itemIds, function(itemId, index) {
            chip = allChips[itemId];
            console.log('chip', chip);
            if (index == totalChips) {
                chip.isLast = true;
            }

            var fn = Ext.Function.bind(chip.startFlip, chip, [color]);
            setTimeout(fn, duration);
            duration += 150;
        });

    }
});
});
