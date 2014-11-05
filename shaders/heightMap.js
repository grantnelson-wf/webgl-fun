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
    DirectionalBuilder.prototype.name = 'Directional Light';
    
    /**
     * The required vertex information.
     * @type {Number}
     */
    DirectionalBuilder.prototype.requiredTypes = Const.POS|Const.NORM|Const.TXT;
    
    /**
     * The vertex shader program.
     * @type {String}
     */
    DirectionalBuilder.prototype.vsSource =
        'uniform mat4 objMat;                                \n'+
        'uniform mat4 viewMat;                               \n'+
        'uniform mat4 projMat;                               \n'+
        'uniform float maxHeight;                            \n'+
        '                                                    \n'+
        'attribute vec3 posAttr;                             \n'+
        'attribute vec3 normAttr;                            \n'+
        'attribute vec2 txtAttr;                             \n'+
        '                                                    \n'+
        'varying vec4 color;                                 \n'+
        '                                                    \n'+
        'uniform sampler2D txtSampler;                       \n'+
        '                                                    \n'+
        'void main()                                         \n'+
        '{                                                   \n'+
        '  color = texture2D(txtSampler, txtAttr);           \n'+
        '  float height = (color.x + color.y + color.z)/3.0; \n'+
        '  vec4 pos = height*vec4(normAttr, 0.0)*maxHeight   \n'+
        '             + vec4(posAttr, 1.0);                  \n'+
        '  gl_Position = projMat*viewMat*objMat*pos;         \n'+
        '}                                                   \n';

    /**
     * The fragment shader program.
     * @type {String}
     */
    DirectionalBuilder.prototype.fsSource =
        'precision mediump float;  \n'+
        '                          \n'+
        'varying vec4 color;      \n'+
        '                          \n'+
        'void main()               \n'+
        '{                         \n'+
        '   gl_FragColor = color; \n'+
        '}                         \n';
    
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
