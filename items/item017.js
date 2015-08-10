define(function(require) {

    var Const = require('tools/const');
    var Matrix = require('tools/matrix');
    var Txt2D = require('tools/texture2d');
    var TxtCube = require('tools/textureCube');
    var Controls = require('tools/controls');

    var ProjMover = require('movers/projection');
    var ViewMover = require('movers/userFocus');
    var TumbleMover = require('movers/tumble');

    var SkyboxShaderBuilder = require('shaders/textureCube');
    var ColorBuilder = require('shaders/color');
    var SkyboxShapeBuilder = require('shapes/cube');

    var BumpsBuilder = require('shaders/scrollingBumps');
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
    Item.prototype.name = 'Eye Distortions';

    /**
     * Starts this item for rendering.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {Driver} driver  The driver running this item.
     * @return  {Boolean}  True if successfully started, false otherwise.
     */
    Item.prototype.start = function(gl, driver) {
        // Build and set the targeted color shader.
        var skyboxShaderBuilder = new SkyboxShaderBuilder();
        this.skyboxShader = skyboxShaderBuilder.build(gl);
        if (!this.skyboxShader) {
            return false;
        }
        this.skyboxShader.use();

        // Create skyboxShape to use.
        var skyboxShapeBuilder = new SkyboxShapeBuilder();
        skyboxShapeBuilder.width = -1;
        skyboxShapeBuilder.height = -1;
        skyboxShapeBuilder.depth = -1;
        this.skyboxShape = skyboxShapeBuilder.build(gl, this.skyboxShader.requiredType);
        this.skyboxShape.posAttr.set(this.skyboxShader.posAttrLoc);
        this.skyboxShape.cubeAttr.set(this.skyboxShader.cubeAttrLoc);
        this.skyboxShader.setTxtSampler(0);
        this.skyboxShader.setFilterColor(1.0, 1.0, 1.0);
        this.skyboxShader.setProjMat(Matrix.perspective(Math.PI/2.0, 1.0, 1.0, -1.0));
        this.skyboxShader.setObjMat(Matrix.scalar(100.0, 100.0, 100.0, 1.0));

        // Build and set the targeted color shader.
        var objShaderBuilder = new ColorBuilder();
        this.objShader = objShaderBuilder.build(gl);
        if (!this.objShader) {
            return false;
        }
        this.objShader.use();
        this.objShader.setProjMat(Matrix.perspective(Math.PI/2.0, 1.0, 1.0, -1.0));

        // Setup the targeted render buffer.
        this.backTarget = new Txt2D(gl);
        this.backTarget.index = 0;
        this.backTarget.createFramebuffer(1024, 1024);

        // Build and set the foreground shader.
        var foreShaderBuilder = new BumpsBuilder();
        this.foreShader = foreShaderBuilder.build(gl);
        if (!this.foreShader) {
            return false;
        }
        this.foreShader.use();
        this.foreShader.setColorSampler(0);
        this.foreShader.setBumpSampler(1);
        this.foreShader.setObjMat(Matrix.identity());
        this.foreShader.setViewMat(Matrix.lookat(0, 0, 0,   0, 0, 1,   0, 1, 0));

        // Setup projection screen for back target.
        var shapeBuilder = new GridBuilder();
        shapeBuilder.widthDiv = 2;
        shapeBuilder.depthDiv = 2;
        this.foreShape = shapeBuilder.build(gl, this.foreShader.requiredType);
        this.foreShape.posAttr.set(this.foreShader.posAttrLoc);
        this.foreShape.txtAttr.set(this.foreShader.txtAttrLoc);

        // Setup controls.
        item = this;
        this.controls = new Controls();
        this.controls.addButton('Menu', function() {
            driver.gotoMenu();
        });
        this.controls.addCubeTxtSelect('Background', function(path) {
            item.skyboxTxt = new TxtCube(gl);
            item.skyboxTxt.index = 0;
            item.skyboxTxt.loadFromPath(path);
        }, 'Meadow');
        this.controls.addBumpMapSelect('BumpMap', function(path) {
            item.txtBump = new Txt2D(gl);
            item.txtBump.index = 1;
            item.txtBump.loadFromFile(path, true, true);
        }, 'Wood');
        this.controls.addFloat('Strength', function(scalar) {
            item.foreShader.setBumpScalar(scalar);
        }, 0.0, 0.1, 0.01);
        this.controls.addFloat('Speed', function(speed) {
            item.scrollSpeed = speed;
        }, 0.0, 1.0, 0.1);
        this.controls.addShapeSelect('Shape', function(shapeBuilder) {
            item.objShape = shapeBuilder.build(gl, item.objShader.requiredType);
            item.objShape.posAttr.set(item.objShader.posAttrLoc);
            item.objShape.clr3Attr.set(item.objShader.clr3AttrLoc);
        }, 'Knot');
        this.controls.setFps(0.0);

        // Initialize targeted movers.
        this.backViewMover = new ViewMover();
        this.objMover = new TumbleMover();
        this.backViewMover.start(gl);
        this.objMover.start(gl);

        // Initialize movers.
        this.foreProjMover = new ProjMover();
        this.foreProjMover.start(gl);
        this.xBumpOffset = 0;
        this.yBumpOffset = 0;
        return true;
    };

    /**
     * Updates the targeted graphical scene.
     * @param  {WebGLRenderingContext} gl  The graphical object
     * @return  {Boolean}  True if updated correctly, false on error.
     */
    Item.prototype._preupdate = function(gl) {
        // Direct rendering to back target.
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.backTarget.framebuffer);

        // Clear color buffer.
        gl.viewport(0, 0, 1024, 1024);
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.DEPTH_BUFFER_BIT);

        // Render Skybox.
    	this.skyboxShader.use();
        this.backViewMover.update();
        this.skyboxShader.setViewMat(this.backViewMover.matrix());
        this.skyboxTxt.bind();
        this.skyboxShape.draw();

        // Draw shape.
        this.objShader.use();
        this.objMover.update();
        this.objShader.setViewMat(this.backViewMover.matrix());
        this.objShader.setObjMat(this.objMover.matrix());
        this.objShape.draw();

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
        this.foreShader.setProjMat(this.foreProjMover.matrix());
        this.xBumpOffset += 0.001*this.scrollSpeed;
        this.yBumpOffset += 0.01*this.scrollSpeed;
        this.foreShader.setBumpOffset(this.xBumpOffset, this.yBumpOffset);

        // Clear color buffer.
        gl.viewport(0, 0, gl.windowWidth, gl.windowHeight);
        gl.clearColor(0.1, 0.1, 0.1, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

        // Bind texture.
        this.backTarget.bind();
        this.txtBump.bind();

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
        this.backViewMover.stop(gl);
        this.foreProjMover.stop(gl);
        this.controls.destroy();
    };

    return Item;
});
