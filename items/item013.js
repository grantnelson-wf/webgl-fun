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
     * This creates all the shapes used for rendering.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {ShapeBuilder} shapeBuilder  The builder for the shape to create.
     */
    Item.prototype._createShapes = function(gl, shapeBuilder) {
        var builder;
        var i;

        // Solid shape.
        builder = new ShapeBuilder();
        shapeBuilder.prepare(builder, Const.POS);
        for (i = builder.pos.count() - 1; i >= 0; i--) {
            builder.clr3.add(0.8, 0.8, 0.8);
        }
        this.shapeSolid = builder.build(gl, this.shader.requiredType);
        this.shapeSolid.posAttr.set(this.shader.posAttrLoc);
        this.shapeSolid.clr3Attr.set(this.shader.clr3AttrLoc);

        // Color shape.
        this.shapeClr = shapeBuilder.build(gl, this.shader.requiredType);
        this.shapeClr.posAttr.set(this.shader.posAttrLoc);
        this.shapeClr.clr3Attr.set(this.shader.clr3AttrLoc);

        // 2D texture shape.
        builder = new ShapeBuilder();
        shapeBuilder.prepare(builder, Const.POS|Const.TXT);
        for (i = 0; i < builder.pos.count(); i++) {
            var txt = builder.txt.get(i);
            builder.clr3.add(txt[0], 0.5, txt[1]);
        }
        this.shapeTxt = builder.build(gl, this.shader.requiredType);
        this.shapeTxt.posAttr.set(this.shader.posAttrLoc);
        this.shapeTxt.clr3Attr.set(this.shader.clr3AttrLoc);

        // Wire-frame shape.
        builder = new ShapeBuilder();
        shapeBuilder.prepare(builder, Const.POS);
        for (i = builder.pos.count() - 1; i >= 0; i--) {
            builder.clr3.add(1.0, 1.0, 1.0);
        }
        builder = builder.createWireFrame();
        this.shapeFrame = builder.build(gl, this.shader.requiredType);
        this.shapeFrame.posAttr.set(this.shader.posAttrLoc);
        this.shapeFrame.clr3Attr.set(this.shader.clr3AttrLoc);

        // Points shape.
        builder = new ShapeBuilder();
        shapeBuilder.prepare(builder, Const.POS);
        for (i = builder.pos.count() - 1; i >= 0; i--) {
            builder.clr3.add(1.0, 1.0, 1.0);
        }
        builder = builder.createPoints();
        this.shapePnts = builder.build(gl, this.shader.requiredType);
        this.shapePnts.posAttr.set(this.shader.posAttrLoc);
        this.shapePnts.clr3Attr.set(this.shader.clr3AttrLoc);

        // Normal shape.
        builder = new ShapeBuilder();
        shapeBuilder.prepare(builder, Const.POS|Const.NORM);
        for (i = 0; i < builder.pos.count(); i++) {
            //builder.clr3.add(builder.norm.get(i));
            builder.clr3.add(1.0, 1.0, 1.0);
        }
        builder = builder.createDegeneratePoints();
        for (i = builder.pos.count() - 1; i >= 0; i--) {
            if (builder.wght.get(i) > 0.5) {
                builder.pos.set(i, Vector.add(builder.pos.get(i),
                    Vector.scale(builder.norm.get(i), 0.05)));
            }
        }
        this.shapeNorm = builder.build(gl, this.shader.requiredType);
        this.shapeNorm.posAttr.set(this.shader.posAttrLoc);
        this.shapeNorm.clr3Attr.set(this.shader.clr3AttrLoc);

        // Bi-normal shape.
        builder = new ShapeBuilder();
        shapeBuilder.prepare(builder, Const.POS|Const.BINM);
        for (i = 0; i < builder.pos.count(); i++) {
            //builder.clr3.add(builder.binm.get(i));
            builder.clr3.add(1.0, 1.0, 1.0);
        }
        builder = builder.createDegeneratePoints();
        for (i = builder.pos.count() - 1; i >= 0; i--) {
            if (builder.wght.get(i) > 0.5) {
                builder.pos.set(i, Vector.add(builder.pos.get(i),
                    Vector.scale(builder.binm.get(i), 0.05)));
            }
        }
        this.shapeBinm = builder.build(gl, this.shader.requiredType);
        this.shapeBinm.posAttr.set(this.shader.posAttrLoc);
        this.shapeBinm.clr3Attr.set(this.shader.clr3AttrLoc);

        // Cube texture map shape.
        builder = new ShapeBuilder();
        shapeBuilder.prepare(builder, Const.POS|Const.CUBE);
        for (i = 0; i < builder.pos.count(); i++) {
            //builder.clr3.add(builder.cube.get(i));
            builder.clr3.add(1.0, 1.0, 1.0);
        }
        builder = builder.createDegeneratePoints();
        for (i = builder.pos.count() - 1; i >= 0; i--) {
            if (builder.wght.get(i) > 0.5) {
                builder.pos.set(i, Vector.add(builder.pos.get(i),
                    Vector.scale(builder.cube.get(i), 0.05)));
            }
        }
        this.shapeCube = builder.build(gl, this.shader.requiredType);
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
