/** @jsx React.DOM */
define(function(require) {

    require('datgui');

    var CubeBuilder     = require('shapes/cube');
    var CylinderBuilder = require('shapes/cylinder');
    var GridBuilder     = require('shapes/grid');
    var SphereBuilder   = require('shapes/sphere');
    var ToroidBuilder   = require('shapes/toroid');
    var WlogoBuilder    = require('shapes/wlogo');

    /**
     * This is the controls interface.
     * This abstracts the dat-gui to provide additional helpful methods.
     */
    function Controls() {
        this._gui = new dat.GUI();
    }

    /**
     * TODO: Comment
     */
    Controls.prototype.setFps = function(fps) {
        this["FPS"] = fps;
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
                         new WlogoBuilder() ];
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
     * TODO: Comment
     * @param {[type]}   name     [description]
     * @param {Function} callback [description]
     * @param {[type]}   min      [description]
     * @param {[type]}   max      [description]
     * @param {[type]}   initial  [description]
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
     * TODO: Comment
     * @param {[type]}   name      [description]
     * @param {Function} callback  [description]
     * @param {[type]}   initRed   [description]
     * @param {[type]}   initGreen [description]
     * @param {[type]}   initBlue  [description]
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
     * TODO: Comment
     * @param {[type]}   name      [description]
     * @param {Function} callback  [description]
     * @param {[type]}   initValue [description]
     * @param {[type]}   pairs     [description]
     */
    Controls.prototype.addDic = function(name, callback, initKey, pairs) {
        this[name] = pairs[initKey];
        var ctrl = this._gui.add(this, name, pairs);
        ctrl.onChange(callback);
        callback(pairs[initKey]);
    };

    /**
     * TODO: Comment
     * @param {[type]}   name      [description]
     * @param {Function} callback  [description]
     */
    Controls.prototype.addButton = function(name, callback) {
        this[name] = callback;
        var ctrl = this._gui.add(this, name);
    };

    /**
     * [distroy description]
     * @return {[type]} [description]
     */
    Controls.prototype.destroy = function() {
        this._gui.destroy();
        this._gui = null;
    };
 
    return Controls;
});

