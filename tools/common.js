define(function(require) {

    var Const = require('tools/const');

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
            return Math.abs(a - b) <= epsilon;
        },

        /**
         * The size of the type in number of floats.
         * @param  {Number} type  The type to get the size of.
         * @return  {Number}  The number of floats.
         */
        typeSize: function(type) {
            var size = 0;
            if (type&Const.POS ) {
                size += 3;
            }
            if (type&Const.CLR3) {
                size += 3;
            }
            if (type&Const.CLR4) {
                size += 4;
            }
            if (type&Const.NORM) {
                size += 3;
            }
            if (type&Const.TXT ) {
                size += 2;
            }
            if (type&Const.CUBE) {
                size += 3;
            }
            if (type&Const.BINM) {
                size += 3;
            }
            return size;
        },

        /**
         * The string for the type.
         * @param  {Number} type  The type to get the name for.
         * @return  {String}  The string for the type.
         */
        typeString: function(type) {
            var names = [];
            if (type&Const.POS ) {
                names.push('POS');
            }
            if (type&Const.CLR3) {
                names.push('CLR3');
            }
            if (type&Const.CLR4) {
                names.push('CLR4');
            }
            if (type&Const.NORM) {
                names.push('NORM');
            }
            if (type&Const.TXT ) {
                names.push('TXT');
            }
            if (type&Const.CUBE) {
                names.push('CUBE');
            }
            if (type&Const.BINM) {
                names.push('BINM');
            }
            return names.join('|');
        },

        /**
         * This resizes the given image.
         * @param  {Image} image      The image to resize.
         * @param  {Number} maxSize   The maximum width and height that an image can be.
         * @return  {Image}  The resized image.
         */
        resizeImage: function(image, maxSize) {
            maxSize = Math.pow(2, Math.floor(Math.log2(maxSize)))
            size = Math.max(image.width, image.height)
            size = Math.pow(2, Math.floor(Math.log2(size)))
            size = Math.min(size, maxSize)
            if ((image.width === size) || (image.height === size)) {
                return image;
            } else {
                var canvas = document.createElement('canvas');
                
                // TODO:: Properly set sizes proportional and power of 2.
                canvas.width = size;
                canvas.height = size;

                var ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                return ctx.getImageData(0, 0, canvas.width, canvas.height);
            }
        }

    };

    return Common;
});
