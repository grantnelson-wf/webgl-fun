define(function(require) {

    /**
     * Creates the graphical interface.
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
     * Compiles a shader program.
     * @param  {String} vsSource  The vertex shader source string.
     * @param  {String} fsSource  The fragment shader source string.
     * @return  {Object}  The compiled program or nil on error.
     */
    Graphics.prototype.compileProgram = function(vsSource, fsSource) {
        var vsShader = this.compileShader(vsSource, this.gl.VERTEX_SHADER);
        if (!vsShader) {
            console.log('VS shader failed.');
            return null;
        }
       
        var fsShader = this.compileShader(fsSource, this.gl.FRAGMENT_SHADER);
        if (!fsShader) {
            console.log('FS shader failed.');
            return null;
        }
       
        var program = this.gl.createProgram();
        this.gl.attachShader(program, vsShader);
        this.gl.attachShader(program, fsShader);
        this.gl.linkProgram(program);
        if (!this.gl.getProgramParameter(program, this.gl.LINK_STATUS)) {
           console.log("Could not link shaders.");
           return null;
        }
        return program;
    }
   
    /**
     * This compiles a shader.
     * @param  {String} source  The source string for the shader.
     * @param  {Number} shaderType  The type of shader to compile.
     * @returns  {Object}  The compiled shader.
     */
    Graphics.prototype.compileShader = function(source, shaderType) {
       var shader = this.gl.createShader(shaderType);
       this.gl.shaderSource(shader, source);
       this.gl.compileShader(shader);
       if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
          console.log(this.gl.getShaderInfoLog(shader));
          return null;
       }
       return shader;
    };
       
    /**
     * Sets the shader program.
     * @param  {String} vsSource  The vertex shader source string.
     * @param  {String} fsSource  The fragment shader source string.
     * @return  {Boolean}  True if the shader program was loaded, false otherwise.
     */
    Graphics.prototype.setProgram = function(program) {
        this.program = null;
        this.gl.useProgram(program);
        if (!program) {
           console.log("Failed to set program.");
           return false;
        }
        this.program = program;
        return true;
    }; 

    /**
     * Applies the given matrix to the attribute graphical object.
     * @param  {Object} attr  The matrix application.
     * @param  {Array} mat  The matrix to apply.
     */
    Graphics.prototype.setMatrix = function(attr, mat) {
        this.gl.uniformMatrix4fv(attr, false, new Float32Array(mat));
    }
    
    /**
     * Sets the given attribute with a single value.
     * @param  {Object} attr  The attribute handle to set.
     * @param  {Number} x  The uniform value to set.
     */
    Graphics.prototype.uniform1f = function(attr, x) {
        this.gl.uniform1fv(attr, new Float32Array([x]));
    };
    
    /**
     * Sets the given attribute with a three value array.
     * @param  {Object} attr  The attribute handle to set.
     * @param  {Number} x  The first uniform value to set.
     * @param  {Number} y  The second uniform value to set.
     * @param  {Number} z  The third uniform value to set.
     */
    Graphics.prototype.uniform3f = function(attr, x, y, z) {
        this.gl.uniform3fv(attr, new Float32Array([x, y, z]));
    };
    
    /**
     * Sets the given attribute with a four value array.
     * @param  {Object} attr  The attribute handle to set.
     * @param  {Number} x  The first uniform value to set.
     * @param  {Number} y  The second uniform value to set.
     * @param  {Number} z  The third uniform value to set.
     * @param  {Number} w  The forth uniform value to set.
     */
    Graphics.prototype.uniform4f = function(attr, x, y, z, w) {
        this.gl.uniform4fv(attr, new Float32Array([x, y, z, w]));
    };
    
    /**
     * Clears the color and depth buffers.
     */
    Graphics.prototype.clearBuffers = function() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);
    };
 
    return Graphics;
});
