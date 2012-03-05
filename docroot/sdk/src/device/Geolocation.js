/**
 *
 *
 * - Sencha Packager
 * - (PhoneGap)[http://docs.phonegap.com/en/1.4.1/phonegap_device_device.md.html]
 * - Simulator
 *
 * @mixins Ext.device.geolocation.Abstract
 *
 * @aside guide native_apis
 */
Ext.define('Ext.device.Geolocation', {
    singleton: true,

    requires: [
        'Ext.device.Communicator',
        // 'Ext.device.geolocation.PhoneGap',
        'Ext.device.geolocation.Sencha',
        'Ext.device.geolocation.Simulator'
    ],

    constructor: function() {
        var browserEnv = Ext.browser.is;

        if (browserEnv.WebView) {
            if (browserEnv.PhoneGap) {
                return Ext.create('Ext.device.geolocation.PhoneGap');
            }
            else {
                return Ext.create('Ext.device.geolocation.Sencha');
            }
        }
        else {
            return Ext.create('Ext.device.geolocation.Simulator');
        }
    }
});
