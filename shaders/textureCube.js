define(function(require) {

    var Const = require('tools/const');
    var ShaderBuilder = require('shaders/shader');
    
    /**
     * Creates a texture cube shader.
     */
    function TextureBuilder() {
        // Do Nothing
    }

    /**
     * The name for this shader.
     * @type {String}
     */
    TextureBuilder.prototype.name = 'Texture Cube';
    
    /**
     * The required vertex information.
     * @type {Number}
     */
    TextureBuilder.prototype.requiredTypes = Const.POS|Const.CUBE;
    
    /**
     * The vertex shader program.
     * @type {String}
     */
    TextureBuilder.prototype.vsSource =
        'uniform mat4 objMat;                                       \n'+
        'uniform mat4 viewMat;                                      \n'+
        'uniform mat4 projMat;                                      \n'+
        '                                                           \n'+
        'attribute vec3 posAttr;                                    \n'+
        'attribute vec3 cubeAttr;                                   \n'+
        '                                                           \n'+
        'varying vec3 vCube;                                        \n'+
        '                                                           \n'+
        'void main()                                                \n'+
        '{                                                          \n'+
        '  gl_Position = projMat*viewMat*objMat*vec4(posAttr, 1.0); \n'+
        '  vCube = cubeAttr;                                        \n'+
        '}                                                          \n';

    /**
     * The fragment shader program.
     * @type {String}
     */
    TextureBuilder.prototype.fsSource =
        'precision mediump float;                                                   \n'+
        '                                                                           \n'+
        'uniform vec3 filterColor;                                                  \n'+
        '                                                                           \n'+
        'varying vec3 vCube;                                                        \n'+
        '                                                                           \n'+
        'uniform samplerCube txtSampler;                                            \n'+
        '                                                                           \n'+
        'void main()                                                                \n'+
        '{                                                                          \n'+
        '   gl_FragColor = textureCube(txtSampler, vCube) * vec4(filterColor, 1.0); \n'+
        '}                                                                          \n';
    
    /**
     * Initializes the shader.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @return  {Shader}  The built color shader.
     */
    TextureBuilder.prototype.build = function(gl) {
        var builder = new ShaderBuilder(
            this.vsSource, this.fsSource,
            this.name, this.requiredTypes);
        return builder.build(gl);
    };
    
    return TextureBuilder;
});
