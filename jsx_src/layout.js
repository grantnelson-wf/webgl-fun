/** @jsx React.DOM */
define(function(require) {

    var React = require('react/react');

    function Layout() {
        this.size = 0;
    }

    Layout.prototype.start = function() {
        React.renderComponent(
          <b>Controls</b>,
          document.getElementById('controls')
        );
    };
 
    return Layout;
});

