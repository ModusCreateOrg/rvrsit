exports.movement = {
     doMove: function(socket, data) {
        var db      = this.getDb(),
            success = false,
            x       = data.x,
            y       = data.y,
            player  = data.player,
            Othello = this,//this.getParent(),
            me      = this,
            regPlyr = Othello.user.getCurrentPlayer(socket),
            message,
            record,
            result,
            spacesChanged;

        if (!regPlyr) {return me.reportError(socket, 'E10100');}
        Othello.session.getActive(socket, function(err, game) {
            if (!game) {return me.reportError(socket, 'E11001');}

            console.log(data, me.board[x][y], me.validateMove(x, y, player));

            success = me.validateMove(x, y, player);
            if (success === true) {
                me.setPosition(x, y, player);
                spacesChanged = me.checkPaths(Othello.constants.PATHS, x, y, player, data.simulate);

                record = new db.Log({
                    ts      : new Date(),
                    player	: player,
                    x       : String,
                    y    	: String,
                    board   : me.board
                });

                record.save();
                console.log(me.board);
             }

            result = {
                board   : me.board,
                success : success,
                message : message
            };

            socket.emit('moveConfirmation', result);
        });

        //this.getSocket().emit('moveConfirmation', result);

       // return this.apply(result,{record: record});
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

    checkPaths: function(directions, x, y, player, simulate) {
        var i, len, spacesChanged = 0;
        for (i=0, len=directions.length; i<len; i++) {
			spacesChanged += this.checkPath(directions[i], x, y, player, simulate);
        }
        return spacesChanged;
    },

    checkPath: function(direction, x, y, player, count, simulate) {
        var next, nextState, spacesChanged = 0;

        next = this.getNextPosition(direction, x, y);

        if (next !== null) {
            nextState = this.board[next[0], next[1]];

			// If this is the first space to check, it must be the opposite color to be valid
        	if (!count) {
                if (nextState !== this.constants.FREE && nextState !== player) {
                    // It's valid so, recurse until it returns true or false
                    spacesChanged = this.checkPath(direction, next[0], next[1], player, 1);
                    if (spacesChanged !== 0) {
                        this.setPosition(next[0], next[1], player, simulate);
                        spacesChanged++;
                    }
                }
        	// If it's not, the next space cannot be free. If it's the opposite color, we
        	// continue checking until we find a matching color. If it's the matching color,
        	// we are done and it's valid.
        	} else {
                if (nextState !== player && nextState !== this.constants.FREE) {
                    spacesChanged = this.checkPath(direction, next[0], next[1], simulate);
                    if (spacesChanged !== 0) {
                        this.setPosition(next[0], next[1], player, simulate);
                        spacesChanged++;
                    }
                }
            }
        }

        return spacesChanged;
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

    setPosition: function(x, y, player, simulate) {
        if (!simulate) {
            this.board[x][y] = player;
            this.freeSpaces--;
        }
    }
};