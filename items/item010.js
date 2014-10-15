define(function(require) {

    var Const = require('tools/const');
    var Matrix = require('tools/matrix');
    var ProjMover = require('movers/projection');
    var ShapeBuilder = require('shapes/shape');
    var ShaderBuilder = require('shaders/pointLights');
    var CylinderBuilder = require('shapes/cylinder');
    var GridBuilder = require('shapes/grid');
    var Controls = require('tools/controls');
    var FireFly = require('tools/fireFly');
    var Txt2D = require('tools/texture2d');

    /**
     * The data for drawing a tree.
     * @param  {Number} x  The initial x location.
     * @param  {Number} z  The initial z location.
     * @param  {Number} radius  The initial radius.
     */
    function Tree(x, z, radius) {
        this.x = x;
        this.z = z;
        this.radius = radius;
        this.mat = Matrix.mul(
            Matrix.scalar(this.radius, 1.0, this.radius, 1.0),
            Matrix.translate(this.x, 0, this.z));
    }
    
    // The maximum tree count.
    var MaxTreeCount = 30;
    
    // The maximum firefly count.
    var MaxFireFlyCount = 100;
    
    // The maximum fireflies light radius.
    var MaxLightRadius = 5.0;

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
    Item.prototype.name = 'Fireflies';
    
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
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);

        // Setup tree shape.
        var cylinderBuilder = new CylinderBuilder();
        cylinderBuilder.closedTop = false;
        cylinderBuilder.closedBottom = false;
        cylinderBuilder.topRadius = 0.5;
        cylinderBuilder.bottomRadius = 0.5;
        cylinderBuilder.topHeight = 15.0;
        cylinderBuilder.bottomHeight = 0.0;
        cylinderBuilder.sideCount = 10;
        this.tree = cylinderBuilder.build(gl, this.shader.requiredType);
        this.tree.posAttr = this.shader.posAttrLoc;
        this.tree.normAttr = this.shader.normAttrLoc;
        this.tree.txtAttr = this.shader.txtAttrLoc;

        // Setup ground shape.
        var gridBuilder = new GridBuilder();
        gridBuilder.width = -40;
        gridBuilder.depth = 40;
        gridBuilder.z = 10;
        this.ground = gridBuilder.build(gl, this.shader.requiredType);
        this.ground.posAttr = this.shader.posAttrLoc;
        this.ground.normAttr = this.shader.normAttrLoc;
        this.ground.txtAttr = this.shader.txtAttrLoc;

        // Setup firefly shape.
        var shape = new ShapeBuilder();
        shape.pos.add(0.0, 0.0, 0.0);
        shape.norm.add(1.0, 0.0, 0.0);
        shape.txt.add(0.0, 0.0);
        shape.addPointIndex(0);
        this.fireFlyShape = shape.build(gl);
        this.fireFlyShape.posAttr = this.shader.posAttrLoc;
        this.fireFlyShape.normAttr = this.shader.normAttrLoc;
        this.fireFlyShape.txtAttr = this.shader.txtAttrLoc;
        
        // Load textures
        this.groundTxt = new Txt2D(gl);
        this.groundTxt.index = 0;
        this.groundTxt.loadFromFile('./data/textures/grass.jpg');
        
        // Setup controls.
        item = this;
        this.controls = new Controls();
        this.controls.addButton("Menu", function() {
            driver.gotoMenu();
        });
        this.controls.setFps(0.0);
        this.controls.addFloat("Tree Count", function(value) {
            item.treeCount = value;
        }, 0, MaxTreeCount, 10);
        this.controls.addFloat("FireFly Count", function(value) {
            item.fireFlyCount = value;
        }, 0, MaxFireFlyCount, 10);
        this.controls.addFloat("Light Radius", function(value) {
            item.lightRadius = value;
        }, 0.1, MaxLightRadius, 1.0);
        
        // Build random lists.
        this.trees = [];
        for (var i = 0; i < MaxTreeCount; i++) {
            this.trees[i] = new Tree(Math.random()*20.0-10.0,
                Math.random()*15.0-5.0, Math.random()*1.5+0.5);
        }

        this.fireflies = [];
        for (var i = 0; i < MaxFireFlyCount; i++) {
            this.fireflies[i] = new FireFly();
        }

        // Initialize movers.
        this.shader.setViewMat(Matrix.lookat(
            0.0, 4.0, 0.0,
            0.0, 1.0, 0.0,
            0.0, 5.0, -10.0));
        this.projMover = new ProjMover();
        this.projMover.start(gl);
        this.startTime = (new Date()).getTime();
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
        this.shader.setProjMat(this.projMover.matrix());
        this.groundTxt.bind();

        // Update FireFlies
        var curTime = (new Date()).getTime();
        var dt = (curTime - this.startTime);
        this.startTime = curTime;
        for (var i = 0; i < this.fireFlyCount; i++) {
            this.fireflies[i].update(dt);
        }
        
        // Clear color buffer.
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

        // Draw dark shapes.
        this.shader.setLightRange(-1.0);
        this.shader.setColor(0.0, 0.0, 0.0);
        this.shader.setLightPnt(0.0, 0.0, 0.0);
        for (var i = 0; i < this.treeCount; i++) {
            this._drawTree(null, 0.0, this.trees[i]);
        }
        this._drawGround(null);

        // Base lighting.
        /*
        this.shader.setLightRange(40.0);
        this.shader.setColor(0.01, 0.01, 0.01);
        this.shader.setLightPnt(0.0, 5.0, -10.0);
        for (var i = 0; i < this.treeCount; i++) {
            this._drawTree(null, 0.0, this.trees[i]);
        }
        this._drawGround(null);
        */

        // Draw fireflies.
        this.shader.setLightRange(-1.0);
        this.shader.setColor(1.0, 1.0, 0.0);
        for (var i = 0; i < this.fireFlyCount; i++) {
            var fireFly = this.fireflies[i];
            this.shader.setLightPnt(fireFly.x, fireFly.y, fireFly.z);
            this.shader.setObjMat(Matrix.translate(fireFly.x, fireFly.y, fireFly.z));
            this.fireFlyShape.draw();
        }     

        // Draw firefly light.
        for (var i = 0; i < this.fireFlyCount; i++) {
            var fireFly = this.fireflies[i];
            this.shader.setLightRange(this.lightRadius);
            this.shader.setColor(1.0, 1.0, 1.0);
            this.shader.setLightPnt(fireFly.x, fireFly.y, fireFly.z);
            for (var j = 0; j < this.treeCount; j++) {
                this._drawTree(fireFly, this.lightRadius, this.trees[j]);
            }
            this._drawGround(fireFly);
        }         
        
        return true;
    };
    
    /**
     * Stops this object and cleans up.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     */
    Item.prototype.stop = function(gl) {
        this.projMover.stop(gl);
        this.controls.destroy();
    };

    /**
     * TODO: Comment
     */
    Item.prototype._drawTree = function(fireFly, radius, tree) {
        if (fireFly) {
            var dx = fireFly.x - tree.x;
            var dz = fireFly.z - tree.z;
            if (Math.sqrt(dx*dx + dz*dz) <= radius + tree.radius) {
                this.shader.setObjMat(tree.mat);
                this.tree.draw();
            }
        } else {
            this.shader.setObjMat(tree.mat);
            this.tree.draw();
        }
    }

    /**
     * TODO: Comment
     */
    Item.prototype._drawGround = function(fireFly) {
        if (fireFly) {
            if (fireFly.y - this.lightRadius <= 0) {
                this.shader.setObjMat(Matrix.identity());
                this.ground.draw();
            }
        } else {
            this.shader.setObjMat(Matrix.identity());
            this.ground.draw();
        }
    }
     
    return Item;
});
