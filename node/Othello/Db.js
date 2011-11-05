/**
 * MongoDB setup
 */
var mongoose    = require('mongoose'),
    Schema      = mongoose.Schema,
    ObjectId    = Schema.ObjectId;

mongoose.connect('mongodb://localhost/othello');

var Db = {
    schema  : {},
    model   : {}
};

/**
 * Log schema & model
 */

Db.schema.Log = new Schema({
	player	: Number, // should become objectId
    x       : String,
  	z    	: String,
    board   : Array,
    ts    	: Date,
    session : ObjectId
});

Db.model.Log = mongoose.model('log', Db.schema.Log);

/**
 * Player schema & model
 */
Db.schema.Player = new Schema({
	name	    : String,
    email       : String,
  	registered 	: Date,
    gamesPlayed : Number
});

Db.model.Player = mongoose.model('players', Db.schema.Player);

/**
 * Session (game) schema & model
 */
Db.schema.Session = new Schema({
	started	    : Date,
    lastMove    : Date,
    white       : ObjectId, // player
    black       : ObjectId, // player
  	state       : Number,   // 0 finished, 1 playing, 2 waiting for player, 3 paused,
    next        : Number    // next player to play. 0 or 1 (0 = white)
});

Db.model.Session = mongoose.model('sessions', Db.schema.Session);


/**
 * Testing models
 * TODO: erase this part
 */
/*var instance = new Db.model.Log({
    from: 'hello',
    ts: new Date()
});
var cnt = 0;
Db.model.Log.count({}, function(err, cnt) {
    console.log(cnt);
});

instance.save();*/


/**
 * Export reference
 */
exports.db = Db.model;