/**
 * Created by JetBrains WebStorm.
 * Player: mschwartz
 * Date: 2/4/12
 * Time: 8:59 AM
 * To change this template use File | Settings | File Templates.
 */

console = require('builtin/console');

rpcMethods = {
    auth : function() {
        this.respond(Auth.auth());
    },
    registerPlayer : function() {
        var errors = [];
        var data = req.data;

        if (data.email.length) {
            var existing = Schema.findOne('Players', {email : data.email });
            if (existing.email) {
                this.auth();
            }
        }

        // validate form
        if (!data.name.length) {
            errors.push('You must enter a name');
        }

        if (!data.email.length) {
            errors.push('You must enter a valid email address');
        }

        if (errors.length) {
            console.log('registerPlayer failure' + data.email + ' ' + data.name);

            console.log(errors.join('<br/>\n* '));
            Json.failure('There are errors in your form: <br/>\n* ' + errors.join('<br/>\n* '));
        }
        else {
            var user = Schema.newRecord('Players');
            user.name = req.data.name;
            user.email = req.data.email;

            user = Schema.putOne('Players', user);
            console.log('registerPlayer Success' + user.email + ' ' + user.name);

            this.auth();
        }
    },

    listGames : function() {
        if (! Auth.isAuthenticated()) {
            Json.failure({msg: 'Need cookie! Om nom nom!'});
        }

        var items = SQL.getDataRows("select * from games where status = 0;");
        this.respond({
            games : items
        });
    },


    challengePlayer : function() {
        var opponentPlayerId = req.data.playerId,
            player           = Schema.findOne('Players', {
                playerId : Auth.isAuthenticated().playerId
            }),
            opponent         = Schema.findOne('Players', {
                playerId : opponentPlayerId
            }),
            message  = {
                firstPlayer  : {
                    name     : opponent.name,
                    playerId : opponent.playerId
                },
                secondPlayer : {
                    name : player.name,
                    playerId : player.playerId
                }
            };

        if (player.playerId == opponent.playerId) {
            Json.failure({ message : 'Silly rabbit! You can\' challenge yourself!  That\'s what two-player local mode is for!'});
        }


        /*
            TODO : add checks for
                - is opponent playing a game already?
                - is opponent alive
                - prevent removal of all messages until the recipient ack's
                - anything else?
         */
//        SQL.update('delete from Messages where playerId = ' + opponentPlayerId);



        Schema.putOne('Messages', {
            playerId    : opponentPlayerId,
            messageType : 'challenge',
            message     : Json.encode(message),
            messageDate : Auth.getTime()
        });

        Json.success({
            firstPlayer  : opponent,
            secondPlayer : player
        });
    },

    ackMessages : function() {
        var player     = Auth.isAuthenticated(),
            messages   = Json.decode(req.data.messages),
            messageSql = ' messageId = ',
            andSql     = ' and playerId = ' + player.playerId,
            or         = ' OR ',
            fullSql    = '';


        if (messages && Util.isArray(messages) && messages.length > 0) {
            messages.each(function(message) {
                if (fullSql) {
                    fullSql += or;
                }

                fullSql += messageSql + message + andSql;
            });

            if (fullSql) {
                fullSql = 'delete from Messages where' + fullSql;
                SQL.update(fullSql);
            }
        }


        this.respond({
            deletedMessages : messages
        });
    },
    acceptChallenge : function() {
        var acceptingPlayer  = Auth.isAuthenticated(),
            challengeMessageEnvelope = Json.decode(req.data.challengeMessage),
            challengeMessage = challengeMessageEnvelope.message;

//        // TODO : clear all existing challenge Messages
//        var sql = [
//                'select messageId, message, messageType ',
//                ' from Messages ',
//                ' where playerId = ' + acceptingPlayer.playerId,
//                ' and messageType = "challenge"',
//                ' order by messageDate'
//            ].join(''),
//            otherChallenges = SQL.getDataRows(sql);

        debugger;
        var firstPlayerId = challengeMessage.firstPlayer.playerId,
            secondPlayerId =  challengeMessage.secondPlayer.playerId,
            now            = Auth.getTime();

        var game = Schema.putOne('Games', {
            firstPlayerId  : firstPlayerId,
            secondPlayerId : secondPlayerId,
            gameToken      : Util.md5( firstPlayerId + secondPlayerId + now),
            status         : 0,
            lastUpdate     : now,
            currentPlayer  : firstPlayerId
        });

        game.dump();

        Schema.putOne('Messages', {
            playerId    : challengeMessage.secondPlayer.playerId,
            messageType : 'gameStart',
            message     : Json.encode(game),
            messageDate : Auth.getTime()
        });

        this.respond(game)
    },

    recordMove : function() {
        var player     = Auth.isAuthenticated(),
            gameToken  = req.data.gameToken,
            playerId   = player.playerId,
            getGameSql = [
                'Select *',
                ' from games where',
                ' gameToken = "' + gameToken + '"',
                ' and currentPlayer = ' + playerId
            ].join('');

        console.log(getGameSql);
        var game = SQL.getDataRow('Games', getGameSql);

        if (! game) {
            Json.failure({
                message : 'Error! It\'s not your turn!'
            });
        }

        this.respond(game);
    },

    respond : function(data) {
        data.dt = Auth.getTime();

        Json.success(data);
    }
};

function rpc_action() {
    //	console.log('Invoking method ' + req.data.method);
    rpcMethods[req.data.method] && rpcMethods[req.data.method]();
    Json.failure('No such rpc method ' + req.data.method);
}
