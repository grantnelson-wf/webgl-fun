define(function(require) {

    var Vector = require("tools/vector");

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
        *multiplies the two given matrices.
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
         * TODO:: Comment
         * @param  {[type]} m      [description]
         * @param  {[type]} scalar [description]
         * @return {[type]}        [description]
         */
        scale: function(m, scalar) {
            return [  m[ 0]*scalar, m[ 1]*scalar, m[ 2]*scalar, m[ 3]*scalar,
                      m[ 4]*scalar, m[ 5]*scalar, m[ 6]*scalar, m[ 7]*scalar,
                      m[ 8]*scalar, m[ 9]*scalar, m[10]*scalar, m[11]*scalar,
                      m[12]*scalar, m[13]*scalar, m[14]*scalar, m[15]*scalar ];
        },

        /**
         * TODO:: Comment
         * @param  {[type]} m      [description]
         * @return {[type]}        [description]
         */
        transpose: function(m, scalar) {
            return [  m[ 0], m[ 4], m[ 8], m[12],
                      m[ 1], m[ 5], m[ 9], m[13],
                      m[ 2], m[ 6], m[10], m[14],
                      m[ 3], m[ 7], m[11], m[15] ];
        },

        /**
         * TODO:: Comment
         * @param  {[type]} m [description]
         * @return {[type]}   [description]
         */
        inverse: function(m) {
            inv = [
                m[ 5]*m[10]*m[15] - m[ 5]*m[11]*m[14] - m[ 6]*m[ 9]*m[15] + m[ 6]*m[11]*m[13] + m[ 7]*m[ 9]*m[14] - m[ 7]*m[10]*m[13],
               -m[ 1]*m[10]*m[15] + m[ 1]*m[11]*m[14] + m[ 2]*m[ 9]*m[15] - m[ 2]*m[11]*m[13] - m[ 3]*m[ 9]*m[14] + m[ 3]*m[10]*m[13],
                m[ 1]*m[ 6]*m[15] - m[ 1]*m[ 7]*m[14] - m[ 2]*m[ 5]*m[15] + m[ 2]*m[ 7]*m[13] + m[ 3]*m[ 5]*m[14] - m[ 3]*m[ 6]*m[13],
               -m[ 1]*m[ 6]*m[11] + m[ 1]*m[ 7]*m[10] + m[ 2]*m[ 5]*m[11] - m[ 2]*m[ 7]*m[ 9] - m[ 3]*m[ 5]*m[10] + m[ 3]*m[ 6]*m[ 9],
               -m[ 4]*m[10]*m[15] + m[ 4]*m[11]*m[14] + m[ 6]*m[ 8]*m[15] - m[ 6]*m[11]*m[12] - m[ 7]*m[ 8]*m[14] + m[ 7]*m[10]*m[12],
                m[ 0]*m[10]*m[15] - m[ 0]*m[11]*m[14] - m[ 2]*m[ 8]*m[15] + m[ 2]*m[11]*m[12] + m[ 3]*m[ 8]*m[14] - m[ 3]*m[10]*m[12],
               -m[ 0]*m[ 6]*m[15] + m[ 0]*m[ 7]*m[14] + m[ 2]*m[ 4]*m[15] - m[ 2]*m[ 7]*m[12] - m[ 3]*m[ 4]*m[14] + m[ 3]*m[ 6]*m[12],
                m[ 0]*m[ 6]*m[11] - m[ 0]*m[ 7]*m[10] - m[ 2]*m[ 4]*m[11] + m[ 3]*m[ 4]*m[10] + m[ 2]*m[ 7]*m[ 8] - m[ 3]*m[ 6]*m[ 8],

                // TODO:: Continue to simplify.

                m[ 4]*m[ 9]*m[15] - m[ 4]*m[11]*m[13] - m[ 8]*m[ 5]*m[15] + m[ 8]*m[ 7]*m[13] + m[12]*m[ 5]*m[11] - m[12]*m[ 7]*m[ 9],
               -m[ 0]*m[ 9]*m[15] + m[ 0]*m[11]*m[13] + m[ 8]*m[ 1]*m[15] - m[ 8]*m[ 3]*m[13] - m[12]*m[ 1]*m[11] + m[12]*m[ 3]*m[ 9],
                m[ 0]*m[ 5]*m[15] - m[ 0]*m[ 7]*m[13] - m[ 4]*m[ 1]*m[15] + m[ 4]*m[ 3]*m[13] + m[12]*m[ 1]*m[ 7] - m[12]*m[ 3]*m[ 5],
               -m[ 0]*m[ 5]*m[11] + m[ 0]*m[ 7]*m[ 9] + m[ 4]*m[ 1]*m[11] - m[ 4]*m[ 3]*m[ 9] - m[ 8]*m[ 1]*m[ 7] + m[ 8]*m[ 3]*m[ 5],
               -m[ 4]*m[ 9]*m[14] + m[ 4]*m[10]*m[13] + m[ 8]*m[ 5]*m[14] - m[ 8]*m[ 6]*m[13] - m[12]*m[ 5]*m[10] + m[12]*m[ 6]*m[ 9],
                m[ 0]*m[ 9]*m[14] - m[ 0]*m[10]*m[13] - m[ 8]*m[ 1]*m[14] + m[ 8]*m[ 2]*m[13] + m[12]*m[ 1]*m[10] - m[12]*m[ 2]*m[ 9],
               -m[ 0]*m[ 5]*m[14] + m[ 0]*m[ 6]*m[13] + m[ 4]*m[ 1]*m[14] - m[ 4]*m[ 2]*m[13] - m[12]*m[ 1]*m[ 6] + m[12]*m[ 2]*m[ 5],
                m[ 0]*m[ 5]*m[10] - m[ 0]*m[ 6]*m[ 9] - m[ 4]*m[ 1]*m[10] + m[ 4]*m[ 2]*m[ 9] + m[ 8]*m[ 1]*m[ 6] - m[ 8]*m[ 2]*m[ 5]
            ];

            det = m[0]*inv[0] + m[1]*inv[4] + m[2]*inv[8] + m[3]*inv[12];
            if (det === 0) {
                return Matrix.identity();
            }
            return Matrix.scale(inv, 1/det);
        },

        /**
         * Creates a rotation matrix with the given Euler angles.
         * @note  The order of rotation is yaw, pitch, then roll.
         * @param  {Number} yaw   The yaw Euler angle in radians.
         * @param  {Number} pitch The pitch Euler angle in radians.
         * @param  {Number} roll  The roll Euler angle in radians.
         * @return  {Array}  The rotation matrix.
         */
        euler: function(yaw, pitch, roll) {
            return this.mul(
                    this.mul(
                        this.rotateX(yaw),
                        this.rotateY(pitch)),
                    this.rotateZ(roll));
        },

        /**
         * Creates an orthographic projection matrix.
         * @param  {Number} left    The left side of the projection.
         * @param  {Number} right   The right side of the projection.
         * @param  {Number} bottom  The bottom side of the projection.
         * @param  {Number} top     The top side of the projection.
         * @param  {Number} near    The near side of the projection.
         * @param  {Number} far     The far side of the projection.
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
         * TODO:: Comment
         */
        lookat: function(targetX, targetY, targetZ, upX, upY, upZ, posX, posY, posZ) {
            var target = Vector.create(targetX, targetY, targetZ);
            var up = Vector.create(upX, upY, upZ);
            var pos = Vector.create(posX, posY, posZ);
            var zaxis = Vector.normal(Vector.sub(target, pos));
            var xaxis = Vector.normal(Vector.cross(up, zaxis));
            var yaxis = Vector.cross(zaxis, xaxis);
            var tx = -Vector.dot(xaxis, pos);
            var ty = -Vector.dot(yaxis, pos);
            var tz = -Vector.dot(zaxis, pos);
            return [ xaxis[0], yaxis[0], zaxis[0], 0,
                     xaxis[1], yaxis[1], zaxis[1], 0,
                     xaxis[2], yaxis[2], zaxis[2], 0,
                     tx,       ty,       tz,       1 ];
        },

        /**
         * Creates an perspective projection matrix.
         * @param  {Number} fov     The angle in radians for the vertical field of view.
         * @param  {Number} aspect  The aspect ratio of horizontal over vertical.
         * @param  {Number} near    The near side of the frustum.
         * @param  {Number} far     The far side of the frustum.
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
         * @param  {Array} mat        The matrix to convert to a string.
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
