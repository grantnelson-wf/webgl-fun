define(function(require) {

    var Const = require('tools/const');
    var Matrix = require('tools/matrix');
    var ProjMover = require('movers/projection');
    var ObjMover = require('movers/wobble');
    var Controls = require('tools/controls');
    var ShaderBuilder = require('shaders/menu');
    var ShapeBuilder = require('shapes/wlogo');

    var Item001 = require('items/item001');
    var Item002 = require('items/item002');
    var Item003 = require('items/item003');
    var Item004 = require('items/item004');
    var Item005 = require('items/item005');
    var Item006 = require('items/item006');
    var Item007 = require('items/item007');
    var Item008 = require('items/item008');
    var Item009 = require('items/item009');
    
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
    Item.prototype.name = 'Menu';

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
        var view = Matrix.lookat(0.0, 0.6, 0.0, 0.0, 2.0, 0.0, 0.0, 1.0, -2.0);
        this.shader.setViewMat(view);
        this.shader.setColor(0x70/0xFF, 0xC4/0xFF, 0x0A/0xFF);
        this.shader.setTint(0.7);
        this.shader.setYFade(-0.6);
        gl.depthFunc(gl.LESS);
        gl.clearColor(1.0, 1.0, 1.0, 1.0);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        
        // Build shape
        var shapeBuilder = new ShapeBuilder();
        this.shape = shapeBuilder.build(gl, this.shader.requiredType);
        this.shape.posAttr = this.shader.posAttrLoc;
        this.shape.normAttr = this.shader.normAttrLoc;

        // List all other items.
        var items = [
            new Item001(),
            new Item002(),
            new Item003(),
            new Item004(),
            new Item005(),
            new Item006(),
            new Item007(),
            new Item008(),
            new Item009() ];

        // Setup controls.
        this.controls = new Controls();
        for (var i = 0; i < items.length; i++) {
            this.addButton(items[i], driver);
        }

        // Initialize movers.
        this.projMover = new ProjMover();
        this.objMover = new ObjMover();
        this.projMover.start(gl);
        this.objMover.start(gl);
        return true;
    };

    /**
     * TODO: Comment
     * @param {[type]} other  [description]
     * @param {[type]} driver [description]
     */
    Item.prototype.addButton = function(other, driver) {
        this.controls.addButton(other.name, function() {
            driver.run(other);
        });
    };

    /**
     * Updates the graphical scene.
     * @param  {WebGLRenderingContext} gl  The graphical object
     * @return  {Boolean}  True if updated correctly, false on error.
     */
    Item.prototype.update = function(gl) {
        this.projMover.update();
        this.objMover.update();
        
        // Clear color buffer.
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

        // Setup values for both.
        var mat = this.objMover.matrix();
        mat = Matrix.mul(mat, Matrix.translate(0.0, 0.5, 0.0));
        var negmat = Matrix.scale(mat, 1.0, -1.0, 1.0, 1.0);
        var flatmat = Matrix.scale(mat, 1.0, 0.0, 1.0, 1.0);
        var brightness = 0.8;
        this.shader.setProjMat(this.projMover.matrix());

        // Draw reflection.
        gl.cullFace(gl.FRONT);
        this.shader.setBrightness(0.7);
        this.shader.setViewLoc(0.0, -1.0, -2.0);
        this.shader.setObjMat(negmat);
        this.shape.draw();

        // Draw shape.
        gl.disable(gl.BLEND);
        gl.cullFace(gl.BACK);
        this.shader.setBrightness(0.0);
        this.shader.setViewLoc(0.0, 1.0, -2.0);
        this.shader.setObjMat(mat);
        this.shape.draw();
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
