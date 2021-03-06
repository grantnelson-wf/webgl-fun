define(function(require) {

    var Const = require('tools/const');
    var ShaderBuilder = require('shaders/shader');
    
    /**
     * Creates a reflection shader.
     * Makes things look like shiny metal.
     */
    function MetalBuilder() {
        // Do Nothing
    }

    /**
     * The name for this shader.
     * @type {String}
     */
    MetalBuilder.prototype.name = 'Metal';
    
    /**
     * The required vertex information.
     * @type {Number}
     */
    MetalBuilder.prototype.requiredTypes = Const.POS|Const.NORM;
    
    /**
     * The vertex shader program.
     * @type {String}
     */
    MetalBuilder.prototype.vsSource =
        'uniform mat4 objMat;                                  \n'+
        'uniform mat4 viewMat;                                 \n'+
        'uniform mat4 projMat;                                 \n'+
        '                                                      \n'+
        'attribute vec3 posAttr;                               \n'+
        'attribute vec3 normAttr;                              \n'+
        '                                                      \n'+
        'varying vec3 vNorm;                                   \n'+
        'varying vec3 vView;                                   \n'+
        '                                                      \n'+
        'void main()                                           \n'+
        '{                                                     \n'+
        '  vec4 eyeCoords = viewMat*objMat*vec4(posAttr, 1.0); \n'+
        '  gl_Position = projMat*eyeCoords;                    \n'+
        '  vView = -vec3(eyeCoords);                           \n'+
        '  vNorm = vec3(viewMat*objMat*vec4(normAttr, 0.0));   \n'+
        '}                                                     \n';

    /**
     * The fragment shader program.
     * @type {String}
     */
    MetalBuilder.prototype.fsSource =
        'precision mediump float;                                    \n'+
        '                                                            \n'+
        'uniform mat4 invViewMat;                                    \n'+
        'uniform samplerCube txtSampler;                             \n'+
        '                                                            \n'+
        'varying vec3 vNorm;                                         \n'+
        'varying vec3 vView;                                         \n'+
        '                                                            \n'+
        'void main()                                                 \n'+
        '{                                                           \n'+
        '   vec3 refl = reflect(normalize(vView), normalize(vNorm)); \n'+
        '   refl = vec3(invViewMat*vec4(refl, 0.0));                 \n'+
        '   gl_FragColor = textureCube(txtSampler, refl);            \n'+
        '}                                                           \n';
    
    /**
     * Initializes the shader.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @return  {Shader}  The built color shader.
     */
    MetalBuilder.prototype.build = function(gl) {
        var builder = new ShaderBuilder(
            this.vsSource, this.fsSource,
            this.name, this.requiredTypes);
        return builder.build(gl);
    };
    
    return MetalBuilder;
});
