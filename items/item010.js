define(function(require) {

    var Const = require('tools/const');
    var Matrix = require('tools/matrix');
    var ProjMover = require('movers/projection');
    var ViewMover = require('movers/userFocus');
    var ShaderBuilder = require('shaders/pointLights');
    var CylinderBuilder = require('shapes/cylinder');
    var GridBuilder = require('shapes/grid');
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
    Item.prototype.name = 'Fireflies';
    
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

        // Setup tree shape.
        var cylinderBuilder = new CylinderBuilder();
        cylinderBuilder.closeTop = false;
        cylinderBuilder.closeBottom = false;
        cylinderBuilder.topRadius = 0.5;
        cylinderBuilder.bottomRadius = 0.5;
        cylinderBuilder.topHeight = 10.0;
        cylinderBuilder.bottomHeight = 0.0;
        cylinderBuilder.sideCount = 10;
        this.tree = cylinderBuilder.build(gl, this.shader.requiredType);
        this.tree.posAttr = this.shader.posAttrLoc;
        this.tree.normAttr = this.shader.normAttrLoc;

        // Setup ground shape.
        var gridBuilder = new GridBuilder();
        gridBuilder.width = -40;
        gridBuilder.depth = 40;
        gridBuilder.z = 10;
        this.ground = gridBuilder.build(gl, this.shader.requiredType);
        this.ground.posAttr = this.shader.posAttrLoc;
        this.ground.normAttr = this.shader.normAttrLoc;
    
        // Setup controls.
        item = this;
        this.controls = new Controls();
        this.controls.addButton("Menu", function() {
            driver.gotoMenu();
        });
        this.controls.setFps(0.0);
        
        // Set light vector.
        this.shader.setLightRange(1.0);
        this.shader.setAmbientClr(0.0, 0.0, 1.0, 1.0);
        this.shader.setDiffuseClr(1.0, 0.0, 0.0, 1.0);
        this.shader.setLightPnt(1.0, 1.0, 1.0);
        this.shader.setObjMat(Matrix.identity())

        // Initialize movers.
        this.viewMover = new ViewMover();
        this.viewMover.target = [0.0, 4.0, 0.0];
        this.viewMover.up = [0.0, 1.0, 0.0];
        this.viewMover.location = [0.0, 5.0, -10.0];
        this.projMover = new ProjMover();
        this.viewMover.start(gl);
        this.projMover.start(gl);
        return true;
    };
    
    /**
     * Updates the graphical scene.
     * @param  {WebGLRenderingContext} gl  The graphical object
     * @return  {Boolean}  True if updated correctly, false on error.
     */
    Item.prototype.update = function(gl, fps) {
        this.controls.setFps(fps);
        this.viewMover.update();
        this.projMover.update();
        this.shader.setViewMat(this.viewMover.matrix());
        this.shader.setProjMat(this.projMover.matrix());
        
        // Clear color buffer.
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

        // Draw shape.
        this.tree.draw();
        this.ground.draw();
        return true;
    };
    
    /**
     * Stops this object and cleans up.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     */
    Item.prototype.stop = function(gl) {
        this.viewMover.stop(gl);
        this.projMover.stop(gl);
        this.controls.destroy();
    };
     
    return Item;
});
