define(function(require) {

    var Const = require('tools/const');
    var Common = require('tools/common');
    var Matrix = require('tools/matrix');
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
        var cylinder = new CylinderBuilder();
        cylinder.sideCount    = this.sideCount;
        cylinder.divCount     = this.divCount;
        cylinder.closedTop    = false;
        cylinder.closedBottom = false;
        cylinder.joinEnds     = true;
        cylinder.sideFunction = function(i, j) {
            var majorScale = i/this.divCount;
            var minorScale = j/this.sideCount;
            var majorAngle = 2.0*Math.PI*majorScale;
            var minorAngle = 2.0*Math.PI*minorScale+majorAngle*3.0;
        
            var majorRadius = 0.5+Math.cos(majorAngle)*0.15;
            var minorRadius = 0.1;
            var y = Math.sin(majorAngle)*0.25;
            
            var majorCos = Math.cos(majorAngle*3.0);
            var majorSin = Math.sin(majorAngle*3.0);
            var minorCos = Math.cos(minorAngle);
            var minorSin = Math.sin(minorAngle);

            var pr = majorRadius + minorCos*minorRadius;
            var px = majorSin*pr;
            var py = minorSin*minorRadius + y;
            var pz = majorCos*pr;
           
            return [px, py, pz];
        };
        cylinder.prepare(shape, vertexType);
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
