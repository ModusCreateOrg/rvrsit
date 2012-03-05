Ext.define('Rvrsit.view.Settings', {
    extend : 'Ext.Panel',
    xtype  : 'settings',

    uses : [
        'Ext.field.Slider',
        'Ext.TitleBar'
    ],

    config        : {
        style         : 'background-color: #FFF',
        modal         : true,
        width         : 300,
        centered      : true,
        hideOnMaskTap : true,

        layout : {
            type  : 'vbox',
            align : 'stretch'
        }
    },
    initialize    : function() {
        var me = this;
        me.add([
            {
                xtype  : 'titlebar',
                title  : 'Settings',
                docked : 'top'
            },
            {
                xtype   : 'sliderfield',
                label   : 'Music',
                setting : 'music',
                value   : me.settings.music * 100
            },
            {
                xtype   : 'sliderfield',
                label   : 'Effects',
                setting : 'fx',
                value   : me.settings.fx * 100
            }
        ]);
        me.callParent();

        me.on('hide', me.onHideDestroy, me);
    },
    onHideDestroy : function() {
        Ext.Function.defer(this.destroy, 1000, this);
    }
});