define(function(require) {

    var Const = require("tools/const");
    var Matrix = require("tools/matrix");
    var Texture = require("shaders/texture");
    var Toroid = require("shapes/cube");
    var Txt2D = require("tools/texture2d")
    
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
    Item.prototype.name = "Texture";
    
    /**
     * Starts this item for rendering.
     * @param  {Graphics} gfx  The graphical object.
     * @return  {Boolean}  True if successfully started, false otherwise.
     */
    Item.prototype.start = function(gfx) {
        // Build and set the shader.
        var shaderBuilder = new Texture();
        this.shader = shaderBuilder.build(gfx);
        if (!this.shader) {
            return false;
        }
        this.shader.use();
        
        // Create shape to use.
        var shapeBuilder = new Toroid();
        this.shape = shapeBuilder.build(gfx, this.shader.requiredType);

        // Create texture.
        this.txt2D = new Txt2D(gfx.gl);
        this.txt2D.load("./data/fire.jpg");
        
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
        var objMatrix = Matrix.euler(this.yaw, this.pitch, this.roll);
        this.shader.setObjMat(objMatrix);

        // Bind texture.
        this.txt2D.bind();

        // Draw shape.
        this.shape.draw(gfx, this.shader.posAttrLoc, null, null, this.shader.txtAttrLoc);
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
