Config.documentRoot = 'docroot';
Config.numChildren = 25;
Config.mysql = {
	host: 'localhost',
	user: 'mschwartz',
	passwd: '',
	db: 'othello'
};

include('rpc_action.js');

SQL = new MySQL();
SQL.connect();

Schema.add({
	name: 'Users',
	fields: [
		{ name: 'userId', type: 'int', autoIncrement: true },
		{ name: 'name', type: 'varchar', size: 128 },
		{ name: 'email', type: 'varchar', size: 128 },
		{ name: 'gameName', type: 'varchar', size: 128 },
		{ name: 'password', type: 'varchar', size: 128, serverOnly: true }  // serverOnly: true means Schema.clean() will remove this field from a record
	],
	primaryKey: 'userId',
	indexes: [
		'email',
		'gameName'
	]
});

Schema.add({
	name: 'UserSessions',
	fields: [
		{ name: 'userId', type: 'int' },
		{ name: 'cookie', type: 'varchar', size: 32 },
		{ name: 'state', type: 'int' },
		{ name: 'loginTime', type: 'int' },
		{ name: 'lastActivity', type: 'int' }
	],
	primaryKey: 'cookie',
	engine: 'memory'
});

HttpChild.requestHandler = function() {
	var now = Util.currentTime();
	if (req.data.othello_login) {
		SQL.update('update UserSessions set lastActivity='+SQL.quote(now)+' where cookie='+SQL.quote(req.data.othello_login));
		res.data.user = Schema.findOne('UserSessions', { cookie: req.data.othello_login});
		res.data.user = Util.apply(res.data.user, Schema.findOne('Users', { userId: res.data.user.userId }));
	}
}

