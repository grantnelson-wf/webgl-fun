define(function(require) {

    var Const = require('tools/const');
    var Matrix = require('tools/matrix');
    var ShaderBuilder = require('shaders/redBlue');
    var Txt2D = require('tools/texture2d');
    var ShapeBuilder = require('shapes/shape');
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
    Item.prototype.name = 'Red/Blue Image';
    
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
        
        gl.depthFunc(gl.LEQUAL);
        gl.blendFunc(gl.ONE, gl.ONE);
        gl.enable(gl.BLEND);
        
        // Setup controls.
        item = this;
        this.controls = new Controls();
        this.controls.addButton("Menu", function() {
            driver.gotoMenu();
        });
        this.controls.setFps(0.0);
        this.controls.addFloat("Width", function(value) {
            item.width = value;
        }, 0.25, 4.0, 1.0);
        this.controls.addFloat("Height", function(value) {
            item.height = value;
        }, 0.25, 4.0, 2.0);
        this.controls.addRGB("Left Color", function(r, g, b) {
            item.leftColor = [r, g, b];
        }, 0.0, 1.0, 1.0);
        this.controls.addFloat("Left Offset", function(value) {
            item.leftOffset = value;
        }, -0.25, 0.25, 0.031);
        this.controls.addRGB("Right Color", function(r, g, b) {
            item.rightColor = [r, g, b];
        }, 1.0, 0.0, 0.0);
        this.controls.addFloat("Right Offset", function(value) {
            item.rightOffset = value;
        }, -0.25, 0.25, 0.001);
        this.controls.addDic("Texture", function(path) {
            item.txt2D = new Txt2D(gl);
            item.txt2D.index = 0;
            item.txt2D.loadFromFile(path);
        }, 'Puppy', {
            'House':    './data/stereo/house.jpg',
            'Jupiter':  './data/stereo/jupiter.jpg',
            'Legos':    './data/stereo/legos.jpg',
            'Moon':     './data/stereo/moon.jpg',
            'Portal 1': './data/stereo/portal1.jpg',
            'Portal 2': './data/stereo/portal2.jpg',
            'Puppy':    './data/stereo/puppy.jpg',
            'River':    './data/stereo/river.jpg'
        });
        
        var shapeBuilder = new ShapeBuilder();
        shapeBuilder.pos.add(-1.0, -1.0, 0.5);
        shapeBuilder.txt.add( 0.0,  1.0);
        shapeBuilder.pos.add(-1.0,  1.0, 0.5);
        shapeBuilder.txt.add( 0.0,  0.0);
        shapeBuilder.pos.add( 1.0,  1.0, 0.5);
        shapeBuilder.txt.add( 1.0,  0.0);
        shapeBuilder.pos.add( 1.0, -1.0, 0.5);
        shapeBuilder.txt.add( 1.0,  1.0);
        shapeBuilder.startTriFan(0, 3, 2, 1);
        this.shape = shapeBuilder.build(gl, this.shader.requiredType);
        this.shape.posAttr.set(this.shader.posAttrLoc);
        this.shape.txtAttr.set(this.shader.txtAttrLoc);
        
        return true;
    };
    
    /**
     * Updates the graphical scene.
     * @param  {WebGLRenderingContext} gl  The graphical object
     * @return  {Boolean}  True if updated correctly, false on error.
     */
    Item.prototype.update = function(gl, fps) {
        this.controls.setFps(fps);
        
        // Clear color buffer.
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

        // Bind texture.
        this.txt2D.bind();

        // Prepare to draw images.
        var aspect = gl.drawingBufferHeight / gl.drawingBufferWidth;
        this.shader.setAspect(aspect);
        this.shader.setWidth(this.width);
        this.shader.setHeight(this.height);
        
        // Draw left image.
        this.shader.setDv(0.0);
        this.shader.setDx(this.leftOffset);
        this.shader.setColor(this.leftColor[0], this.leftColor[1], this.leftColor[2]);
        this.shape.draw();
        
        // Draw right image.
        this.shader.setDv(0.5);
        this.shader.setDx(this.rightOffset);
        this.shader.setColor(this.rightColor[0], this.rightColor[1], this.rightColor[2]);
        this.shape.draw();
        return true;
    };
    
    /**
     * Stops this object and cleans up.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     */
    Item.prototype.stop = function(gl) {
        this.controls.destroy();
    };
     
    return Item;
});
