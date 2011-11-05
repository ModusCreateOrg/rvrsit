exports.init = {
    board: null,

    db: undefined,

    socket: undefined,

    freeSpaces: -1,

    constants: {
        BOARD_SIZE: 8,
        FREE: -1,
        WHITE: 0,
        BLACK: 1,
        PATHS: ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']
    },

    /**
     * Init Othello
     */
    init: function() {
        var i, j, len, board, constants = this.constants;

        //Initialize the board state
        board = [];
        for (i=0, len=constants.BOARD_SIZE; i<len; i++) {
            board[i] = [];
            for (j=0; j<len; j++) {
                board[i][j] = constants.FREE;
            }
        }
        this.board = board;

        this.freeSpaces = len * 2;

        console.log("Othello instantiated");
    }

};