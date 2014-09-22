define(function(require) {

    var Const = require('tools/const');
    var Matrix = require('tools/matrix');
    var ProjMover = require('movers/projection');
    var ViewMover = require('movers/userFocus');
    var ObjMover = require('movers/tumble');
    var Controls = require('tools/controls');
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

        // Setup controls.
        this.controls = new Controls();
        this.controls.addFloat("Start", this.shader.setFogStart, 0.0, 4.0, 1.0);
        this.controls.addFloat("Stop", this.shader.setFogStop, 0.0, 4.0, 2.5);
                
        // Initialize movers.
        this.projMover = new ProjMover();
        this.viewMover = new ViewMover();
        this.objMover = new ObjMover();
        this.projMover.start(gl);
        this.viewMover.start(gl);
        this.objMover.start(gl);
        return true;
    };
    
    /**
     * Updates the graphical scene.
     * @param  {WebGLRenderingContext} gl  The graphical object
     * @return  {Boolean}  True if updated correctly, false on error.
     */
    Item.prototype.update = function(gl) {
        this.projMover.update();
        this.viewMover.update();
        this.objMover.update();
        this.shader.setProjMat(this.projMover.matrix());
        this.shader.setViewMat(this.viewMover.matrix());
        this.shader.setObjMat(this.objMover.matrix());
        
        // Clear color buffer.
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

        // Draw shape.
        this.shape.draw();
        return true;
    };
    
    /**
     * Stops this object and cleans up.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     */
    Item.prototype.stop = function(gl) {
        this.projMover.stop(gl);
        this.viewMover.stop(gl);
        this.objMover.stop(gl);
    };
     
    return Item;
});
