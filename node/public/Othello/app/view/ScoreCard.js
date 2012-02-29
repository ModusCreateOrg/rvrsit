Ext.define('Othello.view.ScoreCard', {
    extend : 'Ext.Component',
    xtype  : 'scorecard',
    config : {

        style  : 'background-image: url(node/public/impactjs/media/images/new/sidebar_bg.png); background-repeat: no-repeat;',
        imgLocations : {
            white : 'node/public/impactjs/media/images/rvrs-wht.png',
            black : 'node/public/impactjs/media/images/rvrs-blck.png'
        },
        html :  [
            '<div style="padding-top: 5px;">',
                '<div class="scorecard-player">',
                    '<div class="scorecard-player-turn">TURN</div>',
                    '<div>',
                        '</div>',
                '</div>',

                '<div class="scorecard-player">',
                    '<div class="scorecard-player-score">SCORE</div>',
                    '<span class="scorecard-score-container">',
                        '<img style="" class="scorecard-player-turn" height="32px" src="node/public/impactjs/media/images/rvrs-wht.png">',
                    '</span>',
                    '<span class="scorecard-score-keeper-white">0</span>',
                    '<br />',
                    '<span class="scorecard-score-container">',
                        '<img class="scorecard-player-turn" height="32px" src="node/public/impactjs/media/images/rvrs-blck.png">',
                    '</span>',
                    '<span class="scorecard-score-keeper-black">0</span>',
                    '<br />',

                '</div>',
            '</div>'
        ].join('')
    },

    initialize : function() {
        this.callParent();
    }
});
