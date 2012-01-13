Ext.define('Othello.view.Settings', {
    extend : 'Ext.Panel',


    config : {
        modal         : true,
        height        : 300,
        width         : 300,
        centered      : true,
        hideOnMaskTap : true,
        defaults      : {
            maxValue  : 1,
            minValue  : 0,
            increment : .1
        },
        layout : {
            type  : 'vbox',
            align : 'stretch'
        }
    },
    initialize : function() {
        var listeners = {
            scope  : this,
            change : this.onFieldChange
        };
        this.add([
            {
                xtype      : 'sliderfield',
                fieldLabel : 'Music',
                setting    : 'music',
                listeners  : listeners
            },
            {
                xtype      : 'sliderfield',
                fieldLabel : 'Effects',
                setting    : 'fx',
                listeners  : listeners
            }
        ]);
        this.callParent();

        this.on('hide', this.onHideDestroy, this);
    },
    onFieldChange : function(field, value) {
        console.log(field.setting, value[0])

    },
    onHideDestroy : function() {
        Ext.Function.defer(this.destroy, 1000, this);
    }
});