define(function(require) {

    var Const = require('tools/const');
    var GridBuilder = require('shapes/grid');
    var ShapeBuilder = require('shapes/shape');

    /**
     * Creates a grid builder.
     */
    function BumpsBuilder() {
        
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
         * The x frequency of the ripples.
         * @type {Number}
         */
        this.xFrequency = 10.0;
        
        /**
         * The x magnitude of the ripples.
         * @type {Number}
         */
        this.xMagnitude = 0.05;
        
        /**
         * The z frequency of the ripples.
         * @type {Number}
         */
        this.zFrequency = 10.0;
        
        /**
         * The z magnitude of the ripples.
         * @type {Number}
         */
        this.zMagnitude = 0.05;

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
    BumpsBuilder.prototype.name = 'Bumps';
    
    /**
     * The supported vertex types.
     * @type {Number}
     */
    BumpsBuilder.prototype.supportedTypes = Const.POS|Const.CLR3|Const.CLR4|
                                   Const.NORM|Const.TXT|Const.CUBE|Const.BINM;
    
    /**
     * Prepares a shape builder for a grid shape.
     * @param  {ShapeBuilder} shape  The shape builder to prepare.
     * @param  {Number} vertexType  The vertex type to build.
     */
    BumpsBuilder.prototype.prepare = function(shape, vertexType) {
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
            return Math.cos(x*self.xFrequency)*self.xMagnitude +
                   Math.cos(z*self.zFrequency)*self.zMagnitude;
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
    BumpsBuilder.prototype.build = function(gl, vertexType) {
        var shape = new ShapeBuilder();
        this.prepare(shape, vertexType);
        return shape.build(gl, vertexType);
    };

    return BumpsBuilder;
});
