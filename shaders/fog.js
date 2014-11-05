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
    FogBuilder.prototype.name = 'Fog';
    
    /**
     * The required vertex information.
     * @type {Number}
     */
    FogBuilder.prototype.requiredTypes = Const.POS;
    
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
        '                                                \n'+
        'varying float depth;                            \n'+
        '                                                \n'+
        'void main()                                     \n'+
        '{                                               \n'+
        '  vec4 pos = viewMat*objMat*vec4(posAttr, 1.0); \n'+
        '  depth = pos.z;                                \n'+
        '  gl_Position = projMat*pos;                    \n'+
        '}                                               \n';

    /**
     * The fragment shader program.
     * @type {String}
     */
    FogBuilder.prototype.fsSource =
        'precision mediump float;                                  \n'+
        '                                                          \n'+
        'uniform vec3 objClr;                                      \n'+
        'uniform vec3 fogClr;                                      \n'+
        'uniform float fogStart;                                   \n'+
        'uniform float fogStop;                                    \n'+
        '                                                          \n'+
        'varying float depth;                                      \n'+
        '                                                          \n'+
        'void main()                                               \n'+
        '{                                                         \n'+
        '   float factor = (depth-fogStop)/(fogStart-fogStop);     \n'+
        '   factor = clamp(factor, 0.0, 1.0);                      \n'+
        '   gl_FragColor = vec4(mix(fogClr, objClr, factor), 1.0); \n'+
        '}                                                         \n';
    
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
