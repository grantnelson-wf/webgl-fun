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
    TextureBuilder.prototype.name = 'Red Blue';
    
    /**
     * The required vertex information.
     * @type {Number}
     */
    TextureBuilder.prototype.requiredTypes = Const.POS|Const.TXT;
    
    /**
     * The vertex shader program.
     * @type {String}
     */
    TextureBuilder.prototype.vsSource =
        'uniform float dx;                                       \n'+
        'uniform float dv;                                       \n'+
        'uniform float width;                                    \n'+
        'uniform float height;                                   \n'+
        'uniform float aspect;                                   \n'+
        '                                                        \n'+
        'attribute vec3 posAttr;                                 \n'+
        'attribute vec2 txtAttr;                                 \n'+
        '                                                        \n'+
        'varying vec2 vTxt;                                      \n'+
        '                                                        \n'+
        'void main()                                             \n'+
        '{                                                       \n'+
        '  gl_Position = vec4((posAttr.x*width + dx)*aspect,     \n'+
        '                     posAttr.y*height, posAttr.z, 1.0); \n'+
        '  vTxt = vec2(txtAttr.x*0.5 + dv, txtAttr.y);           \n'+
        '}                                                       \n';

    /**
     * The fragment shader program.
     * @type {String}
     */
    TextureBuilder.prototype.fsSource =
        'precision mediump float;      \n'+
        '                              \n'+
        'uniform vec3 color;           \n'+
        '                              \n'+
        'varying vec2 vTxt;            \n'+
        '                              \n'+
        'uniform sampler2D txtSampler; \n'+
        '                              \n'+
        'void main()                                                       \n'+
        '{                                                                 \n'+
        '   gl_FragColor = texture2D(txtSampler, vTxt) * vec4(color, 1.0); \n'+
        '}                                                                 \n';
    
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
