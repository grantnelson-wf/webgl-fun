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

require(['tools/driver', 'items/item001', 'items/item004'],
    function(Driver, MenuItem, Item) {
        var driver = new Driver();
        driver.setup('targetCanvas');

        var menu = new MenuItem();
        driver.setMenuItem(menu);

        var item = new Item();
        driver.run(item);
});
