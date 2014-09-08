require.config({
    paths: {
        shapes: 'shapes',
        items: 'items',
        tools: 'tools',
        movers: 'movers',
    }
});

require(['tools/driver', 'items/item001'],
    function(Driver, Item) {

        // Configure this item and driver.
        var driver = new Driver();
        driver.setup('targetCanvas');
        var item = new Item();
        driver.run(item);
});
