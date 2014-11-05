define(function(require) {

    var Const = require('tools/const');
    var ShaderBuilder = require('shaders/shader');
    
    /**
     * Creates a texture shader.
     */
    function TextureBuilder() {
        // Do Nothing
    }

    /**
     * The name for this shader.
     * @type {String}
     */
    TextureBuilder.prototype.name = 'Texture Flatten';
    
    /**
     * The required vertex information.
     * @type {Number}
     */
    TextureBuilder.prototype.requiredTypes = Const.POS|Const.TXT|Const.NORM;
    
    /**
     * The vertex shader program.
     * @type {String}
     */
    TextureBuilder.prototype.vsSource =
        'uniform mat4 objMat;                                                 \n'+
        'uniform mat4 viewMat;                                                \n'+
        'uniform mat4 projMat;                                                \n'+
        'uniform float flatten;                                               \n'+
        'uniform float magnifier;                                             \n'+
        '                                                                     \n'+
        'attribute vec3 posAttr;                                              \n'+
        'attribute vec2 txtAttr;                                              \n'+
        'attribute vec3 normAttr;                                             \n'+
        '                                                                     \n'+
        'varying vec2 vTxt;                                                   \n'+
        '                                                                     \n'+
        'void main()                                                          \n'+
        '{                                                                    \n'+
        '  mat4 hermite = mat4( 2.0, -3.0,  0.0,  1.0,                        \n'+
        '                      -2.0,  3.0,  0.0,  0.0,                        \n'+
        '                       1.0, -2.0,  1.0,  0.0,                        \n'+
        '                       1.0, -1.0,  0.0,  0.0);                       \n'+
        '  float flatten2 = flatten*flatten;                                  \n'+
        '  float flatten3 = flatten2*flatten;                                 \n'+
        '  vec4 iter = vec4(flatten3, flatten2, flatten, 1.0);                \n'+
        '  float flatx = txtAttr.x*2.0-1.0;                                   \n'+
        '  float flatz = txtAttr.y*2.0-1.0;                                   \n'+
        '  mat4 pov = mat4(posAttr.x, flatx, normAttr.x*magnifier, 0.0,       \n'+
        '                  posAttr.y, 0.0,   normAttr.y*magnifier, magnifier, \n'+
        '                  posAttr.z, flatz, normAttr.z*magnifier, 0.0,       \n'+
        '                  1.0,       1.0,   0.0,                  0.0);      \n'+
        '  vec4 final = iter*hermite*pov;                                     \n'+
        '  gl_Position = projMat*viewMat*objMat*final;                        \n'+
        '  vTxt = txtAttr;                                                    \n'+
        '}                                                                    \n';

    /**
     * The fragment shader program.
     * @type {String}
     */
    TextureBuilder.prototype.fsSource =
        'precision mediump float;                       \n'+
        '                                               \n'+
        'varying vec2 vTxt;                             \n'+
        '                                               \n'+
        'uniform sampler2D txtSampler;                  \n'+
        '                                               \n'+
        'void main()                                    \n'+
        '{                                              \n'+
        '   gl_FragColor = texture2D(txtSampler, vTxt); \n'+
        '}                                              \n';
    
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
