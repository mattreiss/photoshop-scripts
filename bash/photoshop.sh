#!/bin/bash

runDir=$(dirname "$0")
currentDir=$(pwd)
runDir="$(echo "${runDir/./$currentDir}")"

cd $runDir
cd ..


if [[ "$OSTYPE" == "darwin"* ]]; then
  photoshop=$(ls /Applications/ | grep 'Photoshop')
  scpt="./apple/photoshop.scpt"
  scpt2="./apple/photoshop2.scpt"
  if [[ $photoshop == "" ]]; then
    echo "Photoshop isn't installed"
    exit 1
  else
    echo "found photoshop $photoshop"
    sed "s/Adobe Photoshop CC/${photoshop}/g" $scpt > $scpt2
    scpt=$scpt2
  fi
  echo "run scpt = $scpt"
  osascript ${scpt} "$(pwd)/photoshop/Main.jsx" $@
elif grep -q Microsoft /proc/version; then
  # TODO
  path="$(pwd)/photoshop/Main.jsx"
  path=$(echo $path | sed 's/\//\\/g')
  path=$(echo $path | sed 's/\\mnt\\c/C:/g')
  echo "running: cscript.exe ./vbs/photoshop.vbs ${path} $@"
  cscript.exe ./vbs/photoshop.vbs "${path}" $@
else
  echo "native Linux is not supported"
fi
