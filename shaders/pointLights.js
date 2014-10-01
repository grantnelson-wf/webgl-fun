define(function(require) {

    var Const = require('tools/const');
    var ShaderBuilder = require('shaders/shader');
    
    /**
     * Creates a directional light shader.
     */
    function DirectionalBuilder() {
        // Do Nothing
    }

    /**
     * The name for this shader.
     * @type {String}
     */
    DirectionalBuilder.prototype.name = 'Directional Light';
    
    /**
     * The required vertex information.
     * @type {Number}
     */
    DirectionalBuilder.prototype.requiredTypes = Const.POS|Const.NORM;
    
    /**
     * The vertex shader program.
     * @type {String}
     */
    DirectionalBuilder.prototype.vsSource =
        'uniform mat4 objMat;                                       \n'+
        'uniform mat4 viewMat;                                      \n'+
        'uniform mat4 projMat;                                      \n'+
        '                                                           \n'+
        'attribute vec3 posAttr;                                    \n'+
        'attribute vec3 normAttr;                                   \n'+
        '                                                           \n'+
        'varying vec3 pos;                                          \n'+
        'varying vec3 normal;                                       \n'+
        '                                                           \n'+
        'void main()                                                \n'+
        '{                                                          \n'+
        '  vec4 vPos = objMat*vec4(posAttr, 1.0);                   \n'+
        '  pos = vPos.xyz;                                          \n'+
        '  normal = normalize(objMat*vec4(normAttr, 0.0)).xyz;      \n'+
        '  gl_Position = projMat*viewMat*vPos;                      \n'+
        '}                                                          \n';

    /**
     * The fragment shader program.
     * @type {String}
     */
    DirectionalBuilder.prototype.fsSource =
        'precision mediump float;                                          \n'+
        '                                                                  \n'+
        'uniform vec4 ambientClr;                                          \n'+
        'uniform vec4 diffuseClr;                                          \n'+
        'uniform float lightRange;                                         \n'+
        'uniform vec3 lightPnt;                                            \n'+
        '                                                                  \n'+
        'varying vec3 pos;                                                 \n'+
        'varying vec3 normal;                                              \n'+
        '                                                                  \n'+
        'void main()                                                       \n'+
        '{                                                                 \n'+
        '   vec4 clr = ambientClr;                                         \n'+
        '   if (lightRange <= 0.0) {                                       \n'+
        '      vec3 norm = normalize(normal);                              \n'+
        '      vec3 litDir = lightPnt - pos;                               \n'+
        '      float dist = length(litDir);                                \n'+
        '      if (dist < lightRange) {                                    \n'+
        '         float scalar = dot(norm, normalize(litDir));             \n'+
        '         if (scalar > 0.0) {                                      \n'+
        '            clr += diffuseClr * scalar * (1.0 - dist/lightRange); \n'+
        '         }                                                        \n'+
        '      }                                                           \n'+
        '   }                                                              \n'+
        '   gl_FragColor = clr;                                            \n'+
        '}                                                                 \n';
    
    /**
     * Initializes the shader.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @return  {Shader}  The built directional light shader.
     */
    DirectionalBuilder.prototype.build = function(gl) {
        var builder = new ShaderBuilder(
            this.vsSource, this.fsSource,
            this.name, this.requiredTypes);
        return builder.build(gl);
    };
    
    return DirectionalBuilder;
});
