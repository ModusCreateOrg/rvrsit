/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/4/12
 * Time: 8:59 AM
 * To change this template use File | Settings | File Templates.
 */

console = require('builtin/console');
fs = require('builtin/fs');

rpcMethods = {
    register : function(data) {
        var errors = [];

        console.log('Registering user\n');
        console.log(Util.print_r(data.data));

        if (!data.name.length) {
            errors.push('You must enter a name');
        }

        if (!data.email.length) {
            errors.push('You must enter a valid email address');
        }

        if (errors.length) {
            console.log('registerUser failure' + data.email + ' ' + data.name);
            console.log(errors.join('<br/>\n* '));

            Json.failure({
                message : 'There are errors in your form!',
                errors  : errors
            });
        }

        var user = dataApi.findUser(data);

        if (user) {
            var waitingList = dataApi.getWaitingList(data);
            Json.success({
                message     : 'User authenticated',
                waitingList : waitingList,
                responseDt  : dataApi.getNow(),
                user        : user
            });
        }
        else {
            Json.failure({
                message : 'User already registered!'
            });
        }
    },
    getWaitingList : function(data) {
//        var user = dataApi.findUser(data);

        Json.success(dataApi.getWaitingList(data))
    },
    purgeUsers : function() {
        dataApi.updateUsers([]);
        Json.success({ message : 'Done purging users'});
    }
};

var dataApi = {
    getNow         : function() {
        return Date.now();
    },
    getUsers       : function() {
        var userFile = 'data/users.json',
            fileData = fs.readFile(userFile);

        return Json.decode(fileData);
    },
    getWaitingList : function(askingUser) {
        var users = this.getUsers(),
            waitingList = [],
            waitingStatus = 'waiting',
            askingUserEmail = askingUser.email,
            user;

        console.log('askingUserEmail ' + askingUserEmail);

        for (var i = 0; i < users.length; i++) {
            user = users[i];
            if (user.status == waitingStatus && user.email != askingUserEmail) {
                console.log('user ' + user.email + ' ' + user.name)
                waitingList.push(user);
            }
        }

        return waitingList;
    },
    findUser       : function(userObj) {
        var users = this.getUsers(),
            currentTime = this.getNow(),
            user,
            found;

        for (var i = 0; i < users.length; i++) {
            user = users[i];
            if (!found && (user.name == userObj.name && user.email == userObj.email)) {
                found = user;
            }
        }

        if (!found) {
            user = {
                email     : userObj.email,
                name      : userObj.name,
                status    : 'waiting',
                gameId    : currentTime,
                lastLogin : currentTime
            };
            users.push(user);
        }
        else {
            status = 'waiting';
            user.lastLogin = currentTime;
        }

        this.updateUsers(users);
        return user;
    },
    updateUsers    : function(users) {
        this.writeFile('data/users.json', users);
    },
    writeFile      : function(file, data) {
        fs.writeFile(file, Json.encode(data))
    }
};

var rpc_action = function() {
    var rpcMethod = req.data.method;
    console.log('Invoking method ' + rpcMethod);

    rpcMethods[rpcMethod] && rpcMethods[rpcMethod](req.data);
    Json.failure('No such rpc method ' + rpcMethod);
};

/*
 Below are the old Databases methods.
 */

//
//rpcMethods = {
//	auth: function() {
//		var user = Schema.findOne('Users', {
//			email: req.data.email,
//			password: req.data.password
//		});
//		if (user) {
//			var now = Util.currentTime();
//			var cookie = Util.md5(user.email + user.password + Util.currentTimeMillis());
//			res.setCookie('othello_login', cookie);
//			Schema.putOne('UserSessions', {
//				userId: user.userId,
//				cookie: cookie,
//				loginTime: now,
//				lastActivity: now
//			});
//			Json.success({
//				user: Schema.clean('Users', user)   // removes the password field so it's not sent over the wire.
//			});
//		}
//		else {
//			Json.failure('Either the email address or password you entered are not found in the database');
//		}
//	},
//	registerUser: function() {
//		var errors = [];
//        var data = req.data;
//
//        console.log('before findOne');
//        console.log('print_r' + Util.print_r(Schema.findOne('Users', { email: data.email })));
//        console.log('after findOne');
//
//		if (data.email.length) {
//            var existing = Schema.findOne('Users', {email: data.email });
//            if (existing.email) {
//                errors.push('User with that email address already registered');
//            }
//		}
//
//		// validate form
//		if (!data.name.length) {
//			errors.push('You must enter a name');
//		}
////		if (!user.email.length || user.email.indexOf('@') == -1 || user.email.indexOf('.') == -1) {
//		if (!data.email.length) {
//			errors.push('You must enter a valid email address');
//		}
////		if (!req.data.password.length) {
////			errors.push('You must enter a password');
////		}
////		else if (!req.data.password2.length) {
////			errors.push('You must re-enter your password');
////		}
////		else if (req.data.password !== req.data.password2) {
////			errors.push('The passwords entered do not match');
////		}
//
//
//
//		if (errors.length) {
//            console.log('registerUser failure' + data.email + ' ' + data.name);
//
//            console.log(errors.join('<br/>\n* '));
//			Json.failure('There are errors in your form: <br/>\n* ' + errors.join('<br/>\n* '));
//		}
//        else {
//            console.log('newRecord');
//            var user = Schema.newRecord('Users');
//            user.name = req.data.name;
//            user.email = req.data.email;
//
//            console.log('putOne');
//            user = Schema.putOne('Users', user);
//            console.log('registerUser Success' + user.email + ' ' + user.name);
//            Json.success({
//                user: Schema.clean('Users', user)
//            });
//        }
//	}
//};
