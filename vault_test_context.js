var os = require('os');
var error = require('error');

var home = os.environ("VAULT_TEST_TMP_DIR");
if (!(home && os.path.isDir(home)))
    error.raise({msg: "Temporary dir is not created", dir: home});

var base = {
    home : home,
    config_dir : os.environ("VAULT_GLOBAL_CONFIG_DIR"),
    vault_dir : os.path(home, '.vault'),
    unit1_dir : os.path(home, 'unit1'),
    unit2_dir : os.path(home, 'unit2'),
    unit1 : {
        home: {
            bin : os.path('unit1', 'binaries'),
            data : os.path('unit1', 'data')
        }
    },
    unit2 : {
        home: {
            bin : os.path('unit2', 'unit2_binaries'),
            data : os.path('unit2', 'unit2_data')
        }
    }
};

exports = Object.create(base);
