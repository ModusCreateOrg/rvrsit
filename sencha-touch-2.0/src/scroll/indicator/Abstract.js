/**
 * @private
 */
Ext.define('Ext.scroll.indicator.Abstract', {
    extend: 'Ext.Component',

    config: {
        baseCls: 'x-scroll-indicator',

        /**
         * @cfg {String} axis The current indicator axis
         * @accessor
         */
        axis: 'x',

        value: 0,

        length: null,

        hidden: true
    },

    cachedConfig: {
        ratio: 1,

        barCls: 'x-scroll-bar'
    },

    barElement: null,

    barLength: 0,

    gapLength: 0,

    getElementConfig: function() {
        return {
            reference: 'barElement',
            children: [this.callParent()]
        };
    },

    applyRatio: function(ratio) {
        if (isNaN(ratio)) {
            ratio = 1;
        }

        return ratio;
    },

    refresh: function() {
        var bar = this.barElement,
            barDom = bar.dom,
            ratio = this.getRatio(),
            axis = this.getAxis(),
            barLength = (axis === 'x') ? barDom.offsetWidth : barDom.offsetHeight,
            length = barLength * ratio;

        this.barLength = barLength;

        this.gapLength = barLength - length;

        this.setLength(length);

        this.updateValue(this.getValue());
    },

    updateBarCls: function(barCls) {
        this.barElement.addCls(barCls);
    },

    updateAxis: function(axis) {
        this.element.addCls(this.getBaseCls(), null, axis);
        this.barElement.addCls(this.getBarCls(), null, axis);
    },

    updateValue: function(value) {
        this.setOffset(this.gapLength * value);
    },

    doSetHidden: function(hidden) {
        var elementDomStyle = this.element.dom.style;

        if (hidden) {
            elementDomStyle.opacity = '0';
        }
        else {
            elementDomStyle.opacity = '';
        }
    },

    updateLength: function(length) {
        var axis = this.getAxis();

        if (axis === 'x') {
            this.element.setWidth(length);
        }
        else {
            this.element.setHeight(length);
        }
    },

    setOffset: function(offset) {
        var axis = this.getAxis(),
            element = this.element;

        if (axis === 'x') {
            element.setLeft(offset);
        }
        else {
            element.setTop(offset);
        }
    }
});
