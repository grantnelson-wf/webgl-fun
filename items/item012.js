define(function(require) {

    var Const = require('tools/const');
    var Matrix = require('tools/matrix');
    var ProjMover = require('movers/projection');
    var ObjMover = require('movers/userFocus');
    var SketchBuilder = require('shaders/sketch');
    var Txt2DBuilder = require('shaders/texture2d');
    var Controls = require('tools/controls');
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
    Item.prototype.name = 'Sketch';
    
    /**
     * Starts this item for rendering.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {Driver} driver  The driver running this item.
     * @return  {Boolean}  True if successfully started, false otherwise.
     */
    Item.prototype.start = function(gl, driver) {
        // Build and set the shader.
        var sketchBuilder = new SketchBuilder();
        this.shader = sketchBuilder.build(gl);
        if (!this.shader) {
            return false;
        }
        this.shader.use();
        this.shader.setLightVec(-0.5, 0.5, -1.0);
        gl.clearColor(1.0, 1.0, 1.0, 1.0);

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
            item.shape.normAttr.set(item.shader.normAttrLoc);
            item.shape.txtAttr.set(item.shader.txtAttrLoc);
        }, "Toroid");  
        this.controls.addFloat("Ambient", this.shader.setAmbient, 0.0, 1.0, 0.3);
        this.controls.addFloat("Diffuse", this.shader.setDiffuse, 0.0, 1.0, 0.5);
        
        this.txt2D = new Txt2D(gl);
        this.txt2D.index = 0;
        this.txt2D.loadFromFile('./data/textures/sketch.jpg');
        
        // Initialize movers.
        this.projMover = new ProjMover();
        this.objMover = new ObjMover();
        this.projMover.start(gl);
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
        this.objMover.update();
        this.shader.setProjMat(this.projMover.matrix());
        this.shader.setViewMat(Matrix.identity());
        this.shader.setObjMat(this.objMover.matrix());
        
        // Clear color buffer.
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

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
        this.projMover.stop(gl);
        this.objMover.stop(gl);
        this.controls.destroy();
    };
     
    return Item;
});
