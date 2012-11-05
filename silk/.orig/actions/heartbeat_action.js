/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/28/12
 * Time: 4:28 PM
 * To change this template use File | Settings | File Templates.
 */

heartbeat = {
    serverTime : function() {
        return Util.currentTime();
    },
    // add your additional methods here
    // they are called with an object containing key/value pairs
    // the key/value pairs are sent via params() function on the
    // client side (see heartbeat.js)

    /*
     Example
     */
//    echo  : function(args) {
//        // this object is passed to the subscriber on the client
//        return {
//            message : args.message,
//            text    : 'echo @ ' + Date.now()
//        };
//    },
    gameStatus : function(user) {
        var gameFile = 'data/games/test.json',
            gameData = DataApi.readFile(gameFile);

        console.log('\n gameStatus');
        console.log(Util.print_r(gameData));

        if (user.name == 'Slave' && user.status == 'playing' ) {
            console.log("Clearing game file...");
            DataApi.writeFile(gameFile, '[]');
            return gameData;

        }
        else {
            return [];
        }
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

function Heartbeat_action() {
    console.log('\n' + Date.now() + ' Heartbeat_action');
    var result = {},
        methods = Json.decode(req.data.methods),
        params = Json.decode(req.data.params),
        keys = Json.decode(req.data.keys),
        count = methods.length,
        method;

    for (var i = 0; i < count; i++) {
        method = methods[i];

        if (heartbeat[method]) {
            if (method != 'serverTime') {
                console.log(' HB :: Execute - ' + methods[i]);
            }
            result[keys[i]] = heartbeat[methods[i]](params[i]);
        }
    }
    Json.success(result);
}
