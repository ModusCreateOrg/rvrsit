Ext.define('Othello.view.GamePiece', {
    extend : 'Ext.Component',
    xtype  : 'gamepiece',

    config : {
        html      : true,
        anims : {
            black : 'flip-black',
            white : 'flip-white'
        }
    },
    initialize : function() {
        this.origColor = this.color;

        this.callParent();
        this.doHide();

    },
    onTap  : function(evtObj, el) {
        this.fireEvent('gptap', this, el, evtObj);
    },

    initPositionalAwareness: function() {
        var coords = this.coords,
            x      = coords.x,
            y      = coords.y;

        this.isEdgePiece = (y === 0 || y=== 7 || x===0 || x===7);

        this.connections = {};

        if (y === 0) {
            if (x === 0) {
                this.setConnections('e', x,y);
                this.setConnections('se', x,y);
                this.setConnections('s', x,y);
            }
            else if (x === 7) {
                //S, SW, W
                this.setConnections('s', x,y);
                this.setConnections('sw',x,y);
                this.setConnections('w',x,y);
            }
            else {
                // W, SW, S, SE, E
                this.setConnections('e',x,y);
                this.setConnections('se',x,y);
                this.setConnections('s', x,y);
                this.setConnections('sw',x,y);
                this.setConnections('w', x,y);
            }

        }
        else if (y > 0 && y < 7) {
            if (x === 0) {
                // N, NE, E, SE, S
                this.setConnections('n', x,y);
                this.setConnections('ne',x,y);
                this.setConnections('e',x,y);
                this.setConnections('se', x,y);
                this.setConnections('s',x,y);
            }
            else if (x === 7) {
                // N, S, SW, W, NW
                this.setConnections('s', x,y);
                this.setConnections('sw',x,y);
                this.setConnections('w',x,y);
                this.setConnections('nw', x,y);
                this.setConnections('n',x,y);
            }
            else {
                // All coords
                this.setConnections('n', x,y);
                this.setConnections('ne',x,y);
                this.setConnections('e',x,y);
                this.setConnections('se', x,y);
                this.setConnections('s',x,y);
                this.setConnections('sw', x,y);
                this.setConnections('w',x,y);
                this.setConnections('nw',x,y);
            }

        }
        else if (y === 7) {
            if (x === 0) {
                // N, NE, E
                this.setConnections('n', x,y);
                this.setConnections('ne',x,y);
                this.setConnections('e',x,y);
            }
            else if (x === 7) {
                // N, W, NW
                this.setConnections('n', x,y);
                this.setConnections('w',x,y);
                this.setConnections('nw',x,y);
            }
            else {
                // N, NE, E, W, NW
                this.setConnections('n', x,y);
                this.setConnections('ne',x,y);
                this.setConnections('e',x,y);
                this.setConnections('w', x,y);
                this.setConnections('nw',x,y);
            }
        }
    },
    setConnections : function(coordPosition, x, y) {
        var itemId,
            topParent = this.parent.parent;

        //TODO:  Clean this up/make more efficient!!

        if (coordPosition === 'e') {
            itemId =  'ogp-' + (x + 1 ) + '-' + y;
        }
        else if (coordPosition == 'se') {
            itemId =  'ogp-' + (x + 1) + '-' + (y + 1);
        }
        else if (coordPosition == 's') {
            itemId =  'ogp-' + x + '-' + (y + 1);
        }
        else if (coordPosition == 'sw') {
            itemId =  'ogp-' + (x - 1) + '-' + (y + 1);
        }
        else if (coordPosition == 'w') {
            itemId =  'ogp-' + (x - 1) + '-' + y;
        }
        else if (coordPosition == 'nw') {
            itemId =  'ogp-' + (x - 1) + '-' + (y - 1);
        }
        else if (coordPosition == 'ne') {
            itemId =  'ogp-' + (x + 1) + '-' + (y - 1);
        }
        else if (coordPosition == 'n') {
            itemId =  'ogp-' + x + '-' + (y - 1);
        }


        this.connections[coordPosition] = topParent.query('#' + itemId)[0];
    }

});









