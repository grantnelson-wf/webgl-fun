define(function(require) {

    var Const = require("tools/const");
    var ShaderBuilder = require("shaders/shader");
    
    /**
     * Creates a texture shader.
     */
    function TextureBuilder() {
        // Do Nothing
    };

    /**
     * The name for this shader.
     * @type {String}
     */
    TextureBuilder.prototype.name = "Texture";
    
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
        "uniform mat4 objMat;                                       \n"+
        "uniform mat4 viewMat;                                      \n"+
        "uniform mat4 projMat;                                      \n"+
        "                                                           \n"+
        "attribute vec3 posAttr;                                    \n"+
        "attribute vec2 txtAttr;                                    \n"+
        "                                                           \n"+
        "varying vec2 vTxt;                                         \n"+
        "                                                           \n"+
        "void main()                                                \n"+
        "{                                                          \n"+
        "  gl_Position = projMat*viewMat*objMat*vec4(posAttr, 1.0); \n"+
        "  vTxt = txtAttr;                                          \n"+
        "}                                                          \n";

    /**
     * The fragment shader program.
     * @type {String}
     */
    TextureBuilder.prototype.fsSource =
        "precision mediump float;                       \n"+
        "                                               \n"+
        "varying vec2 vTxt;                             \n"+
        "                                               \n"+
        "uniform sampler2D txtSampler;                  \n"+
        "                                               \n"+
        "void main()                                    \n"+
        "{                                              \n"+
        "   gl_FragColor = texture2D(txtSampler, vTxt); \n"+
        "}                                              \n";
    
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
