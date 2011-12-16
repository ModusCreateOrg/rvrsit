Ext.define('Othello.controller.GamePiece', {
    extend : 'Ext.app.Controller',

    views : [
        'GamePiece'
    ],
    init: function() {
//        console.log(this.$className);
        this.control({
            gamepiece : {
                gptap : this.onGamePieceTap
            }
        })
    },
    onGamePieceTap : function(gamePiece) {
//        console.log('gamePiece tap', gamePiece);
        var me = this;

        if (! gamePiece.hidden) {
            return;
        }
        var chipStacks = me.getChipStacks(gamePiece);

        if (chipStacks.length > 0) {
            me.processChipStacks(chipStacks);
            me.application.fireEvent('swapturn');
        }
    },
    getChipStacks : function(gamePiece) {

        var gameBoard  = this.getController('Viewport'),
            turnColor  = gameBoard.getTurn(),
            chipStacks = [],
            stackObj,
            dir,
            chip;

        for (dir in gamePiece.connections) {
            chip = gamePiece.connections[dir];
            stackObj = this.checkAdjacent(gamePiece, dir, turnColor, {
                direction      : dir,
                turnColor      : turnColor,
                foundDiffColor : false,
                chipStack      : [chip]
            });
            if (stackObj.doFlip) {
                chipStacks.push(stackObj);
            }
        }
        return chipStacks;
    },

    checkAdjacent : function(gamePiece, direction, color, stackObj) {
        var adjacentChip = gamePiece.connections[direction];
        if (! adjacentChip || adjacentChip.hidden) {
            return stackObj;
        }

        if (adjacentChip.color != color) {
            stackObj.chipStack.push(gamePiece);
            stackObj = this.checkAdjacent(adjacentChip, direction, color, stackObj);
        }
        else if (adjacentChip.color == color && stackObj.chipStack.length > 1) {
            stackObj.chipStack.push(gamePiece);
            stackObj.doFlip = true;
        }

        return stackObj;
    },
    processChipStacks : function(chipStacks) {
        var duration,
            stack;

        chipStacks = chipStacks.reverse();
        /**
         * TODO :: Convert to generic for loops, to increase speed.
         */
        Ext.each(chipStacks, function(stackObj) {
            stack = stackObj.chipStack.reverse();
            duration = 400;

            Ext.each(stackObj.chipStack, function(chip) {
                chip.flipToColor(stackObj.turnColor, duration);
                duration += 250;
            });
        });
    },

    onDrop : function(dropbl, dragbl, evtObj) {
        if (! this.hidden && this.droppable.isDisabled()) {
            return;
        }

        var chipStacks = this.getChipStacks();

        if (chipStacks.length > 0) {
            this.processChipStacks(chipStacks);
            this.gameBoard.swapTurn();
            this.droppable.disable();
        }
    },
    onDropEnter : function(dropbl, dragbl, evtObj) {
        if (! this.hidden && ! this.droppable.isDisabled()) {
            return;
        }

        var chipStacks = this.getChipStacks();

        if (chipStacks.length > 0) {
            // invite drop
//            Ext.anims.flip.run(this.el);
        }
    }


});