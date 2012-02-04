Ext.define('Othello.view.ScoreCard', {
    extend : 'Ext.Component',
    xtype  : 'scorecard',
    style  : 'margin-left: 10px; border: 1px solid #9E9E9E; -webkit-border-radius: 5px;',
    config : {
        imgLocations : {
            white : '/public/impactjs/media/images/rvrs-wht.png',
            black : '/public/impactjs/media/images/rvrs-blck.png'
        },
        html :  [
            '<div style="padding-top: 5px;">',
                '<div class="othello-scorecard-player"> Player :: ',
                    '<img style="float: right;position: relative; top: -5px;" class="othello-scorecard-player-turn" height="32px" src="/public/impactjs/media/images/rvrs-wht.png">',
                '</div>',
                '<div class="othello-scorecard-score-keeper">',
                    '<span class="othello-scorecard-score-container">',
                        '<img style="" class="othello-scorecard-player-turn" height="32px" src="/public/impactjs/media/images/rvrs-wht.png">',
                    '</span>',
                    '<span class="othello-scorecard-score-keeper-white">0</span>',
                    '<br />',
                    '<span class="othello-scorecard-score-container">',
                        '<img class="othello-scorecard-player-turn" height="32px" src="/public/impactjs/media/images/rvrs-blck.png">',
                    '</span>',
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
