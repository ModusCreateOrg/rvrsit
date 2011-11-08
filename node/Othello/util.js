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