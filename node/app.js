var app = require('express').createServer()
  , io = require('socket.io').listen(app)
  , O = require('./Othello/Othello').Othello
  , db = require('./Othello/Db').db;

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
 * Setup socket listener
 */
O.setDb(db);
io.sockets.on('connection', O.bind(O.registerSocketEvents, O));


/**
 * What exactly happens when connection is established? Mind bad connection, sleep/wakeup	
 */
