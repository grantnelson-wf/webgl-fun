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

require(['tools/driver', 'items/item008'],
    function(Driver, Item) {
        var driver = new Driver();
        driver.setup('targetCanvas');

        var item = new Item();
        driver.run(item);
});
