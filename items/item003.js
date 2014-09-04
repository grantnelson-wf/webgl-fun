define(function(require) {

    var Const = require("tools/const");
    var Matrix = require("tools/matrix");
    var Directional = require("shaders/directional");
    var Toroid = require("shapes/toroid");
    
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
    Item.prototype.name = "Directional Light";
    
    /**
     * Starts this item for rendering.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @return  {Boolean}  True if successfully started, false otherwise.
     */
    Item.prototype.start = function(gl) {
        // Build and set the shader.
        var shaderBuilder = new Directional();
        this.shader = shaderBuilder.build(gl);
        if (!this.shader) {
            return false;
        }
        this.shader.use();
        
        // Create shape to use.
        var shapeBuilder = new Toroid();
        this.shape = shapeBuilder.build(gl, this.shader.requiredType);

        // Set light.
        this.shader.setLightVec(-0.5, 0.5, -1.0);
        this.shader.setAmbientClr(0.0, 0.0, 1.0);
        this.shader.setDiffuseClr(1.0, 0.0, 0.0);
        this.shader.setSpecularClr(1.0, 1.0, 1.0);
        this.shader.setShininess(60.0);
        this.shader.setCamPos(0.0, 0.0, -2.0);
        
        // Set view transformation.
        var viewMatrix = Matrix.translate(0.0, 0.0, 2.0);
        this.shader.setViewMat(viewMatrix);

        // Set projection transformation.
        var projMatrix = Matrix.perspective(Math.PI/3.0, 1.0, 1.0, -1.0);
        this.shader.setProjMat(projMatrix);
        
        // Initialize object rotation values.
        this.yaw   = 0.0;
        this.pitch = 0.0;
        this.roll  = 0.0;
        return true;
    };
    
    /**
     * Updates the graphical scene.
     * @param  {WebGLRenderingContext} gl  The graphical object
     * @return  {Boolean}  True if updated correctly, false on error.
     */
    Item.prototype.update = function(gl) {
        
        // Clear color buffer.
        gl.clear(this.gl.COLOR_BUFFER_BIT|this.gl.DEPTH_BUFFER_BIT);

        // Update rotation.
        this.yaw   += 0.004;
        this.pitch += 0.005;
        this.roll  += 0.006;

        // Set toroid transformation.
        var objMatrix = Matrix.euler(this.yaw, this.pitch, this.roll);
        this.shader.setObjMat(objMatrix);

        // Draw shape.
        this.shape.draw(this.shader.posAttrLoc, null, this.shader.normAttrLoc, null);
        return true;
    };
    
    /**
     * Stops this object and cleans up.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     */
    Item.prototype.stop = function(gl) {
        // Do Nothing
    };
     
    return Item;
});
