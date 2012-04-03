Config.documentRoot = 'docroot';
Config.numChildren = 25;


include('server/DataApi.js');
include('server/rpc_action.js');
include('server/heartbeat_action.js');

console = require('builtin/console');

HttpChild.requestHandler = function() {  };
