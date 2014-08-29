define(function(require) {

    var Const = require("tools/const");
    var ShaderBuilder = require("tools/shader");
    
    /**
     * Creates a fog shader.
     */
    function Fog() {
        // Do Nothing
    };

    /**
     * The name for this shader.
     * @type {String}
     */
    Fog.prototype.name = "Fog";
    
    /**
     * The required vertex information.
     * @type {Number}
     */
    Fog.prototype.requiredTypes = Const.POS;
    
    /**
     * The vertex shader program.
     * @type {String}
     */
    Fog.prototype._vsSource = 
        "uniform mat4 objMat;                            \n"+
        "uniform mat4 viewMat;                           \n"+
        "uniform mat4 projMat;                           \n"+
        "                                                \n"+
        "attribute vec3 posAttr;                         \n"+
        "                                                \n"+
        "varying vec3 position;                          \n"+
        "                                                \n"+
        "void main()                                     \n"+
        "{                                               \n"+
        "  vec4 pos = viewMat*objMat*vec4(posAttr, 1.0); \n"+
        "  position = pos.xyz;                           \n"+
        "  gl_Position = projMat*pos;                    \n"+
        "}                                               \n";

    /**
     * The fragment shader program.
     * @type {String}
     */
    Fog.prototype._fsSource =
        "precision mediump float;                                   \n"+
        "                                                           \n"+
        "uniform vec3 objClr;                                       \n"+
        "uniform vec3 fogClr;                                       \n"+
        "uniform float fogStart;                                    \n"+
        "uniform float fogStop;                                     \n"+
        "                                                           \n"+
        "varying vec3 position;                                     \n"+
        "                                                           \n"+
        "void main()                                                \n"+
        "{                                                          \n"+
        "   float factor = (position.z-fogStop)/(fogStart-fogStop); \n"+
        "   gl_FragColor = vec4(mix(fogClr, objClr, factor), 1.0);  \n"+
        "}                                                          \n";
    
    /**
     * Initializes the shader.
     * @param  {Graphics} gfx  The graphical object.
     * @return  {Boolean}  True if successfully started, false otherwise.
     */
    Fog.prototype.build = function(gfx) {
        // Build and set the shader programs.
        
        shader = ShaderBuilder(this.vsSource, this.fsSource);
        
    };
    
    return Fog;
});
