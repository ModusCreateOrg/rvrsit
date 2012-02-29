ig.module('game.levels.main')
.requires('impact.image', 'game.entities.chip', 'game.entities.chip', 'game.entities.chip', 'game.entities.chip')
.defines(function() {
    LevelMain = /*JSON[*/{"entities" : [], "layer" : [
        {
            "name"              : "background",
            "width"             : 1,
            "height"            : 1,
            "linkWithCollision" : false,
            "visible"           : 1,
            "tilesetName"       : "impactjs/media/images/new/game_bg.png",
            "repeat"            : false,
            "preRender"         : false,
            "distance"          : "1",
            "tilesize"          : 548,
            "foreground"        : false,
            "data"              : [
                [
                    1
                ]
            ]
        }
    ]}/*]JSON*/;
    LevelMainResources = [ ];
});