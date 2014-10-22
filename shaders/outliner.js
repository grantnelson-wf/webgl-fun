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
    DirectionalBuilder.prototype.name = 'Outliner';
    
    /**
     * The required vertex information.
     * @type {Number}
     */
    DirectionalBuilder.prototype.requiredTypes = Const.POS|Const.NORM|Const.WGHT;
    
    /**
     * The vertex shader program.
     * @type {String}
     */
    DirectionalBuilder.prototype.vsSource =
        'uniform mat4 objMat;                                            \n'+
        'uniform mat4 viewMat;                                           \n'+
        'uniform mat4 projMat;                                           \n'+
        'uniform float thickness;                                        \n'+
        '                                                                \n'+
        'attribute vec3 posAttr;                                         \n'+
        'attribute vec3 normAttr;                                        \n'+
        'attribute float wghtAttr;                                       \n'+
        '                                                                \n'+
        'void main()                                                     \n'+
        '{                                                               \n'+
        '  vec4 vPos = viewMat*objMat*vec4(posAttr, 1.0);                \n'+
        '  if (wghtAttr > 0.5) {                                         \n'+
        '    vec4 vNorm = viewMat*objMat*vec4(normAttr, 0.0);            \n'+
        '    float size = abs(dot(normalize(vPos.xyz), normalize(vNorm.xyz))); \n'+
        '    if (size < 0.2) {                                           \n'+
        '      vPos = vPos + normalize(vNorm)*thickness;                 \n'+
        '    }                                                           \n'+
        '  }                                                             \n'+
        '  gl_Position = projMat*vPos;                                   \n'+
        '}                                                               \n';

    /**
     * The fragment shader program.
     * @type {String}
     */
    DirectionalBuilder.prototype.fsSource =
        'precision mediump float;            \n'+
        '                                    \n'+
        'uniform vec3 color;                 \n'+
        '                                    \n'+
        'void main()                         \n'+
        '{                                   \n'+
        '   gl_FragColor = vec4(color, 1.0); \n'+
        '}                                   \n';
    
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
