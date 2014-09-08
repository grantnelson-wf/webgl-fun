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
            return names.join('|');
        },

        /**
         * TODO:: Comment
         * @param  {[type]} image     [description]
         * @param  {[type]} maxWidth  [description]
         * @param  {[type]} maxHeight [description]
         * @return {[type]}           [description]
         */
        resizeImage: function(image, maxSize) {
            // TODO:: Check that image sizes are power of 2.
            if ((image.width <= maxSize) || (image.height <= maxSize)) {
                return image;
            } else {
                var canvas = document.createElement('canvas');
                
                // TODO:: Properly set sizes proportional and power of 2.
                canvas.width = maxSize;
                canvas.height = maxSize;

                var ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
                return ctx.getImageData(0, 0, canvas.width, canvas.height);
            }
        }

    };

    return Common;
});
