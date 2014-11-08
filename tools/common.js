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
            epsilon = epsilon || 0.000001;
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
            if (type&Const.WGHT) {
                size += 1;
            }
            if (type&Const.ADJ1) {
                size += 3;
            }
            if (type&Const.ADJ2) {
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
            if (type&Const.WGHT) {
                names.push('WGHT');
            }
            if (type&Const.ADJ1) {
                names.push('ADJ1');
            }
            if (type&Const.ADJ2) {
                names.push('ADJ2');
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
            maxSize = Math.pow(2, Math.floor(Math.log(maxSize)/Math.log(2)));
            size = Math.max(image.width, image.height);
            size = Math.pow(2, Math.floor(Math.log(size)/Math.log(2)));
            size = Math.min(size, maxSize);
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
        },
        
        /**
         * This checks if the given object is an array.
         * @param  {Object} obj  The object to check.
         * @return  True if the object is an array, false otherwise.
         */
        isArray: function(obj) {
            return Object.prototype.toString.call( obj ) === '[object Array]';
        },
        
        /**
         * This linear interpolates between two values.
         * @param  {Number} a  The lowest value.
         * @param  {Number} b  The highest value. 
         * @param  {Number} i  The interpolation value between 0 (low) and 1 (high).
         * @return  {Number}  The linear interpolated value.
         */
        lerp: function(a, b, i) {
            if (i <= 0.0) {
                return a;
            } else if (i >= 1.0) {
                return b;
            } else {
                return (b-a)*i + a;
            }
        },
        
        /**
         * Thi linear interpolates between a set of values.
         * @param  {Array} a  The set of incrementing offset values.
         * @param  {Array} b  The set of values to interpolate between.
         * @param  {Number} i  The interpolation value of the offsets.
         * @return  {Number}  The linear interpolated value.
         */
        multiLerp: function(a, b, i) {
            var a0 = a[0];
            var b0 = b[0];
            if (i <= a0) {
                return b0;
            }
            for (var j = 0; j < a.length; j++) {
                var a1 = a[j];
                var b1 = b[j];
                if (i <= a1) {
                    var k = (i-a0)/(a1-a0);
                    return this.lerp(b0, b1, k);
                }
                a0 = a1;
                b0 = b1;
            }
            return b0;
        }

    };

    return Common;
});
