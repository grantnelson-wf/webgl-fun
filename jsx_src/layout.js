/** @jsx React.DOM */
define(function(require) {

    var React = require('react');

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
     * @param  {String} headerId   The header identifier.
     * @param  {String} controlId  The control identifier.
     */
    Layout.prototype.setup = function(headerId, controlId) {
        this._header  = document.getElementById(headerId);
        this._control = document.getElementById(controlId);

        var headBody = (
            <div>
                <a href="#" id="prevLink">&larr; Prev</a>
                <div id="title">Hello</div>
                <a href="#" id="nextLink">Next &rarr;</a>
            </div>
            );
        React.renderComponent(headBody, this._header);
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

