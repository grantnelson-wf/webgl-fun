define(function(require) {

    var Const = require('tools/const');
    var ShapeBuilder = require('shapes/shape');

    /**
     * Constructor for a cube builder.
     * A cube builder will create a cube shape object.
     */
    function CubeBuilder() {

        /**
         * @type {Boolean}
         */
        this.flatFace = true;

        /**
         * The width of the cube in the x axis.
         * @type {Number}
         */
        this.width = 1;

        /**
         * The height of the cube in the y axis.
         * @type {Number}
         */
        this.height = 1;

        /**
         * The depth of the cube in the z axis.
         * @type {Number}
         */
        this.depth = 1;

        /**
         * The offset of the cube's center on the x axis.
         * @type {Number}
         */
        this.x = 0;

        /**
         * The offset of the cube's center on the y axis.
         * @type {Number}
         */
        this.y = 0;

        /**
         * The offset of the cube's center on the z axis.
         * @type {Number}
         */
        this.z = 0;
    }
    
    /**
     * The name of this shape.
     * @type {String}
     */
    CubeBuilder.prototype.name = 'Cube';
    
    /**
     * The supported vertex types.
     * @type {Number}
     */
    CubeBuilder.prototype.supportedTypes = Const.POS|Const.CLR3|Const.CLR4|
                                Const.NORM|Const.TXT|Const.CUBE|Const.BINM;
    
    /**
     * Adds a position to the shape.
     * @param  {ShapeBuilder} shape  The shape being built.
     * @param  {Number} sx           The x axis scalar.
     * @param  {Number} sy           The y axis scalar.
     * @param  {Number} sz           The z axis scalar.
     */
    CubeBuilder.prototype._addPos = function(shape, sx, sy, sz) {
        shape.pos.add(this.width *sx*0.5 + this.x,
                      this.height*sy*0.5 + this.y, 
                      this.depth *sz*0.5 + this.z);
    };

    /**
     * Adds a color to the shape.
     * @param  {Number} shape       The shape being built.
     * @param  {Number} vertexType  The vertex type to build.
     * @param  {Number} r           The red component of the color.
     * @param  {Number} g           The green component of the color.
     * @param  {Number} b           The blue component of the color.
     */
    CubeBuilder.prototype._addClr = function(shape, vertexType, r, g, b) {
        if (vertexType&Const.CLR3) {
            shape.clr3.add(r, g, b);
            shape.clr3.add(r, g, b);
            shape.clr3.add(r, g, b);
            shape.clr3.add(r, g, b);
        }
        if (vertexType&Const.CLR4) {
            shape.clr4.add(r, g, b, 1);
            shape.clr4.add(r, g, b, 1);
            shape.clr4.add(r, g, b, 1);
            shape.clr4.add(r, g, b, 1);
        }
    };

    /**
     * This adds a face of the cube to the shape builder.
     * @param  {ShapeBuilder} shape  The shape being built.
     * @param  {Number} vertexType   The vertex type to build.
     * @param  {Number} nx           The x normal component.
     * @param  {Number} ny           The y normal component.
     * @param  {Number} nz           The z normal component.
     * @param  {Number} bix          The x binormal component.
     * @param  {Number} biy          The y binormal component.
     * @param  {Number} biz          The z binormal component.
     */
    CubeBuilder.prototype._addFace = function(shape, vertexType, nx, ny, nz, bix, biy, biz) {
        var index = shape.pos.count();

        this._addPos(shape, nx+ny+nz, ny+nz+nx, nz+nx+ny);
        this._addPos(shape, nx-ny+nz, ny-nz+nx, nz-nx+ny);
        this._addPos(shape, nx+ny-nz, ny+nz-nx, nz+nx-ny);
        this._addPos(shape, nx-ny-nz, ny-nz-nx, nz-nx-ny);

        if (nx+ny+nz > 0) {
            this._addClr(shape, vertexType, nx, ny, nz);
        } else {
            this._addClr(shape, vertexType, 1+nx, 1+ny, 1+nz);
        }

        if (vertexType&Const.NORM) {
            shape.norm.add(nx, ny, nz);
            shape.norm.add(nx, ny, nz);
            shape.norm.add(nx, ny, nz);
            shape.norm.add(nx, ny, nz);
        }

        if (vertexType&Const.BINM) {
            shape.binm.add(bix, biy, biz);
            shape.binm.add(bix, biy, biz);
            shape.binm.add(bix, biy, biz);
            shape.binm.add(bix, biy, biz);
        }

        if (vertexType&Const.TXT) {
            shape.txt.add(0, 0);
            shape.txt.add(0, 1);
            shape.txt.add(1, 0);
            shape.txt.add(1, 1);
        }

        if (vertexType&Const.CUBE) {
            shape.cube.add((nx+ny+nz)*Math.SQRT2, (ny+nz+nx)*Math.SQRT2, (nz+nx+ny)*Math.SQRT2);
            shape.cube.add((nx-ny+nz)*Math.SQRT2, (ny-nz+nx)*Math.SQRT2, (nz-nx+ny)*Math.SQRT2);
            shape.cube.add((nx+ny-nz)*Math.SQRT2, (ny+nz-nx)*Math.SQRT2, (nz+nx-ny)*Math.SQRT2);
            shape.cube.add((nx-ny-nz)*Math.SQRT2, (ny-nz-nx)*Math.SQRT2, (nz-nx-ny)*Math.SQRT2);
        }

        if (nx+ny+nz > 0) {
            shape.quads.add(index, index+1, index+3, index+2);
        } else {
            shape.quads.add(index, index+2, index+3, index+1);
        }
    };
    
    /**
     * Prepares a shape builder for a cube shape.
     * @param  {ShapeBuilder} shape  The shape builder to prepare.
     * @param  {Number} vertexType  The vertex type to build.
     */
    CubeBuilder.prototype.prepare = function(shape, vertexType) {
        //                      +--   E-----A   --------+
        //      E--------A      |     |Z+   |           |
        //     /|       /|            |     |
        //    G--------C |      E-----G-----C-----A-----E
        //    | |      | |      |X-   |Y-   |X+   |Y+   |
        //    | F------|-B      |     |     |     |     |
        //    |/       |/       F-----H-----D-----B-----F
        //    H--------D              |Z-   |
        //                      |     |     |           |
        //                      +--   F-----B   --------+
        //                      
        //                               nx  ny  nz bix biy biz
        this._addFace(shape, vertexType,  1,  0,  0,  0,  0, -1); // x+
        this._addFace(shape, vertexType, -1,  0,  0,  0,  0,  1); // X-
        this._addFace(shape, vertexType,  0,  1,  0, -1,  0,  0); // Y+
        this._addFace(shape, vertexType,  0, -1,  0,  1,  0,  0); // Y-
        this._addFace(shape, vertexType,  0,  0,  1,  0, -1,  0); // Z+
        this._addFace(shape, vertexType,  0,  0, -1,  0,  1,  0); // Z-
    };
    
    /**
     * Builds a cube shape.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {Number} vertexType  The vertex type to build.
     * @return  {Shape}  The created cube shape.
     */
    CubeBuilder.prototype.build = function(gl, vertexType) {
        var shape = new ShapeBuilder();
        this.prepare(shape, vertexType);
        return shape.build(gl, vertexType);
    };

    return CubeBuilder;
});
