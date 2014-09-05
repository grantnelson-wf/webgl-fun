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
        this.width = 1;
        
        /**
         * The depth of the grid.
         * @type {Number}
         */
        this.depth = 1;
        
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
        this.x = 0;

        /**
         * The offset of the grid's center on the y axis.
         * @type {Number}
         */
        this.y = 0;

        /**
         * The offset of the grid's center on the z axis.
         * @type {Number}
         */
        this.z = 0;
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
    GridBuilder.prototype.supportedTypes = Const.POS|Const.CLR3|Const.CLR4|Const.NORM|Const.TXT|Const.CUBE;
    
    /**
     * Creates a grid.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {Number} vertexType  The type of vertices the grid should have.
     * @returns  {Shape}  The created grid.
     */
    GridBuilder.prototype.build = function(gl, vertexType) {
        var shape = new ShapeBuilder();

        for (var i = 0; i <= this.widthDiv; i++) {
            for (var j = 0; j <= this.depthDiv; j++) {
                var u = i/this.widthDiv;
                var v = j/this.depthDiv;
                var x = this.x+(u-0.5)*this.width;
                var z = this.z+(v-0.5)*this.depth;
                var y = this.y+this.height(x, z);
                shape.pos.add(x, y, z);
                if (vertexType&Const.NORM) {
                    shape.norm.add(0, 1, 0);
                }
                if (vertexType&Const.CLR3) {
                    shape.clr3.add(u, 1-u*v, v);
                }
                if (vertexType&Const.CLR4) {
                    shape.clr4.add(u, 1-u*v, v, 1);
                }
                if (vertexType&Const.TXT) {
                    shape.txt.add(u, v);
                }
                if (vertexType&Const.CUBE) {
                    var tx = u*2.0-1.0;
                    var tz = v*2.0-1.0;
                    var len = Math.sqrt(tx*tx + 1 + tz*tz)
                    shape.cube.add(tx/len, 1/len, tz/len);
                }
            };        
        };
        
        for (var i = 0; i < this.widthDiv; i++) {
            shape.startTriStrip(i*(this.depthDiv+1), (i+1)*(this.depthDiv+1));
            for (var j = 1; j <= this.depthDiv; j++) {
                shape.addToTriStrip(i*(this.depthDiv+1)+j, (i+1)*(this.depthDiv+1)+j);
            };        
        }; 
        
        return shape.build(gl);
    };

    return GridBuilder;
});
