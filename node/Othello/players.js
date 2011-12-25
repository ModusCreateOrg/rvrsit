exports.player = {
    register: function(socket, data) {
        this.add(socket, data, this.onRegistered, this);
    },

    onRegistered: function(socket) {
        socket.emit('registerUser', {success: true});
    },

    add: function(socket, data, cb, scope, safe) {
        if (data.existingPlayer) {
            return cb.call(scope, null, data.existingPlayer);
        }

        var me      = this,
            Othello = me.getParent(),
            db      = Othello.getDb(),
            player;

        scope = scope || me;

        if (!safe) {
            if (!data.email) {
                return Othello.reportError(socket, 'E12000');
            }

            if (!data.password) {
                return Othello.reportError(socket, 'E12001');
            }

            if (data.password !== data.password2) {
                return Othello.reportError(socket, 'E12002');
            }

            this.getByEmail(data.email, function(err, doc) {
                if (doc)
                    me.add(socket, {existingPlayer: doc}, cb, scope);
                else
                    me.add(socket, data, cb, scope, true);
            });
        }
        else {
            player = new db.Player(this.apply(data, {
                registered  : new Date(),
                gamesPlayed : 0
            }));

            player.save(Othello.bind(cb, scope));
        }
    },

    get: function(id, cb, scope) {
        var Othello = this.getParent(),
            db      = Othello.getDb(),
            player  = db.Player;

        scope = scope || this;

        player.findById(id, Othello.bind(cb, scope));
    },

    getByEmail: function(email, cb, scope) {
        var Othello = this.getParent(),
            db      = Othello.getDb(),
            player  = db.Player;

        scope = scope || this;

        player.findOne({email: email}, Othello.bind(cb, scope));
    },

    list: function(query, cb, scope) {
        var Othello = this.getParent(),
            db      = Othello.getDb(),
            players  = db.Player;

        scope = scope || this;

        players.find(query, Othello.bind(cb, scope));
    }
};