exports.users = {
    users: {},

    httpSessions: {},

    userReg: function(socket, sid) {
        var me          = this,
            playerId    = me.httpSessionsGetPlayer(sid);

        me.users[socket.id] = socket;
        if (playerId) {
            me.getPlayer(playerId, function(err, player) {
                me.userToPlayer(socket, player);
            });
        }
    },

    userUpdate: function(socket, data) {
        var id = socket.id || socket;
        return this.apply(this.users[id], data);
    },

    userFlush: function(socket) {
        var id = socket.id || socket;
        delete this.users[id];
    },

    /**
     * Kick that bastard out
     * @param socket
     */
    userDisconnect: function(socket) {
        var id = socket.id;
        socket.disconnect();
        this.userFlush(id);
    },

    /**
     * Assign player to active user
     * @param socket
     * @param player {Object} Player object as in db
     * @param sid {Object} Browser session id
     */
    userToPlayer: function(socket, player, sid) {
        if (sid) {
            this.httpSessions[sid] = {
                playerId    : player._id,
                socketId    : socket.id,
                created     : new Date()
            };
        }
        return this.userUpdate(socket, {player: player});
    },

    /**
     * Return user's socket instance from various references
     * @param id
     */
    getUser: function(id) {
        return this.getUserFromSessionId(id) || this.getUserFromPlayerId(id) || this.getUserFromPlayer(id) || false;
    },

    getUserFromSessionId: function(sessionId) {
        return this.users[sessionId];
    },

    getUserIdFromPlayerId: function(playerId) {
        var users = this.users,
            id;
        for (id in users) {
            if (users[id].player._id == playerId) return id;
        }

        return false;
    },

    getUserFromPlayerId: function(playerId) {
        var userId = this.getUserIdFromPlayerId(playerId);
        return userId ? this.user[userId] : false;
    },

    getUserFromPlayer: function(player) {
        return player._id ? this.getUserFromPlayerId(player._id) : false;
    },

    httpSessionsCleanup: function() {
        // per socketId
        // older than 48 hrs
    },

    httpSessionGetSocket: function(sessionId) {
        var sid = this.httpSessions[sessionId];
        return sid?this.getUser(sid.socketId):false;
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

