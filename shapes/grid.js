define(function(require) {

    var Const = require("tools/const")
    var ShapeBuilder = require("shapes/shape")

    /**
     * Creates a grid builder.
     */
    function GridBuilder() {
        
        /**
         * The width of the grid.
         * @type {Number}
         */
        this.width = 0.5;
        
        /**
         * The depth of the grid.
         * @type {Number}
         */
        this.depth = 0.5;
        
        /**
         * The handle for determining the height.
         * It will be given the x and z values for each vertex.
         * By default the grid will be flat.
         * @type {Function}
         */
        this.height = function() {
            return 0;
        };
        
        /**
         * The divisions of the width side of the grid.
         * @type {Number}
         */
        this.widthDiv = 20;
        
        /**
         * The divisions of the depth side of the grid.
         * @type {Number}
         */
        this.depthDiv = 20;

        /**
         * The offset of the grid's center on the x axis.
         * @type {Number}
         */
        this.x = 0.0;

        /**
         * The offset of the grid's center on the y axis.
         * @type {Number}
         */
        this.y = 0.0;

        /**
         * The offset of the grid's center on the z axis.
         * @type {Number}
         */
        this.z = 0.0;
    }
    
    /**
     * The name of this shape.
     * @type {String}
     */
    GridBuilder.prototype.name = "Grid";
    
    /**
     * The supported vertex types.
     * @type {Number}
     */
    GridBuilder.prototype.supportedTypes = Const.POS|Const.CLR|Const.NORM|Const.TXT;
    
    /**
     * Creates a grid.
     * @param  {Graphics} gfx       The graphics object.
     * @param  {Number} vertexType  The type of vertices the grid should have.
     * @returns  {Shape}  The created grid.
     */
    GridBuilder.prototype.build = function(gfx, vertexType) {
        var shape = new ShapeBuilder();

        for (var i = 0; i <= this.widthDiv; i++) {
            for (var j = 0; j <= this.depthDiv; j++) {
                var u = i/this.widthDiv;
                var v = j/this.depthDiv;
                var x = this.x+(u-0.5)*this.width*2;
                var z = this.z+(v-0.5)*this.depth*2;
                var y = this.y+this.height(x, z);
                shape.addPos(x, y, z);
                if (vertexType&Const.NORM) {
                    shape.addNorm(0, 1, 0);
                }
                if (vertexType&Const.CLR) {
                    shape.addClr(u, 1-u*v, v);
                }
                if (vertexType&Const.TXT) {
                    shape.addTxt(u, v);
                }
            };        
        };
        
        for (var i = 0; i < this.widthDiv; i++) {
            shape.startTriStrip(i*(this.depthDiv+1), (i+1)*(this.depthDiv+1));
            for (var j = 1; j <= this.depthDiv; j++) {
                shape.addToTriStrip(i*(this.depthDiv+1)+j, (i+1)*(this.depthDiv+1)+j);
            };        
        }; 
        
        return shape.build(gfx);
    };

    return GridBuilder;
});
