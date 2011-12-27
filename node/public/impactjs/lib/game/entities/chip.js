ig.module(
    'game.entities.chip'
)
.requires (
    'impact.entity'
)
.defines(function() {
    var flipBlack = [0,1,2,3,4,5,6,7,8,9,10,11],
        flipWhite = [11,10,9,8,7,6,5,4,3,2,1,0],
        black     = 'black',
        white     = 'white';

    EntityChip = ig.Entity.extend({

        animSheet : new ig.AnimationSheet('media/images/chip-sprite.png', 48,48),
        collides  : ig.Entity.COLLIDES.NEVER,
        size      : {
            x : 48,
            y : 48
        },
        init : function(x,y,settings) {
            var me = this;
            me.parent(x,y,settings);

            me.addAnim('flip_black', .08, flipBlack, true);
            me.addAnim('flip_white', .08, flipWhite, true);

            me.currentAnim  = me.anims['flip_' + me.color];
        },
        update : function() {
            var me = this,
                newColor;

            // is not animating && the event type is click
            if (! me.animating && ig.input.pressed('click')) {
                newColor = (me.color == 'black' ? 'white' : 'black');

                if (me.isItemClicked()) {
                    me.animating   = true;
                    me.newColor    = newColor;
                    me.currentAnim = me.anims['flip_' + (me.color == black ? white : black)];
                    me.currentAnim.rewind();
                }
            }

            if (me.animating && me.currentAnim.loopCount > 0) {
                me.color = me.newColor;
                me.currentAnim = me.anims['flip_' + (me.color == black ? black : white)];
                me.animating = false;
            }
            me.parent();
        },
        isItemClicked : function() {
            var me       = this,
                igInput  = ig.input,
                igMouse  = igInput.mouse,
                thisPos  = me.pos,
                thisSize = me.size,
                mouseY   = igMouse.y,
                mouseX   = igMouse.x,
                posX     = thisPos.x,
                posY     = thisPos.y,
                sizeY    = thisSize.y,
                sizeX    = thisSize.x,
                boundY   = mouseY >= posY && mouseY <= sizeY + posY,
                boundX   = mouseX >= posX && mouseX <= sizeX + posX;

            return (boundY && boundX)

        }
    });
});


