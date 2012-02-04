Ext.define('Othello.controller.Settings', {
    extend : 'Ext.app.Controller',

    views : [
        'Settings'
    ],

    init : function() {
        this.control({
             'settings > field' : {
                 change : this.onFieldChange
             }
        });
    },
    showSettings : function() {
        var settings = Othello.game.getSettings();
        this.getView('Settings').create({
            settings : settings
        }).show();
    },
    onFieldChange : function(field, value) {

        this.application.fireEvent('setting', this, field.setting, value[0] / 100);
    }
});