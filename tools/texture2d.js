define(function(require) {

    var Common = require('tools/common');

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
     * Creates a frame buffer to render with.
     * @param  {Number} width  The width in pixel of the frame buffer.
     * @param  {Number} height  The height in pixel of the frame buffer.
     */
    Texture2D.prototype.createFramebuffer = function(width, height) {
        var self = this;
        var gl = self.gl;
        var maxSize  = gl.getParameter(gl.MAX_TEXTURE_SIZE);
        if (width > maxSize) {
            width = maxSize;
        }
        if (height > maxSize) {
            height = maxSize;
        }

        // Setup color buffer
        self.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, self.framebuffer);
        self.framebuffer.width = width;
        self.framebuffer.height = height;


        self.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, self.texture);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, self.framebuffer.width, self.framebuffer.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

        // Setup depth buffer.
        self.depthBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, self.depthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, self.framebuffer.width, self.framebuffer.height);

        // Bind render buffers to render target frame buffer.
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, self.texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, self.depthBuffer);

        // Release bindings.
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.bindRenderbuffer(gl.RENDERBUFFER, null);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    /**
     * Loads a file from the given path.
     * @note  The image will load asynchronously.
     * @param  {String} path  The path to the image to load.
     * @param  {Boolean} flipY  Indicates if the Y asix should be flipped.
     * @param  {Boolean} wrapEdges  Indicates if the edges should wrap or not.
     */
    Texture2D.prototype.loadFromFile = function(path, flipY, wrapEdges) {
        var self = this;
        var gl = self.gl;

        self.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, self.texture);
        if (wrapEdges) {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        } else {
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        }
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.bindTexture(gl.TEXTURE_2D, null);

        var image = new Image();
        image.onload = function() {
            var maxSize  = gl.getParameter(gl.MAX_TEXTURE_SIZE);
            image = Common.resizeImage(image, maxSize);

            gl.bindTexture(gl.TEXTURE_2D, self.texture);
            gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, flipY);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
            gl.bindTexture(gl.TEXTURE_2D, null);
        };
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
