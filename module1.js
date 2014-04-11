var os = require('os');
var error = require('error');
var util = require('util');
var debug = require('debug');

var actor_ = undefined;
var home_;
var home = function() {
    if (!home_)
        error.raise({msg : "home is not set"});
    return home_;
};
var vault_dir_;
var vault_dir = function() {
    if (!vault_dir_)
        error.raise({msg : "vault_dir is not set"});
    return vault_dir_;
}

var dump_error = function(e) {
    debug.error(util.dump("Actor error event", e));
};

var actor = function() {
    if (!actor_)
        error.throw({message: "Vault actor is not defined"});
    return actor_;
};

exports.wait = function() { actor().wait(); };

var init_actor = function(is_reload) {
    var is_undefined = (actor_ === undefined);
    debug.info("Init vault actor, exist", is_undefined, "reload=", is_reload);
    if (is_undefined) {
        actor_ = cutes.actor();
        actor_.error.connect(dump_error);
        actor_.source = "./actor1.js";
        is_reload = false;
    };
    if (is_reload)
        actor_.reload();
};

// params = {on_done, on_error, reconnect}
exports.connect = function(params) {
    params = params || {};
    debug.info((params.reconnect ? "re" : "") + "connect to vault");

    if (!(actor_ === undefined || params.reconnect)) {
        if (params.on_done)
            params.on_done();
        return;
    }

    home_ = params.home || os.home();
    vault_dir_ = params.vault || os.path(home_, '.vault');
    debug.debug("Vault in", vault_dir_, ", Home is", home_);
    init_actor(params.reconnect);
    var sync_config = function() {
        actor().request("sync_config", {}
                      , { on_reply: params.on_done, on_error: params.on_error});
    };
    var init = function() {
        var msg = {"user.name" : "Some User",
                   "user.email" : "sailor@jolla.com"};
        actor().request("init"
                      , msg
                      , { on_reply: sync_config, on_error: params.on_error } );
    };
    actor().request("connect", vault_dir(), {on_reply: init, on_error: error.raise});
    if (!params.on_done) {
        debug.debug("Wait for request to be completed");
        actor().wait();
    }
};

exports.export_import_prepare = function(req, callbacks) {
    actor().request('export_import_prepare', req, callbacks);
};

exports.export_import_execute = function(ctx, callbacks) {
    var req;
    if (ctx.action === "import") {
        req = reconnect_continue();
    } else {
        req = callbacks;
    }
    actor().request('export_import', ctx, req);
};
