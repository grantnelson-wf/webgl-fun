#!/bin/sh

COLOR_RED="\x1b[31m"
COLOR_GREEN="\x1b[32m"
COLOR_RESET="\x1b[0m"

#git clean -fxd
npm install
bower install

if [ $? -ne 0 ]; then
  echo "$COLOR_RED"
  echo "\nINIT FAILED\n"
  exit 1
fi

echo "$COLOR_GREEN"
echo "\nWebGL-Fun is Ready\n"
echo "$COLOR_RESET"
exit 0
