#!/bin/bash

export QTDIR=$1
export PKG_CONFIG_PATH=${PKG_CONFIG_PATH}:${QTDIR}/lib/pkgconfig

export MOD_PATH=${CMAKE_MODULE_PATH}
export STORAGE=$(mktemp)
if ! [ -f "$STORAGE" ]; then
    echo "Wrong mktemp path: $STORAGE"
    exit 1
fi

echo -n "${CMAKE_MODULE_PATH}" > $STORAGE
set_mod_path()
{
    echo -n ":$1" >> $STORAGE
}
export -f set_mod_path
find ${QTDIR}/lib/cmake -type d -exec bash -c 'set_mod_path "{}"' \;
# | xargs -0 bash -c 'set_mod_path "$@"'
export CMAKE_MODULE_PATH=`cat $STORAGE`
export PATH=${QTDIR}/bin:${PATH}
cmake --trace  . ${@:2}
rm $STORAGE
