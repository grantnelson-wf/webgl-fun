define(function(require) {

    var Const = require('tools/const');
    var Matrix = require('tools/matrix');
    var ViewMover = require('movers/userFocus');
    var ProjMover = require('movers/projection');
    var ShapeBuilder = require('shapes/shape');
    var ShaderBuilder = require('shaders/pointLights');
    var CylinderBuilder = require('shapes/cylinder');
    var GridBuilder = require('shapes/grid');
    var Controls = require('tools/controls');
    var Txt2D = require('tools/texture2d');
    
    /**
     * Clamps the given value to a range.
     * @param  {Number} val  The value to clamp.
     * @param  {Number} min  The minimum value to clamp to.
     * @param  {Number} max  The maximum value to clamp to.
     * @return  {Number}  The resulting clamped value.
     */
    function clamp(val, min, max) {
        if (val < min) {
            return min;
        } else if (val > max) {
            return max;
        } else {
            return val;
        }
    }

    // The maximum (negative is the minimum) impulse value that can be applied to a firefly.
    var FireFlyDdmax = 0.00001;
    
    // The maximum (negative is the minimum) velocity value that can be applied to a firefly.
    var FireFlyDmax  = 0.0005;

    /**
     * The firefly particle.
     */
    function FireFly() {
        this.cx = Math.random()*20.0 - 10.0;
        this.cy = Math.random()* 9.9 +  0.1;
        this.cz = Math.random()*20.0 - 10.0;
        this.x  = Math.random()*20.0 - 10.0;
        this.y  = Math.random()*10.0;
        this.z  = Math.random()*15.0 -  5.0;
        this.dx = (Math.random()*2.0 - 1.0)*FireFlyDmax;
        this.dy = (Math.random()*2.0 - 1.0)*FireFlyDmax;
        this.dz = (Math.random()*2.0 - 1.0)*FireFlyDmax;
        this.r  = Math.random();
        this.g  = Math.random();
        this.b  = Math.random();
        this.lit = 0;
        this.litStep = 0.0;
        this.litDur = (Math.random()*3.0 + 1.0) * 1000;
        this.litVal = 0.0;
    }
    
    /**
     * Updates the firefly's position and lighting information for the render frame.
     * @param  {number} dt  The delta time between this frame and the last time, in milliseconds.
     */
    FireFly.prototype.update = function(dt) {
        var ddx = (Math.random()*2.0 - 1.0 + (this.cx-this.x)*0.1)*FireFlyDdmax;
        var ddy = (Math.random()*2.0 - 1.0 + (this.cy-this.y)*0.1)*FireFlyDdmax;
        var ddz = (Math.random()*2.0 - 1.0 + (this.cz-this.z)*0.1)*FireFlyDdmax;
        this.dx = clamp(this.dx + dt*ddx, -FireFlyDmax, FireFlyDmax);
        this.dy = clamp(this.dy + dt*ddy, -FireFlyDmax, FireFlyDmax);
        this.dz = clamp(this.dz + dt*ddz, -FireFlyDmax, FireFlyDmax);
        this.x  = clamp(this.x  + dt*this.dx, -10.0, 10.0);
        this.y  = clamp(this.y  + dt*this.dy,   0.1,  9.9);
        this.z  = clamp(this.z  + dt*this.dz,  -5.0, 15.0); 

        this.litStep += dt;
        if (this.litDur < this.litStep) {
            this.litStep = 0.0;
            ++this.lit;
            if (this.lit == 1) {
                this.litDur = (Math.random()*3.0 + 1.0) * 1000;
                this.litVal = 0.0;
            } else if (this.lit == 2) {
                this.litDur = (Math.random()*5.0 + 0.1) * 1000;
                this.litVal = 1.0;
            } else if (this.lit == 3) {
                this.litDur = (Math.random()*3.0 + 1.0) * 1000;
                this.litVal = 1.0;
            } else {
                this.lit = 0;
                this.litDur = (Math.random()*5.0 + 0.1) * 1000;
                this.litVal = 0.0;
            }
        } else if (this.lit == 1) {
            this.litVal = clamp(this.litStep/this.litDur, 0.0, 1.0);
        } else if (this.lit == 3) {
            this.litVal = clamp(1.0 - this.litStep/this.litDur, 0.0, 1.0);
        }
    };
    
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
    var MaxTreeCount = 50;
    
    // The maximum firefly count.
    var MaxFireFlyCount = 200;
    
    // The maximum fireflies light radius.
    var MaxLightRadius = 15.0;

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
        this.shader.setBumpSampler(1);
        gl.depthFunc(gl.LEQUAL);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.enable(gl.BLEND);

        // Setup tree shape.
        var cylinderBuilder = new CylinderBuilder();
        cylinderBuilder.closedTop = false;
        cylinderBuilder.closedBottom = false;
        cylinderBuilder.topRadius = 0.5;
        cylinderBuilder.bottomRadius = 0.6;
        cylinderBuilder.topHeight = 15.0;
        cylinderBuilder.bottomHeight = 0.0;
        cylinderBuilder.sideCount = 10;
        this.tree = cylinderBuilder.build(gl, this.shader.requiredType);
        this.tree.posAttr.set(this.shader.posAttrLoc);
        this.tree.normAttr.set(this.shader.normAttrLoc);
        this.tree.binmAttr.set(this.shader.binmAttrLoc);
        this.tree.txtAttr.set(this.shader.txtAttrLoc);

        // Setup ground shape.
        var gridBuilder = new GridBuilder();
        gridBuilder.width = -40;
        gridBuilder.depth = 40;
        gridBuilder.widthDiv = 1;
        gridBuilder.depthDiv = 1;
        gridBuilder.z = 10;
        this.ground = gridBuilder.build(gl, this.shader.requiredType);
        this.ground.posAttr.set(this.shader.posAttrLoc);
        this.ground.normAttr.set(this.shader.normAttrLoc);
        this.ground.binmAttr.set(this.shader.binmAttrLoc);
        this.ground.txtAttr.set(this.shader.txtAttrLoc);

        // Setup firefly shape.
        var shape = new ShapeBuilder();
        shape.pos.add(0.0, 0.0, 0.0);
        shape.norm.add(1.0, 0.0, 0.0);
        shape.txt.add(0.0, 0.0);
        shape.binm.add(0.0, 0.0, 1.0);
        shape.addPointIndex(0);
        this.fireFlyShape = shape.build(gl);
        this.fireFlyShape.posAttr.set(this.shader.posAttrLoc);
        this.fireFlyShape.normAttr.set(this.shader.normAttrLoc);
        this.fireFlyShape.binmAttr.set(this.shader.binmAttrLoc);
        this.fireFlyShape.txtAttr.set(this.shader.txtAttrLoc);
        
        // Load textures
        this.treeTxt = new Txt2D(gl);
        this.treeTxt.index = 0;
        this.treeTxt.loadFromFile('./data/textures/bark.jpg');
        this.treeBump = new Txt2D(gl);
        this.treeBump.index = 1;
        this.treeBump.loadFromFile('./data/bumpmaps/bark.jpg');
        this.groundTxt = new Txt2D(gl);
        this.groundTxt.index = 0;
        this.groundTxt.loadFromFile('./data/textures/grass.jpg');
        this.groundBump = new Txt2D(gl);
        this.groundBump.index = 1;
        this.groundBump.loadFromFile('./data/bumpmaps/concrete.jpg');
        
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
        }, 0, MaxFireFlyCount, 30);
        this.controls.addFloat("Light Radius", function(value) {
            item.lightRadius = value;
        }, 0.1, MaxLightRadius, 2.5);
        this.controls.addFloat("Brightness", function(value) {
            item.brightness = value;
        }, 0.0, 1.0, 0.7);
        this.controls.addBool("Colors", function(value) {
            item.useColors = value;
        }, false);
        
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
        this.viewMover = new ViewMover();
        this.viewMover.target   = [0.0, 4.0,   0.0];
        this.viewMover.up       = [0.0, 1.0,   0.0];
        this.viewMover.location = [0.0, 5.0, -10.0];
        this.viewMover.maxPitch = Math.PI * 0.125;
        this.viewMover.minPitch = -Math.PI * 0.25;
        this.viewMover.start(gl);
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
        this.viewMover.update();
        this.projMover.update();
        this.shader.setViewMat(this.viewMover.matrix());
        this.shader.setProjMat(this.projMover.matrix());

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

        // Draw fireFlies.
        this.shader.setLightRange(-1.0);
        for (var i = 0; i < this.fireFlyCount; i++) {
            var fireFly = this.fireflies[i];
            if (fireFly.lit > 0) {
                var scalar = fireFly.litVal*this.brightness;
                if (this.useColors) {
                    this.shader.setColor( fireFly.r*scalar, fireFly.g*scalar, fireFly.b*scalar);
                } else {
                    this.shader.setColor(scalar, scalar, scalar);
                }
                this.shader.setLightPnt(fireFly.x, fireFly.y, fireFly.z);
                this.shader.setObjMat(Matrix.translate(fireFly.x, fireFly.y, fireFly.z));
                this.fireFlyShape.draw();
            }
        }     

        // Draw fireFly light.
        for (var i = 0; i < this.fireFlyCount; i++) {
            var fireFly = this.fireflies[i];
            if (fireFly.lit > 0) {
                this.shader.setLightRange(this.lightRadius);
                var scalar = fireFly.litVal*this.brightness;
                if (this.useColors) {
                    this.shader.setColor( fireFly.r*scalar, fireFly.g*scalar, fireFly.b*scalar);
                } else {
                    this.shader.setColor(scalar, scalar, scalar);
                }
                this.shader.setLightPnt(fireFly.x, fireFly.y, fireFly.z);
                this.treeTxt.bind();
                this.treeBump.bind();
                for (var j = 0; j < this.treeCount; j++) {
                    this._drawTree(fireFly, this.lightRadius, this.trees[j]);
                }
                this.groundTxt.bind();
                this.groundBump.bind();
                this._drawGround(fireFly);
            }
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

    /**
     * Draws a tree lit by a firefly's light.
     * @param  {FireFly} fireFly  The firefly to light the tree with.
     * @param  {Number} radius  The radius of the light from the firefly.
     * @param  {Tree} tree  The tree to draw.
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
