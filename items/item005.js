define(function(require) {

    var Const = require('tools/const');
    var Matrix = require('tools/matrix');
    var ProjMover = require('movers/projection');
    var ViewMover = require('movers/userFocus');
    var SkyboxShaderBuilder = require('shaders/textureCube');
    var SkyboxShapeBuilder = require('shapes/cube');
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
    Item.prototype.name = 'Skybox';
    
    /**
     * Starts this item for rendering.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {Driver} driver  The driver running this item.
     * @return  {Boolean}  True if successfully started, false otherwise.
     */
    Item.prototype.start = function(gl, driver) {
        // Build and set the shader.
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
        this.skyboxShape.posAttr = this.skyboxShader.posAttrLoc;
        this.skyboxShape.cubeAttr = this.skyboxShader.cubeAttrLoc;
        this.skyboxShader.setTxtSampler(0);
        this.skyboxShader.setFilterColor(1.0, 1.0, 1.0);
        
        // Initialize view movement.
        this.projMover = new ProjMover();
        this.viewMover = new ViewMover();
        this.projMover.start(gl);
        this.viewMover.start(gl);

        // Setup controls.
        item = this;
        this.controls = new Controls();
        this.controls.addButton("Menu", function() {
            driver.gotoMenu();
        });
        this.controls.setFps(0.0);
        this.controls.addFloat("Field of view", function(value) {
            item.projMover.fovAngle = Math.PI*value/180.0;
        },  30.0, 150.0, 90.0);
        this.controls.addFloat("Size of box", function(value) {
            item.scale = value;
        },  1.0, 100.0, 40.0);
        this.controls.addDic("Background", function(path) {
            item.txtCube = new TxtCube(gl);
            item.txtCube.index = 0;
            item.txtCube.loadFromPath(path);
        }, 'Glacier', {
            'Glacier': './data/cubemaps/glacier/',
            'Beach':   './data/cubemaps/beach/',
            'Forest':  './data/cubemaps/forest/',
            'Chapel':  './data/cubemaps/chapel/'
        });
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
        this.skyboxShader.setProjMat(this.projMover.matrix());
        this.skyboxShader.setViewMat(this.viewMover.matrix());
        this.skyboxShader.setObjMat(Matrix.scalar(this.scale, this.scale, this.scale, 1.0));
        
        // Clear color buffer.
        // (Because of the skybox the color buffer doesn't have to be cleared.)
        gl.clear(gl.DEPTH_BUFFER_BIT);


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
        this.projMover.stop(gl);
        this.viewMover.stop(gl);
        this.controls.destroy();
    };
     
    return Item;
});
