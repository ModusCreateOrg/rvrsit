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
        Ext.Viewport.add({
            xclass : 'Rvrsit.view.Settings',
            settings : settings
        }).show();
    },
    onFieldChange : function(field, value) {

        this.getApplication().fireEvent('setting', this, field.setting, value[0] / 100);
    }
});