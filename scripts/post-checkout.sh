#!/bin/bash

sha1=$1
sha2=$2
flag=$3

check_updated() {
  updated=`git diff --name-status $sha1 $sha2 | grep package-lock.json | wc -l`
}

check_updated
if [[ $flag == "1" && $updated == "1" ]]
then
  npm ci
fi
