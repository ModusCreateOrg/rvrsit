Ext.define('Othello.controller.GamePiece', {
    extend : 'Ext.app.Controller',

    views : [
        'AbstractGamePiece',
        'GamePiece'
    ],
    init: function() {
        console.log(this.$className);
    }

});