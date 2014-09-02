define(function(require) {

    var Const = require("tools/const")
    var ShapeBuilder = require("shapes/shape")

    /**
     * Constructor for a cube builder.
     * A cube builder will create a cube shape object.
     */
    function CubeBuilder() {

        /**
         * The width of the cube in the x axis.
         * @type {Number}
         */
        this.width = 1.0;

        /**
         * The height of the cube in the y axis.
         * @type {Number}
         */
        this.height = 1.0;

        /**
         * The depth of the cube in the z axis.
         * @type {Number}
         */
        this.depth = 1.0;

        /**
         * The offset of the cube's center on the x axis.
         * @type {Number}
         */
        this.x = 0.0;

        /**
         * The offset of the cube's center on the y axis.
         * @type {Number}
         */
        this.y = 0.0;

        /**
         * The offset of the cube's center on the z axis.
         * @type {Number}
         */
        this.z = 0.0;
    }
    
    /**
     * The name of this shape.
     * @type {String}
     */
    CubeBuilder.prototype.name = "Cube";
    
    /**
     * The supported vertex types.
     * @type {Number}
     */
    CubeBuilder.prototype.supportedTypes = Const.POS|Const.CLR|Const.NORM|Const.TXT;
    
    /**
     * Adds a position to the shape.
     * @param  {ShapeBuilder} shape  The shape being built.
     * @param  {Number} sx           The x axis scalar.
     * @param  {Number} sy           The y axis scalar.
     * @param  {Number} sz           The z axis scalar.
     */
    CubeBuilder.prototype._addPos = function(shape, sx, sy, sz) {
        shape.addPos(this.width*sx*0.5 + this.x,
                     this.height*sy*0.5 + this.y, 
                     this.depth*sz*0.5 + this.z);
    };

    /**
     * This adds a face of the cube to the shape builder.
     * @param  {ShapeBuilder} shape  The shape being built.
     * @param  {Number} vertexType   The vertex type to build.
     * @param  {Number} nx           The x normal component.
     * @param  {Number} ny           The y normal component.
     * @param  {Number} nz           The z normal component.
     * @param  {Number} tu1          The first u texture coordinate.
     * @param  {Number} tv1          The first v texture coordinate.
     * @param  {Number} tu2          The second u texture coordinate.
     * @param  {Number} tv2          The second v texture coordinate.
     */
    CubeBuilder.prototype._addFace = function(shape, vertexType, nx, ny, nz, tu1, tv1, tu2, tv2) {
        var index = shape.posCount();

        this._addPos(shape, nx+ny+nz, ny+nz+nx, nz+nx+ny);
        this._addPos(shape, nx-ny+nz, ny-nz+nx, nz-nx+ny);
        this._addPos(shape, nx+ny-nz, ny+nz-nx, nz+nx-ny);
        this._addPos(shape, nx-ny-nz, ny-nz-nx, nz-nx-ny);

        if (vertexType&Const.CLR) {
            if (nx+ny+nz > 0) {
                shape.addClr(nx, ny, nz);
                shape.addClr(nx, ny, nz);
                shape.addClr(nx, ny, nz);
                shape.addClr(nx, ny, nz);
            } else {
                shape.addClr(1+nx, 1+ny, 1+nz);
                shape.addClr(1+nx, 1+ny, 1+nz);
                shape.addClr(1+nx, 1+ny, 1+nz);
                shape.addClr(1+nx, 1+ny, 1+nz);
            }
        }

        if (vertexType&Const.NORM) {
            shape.addNorm(nx, ny, nz);
            shape.addNorm(nx, ny, nz);
            shape.addNorm(nx, ny, nz);
            shape.addNorm(nx, ny, nz);
        }

        if (vertexType&Const.TXT) {
            shape.addTxt(tu1, tv1);
            shape.addTxt(tu1, tv2);
            shape.addTxt(tu2, tv1);
            shape.addTxt(tu2, tv2);
        }

        if (nx+ny+nz > 0) {
            shape.addQuadIndices(index, index+1, index+3, index+2);
        } else {
            shape.addQuadIndices(index, index+2, index+3, index+1);
        }
    };
    
    /**
     * Builds a cube shape.
     * @param  {Graphics} gfx       The graphical object.
     * @param  {Number} vertexType  The vertex type to build.
     * @return  {Shape}  The created cube shape.
     */
    CubeBuilder.prototype.build = function(gfx, vertexType) {
        var shape = new ShapeBuilder();
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
        //                              nx  ny  nz  tu1  tv1  tu2  tv2
        this._addFace(shape, vertexType,  1,  0,  0, 3/4, 1/3, 2/4, 2/3); // x+
        this._addFace(shape, vertexType, -1,  0,  0, 1/4, 2/3, 0/4, 1/3); // X-
        this._addFace(shape, vertexType,  0,  1,  0, 3/4, 1/3, 4/4, 2/3); // Y+
        this._addFace(shape, vertexType,  0, -1,  0, 1/4, 2/3, 2/4, 1/3); // Y-
        this._addFace(shape, vertexType,  0,  0,  1, 2/4, 0/3, 1/4, 1/3); // Z+
        this._addFace(shape, vertexType,  0,  0, -1, 1/4, 2/3, 2/4, 3/3); // Z-
        return shape.build(gfx)
    };

    return CubeBuilder;
});
