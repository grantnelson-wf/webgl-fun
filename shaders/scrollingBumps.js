define(function(require) {

    var Const = require('tools/const');
    var ShaderBuilder = require('shaders/shader');

    /**
     * Creates a reflection shader.
     * Makes things look like shiny metal.
     */
    function ScrollingBumpsBuilder() {
        // Do Nothing
    }

    /**
     * The name for this shader.
     * @type {String}
     */
    ScrollingBumpsBuilder.prototype.name = 'ScrollingBumps';

    /**
     * The required vertex information.
     * @type {Number}
     */
    ScrollingBumpsBuilder.prototype.requiredTypes = Const.POS|Const.TXT;

    /**
     * The vertex shader program.
     * @type {String}
     */
    ScrollingBumpsBuilder.prototype.vsSource =
        'uniform mat4 objMat;                                       \n'+
        'uniform mat4 viewMat;                                      \n'+
        'uniform mat4 projMat;                                      \n'+
        '                                                           \n'+
        'attribute vec3 posAttr;                                    \n'+
        'attribute vec2 txtAttr;                                    \n'+
        '                                                           \n'+
        'varying vec2 vTxt;                                         \n'+
        '                                                           \n'+
        'void main()                                                \n'+
        '{                                                          \n'+
        '  vTxt  = txtAttr;                                         \n'+
        '  gl_Position = projMat*viewMat*objMat*vec4(posAttr, 1.0); \n'+
        '}                                                          \n';

    /**
     * The fragment shader program.
     * @type {String}
     */
    ScrollingBumpsBuilder.prototype.fsSource =
        'precision mediump float;                                     \n'+
        '                                                             \n'+
        'uniform vec2 bumpOffset;                                     \n'+
        'uniform float bumpScalar;                                    \n'+
        'uniform sampler2D colorSampler;                              \n'+
        'uniform sampler2D bumpSampler;                               \n'+
        '                                                             \n'+
        'varying vec2 vTxt;                                           \n'+
        '                                                             \n'+
        'void main()                                                  \n'+
        '{                                                            \n'+
        '   vec2 bumpTxt1 = vTxt + bumpOffset;                        \n'+
        '   vec3 bump1 = texture2D(bumpSampler, bumpTxt1).rgb;        \n'+
        '   bump1 = normalize(2.0*bump1 - 1.0)*bumpScalar;            \n'+
        '                                                             \n'+
        '   vec2 bumpTxt2 = vTxt + vec2(-bumpOffset.x, bumpOffset.y); \n'+
        '   vec3 bump2 = texture2D(bumpSampler, bumpTxt2).rgb;        \n'+
        '   bump2 = normalize(2.0*bump2 - 1.0)*bumpScalar;            \n'+
        '                                                             \n'+
        '   vec2 adjTxt = bump1.xy + bump2.xy + vTxt;                 \n'+
        '   gl_FragColor = texture2D(colorSampler, adjTxt);           \n'+
        '}                                                            \n';

    /**
     * Initializes the shader.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @return  {Shader}  The built color shader.
     */
    ScrollingBumpsBuilder.prototype.build = function(gl) {
        var builder = new ShaderBuilder(
            this.vsSource, this.fsSource,
            this.name, this.requiredTypes);
        return builder.build(gl);
    };

    return ScrollingBumpsBuilder;
});
