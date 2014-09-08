define(function(require) {

    var Const = require('tools/const');
    var Matrix = require('tools/matrix');
    var ObjMover = require('movers/tumble');
    var ShaderBuilder = require('shaders/fog');
    var ShapeBuilder = require('shapes/toroid');
    
    /**
     * Creates an item for rendering.
     */
    function Item() {
        // Do Nothing
    }

    /**
     * The name for this item.
     * @type {String}
     */
    Item.prototype.name = 'Fog';
    
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
        this.shape = shapeBuilder.build(gl, this.shader.requiredType);
        this.shape.posAttr = this.shader.posAttrLoc;

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
        
        // Initialize object movement.
        this.mover = new ObjMover();
        this.mover.start(gl);
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

        // Set toroid transformation.
        this.mover.update();
        this.shader.setObjMat(this.mover.matrix());

        // Draw shape.
        this.shape.draw();
        return true;
    };
    
    /**
     * Stops this object and cleans up.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     */
    Item.prototype.stop = function(gl) {
        this.mover.stop(gl);
    };
     
    return Item;
});
