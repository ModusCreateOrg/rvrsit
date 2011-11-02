othello.Game = function(playerOne, playerTwo) {
	this.board = new othello.Board();
	this.playerOne = playerOne;
	this.playerTwo = playerTwo;
	this.currentPlayer = playerOne;
};

othello.Game.prototype = {

    board: null,
	currentPlayer: null,
	playerOne: null,
	playerTwo: null,

	move: function(x, y, playerId) {
		var result, player = this.getPlayerType(playerId);

		if (playerId === -1) {
			result = this.board.move(x, y, player);
		} else {
			result = this.board.findBestMove(player);
		}

		this.changeCurrentPlayer();

		if (this.board.freeSpaces === 0) {
			result += '\n' + this.calculateWinner() + ' wins!';
			this.canMove = function() {
				return false;
			};
		}

		return result;
	},

	pass: function() {
		this.changeCurrentPlayer();
	},

	canMove: function(playerId) {
		return (playerId === this.currentPlayer);
	},

	changeCurrentPlayer: function(playerId) {
		this.currentPlayer = playerId === this.playerOne ? this.playerTwo : this.playerOne;
	},

	getPlayerType: function(playerId) {
		return playerId === this.playerOne ? Othello.WHITE : Othello.BLACK;
	},

	calculateWinner: function() {
		return this.board.calculateLeader() === Othello.WHITE ? this.playerOne : this.playerTwo;
	}

};