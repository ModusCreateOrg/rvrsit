Ext.define('Rvrsit.controller.Settings', {
    extend : 'Ext.app.Controller',

    config : {
        views : [
            'Settings'
        ],
        control : {
             'settings > field' : {
                 change : 'onFieldChange'
             }
        }
    },

    showSettings : function() {
        var settings = Rvrsit.game.getSettings();
        this.getView('Settings').create({
            settings : settings
        }).show();
    },
    onFieldChange : function(field, value) {

        this.application.fireEvent('setting', this, field.setting, value[0] / 100);
    }
});