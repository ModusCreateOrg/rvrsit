exports.player = {
    register: function(socket, data) {
        var cb = function() {
            this.onRegistered.call(this,socket, arguments);
        };
        this.add(socket, data, cb, this);
    },

    onRegistered: function(socket, args) {
        socket.emit('registerUser', {success: true, data: args});
    },

    add: function(socket, data, cb, scope, safe) {
        if (data.existingPlayer) {
            return (typeof cb == "function") ? cb.call(scope, null, data.existingPlayer) : false;
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
            console.log(Othello.apply(data, {
                            registered  : new Date(),
                            gamesPlayed : 0
                        }));
            player = new db.Player(Othello.apply(data, {
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

    /**
     * Authorize
     * @param data - takes email String and password String
     * @param cb
     * @param scope
     */
    auth: function(data, cb, scope) {
        var Othello = this.getParent(),
            db      = Othello.getDb(),
            player  = db.Player;

        player.findOne({email: data.email, password: data.password}, function(err, result) {
            if (!result && cb) {
                cb.call(scope || this, {success: false});
            } else if (cb && typeof cb=='function') {
                var data = {
                    success: true,
                    player: {
                        gameName: result.gameName,
                        gamesPlayed: result.gamesPlayed
                    }
                };
                cb.call(scope || this, data);
            }

        });
    },

    list: function(query, cb, scope) {
        var Othello = this.getParent(),
            db      = Othello.getDb(),
            players  = db.Player;

        scope = scope || this;

        players.find(query, Othello.bind(cb, scope));
    }
};