Ext.define('Othello.view.GamePiece', {
    extend : 'Ext.Component',
    xtype  : 'gamepiece',

    config : {
        html      : true,
        pieceTpl  : '<div style="height: {0}px; width: {1}px; font-size: 12px;" class="othello-gamepiece ogp-{2}"></div>',
        baseCls   : 'othello-gamepiece-square',
        anims : {
            black : 'flip-black',
            white : 'flip-white'
        }
    },
    initialize : function() {
        this.origColor = this.color;

        this.callParent();
//        debugger;
        this.renderElement.addCls('othello-gamepiece-square');

        this.renderElement.on({
            scope : this,
            tap   : this.onTap
        });

        this.doHide();
//
//        this.droppable = new Ext.util.Droppable(this.renderElement, {
//            group : 'othello-gamepiece'
//        });
//
//        this.droppable.on({
//            scope         : this,
//            validDropMode : 'intersect',
//            drop          : this.onDrop,
//            dropenter     : this.onDropEnter
//        });

    },
    onTap  : function(evtObj, el) {
        this.fireEvent('gptap', this, el, evtObj);
    },

    applyHtml : function() {
//        debugger;
        return Ext.String.format(
            this.getPieceTpl(),
            this.getHeight(),
            this.getWidth(),
            this.color
        );
    },

    flipToColor: function(color, duration) {
        Ext.fly(this.renderElement.dom.childNodes[0]).applyStyles({
            visibility: 'visible'
        });

        delete this.hidden;
        var anims      = this.getAnims(),
            targetAnim = anims[this.color = color],
            removeAnim = color == 'white' ? anims['black'] : anims['white'],
            oldColor   = color == 'white' ? 'black' : 'white',
            targetEl   = this.renderElement.down('.othello-gamepiece');

        duration = duration / 1000;

//        console.log(targetEl, anim, (duration / 1000) + 's');
        console.log(anims[color], 'REMOVE', removeAnim)
        targetEl.removeCls(removeAnim);

        targetEl.applyStyles({'-webkit-animation-duration' : duration + 's'});
        targetEl.addCls(targetAnim);

        // do some cleanup!
        Ext.Function.defer(function() {
            targetEl.applyStyles({'-webkit-animation-duration' : '0s'});
            targetEl.addCls('ogp-' + color);
            targetEl.removeCls('ogp-' + oldColor);
            targetEl.removeCls(targetAnim);
        }, duration + 1500);
//        console.log(targetEl.dom, anim);

    },

    reset : function() {
        this.doHide();
        if (!this.hidden)   {
            this.anims[this.color = this.origColor].run(this.renderElement.dom.childNodes[0], {duration : 0});
        }

    },
    doHide : function() {
        if (this.initHidden) {
            Ext.fly(this.renderElement.dom.childNodes[0]).applyStyles({
                visibility: 'hidden'
            });
            this.hidden = true;
        }
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
//        console.info(x + ' ' + y);
//        console.log(this.connections);
    },
    setConnections : function(coordPosition, x, y) {
        var itemId,
            topParent = this.parent.parent;

        //TODO:  Clean this up/make more effecient!!

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









