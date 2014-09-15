define(function(require) {

    var Const = require('tools/const');
    var ShaderBuilder = require('shaders/shader');
    
    /**
     * Creates a refraction shader.
     * Makes things look like glass shape.
     */
    function GlassBuilder() {
        // Do Nothing
    }

    /**
     * The name for this shader.
     * @type {String}
     */
    GlassBuilder.prototype.name = 'Glass';
    
    /**
     * The required vertex information.
     * @type {Number}
     */
    GlassBuilder.prototype.requiredTypes = Const.POS|Const.NORM;
    
    /**
     * The vertex shader program.
     * @type {String}
     */
    GlassBuilder.prototype.vsSource =
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
        '  vView = vec3(eyeCoords);                            \n'+
        '  vNorm = -vec3(viewMat*objMat*vec4(normAttr, 0.0));  \n'+
        '}                                                     \n';

    /**
     * The fragment shader program.
     * @type {String}
     */
    GlassBuilder.prototype.fsSource =
        'precision mediump float;                                    \n'+
        '                                                            \n'+
        'uniform mat4 invViewMat;                                    \n'+
        'uniform samplerCube txtSampler;                             \n'+
        'uniform float reflWeight;                                   \n'+
        '                                                            \n'+
        'varying vec3 vNorm;                                         \n'+
        'varying vec3 vView;                                         \n'+
        '                                                            \n'+
        'void main()                                                 \n'+
        '{                                                           \n'+
        '   vec3 refr = reflect(normalize(vView), normalize(vNorm)); \n'+
        '   refr = mix(refr, -vView, reflWeight);                    \n'+
        '   refr = vec3(invViewMat*vec4(refr, 0.0));                 \n'+
        '   gl_FragColor = textureCube(txtSampler, refr);            \n'+
        '}                                                           \n';
    
    /**
     * Initializes the shader.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @return  {Shader}  The built color shader.
     */
    GlassBuilder.prototype.build = function(gl) {
        var builder = new ShaderBuilder(
            this.vsSource, this.fsSource,
            this.name, this.requiredTypes);
        return builder.build(gl);
    };
    
    return GlassBuilder;
});
