exports = {
     updateSession : function(userSession) {
        if (! userSession) {
            return;
        }

        userSession.lastActivity = this.getTime();

        Schema.putOne('PlayerSessions', userSession);
    },

    isAuthenticated : function(callerFn) {

        var resp = {
                errcode : 1,
                message : 'Need cookie! Om nom nom! (cannot find your session)'
            },
            wrapperObj = {},
            cookie;

        wrapperObj[callerFn] = resp;


        if ( ! res.data.player || ! (cookie = res.data.player.cookie) ) {
            Json.failure(wrapperObj);
        }

        var existing = Schema.findOne('PlayerSessions', {
            cookie : cookie
        });

        if (! existing) {
            Json.failure(wrapperObj);
        }


        console.log('isAuthenticated ' + callerFn + ' playerId :: ' + existing.playerId);

        this.updateSession(existing);

        return existing;
    },

    auth : function() {
        debugger;
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
                playerId     : user.playerId,
                cookie       : cookie,
                loginTime    : now,
                gameId       : null,
                lastActivity : now
            });

            return {
                user : Schema.clean('Players', user)   // removes the password field so it's not sent over the wire.
            };
        }
        else {
            return this.registerPlayer();
        }

    },
    registerPlayer : function() {
        var errors = [];
        var data = req.data;

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

            return this.auth();
        }
    },
    getTime : function() {
        return Math.floor(new Date().getTime() / 1000)
    }
};