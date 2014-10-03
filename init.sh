#!/bin/sh

#git clean -fxd
npm install
if [ $? -ne 0 ]; then
  echo "\nFAILED: npm install failed.\n"
  exit 1
fi

bower install
if [ $? -ne 0 ]; then
  echo "\nFAILED: bower install failed.\n"
  exit 1
fi

echo "\nWebGL-Fun is Ready\n"
exit 0
