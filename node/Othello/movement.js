exports.movement = {
     doMove: function(data) {
        var db      = this.getDb(),
            success = false,
            x       = data.x,
            y       = data.y,
            player  = data.player,
            message,
            record,
            result;

        console.log(data);

        message = this.validateMove(x, y, player);
        if (message === true) {
            success = this.checkPaths(this.constants.PATHS, x, y, player);
        }

        if (success) {
            this.setPosition(x, y, player);
        }

         // save to db
         if (success) {
             record = new db.Log({
                ts      : new Date(),
                player	: player,
                x       : String,
                y    	: String,
                board   : this.board
            });

            record.save();
         }

        result = {
            board   : this.board,
            success : success,
            message : message
        };

        this.getSocket().emit('moveConfirmation', result);

        return this.apply(result,{record: record});
    },

    validateMove: function(i, j, player) {
        if (i > this.boardSize || j > this.boardSize || i < 0 || j < 0) {
            return "Invalid position: position must be less than board size and greater than zero";
        } else if (player !== this.constants.BLACK && player !== this.constants.WHITE) {
            return "Invalid player: must be either "+this.constants.WHITE+" (WHITE) or "+this.constants.BLACK+" (BLACK), current value is " + player;
        } else if (this.board[i][j] !== this.constants.FREE) {
            return "Invalid position: position is already taken.";
        }
        return true;
    },

    /**
     * TODO
     * Check history of moves from db. Should probably store board hash for each move.
     */
    undoMove: function() {},

    checkPaths: function(directions, x, y, player) {
        var i, len, valid = false;
        for (i=0, len=directions.length; i<len; i++) {
            if (this.checkPath(directions[i], x, y, player)) {
                valid = true;
            }
        }
        return valid;
    },

    checkPath: function(direction, x, y, player, count) {
        var nextPosition, nextState;

        // If this is the first space to check, it must be the opposite color to be valid
        if (!count) {
            nextPosition = this.getNextPosition(direction, x, y);
            if (nextPosition !== null) {
                nextState = this.board[nextPosition[0], nextPosition[1]];
                if (nextState !== this.constants.FREE && nextState !== player) {
                    // It's valid so, recurse until it returns true or false
                    if (this.checkPath(direction, nextPosition[0], nextPosition[1], player, 1)) {
                        this.setPosition(nextPosition[0], nextPosition[1], player);
                        return true;
                    }
                }
            }
            return false;
        // If it's not, the next space cannot be free. If it's the opposite color, we
        // continue checking until we find a matching color. If it's the matching color,
        // we are done and it's valid.
        } else {
            nextPosition = this.getNextPosition(direction, x, y);
            if (nextPosition === null) {
                return false;
            } else {
                nextState = this.board[nextPosition[0], nextPosition[1]];
                if (nextState === player) {
                    return true;
                } else if (nextState === this.constants.FREE) {
                    return false;
                } else if (this.checkPath(direction, nextPosition[0], nextPosition[1], ++count)) {
                    this.setPosition(nextPosition[0], nextPosition[1], player);
                    return true;
                }
            }
        }
    },

    getNextPosition: function(direction, x, y) {
        var boardSize = this.boardSize-1;

        switch (direction) {
            case 'n'  : return y<boardSize ? [x, y+1] : null;
            case 'ne' : return x<boardSize && y<boardSize ? [x+1, y+1] : null;
            case 'e'  : return x<boardSize ? [x+1, y] : null;
            case 'se' : return x<boardSize && y > 0 ? [x+1, y-1] : null;
            case 's'  : return y > 0 ? [x, y-1] : null;
            case 'sw' : return y > 0 && x > 0 ? [x-1, y-1] : null;
            case 'w'  : return x > 0 ? [x-1, y] : null;
            case 'nw' : return x > 0 && y < boardSize ? [x-1, y+1] : null;
        }
    },

    setPosition: function(x, y, player) {
        this.board[x][y] = player;
        this.freeSpaces--;
    }
};