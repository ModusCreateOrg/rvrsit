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
                hs.session.touch().save();
            });
        }, 60 * 1000);
        socket.on('disconnect', function () {
            clearInterval(intervalID);
        });

        return hs.sessionID;
    },

    registerSocketEvents : function(socket) {
        var me  = this,
            sid = me.sessionKA(socket);

        me.socket = socket;

        me.userReg(socket, sid);

        socket.emit('connected', true);

        socket.on('hi', me.bind(me.hi,me));

        socket.on('move', me.bind(me.doMove,me));

        socket.on('registerPlayer', function(data) {
            me.addPlayer(data, function(err, doc) {
                socket.emit('playerRegistered', doc);
                me.userToPlayer(socket, doc, sid);
            })
        });

        socket.on('whoami', function() {
            var user = me.getUser(socket.id);
            socket.emit('whour',user.player);
        });

        socket.on('yell', function() {
            socket.emit('disconnect', 'You just got disconnected for having such an attitude. Cool down and come back again.');
            me.userDisconnect(socket);
        });
    },

    /**
     * Test method
     * @param data
     */
    hi: function(data) {
        var me = this;

        me.socket.emit('hi back', data + ', bitch');

        me.socket.emit('hi back', me.getDb());
    }
};