define(function(require) {

    var Const = require('tools/const');
    var ShaderBuilder = require('shaders/shader');
    
    /**
     * Creates a refraction and reflection shader with lighting and wabble.
     */
    function GlassBuilder() {
        // Do Nothing
    }

    /**
     * The name for this shader.
     * @type {String}
     */
    GlassBuilder.prototype.name = 'Bubble';
    
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
        'uniform mat4 objMat;                  \n'+
        'uniform mat4 viewMat;                 \n'+
        'uniform mat4 projMat;                 \n'+
        'uniform float dentValue;              \n'+
        'uniform float dentPosOffset;          \n'+
        'uniform float dentNormOffset;         \n'+
        '                                      \n'+
        'attribute vec3 posAttr;               \n'+
        'attribute vec3 normAttr;              \n'+
        '                                      \n'+
        'varying vec3 vNorm;                   \n'+
        'varying vec3 vView;                   \n'+
        '                                      \n'+
        'float PI = 3.14159265358979323846264; \n'+
        '                                      \n'+
        'void main()                                                                   \n'+
        '{                                                                             \n'+
        '  vec3 pos = posAttr + vec3(sin(dentValue*PI), sin((dentValue*2.0/3.0)*PI),   \n'+
        '             sin((dentValue*4.0/3.0)*PI))*posAttr*dentPosOffset;              \n'+
        '  vec3 norm = normAttr + vec3(cos(dentValue*PI), cos((dentValue*2.0/3.0)*PI), \n'+
        '             cos((dentValue*4.0/3.0)*PI))*normAttr*dentNormOffset;            \n'+
        '  vec4 eyeCoords = viewMat*objMat*vec4(pos, 1.0);                             \n'+
        '  gl_Position = projMat*eyeCoords;                                            \n'+
        '  vView = -vec3(eyeCoords);                                                   \n'+
        '  vNorm = vec3(viewMat*objMat*vec4(norm, 0.0));                               \n'+
        '}                                                                             \n';

    /**
     * The fragment shader program.
     * @type {String}
     */
    GlassBuilder.prototype.fsSource =
        'precision mediump float;        \n'+
        '                                \n'+
        'uniform mat4 invViewMat;        \n'+
        'uniform samplerCube txtSampler; \n'+
        'uniform float reflWeight;       \n'+
        'uniform float reflectScalar;    \n'+
        'uniform float refractScalar;    \n'+
        '                                \n'+
        'varying vec3 vNorm;             \n'+
        'varying vec3 vView;             \n'+
        '                                \n'+
        'void main()                                                     \n'+
        '{                                                               \n'+
        '   vec3 norm = normalize(vNorm);                                \n'+
        '   vec3 refl = reflect(normalize(vView), norm);                 \n'+
        '   vec3 refr = mix(-refl, vView, reflWeight);                   \n'+
        '   refl = vec3(invViewMat*vec4(refl, 0.0));                     \n'+
        '   refr = vec3(invViewMat*vec4(refr, 0.0));                     \n'+
        '   gl_FragColor = textureCube(txtSampler, refl)*reflectScalar + \n'+
        '                  textureCube(txtSampler, refr)*refractScalar;  \n'+
        '}                                                               \n';
    
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
