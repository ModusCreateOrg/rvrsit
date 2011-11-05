var movement    = require('./movement').movmement,
    events      = require('./events').events,
    players     = require('./players').players,
    sessions    = require('./sessions').sessions,
    users       = require('./users').users,
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


 /*
  NOTICE:
    all query callbacks have params:
        err
        doc(s)
*/