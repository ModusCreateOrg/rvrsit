(function() {

    var scripts = document.getElementsByTagName('script'),
        matchRe = /app\.js$/,
        match,
        scriptSrc,
        i,
        len,
        scriptPath;

    for (i = 0, len = scripts.length; i < len; i++) {
        scriptSrc = scripts[i].src;

        match = scriptSrc.match(matchRe);

        if (match) {
            scriptPath = scriptSrc.substring(0, scriptSrc.length - match[0].length);
            break;
        }
    }

    Ext.Loader.setConfig({
        enabled : true
    });

    Ext.application({
        name        : 'Rvrsit',
        appFolder   : scriptPath + '/app',
        controllers : [
            'Settings',
            'ScoreCard',
            'Waiting',
            'Viewport',
            'Register'
        ],
        init        : function() {
            Rvrsit.app = this;
            Rvrsit.heartbeat = new silk.Heartbeat();
        },
        launch      : function() {
            silk.heartbeat_enabled = false;

            //            var n = 0;
            //            Rvrsit.heartbeat.addMethod('echo', {
            //                method   : 'echo',
            //                params   : function() {
            //                    n++;
            //                    return {
            //                        message : 'Hello from client ' + n
            //                    };
            //                },
            //                callback : function(o) {
            //                    //                    console.dir(o);   // will be called once/sec
            //                }
            //            });
            // callbacks have a unique key
            // they are called after the heartbeat methods are all called
            // so a method might store to a global variable or add records
            // to a data store, and the callback can do some sort of update
            // based on that global/store.  Multiple callbacks might look at
            // the same global.
            //            Rvrsit.heartbeat.addCallback('echo', function() {
            //                //                    console.log('callback ' + n);
            //            });
        },

        rpc : function(method, config) {
            config = config || {};
            Ext.Ajax.request({
                method  : 'POST',
                url     : '/rpc',
                params  : Ext.apply(config.params || {}, { method : method }),
                success : function(response) {
                    console.log('RPC RESPONSE:', response.responseText);
                    console.log(arguments);
                    var data = Ext.decode(response.responseText);
                    config.handler && config.handler.call(config.scope || window, data);
                }
            });
        },

        setUser      : function(user) {
            localStorage.setItem('user', Ext.encode(user));
            this.user = user;
        },

        getUser      : function() {
            var thisUser = this.user;
            return thisUser ? thisUser : this.user = Ext.decode(localStorage.getItem('user'));
        }
    });

})();