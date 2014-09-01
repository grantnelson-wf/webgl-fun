define(function(require) {

    /**
     * Creates the graphical interface.
     * @param  {Object} gl  The graphical object.
     */
    function Graphics(gl) {        
        /// The graphical object.
        this.gl = gl;

        /// The program that is currently set.
        this.program = null;

        // Initialize the graphics.
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LESS);
    }

    /**
     * [useShader description]
     * @param  {[type]} shader [description]
     * @return {[type]}        [description]
     */
    Graphics.prototype.useShader = function(shader) {
        this.gl.useProgram(shader.program);
    };
    
    /**
     * Clears the color and depth buffers.
     */
    Graphics.prototype.clearBuffers = function() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);
    };
 
    return Graphics;
});
