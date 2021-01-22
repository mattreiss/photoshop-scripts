#!/bin/bash

runDir=$(dirname "$0")
currentDir=$(pwd)
runDir="$(echo "${runDir/./$currentDir}")"

cd $runDir
cd ..

directory=$1
if [[ $directory == "" ]]; then
    directory=~/Desktop
fi

list=$(ls $directory)
folders=""
files=""
for item in $list
do
    if [[ -d $directory/$item ]]; then
        if [[ $folders == "" ]]; then
            folders="$item"
        else
            folders="$folders,$item"
        fi
    elif [[ -f $directory/$item ]]; then
        if [[ $files == "" ]]; then
            files="$item"
        else
            files="$files,$item"
        fi
    fi
done
echo "folders=${folders}; files=${files}"
