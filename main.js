require.config({
    paths: {
        shapes: 'shapes',
        items: 'items',
        tools: 'tools',
        movers: 'movers',
        react: 'bower_components/react/react',
        bootstrap: 'bower_components/react-bootstrap'
    }
});

require(['site/layout', 'tools/driver', 'items/item008'],
    function(Layout, Driver, Item) {

        var layout = new Layout();
        layout.start();

        // Configure this item and driver.
        var driver = new Driver();
        driver.setup('targetCanvas');
        var item = new Item();
        driver.run(item);
});
