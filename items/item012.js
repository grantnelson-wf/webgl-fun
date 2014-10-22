define(function(require) {

    var Const = require('tools/const');
    var Matrix = require('tools/matrix');
    var ProjMover = require('movers/projection');
    var ObjMover = require('movers/userFocus');
    var SketchBuilder = require('shaders/sketch');
    var OutlineBuilder = require('shaders/outliner');
    var Txt2DBuilder = require('shaders/texture2d');
    var Controls = require('tools/controls');
    var Txt2D = require('tools/texture2d');
    var ShapeBuilder = require('shapes/shape');
    
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
        gl.clearColor(1.0, 1.0, 1.0, 1.0);

        // Build and set the shaders.
        var sketchBuilder = new SketchBuilder();
        this.sketchShader = sketchBuilder.build(gl);
        if (!this.sketchShader) {
            return false;
        }
        this.sketchShader.use();
        this.sketchShader.setLightVec(-0.5, 0.5, -1.0);

        var outlineBuilder = new OutlineBuilder();
        this.outlineShader = outlineBuilder.build(gl);
        if (!this.outlineShader) {
            return false;
        }
        this.outlineShader.use();
        this.outlineShader.setLightVec(-0.5, 0.5, -1.0);

        // Setup controls.
        item = this;
        this.controls = new Controls();
        this.controls.addButton("Menu", function() {
            driver.gotoMenu();
        });
        this.controls.setFps(0.0);
        this.controls.addShapeSelect("Shape", function(shapeBuilder) {
            var builder = new ShapeBuilder();
            shapeBuilder.prepare(builder, item.sketchShader.requiredType|item.outlineShader.requiredType);
            var degenBuilder = builder.createDegenerateLines();

            item.shape = builder.build(gl, item.sketchShader.requiredType);
            item.shape.posAttr.set(item.sketchShader.posAttrLoc);
            item.shape.normAttr.set(item.sketchShader.normAttrLoc);
            item.shape.txtAttr.set(item.sketchShader.txtAttrLoc);

            item.degenShape = degenBuilder.build(gl, item.outlineShader.requiredType);
            item.degenShape.posAttr.set(item.outlineShader.posAttrLoc);
            item.degenShape.normAttr.set(item.outlineShader.normAttrLoc);
            item.degenShape.txtAttr.set(item.outlineShader.txtAttrLoc);
        }, "Toroid");  
        this.controls.addFloat("Ambient", this.sketchShader.setAmbient, 0.0, 1.0, 0.3);
        this.controls.addFloat("Diffuse", this.sketchShader.setDiffuse, 0.0, 1.0, 0.5);
        
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
        
        // Clear color buffer.
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

        // Draw sketch.
        this.sketchShader.use();
        this.sketchShader.setProjMat(this.projMover.matrix());
        this.sketchShader.setViewMat(Matrix.identity());
        this.sketchShader.setObjMat(this.objMover.matrix());
        this.txt2D.bind();
        this.shape.draw();

        // Draw outline.
        this.outlineShader.use();
        this.outlineShader.setProjMat(this.projMover.matrix());
        this.outlineShader.setViewMat(Matrix.identity());
        this.outlineShader.setObjMat(this.objMover.matrix());
        this.degenShape.draw();
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
