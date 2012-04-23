Config.documentRoot = 'docroot';
Config.numChildren = 25;
Config.port = 9090;


Config.mysql = {
	host: 'localhost',
	user: 'root',
	passwd: '',
	db: 'othello'
};

SQL = new MySQL();
SQL.connect();

Server = require('Server');
Schema = require('Schema');


//include('actions/DataApi.js');
include('actions/rpc_action.js');
include('actions/heartbeat_action.js');





HttpChild.requestHandler = function() {  };
