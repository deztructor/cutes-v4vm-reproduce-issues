#!/bin/bash

ROOT_DIR=`pwd`/cutes-tests
EXEC=${ROOT_DIR}/bin/cutes
export LD_LIBRARY_PATH=${ROOT_DIR}/lib
TESTROOT=$(mktemp -d)
export VAULT_TEST_TMP_DIR=$TESTROOT
export VAULT_GLOBAL_CONFIG_DIR=$TESTROOT/config
export CUTES_LIBRARY_PATH=${ROOT_DIR}/share/cutes:${ROOT_DIR}/lib/cutes
$EXEC reproduce-vault-issue.js 2>&1
