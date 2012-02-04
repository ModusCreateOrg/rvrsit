alert('here');
Ext.define('Othello.socket', {
    singleton: true,
    mixins: ['Ext.mixin.Observable'],

    config: {
        socket: true
    },

    constructor: function() {
        this.callParent();
        this.initialize();
    },

    initialize: function() {
        var me = this;

        socket.on('restart', function() {
            socket = io.connect('http://localhost:3000');
            console.info('restarting');
        });

        socket.on('othello', function(event, data) {
            me.fireEvent(event, data);
        })
    },

    emit: function(event, data, callback, scope) {
        var socket=this.getSocket(),
            data;

        if (!socket) socket = this.setSocket(true);

        data = {
            event: event,
            data: data
        };

        if (callback && Ext.isFunction(callback)) {
            this.on(event, callback, scope, {single: true});
        }

        socket.emit('othello', data);
    },

    reportError: function(error) {
        if (error && typeof error === 'string') return console.error(error);
        console.error (error.msg || 'Unknown error');
        if (error.callbackFn && window[error.callbackFn]) {
            try {
                window[error.callbackFn].apply(window,error.params || []);
            } catch (e) {
                console.error('Unable to execute callback function');
            }
        }
    },

    applySocket: function() {
        var socket = io.connect(window.location.origin);
        socket.socket.reconnectionDelay = 2000;
        return socket;
    }
});

var socket = io.connect(window.location.origin);

var reportError = function(error) {
    if (error && typeof error === 'string') return console.error(error);
    console.error (error.msg || 'Unknown error');
    if (error.callbackFn && window[error.callbackFn]) {
        try {
            window[error.callbackFn].apply(window,error.params || []);
        } catch (e) {
            console.error('Unable to execute callback function');
        }
    }
};

/**
 * Event listeners
 */


socket.on('restart', function() {
    socket = io.connect('http://localhost:3000');
    console.info('restarting');
});
socket.on('connected', function() {console.info('You are connected. Nice!')});
socket.on('hi back', function() {console.log(arguments);});
socket.on('moveConfirmation', function() {console.log(arguments);});
socket.on('playerRegistered', function(user) {console.log('Hello, ' + user.name, arguments);});
socket.on('disconnect', function() {console.log(arguments);});
socket.on('error', reportError);
socket.on('moveResult', function(msg) {console.log(msg); if (msg && typeof msg == 'object' && msg.success !== true) console.error(msg.success);});
socket.on('playSession', function(msg) {console.log(msg);});

socket.on('whour', function(data) {
    if (!data) console.warn('You are NOBODY!');
    else console.log('It\'s you, '+data.name+', good to see you again.');
});

socket.on('sessionCreated', function(data) {
    var state = data.state == 2 ? 'waiting for another player' : 'game ready, play!';
    console.log('Created session', 'Status: ' + state, data);
});

socket.on('respawn', function(data) {
    console.info('reconnecting');
    socket.disconnect();
    socket.socket.connect();
});


/**
 * Event emitters
 */
/*

Ext.onReady(function() {
    var hi = document.getElementById("hi");
        hi.addEventListener('click', function() {
            socket.emit('hi', 'Hello mofo');
        });

    var whoami = document.getElementById("whoami");
        whoami.addEventListener('click', function() {
            socket.emit('whoami');
        });

    var kicker = document.getElementById("kicker");
        kicker.addEventListener('click', function() {
            socket.emit('yell', 'Fucking fucker fuck fuck');
        });

    var regPlayer = document.getElementById("regPlayer");
        regPlayer.addEventListener('click', function() {
            socket.emit('registerPlayer', {
                name    : 'Bruce Willis',
                email   : 'bruce@willis.us'
            });
        });

    var startNewSession = document.getElementById("startNewSession");
        startNewSession.addEventListener('click', function() {
            socket.emit('startNewSession', {});
        });

    var continueSession = document.getElementById("continueSession");
        continueSession.addEventListener('click', function() {
            socket.emit('continueSession', {});
        });

    var tapBoard = document.getElementById("tapBoard");
        tapBoard.addEventListener('click', function() {
            socket.emit('tapBoard', {x:5,y:5});
        });

    var tapBoard2 = document.getElementById("tapBoard2");
        tapBoard2.addEventListener('click', function() {
            socket.emit('tapBoard', {x:5,y:5, player:0});
        });
});*/
