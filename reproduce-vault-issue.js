var context = require('vault_test_context');
var vault_dir = context.vault_dir;
var home = context.home;
var os = require('os');
var api = require('./module1.js');
api.connect({home : home, vault : vault_dir});
var is_failed = false, err, export_ctx, tgt_path, rc = -1, import_ctx;
tgt_path = os.path(context.home, "sd");
os.mkdir(tgt_path);

// var git_dir = os.path(context.vault_dir, ".git");
// var ftree_git_before_export = get_ftree(git_dir);
api.export_import_prepare
({action: "export", path: tgt_path}
 , {on_done: function(ctx) { export_ctx = ctx; },
    on_error: function(e) { is_failed = true; err = e; }
   });
api.wait();

api.export_import_execute
(export_ctx
 , {on_done: function(ret_rc) {
     rc = ret_rc;
 }
    , on_error: function(e) {
        is_failed = true;
        err = e;
    }});
api.wait();
