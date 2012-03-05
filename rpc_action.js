/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/4/12
 * Time: 8:59 AM
 * To change this template use File | Settings | File Templates.
 */

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

        var user = DataApi.findUser(data);

        if (user) {
            var waitingList = DataApi.getWaitingList(data);
            Json.success({
                message     : 'User authenticated',
                waitingList : waitingList,
                responseDt  : DataApi.getNow(),
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
//        var user = DataApi.findUser(data);

        Json.success(DataApi.getWaitingList(data))
    },
    purgeUsers : function() {
        DataApi.updateUsers([]);
        Json.success({ message : 'Done purging users'});
    },
    getStatus : function() {

    },
    updateGame : function(data) {
        console.log('updateGame called');
        console.log(Util.print_r(data));
        var chipData = Json.decode(data.chipData);
        DataApi.updateGame('test', chipData);
        Json.success({ message : 'OK', chipData: chipData})
    }
};


var rpc_action = function() {
    var rpcMethod = req.data.method;
    console.log('\n' + Date.now() + ' RPC ::  ' + rpcMethod);

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
