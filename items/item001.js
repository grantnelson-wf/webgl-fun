define(function(require) {

    var Const = require("tools/const");
    var Matrix = require("tools/matrix");
    var Fog = require("shaders/fog");
    var Toroid = require("shapes/wlogo");
    
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
    Item.prototype.name = "Fog";
    
    /**
     * Starts this item for rendering.
     * @param  {Graphics} gfx  The graphical object.
     * @return  {Boolean}  True if successfully started, false otherwise.
     */
    Item.prototype.start = function(gfx) {
        // Build and set the shader.
        var shaderBuilder = new Fog();
        this.shader = shaderBuilder.build(gfx);
        if (!this.shader) {
            return false;
        }
        this.shader.use();
        
        // Create shape to use.
        var shapeBuilder = new Toroid();
        this.shape = shapeBuilder.build(gfx, this.shader.requiredType);

        // Set light.
        this.shader.setObjClr(1.0, 1.0, 1.0);
        this.shader.setFogClr(0.0, 0.0, 0.0);
        this.shader.setFogStart(1.0);
        this.shader.setFogStop(2.5);
        
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

        // Set toroid transformation.
        var objMatrix = Matrix.mul(
            Matrix.mul(
                Matrix.rotateX(this.yaw),
                Matrix.rotateY(this.pitch)),
            Matrix.rotateZ(this.roll));
        this.shader.setObjMat(objMatrix);

        // Draw shape.
        this.shape.draw(gfx, this.shader.posAttrLoc, null, this.shader.normAttrLoc, null);

        return true;
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
