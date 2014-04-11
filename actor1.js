var error = require('error');
var debug = require('debug');
var util = require('util');

var i__ = 0;
var gc = function() {
    cutes.gc();
}

var trace = function(level) {
    var fn = debug[level];
    return fn.apply(null, ["VaultActor:"].concat([].slice.call(arguments, 1)));
};

var vault_ = undefined;

exports.connect = function(msg, ctx) {
    if (!vault_)
        vault_ = require("vault/vault").use(msg);
    return vault_;
};

var invalidate_vault = function() {
    vault_ = null;
};

var vault = function() {
    if (!vault_)
        error.raise({msg: "vault is not initialized"});
    return vault_;
};

exports.init = function(msg, ctx) {
    if (!vault().exists()) {
        return vault().init(msg);
    } else {
        var state = vault().is_invalid();
        if (state)
            error.raise(state);
    }
};

exports.sync_config = function(msg, ctx) {
    var global = require('vault/config').global;
    return vault().config().update(global.units());
};

exports.export_import_prepare = function(req, ctx) {
    var action = req.action;
    var path = req.path;

    trace("debug", "Prepare", action);
    var os = require("os");

    if (typeof path !== 'string')
        error.raise({reason: "Logic", message: "Export/import path is bad",
                     path : path});


    path = os.path(path, "Backup.tar");
    var res = { action: action };
    var dst_dir;

    if (!os.path.exists(vault().root) || vault().is_invalid())
        error.raise({reason: "NoSource", message: "Invalid vault"
                     , path: vault().root});

    res.src = vault().root;
    res.dst = path;
    dst_dir = os.path.dirname(path);

    return res;
};

exports.export_import = function(msg, ctx) {
    trace("debug", "Export/import", util.dump("msg:", msg));

    var os = require('os');
    var _ = require('functional');


    _.each(function(k) {
        if (typeof msg[k] !== "string")
            error.raise({reason: "Logic", message: "Wrong context", prop: k});
    }, ["dst", "src", "action"]);
    gc();
    print(os.path(msg.src));
    for (var eee in os.path) print(eee);
    print(os.path.exists("."));
    return;
};
