/** @jsx React.DOM */
define(function(require) {

    require('datgui');

    /**
     * This is the controls interface.
     * This abstracts the dat-gui to provide additional helpful methods.
     */
    function Controls() {
        this._gui = new dat.GUI();
    }

    /**
     * [addFloat description]
     * @param {[type]}   name     [description]
     * @param {Function} callback [description]
     * @param {[type]}   min      [description]
     * @param {[type]}   max      [description]
     * @param {[type]}   initial  [description]
     */
    Controls.prototype.addFloat = function(name, callback, min, max, initial) {
        var holder = { };
        holder[name] = initial;
        var controller = this._gui.add(holder, name, min, max);
        controller.onChange(function(value) {
            callback(value);
        });
        callback(initial);
    };
 
    return Controls;
});

