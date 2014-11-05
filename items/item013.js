define(function(require) {

    var Const = require('tools/const');
    var Matrix = require('tools/matrix');
    var Vector = require('tools/vector');
    var ProjMover = require('movers/projection');
    var ViewMover = require('movers/userFocus');
    var Controls = require('tools/controls');
    var ShapeBuilder = require('shapes/shape');
    var ShaderBuilder = require('shaders/frame');
    
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
    Item.prototype.name = 'Data View';

    /**
     * Starts this item for rendering.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {Driver} driver  The driver running this item.
     * @return  {Boolean}  True if successfully started, false otherwise.
     */
    Item.prototype.start = function(gl, driver) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.depthFunc(gl.LEQUAL);
        
        // Build and set the shader.
        var shaderBuilder = new ShaderBuilder();
        this.shader = shaderBuilder.build(gl);
        if (!this.shader) {
            return false;
        }
        this.shader.use();
        this.shader.setFogClr(0.0, 0.0, 0.0);
        this.shader.setFogStart(0.5);
        this.shader.setFogStop(3.5);
        this.shader.setObjMat(Matrix.identity());
        
        // Setup controls.
        item = this;
        this.controls = new Controls();
        this.controls.addButton("Menu", function() {
            driver.gotoMenu();
        });
        this.controls.setFps(0.0);
        this.controls.addShapeSelect("Shape", function(shapeBuilder) {
            item._createShapes(gl, shapeBuilder);
        }, "Toroid");
        this.controls.addBool("Transparent", function(value) {
            item.drawTransparent = value;
        }, true);
        this.controls.addBool("Depth", function(value) {
            if (value) {
                item.shader.setUseDepth(1.0);
            } else {
                item.shader.setUseDepth(0.0);
            }
        }, true);
        this.controls.addBool("Solid", function(value) {
            item.drawSolid = value;
        }, true);
        this.controls.addBool("Color", function(value) {
            item.drawClr = value;
        }, false);
        this.controls.addBool("Texture", function(value) {
            item.drawTxt = value;
        }, false);
        this.controls.addBool("Wireframe", function(value) {
            item.drawFrame = value;
        }, false);
        this.controls.addBool("Points", function(value) {
            item.drawPnts = value;
        }, false);
        this.controls.addBool("Normals", function(value) {
            item.drawNorm = value;
        }, false);
        this.controls.addBool("Bi-Normals", function(value) {
            item.drawBinm = value;
        }, false);
        this.controls.addBool("Cube", function(value) {
            item.drawCube = value;
        }, false);

        // Initialize movers.
        this.projMover = new ProjMover();
        this.viewMover = new ViewMover();
        this.projMover.start(gl);
        this.viewMover.start(gl);
        return true;
    };

    /**
     * TODO: Comment
     */
    Item.prototype._createShapes = function(gl, shapeBuilder) {
        // Solid shape.
        var builderSolid = new ShapeBuilder();
        shapeBuilder.prepare(builderSolid, Const.POS);
        for (var i = builderSolid.pos.count() - 1; i >= 0; i--) {
            builderSolid.clr3.add(0.8, 0.8, 0.8);
        }
        this.shapeSolid = builderSolid.build(gl, this.shader.requiredType)
        this.shapeSolid.posAttr.set(this.shader.posAttrLoc);
        this.shapeSolid.clr3Attr.set(this.shader.clr3AttrLoc);

        // Color shape.
        this.shapeClr = shapeBuilder.build(gl, this.shader.requiredType);
        this.shapeClr.posAttr.set(this.shader.posAttrLoc);
        this.shapeClr.clr3Attr.set(this.shader.clr3AttrLoc);

        // 2D texture shape.
        var builderTxt = new ShapeBuilder();
        shapeBuilder.prepare(builderTxt, Const.POS|Const.TXT);
        for (var i = 0; i < builderTxt.pos.count(); i++) {
            var txt = builderTxt.txt.get(i);
            builderTxt.clr3.add(txt[0], 0.5, txt[1]);
        }
        this.shapeTxt = builderTxt.build(gl, this.shader.requiredType);
        this.shapeTxt.posAttr.set(this.shader.posAttrLoc);
        this.shapeTxt.clr3Attr.set(this.shader.clr3AttrLoc);

        // Wire-frame shape.
        var builderFrame = new ShapeBuilder();
        shapeBuilder.prepare(builderFrame, Const.POS);
        for (var i = builderFrame.pos.count() - 1; i >= 0; i--) {
            builderFrame.clr3.add(1.0, 1.0, 1.0);
        }
        builderFrame = builderFrame.createWireFrame();
        this.shapeFrame = builderFrame.build(gl, this.shader.requiredType);
        this.shapeFrame.posAttr.set(this.shader.posAttrLoc);
        this.shapeFrame.clr3Attr.set(this.shader.clr3AttrLoc);

        // Points shape.
        var builderPnts = new ShapeBuilder();
        shapeBuilder.prepare(builderPnts, Const.POS);
        for (var i = builderPnts.pos.count() - 1; i >= 0; i--) {
            builderPnts.clr3.add(1.0, 1.0, 1.0);
        }
        builderPnts = builderPnts.createPoints();
        this.shapePnts = builderPnts.build(gl, this.shader.requiredType);
        this.shapePnts.posAttr.set(this.shader.posAttrLoc);
        this.shapePnts.clr3Attr.set(this.shader.clr3AttrLoc);

        // Normal shape.
        var builderNorm = new ShapeBuilder();
        shapeBuilder.prepare(builderNorm, Const.POS|Const.NORM);
        for (var i = 0; i < builderNorm.pos.count(); i++) {
            //builderNorm.clr3.add(builderNorm.norm.get(i));
            builderNorm.clr3.add(1.0, 1.0, 1.0);
        }
        builderNorm = builderNorm.createDegeneratePoints();
        for (var i = builderNorm.pos.count() - 1; i >= 0; i--) {
            if (builderNorm.wght.get(i) > 0.5) {
                builderNorm.pos.set(i, Vector.add(builderNorm.pos.get(i),
                    Vector.scale(builderNorm.norm.get(i), 0.05)));
            }
        }
        this.shapeNorm = builderNorm.build(gl, this.shader.requiredType);
        this.shapeNorm.posAttr.set(this.shader.posAttrLoc);
        this.shapeNorm.clr3Attr.set(this.shader.clr3AttrLoc);

        // Bi-normal shape.
        var builderBinm = new ShapeBuilder();
        shapeBuilder.prepare(builderBinm, Const.POS|Const.BINM);
        for (var i = 0; i < builderBinm.pos.count(); i++) {
            //builderBinm.clr3.add(builderBinm.binm.get(i));
            builderBinm.clr3.add(1.0, 1.0, 1.0);
        }
        builderBinm = builderBinm.createDegeneratePoints();
        for (var i = builderBinm.pos.count() - 1; i >= 0; i--) {
            if (builderBinm.wght.get(i) > 0.5) {
                builderBinm.pos.set(i, Vector.add(builderBinm.pos.get(i),
                    Vector.scale(builderBinm.binm.get(i), 0.05)));
            }
        }
        this.shapeBinm = builderBinm.build(gl, this.shader.requiredType);
        this.shapeBinm.posAttr.set(this.shader.posAttrLoc);
        this.shapeBinm.clr3Attr.set(this.shader.clr3AttrLoc);

        // Cube texture map shape.
        var builderCube = new ShapeBuilder();
        shapeBuilder.prepare(builderCube, Const.POS|Const.CUBE);
        for (var i = 0; i < builderCube.pos.count(); i++) {
            //builderCube.clr3.add(builderCube.cube.get(i));
            builderCube.clr3.add(1.0, 1.0, 1.0);
        }
        builderCube = builderCube.createDegeneratePoints();
        for (var i = builderCube.pos.count() - 1; i >= 0; i--) {
            if (builderCube.wght.get(i) > 0.5) {
                builderCube.pos.set(i, Vector.add(builderCube.pos.get(i),
                    Vector.scale(builderCube.cube.get(i), 0.05)));
            }
        }
        this.shapeCube = builderCube.build(gl, this.shader.requiredType);
        this.shapeCube.posAttr.set(this.shader.posAttrLoc);
        this.shapeCube.clr3Attr.set(this.shader.clr3AttrLoc);
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
        this.shader.setProjMat(this.projMover.matrix());
        this.shader.setViewMat(this.viewMover.matrix());
        
        // Clear color buffer.
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

        // Draw shapes.
        if (this.drawSolid) {
            if (this.drawTransparent) {
                gl.clear(gl.DEPTH_BUFFER_BIT);
            }
            this.shapeSolid.draw();
        }
        if (this.drawClr) {
            if (this.drawTransparent) {
                gl.clear(gl.DEPTH_BUFFER_BIT);
            }
            this.shapeClr.draw();
        }
        if (this.drawTxt) {
            if (this.drawTransparent) {
                gl.clear(gl.DEPTH_BUFFER_BIT);
            }
            this.shapeTxt.draw();
        }
        if (this.drawFrame) {
            if (this.drawTransparent) {
                gl.clear(gl.DEPTH_BUFFER_BIT);
            }
            this.shapeFrame.draw();
        }
        if (this.drawPnts) {
            if (this.drawTransparent) {
                gl.clear(gl.DEPTH_BUFFER_BIT);
            }
            this.shapePnts.draw();
        }
        if (this.drawNorm) {
            if (this.drawTransparent) {
                gl.clear(gl.DEPTH_BUFFER_BIT);
            }
            this.shapeNorm.draw();
        }
        if (this.drawBinm) {
            if (this.drawTransparent) {
                gl.clear(gl.DEPTH_BUFFER_BIT);
            }
            this.shapeBinm.draw();
        }
        if (this.drawCube) {
            if (this.drawTransparent) {
                gl.clear(gl.DEPTH_BUFFER_BIT);
            }
            this.shapeCube.draw();
        }
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
