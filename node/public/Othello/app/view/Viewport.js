Ext.define('Othello.view.Viewport', {
    extend : 'Ext.Container',
    xtype  : 'othelloviewport',

    requires : [
        'Othello.view.ScoreCard'
    ],

    config     : {
        fullscreen : true,
        style      : 'background-image: url(node/public/impactjs/media/images/new/bg.jpg); background-repeat: no-repeat;',
        //        bodyStyle  : 'padding: 10px; background-color: #FEFEFE',
        layout     : {
            type  : 'hbox',
            align : 'stretch'
        }
    },
    initialize : function() {
        this.setItems([
            this.buildGameBoard(),
            this.buildScoreCard()
        ]);

        this.callParent();
        this.on({
            scope   : this,
            buffer  : 500,
            painted : function() {
                //TODO: push to controller somehow
                ig.main('#canvas', MyGame, 30, 548, 548, 1);
            }
        })
    },

    buildGameBoard : function() {
        return {
            xtype  : 'component',
            height : 750,
            width  : 675,
            tpl    : '<canvas id="{id}" style="position: absolute; width: 548px; height: 548px; top: 77px; left: 62px;"></canvas>',
            data   : { id : 'canvas'}
        };
    },

    buildScoreCard : function() {
        return {
            xtype  : 'scorecard',
            width  : 351,
            height : 750,
            itemId : 'scoreCard'
        };

    }
});