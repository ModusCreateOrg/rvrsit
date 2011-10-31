var app = require('express').createServer()
  , io = require('socket.io').listen(app)
  , mongoose = require('mongoose');



/**
 * Listen on port 3000
 */
app.listen(3000);



/**
 * Read the html file
 */
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/ws.html');
});




/**
 * MongoDB setup
 */
mongoose.connect('mongodb://localhost/othello');

var Db = {};
Db.Schema 	= mongoose.Schema;
Db.ObjectId = Db.Schema.ObjectId;

Db.schema = Db.model = {};

Db.schema.Log = new Db.Schema({
	player	: Number,
    from    : String,
  	to    	: String,
    ts    	: Date,
    session : String
});
	
Db.model.Log = mongoose.model('logModel', Db.schema.Log);

var instance = new Db.model.Log();
instance.from = 'hello';
instance.save();



/**
 * Setup socket listener
 */
io.sockets.on('connection', function (socket) {
  	socket.emit('connected', true);
	
	socket.on('hi', function(data) {
		socket.emit('hi back', data + ', bitch');
		
		socket.emit('hi back', instance);
	})
});



/**
 * What exactly happens when connection is established? Mind bad connection, sleep/wakeup	
 */