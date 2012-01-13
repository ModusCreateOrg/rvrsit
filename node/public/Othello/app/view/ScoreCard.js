Ext.define('Othello.view.ScoreCard', {
    extend : 'Ext.Component',
    xtype  : 'scorecard',
    style  : 'margin-left: 10px; border: 1px solid #9E9E9E; -webkit-border-radius: 5px;',
    config : {
        imgLocations : {
            white : 'node/public/impactjs/media/images/rvrs-wht.png',
            black : 'node/public/impactjs/media/images/rvrs-blck.png'
        },
        html :  [
            '<div style="padding-top: 5px;">',
                '<div class="othello-scorecard-player"> Player :: ',
                    '<img style="float: right;position: relative; top: -5px;" class="othello-scorecard-player-turn" height="32px" src="node/public/impactjs/media/images/rvrs-wht.png">',
                '</div>',
                '<div class="othello-scorecard-score-keeper">',
                    '<span style="displ">White :: </span>',
                    '<span class="othello-scorecard-score-keeper-white">0</span>',
                    '<br />',
                    '<span style="displ">Black :: </span>',
                    '<span class="othello-scorecard-score-keeper-black">0</span>',
                    '<br />',
                '</div>',
            '</div>'
        ].join('')
    },

    initialize : function() {
        this.callParent();
    }
});
