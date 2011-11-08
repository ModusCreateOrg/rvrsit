var movement    = require('./movement').movement,
    events      = require('./events').events,
    players     = require('./players'),
    sessions    = require('./sessions'),
    users       = require('./users'),
    init        = require('./init').init,
    Othello     = require('./util').util;

Othello.apply(Othello,init).init();
Othello.apply(Othello, events);
Othello.apply(Othello, movement);
Othello.apply(Othello, players);
Othello.apply(Othello, sessions);
Othello.apply(Othello, users);

exports.Othello = Othello;

// TODO: separate each section into it's own namespace
// e.g. Othello.users.xxxx

//TODO: How to make sure I don't have to pass socket instance to each rq?

 /*
  NOTICE:
    all query callbacks have params:
        err
        doc(s)
*/