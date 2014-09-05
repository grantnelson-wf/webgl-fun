define(function(require) {
    
    /**
     * Creates a texture 2D object.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     */
    function Texture2D(gl) {
        
        /**
         * The graphical object.
         * @type {WebGLRenderingContext}
         */
        this.gl = gl;
        
        /**
         * The index to between 0 and 31 for the texture.
         * @type {Number}
         */
        this.index = 0;
        
        /**
         * The texture object.
         * @type {Object}
         */
        this.texture = null;
    }
    
    /**
     * Loads a file from the given path.
     * @note  The image will load asynchronously.
     * @param  {String} path  The path to the image to load.
     * @param  {Boolean} flipY  Indicates if the Y asix should be flipped.
     */
    Texture2D.prototype.loadFromFile = function(path, flipY) {
        var self = this;
        var gl = self.gl;

        self.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, self.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); 
        gl.bindTexture(gl.TEXTURE_2D, null);      
        
        var image = new Image();
        image.onload = function() {
            gl.bindTexture(gl.TEXTURE_2D, self.texture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.bindTexture(gl.TEXTURE_2D, null);
        }
        image.src = path;
    };

    /**
     * Binds the texture to the 
     */
    Texture2D.prototype.bind = function() {
        if (this.texture !== null) {
            this.gl.activeTexture(this.gl.TEXTURE0+this.index);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        }
    };
    
    return Texture2D;
});
