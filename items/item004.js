define(function(require) {

    var Const = require('tools/const');
    var Matrix = require('tools/matrix');
    var ObjMover = require('movers/tumble');
    var ShaderBuilder = require('shaders/texture2d');
    var ShapeBuilder = require('shapes/cube');
    var Txt2D = require('tools/texture2d');
    
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
    Item.prototype.name = 'Texture 2D';
    
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
        this.shape.txtAttr = this.shader.txtAttrLoc;

        // Create texture.
        this.txt2D = new Txt2D(gl);
        this.txt2D.loadFromFile('./data/fire.jpg');
        
        // Set view transformation.
        var viewMatrix = Matrix.translate(0.0, 0.0, 2.0);
        this.shader.setViewMat(viewMatrix);

        // Set projection transformation.
        var projMatrix = Matrix.perspective(Math.PI/3.0, 1.0, 1.0, -1.0);
        this.shader.setProjMat(projMatrix);
        
        // Initialize object movement.
        this.objMover = new ObjMover();
        this.objMover.start(gl);
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
        this.objMover.update();
        this.shader.setObjMat(this.objMover.matrix());

        // Bind texture.
        this.txt2D.bind();

        // Draw shape.
        this.shape.draw();
        return true;
    };
    
    /**
     * Stops this object and cleans up.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     */
    Item.prototype.stop = function(gl) {
        this.objMover.stop(gl);
    };
     
    return Item;
});
