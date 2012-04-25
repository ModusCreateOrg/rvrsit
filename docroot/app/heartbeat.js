// Heartbeat.js

/**
 * @class silk.Heartbeat
 */

Ext.define('silk.Heartbeat', {
    singleton   : true,
    requires    : [
        'Ext.Ajax'
    ],
    enabled     : true,
    heartbeatId  : 0,
    time        : 1,
    url         : '/heartbeat',
    inProgress  : false,
    constructor : function() {
        // callbacks are simply called once per heartbeat
        var me = this,
            callbacks = {},
            scopes = {};

        me.addCallback = function(key, func, scope) {
            callbacks[key] = func;
            scopes[key] = scope || window;

        };

        me.removeCallback = function(key) {
            delete callbacks[key];
            delete scopes[key];
        };

        // methods are RPC calls to the server
        var queue = {};
        me.addMethod = function(key, config) {
            queue[key] = config;
            return me;
        };

        me.removeMethod = function(key) {
            delete queue[key];
        };

        function doHeartbeat() {
//            console.log('doHeartbeat called')
            if (me.inProgress || !me.enabled) {
                return;
            }
            console.log('heartbeat in progress :: ' + me.heartbeatId);
            me.inProgress = true;
            var params = [],
                keys = [],
                methods = [],
                key,
                myParams,
                parm;

            for (key in queue) {
                myParams = queue[key].params;
                parm = Ext.isFunction(myParams) ? myParams() : myParams;

                params.push(parm);
                keys.push(key);
                methods.push(queue[key].method);
            }

            Ext.Ajax.request({
                url      : me.url,
                scope    : me,
                params   : {
                    keys    : Ext.encode(keys),
                    params  : Ext.encode(params),
                    methods : Ext.encode(methods)
                },
                success  : function(result, options) {
                    var data = Ext.decode(result.responseText),
                        key,
                        queueItem;

                    if (! data.success) {
                        options.failure.apply(me, arguments)
                    }

                    if (data.data) {
                        data = data.data;
                    }
                    // why?
                    for (key in data) {
                        queueItem = queue[key];
                        if (queueItem && queueItem.callback) {
                            queueItem.callback.call(queueItem.scope || window, data[key]);
                        }
                    }

                    for (key in callbacks) {
                        callbacks[key].call(scopes[key] || window, data);
                    }
                },
                failure  : function(result) {
                    var data = Ext.decode(result.responseText);
                    Ext.Msg.alert('Request failed:', data.message);
                },
                callback : function() {
                    console.log('heartbeat done :: ' + me.heartbeatId);
//                    console.log(arguments);
                    me.heartbeatId++;
                    me.inProgress = false;
                }
            });
        }

        me.force = function() {
            doHeartbeat();
        };

        //    this.addMethod('servertime', {
        //        method   : 'serverTime',
        //        params   : function() {
        //            return {}; // no params
        //        },
        //        callback : function(data) {
        //            this.servertime = parseInt(data);
        //        }
        //    });

        var hbTask = null;

        me.newHeartbeatTime = function(hbTime) {
            me.time = hbTime;
            if (hbTask) {
                Ext.TaskMgr.stop(hbTask);
                hbTask = null;
            }
            doHeartbeat();

            hbTask = Ext.TaskMgr.start({
                interval : me.time * 1000,
                run      : function() {
                    if (!this.enabled || this.inProgress) {
                        return;
                    }
                    doHeartbeat();
                }
            });
        };

        me.newHeartbeatTime(me.time);
    },
    enable      : function() {
        this.enabled = true;
    },

    disable : function() {
        this.enabled = true;
    }
});
