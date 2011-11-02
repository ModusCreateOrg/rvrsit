othello.Board = function() {
    var x, y, len, board;

    //Initialize the board state
    board = [];
    for (x=0, len=othello.BOARD_SIZE; x<len; x++) {
        board[x] = [];
        for (y=0; y<len; y++) {
            board[x][y] = othello.FREE;
        }
    }
    this.board = board;
};

othello.Board.prototype = {

    board: null,

    freeSpaces: othello.BOARD_SIZE * 2,

	/**
	 * Calculates whether white or black has more pieces in play
	 *
	 * @return othello.WHITE || othello.BLACK
	 */
	calculateLeader: function() {
		var white = 0, black = 0, x, y, len;

        for (x=0, len=othello.BOARD_SIZE; x<len; x++) {
            for (y=0; y<len; y++) {
				if (this.board[x][y] === othello.WHITE) {
					white++;
				} else if (this.board[x][y] === othello.BLACK) {
					black++;
				}
            }
        }

		return white > black ? white : black;
	},

	/**
	 * Finds the best possible move by determing for each open space
	 * which one will yield the highest number of changes for the
	 * player. It does not attempt to think about counter or future
	 * moves.
	 *
	 * @param {Number} player - othello.WHITE || othello.BLACK
	 * @return {Object} Returns an object containing the board state,
	 *     whether the move was successful and a message.
	 */
    findBestMove: function(player) {
        var spacesChanged = 0, maxChanged = 0, maxChangedPosition, x, y, len, message;

        for (x=0, len=othello.BOARD_SIZE; x<len; x++) {
            for (y=0; y<len; y++) {
				if (this.board[x][y] === othello.FREE) {
					spacesChanged = this.checkPaths(othello.PATHS, x, y, player, true);
					if (spacesChanged > maxChanged) {
						maxChanged = spacesChanged;
						maxChangedPosition = [x, y];
					}
				}
            }
        }

		if (maxChangedPosition !== undefined) {
			this.setPosition(maxChangedPosition[0], maxChangedPosition[1], player);
			message = spacesChanged + 'spaces changed';
		} else {
			message = 'No moves found';
		}

		return {
			board: this.board,
			success: true,
			message: message
		};
    },

	/**
	 * Either makes or simulates a specific move
	 *
	 * @param {Number} x The x position of the move
	 * @param {Number} y The y position of the move
	 * @param {Number} player othello.WHITE || othello.BLACK
	 * @param {Boolean} simulate Specify true to force no action to be taken (preview result only)
	 * @return {Object} Returns an object containing the board state,
	 *     whether the move was successful and a message.
	 */
    move: function(x, y, player, simulate) {
        var success, message, spacesChanged;

        message = this.validateMove(x, y, player);
        if (message === undefined) {
            spacesChanged = this.checkPaths(othello.PATHS, x, y, player, simulate);
        }

        if (spacesChanged > 0 && !simulate) {
            this.setPosition(x, y, player);
			message = spacesChanged + ' spaces changed';
        }

        return {
            board: this.board,
            success: true,
            message: message
        };
    },

    validateMove: function(x, y, player) {
        if (x > this.boardSize || y > this.boardSize || x < 0 || y < 0) {
            return "Invalid position: position must be less than board size and greater than zero";
        } else if (player !== othello.BLACK || player !== othello.WHITE) {
            return "Invalid player: must be either "+othello.WHITE+" (WHITE) or "+othello.BLACK+" (BLACK).";
        } else if (this.board[x][y] !== othello.FREE) {
            return "Invalid position: position is already taken.";
        }
    },

    checkPaths: function(directions, x, y, player, simulate) {
        var i, len, spacesChanged = 0;
        for (i=0, len=directions.length; i<len; i++) {
			spacesChanged += this.checkPath(directions[i], x, y, player, simulate);
        }
        return spacesChanged;
    },

    checkPath: function(direction, x, y, player, count, simulate) {
        var nextPosition, nextState, spacesChanged = 0;

        nextPosition = this.getNextPosition(direction, x, y);

        if (nextPosition !== null) {
            nextState = this.board[next[0], next[1]];

			// If this is the first space to check, it must be the opposite color to be valid
        	if (!count) {
                if (nextState !== othello.FREE && nextState !== player) {
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
                if (nextState !== player && nextState !== othello.FREE) {
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
        if (!!simulate) {
            this.board[x][y] = player;
            this.freeSpaces--;
        }
    }

};