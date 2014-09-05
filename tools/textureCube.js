define(function(require) {
    
    /**
     * Creates a texture cube object.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     */
    function TextureCube(gl) {
        
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
     * @note  The images will load asynchronously.
     * @param  {String} posXPath  The path to the image to load for the positive X face.
     * @param  {String} posYPath  The path to the image to load for the positive Y face.
     * @param  {String} posZPath  The path to the image to load for the positive Z face.
     * @param  {String} negXPath  The path to the image to load for the negative X face.
     * @param  {String} negYPath  The path to the image to load for the negative Y face.
     * @param  {String} negZPath  The path to the image to load for the negative Z face.
     * @param  {Boolean} flipY  Indicates if the Y asix should be flipped.
     */
    TextureCube.prototype.loadFromFiles = function(
        posXPath, posYPath, posZPath, negXPath, negYPath, negZPath, flipY) {
        var gl = this.gl;
        
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, this.texture);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        
        this._loadFace(posXPath, gl.TEXTURE_CUBE_MAP_POSITIVE_X, flipY);
        this._loadFace(negXPath, gl.TEXTURE_CUBE_MAP_NEGATIVE_X, flipY);
        this._loadFace(posYPath, gl.TEXTURE_CUBE_MAP_POSITIVE_Y, flipY);
        this._loadFace(negYPath, gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, flipY);
        this._loadFace(posZPath, gl.TEXTURE_CUBE_MAP_POSITIVE_Z, flipY);
        this._loadFace(negZPath, gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, flipY);
    };
    
    /**
     * Loads a face from the given path.
     * @note  The image will load asynchronously.
     * @param  {String} path  The path to the image to load.
     * @param  {Number} face  The value for the face to load.
     * @param  {Boolean} flipY  Indicates if the Y asix should be flipped.
     */
    TextureCube.prototype._loadFace = function(path, face, flipY) {
        var self = this;
        var gl = self.gl;
        var image = new Image();
        image.onload = function() {
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, self.texture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
            gl.texImage2D(face, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        }
        image.src = path;
    }
    
    /**
     * Binds the texture to the 
     */
    TextureCube.prototype.bind = function() {
        if (this.texture !== null) {
            this.gl.activeTexture(this.gl.TEXTURE0+this.index);
            this.gl.bindTexture(this.gl.TEXTURE_CUBE_MAP, this.texture);
        }
    };
    
    return TextureCube;
});
