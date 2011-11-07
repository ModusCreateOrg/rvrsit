Ext.define('Othello.view.GamePiece', {
    extend : 'Othello.view.AbstractGamePiece',
    xtype  : 'gamepiece',

    checkAdjacent : function(direction, color, stackObj) {
        var adjacentChip = this.connections[direction];
        if (! adjacentChip || adjacentChip.hidden) {
            return stackObj;
        }

        if (adjacentChip.color != color) {
            stackObj.chipStack.push(this);
            stackObj = adjacentChip.checkAdjacent(direction, color, stackObj);
        }
        else if (adjacentChip.color == color && stackObj.chipStack.length > 1) {
            stackObj.chipStack.push(this);
            stackObj.doFlip = true;
        }

        return stackObj;
    },
    getChipStacks : function() {

        var gameBoard  = this.gameBoard,
            turnColor  = gameBoard.getTurn(),
            chipStacks = [],
            stackObj,
            dir,
            chip;

        for (dir in this.connections) {
            chip = this.connections[dir];

            stackObj = this.checkAdjacent(dir, turnColor, {
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
    onTap  : function() {
        if (! this.hidden) {
            return;
        }
        var chipStacks = this.getChipStacks();
        if (chipStacks.length > 0) {

            this.processChipStacks(chipStacks);
            this.gameBoard.swapTurn();
        }
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
    },
    processChipStacks : function(chipStacks) {
        var duration,
            stack;

        /**
         * TODO :: Convert to generic for loops, to increase speed.
         */
        Ext.each(chipStacks, function(stackObj) {
            stack = stackObj.chipStack.reverse();
            duration = 400;

            Ext.each(stackObj.chipStack, function(chip) {
                chip.flipToColor(stackObj.turnColor, duration);
                duration += 150;
            });
        });
    }
});
