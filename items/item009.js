define(function(require) {

    var Const = require('tools/const');
    var Common = require('tools/common');
    var Matrix = require('tools/matrix');
    var ProjMover = require('movers/projection');
    var ObjMover = require('movers/tumble');
    var ViewMover = require('movers/userFocus');
    var SkyboxShaderBuilder = require('shaders/textureCube');
    var SkyboxShapeBuilder = require('shapes/cube');
    var ObjShaderBuilder = require('shaders/bumpyMetal');
    var TxtCube = require('tools/textureCube');
    var Txt2D = require('tools/texture2d');
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
    Item.prototype.name = 'Bump Map Reflection';
    
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

        // Build and set the object shader.
        var objShaderBuilder = new ObjShaderBuilder();
        this.objShader = objShaderBuilder.build(gl);
        if (!this.objShader) {
            return false;
        }
        this.objShader.use();
        this.objShader.setCubeSampler(0);
        this.objShader.setBumpSampler(1);
     
        // Setup controls.
        item = this;
        this.controls = new Controls();
        this.controls.addButton("Menu", function() {
            driver.gotoMenu();
        });
        this.controls.setFps(0.0);
        this.controls.addShapeSelect("Shape", function(shapeBuilder) {
            item.objShape = shapeBuilder.build(gl, item.objShader.requiredType);
            item.objShape.posAttr.set(item.objShader.posAttrLoc);
            item.objShape.normAttr.set(item.objShader.normAttrLoc);
            item.objShape.binmAttr.set(item.objShader.binmAttrLoc);
            item.objShape.txtAttr.set(item.objShader.txtAttrLoc);
        }, "Cube");
        this.controls.addDic("Background", function(path) {
            item.txtCube = new TxtCube(gl);
            item.txtCube.index = 0;
            item.txtCube.loadFromPath(path);
        }, 'Chapel', {
            'Glacier': './data/cubemaps/glacier/',
            'Beach':   './data/cubemaps/beach/',
            'Forest':  './data/cubemaps/forest/',
            'Chapel':  './data/cubemaps/chapel/'
        });
        this.controls.addDic("BumpMap", function(path) {
            item.txtBump = new Txt2D(gl);
            item.txtBump.index = 1;
            item.txtBump.loadFromFile(path);
        }, 'Scales', {
            'Bark':     './data/bumpmaps/bark.jpg',
            'Bump':     './data/bumpmaps/bump.jpg',
            'Cloth':    './data/bumpmaps/cloth.jpg',
            'Concrete': './data/bumpmaps/concrete.jpg',
            'Mesh':     './data/bumpmaps/mesh.jpg',
            'Scales':   './data/bumpmaps/scales.jpg',
            'Shapes':   './data/bumpmaps/shapes.jpg',
            'Wood':     './data/bumpmaps/wood.jpg',
            'Workiva':  './data/bumpmaps/workiva.jpg'
        });

        // Initialize movement.
        this.projMover = new ProjMover();
        this.viewMover = new ViewMover();
        this.objMover = new ObjMover();
        this.projMover.start(gl);
        this.viewMover.start(gl);
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
        this.viewMover.update();
        //this.objMover.update();
        
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
        this.objShader.setObjMat(this.objMover.matrix());
        var invViewMat = Matrix.inverse(this.viewMover.matrix());
        this.objShader.setInvViewMat(invViewMat);
        this.txtCube.bind();
        this.txtBump.bind();
        this.objShape.draw();
        return true;
    };
    
    /**
     * Stops this object and cleans up.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     */
    Item.prototype.stop = function(gl) {
        this.projMover.stop(gl);
        this.viewMover.stop(gl);
        this.objMover.stop(gl);
        this.controls.destroy();
    };
     
    return Item;
});
