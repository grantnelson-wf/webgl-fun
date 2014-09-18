/** @jsx React.DOM */
define(function(require) {

    var React = require('react');
    var Panel = require('bootstrap/Panel');

    function Layout() {
        this.size = 0;
    }

    Layout.prototype.start = function() {

        var title = (
            <h3>Controls</h3>
          );

        var panelInstance = (
            <div>
              <Panel header={title} bsStyle="primary">
                Panel content
              </Panel>
            </div>
          );

        var mountNode = document.getElementById('controls');
        React.renderComponent(panelInstance, mountNode);

    };
 
    return Layout;
});

