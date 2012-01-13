Ext.define('Othello.controller.Settings', {
    extend : 'Ext.app.Controller',

    views : [
        'Settings'
    ],

    init : function() {
        console.log(this.$className,'init');
        this.control({

        });
    },
    showSettings : function() {
        this.getView('Settings').create().show();
    }
});