var express         = require('express'),
    connect         = require('./node_modules/express/node_modules/connect'),
    app             = express.createServer(),
    MemoryStore     = express.session.MemoryStore,
    io              = require('socket.io').listen(app),
    O               = require('./Othello/Othello').Othello,
    db              = require('./Othello/Db').db,
    sessionStore    = new MemoryStore(),
    parseCookie     = connect.utils.parseCookie,
    Session         = connect.middleware.session.Session;

/**
 * Listen on port 3000
 */
app.use(express.cookieParser());
app.use(express.session({ secret: "othelloking", store: sessionStore }));
app.listen(3000);

/**
 * Read the html file
 */
app.get('/', function (req, res) {
    res.sendfile(__dirname + '/ws.html');
});

/**
 * Remember DB instance in Othello
 */
O.setDb(db);


/**
 * Setup socket listener
 */

/*io.enable('browser client minification');  // send minified client
io.enable('browser client etag');          // apply etag caching logic based on version number
io.enable('browser client gzip');          // gzip the file
io.set('log level', 1);                    // reduce logging
io.set('transports', [                     // enable all transports (optional if you want flashsocket)
    'websocket'
  , 'flashsocket'
  , 'htmlfile'
  , 'xhr-polling'
  , 'jsonp-polling'
]);*/


io.set('log level', 1);

io.set('authorization', function (data, accept) {
    if (data.headers.cookie) {
        data.cookie = parseCookie(data.headers.cookie);
        data.sessionID = data.cookie['connect.sid'];
        data.sessionStore = sessionStore;
        sessionStore.get(data.sessionID, function (err, session) {
            if (err) {
                accept(err.message, false);
            } else {
                data.session = new Session(data, session);
                accept(null, true);
            }
        });
    } else {
       return accept('No cookie transmitted.', false);
    }
});

io.sockets.on('connection', O.bind(O.registerSocketEvents, O));

