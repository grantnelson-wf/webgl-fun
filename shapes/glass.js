define(function(require) {

    var Const = require('tools/const');
    var Common = require('tools/common');
    var ShapeBuilder = require('shapes/shape');
    var CylinderBuilder = require('shapes/cylinoid');

    /**
     * Creates a cylinder builder.
     */
    function GlassBuilder() {

        /**
         * The side count of the cylinder.
         * @type {Number}
         */
        this.sideCount = 30;
        
        /**
         * The divisions of the side of the cylinder.
         * @type {Number}
         */
        this.divCount = 30;
    }
    
    /**
     * The name of this shape.
     * @type {String}
     */
    GlassBuilder.prototype.name = 'Glass';
    
    /**
     * The supported vertex types.
     * @type {Number}
     */
    GlassBuilder.prototype.supportedTypes = Const.POS|Const.CLR3|Const.CLR4|
                                 Const.NORM|Const.TXT|Const.CUBE|Const.BINM;
    
    /**
     * Prepares a shape builder for a cylinder shape.
     * @param  {ShapeBuilder} shape  The shape builder to prepare.
     * @param  {Number} vertexType  The vertex type to build.
     */
    GlassBuilder.prototype.prepare = function(shape, vertexType) {
        var cylinder = new CylinderBuilder();
        cylinder.sideCount    = this.sideCount;
        cylinder.divCount     = this.divCount;
        cylinder.closedTop    = true;
        cylinder.topPos       = [0, 0.45, 0];
        cylinder.closedBottom = true;
        cylinder.bottomPos    = [0, -0.1, 0];
        cylinder.sideFunction = function(i, j) {
            var offset = i/this.divCount;

            var offsetArray = [ 0.0,  0.05,  0.1,   0.15,  0.2,  0.25,  0.6,   0.65,  0.7,  0.75, 0.85, 0.9,  0.95, 1.0];
            var radiusArray = [ 0.15, 0.2,   0.25,  0.3,   0.4,  0.43,  0.3,   0.25,  0.1,  0.05, 0.05, 0.1,  0.3,  0.3];
            var heightArray = [-0.1, -0.15, -0.2,  -0.25, -0.5, -0.5,  -0.15, -0.1,  -0.05, 0.0,  0.35, 0.4,  0.48, 0.5];
            
            var radius = Common.multiLerp(offsetArray, radiusArray, offset);
            var height = Common.multiLerp(offsetArray, heightArray, offset);
           
            var angle = j*Math.PI*2.0/this.sideCount;
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);
            return [cos*radius, height, sin*radius];
        };
        cylinder.prepare(shape, vertexType);
    };
    
    /**
     * Creates a cylinder.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {Number} vertexType  The type of vertices the cylinder should have.
     * @returns  {Shape}  The created cylinder.
     */
    GlassBuilder.prototype.build = function(gl, vertexType) {
        var shape = new ShapeBuilder();
        this.prepare(shape, vertexType);
        return shape.build(gl, vertexType);
    };

    return GlassBuilder;
});
