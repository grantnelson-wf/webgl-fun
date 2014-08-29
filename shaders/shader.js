define(function(require) {

    /**
     * This is a compiled shader program.
     * @param  {Object} gl  The graphical object.
     * @param  {Object} gl  The program of this shader.
     */
    function Shader(gl, program) {
    
        /// The graphical object.
        this.gl = gl;

        /// The program of this shader.
        this.program = program;
    } 
    
    /**
     * Sets this shader as the one to use.
     */
    Shader.prototype.use = function() {
        this.gl.useProgram(this.program);
    }; 

    /**
     * Creates the shader builder.
     */
    function ShaderBuilder(vsSource, fsSource) {
        this.vsSource = vsSource;
        this.fsSource = fsSource;
    }
    
    /**
     * Builds the shader.
     * @param  {Object} gl  The graphical object.
     * @return  {Shader}  The compiled shader.
     */
    ShaderBuilder.prototype.build = function(gl) {
        var program = this._compileProgram(this.vsShader, this.fsShader);
        if (!program) {
            return false;
        }
        var shader = new Shader(gl, program);
        if (!this._setupAttribs(shader)) {
            return false;
        }
        if (!this._setupUniform(shader)) {
            return false;
        }
        return true;
    };
    
    /**
     * Compiles a shader program.
     * @param  {String} vsSource  The vertex shader source string.
     * @param  {String} fsSource  The fragment shader source string.
     * @return  {Object}  The compiled program or nil on error.
     */
    ShaderBuilder.prototype._compileProgram = function(vsSource, fsSource) {
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
    };
   
    /**
     * This compiles a shader.
     * @param  {String} source  The source string for the shader.
     * @param  {Number} shaderType  The type of shader to compile.
     * @returns  {Object}  The compiled shader.
     */
    ShaderBuilder.prototype._compileShader = function(source, shaderType) {
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
     * This compiles a shader.
     */
    ShaderBuilder.prototype._setupAttribs = function(shader) {
    
    
    
        //glGetObjectParameterivA (shaderID, GL_OBJECT_ACTIVE_ATTRIBUTES, &count);
        //glGetActiveAttrib (shaderID, i, bufSize, &length, &size, &type, name);
    
    }
    
    /**
     * This compiles a shader.
     */
    ShaderBuilder.prototype._setupUniform = function(shader) {
    
    
        //glGetObjectParameteriv (shaderID, GL_OBJECT_ACTIVE_UNIFORMS, &count);
        //glGetActiveUniform (shaderID, i, bufSize, &length, &size, &type, name);
    
    
    }
    
    
    /*
    ShaderBuilder.prototype.setMatrix = function(attr, mat) {
        this.gl.uniformMatrix4fv(attr, false, new Float32Array(mat));
    }
    
    ShaderBuilder.prototype.uniform1f = function(attr, x) {
        this.gl.uniform1fv(attr, new Float32Array([x]));
    };
    
    ShaderBuilder.prototype.uniform3f = function(attr, x, y, z) {
        this.gl.uniform3fv(attr, new Float32Array([x, y, z]));
    };
    
    ShaderBuilder.prototype.uniform4f = function(attr, x, y, z, w) {
        this.gl.uniform4fv(attr, new Float32Array([x, y, z, w]));
    };
    */
    
    return ShapeBuilder;
});
