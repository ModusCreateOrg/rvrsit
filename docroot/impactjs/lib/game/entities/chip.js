ig.module(
    'game.entities.chip'
)
.requires (
    'impact.entity'
)
.defines(function() {
    var flipBlack = [0,1,2,3,4,5,6,7,8,9,10,11],
        flipWhite = [11,10,9,8,7,6,5,4,3,2,1,0],
        black     = 'black',
        white     = 'white';

    EntityChip = ig.Entity.extend({

        animSheet : new ig.AnimationSheet('media/images/chip-sprite.png', 48,48),
        collides  : ig.Entity.COLLIDES.NEVER,
        size      : {
            x : 48,
            y : 48
        },


        init : function(x,y,settings) {
            var me = this;
            me.parent(x,y,settings);

            me.addAnim('flip_black', .03, flipBlack, true);
            me.addAnim('flip_white', .03, flipWhite, true);

            me.addAnim('flip_blank', .08, [flipBlack.length], true);

            me.currentAnim = me.anims['flip_' + me.color];
        },
        update : function() {
            var me = this,
                game = Rvrsit.game;

            // is not animating && the event type is click
            if (!me.color && ! me.animating && ig.input.pressed('click')) {
                if (game.isFlipping) {
                    return;
                }

                if (me.isItemClicked()) {
                    var adjacentChipStacks =  me.getChipStacks();
                    if (adjacentChipStacks.length == 0) {

                        Rvrsit.game.playSound('badMove');

                        return;
                    }
                    me.adjacentChipStacks = adjacentChipStacks;
                    me.wasClicked = true;
                    game.isFlipping = true;
                    me.startFlip();
                }
            }

            if (me.animating && me.currentAnim.loopCount > 0) {
                me.endFlip();
            }
            me.parent();
        },
        startFlip : function(color) {
            var me       = this,
                game     = Rvrsit.game,
                newColor = color || game.swapTurn();

            me.animating = true;
            me.newColor  = newColor;

            if (! me.color) {
                me.wasBlank = true;
            }

            game.playSound(newColor);

            me.currentAnim = me.anims['flip_' + newColor];
            me.currentAnim.rewind();


            if (me.adjacentChipStacks) {
                var stacks = me.adjacentChipStacks;
                delete me.adjacentChipStacks;
//                console.log('me.adjacentChipStacks = ', stacks);
                me.processChipStacks(stacks);
            }
            game.calcScore();
        },
        endFlip : function() {
            var me = this,
                game = Rvrsit.game;

            me.color = me.newColor;
            if (me.wasBlank) {
                delete me.wasBlank;
                me.currentAnim = me.anims['flip_' + (me.color == black ? black : white)];
            }

            me.animating = false;
            if (me.wasClicked) {
                delete me.wasClicked;
                game.sayTurn();
            }

            if (me.isLast) {
                delete me.isLast;
                game.isFlipping = false;
                game.nextMove();
            }
            game.registerVisibleChip(me);


        },
        isItemClicked : function() {
            // TODO: Add turn checking
            var me       = this,
                igInput  = ig.input,
                igMouse  = igInput.mouse,
                thisPos  = me.pos,
                thisSize = me.size,
                five     = 5,
                mouseY   = igMouse.y,
                mouseX   = igMouse.x,
                posX     = thisPos.x,
                posY     = thisPos.y,
                sizeY    = thisSize.y,
                sizeX    = thisSize.x,
                boundY   = mouseY >= (posY + five) && mouseY <= (sizeY - five) + posY,
                boundX   = mouseX >= (posX + five) && mouseX <= (sizeX - five) + posX;

            return (boundY && boundX);
        },

        checkAdjacent : function(direction, flipToColor, stackObj) {
            var adjacentChip = this.connections[direction];

            if (! adjacentChip || ! adjacentChip.color) {
                return stackObj;
            }

//            debugger;
            if (adjacentChip.color != flipToColor) {
                stackObj.chipStack.push(this);
                stackObj = adjacentChip.checkAdjacent(direction, flipToColor, stackObj);
            }
            else if (adjacentChip.color == flipToColor && stackObj.chipStack.length > 0) {
                stackObj.chipStack.push(this);
                stackObj.doFlip = true;
            }

            return stackObj;
        },
        getChipStacks : function(color) {

            var me = this,
                turnColor  = color || Rvrsit.game.turn,
                chipStacks = [],
                stackObj,
                dir,
                chip;

            for (dir in this.connections) {

                chip = this.connections[dir];
                if (chip.color && chip.color != me.color) {
                    stackObj = this.checkAdjacent(dir, turnColor, {
                        direction : dir,
                        turnColor : turnColor,
                        chipStack : []
                    });
                    if (stackObj.doFlip) {
                        chipStacks.push(stackObj);
                    }
                }

            }

            return chipStacks;
        },
        processChipStacks : function(chipStacks) {

            var game        = Rvrsit.game,
                myItemId    = this.itemId,
                chipsToFlip = game.flattenChipStacks(chipStacks),
                totalChips  = chipsToFlip.length - 1,
                duration    = 150,
                color       = chipStacks[0].turnColor;

            Ext.each(chipsToFlip, function(chip, index) {
                if (chip.itemId != myItemId) {
                    if (index == totalChips) {
                        chip.isLast = true;
                    }
                    var fn = Ext.Function.bind(chip.startFlip, chip, [color]);
                    setTimeout(fn, duration);
                    duration += 150;
                }
            });

        }

    });
});


