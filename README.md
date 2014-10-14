webgl-fun
=========

Some basic webgl examples that I've been playing around with just for fun and research.


On Linux and Macs
=================

Getting Started
--------------------------------------------------------------------------------

```bash
# Clone the repository.
$ git clone git@github.com:grantnelson-wf/webgl-fun
$ cd webgl-fun

# Install global tools if you haven't already.
$ npm install -g bower
$ npm install -g grunt-cli

# Run the init script.
$ ./init.sh
```

The init script will initialize your local environment and
ensure that you have all global and local dependencies.

For Developers
--------------------------------------------------------------------------------

This uses grunt to jshint and test.

```bash
# Run grunt help.
$ grunt -h
```

To Run
--------------------------------------------------------------------------------

Open the index.html in a browser.
Chrome may have problems (cross origin requests) loading images by default.


On Windows
==========

Getting Started
--------------------------------------------------------------------------------

1. Use "Clone in Desktop" to get repository.
2. Navigate to "webgl-fun" folder.
3. Add the new folder "bower_components" in "webgl-fun".
4. Install require.js
    - Add the new folder "requirejs" in "bower_components".
    - Download "require.js" (either the minified or with comments) from <http://requirejs.org>.
    - Save it as "webgl-fun/bower_components/requirejs/require.js".
5. Install dat.gui
    - Add the new folder "dat-gui" in "bower_components".
    - Add the new folder "build" in "dat-gui".
    - Download "dat.gui.js" (either the minified or debug) from <https://code.google.com/p/dat-gui/>.
    - Save it as "webgl-fun/bower_components/dat-gui/build/dat.gui.js".

For Developers
--------------------------------------------------------------------------------

No additional development tools on windows.

To Run
--------------------------------------------------------------------------------

Open the index.html in a browser
(Not tested for EI)
Chrome may have problems (cross origin requests) loading images by default.
