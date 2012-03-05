Ext.define('Command.module.generate.Model', {
    extend: 'Command.module.generate.Generator',

    description: 'Automates the generation of a new Model',
    
    execute: function(args) {
        var path = require('path');
        
        args = Ext.apply(args, this.getProjectDetails());
        
        this.mkdir(
            path.join('app'),
            path.join('app', 'model')
        );
        
        this.template('model.js', path.join('app', 'model', args.name + '.js'));
        this.addToApp('models', args.name);
    }
});