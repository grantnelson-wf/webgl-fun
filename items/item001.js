define(function(require) {

    var Const = require("tools/const");
    var Matrix = require("tools/matrix");
    var ToroidBuilder = require("shapes/toroid");
    
    /**
     * Creates an item for rendering.
     */
    function Item() {
        // Do Nothing
    };

    /**
     * The name for this item.
     * @type {String}
     */
    Item.prototype.name = "Item001";
    
    /**
     * The vertex shader program.
     * @type {String}
     */
    Item.prototype._vsSource = 
        "uniform mat4 objMat;                                  \n"+
        "uniform mat4 viewMat;                                 \n"+
        "uniform mat4 projMat;                                 \n"+
        "uniform vec3 lightPos;                                \n"+
        "                                                      \n"+
        "attribute vec3 posAttr;                               \n"+
        "attribute vec3 normAttr;                              \n"+
        "                                                      \n"+
        "varying vec3 position;                                \n"+
        "varying vec3 normal;                                  \n"+
        "varying vec3 litPos;                                  \n"+
        "                                                      \n"+
        "void main()                                           \n"+
        "{                                                     \n"+
        "  vec4 pos = viewMat*objMat*vec4(posAttr, 1.0);       \n"+
        "  position = pos.xyz;                                 \n"+
        "  normal = normalize(objMat*vec4(normAttr, 0.0)).xyz; \n"+
        "  litPos = (viewMat*vec4(lightPos, 1.0)).xyz;         \n"+
        "  gl_Position = projMat*pos;                          \n"+
        "}                                                     \n";

    /**
     * The fragment shader program.
     * @type {String}
     */
    Item.prototype._fsSource =
        "precision mediump float;                                  \n"+
        "                                                          \n"+
        "uniform float useLight;                                   \n"+
        "uniform vec3 lightClr;                                    \n"+
        "uniform float attenuation;                                \n"+
        "                                                          \n"+
        "varying vec3 position;                                    \n"+
        "varying vec3 normal;                                      \n"+
        "varying vec3 litPos;                                      \n"+
        "                                                          \n"+
        "void main()                                               \n"+
        "{                                                         \n"+
        "   if(useLight > 0.5)                                     \n"+
        "   {                                                      \n"+
        "      vec3 litVec   = litPos-position;                    \n"+
        "      vec3 lightVec = normalize(litVec);                  \n"+
        "      float length  = length(litVec);                     \n"+
        "      if(length >= attenuation)                           \n"+
        "        gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);          \n"+
        "      else                                                \n"+
        "      {                                                   \n"+
        "        float scalar = dot(normalize(normal), lightVec);  \n"+
        "        vec3 diffuse = lightClr*scalar;                   \n"+
        "        float strength = 1.0-length/attenuation;          \n"+
        "        gl_FragColor = vec4(diffuse, pow(strength, 4.0)); \n"+
        "      }                                                   \n"+
        "   }                                                      \n"+
        "   else                                                   \n"+
        "      gl_FragColor = vec4(lightClr, 1.0);                 \n"+
        "}                                                         \n";
    
    /**
     * Starts this item for rendering.
     * @param  {Graphics} gfx  The graphical object.
     * @return  {Boolean}  True if successfully started, false otherwise.
     */
    Item.prototype.start = function(gfx) {
        // Build and set the shader program.
        this.program = gfx.compileProgram(this._vsSource, this._fsSource)
        if (!this.program) {
            return false;
        }
        if (!gfx.setProgram(this.program)) {
            return false;
        }
        
        // Get attribute handles for the shader program.
        this.objMat   = gfx.getUniform("objMat");
        this.viewMat  = gfx.getUniform("viewMat");
        this.projMat  = gfx.getUniform("projMat");
        this.lightPos = gfx.getUniform("lightPos");
        this.useLight = gfx.getUniform("useLight");
        this.colorVar = gfx.getUniform("lightClr");
        this.attenVar = gfx.getUniform("attenuation");
        this.posAttr  = gfx.getAttrib("posAttr");
        this.normAttr = gfx.getAttrib("normAttr");
        
        // Setup custom graphical features.
        // Enable blending and configure graphics for blending.
        var gl = gfx.gl;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.depthFunc(gl.LEQUAL);
        
        // Create shape to use.
        var builder = new ToroidBuilder();
        this.shape = builder.build(gfx, Const.POS|Const.NORM);

        // Prepare the shader.
        gfx.uniform1f(this.attenVar, 2.5);

        // Set view transformation.
        var viewMatrix = Matrix.translate(0.0, 0.0, 2.0);
        gfx.setMatrix(this.viewMat, viewMatrix);

        // Set projection transformation.
        var projMatrix = Matrix.perspective(Math.PI/3.0, 1.0, 1.0, -1.0);
        gfx.setMatrix(this.projMat, projMatrix);
        
        // Initialize object rotation values.
        this.yaw   = 0.0;
        this.pitch = 0.0;
        this.roll  = 0.0;
        
        return true;
    };
    
    /**
     * Updates the graphical scene.
     * @param  {Graphics} gfx  The graphical object
     * @return  {Boolean}  True if updated correctly, false on error.
     */
    Item.prototype.update = function(gfx) {
        
        // Clear color buffer.
        gfx.clearBuffers();

        // Update rotation.
        this.yaw   += 0.004;
        this.pitch += 0.005;
        this.roll  += 0.006;

        // Draw the ambient no color for the background.
        gfx.uniform1f(this.useLight, 0);
        gfx.uniform3f(this.lightPos, 0.0, 0.0, 0.0);
        gfx.uniform3f(this.colorVar, 0.0, 0.0, 0.0);
        this._draw(gfx);

        // Render each light source.
        gfx.uniform1f(this.useLight, 1);

        gfx.uniform3f(this.lightPos,  0.0,  1.5,  0.0);
        gfx.uniform3f(this.colorVar,  0.0,  0.0,  1.0);
        this._draw(gfx);

        gfx.uniform3f(this.lightPos,  0.0, -1.5,  0.0);
        gfx.uniform3f(this.colorVar,  1.0,  1.0,  0.0);
        this._draw(gfx);

        gfx.uniform3f(this.lightPos, -1.5,  0.0,  0.0);
        gfx.uniform3f(this.colorVar,  1.0,  0.0,  0.0);
        this._draw(gfx);

        gfx.uniform3f(this.lightPos,  1.5,  0.0,  0.0);
        gfx.uniform3f(this.colorVar,  0.0,  1.0,  0.0);
        this._draw(gfx);

        gfx.uniform3f(this.lightPos,  0.0,  0.0, -1.5);
        gfx.uniform3f(this.colorVar,  1.0,  0.0,  1.0);
        this._draw(gfx);

        gfx.uniform3f(this.lightPos,  0.0,  0.0,  1.5);
        gfx.uniform3f(this.colorVar,  0.0,  1.0,  1.0);
        this._draw(gfx);

        return true;
    };
    
    /**
     * Draws the shape with the current shader setup.
     * @param  {Graphics} gfx  The graphical object.
     */
    Item.prototype._draw = function(gfx)
    {
        // Set toroid transformation.
        var objMatrix = Matrix.mul(
            Matrix.mul(
                Matrix.rotateX(this.yaw),
                Matrix.rotateY(this.pitch)),
            Matrix.rotateZ(this.roll));
        gfx.setMatrix(this.objMat, objMatrix);

        // Draw shape.
        this.shape.draw(gfx, this.posAttr, null, this.normAttr, null)
    };

    /**
     * Stops this object and cleans up.
     * @param  {Graphics} gfx  The graphical object.
     */
    Item.prototype.stop = function(gfx) {
        // Do Nothing
    };
     
    return Item;
});
