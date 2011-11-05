exports.sessions = {
    sessionAdd: function(data, cb, scope) {
        var db = this.getDb(),
            session;

        scope = scope || this;
        
        session = new db.Session(this.apply({
            state : 2
        }, data));

        session.save(this.bind(cb, scope));
    },

    sessionGet: function(id, cb, scope) {
        var db      = this.getDb(),
            session  = db.Session;

        scope = scope || this;

        session.findById(id, this.bind(cb, scope));
    },

    sessionsList: function(query, cb, scope) {
        var db      = this.getDb(),
            session  = db.Session;

        scope = scope || this;

        session.find(query, this.bind(cb, scope));
    },

    /**
     * TODO: don't allow creating sessions if there is one already created
     * @param data
     * @param socket
     */
    sessionCreate: function(data, socket, safe) {
        var me      = this,
            player  = me.getCurrentPlayer(socket);

        if (!player) {
            return socket.emit('error', 'You are not logged in. Hacker fucker!');
        }

        me.sessionGetActive(socket, function(err,doc) {
            if (!doc) {
                me.sessionAdd({
                    started : new Date(),
                    white   : player,
                    next    : 0                                     // white starts first
                }, function(err, doc) {
                    socket.emit('sessionCreated', doc);
                })
            } else {
                socket.emit('error', 'Dude, finish your game, first');
            }
        })
    },

    // TODO: Who's next to play?

    /**
     * Get active sessions (paused, running, or waiting for a player)
     * @param socket
     * @param cb
     * @param scope
     */
    sessionGetActive: function(socket, cb, scope) {
        this.sessionGetByStatus({$gt: 0}, socket, cb, scope);
    },

    sessionGetByStatus: function(state, socket, cb, scope) {
        var me          = this,
            db          = me.getDb(),
            player      = this.getCurrentPlayer(socket),
           playerId    = player ? player._id : false;

        if (!playerId) return socket.emit('error', 'You are not logged in');

        scope = scope || this;

        db.Session
            .where({or: {white: playerId, black: playerId}})
            .where({state: state})                          // non-finished sessions only
            .limit(1)
            .asc('lastMove')
            .run(me.bind(cb, scope));

        
    }
};