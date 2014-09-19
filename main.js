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
        var driver = new Driver();
        driver.setup('targetCanvas');

        var layout = new Layout();
        layout.setup('header', 'controls');
        driver.setLayout(layout);

        var item = new Item();
        driver.run(item);
});
