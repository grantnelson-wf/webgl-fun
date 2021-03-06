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
    DirectionalBuilder.prototype.requiredTypes = Const.POS|Const.NORM|Const.TXT|Const.BINM;
    
    /**
     * The vertex shader program.
     * @type {String}
     */
    DirectionalBuilder.prototype.vsSource =
        'uniform mat4 objMat;                                       \n'+
        'uniform mat4 viewMat;                                      \n'+
        'uniform mat4 projMat;                                      \n'+
        '                                                           \n'+
        'attribute vec3 posAttr;                                    \n'+
        'attribute vec3 normAttr;                                   \n'+
        'attribute vec3 binmAttr;                                   \n'+
        'attribute vec2 txtAttr;                                    \n'+
        '                                                           \n'+
        'varying vec3 vPos;                                         \n'+
        'varying vec3 vNorm;                                        \n'+
        'varying vec3 vBinm;                                        \n'+
        'varying vec2 vTxt;                                         \n'+
        '                                                           \n'+
        'void main()                                                \n'+
        '{                                                          \n'+
        '  vec4 pos = objMat*vec4(posAttr, 1.0);                    \n'+
        '  vPos = pos.xyz;                                          \n'+
        '  vNorm = normalize(objMat*vec4(normAttr, 0.0)).xyz;       \n'+
        '  vBinm = (viewMat*objMat*vec4(binmAttr, 0.0)).xyz;        \n'+
        '  gl_Position = projMat*viewMat*pos;                       \n'+
        '  gl_PointSize = 3.0;                                      \n'+
        '  vTxt = txtAttr;                                          \n'+
        '}                                                          \n';

    /**
     * The fragment shader program.
     * @type {String}
     */
    DirectionalBuilder.prototype.fsSource =
        'precision mediump float;                                \n'+
        '                                                        \n'+
        'uniform vec3 color;                                     \n'+
        'uniform float lightRange;                               \n'+
        'uniform vec3 lightPnt;                                  \n'+
        '                                                        \n'+
        'uniform sampler2D txtSampler;                           \n'+
        'uniform sampler2D bumpSampler;                          \n'+
        '                                                        \n'+
        'varying vec3 vPos;                                      \n'+
        'varying vec3 vNorm;                                     \n'+
        'varying vec3 vBinm;                                     \n'+
        'varying vec2 vTxt;                                      \n'+
        '                                                        \n'+
        'void main()                                             \n'+
        '{                                                       \n'+
        '   float alpha = 1.0;                                   \n'+
        '   if (lightRange > 0.0) {                              \n'+
        '      alpha = 0.0;                                      \n'+
        '      vec3 litDir = lightPnt - vPos;                    \n'+
        '      float dist = length(litDir);                      \n'+
        '      if (dist < lightRange) {                          \n'+
        '         vec3 n = normalize(vNorm);                     \n'+
        '         vec3 b = normalize(vBinm);                     \n'+
        '         vec3 c = -cross(n, b);                         \n'+
        '         b = -cross(c, n);                              \n'+
        '                                                        \n'+
        '         mat3 m = mat3(c.x, c.y, c.z,                   \n'+
        '                       b.x, b.y, b.z,                   \n'+
        '                       n.x, n.y, n.z);                  \n'+
        '         vec3 bump = texture2D(bumpSampler, vTxt).rbg;  \n'+
        '         bump = normalize(m * (bump*2.0 - 1.0));        \n'+
        '         float scalar = dot(bump, normalize(litDir));   \n'+
        '         if (scalar > 0.0) {                            \n'+
        '            alpha = scalar * (1.0 - dist/lightRange);   \n'+
        '            alpha = min(1.0, max(0.0, alpha));          \n'+
        '         }                                              \n'+
        '      }                                                 \n'+
        '   }                                                    \n'+
        '   if (alpha >= 0.00001) {                              \n'+
        '       vec4 txtcolor = texture2D(txtSampler, vTxt);     \n'+
        '       gl_FragColor = vec4(color, alpha) * txtcolor;    \n'+
        '   } else {                                             \n'+
        '       gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);         \n'+
        '   }                                                    \n'+
        '}                                                       \n';
    
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
