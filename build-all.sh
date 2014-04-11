#!/bin/bash

if [ $# -lt 1 ]; then
    echo "Usage: $0 <path-to-qt-root-dir>"
    exit 1
fi

# prereq: python >= 2.7, libudev-devel (for cor), cmake >= 2.8, g++ >= 4.6, qt 5.2

QTDIR=$1

ROOT_DIR=`pwd`/cutes-tests
CMAKE_QT5="`pwd`/cmake-qt.sh $QTDIR"

JOBS=-j4

export LD_LIBRARY_PATH=$ROOT_DIR/lib::$LD_LIBRARY_PATH
export PKG_CONFIG_PATH=$ROOT_DIR/lib/pkgconfig:$PKG_CONFIG_PATH

function git_update {
    CLONE="git clone --depth=1"
    DIR=$1
    REPO=$2
    ARGS=${@:3}
    if [ -d $DIR ]; then
        pushd $DIR && git pull && popd
    else
        $CLONE $ARGS -- $REPO
    fi
}

function clone_all {
    git_update cor https://github.com/deztructor/cor.git && \
        git_update tut https://github.com/nemomobile/tut.git && \
        git_update cutes https://github.com/deztructor/cutes.git -b next && \
        git_update cutes-js https://github.com/deztructor/cutes-js.git -b next && \
        git_update the-vault https://github.com/nemomobile/the-vault.git -b master
}

PREFIX=
DEST=$ROOT_DIR

function build_tut {
    echo "Building tut"
    cd $ROOT_DIR/tut && \
        ./waf configure --prefix=$DEST --version=1 && \
        ./waf build $JOBS && \
        ./waf install --destdir=$PREFIX
}

function build_cor {
    echo "Building cor"
    cd $ROOT_DIR/cor && \
        cmake -DCOR_VERSION=1.0 -DCMAKE_INSTALL_PREFIX:PATH=$PREFIX && \
        make $JOBS && \
        make install DESTDIR=$DEST
}

function build_cutes {
    echo "Building cutes"
    cd $ROOT_DIR/cutes && \
        $CMAKE_QT5 -DCMAKE_INSTALL_PREFIX:PATH=$PREFIX -DCUTES_VERSION=0.9.8 && \
        make $JOBS && \
        make install DESTDIR=$DEST
}

function build_the_vault {
    echo "Building the-vault"
    cd $ROOT_DIR/the-vault && \
        $CMAKE_QT5 -DCMAKE_INSTALL_PREFIX:PATH=$PREFIX && \
        make $JOBS && \
        make install DESTDIR=$DEST
}

(test -d $ROOT_DIR || mkdir $ROOT_DIR) && \
    cd $ROOT_DIR && \
    clone_all && \
    build_tut && \
    build_cor && \
    build_the_vault && \
    build_cutes

