define(function(require) {

    var Const = require('tools/const');
    var ShaderBuilder = require('shaders/shader');
    
    /**
     * Creates a directional light shader.
     */
    function DirectionalBuilder() {
        // Do Nothing
    }

    /**
     * The name for this shader.
     * @type {String}
     */
    DirectionalBuilder.prototype.name = 'Outliner';
    
    /**
     * The required vertex information.
     * @type {Number}
     */
    DirectionalBuilder.prototype.requiredTypes = Const.POS|Const.NORM|Const.WGHT;
    
    /**
     * The vertex shader program.
     * @type {String}
     */
    DirectionalBuilder.prototype.vsSource =
        'uniform mat4 objMat;                                       \n'+
        'uniform mat4 viewMat;                                      \n'+
        'uniform mat4 projMat;                                      \n'+
        'uniform vec3 lightVec;                                     \n'+
        '                                                           \n'+
        'attribute vec3 posAttr;                                    \n'+
        'attribute vec3 normAttr;                                   \n'+
        'attribute vec2 txtAttr;                                    \n'+
        '                                                           \n'+
        'varying vec3 normal;                                       \n'+
        'varying vec3 litVec;                                       \n'+
        'varying vec2 vTxt;                                         \n'+
        '                                                           \n'+
        'void main()                                                \n'+
        '{                                                          \n'+
        '  normal = normalize(objMat*vec4(normAttr, 0.0)).xyz;      \n'+
        '  litVec = normalize((viewMat*vec4(lightVec, 0.0)).xyz);   \n'+
        '  gl_Position = projMat*viewMat*objMat*vec4(posAttr, 1.0); \n'+
        '  vTxt = txtAttr;                                          \n'+
        '}                                                          \n';

    /**
     * The fragment shader program.
     * @type {String}
     */
    DirectionalBuilder.prototype.fsSource =
        'precision mediump float;                                      \n'+
        '                                                              \n'+
        'uniform float ambient;                                        \n'+
        'uniform float diffuse;                                        \n'+
        '                                                              \n'+
        'varying vec3 normal;                                          \n'+
        'varying vec3 litVec;                                          \n'+
        'varying vec2 vTxt;                                            \n'+
        '                                                              \n'+
        'uniform sampler2D txtSampler;                                 \n'+
        '                                                              \n'+
        'void main()                                                   \n'+
        '{                                                             \n'+
        '   vec3 norm = normalize(normal);                             \n'+
        '   float diff = diffuse*max(dot(norm, litVec), 0.0);          \n'+
        '   float shade = 1.0 - clamp(ambient + diff, 0.0, 1.0);       \n'+
        '   vec4 clr = texture2D(txtSampler, vTxt);                    \n'+
        '   clr = vec4(clamp((clr.xyz-shade)*2.0, 0.0, 1.0), clr.w);   \n'+
        '   gl_FragColor = clr;                                        \n'+
        '}                                                             \n';
    
    /**
     * Initializes the shader.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @return  {Shader}  The built directional light shader.
     */
    DirectionalBuilder.prototype.build = function(gl) {
        var builder = new ShaderBuilder(
            this.vsSource, this.fsSource,
            this.name, this.requiredTypes);
        return builder.build(gl);
    };
    
    return DirectionalBuilder;
});
