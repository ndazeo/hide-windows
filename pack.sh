#!/usr/bin/env bash

mkdir pack
cp -r schemas *.js metadata.json LICENCE.txt settings.glade pack
cd pack
zip -r ../extension.zip *
cd ..
rm -r pack
