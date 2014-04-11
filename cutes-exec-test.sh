#!/bin/sh

ROOT_DIR=`pwd`/cutes-tests
CUTES=$ROOT_DIR/bin/cutes
export CUTES_LIBRARY_PATH=$ROOT_DIR/cutes-js/lib:$ROOT_DIR/share/cutes
cd $ROOT_DIR/cutes-js/tests && \
    $CUTES test_os.js

