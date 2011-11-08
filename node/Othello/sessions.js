exports.session = {
    add: function(data, cb, scope) {
        var Othello = this.getParent,
            db      = Othello.getDb(),
            session;

        scope = scope || this;
        
        session = new db.Session(Othello.apply({
            state : 2
        }, data));

        session.save(Othello.bind(cb, scope));
    },

    get: function(id, cb, scope) {
        var Othello = this.getParent,
            db      = Othello.getDb(),
            session = db.Session;

        scope = scope || this;

        session.findById(id, Othello.bind(cb, scope));
    },

    list: function(query, cb, scope) {
        var Othello = this.getParent,
            db      = Othello.getDb(),
            session = db.Session;

        scope = scope || this;

        session.find(query, Othello.bind(cb, scope));
    },

    /**
     * TODO: don't allow creating sessions if there is one already created
     * @param data
     * @param socket
     */
    create: function(data, socket) {
        var me      = this,
            Othello = me.getParent(),
            player  = Othello.user.getCurrentPlayer(socket);

        if (!player) {
            // not logged in
            return Othello.reportError(socket, 'E10100');
        }

        me.getActive(socket, function(err,doc) {
            if (!doc) {
                me.add({
                    started : new Date(),
                    white   : player,
                    next    : 0                                     // white starts first
                }, function(err, doc) {
                    socket.emit('sessionCreated', doc);
                })
            } else {
                // already playing a game
                Othello.reportError(socket,'E11000');
            }
        })
    },

    resume: function(data, socket) {
        var me      = this,
            db      = me.getParent().getDb();

        me.getActive(socket, function(err, docs) {
            var session = docs[0] || false;
            if (session) {
                session.state = 1;
                session.save();
                socket.emit('playSession', session);
            }
        });
    },

    // TODO: Who's next to play?

    /**
     * Get active sessions (paused, running, or waiting for a player)
     * @param socket
     * @param cb
     * @param scope
     */
    getActive: function(socket, cb, scope) {
        this.getByStatus({$gt: 0}, socket, cb, scope);
    },

    getByStatus: function(state, socket, cb, scope) {
        var me          = this,
            Othello     = me.getParent(),
            db          = Othello.getDb(),
            player      = Othello.user.getCurrentPlayer(socket),
            playerId    = player ? player._id : false;

        if (!playerId) return  Othello.reportError(socket, 'E10100');

        scope = scope || this;

        db.Session
            .where({or: {white: playerId, black: playerId}})
            .where({state: state})                          // non-finished sessions only
            .limit(1)
            .asc('lastMove')
            .run(Othello.bind(cb, scope));

        
    }
};