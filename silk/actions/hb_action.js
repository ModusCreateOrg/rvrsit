/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/28/12
 * Time: 4:28 PM
 * To change this template use File | Settings | File Templates.
 */

heartbeatMethods = {
    serverTime : function() {
        return Util.currentTime();
    },
    // add your additional methods here
    // they are called with an object containing key/value pairs
    // the key/value pairs are sent via params() function on the
    // client side (see heartbeat.js)

    getMessages          : function() {
        var player = Auth.isAuthenticated(),
            messages = SQL.getDataRows('select messageId, message, messageType from Messages where playerId = ' + player.playerId + ' order by messageDate');

        messages.each(function(message) {
            message.message = Json.decode(message.message);
        });

        Json.success({
            getMessages : {
                messages : messages
            }
        });
    },

    respond : function(data) {
        data.dt = Auth.getTime();

        Json.success(data);
    }
    /*
     client would do (ONE TIME AT STARTUP):
     window.heartbeat = new silk.Heartbeat();
     // sometime later, or immediately:
     window.heartbeat.enabled = true; // start the short poll/heartbeat

     TO REGISTER an echo subscriber:
     this.addMethod('unique_key', {
     method: 'echo',
     params: function() {
     return {
     message: 'Hello from client'
     };
     },
     callback: function(o) {
     console.dir(o);
     }
     });

     in the console, you should see:
     [OBJECT]
     message: (STRING)'Hello from client'
     text: (STRING)'echo echo echo echo'

     heartbeat was designed to handle chat.  Each chat room or connection would have its own
     unique key.  The params might be the room # or userId of messages we're interested in
     the chat data will be returned as an object to the anonymous function, as in the echo method
     example above.  It's important that each method registered has a unique key.  A method
     on the server may be called multiple times (with unique params) using the same method value
     but differing unique keys.
     */


};

function heartbeat_action() {
    var result = { dt : Auth.getTime() };

    var methods = Json.decode(req.data.methods);
    var params = Json.decode(req.data.params);
    var keys = Json.decode(req.data.keys);
    var count = methods.length;

    for (var i = 0; i < count; i++) {
        if (heartbeatMethods[methods[i]]) {
            result[keys[i]] = heartbeatMethods[methods[i]](params[i]);
        }
    }

    Json.success(result);
}
