Ext.ns('Othello');

Othello.AbstractGamePiece = Ext.extend(Ext.BoxComponent, {
    tpl       : '<div style="height: {0}px; width: {1}px; font-size: 12px;" class="othello-gamepiece ogp-{2}"></div>',
    strFormat : Ext.util.Format.format,
    baseCls   : 'othello-gamepiece-square',
    anims     : {
        black : new Ext.Anim({
            is3d      : true,
            autoClear : false,
            duration  : 500,
            easing    : 'ease-out',
            from      : {
                '-webkit-transform' : 'rotateY(180deg)',
                'background-color'  : '#FFF'
            },
            to        : {
                '-webkit-transform' : 'rotateY(0deg)',
                'background-color'  : '#000'
            }
        }),

        white : new Ext.Anim({
            is3d      : true,
            autoClear : false,
            duration  : 500,
            easing    : 'ease-out',
            from      : {
                '-webkit-transform' : 'rotateY(0deg)',
                'background-color'  :  '#9E9E9E'
            },
            to        : {
                '-webkit-transform' : 'rotateY(180deg)',
                'background-color'  :  '#FFF'
            }
        })
    },

    initComponent : function() {
        this.html = this.strFormat(
            this.tpl,
            this.height,
            this.width,
            this.color
        );

        this.origColor = this.color;

        Othello.AbstractGamePiece.superclass.initComponent.call(this);
    },

    afterRender : function() {
        Othello.AbstractGamePiece.superclass.afterRender.call(this);
        this.el.addCls('othello-gamepiece-square');

        this.el.on({
            scope : this,
            tap   : this.onTap
        });

        this.doHide();

        this.droppable = new Ext.util.Droppable(this.el, {
            group : 'othello-gamepiece'
        });

        this.droppable.on({
            scope         : this,
            validDropMode : 'intersect',
            drop          : this.onDrop,
            dropenter     : this.onDropEnter
        });
    },
    onDropEnter : function(dropbl, dragbl, evtObj) {
    },
    onDrop : function(dropbl, dragbl, evtObj) {
    },
    checkAdjacent : function(direction, color, stack) {

    },
    onTap  : function(evtObj) {

    },
    flipToColor: function(color, duration) {
        Ext.fly(this.el.dom.childNodes[0]).applyStyles({
            visibility: 'visible'
        });

        delete this.hidden;

        this.anims[this.color = color].run(this.el.dom.childNodes[0], {duration : duration});

    },

    reset : function() {
        this.doHide();
        if (!this.hidden)   {
            this.anims[this.color = this.origColor].run(this.el.dom.childNodes[0], {duration : 0});
        }
        else {

        }

    },
    doHide : function() {
         if (this.initHidden) {
            Ext.fly(this.el.dom.childNodes[0]).applyStyles({
                visibility: 'hidden'
            });
            this.hidden = true;
        }
    },
    initPositionalAwareness: function() {
        var coords    = this.coords,
            x         = coords.x,
            y         = coords.y;

        this.isEdgePiece = (y === 0 || y=== 7 || x===0 || x===7);


        this.connections = {

        };

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
            topParent = this.ownerCt.ownerCt;

        //TODO:  Clean this up/make more effecient!!

        if (coordPosition === 'e') {
            itemId =  'ogp-' + (x+1) + '-' + y;
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









