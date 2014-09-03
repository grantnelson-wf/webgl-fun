define(function(require) {

    var Const = require("tools/const")
    var Common = require("tools/common")
    var ShapeBuilder = require("shapes/shape")

    /**
     * Creates a cylinder builder.
     */
    function CylinderBuilder() {
        
        /**
         * The radius of the top of the cylinder.
         * @type {Number}
         */
        this.topRadius = 0.5;
        
        /**
         * The height to the top of the cylinder.
         * @type {Number}
         */
        this.topHeight = 0.5;
 
        /**
         * The radius of the bottom of the cylinder.
         * @type {Number}
         */
        this.bottomRadius = 0.5;
 
        /**
         * The height to the bottom of the cylinder.
         * @type {Number}
         */
        this.bottomHeight = -0.5;

        /**
         * The side count of the cylinder.
         * @type {Number}
         */
        this.sideCount = 40;
        
        /**
         * The divisions of the side of the cylinder.
         * @type {Number}
         */
        this.divCount = 1;

        /**
         * The offset of the cylinder's center on the x axis.
         * @type {Number}
         */
        this.x = 0.0;

        /**
         * The offset of the cylinder's center on the y axis.
         * @type {Number}
         */
        this.y = 0.0;

        /**
         * The offset of the cylinder's center on the z axis.
         * @type {Number}
         */
        this.z = 0.0;
    }
    
    /**
     * The name of this shape.
     * @type {String}
     */
    CylinderBuilder.prototype.name = "Cylinder";
    
    /**
     * The supported vertex types.
     * @type {Number}
     */
    CylinderBuilder.prototype.supportedTypes = Const.POS|Const.CLR|Const.NORM|Const.TXT;
    
    /**
     * Creates a cylinder.
     * @param  {Graphics} gfx       The graphics object.
     * @param  {Number} vertexType  The type of vertices the cylinder should have.
     * @returns  {Shape}  The created cylinder.
     */
    CylinderBuilder.prototype.build = function(gfx, vertexType) {
        var shape = new ShapeBuilder();

        // Add top cap.
        if (!Common.eq(this.topRadius, 0.0, 0.00001)) {
            shape.addPos(this.x, this.y+this.topHeight, this.z);
            if (vertexType&Const.NORM) {
                shape.addNorm(0, 1, 0);
            }
            if (vertexType&Const.CLR) {
                shape.addClr(1, 1, 1);
            }
            if (vertexType&Const.TXT) {
                shape.addTxt(0, 1);
            }
            var index = shape.posCount();
            shape.startTriFan(index-1, index+this.sideCount-2);
            
            for (var i = 0; i < this.sideCount; i++) {
                var angle = i*Math.PI*2.0/this.sideCount;
                var xpos = Math.cos(angle)*this.topRadius + this.x;
                var zpos = Math.sin(angle)*this.topRadius + this.z;
                shape.addPos(xpos, this.y+this.topHeight, zpos);
                if (vertexType&Const.NORM) {
                    shape.addNorm(0, 1, 0);
                }
                if (vertexType&Const.CLR) {
                    shape.addClr(0, 1, 0);
                }
                if (vertexType&Const.TXT) {
                    shape.addTxt(i/this.sideCount, 1);
                }
                shape.addToTriFan(index+i);
            };
        }
        
        // Add bottom cap.
        if (!Common.eq(this.bottomRadius, 0.0, 0.00001)) {
            shape.addPos(this.x, this.y+this.bottomHeight, this.z);
            if (vertexType&Const.NORM) {
                shape.addNorm(0, -1, 0);
            }
            if (vertexType&Const.CLR) {
                shape.addClr(0, 0, 0);
            }
            if (vertexType&Const.TXT) {
                shape.addTxt(0, 0);
            }
            var index = shape.posCount();
            shape.startTriFan(index-1, index);
            
            for (var i = 0; i < this.sideCount; i++) {
                var angle = i*Math.PI*2.0/this.sideCount;
                var xpos = Math.cos(angle)*this.bottomRadius + this.x;
                var zpos = Math.sin(angle)*this.bottomRadius + this.z;
                shape.addPos(xpos, this.y+this.bottomHeight, zpos);
                if (vertexType&Const.NORM) {
                    shape.addNorm(0, -1, 0);
                }
                if (vertexType&Const.CLR) {
                    shape.addClr(0, 1, 0);
                }
                if (vertexType&Const.TXT) {
                    shape.addTxt(i/this.sideCount, 0);
                }
                shape.addToTriFan(index+this.sideCount-1-i);
            };
        }
        
        // Add sides.
        var index = shape.posCount();
        for (var i = 0; i <= this.divCount; i++) {
            var tu = i/this.divCount;
            var height = this.y+tu*(this.topHeight-this.bottomHeight)+this.bottomHeight;
            for (var j = 0; j < this.sideCount; j++) {
                var angle = j*Math.PI*2.0/this.sideCount;
                var cos = Math.cos(angle);
                var sin = Math.sin(angle);
                shape.addPos(cos*this.bottomRadius + this.x,
                    height, sin*this.bottomRadius + this.z);
                if (vertexType&Const.NORM) {
                    shape.addNorm(cos, 0, sin);
                }
                if (vertexType&Const.CLR) {
                    shape.addClr(cos, 0, sin);
                }
                if (vertexType&Const.TXT) {
                    shape.addTxt(j/this.sideCount, tu);
                }
            };
        };
        for (var i = 1; i <= this.divCount; i++) {
            index += this.sideCount;
            shape.startTriStrip(index+this.sideCount-1, index-1);
            for (var j = 0; j < this.sideCount; j++) {
                shape.addToTriStrip(index+j, index-this.sideCount+j);
            };
        };
        
        return shape.build(gfx);
    };

    return CylinderBuilder;
});
