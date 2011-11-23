Ext.Loader.setConfig({
    enabled : true
});


Ext.application({
    name : 'Othello',
//    autoCreateViewport : true,
    appFolder : 'Othello/app',
    controllers : [
        'GamePiece',
        'Viewport'
    ],
    init : function() {


    },
    launch : function() {

    }
});