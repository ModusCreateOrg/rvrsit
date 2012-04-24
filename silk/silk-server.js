Config.documentRoot = '../docroot';
Config.numChildren = 25;
Config.port = 9090;
Config.mysql = {
	host: 'localhost',
	user: 'root',
	passwd: '',
	db: 'othello'
};


Server = require('Server');
Schema = require('Schema');

SQL = new MySQL();
SQL.connect();


Auth = require('Auth.js');
include('schemas.js');
include('actions/heartbeat_action.js');
include('actions/rpc_action.js');


//include('actions/heartbeat.js');

HttpChild.requestHandler = function() {
	var now = Util.currentTime();
	if (req.data.othello_login) {
		SQL.update('update PlayerSessions set lastActivity='+ SQL.quote(now) +' where cookie=' + SQL.quote(req.data.othello_login));
		res.data.player = Schema.findOne('PlayerSessions', { cookie: req.data.othello_login });
		res.data.player = Util.apply(res.data.player, Schema.findOne('Players', { playerId: res.data.player.playerId }));
	}
};

