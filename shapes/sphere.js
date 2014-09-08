define(function(require) {

    var Const = require('tools/const');
    var ShapeBuilder = require('shapes/shape');

    /**
     * Creates a toroid builder.
     */
    function SphereBuilder() {

        /**
         * The number of iterations of subdivisions.
         * @type {Number}
         */
        this.iterations = 3;
        
        /**
         * The scalar to apply to the x axis positions of the sphere.
         * @type {Number}
         */
        this.scalarX = 0.5;
 
        /**
         * The scalar to apply to the y axis positions of the sphere.
         * @type {Number}
         */
        this.scalarY = 0.5;

        /**
         * The scalar to apply to the z axis positions of the sphere.
         * @type {Number}
         */
        this.scalarZ = 0.5;

        /**
         * The offset of the sphere's center on the x axis.
         * @type {Number}
         */
        this.x = 0;

        /**
         * The offset of the sphere's center on the y axis.
         * @type {Number}
         */
        this.y = 0;

        /**
         * The offset of the sphere's center on the z axis.
         * @type {Number}
         */
        this.z = 0;
    }
    
    /**
     * The name of this shape.
     * @type {String}
     */
    SphereBuilder.prototype.name = 'Sphere';
    
    /**
     * The supported vertex types.
     * @type {Number}
     */
    SphereBuilder.prototype.supportedTypes = Const.POS|Const.CLR3|Const.CLR4|Const.NORM|Const.TXT|Const.CUBE;
    
    /**
     * This looks up the index at the coordinate or add the position for the coordinate.
     * @note  The normal isn't effected by the scalars meaning, when the scalars are different from each other
     *        they will not point in the correct direction according to the face. A last past could be used
     *        to recalculate the normals once the faces have been determined.
     * @param  {ShapeBuilder} shape   The shape to find in or add to.
     * @param  {Number} vertexType  The type of vertex to add (normals will always be added.)
     * @param  {Number} nx  The normal x coordinate component.
     * @param  {Number} ny  The normal y coordinate component.
     * @param  {Number} nz  The normal z coordinate component.
     * @returns  {Number}  The index for this coordinate.
     */
    SphereBuilder.prototype._posIndex = function(shape, vertexType, nx, ny, nz) {
        var len = Math.sqrt(nx*nx + ny*ny + nz*nz);
        nx /= len;
        ny /= len;
        nz /= len;
        var index = shape.norm.find(nx, ny, nz, 0.0001);
        if (index >= 0) {
            return index;
        }

        shape.pos.add(this.scalarX*nx + this.x, this.scalarY*ny + this.y, this.scalarZ*nz + this.z);
        shape.norm.add(nx, ny, nz);
        if (vertexType&Const.CLR3) {
            shape.clr3.add(nx*0.5 + 0.5, ny*0.5 + 0.5, nz*0.5 + 0.5);
        }
        if (vertexType&Const.CLR4) {
            shape.clr4.add(nx*0.5 + 0.5, ny*0.5 + 0.5, nz*0.5 + 0.5);
        }
        if (vertexType&Const.TXT) {
            var w = Math.sqrt(nx*nx + ny*ny);
            var tu = Math.atan2(ny, nx)/Math.PI+0.5;
            var tv = Math.atan2(w, nz)/Math.PI+0.5;
            shape.txt.add(tu, tv);
        }
        if (vertexType&Const.CUBE) {
            shape.cube.add(nx, ny, nz);
        }
        return shape.norm.count()-1;
    };

    /**
     * Looks up or creates the mid point between the two given normals.
     * @param  {ShapeBuilder} shape  The shape build built.
     * @param  {Number} vertexType   The type of vertex to create.
     * @param  {Array} norm1         The first normal.
     * @param  {Array} norm2         The second normal.
     * @returns  {Number}  The index of the middle point.
     */
    SphereBuilder.prototype._posMid = function(shape, vertexType, norm1, norm2) {
        var nx = (norm1[0] + norm2[0])/2;
        var ny = (norm1[1] + norm2[1])/2;
        var nz = (norm1[2] + norm2[2])/2;
        return this._posIndex(shape, vertexType, nx, ny, nz);
    };

    /**
     * This handles creating a face and sub-dividing the face for each iteration.
     * @param  {ShapeBuilder} shape  The shape build built.
     * @param  {Number} vertexType   The type of vertex to create.
     * @param  {Number} i1           The first index into the triangle.
     * @param  {Number} i2           The second index into the triangle.
     * @param  {Number} i3           The third index into the triangle.
     * @param  {Number} iteration    The number of iterations left.
     */
    SphereBuilder.prototype._div = function(shape, vertexType, i1, i2, i3, iteration) {
        //         2                  2                             
        //         .                  .                 
        //        / \                / \                 
        //       /   \              /B  \                 
        //      /     \     =>   4 /_____\ 5                 
        //     /       \          /\ C  / \                 
        //    /         \        /A \  /D  \                 
        //   /___________\      /____\/_____\                 
        //  1             3    1      6      3
        if (iteration <= 0) {
            shape.addTriIndices(i1, i3, i2);
        } else {
            var norm1 = shape.norm.get(i1);
            var norm2 = shape.norm.get(i2);
            var norm3 = shape.norm.get(i3);
            var i4 = this._posMid(shape, vertexType, norm1, norm2);
            var i5 = this._posMid(shape, vertexType, norm2, norm3);
            var i6 = this._posMid(shape, vertexType, norm3, norm1);
            this._div(shape, vertexType, i1, i4, i6, iteration-1); // A
            this._div(shape, vertexType, i4, i2, i5, iteration-1); // B
            this._div(shape, vertexType, i5, i6, i4, iteration-1); // C
            this._div(shape, vertexType, i6, i5, i3, iteration-1); // D
        }
    };

    /**
     * Creates a toroid.
     * @param  {WebGLRenderingContext} gl  The graphics object.
     * @param  {Number} vertexType  The type of vertices the toroid should have.
     * @returns  {Shape}  The created toroid.
     */
    SphereBuilder.prototype.build = function(gl, vertexType) {
        var shape = new ShapeBuilder();

        // cCeate 12 vertices of a icosahedron.
        var t = Math.sqrt(5)/2 + 0.5;
        this._posIndex(shape, vertexType, -1,  t,  0);
        this._posIndex(shape, vertexType,  1,  t,  0);
        this._posIndex(shape, vertexType, -1, -t,  0);
        this._posIndex(shape, vertexType,  1, -t,  0);

        this._posIndex(shape, vertexType,  0, -1,  t);
        this._posIndex(shape, vertexType,  0,  1,  t);
        this._posIndex(shape, vertexType,  0, -1, -t);
        this._posIndex(shape, vertexType,  0,  1, -t);

        this._posIndex(shape, vertexType,  t,  0, -1);
        this._posIndex(shape, vertexType,  t,  0,  1);
        this._posIndex(shape, vertexType, -t,  0, -1);
        this._posIndex(shape, vertexType, -t,  0,  1);

        this._div(shape, vertexType,  0, 11,  5, this.iterations);
        this._div(shape, vertexType,  0,  5,  1, this.iterations);
        this._div(shape, vertexType,  0,  1,  7, this.iterations);
        this._div(shape, vertexType,  0,  7, 10, this.iterations);
        this._div(shape, vertexType,  0, 10, 11, this.iterations);

        this._div(shape, vertexType,  1,  5,  9, this.iterations);
        this._div(shape, vertexType,  5, 11,  4, this.iterations);
        this._div(shape, vertexType, 11, 10,  2, this.iterations);
        this._div(shape, vertexType, 10,  7,  6, this.iterations);
        this._div(shape, vertexType,  7,  1,  8, this.iterations);

        this._div(shape, vertexType,  3,  9,  4, this.iterations);
        this._div(shape, vertexType,  3,  4,  2, this.iterations);
        this._div(shape, vertexType,  3,  2,  6, this.iterations);
        this._div(shape, vertexType,  3,  6,  8, this.iterations);
        this._div(shape, vertexType,  3,  8,  9, this.iterations);
   
        this._div(shape, vertexType,  4,  9,  5, this.iterations);
        this._div(shape, vertexType,  2,  4, 11, this.iterations);
        this._div(shape, vertexType,  6,  2, 10, this.iterations);
        this._div(shape, vertexType,  8,  6,  7, this.iterations);
        this._div(shape, vertexType,  9,  8,  1, this.iterations);

        return shape.build(gl, vertexType);
    };

    return SphereBuilder;
});
