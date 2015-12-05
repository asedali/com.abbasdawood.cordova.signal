/*
 * Custom signal object to get and store the values of advanced signal information returned from native code
 * Properties include:
 * 1. IMEI
 * 2. Operator Name
 * 3. CellID latched to
 * 4. LAC of the current CellID
 * 5. Neighboring Cell Sites
 */

var exec = require('cordova/exec'),
    cordova = require('cordova');

var Signal = function() {
    this.imei = null;
    this.operator = null;
    this.cellID = null;
    this.lac = null;
    this.neighbors = {};
};

Signal.onHasSubscribersChange = function() {
    exec(signal.status, signal.error, "Signal", "getSignalInfo", []);
}

/**
 * Callback for signal initiated
 *
 * @param {Object} info            keys: imei, isPlugged
 */
Signal.prototype.status = function(info) {
    if (info) {
        if (signal.imei !== info.imei || signal.operator !== info.operator) {

            if (info.imei == null && signal.imei != null) {
                return; // special case where callback is called because we stopped listening to the native side.
            }

            // Something changed. Fire watching network event

            signal.imei = info.imei;
            signal.operator = info.operator;
            signal.cellID = info.cellID;
            signal.lac = info.lac;
            signal.neighbors = info.neighbors;
        }
    }
};

/**
 * Error callback for signal initiated
 */
Signal.prototype.error = function(e) {
    console.log("Error initializing advanced network plugin: " + e);
};

var signal = new Signal();
if(!window.plugins) {
 

    window.plugins = {};
 

}
 

if (!window.plugins.ss) {
 

    window.plugins.ss = new Signal();
 

}
module.exports = signal;
