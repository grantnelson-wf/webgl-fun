define(function() {

    /**
     * Tools for creating and manipulating (3x1) vectors.
     */
    var Vector = {

        /**
         * Creates a new vector.
         * @param  {Number} x  The x component of the vector.
         * @param  {Number} y  The y component of the vector.
         * @param  {Number} z  The z component of the vector.
         * @return  {Array}  The new vector.
         */
        create: function(x, y, z) {
            return [ x, y, z ];
        },
        
        /**
         * Subtracts one vector from another.
         * @param  {Array} vecA  The first vector to subtract from.
         * @param  {Array} vecB  The second vector to subtract.
         * @return  {Array}  The second vector subtracted from the first vector.
         */
        sub: function(vecA, vecB) {
            return [ vecA[0] - vecB[0], vecA[1] - vecB[1], vecA[2] - vecB[2] ];
        },
        
        /**
         * Sums one vector from another.
         * @param  {Array} vecA  The first vector to add to.
         * @param  {Array} vecB  The second vector to add.
         * @return  {Array}  The sum of the two vectors.
         */
        add: function(vecA, vecB) {
            return [ vecA[0] + vecB[0], vecA[1] + vecB[1], vecA[2] + vecB[2] ];
        },
        
        /**
         * Negates the given vector.
         * @param  {Array} vec  The vector to negate.
         * @return  {Array}  The negated vector.
         */
        neg: function(vec) {
            return [ -vec[0], -vec[1], -vec[2] ];
        },
        
        /**
         * Scales the given vector by the given multiplier.
         * @param  {Array} vec  The vector to scale.
         * @param  {Number} scalar  The scalar to multiply each entry by.
         * @return  {Array}  The scaled vector.
         */
        scale: function(vec, scalar) {
            return [ vec[0]*scalar, vec[1]*scalar, vec[2]*scalar ];
        },
        
        /**
         * Normalizes the given vector.
         * @param  {Array} vec  The vector to normalize.
         * @return  {Array}  The normalized array.
         */
        normal: function(vec) {
            var len = Math.sqrt(vec[0]*vec[0] + vec[1]*vec[1] + vec[2]*vec[2]);
            if (len === 0) {
                return [0, 0, 0];
            } else {
                return [ vec[0]/len, vec[1]/len, vec[2]/len ];
            }
        },
        
        /**
         * Calculates the cross product of the two given vectors.
         * @param  {Array} vecA  The first vector in the cross product.
         * @param  {Array} vecB  The second vector in the cross product.
         * @return  {Array}  The cross product.
         */
        cross: function(vecA, vecB) {
            return [ vecA[1]*vecB[2] - vecA[2]*vecB[1],
                     vecA[2]*vecB[0] - vecA[0]*vecB[2],
                     vecA[0]*vecB[1] - vecA[1]*vecB[0] ];
        },
        
        /**
         * Calculates the dot product of the two given vectors.
         * @param  {Array} vecA  The first vector in the dot product.
         * @param  {Array} vecB  The second vector in the dot product.
         * @return  {Number}  The dot product.
         */
        dot: function(vecA, vecB) {
            return vecA[0]*vecB[0] + vecA[1]*vecB[1] + vecA[2]*vecB[2];
        }
    };

    return Vector;
});
