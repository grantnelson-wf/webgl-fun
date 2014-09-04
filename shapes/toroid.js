define(function(require) {

    var Const = require("tools/const")
    var ShapeBuilder = require("shapes/shape")

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
        this.x = 0.0;

        /**
         * The offset of the toroid's center on the y axis.
         * @type {Number}
         */
        this.y = 0.0;

        /**
         * The offset of the toroid's center on the z axis.
         * @type {Number}
         */
        this.z = 0.0;
    }
    
    /**
     * The name of this shape.
     * @type {String}
     */
    ToroidBuilder.prototype.name = "Toroid";
    
    /**
     * The supported vertex types.
     * @type {Number}
     */
    ToroidBuilder.prototype.supportedTypes = Const.POS|Const.CLR|Const.NORM|Const.TXT;
    
    /**
     * Creates a toroid.
     * @param  {WebGLRenderingContext} gl  The graphics object.
     * @param  {Number} vertexType  The type of vertices the toroid should have.
     * @returns  {Shape}  The created toroid.
     */
    ToroidBuilder.prototype.build = function(gl, vertexType) {
        var shape = new ShapeBuilder();

        for(var i = 0; i < this.majorCount; ++i) {
            var majorScale = i/this.majorCount;
            var majorAngle = 2.0*Math.PI*majorScale;
            var majorCos = Math.cos(majorAngle);
            var majorSin = Math.sin(majorAngle);

            shape.startTriStrip();
            var i1 = ((i+1)%this.majorCount)*this.minorCount;
            var i2 = i*this.minorCount;
            shape.addToTriStrip(i1+this.minorCount-1, i2+this.minorCount-1);
            
            for(var j = 0; j < this.minorCount; ++j) {
                var minorScale = j/this.minorCount;
                var minorAngle = 2.0*Math.PI*minorScale;
                var minorCos = Math.cos(minorAngle);
                var minorSin = Math.sin(minorAngle);

                var pr = this.majorRadius+minorCos*this.minorRadius;
                var px = majorSin*pr + this.x;
                var py = minorSin*this.minorRadius + this.y;
                var pz = majorCos*pr + this.z;
                shape.addPos(px, py, pz);

                if (vertexType&Const.CLR) {
                    var r = majorSin*minorCos*0.5+0.5;
                    var g = minorSin*0.5+0.5;
                    var b = majorCos*minorCos*0.5+0.5;
                    shape.addClr(r, g, b);
                }

                if (vertexType&Const.NORM) {
                    var nx = majorSin*minorCos;
                    var ny = minorSin;
                    var nz = majorCos*minorCos;
                    shape.addNorm(nx, ny, nz);
                }

                if (vertexType&Const.TXT) {
                    shape.addTxt(majorScale, minorScale);
                }

                shape.addToTriStrip(i1+j, i2+j);
            }
        }

        return shape.build(gl);
    };

    return ToroidBuilder;
});
