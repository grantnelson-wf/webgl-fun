require.config({
    paths: {
        shapes: 'shapes',
        items: 'items',
        tools: 'tools',
        movers: 'movers',
        react: 'bower_components/react/react',
        bootstrap: 'bower_components/react-bootstrap',
        datgui: 'bower_components/dat-gui/build/dat.gui'
    }
});

require(['tools/driver', 'items/item000', 'items/item010'],
    function(Driver, MenuItem, InitItem) {
        var driver = new Driver();
        driver.setup('targetCanvas');

        var menu = new MenuItem();
        driver.setMenuItem(menu);

        var item = new InitItem();
        driver.run(item);
});
