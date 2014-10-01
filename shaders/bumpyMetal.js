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
    MetalBuilder.prototype.requiredTypes = Const.POS|Const.NORM|Const.BINM|Const.TXT;
    
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
        'attribute vec3 binmAttr;                              \n'+
        'attribute vec2 txtAttr;                               \n'+
        '                                                      \n'+
        'varying vec3 vView;                                   \n'+
        'varying vec3 vNorm;                                   \n'+
        'varying vec3 vBinm;                                   \n'+
        'varying vec2 vTxt;                                    \n'+
        '                                                      \n'+
        'void main()                                           \n'+
        '{                                                     \n'+
        '  vec4 eyeCoords = viewMat*objMat*vec4(posAttr, 1.0); \n'+
        '  vView = -(eyeCoords.xyz);                           \n'+
        '  vNorm = (viewMat*objMat*vec4(normAttr, 0.0)).xyz;   \n'+
        '  vBinm = (viewMat*objMat*vec4(binmAttr, 0.0)).xyz;   \n'+
        '  vTxt  = txtAttr;                                    \n'+
        '  gl_Position = projMat*eyeCoords;                    \n'+
        '}                                                     \n';

    /**
     * The fragment shader program.
     * @type {String}
     */
    MetalBuilder.prototype.fsSource =
        'precision mediump float;                          \n'+
        '                                                  \n'+
        'uniform mat4 invViewMat;                          \n'+
        'uniform samplerCube cubeSampler;                  \n'+
        'uniform sampler2D bumpSampler;                    \n'+
        '                                                  \n'+
        'varying vec3 vView;                               \n'+
        'varying vec3 vNorm;                               \n'+
        'varying vec3 vBinm;                               \n'+
        'varying vec2 vTxt;                                \n'+
        '                                                  \n'+
        'void main()                                       \n'+
        '{                                                 \n'+
        '   vec3 n = normalize(vNorm);                     \n'+
        '   vec3 b = normalize(vBinm);                     \n'+
        '   vec3 c = -cross(n, b);                         \n'+
        '   b = -cross(c, n);                              \n'+
        '                                                  \n'+
        '   mat3 m = mat3(c.x, c.y, c.z,                   \n'+
        '                 n.x, n.y, n.z,                   \n'+
        '                 b.x, b.y, b.z);                  \n'+
        '   vec3 bump = texture2D(bumpSampler, vTxt).rbg;  \n'+
        '   bump = m * normalize(2.0*bump - 1.0);          \n'+
        '                                                  \n'+
        '   vec3 refl = reflect(normalize(vView), bump);   \n'+
        '   refl = vec3(invViewMat*vec4(refl, 0.0));       \n'+
        '                                                  \n'+
        '   gl_FragColor = textureCube(cubeSampler, refl); \n'+
        '}                                                 \n';
    
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
