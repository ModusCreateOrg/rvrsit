var movement    = require('./movement').movmement,
    events     = require('./events').events,
    players     = require('./players').players,
    sessions    = require('./sessions').sessions,
    users       = require('./users').users;

Othello = {

    /**
     * Util function that helps attach scope to event listeners
     * @param fn
     * @param scope
     */
    bind: function bind(fn, scope) {
          var bindArgs = Array.prototype.slice.call(arguments);
          bindArgs.shift();
          bindArgs.shift();

          return function() {
                var args = Array.prototype.slice.call(arguments);
                fn.apply(scope, bindArgs.concat(args));
          };
    },

    /**
     * Similar to Ext.apply
     *
     * @param object
     * @param config
     * @param defaults
     */
    apply: function(object, config, defaults) {
         if (defaults) {
             Othello.apply(object, defaults);
         }

         if (object && config && typeof config === 'object') {
             var i;

             for (i in config) {
                 object[i] = config[i];
             }

         }

         return object;
    }
};

 /**
  * General setup
  */
Othello.apply(Othello,{
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
    },

    /**
     * Saves db instance
     * Used in app.js
     * @param database
     */
    setDb: function(database) {
        this.db = database;
    },

    getDb : function() {
        return this.db;
    },

    getSocket : function() {
        return this.socket;
    }
    
}).init();

Othello.apply(Othello, events);
Othello.apply(Othello, movement);
Othello.apply(Othello, players);
Othello.apply(Othello, sessions);
Othello.apply(Othello, users);

exports.Othello = Othello;




 /*
  NOTICE:
    all query callbacks have params:
        err
        doc(s)
*/