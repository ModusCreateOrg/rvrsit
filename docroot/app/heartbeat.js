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
    heartbeatId : 0,
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
            if (me.inProgress || !me.enabled) {
                //                console.log("HB not enabled!")
                return;
            }
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
            console.log('HB :: ' + Math.floor(new Date().getTime() / 1000))
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

                    if (!data.success) {
                        // TODO : merge into this success method & make failure something more general!
                        options.failure.apply(me, arguments);
                        return;
                    }

                    if (data.data) {
                        data = data.data;
                    }

                    for (key in data) {
                        //                        debugger;
                        queueItem = queue[key];
                        if (queueItem && queueItem.success) {
                            queueItem.success.call(queueItem.scope || window, data[key]);
                        }
                    }

                    for (key in callbacks) {
                        callbacks[key].call(scopes[key] || window, data);
                    }
                },
                failure  : function(result, options) {
                    //                    debugger;
                    //                    console.log('hb failure');
                    var data = Ext.decode(result.responseText),
                        queueItem;

                    if (data.data) {
                        data = data.data;
                    }

                    for (key in data) {
                        //                        debugger;
                        queueItem = queue[key];
                        if (queueItem && queueItem.failure) {
                            queueItem.failure.call(queueItem.scope || window, data[key]);
                        }
                    }

                    //                    Ext.Msg.alert('Request failed:', data.message);
                },
                callback : function() {
                    //                    console.log('heartbeat done :: ' + me.heartbeatId, arguments);
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

        me.stop = function() {
            if (hbTask) {
                Ext.TaskManager.stop(hbTask);
                hbTask = null;
            }
        };

        me.start = function(hbTime) {
            me.time = hbTime || me.time;
            me.stop();
            doHeartbeat();

            hbTask = Ext.TaskManager.start({
                interval : me.time * 1000,
                run      : function() {
                    if (!me.enabled || me.inProgress) {
                        return;
                    }
                    doHeartbeat();
                }
            });
        };

        //        me.start(me.time);
    },
    enable      : function() {
        this.enabled = true;
    },

    disable : function() {
        this.enabled = false;
    }
});
