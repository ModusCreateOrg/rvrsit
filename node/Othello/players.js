exports.players = {
    addPlayer: function(data, cb, scope, safe) {
        if (data.existingPlayer) {
            return cb.call(scope, null, data.existingPlayer);
        }

        var me      = this,
            db      = me.getDb(),
            socket  = me.getSocket(),
            player;

        scope = scope || me;

        if (!safe) {
            if (!data.email) {
                return socket.emit('error', 'User is missing email address');
            }

            this.getPlayerByEmail(data.email, function(err, doc) {
                if (doc)
                    me.addPlayer({existingPlayer: doc}, cb, scope);
                else
                    me.addPlayer(data, cb, scope, true);
            });
        }
        else {
            player = new db.Player(this.apply(data, {
                registered  : new Date(),
                gamesPlayed : 0
            }));

            player.save(this.bind(cb, scope));
        }
    },

    getPlayer: function(id, cb, scope) {
        var db      = this.getDb(),
            player  = db.Player;

        scope = scope || this;

        player.findById(id, this.bind(cb, scope));
    },

    getPlayerByEmail: function(email, cb, scope) {
        var db      = this.getDb(),
            player  = db.Player;

        scope = scope || this;

        player.findOne({email: email}, this.bind(cb, scope));
    },

    listPlayers: function(query, cb, scope) {
        var db      = this.getDb(),
            players  = db.Player;

        scope = scope || this;

        players.find(query, this.bind(cb, scope));
    }
};