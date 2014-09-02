define(function(require) {

    /**
     * The set of constant values.
     */
    var Const = {

        /**
         * Indicates that a shape vertex contains a 3D position.
         * @type {Number}
         */
        POS: 1,

        /**
         * Indicates that a shape vertex contains color.
         * @type {Number}
         */
        CLR: 2,

        /**
         * Indicates that a shape vertex contains a normal.
         * @type {Number}
         */
        NORM: 4,

        /**
         * Indicates that a shape vertex contains a texture coordinate.
         * @type {Number}
         */
        TXT: 8

    };

    return Const;
});
