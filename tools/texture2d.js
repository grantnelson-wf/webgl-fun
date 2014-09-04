define(function(require) {
    
    /**
     * Creates a texture 2D object.
     * @param  {[type]} gl   [description]
     */
    function Texture2D(gl) {
        
        /**
         * [gl description]
         * @type {[type]}
         */
        this.gl = gl;
        
        /**
         * [texture description]
         * @type {[type]}
         */
        this.image = null;
        
        /**
         * [texture description]
         * @type {[type]}
         */
        this.texture = null;
    }
    
    /**
     * [load description]
     * @param  {[type]} path [description]
     */
    Texture2D.prototype.load = function(path) {
        this.texture = null;
        this.image = new Image();
        this.image.onload = this._onLoad();
        this.image.src = path;
    };

    /**
     * [_onLoad description]
     */
    Texture2D.prototype._onLoad = function() {
        this.texture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        this.gl.texImage2D(this.gl.TEXTURE_2D, 0, this.gl.RGBA, this.gl.RGBA, this.gl.UNSIGNED_BYTE, this.image);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.bindTexture(this.gl.TEXTURE_2D, null);
    };

    /**
     * [bind description]
     */
    Texture2D.prototype.bind = function() {
        if (this.texture !== null) {
            this.gl.activeTexture(this.gl.TEXTURE0);
            this.gl.bindTexture(this.gl.TEXTURE_2D, this.texture);
        }
    };
    
    return Texture2D;
});
