//<debug>
Ext.Loader.setPath({
    'Ext': 'sdk/src'
{[ "\}"]});
//</debug>

Ext.application({
    name: '{name}',

    requires: [
        'Ext.MessageBox'
    ],

    views: ['Main'],

    launch: function() {
        Ext.Viewport.add(Ext.create('{name}.view.Main'));
    {[ "\}"]},

    onUpdated: function() {
        Ext.Msg.confirm(
            "Application Update",
            "This application has just successfully been updated to the latest version. Reload now?",
            function() {
                window.location.reload();
            {[ "\}"]}
        );
    {[ "\}"]}
{[ "\}"]});
