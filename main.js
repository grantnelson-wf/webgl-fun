require.config({
    paths: {
        shapes: 'shapes',
        items: 'items',
        tools: 'tools'
    }
});

require(['tools/driver', 'items/item002'],
    function(Driver, Item) {

        // Configure this item and driver.
        var driver = new Driver();
        driver.setup('targetCanvas');
        var item = new Item();
        driver.run(item);
});
