define(function(require) {

    /**
     * The set of constant values.
     */
    var Const = {

        /**
         * Indicates that no shape vertex is selected.
         * @type {[type]}
         */
        NONE: 0x000,

        /**
         * Indicates that a shape vertex contains a 3D position.
         * @type {Number}
         */
        POS: 0x0001,

        /**
         * Indicates that a shape vertex contains RGB color.
         * @type {Number}
         */
        CLR3: 0x0002,

        /**
         * Indicates that a shape vertex contains RGBA color.
         * @type {Number}
         */
        CLR4: 0x0004,

        /**
         * Indicates that a shape vertex contains a normal.
         * @type {Number}
         */
        NORM: 0x0008,

        /**
         * Indicates that a shape vertex contains a 2D texture coordinate.
         * @type {Number}
         */
        TXT: 0x0010,

        /**
         * Indicates that a shape vertex contains a Cube texture coordinate.
         * @type {Number}
         */
        CUBE: 0x0020
    };

    return Const;
});
