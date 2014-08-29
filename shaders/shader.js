define(function(require) {

    /**
     * This is a compiled shader program.
     * @param  {Graphics} gfx         The graphical object.
     * @param  {Object} program       The program of this shader.
     * @param  {String} name          The name of the shader.
     * @param  {Number} requiredType  The required vertex type.
     */
    function Shader(gfx, program, name, requiredType) {
    
        /**
         * The graphical object.
         * @type {Graphics}
         */
        this.gfx = gfx;

        /**
         * The program of this shader.
         * @type {Object}
         */
        this.program = program;

        /**
         * The name of the shader.
         * @type {String}
         */
        this.name = name;

        /**
         * The required vertex type.
         * @type {Number}
         */
        this.requiredType = requiredType;

        /**
         * The array of vertex attribute names.
         * @type {Array}
         */
        this.attribs = [];

        /**
         * The array of uniform variable names.
         * @type {Array}
         */
        this.uniforms = [];
    } 
    
    /**
     * Sets this shader as the one to use.
     */
    Shader.prototype.use = function() {
        this.gfx.useShader(this);
    };

    /**
     * Creates the shader builder.
     * @param  {String} vsSource      The vertex shader source code to compile.
     * @param  {String} fsSource      The fragment shader source code to compile.
     * @param  {String} name          The name of the shader.
     * @param  {Number} requiredType  The required vertex type.
     */
    function ShaderBuilder(vsSource, fsSource, name, requiredType) {

        /**
         * The vertex shader source code to compile.
         * @type {String}
         */
        this.vsSource = vsSource;
        
        /**
         * The fragment shader source code to compile.
         * @type {String}
         */
        this.fsSource = fsSource;

        /**
         * The name of the shader.
         * @type {String}
         */
        this.name = name || "Unnamed";

        /**
         * The required vertex type.
         * @type {Number}
         */
        this.requiredType = requiredType;
    }
    
    /**
     * Builds the shader.
     * @param  {Graphics} gfx  The graphical object.
     * @return  {Shader}  The compiled shader.
     */
    ShaderBuilder.prototype.build = function(gfx) {
        var gl = gfx.gl;
        var program = this._compileProgram(gl, this.vsSource, this.fsSource);
        if (!program) {
            return false;
        }
        var shader = new Shader(gfx, program, this.name, this.requiredType);
        this._setupAttribs(gl, shader);
        this._setupUniform(gl, shader);
        return shader;
    };
    
    /**
     * Compiles a shader program.
     * @param  {Object} gl        The graphical object.
     * @param  {String} vsSource  The vertex shader source string.
     * @param  {String} fsSource  The fragment shader source string.
     * @return  {Object}  The compiled program or nil on error.
     */
    ShaderBuilder.prototype._compileProgram = function(gl, vsSource, fsSource) {
        var vsShader = this._compileShader(gl, vsSource, gl.VERTEX_SHADER);
        if (!vsShader) {
            console.log('VS shader failed.');
            return null;
        }
       
        var fsShader = this._compileShader(gl, fsSource, gl.FRAGMENT_SHADER);
        if (!fsShader) {
            console.log('FS shader failed.');
            return null;
        }
       
        var program = gl.createProgram();
        gl.attachShader(program, vsShader);
        gl.attachShader(program, fsShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
           console.log("Could not link shaders.");
           return null;
        }
        return program;
    };
   
    /**
     * This compiles a shader.
     * @param  {Object} gl          The graphical object.
     * @param  {String} source      The source string for the shader.
     * @param  {Number} shaderType  The type of shader to compile.
     * @returns  {Object}  The compiled shader.
     */
    ShaderBuilder.prototype._compileShader = function(gl, source, shaderType) {
       var shader = gl.createShader(shaderType);
       gl.shaderSource(shader, source);
       gl.compileShader(shader);
       if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          console.log(gl.getShaderInfoLog(shader));
          return null;
       }
       return shader;
    };
     
    /**
     * This sets up the attributes for a shader.
     * @param  {Object} gl      The graphical object.
     * @param  {Shader} shader  The shader to setup.
     */
    ShaderBuilder.prototype._setupAttribs = function(gl, shader) {
        var count = gl.getProgramParameter(shader.program, gl.ACTIVE_ATTRIBUTES);
        for (var i = 0; i < count; i++) {
            var info = gl.getActiveAttrib(shader.program, i);
            shader.attribs[i] = info.name;

            var attr = gl.getAttribLocation(shader.program, info.name);
            var capName = info.name.charAt(0).toUpperCase() + info.name.slice(1);

            shader[info.name+"Loc"] = attr;

            shader["enable"+capName] = function() {
                gl.enableVertexAttribArray(attr);
            };

            shader["disable"+capName] = function() {
                gl.disableVertexAttribArray(attr);
            };
        }
    }
    
    /**
     * This sets up the uniform values for a shader.
     * @param  {Object} gl      The graphical object.
     * @param  {Shader} shader  The shader to setup.
     */
    ShaderBuilder.prototype._setupUniform = function(gl, shader) {
        var count = gl.getProgramParameter(shader.program, gl.ACTIVE_UNIFORMS);
        for (var i = 0; i < count; i++) {
            var info = gl.getActiveUniform(shader.program, i);
            shader.uniforms[i] = info.name;

            var attr = gl.getUniformLocation(shader.program, info.name);
            var capName = info.name.charAt(0).toUpperCase() + info.name.slice(1);

            shader[info.name+"Loc"] = attr;

            shader["get"+capName] = function() {
                return gl.getUniform(shader.program, attr);
            };

            var func = this._getUniformSetter(gl, info.type, attr, info.name);
            if (func != null) {
                shader["set"+capName] = func;
            }
        }
    }

    /**
     * [_getUniformSetter description]
     * @param  {[type]} gl   [description]
     * @param  {[type]} type [description]
     * @param  {[type]} attr [description]
     * @param  {[type]} name [description]
     * @return {[type]}      [description]
     */
    ShaderBuilder.prototype._getUniformSetter = function(gl, type, attr, name) {
        switch(type) {
            case gl.BYTE:
                return function(i) {
                    gl.uniform1i(attr, i);
                };

            case gl.UNSIGNED_BYTE:
                return function(i) {
                    gl.uniform1i(attr, i);
                };

            case gl.SHORT:
                return function(i) {
                    gl.uniform1i(attr, i);
                };

            case gl.UNSIGNED_SHORT:
                return function(i) {
                    gl.uniform1i(attr, i);
                };

            case gl.INT:
                return function(i) {
                    gl.uniform1i(attr, i);
                };

            case gl.UNSIGNED_INT:
                return function(i) {
                    gl.uniform1i(attr, i);
                };

            case gl.FLOAT:
                return function(x) {
                    gl.uniform1f(attr, x);
                };

            case gl.FLOAT_VEC2:
                return function(x, y) {
                    gl.uniform2f(attr, x, y);
                };

            case gl.FLOAT_VEC3:
                return function(x, y, z) {
                    gl.uniform3f(attr, x, y, z);
                };

            case gl.FLOAT_VEC4:
                return function(x, y, z, w) {
                    gl.uniform4f(attr, x, y, z, w);
                };

            case gl.INT_VEC2:
                return function(i, j) {
                    gl.uniform4i(attr, i, j);
                };

            case gl.INT_VEC3:
                return function(i, j, k) {
                    gl.uniform4i(attr, i, j, k);
                };

            case gl.INT_VEC4:
                return function(i, j, k, l) {
                    gl.uniform4i(attr, i, j, k, l);
                };

            case gl.BOOL:
                throw "BOOL uniform variables are unsupported by all browsers.\n"+
                      "Please change the type of "+name+".";

            case gl.BOOL_VEC2:
                throw "BOOL_VEC2 uniform variables are unsupported by all browsers.\n"+
                      "Please change the type of "+name+".";

            case gl.BOOL_VEC3:
                throw "BOOL_VEC3 uniform variables are unsupported by all browsers.\n"+
                      "Please change the type of "+name+".";

            case gl.BOOL_VEC4:
                throw "BOOL_VEC4 uniform variables are unsupported by all browsers.\n"+
                      "Please change the type of "+name+".";

            case gl.FLOAT_MAT2:
                return function(mat2) {
                    gl.uniformMatrix2fv(attr, new Float32Array(mat2));
                };

            case gl.FLOAT_MAT3:
                return function(mat3) {
                    gl.uniformMatrix3fv(attr, false, new Float32Array(mat3));
                };

            case gl.FLOAT_MAT4:
                return function(mat4) {
                    gl.uniformMatrix4fv(attr, false, new Float32Array(mat4));
                };

            case gl.SAMPLER_2D:
                return function(index2D) {
                    gl.uniform1i(attr, index2D);
                };

            case gl.SAMPLER_CUBE:
                return function(indexCube) {
                    gl.uniform1i(attr, indexCube);
                };

            default:
                throw "Unknown uniform variable type "+type+" for "+name+".";
        }
    }
    
    return ShaderBuilder;
});
