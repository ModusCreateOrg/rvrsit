exports.util = {

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
                fn && fn.apply(scope, bindArgs.concat(args));
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
             var i, param;

             for (i in config) {
                 param = config[i];
                 if (param && typeof param === 'object') {
                     param.getParent = function() {return object;}
                 }
                 object[i] = param;
             }
         }
         return object;
    },

    /**
     * Apply events in config to object
     * Config uses key (event name) and value (callback) pair
     * TODO: easier scoping
     * @param object
     * @param config
     */
    applyEvents: function(object, config) {
         if (object && config && typeof config === 'object') {
             var i;

             for (i in config) {
                 object.on(i,config[i]);
             }
         }
         return object;
    },

    /**
     * Unified error reporting method
     * @param socket {Object} User's socket instance
     * @param code {String} Error code (listed in codes {Object})
     * @param callbackFn {Function} client-side callback function
     * @param params {Array} params to apply to callback function
     */
    reportError: function(socket, code, callbackFn, params) {
        var codes = {
                // disconnected
                E10001: 'Disconnected due to inactivity, or cookie has expired.',
                E10002: 'Disconnected for not behaving.',
                E10003: 'Disconnected for cheating.',

                // session related
                E10100: 'You are not logged in. Hacker fucker!',

                // game related
                E11000: 'Dude, finish your game first.',
                E11001: 'You should start a game before making a move.',

                // registration
                E12000: 'User is missing email address.',
                E12001: 'User is missing password.',
                E12002: 'Passwords do not match.',

                //auth
                E12500: 'Invalid credentials.',

                // Event (socket) related
                E13000: 'Invalid event call. Method does not exist.'
            },
            error = codes[code] || 'Unknown error';

        socket.emit('error', {msg: error, code: code, callbackFn: callbackFn, params: params});
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
    }
};