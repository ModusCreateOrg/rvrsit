Ext.Loader.setConfig({
    enabled : true
});


Ext.application({
    name : 'Othello',
    autoCreateViewport : true,
    appFolder : 'Othello/app',
    views : [
        'GamePiece',
        'Viewport'
    ],
    init : function() {


    },
    launch : function() {

    }
});