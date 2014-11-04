define(function(require) {

    var Const = require('tools/const');
    var ShaderBuilder = require('shaders/shader');
    
    /**
     * Creates a fog shader.
     */
    function FogBuilder() {
        // Do Nothing
    }

    /**
     * The name for this shader.
     * @type {String}
     */
    FogBuilder.prototype.name = 'Frame';
    
    /**
     * The required vertex information.
     * @type {Number}
     */
    FogBuilder.prototype.requiredTypes = Const.POS|Const.CLR3;
    
    /**
     * The vertex shader program.
     * @type {String}
     */
    FogBuilder.prototype.vsSource = 
        'uniform mat4 objMat;                            \n'+
        'uniform mat4 viewMat;                           \n'+
        'uniform mat4 projMat;                           \n'+
        '                                                \n'+
        'attribute vec3 posAttr;                         \n'+
        'attribute vec3 clr3Attr;                        \n'+
        '                                                \n'+
        'varying float depth;                            \n'+
        'varying vec3 color;                             \n'+
        '                                                \n'+
        'void main()                                     \n'+
        '{                                               \n'+
        '  vec4 pos = viewMat*objMat*vec4(posAttr, 1.0); \n'+
        '  depth = pos.z;                                \n'+
        '  color = clr3Attr;                             \n'+
        '  gl_Position = projMat*pos;                    \n'+
        '  gl_PointSize = 3.0;                           \n'+
        '}                                               \n';

    /**
     * The fragment shader program.
     * @type {String}
     */
    FogBuilder.prototype.fsSource =
        'precision mediump float;                                   \n'+
        '                                                           \n'+
        'uniform vec3 fogClr;                                       \n'+
        'uniform float fogStart;                                    \n'+
        'uniform float fogStop;                                     \n'+
        'uniform float useDepth;                                    \n'+
        '                                                           \n'+
        'varying float depth;                                       \n'+
        'varying vec3 color;                                        \n'+
        '                                                           \n'+
        'void main()                                                \n'+
        '{                                                          \n'+
        '   if (useDepth > 0.5) {                                   \n'+
        '     float factor = (depth-fogStop)/(fogStart-fogStop);    \n'+
        '     factor = clamp(factor, 0.0, 1.0);                     \n'+
        '     gl_FragColor = vec4(mix(fogClr, color, factor), 1.0); \n'+
        '   } else {                                                \n'+
        '     gl_FragColor = vec4(color, 1.0);                      \n'+
        '   }                                                       \n'+
        '}                                                          \n';
    
    /**
     * Initializes the shader.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @return  {Shader}  The built fog shader.
     */
    FogBuilder.prototype.build = function(gl) {
        var builder = new ShaderBuilder(
            this.vsSource, this.fsSource,
            this.name, this.requiredTypes);
        return builder.build(gl);
    };
    
    return FogBuilder;
});
