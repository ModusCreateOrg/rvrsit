Config.documentRoot = 'docroot';
Config.numChildren = 25;
//Config.mysql = {
//	host: 'localhost',
//	user: 'othello',
//	passwd: '',
//	db: 'othello'
//};

include('rpc_action.js');
//include('heartbeat_action.js');

HttpChild.requestHandler = function() {
//	var now = Util.currentTime();
//
//    if (req.data.othello_login) {
//		SQL.update('update UserSessions set lastActivity='+SQL.quote(now)+' where cookie='+SQL.quote(req.data.othello_login));
//		res.data.user = Schema.findOne('UserSessions', { cookie: req.data.othello_login});
//		res.data.user = Util.apply(res.data.user, Schema.findOne('Users', { userId: res.data.user.userId }));
//	}
//    console.log('requestHandler');
};

