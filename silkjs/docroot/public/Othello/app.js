(function () {

  var scripts = document.getElementsByTagName('script'),
    matchRe = /app\.js$/,
    match,
    scriptSrc,
    i,
    len,
    scriptPath;

  for (i = 0, len = scripts.length; i < len; i++) {
    scriptSrc = scripts[i].src;

    match = scriptSrc.match(matchRe);

    if (match) {
      scriptPath = scriptSrc.substring(0, scriptSrc.length - match[0].length);
      break;
    }
  }

  Ext.Loader.setConfig({
    enabled : true
  });

  Ext.application({
    name        : 'Othello',
    appFolder   : scriptPath + '/app',
    controllers : [
      'Settings',
      'ScoreCard',
      'Viewport',
      'Messaging',
      'Login'
    ],
    init : function () {
      Othello.app = this;
      Othello.heartbeat = new silk.Heartbeat();
    },
    launch      : function () {
      silk.heartbeat_enabled = true;
/*
      EXAMPLE
*/
      var n = 0;
      Othello.heartbeat.addMethod('echo', {
        method: 'echo',
        params: function() {
          n++;
          return {
            message: 'Hello from client ' + n
          };
        },
        callback: function(o) {
          console.dir(o);   // will be called once/sec
        }
      });
      // callbacks have a unique key
      // they are called after the heartbeat methods are all called
      // so a method might store to a global variable or add records
      // to a data store, and the callback can do some sort of update
      // based on that global/store.  Multiple callbacks might look at
      // the same global.
      Othello.heartbeat.addCallback('echo', function() {
        console.log('callback ' + n);
      });
    }
  });
}());
