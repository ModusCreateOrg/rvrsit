ig.module( 'game.levels.test' )
.requires('impact.image','game.entities.chip','game.entities.chip','game.entities.chip','game.entities.chip')
.defines(function(){
LevelTest=/*JSON[*/{"entities":[{"type":"EntityChip","x":142,"y":144,"settings":{"color":"black"}},{"type":"EntityChip","x":190,"y":191,"settings":{"color":"black"}},{"type":"EntityChip","x":142,"y":191,"settings":{"color":"white"}},{"type":"EntityChip","x":191,"y":144,"settings":{"color":"white"}}],"layer":[{"name":"background","width":1,"height":1,"linkWithCollision":false,"visible":1,"tilesetName":"node/public/impactjs/media/images/bg.png","repeat":false,"preRender":false,"distance":"1","tilesize":384,"foreground":false,"data":[[1]]}]}/*]JSON*/;
LevelTestResources=[new ig.Image('media/images/bg.png')];
});