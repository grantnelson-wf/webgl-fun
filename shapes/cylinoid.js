define(function(require) {

    var Const = require('tools/const');
    var Common = require('tools/common');
    var ShapeBuilder = require('shapes/shape');

    /**
     * Creates a cylinder builder.
     */
    function CylinderBuilder() {
        
        /**
         * The calculation of the location for sides.
         * @type {Function}
         * @param  {Number} i  The division of the height.
         * @param  {Number} j  The division of the side.
         * @return  {Array}  The resulting position.
         */
        this.sideFunction = function(i, j) {
            var height = (i/this.divCount) - 0.5;
            var angle = j*Math.PI*2.0/this.sideCount;
            var cos = Math.cos(angle);
            var sin = Math.sin(angle);
            return [cos*0.5, height, sin*0.5];
        };

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
 
        /**
         * Indicates the ends are joined.
         * @type {Boolean}
         */
        this.joinEnds = false;
        
        /**
         * Indicates the top is closed.
         * @type {Boolean}
         */
        this.closedTop = false;
 
        /**
         * Indicates the bottom is closed.
         * @type {Boolean}
         */
        this.closedBottom = true;
        
        /**
         * TODO: Comment
         * Indicates the top is closed.
         * @type {Boolean}
         */
        this.topPos = [0, 0.5, 0];
 
        /**
         * TODO: Comment
         * Indicates the bottom is closed.
         * @type {Boolean}
         */
        this.bottomPos = [0, -0.5, 0];
    }
    
    /**
     * The name of this shape.
     * @type {String}
     */
    CylinderBuilder.prototype.name = 'Cylinoid';
    
    /**
     * The supported vertex types.
     * @type {Number}
     */
    CylinderBuilder.prototype.supportedTypes = Const.POS|Const.CLR3|Const.CLR4|
                                    Const.NORM|Const.TXT|Const.CUBE|Const.BINM;
    
    /**
     * Prepares a shape builder for a cylinder shape.
     * @param  {ShapeBuilder} shape  The shape builder to prepare.
     * @param  {Number} vertexType  The vertex type to build.
     */
    CylinderBuilder.prototype.prepare = function(shape, vertexType) {
        var i, j;
        var index = shape.pos.count();
        for (i = 0; i <= this.divCount; i++) {
            var tu = i/this.divCount;
            for (j = 0; j <= this.sideCount; j++) {
                var pnt = this.sideFunction(i, j);
                shape.pos.add(pnt[0], pnt[1], pnt[2]);

                var angle = j*Math.PI*2.0/this.sideCount;
                var cos = Math.cos(angle);
                var sin = Math.sin(angle);
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
        
        if (this.closedTop) {
            shape.pos.add(this.topPos[0], this.topPos[1], this.topPos[2]);
            if (vertexType&Const.CLR3) {
                shape.clr3.add(1, 1, 1);
            }
            if (vertexType&Const.CLR4) {
                shape.clr4.add(1, 1, 1, 1);
            }
            if (vertexType&Const.TXT) {
                shape.txt.add(0, 1);
            }
            if (vertexType&Const.CUBE) {
                shape.cube.add(0, 1, 0);
            }
            if (vertexType&Const.BINM) {
                shape.binm.add(0, 0, 1);
            }
            
            shape.triFans.start(shape.pos.count()-1);
            var index = (this.sideCount+1)*(this.divCount+1)-1;
            for (j = this.sideCount; j >= 0; j--) {
                shape.triFans.add(index-j);
            }
        }
        
        if (this.closedBottom) {
            shape.pos.add(this.bottomPos[0], this.bottomPos[1], this.bottomPos[2]);
            if (vertexType&Const.CLR3) {
                shape.clr3.add(0, 0, 0);
            }
            if (vertexType&Const.CLR4) {
                shape.clr4.add(0, 0, 0, 1);
            }
            if (vertexType&Const.TXT) {
                shape.txt.add(0, 0);
            }
            if (vertexType&Const.CUBE) {
                shape.cube.add(0, -1, 0);
            }
            if (vertexType&Const.BINM) {
                shape.binm.add(0, 0, -1);
            }
        
            shape.triFans.start(shape.pos.count()-1);
            for (j = this.sideCount; j >= 0; j--) {
                shape.triFans.add(j);
            }
        }
        
        if (this.joinEnds) {
            shape.triStrips.start();
            var index = (this.sideCount+1)*(this.divCount+1)-1;
            for (j = 0; j <= this.sideCount; j++) {
                shape.triStrips.add(index-j);
                shape.triStrips.add(j);
            }
        }
       
        if ((vertexType&Const.NORM) || (vertexType&Const.CUBE)) {
            shape.calculateNormals();
            if (vertexType&Const.CUBE) {
                shape.copyNormToCube();
            }
        }
    };
    
    /**
     * Creates a cylinder.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {Number} vertexType  The type of vertices the cylinder should have.
     * @returns  {Shape}  The created cylinder.
     */
    CylinderBuilder.prototype.build = function(gl, vertexType) {
        var shape = new ShapeBuilder();
        this.prepare(shape, vertexType);
        return shape.build(gl, vertexType);
    };

    return CylinderBuilder;
});
