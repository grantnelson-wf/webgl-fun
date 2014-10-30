define(function(require) {

    var Const = require('tools/const');
    var ShaderBuilder = require('shaders/shader');
    
    /**
     * Creates a directional light shader.
     */
    function CartoonBuilder() {
        // Do Nothing
    }

    /**
     * The name for this shader.
     * @type {String}
     */
    CartoonBuilder.prototype.name = 'Cartoon';
    
    /**
     * The required vertex information.
     * @type {Number}
     */
    CartoonBuilder.prototype.requiredTypes = Const.POS|Const.NORM;
    
    /**
     * The vertex shader program.
     * @type {String}
     */
    CartoonBuilder.prototype.vsSource =
        'uniform mat4 objMat;                                       \n'+
        'uniform mat4 viewMat;                                      \n'+
        'uniform mat4 projMat;                                      \n'+
        'uniform vec3 lightVec;                                     \n'+
        '                                                           \n'+
        'attribute vec3 posAttr;                                    \n'+
        'attribute vec3 normAttr;                                   \n'+
        '                                                           \n'+
        'varying vec3 normal;                                       \n'+
        'varying vec3 litVec;                                       \n'+
        '                                                           \n'+
        'void main()                                                \n'+
        '{                                                          \n'+
        '  normal = normalize(objMat*vec4(normAttr, 0.0)).xyz;      \n'+
        '  litVec = normalize((viewMat*vec4(lightVec, 0.0)).xyz);   \n'+
        '  gl_Position = projMat*viewMat*objMat*vec4(posAttr, 1.0); \n'+
        '}                                                          \n';

    /**
     * The fragment shader program.
     * @type {String}
     */
    CartoonBuilder.prototype.fsSource =
        'precision mediump float;                                        \n'+
        '                                                                \n'+
        'uniform float ambient;                                          \n'+
        'uniform float diffuse;                                          \n'+
        'uniform vec3 lightClr;                                          \n'+
        'uniform vec3 darkClr;                                           \n'+
        'uniform float slices;                                           \n'+
        '                                                                \n'+
        'varying vec3 normal;                                            \n'+
        'varying vec3 litVec;                                            \n'+
        '                                                                \n'+
        'void main()                                                     \n'+
        '{                                                               \n'+
        '   vec3 norm = normalize(normal);                               \n'+
        '   float diff = diffuse*max(dot(norm, litVec), 0.0);            \n'+
        '   float shade = 1.0 - clamp(ambient + diff, 0.0, 1.0);         \n'+
        '   shade = floor(shade * (slices+1.0)) / (slices+1.0);          \n'+
        '   gl_FragColor = vec4(mix(lightClr, darkClr, shade), 1.0);     \n'+
        '}                                                               \n';
    
    /**
     * Initializes the shader.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @return  {Shader}  The built directional light shader.
     */
    CartoonBuilder.prototype.build = function(gl) {
        var builder = new ShaderBuilder(
            this.vsSource, this.fsSource,
            this.name, this.requiredTypes);
        return builder.build(gl);
    };
    
    return CartoonBuilder;
});
