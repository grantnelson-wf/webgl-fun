define(function(require) {

    var Const = require('tools/const');
    var Matrix = require('tools/matrix');
    var ProjMover = require('movers/projection');
    var ViewMover = require('movers/userFocus');
    var ShaderBuilder = require('shaders/heightMap');
    var Txt2D = require('tools/texture2d');
    var Controls = require('tools/controls');
    var GridBuilder = require('shapes/grid');

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
    Item.prototype.name = 'Height Map';

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
        this.shader.setTxtSampler(0);
        this.shader.setObjMat(Matrix.identity());

        // Setup controls.
        item = this;
        this.controls = new Controls();
        this.controls.addButton('Menu', function() {
            driver.gotoMenu();
        });
        this.controls.setFps(0.0);
        this.controls.addInt('Map Size', function(size) {
            var shapeBuilder = new GridBuilder();
            shapeBuilder.widthDiv = size;
            shapeBuilder.depthDiv = size;
            item.shape = shapeBuilder.build(gl, item.shader.requiredType);
            item.shape.posAttr.set(item.shader.posAttrLoc);
            item.shape.txtAttr.set(item.shader.txtAttrLoc);
            item.shape.normAttr.set(item.shader.normAttrLoc);
        }, 2, 255, 200);
        this.controls.addHeightMapSelect('Height Map', function(path) {
            item.txtHeight = new Txt2D(gl);
            item.txtHeight.index = 0;
            item.txtHeight.loadFromFile(path);
        }, 'Mountains');
        this.controls.addFloat('Max Height', this.shader.setMaxHeight, 0.0, 1.0, 0.4);


        // Initialize movers.
        this.projMover = new ProjMover();
        this.viewMover = new ViewMover();
        this.projMover.start(gl);
        this.viewMover.start(gl);
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
        this.shader.setProjMat(this.projMover.matrix());
        this.shader.setViewMat(this.viewMover.matrix());

        // Clear color buffer.
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

        // Bind texture.
        this.txtHeight.bind();

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
        this.controls.destroy();
    };

    return Item;
});
