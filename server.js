Config.documentRoot = 'docroot';
Config.numChildren = 25;

include('DataApi.js');
include('rpc_action.js');
include('heartbeat_action.js');


console = require('builtin/console');

HttpChild.requestHandler = function() {  };
