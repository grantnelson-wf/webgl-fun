define(function(require) {

    var Const = require('tools/const');
    var GridBuilder = require('shapes/grid');
    var ShapeBuilder = require('shapes/shape');

    /**
     * Creates a grid builder.
     */
    function RipplesBuilder() {
        
        /**
         * The width of the grid.
         * @type {Number}
         */
        this.width = 2.0;
        
        /**
         * The depth of the grid.
         * @type {Number}
         */
        this.depth = 2.0;
        
        /**
         * The divisions of the width side of the grid.
         * @type {Number}
         */
        this.widthDiv = 40;
        
        /**
         * The divisions of the depth side of the grid.
         * @type {Number}
         */
        this.depthDiv = 40;
        
        /**
         * The frequency of the ripples.
         * @type {Number}
         */
        this.frequency = 15.0;
        
        /**
         * The magnitude of the ripples.
         * @type {Number}
         */
        this.magnitude = 0.1;

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
    RipplesBuilder.prototype.name = 'Ripples';
    
    /**
     * The supported vertex types.
     * @type {Number}
     */
    RipplesBuilder.prototype.supportedTypes = Const.POS|Const.CLR3|Const.CLR4|
                                   Const.NORM|Const.TXT|Const.CUBE|Const.BINM;
    
    /**
     * Prepares a shape builder for a grid shape.
     * @param  {ShapeBuilder} shape  The shape builder to prepare.
     * @param  {Number} vertexType  The vertex type to build.
     */
    RipplesBuilder.prototype.prepare = function(shape, vertexType) {
        var grid = new GridBuilder();
        grid.width = this.width;
        grid.depth = this.depth;
        grid.widthDiv = this.widthDiv;
        grid.depthDiv = this.depthDiv;
        grid.x = this.x;
        grid.y = this.y;
        grid.z = this.z;
        var self = this;
        grid.height = function(x, z) {
            var r = Math.sqrt(x*x + z*z);
            return Math.cos(r*self.frequency)*self.magnitude;
        };
        grid.prepare(shape, vertexType);
        if ((vertexType&Const.NORM) || (vertexType&Const.CUBE)) {
            shape.calculateNormals();
            if (vertexType&Const.CUBE) {
                shape.copyNormToCube();
            }
        }
    };
    
    /**
     * Creates a grid.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {Number} vertexType  The type of vertices the grid should have.
     * @returns  {Shape}  The created grid.
     */
    RipplesBuilder.prototype.build = function(gl, vertexType) {
        var shape = new ShapeBuilder();
        this.prepare(shape, vertexType);
        return shape.build(gl, vertexType);
    };

    return RipplesBuilder;
});
