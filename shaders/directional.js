define(function(require) {

    var Const = require("tools/const");
    var ShaderBuilder = require("shaders/shader");
    
    /**
     * Creates a directional light shader.
     */
    function DirectionalBuilder() {
        // Do Nothing
    };

    /**
     * The name for this shader.
     * @type {String}
     */
    DirectionalBuilder.prototype.name = "Directional Light";
    
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
        "uniform mat4 objMat;                                       \n"+
        "uniform mat4 viewMat;                                      \n"+
        "uniform mat4 projMat;                                      \n"+
        "uniform vec3 lightVec;                                     \n"+
        "                                                           \n"+
        "attribute vec3 posAttr;                                    \n"+
        "attribute vec3 normAttr;                                   \n"+
        "                                                           \n"+
        "varying vec3 normal;                                       \n"+
        "varying vec3 litVec;                                       \n"+
        "                                                           \n"+
        "void main()                                                \n"+
        "{                                                          \n"+
        "  normal = normalize(objMat*vec4(normAttr, 0.0)).xyz;      \n"+
        "  litVec = normalize((viewMat*vec4(lightVec, 0.0)).xyz);   \n"+
        "  gl_Position = projMat*viewMat*objMat*vec4(posAttr, 1.0); \n"+
        "}                                                          \n";



    /**
     * The fragment shader program.
     * @type {String}
     */
    DirectionalBuilder.prototype.fsSource =
        "precision mediump float;                                   \n"+
        "                                                           \n"+
        "uniform vec3 camPos;                                       \n"+
        "uniform vec3 ambientClr;                                   \n"+
        "uniform vec3 diffuseClr;                                   \n"+
        "uniform vec3 specularClr;                                  \n"+
        "uniform float shininess;                                   \n"+
        "                                                           \n"+
        "varying vec3 normal;                                       \n"+
        "varying vec3 litVec;                                       \n"+
        "                                                           \n"+
        "vec3 diffuse(vec3 norm)                                    \n"+
        "{                                                          \n"+
        "   float scalar = dot(norm, litVec);                       \n"+
        "   return diffuseClr*max(scalar, 0.0);                     \n"+
        "}                                                          \n"+
        "                                                           \n"+
        "vec3 specular(vec3 norm)                                   \n"+
        "{                                                          \n"+
        "   vec3 lightRef = normalize(reflect(-litVec, norm));      \n"+
        "   float scalar = dot(lightRef, normalize(camPos));        \n"+
        "   if(scalar > 0.0)                                        \n"+
        "      return specularClr*max(pow(scalar, shininess), 0.0); \n"+
        "   else                                                    \n"+
        "      return vec3(0.0, 0.0, 0.0);                          \n"+
        "}                                                          \n"+
        "                                                           \n"+
        "void main()                                                \n"+
        "{                                                          \n"+
        "   vec3 norm = normalize(normal);                          \n"+
        "   gl_FragColor = vec4(ambientClr +                        \n"+
        "                       diffuse(norm) +                     \n"+
        "                       specular(norm), 1.0);               \n"+
        "}                                                          \n";
    
    /**
     * Initializes the shader.
     * @param  {Graphics} gfx  The graphical object.
     * @return  {Shader}  The built directional light shader.
     */
    DirectionalBuilder.prototype.build = function(gfx) {
        var builder = new ShaderBuilder(
            this.vsSource, this.fsSource,
            this.name, this.requiredTypes);
        return builder.build(gfx);
    };
    
    return DirectionalBuilder;
});
