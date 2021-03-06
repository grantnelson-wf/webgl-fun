define(function(require) {

    var Const = require('tools/const');
    var Matrix = require('tools/matrix');
    var ProjMover = require('movers/projection');
    var ViewMover = require('movers/userFocus');
    var SkyboxShaderBuilder = require('shaders/textureCube');
    var SkyboxShapeBuilder = require('shapes/cube');
    var ObjShaderBuilder = require('shaders/bubble');
    var TxtCube = require('tools/textureCube');
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
    Item.prototype.name = 'Bubble';
    
    /**
     * Starts this item for rendering.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {Driver} driver  The driver running this item.
     * @return  {Boolean}  True if successfully started, false otherwise.
     */
    Item.prototype.start = function(gl, driver) {

        // Build and set the skybox shader.
        var skyboxShaderBuilder = new SkyboxShaderBuilder();
        this.skyboxShader = skyboxShaderBuilder.build(gl);
        if (!this.skyboxShader) {
            return false;
        }
        this.skyboxShader.use();
        this.skyboxShader.setTxtSampler(0);
        this.skyboxShader.setFilterColor(1.0, 1.0, 1.0);
        
        // Create skybox shape to use.
        var skyboxShapeBuilder = new SkyboxShapeBuilder();
        skyboxShapeBuilder.width = -40;
        skyboxShapeBuilder.height = -40;
        skyboxShapeBuilder.depth = -40;
        this.skyboxShape = skyboxShapeBuilder.build(gl, this.skyboxShader.requiredType);
        this.skyboxShape.posAttr.set(this.skyboxShader.posAttrLoc);
        this.skyboxShape.cubeAttr.set(this.skyboxShader.cubeAttrLoc);
        
        //=================================================

        // Build and set the object shader.
        var objShaderBuilder = new ObjShaderBuilder();
        this.objShader = objShaderBuilder.build(gl);
        if (!this.objShader) {
            return false;
        }
        this.objShader.use();
        this.objShader.setTxtSampler(0);

        // Setup controls.
        item = this;
        this.dentDelta = 0.01;
        this.controls = new Controls();
        this.controls.addButton('Menu', function() {
            driver.gotoMenu();
        });
        this.controls.setFps(0.0);
        this.controls.addShapeSelect('Shape', function(shapeBuilder){
            item.objShape = shapeBuilder.build(gl, item.objShader.requiredType);
            item.objShape.posAttr.set(item.objShader.posAttrLoc);
            item.objShape.normAttr.set(item.objShader.normAttrLoc);
        }, 'Sphere');
        this.controls.addFloat('Ref Weight', this.objShader.setReflWeight, 0.0, 1.0, 0.9);
        this.controls.addFloat('Dent Speed', function(value) {
            item.dentDelta = value;
        },  0.0, 5.0, 0.4);
        this.controls.addFloat('Dent Pos Offset',  this.objShader.setDentPosOffset,  0.0, 0.5, 0.01);
        this.controls.addFloat('Dent Norm Offset', this.objShader.setDentNormOffset, 0.0, 0.5, 0.05);
        this.controls.addFloat('Reflections',      this.objShader.setReflectScalar,  0.0, 1.0, 0.5);
        this.controls.addFloat('Refractions',      this.objShader.setRefractScalar,  0.0, 1.0, 0.5);
        this.controls.addCubeTxtSelect('Background', function(path) {
            item.txtCube = new TxtCube(gl);
            item.txtCube.index = 0;
            item.txtCube.loadFromPath(path);
        }, 'Glacier');

        //=================================================

        // Initialize view movement.
        this.viewMover = new ViewMover();
        this.projMover = new ProjMover();
        this.viewMover.start(gl);
        this.projMover.start(gl);
        this.startTime=(new Date()).getTime();
        return true;
    };
    
    /**
     * Updates the graphical scene.
     * @param  {WebGLRenderingContext} gl  The graphical object
     * @return  {Boolean}  True if updated correctly, false on error.
     */
    Item.prototype.update = function(gl, fps) {
        this.controls.setFps(fps);
        // Update movers and values.
        this.viewMover.update();
        this.projMover.update();
        var curTime = (new Date()).getTime();
        var dt = (curTime - this.startTime)/1000;
        var dentValue = dt*this.dentDelta;
        var invViewMat = Matrix.inverse(this.viewMover.matrix());
        
        // Clear color buffer.
        // (Because of the skybox the color buffer doesn't have to be cleared.)
        gl.clear(gl.DEPTH_BUFFER_BIT);

        // Setup and draw skybox.
        this.skyboxShader.use();
        this.skyboxShader.setProjMat(this.projMover.matrix());
        this.skyboxShader.setViewMat(this.viewMover.matrix());
        this.skyboxShader.setObjMat(Matrix.identity());
        this.txtCube.bind();
        this.skyboxShape.draw();

        // Setup and draw object.
        this.objShader.use();
        this.objShader.setProjMat(this.projMover.matrix());
        this.objShader.setViewMat(this.viewMover.matrix());
        this.objShader.setObjMat(Matrix.identity());
        this.objShader.setInvViewMat(invViewMat);
        this.objShader.setDentValue(dentValue);
        this.txtCube.bind();
        this.objShape.draw();
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
