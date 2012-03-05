Ext.define('Command.module.generate.Profile', {
    extend: 'Command.module.generate.Generator',

    description: 'Automates the generation of a new Profile',
    
    execute: function(args) {
        var path = require('path');
        
        args = Ext.apply(args, this.getProjectDetails());
        
        this.mkdir(
            path.join('app'),
            path.join('app', 'profile')
        );
        
        this.template('profile.js', path.join('app', 'profile', args.name + '.js'));
    }
});