/**
 * Created by JetBrains WebStorm.
 * User: mschwartz
 * Date: 2/4/12
 * Time: 8:59 AM
 * To change this template use File | Settings | File Templates.
 */

console = require('builtin/console');

rpcMethods = {
	auth: function() {
		var user = Schema.findOne('Users', {
			email: req.data.email,
			password: req.data.password
		});
		if (user) {
			var now = Util.currentTime();
			var cookie = Util.md5(user.email + user.password + Util.currentTimeMillis());
			res.setCookie('othello_login', cookie);
			Schema.putOne('UserSessions', {
				userId: user.userId,
				cookie: cookie,
				loginTime: now,
				lastActivity: now
			});
			Json.success({
				user: Schema.clean('Users', user)
			});
		}
		else {
			Json.failure('Either the email address or password you entered are not found in the database');
		}
	},
	registerUser: function() {
		var errors = [];

		var user = Schema.newRecord('Users');
		user.name = req.data.name;
		user.email = req.data.email;
		user.gameName = req.data.gameName;
		user.password = req.data.password;
		if (user.email.length && Schema.findOne('Users', {email: user.email })) {
			errors.push('User with that email address already registered');
		}

		// validate form
		if (!user.name.length) {
			errors.push('You must enter a name');
		}
		if (!user.email.length || user.email.indexOf('@') == -1 || user.email.indexOf('.') == -1) {
			errors.push('You must enter a valid email address');
		}
		if (!user.gameName.length) {
			errors.push('You must enter a game name');
		}
		if (!req.data.password.length) {
			errors.push('You must enter a password');
		}
		else if (!req.data.password2.length) {
			errors.push('You must re-enter your password');
		}
		else if (req.data.password !== req.data.password2) {
			errors.push('The passwords entered do not match');
		}
		if (errors.length) {
			Json.failure('There are errors in your form: <br/>\n* ' + errors.join('<br/>\n* '));
		}
		user = Schema.putOne('Users', user);
		Json.success({
			user: Schema.clean('Users', user)
		});
	}
};

function rpc_action() {
	console.log('Invoking method ' + req.data.method);
	rpcMethods[req.data.method] && rpcMethods[req.data.method]();
	Json.failure('No such rpc method ' + req.data.method);
}
