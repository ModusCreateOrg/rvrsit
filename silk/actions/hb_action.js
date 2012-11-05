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

        getMessages : function() {
            var player = Auth.isAuthenticated('getMessages'),
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

    };

function heartbeat_action() {
    var result = { dt : Auth.getTime() };

    var methods = Json.decode(req.data.methods),
        params = Json.decode(req.data.params),
        keys = Json.decode(req.data.keys),
        count = methods.length,
        i = 0,
        methodName,
        method;

    for (; i < count; i++) {
        methodName = methods[i];
        method = heartbeatMethods[methodName];
        console.log('HB :: ' + methodName);

        if (method) {
            result[keys[i]] = method(params[i]);
        }
    }

    Json.success(result);
}
