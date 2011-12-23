Ext.define('Othello.view.SocketDebug', {
    extend : 'Ext.Panel',

    xtype : 'socketDebug',

    config : {
        title   : 'Socket Debug',
        padding : 10,
        layout  : {
            type: 'vbox',
            align: 'middle',
            pack: 'center'
        },

        defaults: {
            xtype: 'button',
            margin: 10,
            width: 480
        }
    },

    initialize : function() {
        this.setItems([
            {
                text: 'Send Hi',
                handler: function() {
                    socket.emit('hi', 'Hello mofo');
                }
            },

            {
                text: 'Register as player Bruce Willis',
                ui  : 'confirm',
                handler: function() {
                    socket.emit('registerPlayer', {
                        name    : 'Bruce Willis',
                        email   : 'bruce@willis.us'
                    });
                }
            },

            {
                text: 'Who am I?',
                handler: function() {
                    socket.emit('whoami');
                }
            },

            {
                text: 'Start game',
                handler: function() {
                    socket.emit('startNewSession', {});
                }
            },

            {
                text: 'Continue game',
                handler: function() {
                    socket.emit('continueSession', {});
                }
            },

            {
                text: 'Tap position 5,5 as current player (white)',
                ui  : 'action',
                handler: function() {
                    socket.emit('tapBoard', {x:5,y:5});
                }
            },

            {
                text: 'Tap position 5,5 as opponent (black)',
                ui  : 'action',
                handler: function() {
                    socket.emit('tapBoard', {x:5,y:5, player:0});
                }
            },

            {
                text: 'Be a bastard that deserves getting his ass kicked',
                ui  : 'decline',
                handler: function() {
                    socket.emit('yell', 'Fucking fucker fuck fuck');
                }
            }
        ]);

        this.callParent();
    }
});