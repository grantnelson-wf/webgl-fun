define(function(require) {

    /**
     * The set of common methods.
     */
    var Common = {

        /**
         * This checks is the two values are equal.
         * @param  {Number} a        The first value.
         * @param  {Number} b        The second value.
         * @param  {Number} epsilon  The epsilon comparer.
         * @return  {Boolean}  True if they are equal, false otherwise.
         */
        eq: function(a, b, epsilon) {
            return Math.abs(a - b) <= epsilon
        }

    };

    return Common;
});
