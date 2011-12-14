exports.user = {
    users: {},

    httpSessions: {},

    reg: function(socket, sid) {
        var me          = this,
            Othello     = me.getParent(),
            playerId    = me.httpSessionsGetPlayer(sid);

        me.users[socket.id] = socket;
        if (playerId) {
            Othello.player.get(playerId, function(err, player) {
                me.bindToPlayer(socket, player);
            });
        }
    },

    update: function(socket, data) {
        var id      = socket.id || socket,
            Othello = this.getParent();
        return Othello.apply(this.users[id], data);
    },

    flush: function(socket) {
        var id = socket.id || socket;
        delete this.users[id];
    },

    /**
     * Kick that bastard out
     * @param socket
     */
    disconnect: function(socket) {
        var id = socket.id;
        socket.disconnect();
        this.flush(id);
    },

    /**
     * Assign player to active user
     * @param socket
     * @param player {Object} Player object as in db
     * @param sid {Object} Browser session id
     */
    bindToPlayer: function(socket, player, sid) {
        if (sid) {
            this.httpSessions[sid] = {
                playerId    : player._id,
                socketId    : socket.id,
                created     : new Date()
            };
        }
        return this.update(socket, {player: player});
    },

    /**
     * Return user's socket instance from various references
     * @param id
     */
    get: function(id) {
        return this.getFromSessionId(id) || this.getFromPlayerId(id) || this.getFromPlayer(id) || false;
    },

    getFromSessionId: function(sessionId) {
        return this.users[sessionId];
    },

    /**
     * Get just user ID from player ID
     * @param playerId {String} MongoDB ID of the user
     */
    getIdFromPlayerId: function(playerId) {
        var users = this.users,
            id;
        for (id in users) {
            if (users[id].player && users[id].player._id == playerId) return id;
        }

        return false;
    },

    /**
     * Get Socket reference of player by id
     * @param playerId
     */
    getFromPlayerId: function(playerId) {
        var userId = this.getIdFromPlayerId(playerId);
        return userId ? this.users[userId] : false;
    },

    /**
     * Get Socket reference of player object
     * @param player
     */
    getFromPlayer: function(player) {
        return player._id ? this.getFromPlayerId(player._id) : false;
    },

    httpSessionsCleanup: function() {
        // per socketId
        // older than 48 hrs
    },

    httpSessionGetSocket: function(sessionId) {
        var sid = this.httpSessions[sessionId];
        return sid?this.get(sid.socketId):false;
    },

    httpSessionsGetPlayer: function(sid) {
        var session = this.httpSessions[sid];
        return session ? session.playerId : null;
    },

    /**
     * Get player data from the user in session/socket (socket right now)
     */
    getCurrentPlayer: function(socket) {
        return this.users[socket.id] .player;
    }
};

