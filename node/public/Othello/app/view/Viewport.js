Ext.define('Othello.view.Viewport', {
    extend : 'Ext.Container',
    requires : [
        'Othello.view.ScoreCard'
    ],

    xtype : 'othelloviewport',
    config : {
        fullscreen : true,
        bodyStyle  : 'padding: 10px; background-color: #FEFEFE',
        layout     : {
            type  : 'hbox',
            align : 'stretch',
            pack  : 'center'
        }
    },
    initialize : function() {
        this.setItems([
            this.buildItems(),
            this.buildScoreCard()
        ]);

        this.callParent();
        this.on({
            scope   : this,
            buffer  : 500,
            painted : function() {
                //TODO: push to controller somehow
                ig.main( '#canvas', MyGame, 30, 384, 384, 1 );
            }
        })
    },

    buildItems : function() {
        return {
            xtype     : 'component',
            height    : 384,
            width     : 384,
            tpl       : '<canvas id="{id}"></canvas>',
            data      : { id : 'canvas'}
        };
    },

    buildScoreCard : function() {
        return {
            xtype  : 'scorecard',
            width  : 140,
            height : 300,
            itemId : 'scoreCard'
        };

    }
});