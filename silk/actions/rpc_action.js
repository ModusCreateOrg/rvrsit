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

    listGames : function() {
        if (!Auth.isAuthenticated('listGames')) {
            Json.failure({
                errcode : 1,
                msg     : 'Need cookie! Om nom nom!'
            });
        }

        var items = SQL.getDataRows("select * from games where status = 0;");
        this.respond({
            games : items
        });
    },

    listAvailablePlayers : function() {
        var existing = Auth.isAuthenticated('listAvailablePlayers'),
            twoMinutesAgo = Auth.getTime() - 560,
            sql = [
                'select distinct PlayerSessions.playerId, Players.name, PlayerSessions.lastActivity',
                ' from PlayerSessions, Players',
                ' where PlayerSessions.gameId is NULL and PlayerSessions.playerId = Players.playerId and PlayerSessions.playerId != ' + existing.playerId,
                ' and PlayerSessions.lastActivity > ' + twoMinutesAgo
            ].join('');

        var players = SQL.getDataRows(sql),
            now = new Date().getTime(),
            dateObj = new Date(),
            diff;

        players.each(function(player) {
            diff = Math.floor(now - (player.lastActivity * 1000));
            dateObj.setTime(diff);

            player.lastActivity = dateObj.getSeconds()
        });

        this.respond({
            availablePlayers : players
        });
    },
    challengePlayer      : function() {
        var opponentPlayerId = req.data.playerId,
            player = Schema.findOne('Players', {
                playerId : Auth.isAuthenticated('challengePlayer').playerId
            }),
            opponent = Schema.findOne('Players', {
                playerId : opponentPlayerId
            }),
            message = {
                firstPlayer  : {
                    name     : opponent.name,
                    playerId : opponent.playerId
                },
                secondPlayer : {
                    name     : player.name,
                    playerId : player.playerId
                }
            };

        if (player.playerId == opponent.playerId) {
            Json.failure({
                message : 'Silly rabbit! You can\' challenge yourself!  That\'s what two-player local mode is for!'
            });
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

    ackMessages     : function() {
        debugger;
        var player = Auth.isAuthenticated('ackMessages'),
            messages = Json.decode(req.data.messages),
            messageSql = ' messageId = ',
            andSql = ' and playerId = ' + player.playerId,
            or = ' OR ',
            fullSql = '';

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
        console.log(req.data.challengeMessage);
        var acceptingPlayer = Auth.isAuthenticated('acceptChallenge'),
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
        var firstPlayerId = acceptingPlayer.playerId,
            secondPlayerId = challengeMessage.secondPlayer.playerId,
            now = Auth.getTime();

        var game = Schema.putOne('Games', {
            firstPlayerId  : firstPlayerId,
            secondPlayerId : secondPlayerId,
            gameToken      : Util.md5(firstPlayerId + secondPlayerId + now),
            status         : 0,
            lastUpdate     : now,
            currentPlayer  : firstPlayerId
        });

        game.dump();

        game.firstPlayer = Schema.findOne('Players', {
            playerId  : firstPlayerId
        });

        delete game.firstPlayer.email;

        game.secondPlayer = Schema.findOne('Players', {
            playerId : secondPlayerId
        });

        delete game.secondPlayer.email;

        Schema.putOne('Messages', {
            playerId    : challengeMessage.secondPlayer.playerId,
            messageType : 'gameStart',
            message     : Json.encode(game),
            messageDate : Auth.getTime()
        });

        this.respond({
            game : game
        });
    },

    declineChallenge : function() {
        console.log(req.data.challengeMessage);
        var acceptingPlayer = Auth.isAuthenticated('acceptChallenge'),
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



        Schema.putOne('Messages', {
            playerId    : challengeMessage.secondPlayer.playerId,
            messageType : 'challengeDeclined',
            message     : challengeMessage,
            messageDate : Auth.getTime()
        });

        this.respond({success : true});
    },


    recordMove : function() {
        var player = Auth.isAuthenticated(''),
            gameToken = req.data.gameToken,
            playerId = player.playerId,
            getGameSql = [
                'Select *',
                ' from games where',
                ' gameToken = "' + gameToken + '"',
                ' and currentPlayer = ' + playerId
            ].join('');

        console.log(getGameSql);
        var game = SQL.getDataRow('Games', getGameSql);

        if (!game) {
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
    //    debugger;
    console.log('RPC :: ' + req.data.method + '();');
    var data = req.data,
        methodName = data.method;
    rpcMethods[methodName] && rpcMethods[methodName]();
    Json.failure('No such rpc method ' + methodName);
}
