/**
 * Created by JetBrains WebStorm.
 * Player: mschwartz
 * Date: 2/4/12
 * Time: 8:59 AM
 * To change this template use File | Settings | File Templates.
 */

console = require('builtin/console');

rpcMethods = {
    updateSession : function(userSession) {
        if (! userSession) {
            return;
        }

        userSession.lastActivity = this.getTime();

        Schema.putOne('PlayerSessions', userSession);
    },

    isAuthenticated : function() {
        var cookie;

        if ( ! res.data.player || ! (cookie = res.data.player.cookie) ) {
            Json.failure({msg: 'Need cookie! Om nom nom!'});
        }

        var existing = Schema.findOne('PlayerSessions', {
            cookie : cookie
        });


        if (! existing) {
            Json.failure({msg: 'Need cookie! Om nom nom!'});
        }

        this.updateSession(existing);

        return existing;
    },

    auth : function() {

        if (! req.data.name || ! req.data.email) {
             Json.failure('user name and email are required!');
        }

        var user = Schema.findOne('Players', {
            name     : req.data.name,
            email    : req.data.email
        });

        if (user) {
            var now = this.getTime(),
                cookie;

            if (! res.data.player || ! (cookie = res.data.player.cookie) ) {
                cookie = Util.md5(user.email + now);
                res.setCookie('othello_login', cookie);
            }

            SQL.update('delete from PlayerSessions where playerId = ' + user.playerId);

            Schema.putOne('PlayerSessions', {
                playerId       : user.playerId,
                cookie       : cookie,
                loginTime    : now,
                gameId       : null,
                lastActivity : now
            });

            this.respond({
                user : Schema.clean('Players', user)   // removes the password field so it's not sent over the wire.
            });
        }
        else {
            Json.failure('Either the email address or password you entered are not found in the database');
        }
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

    listAvailablePlayers : function() {
        var existing = this.isAuthenticated(),
            twoMinutesAgo = this.getTime() - 560,
            sql = [
                'select distinct PlayerSessions.playerId, Players.name',
                ' from PlayerSessions, Players',
                ' where PlayerSessions.gameId is NULL and PlayerSessions.playerId = Players.playerId and PlayerSessions.playerId != ' + existing.playerId,
                ' and PlayerSessions.lastActivity > ' + twoMinutesAgo
            ].join('');


        var players = SQL.getDataRows(sql);

        this.respond({
            availablePlayers : players
        });
    },

    listGames : function() {
        if (! this.isAuthenticated()) {
            Json.failure({msg: 'Need cookie! Om nom nom!'});
        }

        var items = SQL.getDataRows("select * from games where status = 0;");
        this.respond({
            games : items
        });
    },
    respond : function(data) {
        data.dt = this.getTime();

        Json.success(data);
    },
    getTime : function() {
        return Math.floor(new Date().getTime() / 1000)
    },
    challengePlayer : function() {
        var opponentPlayerId = req.data.playerId,
            player           = Schema.findOne('Players', {
                playerId : this.isAuthenticated().playerId
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
            messageDate : this.getTime()
        });

        Json.success({
            firstPlayer  : opponent,
            secondPlayer : player
        });
    },
    getMessages : function() {
        var player   = this.isAuthenticated(),
            messages = SQL.getDataRows('select messageId, message, messageType from Messages where playerId = ' + player.playerId + ' order by messageDate');

        messages.each(function(message) {
            message.message = Json.decode(message.message);
        });

        Json.success({
            messages : messages
        });
    },
    ackMessages : function() {
        var player     = this.isAuthenticated(),
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


        Json.success({
            deletedMessages : messages
        });
    },
    acceptChallenge : function() {
        var acceptingPlayer  = this.isAuthenticated(),
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
            now            = this.getTime();

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
            messageDate : this.getTime()
        });

        Json.success(game)
    },
    recordMove : function() {
        var player     = this.isAuthenticated(),
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

        Json.success(game);
    }
};

function rpc_action() {
    //	console.log('Invoking method ' + req.data.method);
    rpcMethods[req.data.method] && rpcMethods[req.data.method]();
    Json.failure('No such rpc method ' + req.data.method);
}
