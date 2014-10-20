define(function(require) {

    var Const = require('tools/const');
    var Matrix = require('tools/matrix');
    var ProjMover = require('movers/projection');
    var ViewMover = require('movers/userFocus');
    var ObjMover = require('movers/tumble');
    var ShaderBuilder = require('shaders/color');
    var Controls = require('tools/controls');
    
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
    Item.prototype.name = 'Color';
    
    /**
     * Starts this item for rendering.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {Driver} driver  The driver running this item.
     * @return  {Boolean}  True if successfully started, false otherwise.
     */
    Item.prototype.start = function(gl, driver) {
        // Build and set the shader.
        var shaderBuilder = new ShaderBuilder();
        this.shader = shaderBuilder.build(gl);
        if (!this.shader) {
            return false;
        }
        this.shader.use();

        // Setup controls.
        item = this;
        this.controls = new Controls();
        this.controls.addButton("Menu", function() {
            driver.gotoMenu();
        });
        this.controls.setFps(0.0);
        this.controls.addShapeSelect("Shape", function(shapeBuilder){
            item.shape = shapeBuilder.build(gl, item.shader.requiredType);
            item.shape.posAttr.set(item.shader.posAttrLoc);
            item.shape.clr3Attr.set(item.shader.clr3AttrLoc);
        }, "Toroid");
        
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
    Item.prototype.update = function(gl, fps) {
        this.controls.setFps(fps);
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
        this.controls.destroy();
    };
     
    return Item;
});
