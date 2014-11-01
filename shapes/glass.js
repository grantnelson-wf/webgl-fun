define(function(require) {

    var Const = require('tools/const');
    var Common = require('tools/common');
    var ShapeBuilder = require('shapes/shape');
    var CylinderBuilder = require('shapes/cylinoid');

    /**
     * TODO: Comment
     * @param  {[type]} a [description]
     * @param  {[type]} b [description]
     * @param  {[type]} i [description]
     * @return {[type]}   [description]
     */
    function lerp(a, b, i) {
        if (i <= 0.0) {
            return a;
        } else if (i >= 1.0) {
            return b;
        } else {
            return (b-a)*i + a;
        }
    }


    /**
     * Creates a cylinder builder.
     */
    function GlassBuilder() {

        /**
         * The side count of the cylinder.
         * @type {Number}
         */
        this.sideCount = 40;
        
        /**
         * The divisions of the side of the cylinder.
         * @type {Number}
         */
        this.divCount = 20;
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
        cylinder.sideCount = this.sideCount;
        cylinder.divCount = this.divCount;
        cylinder.sideFunction = function(i, j) {
            var offset = i/this.divCount;

            var radius, height;
            if (offset > 0.9) {
                var local = (offset-0.9)/0.1;
                radius = lerp(0.05, 0.3, local);
                height = lerp(0.4, 0.5, local);
            } else if (offset > 0.8) {
                var local = (offset-0.8)/0.1;
                radius = 0.05;
                height = lerp(0.0, 0.4, local);
            } else if (offset > 0.7) {
                var local = (offset-0.7)/0.1;
                radius = lerp(0.3, 0.05, local);
                height = lerp(0.0, 0.1, local);
            } else if (offset > 0.4) {
                var local = (offset-0.4)/0.3;
                radius = lerp(0.4, 0.3, local);
                height = lerp(0.1, -0.5, local);
            //} else if (offset > 0.35) {
            //    var local = (offset-0.35)/0.05;
            //    radius = lerp(0.4, 0.35, local);
            //    height = -0.5;
            //} else if (offset > 0.05) {
            //    var local = (offset-0.05)/0.3;
            //    radius = lerp(0.35, 0.25, local);
            //    height = lerp(-0.5, 0.1, local);
            } else {
                //var local = offset/0.05;
                radius = 0.0;//lerp(0.25, 0.0, local);
                height = -1.0;
            }

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
