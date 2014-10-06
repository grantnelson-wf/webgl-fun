define(function(require) {

    var Const = require('tools/const');
    var Matrix = require('tools/matrix');
    var ProjMover = require('movers/projection');
    var ViewMover = require('movers/userFocus');
    var ShapeBuilder = require('shapes/shape');
    var ShaderBuilder = require('shaders/pointLights');
    var CylinderBuilder = require('shapes/cylinder');
    var GridBuilder = require('shapes/grid');
    var Controls = require('tools/controls');
    
    /**
     * The data for drawing a fire fly.
     * @param  {Number} x  The initial x location.
     * @param  {Number} y  The initial y location.
     * @param  {Number} z  The initial z location.
     */
    function FireFly(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.brightness = 1;
    }

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
    }

    var TreeCount = 10;
    var FireFlyCount = 100;
    var LightRadius = 1.0;

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
        gl.depthFunc(gl.LEQUAL);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);

        // Setup tree shape.
        var cylinderBuilder = new CylinderBuilder();
        cylinderBuilder.closedTop = false;
        cylinderBuilder.closedBottom = false;
        cylinderBuilder.topRadius = 0.5;
        cylinderBuilder.bottomRadius = 0.5;
        cylinderBuilder.topHeight = 10.0;
        cylinderBuilder.bottomHeight = 0.0;
        cylinderBuilder.sideCount = 10;
        this.tree = cylinderBuilder.build(gl, this.shader.requiredType);
        this.tree.posAttr = this.shader.posAttrLoc;
        this.tree.normAttr = this.shader.normAttrLoc;

        // Setup ground shape.
        var gridBuilder = new GridBuilder();
        gridBuilder.width = -40;
        gridBuilder.depth = 40;
        gridBuilder.z = 10;
        this.ground = gridBuilder.build(gl, this.shader.requiredType);
        this.ground.posAttr = this.shader.posAttrLoc;
        this.ground.normAttr = this.shader.normAttrLoc;

        // Setup firefly shape.
        var shape = new ShapeBuilder();
        shape.pos.add(0.0, 0.0, 0.0);
        shape.norm.add(1.0, 0.0, 0.0);
        shape.addPointIndex(0);
        this.fireFlyShape = shape.build(gl);
        this.fireFlyShape.posAttr = this.shader.posAttrLoc;
        this.fireFlyShape.normAttr = this.shader.normAttrLoc;
        
        // Setup controls.
        item = this;
        this.controls = new Controls();
        this.controls.addButton("Menu", function() {
            driver.gotoMenu();
        });
        this.controls.setFps(0.0);

        // Build random lists.
        this.trees = [];
        for (var i = 0; i < TreeCount; i++) {
            this.trees[i] = new Tree(Math.random()*6.0-3.0, Math.random()*6.0-3.0);
        }

        this.fireflies = [];
        for (var i = 0; i < FireFlyCount; i++) {
            this.fireflies[i] = new FireFly(Math.random()*6.0-3.0, Math.random()*6.0, Math.random()*6.0-3.0);
        }

        // Initialize movers.
        this.viewMover = new ViewMover();
        this.viewMover.target = [0.0, 4.0, 0.0];
        this.viewMover.up = [0.0, 1.0, 0.0];
        this.viewMover.location = [0.0, 5.0, -10.0];
        this.projMover = new ProjMover();
        this.viewMover.start(gl);
        this.projMover.start(gl);
        return true;
    };
    
    /**
     * Updates the graphical scene.
     * @param  {WebGLRenderingContext} gl  The graphical object
     * @return  {Boolean}  True if updated correctly, false on error.
     */
    Item.prototype.update = function(gl, fps) {
        this.controls.setFps(fps);
        this.viewMover.update();
        this.projMover.update();
        this.shader.setViewMat(this.viewMover.matrix());
        this.shader.setProjMat(this.projMover.matrix());


        // Update FireFlies
        for (var i = 0; i < FireFlyCount; i++) {
            this.fireflies[i].x += Math.random()*0.02-0.01;
            this.fireflies[i].y += Math.random()*0.02-0.01;
            this.fireflies[i].z += Math.random()*0.02-0.01;
        }
        
        // Clear color buffer.
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

        // Draw dark shapes.
        this.shader.setLightRange(-1.0);
        this.shader.setColor(0.1, 0.1, 0.1);
        this.shader.setLightPnt(0.0, 0.0, 0.0);
        for (var i = 0; i < TreeCount; i++) {
            this._drawTree(null, 0.0, this.trees[i]);
        }
        this._drawGround(null, 0.0);

        // Draw fireflies.
        this.shader.setLightRange(-1.0);
        this.shader.setColor(1.0, 1.0, 0.0);
        for (var i = 0; i < FireFlyCount; i++) {
            var fireFly = this.fireflies[i];
            this.shader.setLightPnt(fireFly.x, fireFly.y, fireFly.z);
            this.shader.setObjMat(Matrix.translate(fireFly.x, fireFly.y, fireFly.z));
            this.fireFlyShape.draw();
        }     

        // Draw firefly light.
        for (var i = 0; i < FireFlyCount; i++) {
            var fireFly = this.fireflies[i];
            this.shader.setLightRange(LightRadius);
            this.shader.setColor(1.0, 1.0, 1.0);
            this.shader.setLightPnt(fireFly.x, fireFly.y, fireFly.z);
            for (var j = 0; j < TreeCount; j++) {
                this._drawTree(fireFly, LightRadius, this.trees[j]);
            }
            this._drawGround(fireFly, LightRadius);
        }         
        
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

    Item.prototype._drawTree = function(fireFly, radius, tree) {
        if (fireFly) {
            var dx = fireFly.x - tree.x;
            var dz = fireFly.z - tree.z;
            if (Math.sqrt(dx*dx + dz*dz) <= radius + 0.5) {
                this.shader.setObjMat(Matrix.translate(tree.x, 0, tree.z));
                this.tree.draw();
            }
        } else {
            this.shader.setObjMat(Matrix.translate(tree.x, 0, tree.z));
            this.tree.draw();
        }
    }

    Item.prototype._drawGround = function(fireFly, radius) {
        if (fireFly) {
            if (fireFly.y - radius <= 0) {
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
