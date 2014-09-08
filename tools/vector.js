define(function() {

    /**
     * Tools for creating and manipulating 1x3 vectors.
     */
    var Vector = {

        /**
         * TODO:: Comment
         */
        create: function(x, y, z) {
            return [ x, y, z ];
        },
        
        /**
         * TODO:: Comment
         */
        sub: function(vecA, vecB) {
            return [ vecA[0] - vecB[0], vecA[1] - vecB[1], vecA[2] - vecB[2] ];
        },
        
        /**
         * TODO:: Comment
         */
        add: function(vecA, vecB) {
            return [ vecA[0] + vecB[0], vecA[1] + vecB[1], vecA[2] + vecB[2] ];
        },
        
        /**
         * TODO:: Comment
         */
        neg: function(vec) {
            return [ -vec[0], -vec[1], -vec[2] ];
        },
        
        /**
         * TODO:: Comment
         */
        scale: function(vec, scalar) {
            return [ vec[0]*scalar, vec[1]*scalar, vec[2]*scalar ];
        },
        
        /**
         * TODO:: Comment
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
         * TODO:: Comment
         */
        cross: function(vecA, vecB) {
            return [ vecA[1]*vecB[2] - vecA[2]*vecB[1],
                     vecA[2]*vecB[0] - vecA[0]*vecB[2],
                     vecA[0]*vecB[1] - vecA[1]*vecB[0] ];
        },
        
        /**
         * TODO:: Comment
         */
        dot: function(vecA, vecB) {
            return vecA[0]*vecB[0] + vecA[1]*vecB[1] + vecA[2]*vecB[2];
        }
    };

    return Vector;
});
