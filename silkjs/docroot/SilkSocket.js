// Heartbeat.js
Ext.namespace('silk');

silk.HEARTBEAT_TIME = 1; // heartbeat frequency in seconds
silk.heartbeatUrl = '/HeartbeatService';

silk.heartbeats = 0;
silk.servertime = 0;
silk.heartbeat_enabled = false;
silk.heartbeat_inprogress = false;
silk.isPublishing = false;

/**
 * @class silk.Heartbeat
 */
silk.Heartbeat = function() {
	// callbacks are simply called once per heartbeat
	var callbacks = {};
	this.addCallback = function(key, func) {
		callbacks[key] = func;
	};
	this.removeCallback = function(key) {
		delete callbacks[key];
	};

	// methods are RPC calls to the server
	var queue = {};
	this.addMethod = function(key, config) {
		queue[key] = config;
	};
	this.removeMethod = function(key) {
		delete queue[key];
	};

	function DoHeartbeat() {
		if (silk.heartbeat_inprogress || !silk.heartbeat_enabled) {
			return;
		}
		silk.heartbeat_inprogress = true;
		var params = [];
		var keys = [];
		var methods = [];
		for (var key in queue) {
			var parm = queue[key].params();
			params.push(parm);
			keys.push(key);
			methods.push(queue[key].method);
		}
		Ext.Ajax.request({
			url: silk.heartbeatUrl,
			params: {
				keys: Ext.util.JSON.encode(keys),
				params: Ext.util.JSON.encode(params),
				methods: Ext.util.JSON.encode(methods)
			},
			success: function(result) {
				var data = Ext.decode(result.responseText);
				if (data.data) {
					data = data.data;
				}
				for (var key in data) {
					if (queue[key] && queue[key].callback) {
						queue[key].callback(data[key]);
					}
				}
				for (var key in callbacks) {
					callbacks[key]();
				}
				silk.heartbeat_inprogress = false;
				silk.heartbeats++;
			},
			failure: function() {
				silk.heartbeat_inprogress = false;
			}
		});
	}
	this.Force = function() {
		DoHeartbeat();
	};

//	this.addMethod('servertime', {
//		method: 'serverTime',
//		params: function() {
//			return {}; // no params
//		},
//		callback: function(data) {
//			silk.servertime = parseInt(data);
//		}
//	});

	var hbTask = null;
	this.newHeartbeatTime = function(hbTime) {
		silk.HEARTBEAT_TIME = hbTime;
		if (hbTask) {
			Ext.TaskMgr.stop(hbTask);
			hbTask = null;
		}
		DoHeartbeat();
		hbTask = Ext.TaskMgr.start({
			interval: silk.HEARTBEAT_TIME * 1000,
			run: function() {
				if (!silk.heartbeat_enabled || silk.heartbeat_inprogress) {
					return;
				}
				DoHeartbeat();
			}
		});
	};

	this.newHeartbeatTime(silk.HEARTBEAT_TIME);
	return this;
};
