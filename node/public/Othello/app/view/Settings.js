Ext.define('Othello.view.Settings', {
    extend : 'Ext.Panel',
    xtype : 'settings',
    config : {
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
    initialize : function() {
        var resetOverride = function() {
            this.setValue(this.defaultValue);
        };
        this.add([
            {
                xtype        : 'sliderfield',
                fieldLabel   : 'Music',
                setting      : 'music',
                defaultValue : this.settings.music * 100,
                reset        : resetOverride
            },
            {
                xtype        : 'sliderfield',
                fieldLabel   : 'Effects',
                setting      : 'fx',
                defaultValue : this.settings.fx * 100,
                reset        : resetOverride
            }
        ]);
        this.callParent();


        this.on('hide', this.onHideDestroy, this);
    },
    onHideDestroy : function() {
        Ext.Function.defer(this.destroy, 1000, this);
    },
    show : function() {
        this.callParent(arguments);
        this.items.each(function(item){
            item.reset();
        });
    }
});