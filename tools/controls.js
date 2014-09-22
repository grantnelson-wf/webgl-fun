/** @jsx React.DOM */
define(function(require) {

    require('datgui');

    /**
     * This is the controls interface.
     * This abstracts the dat-gui to provide additional helpful methods.
     */
    function Controls() {
        this._controls = dat.GUI();
    }
 
    return Controls;
});

