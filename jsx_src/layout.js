/** @jsx React.DOM */
define(function(require) {

    var React = require('react');
    var Panel = require('bootstrap/Panel');

    /**
     * This is the control layout.
     */
    function Layout() {

        // The canvas container element.
        this._container = null;

        // The control element.
        this._control = null;
    }

    /**
     * This sets up the layout.
     * @param  {String} containerId  The canvas container's identifier.
     * @param  {String} controlId    The control identifier.
     */
    Layout.prototype.setup = function(containerId, controlId) {
        this._container = document.getElementById(containerId);
        this._control   = document.getElementById(controlId);

        // TODO:: Finish implementing.
        this.addPanel("Controls", "Hello world");
    };

    /**
     * This resets the layout to default.
     */
    Layout.prototype.reset = function() {
        
    };

    /**
     * TODO:: Comment
     * @param {[type]} title   [description]
     * @param {[type]} content [description]
     */
    Layout.prototype.addPanel = function(title, content) {
        var panelInstance = (
            <div>
              <Panel header={title} bsStyle="primary">
                {content}
              </Panel>
            </div>
          );
        React.renderComponent(panelInstance, this._control);
    };
 
    return Layout;
});

