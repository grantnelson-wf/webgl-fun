/** @jsx React.DOM */
define(function(require) {

    require('datgui');

    var CubeBuilder     = require('shapes/cube');
    var CylinderBuilder = require('shapes/cylinder');
    var GridBuilder     = require('shapes/grid');
    var SphereBuilder   = require('shapes/sphere');
    var ToroidBuilder   = require('shapes/toroid');
    var WlogoBuilder    = require('shapes/wlogo');
    var RipplesBuilder  = require('shapes/ripples');
    var BumpsBuilder    = require('shapes/bumps');
    var GlassBuilder    = require('shapes/glass');
    var KnotBuilder     = require('shapes/knot');

    /**
     * This is the controls interface.
     * This abstracts the dat-gui to provide additional helpful methods.
     */
    function Controls() {
        this._gui = new dat.GUI();
    }

    /**
     * Sets the FPS (frames per seconds) display in the control.
     * @param  {Number} fps  The FPS to show.
     */
    Controls.prototype.setFps = function(fps) {
        this.FPS = fps;
        if (!this.ctrlFps) {
            this.ctrlFps = this._gui.add(this, "FPS", 0, 100).listen();
        }
    };

    /**
     * Adds a shape selection control.
     * @param  {String}   name       The name of the shape to store.
     * @param  {Function} callback   The method to call on change.
     *                               It will have one parameter, the shape builder object for the selected shape. 
     * @param  {String}   initShape  The name of the initial shape to show.
     */
    Controls.prototype.addShapeSelect = function(name, callback, initShape) {
        this[name] = initShape;
        var builders = [ new CubeBuilder(),
                         new CylinderBuilder(),
                         new GridBuilder(),
                         new SphereBuilder(),
                         new ToroidBuilder(),
                         new WlogoBuilder(),
                         new RipplesBuilder(),
                         new BumpsBuilder(),
                         new GlassBuilder(),
                         new KnotBuilder() ];
        var names = [];
        for (var i = builders.length - 1; i >= 0; i--) {
            names[i] = builders[i].name;
        }
        var ctrl = this._gui.add(this, name, names);
        var selectShape = function(shapeName) {
            for (var i = builders.length - 1; i >= 0; i--) {
                if (builders[i].name === shapeName) {
                    callback(builders[i]);
                    break;
                }
            }
        };
        ctrl.onChange(selectShape);
        selectShape(initShape);
    };

    /**
     * Adds a float value control.
     * @param  {String}   name      The name of the value to store.
     * @param  {Function} callback  The method to call on change.
     *                              It will have one parameter, the new float value.
     * @param  {Number}   min       The minimum allowed value.
     * @param  {Number}   max       The maximum allowed value.
     * @param  {Number}   initial   The initial value to set.
     */
    Controls.prototype.addFloat = function(name, callback, min, max, initial) {
        if (max < min) {
            var temp = max;
            max = min;
            min = temp;
        }
        this[name] = Math.min(max, Math.max(min, initial));
        var ctrl = this._gui.add(this, name, min, max);
        ctrl.onChange(callback);
        callback(initial);
    };

    /**
     * Adds a integer value control.
     * @param  {String}   name      The name of the value to store.
     * @param  {Function} callback  The method to call on change.
     *                              It will have one parameter, the new integer value.
     * @param  {Number}   min       The minimum allowed value.
     * @param  {Number}   max       The maximum allowed value.
     * @param  {Number}   initial   The initial value to set.
     */
    Controls.prototype.addInt = function(name, callback, min, max, initial) {
        if (max < min) {
            var temp = max;
            max = min;
            min = temp;
        }
        this[name] = Math.min(max, Math.max(min, initial));
        var ctrl = this._gui.add(this, name, min, max);
        ctrl.step(1);
        ctrl.onChange(callback);
        callback(initial);
    };

    /**
     * Adds a boolean state control.
     * @param  {String}   name      The name of the state to store.
     * @param  {Function} callback  The method to call on change.
     *                              It will have one parameter, the new boolean state.
     * @param  {Boolean}  initial   The initial state to set.
     */
    Controls.prototype.addBool = function(name, callback, initial) {
        this[name] = initial;
        var ctrl = this._gui.add(this, name);
        ctrl.onChange(callback);
        callback(initial);
    };

    /**
     * Adds a color control.
     * @param  {String}   name       The name of the state to store.
     * @param  {Function} callback   The method to call on change.
     *                               It will have three parameter, the new red, green, and blue float values.
     * @param  {Number}   initRed    The initial red state, between 0 and 1.
     * @param  {Number}   initGreen  The initial green state, between 0 and 1.
     * @param  {Number}   initBlue   The initial blue state, between 0 and 1.
     */
    Controls.prototype.addRGB = function(name, callback, initRed, initGreen, initBlue) {
        this[name] = [ initRed*255.0, initGreen*255.0, initBlue*255.0 ];
        var ctrl = this._gui.addColor(this, name);
        ctrl.onChange(function(value) {
            callback(value[0]/255.0, value[1]/255.0, value[2]/255.0);
        });
        callback(initRed, initGreen, initBlue );
    };

    /**
     * Adds a drop-down dictionary control.
     * @param  {String}   name      The name of the selection to store.
     * @param  {Function} callback  The method to call on change.
     *                              It will have one parameter, the new selected value.
     * @param  {String}   initKey   The initial key to select.
     * @param  {Dic}      pairs     The dictionary of key-value pairs.
     *                              Keys will be displayed and values will be returned on selection change.
     */
    Controls.prototype.addDic = function(name, callback, initKey, pairs) {
        this[name] = pairs[initKey];
        var ctrl = this._gui.add(this, name, pairs);
        ctrl.onChange(callback);
        callback(pairs[initKey]);
    };

    /**
     * Add a button control.
     * @param  {String}   name      The name of the button to store.
     * @param  {Function} callback  The method to call on click.
     *                              It will have no parameters.
     */
    Controls.prototype.addButton = function(name, callback) {
        this[name] = callback;
        var ctrl = this._gui.add(this, name);
    };

    /**
     * Destroys and disposes of the control.
     */
    Controls.prototype.destroy = function() {
        this._gui.destroy();
        this._gui = null;
    };
 
    return Controls;
});

