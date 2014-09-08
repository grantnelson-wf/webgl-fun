define(function(require) {

    var Const = require("tools/const");
    var Matrix = require("tools/matrix");
    var ShaderBuilder = require("shaders/textureCube");
    var ShapeBuilder = require("shapes/cube");
    var TxtCube = require("tools/textureCube")
    
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
    Item.prototype.name = "Texture Cube";
    
    /**
     * Starts this item for rendering.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @return  {Boolean}  True if successfully started, false otherwise.
     */
    Item.prototype.start = function(gl) {
        // Build and set the shader.
        var shaderBuilder = new ShaderBuilder();
        this.shader = shaderBuilder.build(gl);
        if (!this.shader) {
            return false;
        }
        this.shader.use();
        
        // Create shape to use.
        var shapeBuilder = new ShapeBuilder();
        shapeBuilder.width = -4;
        shapeBuilder.height = -4;
        shapeBuilder.depth = -4;
        this.shape = shapeBuilder.build(gl, this.shader.requiredType);
        this.shape.posAttr = this.shader.posAttrLoc;
        this.shape.cubeAttr = this.shader.cubeAttrLoc;

        // Create texture.
        this.txtCube = new TxtCube(gl);
        this.txtCube.loadFromFiles(
            "./data/fire.jpg", "./data/grass.jpg",
            "./data/metal.jpg", "./data/moon.jpg",
            "./data/brick.jpg", "./data/wood.jpg");
        
        // Set view transformation.
        var viewMatrix = Matrix.translate(0.0, 0.0, 2.0);
        this.shader.setViewMat(viewMatrix);

        // Set projection transformation.
        var projMatrix = Matrix.perspective(Math.PI/3.0, 1.0, 1.0, -1.0);
        this.shader.setProjMat(projMatrix);
        
        var objMatrix = Matrix.identity();
        this.shader.setObjMat(objMatrix);
        
        // Initialize view rotation values.
        this.viewYaw   = 0;
        this.viewPitch = 0;
        
        
        // TODO:: Control view with mouse
        
        canvas.onmousedown   = this.handleMouseDown;
        document.onmouseup   = this.handleMouseUp;
        document.onmousemove = this.handleMouseMove;
        
        return true;
    };
    
    /**
     * Updates the graphical scene.
     * @param  {WebGLRenderingContext} gl  The graphical object
     * @return  {Boolean}  True if updated correctly, false on error.
     */
    Item.prototype.update = function(gl) {
        
        // Clear color buffer.
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

        // Set view transformation.
        //var objMatrix = Matrix.euler(this.yaw, this.pitch, 0);
        //this.shader.setObjMat(objMatrix);

        // Bind texture.
        this.txtCube.bind();

        // Draw shape.
        this.shape.draw();
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
