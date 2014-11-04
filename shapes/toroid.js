define(function(require) {

    var Const = require('tools/const');
    var ShapeBuilder = require('shapes/shape');

    /**
     * Creates a toroid builder.
     */
    function ToroidBuilder() {
        
        /**
         * The major radius of the toroid.
         * @type {Number}
         */
        this.majorRadius = 0.5;
 
        /**
         * The minor radius of the toroid.
         * @type {Number}
         */
        this.minorRadius = 0.2;

        /**
         * The major count of the toroid.
         * @type {Number}
         */
        this.majorCount = 40;

        /**
         * The minor count of the toroid.
         * @type {Number}
         */
        this.minorCount = 20;

        /**
         * The offset of the toroid's center on the x axis.
         * @type {Number}
         */
        this.x = 0;

        /**
         * The offset of the toroid's center on the y axis.
         * @type {Number}
         */
        this.y = 0;

        /**
         * The offset of the toroid's center on the z axis.
         * @type {Number}
         */
        this.z = 0;
    }
    
    /**
     * The name of this shape.
     * @type {String}
     */
    ToroidBuilder.prototype.name = 'Toroid';
    
    /**
     * The supported vertex types.
     * @type {Number}
     */
    ToroidBuilder.prototype.supportedTypes = Const.POS|Const.CLR3|Const.CLR4|
                                  Const.NORM|Const.TXT|Const.CUBE|Const.BINM;
    
    /**
     * Prepares a shape builder for a toroid shape.
     * @param  {ShapeBuilder} shape  The shape builder to prepare.
     * @param  {Number} vertexType  The vertex type to build.
     */
    ToroidBuilder.prototype.prepare = function(shape, vertexType) {
        for(var i = 0; i <= this.majorCount; ++i) {
            var majorScale = i/this.majorCount;
            var majorAngle = 2.0*Math.PI*majorScale;
            var majorCos = Math.cos(majorAngle);
            var majorSin = Math.sin(majorAngle);

            shape.triStrips.start();
            var i1 = ((i+1)%(this.majorCount+1))*(this.minorCount+1);
            var i2 = i*(this.minorCount+1);
            
            for(var j = 0; j <= this.minorCount; ++j) {
                var minorScale = j/this.minorCount;
                var minorAngle = 2.0*Math.PI*minorScale;
                var minorCos = Math.cos(minorAngle);
                var minorSin = Math.sin(minorAngle);

                var pr = this.majorRadius+minorCos*this.minorRadius;
                var px = majorSin*pr + this.x;
                var py = minorSin*this.minorRadius + this.y;
                var pz = majorCos*pr + this.z;
                shape.pos.add(px, py, pz);

                var r = majorSin*minorCos*0.5+0.5;
                var g = minorSin*0.5+0.5;
                var b = majorCos*minorCos*0.5+0.5;
                if (vertexType&Const.CLR3) {
                    shape.clr3.add(r, g, b);
                }
                if (vertexType&Const.CLR4) {
                    shape.clr4.add(r, g, b, 1);
                }

                if (vertexType&Const.NORM) {
                    var nx = majorSin*minorCos;
                    var ny = minorSin;
                    var nz = majorCos*minorCos;
                    shape.norm.add(nx, ny, nz);
                }
                if (vertexType&Const.BINM) {
                    var nx = minorSin;
                    var ny = majorCos*minorCos;
                    var nz = majorSin*minorCos;
                    shape.binm.add(nx, ny, nz);
                }
                if (vertexType&Const.TXT) {
                    shape.txt.add(majorScale, minorScale);
                }

                if (vertexType&Const.CUBE) {
                    var tx = majorSin*minorCos;
                    var ty = minorSin;
                    var tz = majorCos*minorCos;
                    shape.cube.add(tx, ty, tz);
                }

                shape.triStrips.add(i1+j, i2+j);
            }
        }
    };

    /**
     * Creates a toroid.
     * @param  {WebGLRenderingContext} gl  The graphics object.
     * @param  {Number} vertexType  The type of vertices the toroid should have.
     * @returns  {Shape}  The created toroid.
     */
    ToroidBuilder.prototype.build = function(gl, vertexType) {
        var shape = new ShapeBuilder();
        this.prepare(shape, vertexType);
        return shape.build(gl, vertexType);
    };

    return ToroidBuilder;
});
