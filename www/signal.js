/* Signal Custom Plugin 
 *
 *
 *
 */

var argscheck = require('cordova/argscheck'),
    channel = require('cordova/channel'),
    utils = require('cordova/utils'),
    exec = require('cordova/exec'),
    cordova = require('cordova');

channel.createSticky('onCordovaInfoReady');
// Tell cordova channel to wait on the CordovaInfoReady event
channel.waitForInitialization('onCordovaInfoReady');

/*
 * Custom signal object to get and store the values of advanced signal information returned from native code
 * Properties include:
 * 1. IMEI
 * 2. Operator Name
 * 3. CellID latched to
 * 4. LAC of the current CellID
 * 5. Neighboring Cell Sites
 */

function Signal() {
    this.available = false;
    this.imei = null;
    this.operator = null;
    this.cellID = null;
    this.lac = null;
    this.neighbors = null;

    var me = this;

    channel.onCordovaReady.subscribe(function() {
        me.getAdvancedNetworkInfo(function(info) {
            me.available = true;
            me.imei = info.imei;
            me.operator = info.operator;
            me.cellID = info.cellID;
            me.lac = info.lac;
            me.neighbors = info.neighbors;
            channel.onCordovaInfoReady.fire();
        }, function(e) {
            me.available = false;
            utils.alert("[ERROR] Error initializing Cordova: " + e);
        });
    });

}

/*Get the information using the getAdvancedNetworkInfo method defined above,
 * use cordova.exec to initiate the native code underneath
 */

Signal.prototype.getAdvancedNetworkInfo = function(successCallback, errorCallback) {
    argscheck.checkArgs('Network', 'Signal.getAdvancedNetworkInfo', arguments);
    exec(successCallback, errorCallback, 'Signal', 'getSignalInfo', []);
};

module.exports = new Signal();

/*var signal = {
    getSignalInfo: function() {
        cordova.exec(null, null, 'Signal', 'getSignalInfo', []);
    }
}

module.exports = signal;*/