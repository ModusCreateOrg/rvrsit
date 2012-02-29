Ext.define('Rvrsit.view.ScoreCard', {
    extend : 'Ext.Component',
    xtype  : 'scorecard',
    config : {
        style  : 'background-image: url(impactjs/media/images/new/sidebar_bg.png); background-repeat: no-repeat;',

        turnOpposites : {
            black : 'tile-white',
            white : 'tile-black'
        },
        html :  [
            '<div style="padding-top: 5px;">',
                '<div class="player">',
                    '<div class="player-turn-title">TURN</div>',
                    /** ZOMG! A table! Dave phix0r this!! please? :)**/

                    '<table style="width:200px; margin-left: 100px;">',
                        '<tr>',
                            '<td style="width: 50px;">',
                                '<div class="player-turn-tile tile-black player-indicator">&nbsp;</div>',
                            '</td>',
                            '<td>',
                                '<div class="player-turn-label">BLACK</div>',
                            '</td>',
                        '</tr>',
                    '</table>',
                '</div>',

                '<div class="player">',
                    '<div class="player-score">SCORE</div>',

                    /** ZOMG! A table! Dave phix0r this!! please? :)**/
                    '<table style="width:200px; margin-left: 100px;">',
                        '<tr>',
                            '<td style="width: 50px;">',
                                '<div class="player-turn-tile tile-white" style="position: inherit !important;">&nbsp;</div>',
                            '</td>',
                            '<td>',
                                '<span class="score-keeper-white">0</span>',
                            '</td>',
                            '<td style="width: 50px;">',
                                '<div class="player-turn-tile tile-black-score" style="position: inherit !important;">&nbsp;</div>',
                            '</td>',
                            '<td >',
                                '<span class="score-keeper-black">0</span>',
                            '</td>',
                        '</tr>',
                    '</table>',
                '</div>',

                '<div class="about-pane">',
                    'This application was designed and built by ModusCreate! </br>',
                    'We are a highly motivated, interdisciplinary team that believe in lean development, design strategy, and user experience to develop stunning applications with emerging technology.',
                '</div>',
                '<div class="button button-untouched">',
                    '<div class="btn-title title-play">Play</div>',
                '</div>',
                '<div class="button button-touched">',
                    '<div class="btn-title title-settings">Settings</div>',
                '</div>',
            '</div>'
        ].join('')
    },

    initialize : function() {

        this.callParent();


        this.element.on({
            tap      : this.onElementTap,
            scope    : this,
            delegate : '.button'
        });

        this.element.on({
            touchstart : this.onElementTouchStart,
            scope      : this,
            delegate   : '.button'
        });

        this.element.on({
            touchend : this.onElementTouchEnd,
            scope    : this,
            delegate : '.button'
        });
        // hack!
        this.on('painted', function() {
            var el = this.element.down('.button-touched');

            el && Ext.get(el).replaceCls('button-touched', 'button-untouched');
        }, this);


    },
    onElementTap : function(evtObj) {
        var target = evtObj.getTarget();
        console.log('tap', target);
        if (target) {
            console.log(Ext.get(target.dom));
//            this.fireEvent('new', this);

        }
    },
    onElementTouchStart : function(evtObj) {
        var target = evtObj.getTarget();
        if (target) {
            Ext.fly(target).replaceCls('button-untouched','button-touched');
        }
    },
    onElementTouchEnd : function(evtObj) {
        var target = evtObj.getTarget();
        if (target) {
            Ext.fly(target).replaceCls('button-touched','button-untouched');
        }
    },
    updateScore : function(scoreObj) {
        var me = this,
            turnOpposites = this.getTurnOpposites();
        if (!me.playerTurnIndicator) {
            var myElement = me.element;
            me.playerTurnIndicator = myElement.down('.player-indicator');
            me.playerTurnLabel     = myElement.down('.player-turn-label').dom;
            me.whitePlayerScoreEl  = myElement.down('.score-keeper-white').dom;
            me.blackPlayerScoreEl  = myElement.down('.score-keeper-black').dom;
        }


        me.playerTurnIndicator.replaceCls(turnOpposites[scoreObj.turn], 'tile-' + scoreObj.turn);

        me.playerTurnLabel.innerHTML    = scoreObj.turn;
        me.whitePlayerScoreEl.innerHTML = scoreObj.white;
        me.blackPlayerScoreEl.innerHTML = scoreObj.black;
    }
});
