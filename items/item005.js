define(function(require) {

    var Const = require('tools/const');
    var Matrix = require('tools/matrix');
    var ViewMover = require('movers/userFocus');
    var SkyboxShaderBuilder = require('shaders/textureCube');
    var SkyboxShapeBuilder = require('shapes/cube');
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
    Item.prototype.name = 'Skybox';
    
    /**
     * Starts this item for rendering.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @return  {Boolean}  True if successfully started, false otherwise.
     */
    Item.prototype.start = function(gl) {
        // Build and set the shader.
        var skyboxShaderBuilder = new SkyboxShaderBuilder();
        this.skyboxShader = skyboxShaderBuilder.build(gl);
        if (!this.skyboxShader) {
            return false;
        }
        this.skyboxShader.use();
        
        // Create skyboxShape to use.
        var skyboxShapeBuilder = new SkyboxShapeBuilder();
        skyboxShapeBuilder.width = -4;
        skyboxShapeBuilder.height = -4;
        skyboxShapeBuilder.depth = -4;
        this.skyboxShape = skyboxShapeBuilder.build(gl, this.skyboxShader.requiredType);
        this.skyboxShape.posAttr = this.skyboxShader.posAttrLoc;
        this.skyboxShape.cubeAttr = this.skyboxShader.cubeAttrLoc;

        // Create texture.
        this.txtCube = new TxtCube(gl);
        this.txtCube.index = 0;
        this.txtCube.loadFromFiles(
            './data/fire.jpg', './data/grass.jpg',
            './data/metal.jpg', './data/moon.jpg',
            './data/brick.jpg', './data/wood.jpg');
        this.skyboxShader.setTxtSampler(this.txtCube.index);

        // Set projection transformation.
        var projMatrix = Matrix.perspective(Math.PI/3.0, 1.0, 1.0, -1.0);
        this.skyboxShader.setProjMat(projMatrix);
        
        // Initialize view movement.
        this.viewMover = new ViewMover();
        this.viewMover.start(gl);
        return true;
    };
    
    /**
     * Updates the graphical scene.
     * @param  {WebGLRenderingContext} gl  The graphical object
     * @return  {Boolean}  True if updated correctly, false on error.
     */
    Item.prototype.update = function(gl) {
        
        // Clear color buffer.
        // (Because of the skybox the color buffer doesn't have to be cleared.)
        gl.clear(gl.DEPTH_BUFFER_BIT);

        // Set view transformations
        this.viewMover.update();
        this.skyboxShader.setViewMat(this.viewMover.matrix());

        // Sky box object should be stable to the world.
        var objMatrix = Matrix.identity();
        this.skyboxShader.setObjMat(objMatrix);

        // Draw skybox.
        this.txtCube.bind();
        this.skyboxShape.draw();

        // No object shape to draw.
        return true;
    };
    
    /**
     * Stops this object and cleans up.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     */
    Item.prototype.stop = function(gl) {
        this.viewMover.stop(gl);
    };
     
    return Item;
});
