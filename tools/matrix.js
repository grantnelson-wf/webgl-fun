define(function() {

    /**
     * Tools for creating and manipulating 4x4 matrices.
     */
    var Matrix = {

        /**
         * Creates an identity matrix.
         * @returns  {Array}  The created matrix.
         */
        identity: function() {
            return [ 1, 0, 0, 0,
                     0, 1, 0, 0,
                     0, 0, 1, 0,
                     0, 0, 0, 1 ];
        },

        /**
         * Creates a rotation matrix for a X rotation.
         * @param  {Number} angle  The angle in radians to rotate.
         * @returns  {Array}  The created matrix.
         */
        rotateX: function(angle) {
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            return [  1,  0,  0,  0,
                      0,  c, -s,  0,
                      0,  s,  c,  0,
                      0,  0,  0,  1 ];
        },

        /**
         * Creates a rotation matrix for a Y rotation.
         * @param  {Number} angle  The angle in radians to rotate.
         * @returns  {Array}  The created matrix.
         */
        rotateY: function(angle) {
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            return [  c,  0,  s,  0,
                      0,  1,  0,  0,
                     -s,  0,  c,  0,
                      0,  0,  0,  1 ];
        },

        /**
         * Creates a rotation matrix for a Z rotation.
         * @param  {Number} angle  The angle in radians to rotate.
         * @returns  {Array}  The created matrix.
         */
        rotateZ: function(angle) {
            var c = Math.cos(angle);
            var s = Math.sin(angle);
            return [  c, -s,  0,  0,
                      s,  c,  0,  0,
                      0,  0,  1,  0,
                      0,  0,  0,  1 ];
        },

        /**
         * Multiplies the two given matrices.
         * @param  {Array} a  The left matrix in the multiplication.
         * @param  {Array} b  The right matrix in the multiplication.
         * @returns  {Array}  The created matrix.
         */
        mul: function(a, b) {
            // C[x,y] = Sum(A[x,i]*B[y,i]; i=0..3);
            return [ a[ 0]*b[ 0] + a[ 1]*b[ 4] + a[ 2]*b[ 8] + a[ 3]*b[12],
                     a[ 0]*b[ 1] + a[ 1]*b[ 5] + a[ 2]*b[ 9] + a[ 3]*b[13],
                     a[ 0]*b[ 2] + a[ 1]*b[ 6] + a[ 2]*b[10] + a[ 3]*b[14],
                     a[ 0]*b[ 3] + a[ 1]*b[ 7] + a[ 2]*b[11] + a[ 3]*b[15],
                     a[ 4]*b[ 0] + a[ 5]*b[ 4] + a[ 6]*b[ 8] + a[ 7]*b[12],
                     a[ 4]*b[ 1] + a[ 5]*b[ 5] + a[ 6]*b[ 9] + a[ 7]*b[13],
                     a[ 4]*b[ 2] + a[ 5]*b[ 6] + a[ 6]*b[10] + a[ 7]*b[14],
                     a[ 4]*b[ 3] + a[ 5]*b[ 7] + a[ 6]*b[11] + a[ 7]*b[15],
                     a[ 8]*b[ 0] + a[ 9]*b[ 4] + a[10]*b[ 8] + a[11]*b[12],
                     a[ 8]*b[ 1] + a[ 9]*b[ 5] + a[10]*b[ 9] + a[11]*b[13],
                     a[ 8]*b[ 2] + a[ 9]*b[ 6] + a[10]*b[10] + a[11]*b[14],
                     a[ 8]*b[ 3] + a[ 9]*b[ 7] + a[10]*b[11] + a[11]*b[15],
                     a[12]*b[ 0] + a[13]*b[ 4] + a[14]*b[ 8] + a[15]*b[12],
                     a[12]*b[ 1] + a[13]*b[ 5] + a[14]*b[ 9] + a[15]*b[13],
                     a[12]*b[ 2] + a[13]*b[ 6] + a[14]*b[10] + a[15]*b[14],
                     a[12]*b[ 3] + a[13]*b[ 7] + a[14]*b[11] + a[15]*b[15] ];
        },

        /**
         * Creates a translation matrix.
         * @param  {Number} x  The x offset component.
         * @param  {Number} y  The y offset component.
         * @param  {Number} z  The z offset component.
         * @return  {Array}  The created matrix.
         */
        translate: function(x, y, z) {
            return [  1,  0,  0,  0,
                      0,  1,  0,  0,
                      0,  0,  1,  0,
                      x,  y,  z,  1 ];
        },

        /**
         * Creates an orthographic projection matrix.
         * @param  {Number} left  The left side of the projection.
         * @param  {Number} right  The right side of the projection.
         * @param  {Number} bottom  The bottom side of the projection.
         * @param  {Number} top  The top side of the projection.
         * @param  {Number} near  The near side of the projection.
         * @param  {Number} far  The far side of the projection.
         * @return  {Array}  The created matrix.
         */
        orthographic: function(left, right, bottom, top, near, far) {
            var xx = 2.0/(right-left);
            var yy = 2.0/(top-bottom);
            var zz = 2.0/(far-near);
            var wx = -(left+right)/(right-left);
            var wy = -(top+bottom)/(top-bottom);
            var wz = (far+near)/(far-near);
            return [ xx,  0,  0, wx,
                      0, yy,  0, wy,
                      0,  0, zz, wz,
                      0,  0,  0,  1 ];
        },

        /**
         * Creates an perspective projection matrix.
         * @param  {Number} fov  The angle in radians for the vertical field of view.
         * @param  {Number} aspect  The aspect ratio of horizontal over vertical.
         * @param  {Number} near  The near side of the frustum.
         * @param  {Number} far  The far side of the frustum.
         * @returns  {Array}  The created matrix.
         */
        perspective: function(fov, aspect, near, far) {
            var yy = 1.0/Math.tan(fov*0.5);
            var xx = yy/aspect;
            var zz = far/(far-near);
            var zw = -far*near/(far-near);
            return [ xx,  0,  0,  0,
                      0, yy,  0,  0,
                      0,  0, zz,  1,
                      0,  0, zw,  0 ];
        },

        /**
         * Converts the given matrix into a string.
         * @param  {Array} mat  The matrix to convert to a string.
         * @param  {String} [indent]  Optional indent to apply to new lines.
         * @returns  {String}  The string for the matrix.
         */
        toString: function(mat, indent) {
            indent = indent || "";
            return     "["+mat[ 0]+", "+mat[ 1]+", "+mat[ 2]+", "+mat[ 3]+",\n"+
                indent+" "+mat[ 4]+", "+mat[ 5]+", "+mat[ 6]+", "+mat[ 7]+",\n"+
                indent+" "+mat[ 8]+", "+mat[ 9]+", "+mat[10]+", "+mat[11]+",\n"+
                indent+" "+mat[12]+", "+mat[13]+", "+mat[14]+", "+mat[15]+"]";
        }

    };

    return Matrix;
});
