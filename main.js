require.config({
    paths: {
        shapes: 'shapes',
        items: 'items',
        tools: 'tools'
    }
});

require(['tools/driver', 'items/item001'],
    function(Driver, Item001) {

        // Configure this item and driver.
        var driver = new Driver();
        driver.setup('targetCanvas');
        var item001 = new Item001();
        driver.run(item001);
});
