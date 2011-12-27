exports.events = {
    /**
     * Keep browser session alive while socket is connected
     * @param socket
     */
    sessionKA: function(socket) {
        var hs = socket.handshake;
        // setup an interval that will keep our session fresh
        var intervalID = setInterval(function () {
            hs.session.reload( function () {
                try {hs.session.touch().save();} catch (e) {} //sometimes it fails. What then? the originalMaxAge of undefined bug
            });
        }, 60 * 1000);
        socket.on('disconnect', function () {
            clearInterval(intervalID);
        });

        return hs.sessionID;
    },

    /**
     * Only a safety mechanism on global app level
     * Will tell user to restart browser on exception
     * TODO: automatically restart socket conn or browser (on client side)
     * @param socket
     */
    catchUncaughtExceptions: function(socket) {
        process.on('uncaughtException', function (err) {
            console.log('Uncaught!', err.stack);
            if (socket) {
                // temporarily disabled socket.emit('respawn', true);
                // only for dev debugging, does not go through this.errorReport right now
                socket.emit('error', {msg:'Uncaught exception. Please restart!', error: err});
            }
        });
    },

    registerSocketEvents : function(socket) {
        var me  = this,
            sid = me.sessionKA(socket); // browser session id

        me.catchUncaughtExceptions(socket);
        
        // register socket instance to the current user and browser session
        me.user.reg(socket, sid);

        socket.emit('connected', true);

        this.applyEvents(socket, {
            'hi'                : function(data) {me.hi(socket, data)},
            'move'              : function(data) {me.doMove(socket, data);},
            'registerPlayer'    : function(data) {
                                    me.player.add(socket, data, function(err, doc) {
                                        socket.emit('playerRegistered', doc);
                                        me.user.bindToPlayer(socket, doc, sid);
                                    })
                                  },
            'whoami'            : function() {
                                        var user = me.user.get(socket.id);
                                        socket.emit('whour',user.player);
                                  },
            'yell'              : function() {
                                        socket.emit('disconnect', 'You just got disconnected for having such an attitude. Cool down and come back again.');
                                        me.user.disconnect(socket);
                                  },
            'startNewSession'   : function(data) {me.session.create(data, socket);},

            'continueSession'   : function(data) {me.session.resume(data, socket);},

            /**
             * Whose turn is it?
             * Which color is the player making move?
             * Validate move
             * Execute move
             * Return new board layout or just success?
             */
            'tapBoard'          : function(data) {
                                    //data.player = me.getCurrentPlayer(socket);
                                    //force this to white for now
                                    if (data.player==undefined) data.player = 1;
                                    var result = me.doMove(socket,data);
                                    socket.emit('moveResult', result);
                                  },

            'auth'              : function(data) {me.auth(socket,data)},

            'registerUser'      : function(data) {me.player.register(socket,data)},

            /**
             * Main socket listener
             */
            'othello'           : function(data) {me.parseCall(socket,data)}
        });
    },

    parseCall: function(socket,data) {
        var me      = this,
            event   = data.event;

        // if no event property or function with event name does not exist
        if (!event || !this[event]) {
            return Othello.reportError(socket, 'E13000');
        }

        this[event].call(this, socket, data);
    },

    registerUser: function(socket, data) {
        this.player.register(socket,data.data);
    },

    auth: function(socket,eventData) {
        this.player.auth(eventData.data, function(data) {
            socket.emit('othello', 'auth', data);
        });
    },

    testEvents: function(socket, data) {
        socket.emit('othello', 'testEvents', {gay: 'Fucker'});
    },
    /**
     * Test method
     * @param data
     */
    hi: function(socket, data) {
        var me = this;

        socket.emit('hi back', data + ', bitch');

        socket.emit('hi back', me.getDb());
    }


};