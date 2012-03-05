Ext.define('Command.module.Package', {
    extend: 'Command.module.Abstract',
    description: "Packages a Sencha Touch 2 application for native app stores",
    
    actions: {
        generate: [
            "Generates a Packager configuration JSON file",
            ['path', 'p', 'What to call the configuration file', 'string', 'packager.json', 'myconfigfile.json']
        ],
        
        build: [
            "Packages an app with the given configuration JSON file",
            ['path', 'p', 'What to call the configuration file', 'string', 'packager.json', 'myconfigfile.json']
        ],
        
        run: [
            "Packages and tries to run the application for the given configuration JSON file",
            ['path', 'p', 'What to call the configuration file', 'string', 'packager.json', 'myconfigfile.json']
        ]
    },
    
    generate: function(fileName) {
        var exec = require('child_process').exec,
            me = this;
        
        exec('stbuild generate ' + fileName, function(error, stdout, stderr) {
            if (stdout) {
                me.cli.info(stdout);
            }
            
            if (stderr) {
                me.cli.warn(stderr);
            }
        });
    },
    
    build: function(fileName) {
        var exec = require('child_process').exec,
            me = this;
        
        exec('stbuild package ' + fileName, function(error, stdout, stderr) {
            if (stdout) {
                me.cli.info(stdout);
            }
            
            if (stderr) {
                me.cli.warn(stderr);
            }
        });
    },
    
    run: function(fileName) {
        var exec = require('child_process').exec,
            me = this;
        
        exec('stbuild run ' + fileName, function(error, stdout, stderr) {
            if (stdout) {
                me.cli.info(stdout);
            }
            
            if (stderr) {
                me.cli.warn(stderr);
            }
        });
    }
});