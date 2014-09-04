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
        this.texture = null;
    }
    
    /**
     * [load description]
     * @param  {[type]} path [description]
     */
    Texture2D.prototype.load = function(path) {
        var self = this;
        var image = new Image();
        image.onload = function() { 
            self.texture = self.gl.createTexture();
            self.gl.bindTexture(self.gl.TEXTURE_2D, self.texture);
            self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_MIN_FILTER, self.gl.NEAREST);
            self.gl.texImage2D(self.gl.TEXTURE_2D, 0, self.gl.RGBA, self.gl.RGBA, self.gl.UNSIGNED_BYTE, image);
            self.gl.bindTexture(self.gl.TEXTURE_2D, null);
        }
        image.src = path;
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
