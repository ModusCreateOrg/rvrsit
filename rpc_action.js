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
				user: Schema.clean('Users', user)   // removes the password field so it's not sent over the wire.
			});
		}
		else {
			Json.failure('Either the email address or password you entered are not found in the database');
		}
	},
	registerUser: function() {
		var errors = [];
        var data = req.data;

//console.log(Util.print_r(Schema.findOne('Users', { email: data.email })));
		if (data.email.length) {
      var existing = Schema.findOne('Users', {email: data.email });
      if (existing.email) {
  			errors.push('User with that email address already registered');
      }
		}

		// validate form
		if (!data.name.length) {
			errors.push('You must enter a name');
		}
//		if (!user.email.length || user.email.indexOf('@') == -1 || user.email.indexOf('.') == -1) {
		if (!data.email.length) {
			errors.push('You must enter a valid email address');
		}
//		if (!req.data.password.length) {
//			errors.push('You must enter a password');
//		}
//		else if (!req.data.password2.length) {
//			errors.push('You must re-enter your password');
//		}
//		else if (req.data.password !== req.data.password2) {
//			errors.push('The passwords entered do not match');
//		}



		if (errors.length) {
            console.log('registerUser failure' + data.email + ' ' + data.name);

            console.log(errors.join('<br/>\n* '));
			Json.failure('There are errors in your form: <br/>\n* ' + errors.join('<br/>\n* '));
		}
        else {
            var user = Schema.newRecord('Users');
            user.name = req.data.name;
            user.email = req.data.email;

            user = Schema.putOne('Users', user);
            console.log('registerUser Success' + user.email + ' ' + user.name);
            Json.success({
                user: Schema.clean('Users', user)
            });

        }

	}
};

function rpc_action() {
//	console.log('Invoking method ' + req.data.method);
	rpcMethods[req.data.method] && rpcMethods[req.data.method]();
	Json.failure('No such rpc method ' + req.data.method);
}
