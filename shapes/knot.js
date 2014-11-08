define(function(require) {

    var Const = require('tools/const');
    var Common = require('tools/common');
    var Matrix = require('tools/matrix');
    var Vector = require('tools/vector');
    var ShapeBuilder = require('shapes/shape');
    var CylinderBuilder = require('shapes/cylinoid');

    /**
     * Creates a cylinder builder.
     */
    function KnotBuilder() {

        /**
         * The side count of the cylinder.
         * @type {Number}
         */
        this.sideCount = 16;
        
        /**
         * The divisions of the side of the cylinder.
         * @type {Number}
         */
        this.divCount = 150;
    }
    
    /**
     * The name of this shape.
     * @type {String}
     */
    KnotBuilder.prototype.name = 'Knot';
    
    /**
     * The supported vertex types.
     * @type {Number}
     */
    KnotBuilder.prototype.supportedTypes = Const.POS|Const.CLR3|Const.CLR4|
                                Const.NORM|Const.TXT|Const.CUBE|Const.BINM;
    
    /**
     * Prepares a shape builder for a cylinder shape.
     * @param  {ShapeBuilder} shape  The shape builder to prepare.
     * @param  {Number} vertexType  The vertex type to build.
     */
    KnotBuilder.prototype.prepare = function(shape, vertexType) {
        var self = this;
        var cylinder = new CylinderBuilder();
        cylinder.sideCount    = this.sideCount;
        cylinder.divCount     = this.divCount;
        cylinder.closedTop    = false;
        cylinder.closedBottom = false;
        cylinder.joinEnds     = true;
        cylinder.sideFunction = function(i, j) {
            return self.sideFunction(i, j);
        };
        cylinder.prepare(shape, vertexType);
    };
    
    /**
     * Determining the path of the knot.
     * @param  {Number} i  The division count current index.
     * @param  {Number} j  The side count current index.
     * @return  {Array}  The position of the side point.
     */
    KnotBuilder.prototype.sideFunction = function(i, j) {
        var t = 2.0*Math.PI*(i/this.divCount);
        var knot = function(t) {
            var scalar = 2.0 + Math.cos(3.0*t);
            return [ scalar*Math.cos(2.0*t)/4.5,
                     scalar*Math.sin(2.0*t)/4.5,
                     Math.sin(3.0*t)/4.5 ];
        };
        var cur = knot(t);
        var next = knot(t + 0.5/this.divCount);
        var heading = Vector.sub(next, cur);
        return Vector.add(cur, this.sideRing(j, heading));
    };
    
    /**
     * Determining the side of the knot on the path.
     * @param  {Number} j  The side count current index.
     * @param  {Array} heading  The heading of the path.
     * @return  {Array}  The position of the side point.
     */
    KnotBuilder.prototype.sideRing = function(j, heading) {
        heading = Vector.normal(heading);
        var other = Vector.create(1.0, 0.0, 0.0);
        if (!Vector.eq(heading, other)) {
            other = Vector.create(0.0, 0.0, 1.0);
        }
        var cross = Vector.normal(Vector.cross(heading, other));
        other = Vector.normal(Vector.cross(cross, heading));
        
        var minorAngle = 2.0*Math.PI*(j/this.sideCount);
        var minorCos = Math.cos(minorAngle)*-0.15;
        var minorSin = Math.sin(minorAngle)*0.15;
        return Vector.add(
            Vector.scale(other, minorCos),
            Vector.scale(cross, minorSin));
    };
    
    /**
     * Creates a cylinder.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {Number} vertexType  The type of vertices the cylinder should have.
     * @returns  {Shape}  The created cylinder.
     */
    KnotBuilder.prototype.build = function(gl, vertexType) {
        var shape = new ShapeBuilder();
        this.prepare(shape, vertexType);
        return shape.build(gl, vertexType);
    };

    return KnotBuilder;
});
