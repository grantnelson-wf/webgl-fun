define(function(require) {

    var Const = require('tools/const');
    var ShaderBuilder = require('shaders/shader');
    
    /**
     * Creates a menu shader.
     */
    function MenuBuilder() {
        // Do Nothing
    }

    /**
     * The name for this shader.
     * @type {String}
     */
    MenuBuilder.prototype.name = 'Menu';
    
    /**
     * The required vertex information.
     * @type {Number}
     */
    MenuBuilder.prototype.requiredTypes = Const.POS|Const.NORM;
    
    /**
     * The vertex shader program.
     * @type {String}
     */
    MenuBuilder.prototype.vsSource =
        'uniform mat4 objMat;                                  \n'+
        'uniform mat4 viewMat;                                 \n'+
        'uniform mat4 projMat;                                 \n'+
        '                                                      \n'+
        'attribute vec3 posAttr;                               \n'+
        'attribute vec3 normAttr;                              \n'+
        '                                                      \n'+
        'varying vec3 normal;                                  \n'+
        'varying float yPos;                                   \n'+
        '                                                      \n'+
        'void main()                                           \n'+
        '{                                                     \n'+
        '  normal = normalize(objMat*vec4(normAttr, 0.0)).xyz; \n'+
        '  vec4 pos = objMat*vec4(posAttr, 1.0);               \n'+
        '  yPos = pos.y;                                       \n'+
        '  gl_Position = projMat*viewMat*pos;                  \n'+
        '}                                                     \n';

    /**
     * The fragment shader program.
     * @type {String}
     */
    MenuBuilder.prototype.fsSource =
        'precision mediump float;                          \n'+
        '                                                  \n'+
        'uniform vec3 color;                               \n'+
        'uniform vec3 viewLoc;                             \n'+
        'uniform float brightness;                         \n'+
        'uniform float tint;                               \n'+
        'uniform float yFade;                              \n'+
        '                                                  \n'+
        'varying vec3 normal;                              \n'+
        'varying float yPos;                               \n'+
        '                                                  \n'+
        'void main()                                       \n'+
        '{                                                 \n'+
        '   vec3 norm = normalize(normal);                 \n'+
        '   vec3 view = normalize(viewLoc);                \n'+
        '   float dimmer = dot(norm, view);                \n'+
        '   dimmer = max(dimmer*(1.0-tint) + tint, 0.0);   \n'+
        '                                                  \n'+
        '   float fade = max(0.0, min(1.0, yPos/yFade));   \n'+
        '   fade = mix(brightness, 1.0, fade);             \n'+
        '                                                  \n'+
        '   vec3 clr = color.xyz*dimmer*(1.0-fade) + fade; \n'+
        '   gl_FragColor = vec4(clr, 1.0);                 \n'+
        '}                                                 \n';
    
    /**
     * Initializes the shader.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @return  {Shader}  The built menu shader.
     */
    MenuBuilder.prototype.build = function(gl) {
        var builder = new ShaderBuilder(
            this.vsSource, this.fsSource,
            this.name, this.requiredTypes);
        return builder.build(gl);
    };
    
    return MenuBuilder;
});
