define(function(require) {

    var Const = require('tools/const');
    var Common = require('tools/common');
    var ShapeBuilder = require('shapes/shape');

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
         * Indicates the top is closed.
         * @type {Boolean}
         */
        this.closedTop = true;
 
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
         * Indicates the bottom is closed.
         * @type {Boolean}
         */
        this.closedBottom = true;

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
        this.x = 0;

        /**
         * The offset of the cylinder's center on the y axis.
         * @type {Number}
         */
        this.y = 0;

        /**
         * The offset of the cylinder's center on the z axis.
         * @type {Number}
         */
        this.z = 0;
    }
    
    /**
     * The name of this shape.
     * @type {String}
     */
    CylinderBuilder.prototype.name = 'Cylinder';
    
    /**
     * The supported vertex types.
     * @type {Number}
     */
    CylinderBuilder.prototype.supportedTypes = Const.POS|Const.CLR3|Const.CLR4|
                                    Const.NORM|Const.TXT|Const.CUBE|Const.BINM;
    
    /**
     * Creates a cylinder.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {Number} vertexType  The type of vertices the cylinder should have.
     * @returns  {Shape}  The created cylinder.
     */
    CylinderBuilder.prototype.build = function(gl, vertexType) {
        var shape = new ShapeBuilder();
        if (this.closedTop) {
            this._buildTopCap(gl, shape, vertexType);
        }
        if (this.closedBottom) {
            this._buildBottomCap(gl, shape, vertexType);
        }
        this._buildSides(gl, shape, vertexType);
        return shape.build(gl);
    };

    /**
     * Builds the top cap of the cylinder.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {Shape} shape  The shape being built.
     * @param  {Number} vertexType  The type of vertices the cylinder should have.
     */
    CylinderBuilder.prototype._buildTopCap = function(gl, shape, vertexType) {
        if (!Common.eq(this.topRadius, 0, 0.00001)) {
            shape.pos.add(this.x, this.y+this.topHeight, this.z);
            if (vertexType&Const.NORM) {
                shape.norm.add(0, -1, 0);
            }
            if (vertexType&Const.CLR3) {
                shape.clr3.add(1, 1, 1);
            }
            if (vertexType&Const.CLR4) {
                shape.clr4.add(1, 1, 1, 1);
            }
            if (vertexType&Const.TXT) {
                shape.txt.add(0.5, 0.5);
            }
            if (vertexType&Const.CUBE) {
                shape.cube.add(0, 1, 0);
            }
            if (vertexType&Const.BINM) {
                shape.binm.add(0, 0, -1)
            }
            var index = shape.pos.count();
            shape.triFans.start(index-1, index+this.sideCount-1);
            
            for (var i = 0; i < this.sideCount; i++) {
                var angle = i*Math.PI*2.0/this.sideCount;
                var cos = Math.cos(angle);
                var sin = Math.sin(angle);
                shape.pos.add(cos*this.topRadius + this.x,
                    this.y+this.topHeight, sin*this.topRadius + this.z);
                if (vertexType&Const.NORM) {
                    shape.norm.add(0, -1, 0);
                }
                if (vertexType&Const.CLR3) {
                    shape.clr3.add(0, 1, 0);
                }
                if (vertexType&Const.CLR4) {
                    shape.clr4.add(0, 1, 0, 1);
                }
                if (vertexType&Const.TXT) {
                    shape.txt.add(cos*0.5+0.5, sin*0.5+0.5);
                }
                if (vertexType&Const.CUBE) {
                    shape.cube.add(cos*Math.SQRT2, Math.SQRT2, sin*Math.SQRT2);
                }
                if (vertexType&Const.BINM) {
                    shape.binm.add(0, 0, -1)
                }
                shape.triFans.add(index+i);
            }
        }
    };
        
    /**
     * Builds the bottom cap of the cylinder.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {Shape} shape  The shape being built.
     * @param  {Number} vertexType  The type of vertices the cylinder should have.
     */
    CylinderBuilder.prototype._buildBottomCap = function(gl, shape, vertexType) {
        if (!Common.eq(this.bottomRadius, 0, 0.00001)) {
            shape.pos.add(this.x, this.y+this.bottomHeight, this.z);
            if (vertexType&Const.NORM) {
                shape.norm.add(0, 1, 0);
            }
            if (vertexType&Const.CLR3) {
                shape.clr3.add(0, 0, 0);
            }
            if (vertexType&Const.CLR4) {
                shape.clr4.add(0, 0, 0, 1);
            }
            if (vertexType&Const.TXT) {
                shape.txt.add(0.5, 0.5);
            }
            if (vertexType&Const.CUBE) {
                shape.cube.add(0, -1, 0);
            }
            if (vertexType&Const.BINM) {
                shape.binm.add(0, 0, 1)
            }
            var index = shape.pos.count();
            shape.triFans.start(index-1, index);
            
            for (var i = 0; i < this.sideCount; i++) {
                var angle = i*Math.PI*2.0/this.sideCount;
                var cos = Math.cos(angle);
                var sin = Math.sin(angle);
                shape.pos.add(cos*this.bottomRadius + this.x,
                    this.y+this.bottomHeight, sin*this.bottomRadius + this.z);
                if (vertexType&Const.NORM) {
                    shape.norm.add(0, 1, 0);
                }
                if (vertexType&Const.CLR3) {
                    shape.clr3.add(0, 1, 0);
                }
                if (vertexType&Const.CLR4) {
                    shape.clr4.add(0, 1, 0, 1);
                }
                if (vertexType&Const.TXT) {
                    shape.txt.add(cos*0.5+0.5, sin*0.5+0.5);
                }
                if (vertexType&Const.CUBE) {
                    shape.cube.add(cos*Math.SQRT2, -Math.SQRT2, sin*Math.SQRT2);
                }
                if (vertexType&Const.BINM) {
                    shape.binm.add(0, 0, 1)
                }
                shape.triFans.add(index+this.sideCount-1-i);
            }
        }
    };
        
    /**
     * Builds the sides of the cylinder.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {Shape} shape  The shape being built.
     * @param  {Number} vertexType  The type of vertices the cylinder should have.
     */
    CylinderBuilder.prototype._buildSides = function(gl, shape, vertexType) {
        var i, j;
        var index = shape.pos.count();
        for (i = 0; i <= this.divCount; i++) {
            var tu = i/this.divCount;
            var height = this.y+tu*(this.topHeight-this.bottomHeight)+this.bottomHeight;
            for (j = 0; j <= this.sideCount; j++) {
                var angle = j*Math.PI*2.0/this.sideCount;
                var cos = Math.cos(angle);
                var sin = Math.sin(angle);
                shape.pos.add(cos*this.bottomRadius + this.x,
                    height, sin*this.bottomRadius + this.z);
                if (vertexType&Const.NORM) {
                    shape.norm.add(cos, 0, sin);
                }
                if (vertexType&Const.CLR3) {
                    shape.clr3.add(cos, 0, sin);
                }
                if (vertexType&Const.CLR4) {
                    shape.clr4.add(cos, 0, sin, 1);
                }
                if (vertexType&Const.TXT) {
                    shape.txt.add(Math.abs(j*2.0/this.sideCount - 1.0), tu);
                }
                if (vertexType&Const.CUBE) {
                    var ty = tu*2.0-1.0;
                    var len = Math.sqrt(1 + ty*ty);
                    shape.cube.add(cos/len, ty/len, sin/len);
                }
                if (vertexType&Const.BINM) {
                    shape.binm.add(0, sin, Math.abs(cos));
                }
            }
        }
        for (i = 1; i <= this.divCount; i++) {
            shape.triStrips.start();
            for (j = 0; j <= this.sideCount; j++) {
                shape.triStrips.add(index+this.sideCount+j+1, index+j);
            }
            index += (this.sideCount+1);
        }
        
        return shape.build(gl);
    };

    return CylinderBuilder;
});
