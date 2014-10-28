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
    DirectionalBuilder.prototype.requiredTypes =
        Const.POS|Const.NORM|Const.WGHT|Const.ADJ1|Const.ADJ2;
    
    /**
     * The vertex shader program.
     * @type {String}
     */
    DirectionalBuilder.prototype.vsSource =
        'uniform mat4 objMat;                                     \n'+
        'uniform mat4 viewMat;                                    \n'+
        'uniform mat4 projMat;                                    \n'+
        'uniform float thickness;                                 \n'+
        '                                                         \n'+
        'attribute vec3 posAttr;                                  \n'+
        'attribute vec3 normAttr;                                 \n'+
        'attribute float wghtAttr;                                \n'+
        'attribute vec3 adj1Attr;                                 \n'+
        'attribute vec3 adj2Attr;                                 \n'+
        '                                                         \n'+
        'void main()                                              \n'+
        '{                                                        \n'+
        '  mat4 viewObjMat = viewMat*objMat;                      \n'+
        '  if (wghtAttr < 0.5) {                                  \n'+
        '    gl_Position = projMat*viewObjMat*vec4(posAttr, 1.0); \n'+
        '  } else {                                               \n'+
        '    // Transform to view space.                          \n'+
        '    vec4 pos       = viewObjMat*vec4(posAttr,  1.0);     \n'+
        '    vec4 norm      = viewObjMat*vec4(normAttr, 0.0);     \n'+
        '    vec4 faceNorm1 = viewObjMat*vec4(adj1Attr, 0.0);     \n'+
        '    vec4 faceNorm2 = viewObjMat*vec4(adj2Attr, 0.0);     \n'+
        '                                                         \n'+
        '    // Compute angle from cam vector to norm.            \n'+
        '    // Cam is at 0 and the desination of the vector is   \n'+
        '    // pos so cam vector is pos.                         \n'+
        '    float dot1 = dot(pos, faceNorm1);                    \n'+
        '    float dot2 = dot(pos, faceNorm2);                    \n'+
        '                                                         \n'+
        '    // test angles, are they different signs?            \n'+
        '    if ((dot1 * dot2) < 0.0) {                           \n'+
        '       pos += norm*thickness;                            \n'+
        '    }                                                    \n'+
        '                                                         \n'+
        '    // set output.                                       \n'+
        '    gl_Position = projMat*pos;                           \n'+
        '  }                                                      \n'+
        '}                                                        \n';

    /**
     * The fragment shader program.
     * @type {String}
     */
    DirectionalBuilder.prototype.fsSource =
        'precision mediump float;            \n'+
        '                                    \n'+
        'uniform vec3 color;                 \n'+
        '                                    \n'+
        'void main()                         \n'+
        '{                                   \n'+
        '   gl_FragColor = vec4(color, 1.0); \n'+
        '}                                   \n';
    
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
