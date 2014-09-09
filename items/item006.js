define(function(require) {

    var Const = require('tools/const');
    var Matrix = require('tools/matrix');
    var ObjMover = require('movers/tumble');
    var ViewMover = require('movers/userFocus');
    var SkyboxShaderBuilder = require('shaders/textureCube');
    var SkyboxShapeBuilder = require('shapes/cube');
    var ObjShaderBuilder = require('shaders/metal');
    var ObjShapeBuilder = require('shapes/toroid');
    var TxtCube = require('tools/textureCube');
    
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
    Item.prototype.name = 'Texture Cube';
    
    /**
     * Starts this item for rendering.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @return  {Boolean}  True if successfully started, false otherwise.
     */
    Item.prototype.start = function(gl) {
        // Create cube texture.
        this.txtCube = new TxtCube(gl);
        this.txtCube.index = 0;
        this.txtCube.loadFromFiles(
            './data/glacier/posx.jpg',  './data/glacier/posy.jpg',
            './data/glacier/posz.jpg', './data/glacier/negx.jpg',
            './data/glacier/negy.jpg', './data/glacier/negz.jpg');

        // Define projection.
        var projMatrix = Matrix.perspective(Math.PI/3.0, 1.0, 1.0, -1.0);

        //=================================================

        // Build and set the skybox shader.
        var skyboxShaderBuilder = new SkyboxShaderBuilder();
        this.skyboxShader = skyboxShaderBuilder.build(gl);
        if (!this.skyboxShader) {
            return false;
        }
        this.skyboxShader.use();
        
        // Create skybox shape to use.
        var skyboxShapeBuilder = new SkyboxShapeBuilder();
        skyboxShapeBuilder.width = -4;
        skyboxShapeBuilder.height = -4;
        skyboxShapeBuilder.depth = -4;
        this.skyboxShape = skyboxShapeBuilder.build(gl, this.skyboxShader.requiredType);
        this.skyboxShape.posAttr = this.skyboxShader.posAttrLoc;
        this.skyboxShape.cubeAttr = this.skyboxShader.cubeAttrLoc;

        // Set projection transformation for skybox.
        this.skyboxShader.setProjMat(projMatrix);
        this.skyboxShader.setTxtSampler(this.txtCube.index);

        //=================================================

        // Build and set the object shader.
        var objShaderBuilder = new ObjShaderBuilder();
        this.objShader = objShaderBuilder.build(gl);
        if (!this.objShader) {
            return false;
        }
        this.objShader.use();
        
        // Create object shape to use.
        var objShapeBuilder = new ObjShapeBuilder();
        this.objShape = objShapeBuilder.build(gl, this.objShader.requiredType);
        this.objShape.posAttr = this.objShader.posAttrLoc;
        this.objShape.normAttr = this.objShader.normAttrLoc;

        // Set projection transformation for object.
        this.objShader.setProjMat(projMatrix);
        this.objShader.setTxtSampler(this.txtCube.index);

        //=================================================

        // Initialize view movement.
        this.viewMover = new ViewMover();
        this.viewMover.start(gl);
        
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
        // Update movers.
        this.viewMover.update();
        this.objMover.update();
        
        // Clear color buffer.
        // (Because of the skybox the color buffer doesn't have to be cleared.)
        gl.clear(gl.DEPTH_BUFFER_BIT);

        // Setup and draw skybox.
        this.skyboxShader.use();
        this.skyboxShader.setViewMat(this.viewMover.matrix());
        this.skyboxShader.setObjMat(Matrix.identity());
        this.txtCube.bind();
        this.skyboxShape.draw();

        // Setup and draw object.
        this.objShader.use();
        this.objShader.setViewMat(this.viewMover.matrix());
        this.objShader.setObjMat(this.objMover.matrix());
        var invViewMat = Matrix.inverse(this.viewMover.matrix());
        this.objShader.setInvViewMat(invViewMat);
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
        this.objMover.stop(gl);
    };
     
    return Item;
});
