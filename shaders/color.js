define(function(require) {

    var Const = require("tools/const");
    var ShaderBuilder = require("shaders/shader");
    
    /**
     * Creates a color shader.
     */
    function ColorBuilder() {
        // Do Nothing
    };

    /**
     * The name for this shader.
     * @type {String}
     */
    ColorBuilder.prototype.name = "Color";
    
    /**
     * The required vertex information.
     * @type {Number}
     */
    ColorBuilder.prototype.requiredTypes = Const.POS|Const.CLR;
    
    /**
     * The vertex shader program.
     * @type {String}
     */
    ColorBuilder.prototype.vsSource =
        "uniform mat4 objMat;                                       \n"+
        "uniform mat4 viewMat;                                      \n"+
        "uniform mat4 projMat;                                      \n"+
        "                                                           \n"+
        "attribute vec3 posAttr;                                    \n"+
        "attribute vec3 clrAttr;                                    \n"+
        "                                                           \n"+
        "varying vec4 vColor;                                       \n"+
        "                                                           \n"+
        "void main()                                                \n"+
        "{                                                          \n"+
        "  gl_Position = projMat*viewMat*objMat*vec4(posAttr, 1.0); \n"+
        "  vColor = vec4(clrAttr, 1.0);                             \n"+
        "}                                                          \n";

    /**
     * The fragment shader program.
     * @type {String}
     */
    ColorBuilder.prototype.fsSource =
        "precision mediump float;  \n"+
        "                          \n"+
        "varying vec4 vColor;      \n"+
        "                          \n"+
        "void main()               \n"+
        "{                         \n"+
        "   gl_FragColor = vColor; \n"+
        "}                         \n";
    
    /**
     * Initializes the shader.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @return  {Shader}  The built color shader.
     */
    ColorBuilder.prototype.build = function(gl) {
        var builder = new ShaderBuilder(
            this.vsSource, this.fsSource,
            this.name, this.requiredTypes);
        return builder.build(gl);
    };
    
    return ColorBuilder;
});
