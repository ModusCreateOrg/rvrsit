/**
 * @private
 */
Ext.define('Ext.device.geolocation.Abstract', {
    extend: 'Ext.Evented',

    config: {
        /**
         * @cfg {Number} maximumAge
         * This option indicates that the application is willing to accept cached location information whose age
         * is no greater than the specified time in milliseconds. If maximumAge is set to 0, an attempt to retrieve
         * new location information is made immediately.
         */
        maximumAge: 0,

        /**
         * @cfg {Number} frequency The default frequency to get the current position when using {@link #watchPosition}.
         */
        frequency: 10000,

        /**
         * @cfg {Boolean} allowHighAccuracy True to allow high accuracy when getting the current position.
         */
        allowHighAccuracy: false,

        /**
         * @cfg {Number} timeout
         * The maximum number of milliseconds allowed to elapse between a location update operation.
         */
        timeout: Infinity
    },

    /**
     * Attempts to get the current position of this device.
     *
     * Ext.device.Geolocation.getCurrentPosition({
     *     success: function(position) {
     *         console.log(position);
     *     },
     *     failure: function() {
     *         Ext.Msg.alert('Geolocation', 'Something went wrong!');
     *     }
     *  });
     *
     * *Note:* If you want to watch the current position, you could use {@link #watch} instead.
     *
     * @cfg {Object} config
     *
     * @cfg {Function} config.success
     * The function to call when the location of the current device has been received.
     *
     * @cfg {Object} config.success.position
     *
     * @cfg {Function} config.failure
     * The function that is called when something goes wrong.
     *
     * @cfg {Object} config.scope
     * The scope of the `success` and `failure` functions.
     *
     * @cfg {Number} config.maximumAge
     * The maximum age of a cached location. If you do not enter a value for this, the value of {@link #maximumAge}
     * will be used.
     *
     * @cfg {Number} config.timeout
     * The timeout for this request. If you do not specify a value, it will default to {@link #timeout}.
     *
     * @cfg {Boolean} config.allowHighAccuracy
     * True to enable allow accuracy detection of the location of the current device. If you do not specify a value, it will
     * default to {@link #allowHighAccuracy}.
     *
     */
    getCurrentPosition: function(config) {
        var defaultConfig = Ext.device.geolocation.Abstract.prototype.config;

        config = Ext.applyIf({
            maximumAge: defaultConfig.maximumAge,
            frequency: defaultConfig.frequency,
            allowHighAccuracy: defaultConfig.allowHighAccuracy,
            timeout: defaultConfig.timeout
        }, config);

        // <debug>
        if (!config.success) {
            Ext.Logger.warn('You need to specify a `success` function for #getCurrentPosition');
        }
        // </debug>

        return config;
    },

    /**
     * Watches for the current position and calls the callback when successful depending on the specified frequency.
     *
     * @cfg {Object} config
     *
     * @cfg {Function} config.callback
     * The function to be called when the position has been updated.
     *
     * @cfg {Function} config.failure
     * The function that is called when something goes wrong.
     *
     * @cfg {Object} config.scope
     * The scope of the `success` and `failure` functions.
     *
     * @cfg {Boolean} config.frequency
     * The frequency in which to call the supplied callback. Defaults to {@link #frequency} if you do not specify a value.
     *
     * @cfg {Boolean} config.allowHighAccuracy
     * True to enable allow accuracy detection of the location of the current device. If you do not specify a value, it will
     * default to {@link #allowHighAccuracy}.
     */
    watchPosition: function(config) {
        var defaultConfig = Ext.device.geolocation.Abstract.prototype.config;

        config = Ext.applyIf({
            maximumAge: defaultConfig.maximumAge,
            frequency: defaultConfig.frequency,
            allowHighAccuracy: defaultConfig.allowHighAccuracy,
            timeout: defaultConfig.timeout
        }, config);

        // <debug>
        if (!config.callback) {
            Ext.Logger.warn('You need to specify a `callback` function for #watchPosition');
        }
        // </debug>

        return config;
    },

    /**
     * If you are currently watching for the current position, this will stop that.
     */
    clearWatch: Ext.emptyFn
});
