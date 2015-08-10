define(function(require) {

    var Const = require('tools/const');
    var Matrix = require('tools/matrix');
    var Txt2D = require('tools/texture2d');
    var Controls = require('tools/controls');

    var ProjMover = require('movers/projection');
    var ViewMover = require('movers/userFocus');
    var TumbleMover = require('movers/tumble');

    var TxtShaderBuilder = require('shaders/texture2d');
    var ColorShaderBuilder = require('shaders/color');

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
    Item.prototype.name = 'Back Targetting';

    /**
     * Starts this item for rendering.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {Driver} driver  The driver running this item.
     * @return  {Boolean}  True if successfully started, false otherwise.
     */
    Item.prototype.start = function(gl, driver) {
        // Build and set the targeted color shader.
        var backShaderBuilder = new ColorShaderBuilder();
        this.backShader = backShaderBuilder.build(gl);
        if (!this.backShader) {
            return false;
        }
        this.backShader.use();
        this.backShader.setProjMat(Matrix.perspective(Math.PI/3.0, 1.0, 1.0, -1.0));
        this.backShader.setViewMat(Matrix.lookat(0, 0, 0,   0, -1, 0,   0, 0, -1.5));

        // Setup the targeted render buffer.
        this.backTarget = new Txt2D(gl);
        this.backTarget.index = 0;
        this.backTarget.createFramebuffer(1024, 1024);

        // Build and set the shader.
        var foreShaderBuilder = new TxtShaderBuilder();
        this.foreShader = foreShaderBuilder.build(gl);
        if (!this.foreShader) {
            return false;
        }
        this.foreShader.use();
        this.foreShader.setTxtSampler(0);
        this.foreShader.setObjMat(Matrix.identity());

        // Setup controls.
        item = this;
        this.controls = new Controls();
        this.controls.addButton('Menu', function() {
            driver.gotoMenu();
        });
        this.controls.addShapeSelect('Back Shape', function(shapeBuilder){
            item.backShape = shapeBuilder.build(gl, item.backShader.requiredType);
            item.backShape.posAttr.set(item.backShader.posAttrLoc);
            item.backShape.clr3Attr.set(item.backShader.clr3AttrLoc);
        }, 'Knot');
        this.controls.addShapeSelect('Fore Shape', function(shapeBuilder){
            item.foreShape = shapeBuilder.build(gl, item.foreShader.requiredType);
            item.foreShape.posAttr.set(item.foreShader.posAttrLoc);
            item.foreShape.txtAttr.set(item.foreShader.txtAttrLoc);
        }, 'Knot');
        this.controls.setFps(0.0);

        // Initialize targeted movers.
        this.backObjMover = new TumbleMover();
        this.backObjMover.start(gl);

        // Initialize movers.
        this.foreProjMover = new ProjMover();
        this.foreViewMover = new ViewMover();
        this.foreProjMover.start(gl);
        this.foreViewMover.start(gl);
        return true;
    };

    /**
     * Updates the targeted graphical scene.
     * @param  {WebGLRenderingContext} gl  The graphical object
     * @return  {Boolean}  True if updated correctly, false on error.
     */
    Item.prototype._preupdate = function(gl) {
    	this.backShader.use();
        this.backObjMover.update();
        this.backShader.setObjMat(this.backObjMover.matrix());

        // Direct rendering to back target.
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.backTarget.framebuffer);

        // Clear color buffer.
        gl.viewport(0, 0, 1024, 1024);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

        // Draw shape.
        this.backShape.draw();

        // Release frame buffer.
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return true;
    };

    /**
     * Updates the fore graphical scene.
     * @param  {WebGLRenderingContext} gl  The graphical object
     * @return  {Boolean}  True if updated correctly, false on error.
     */
    Item.prototype._postupdate = function(gl) {
    	this.foreShader.use();
        this.foreProjMover.update();
        this.foreViewMover.update();
        this.foreShader.setProjMat(this.foreProjMover.matrix());
        this.foreShader.setViewMat(this.foreViewMover.matrix());

        // Clear color buffer.
        gl.viewport(0, 0, gl.windowWidth, gl.windowHeight);
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

        // Bind texture.
        this.backTarget.bind();

        // Draw shape.
        this.foreShape.draw();
        return true;
    };

    /**
     * Updates the graphical scene.
     * @param  {WebGLRenderingContext} gl  The graphical object
     * @return  {Boolean}  True if updated correctly, false on error.
     */
    Item.prototype.update = function(gl, fps) {
        this.controls.setFps(fps);
    	if (!this._preupdate(gl)) {
    		return false;
    	}
    	if (!this._postupdate(gl)) {
    		return false;
    	}
        return true;
    };

    /**
     * Stops this object and cleans up.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     */
    Item.prototype.stop = function(gl) {
        this.backObjMover.stop(gl);
        this.foreProjMover.stop(gl);
        this.foreViewMover.stop(gl);
        this.controls.destroy();
    };

    return Item;
});
