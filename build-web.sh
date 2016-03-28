#!/bin/bash

rm -rf build
mkdir build
ln -sf ../imgs build/imgs
ln -sf ../fonts build/fonts
ln -sf ../css build/css
cp web-index.html build/index.html
webpack

