define(function(require) {

    var Const = require('tools/const');
    var Matrix = require('tools/matrix');
    var Vector = require('tools/vector');
    var ProjMover = require('movers/projection');
    var ObjMover = require('movers/userFocus');
    var SketchBuilder = require('shaders/sketch');
    var OutlineBuilder = require('shaders/outliner');
    var Txt2DBuilder = require('shaders/texture2d');
    var Controls = require('tools/controls');
    var Txt2D = require('tools/texture2d');
    var ShapeBuilder = require('shapes/shape');
    var Buffers = require('shapes/buffers');
    
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
    Item.prototype.name = 'Sketch';
    
    /**
     * Starts this item for rendering.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {Driver} driver  The driver running this item.
     * @return  {Boolean}  True if successfully started, false otherwise.
     */
    Item.prototype.start = function(gl, driver) {
        gl.clearColor(1.0, 1.0, 1.0, 1.0);

        // Build and set the shaders.
        var sketchBuilder = new SketchBuilder();
        this.sketchShader = sketchBuilder.build(gl);
        if (!this.sketchShader) {
            return false;
        }
        this.sketchShader.use();
        this.sketchShader.setLightVec(-0.5, 0.5, -1.0);

        var outlineBuilder = new OutlineBuilder();
        this.outlineShader = outlineBuilder.build(gl);
        if (!this.outlineShader) {
            return false;
        }
        this.outlineShader.use();
        this.outlineShader.setColor(0.0, 0.0, 0.0);

        // Setup controls.
        item = this;
        this.controls = new Controls();
        this.controls.addButton("Menu", function() {
            driver.gotoMenu();
        });
        this.controls.setFps(0.0);
        this.controls.addShapeSelect("Shape", function(shapeBuilder) {
            var builder = new ShapeBuilder();
            shapeBuilder.prepare(builder, item.sketchShader.requiredType|item.outlineShader.requiredType);
            var degenBuilder = item._createAdjunctShape(builder);

            item.shape = builder.build(gl, item.sketchShader.requiredType);
            item.shape.posAttr.set(item.sketchShader.posAttrLoc);
            item.shape.normAttr.set(item.sketchShader.normAttrLoc);
            item.shape.txtAttr.set(item.sketchShader.txtAttrLoc);

            item.degenShape = degenBuilder.build(gl, item.outlineShader.requiredType);
            item.degenShape.posAttr.set(item.outlineShader.posAttrLoc);
            item.degenShape.normAttr.set(item.outlineShader.normAttrLoc);
            item.degenShape.wghtAttr.set(item.outlineShader.wghtAttrLoc);
            item.degenShape.adj1Attr.set(item.outlineShader.adj1AttrLoc);
            item.degenShape.adj2Attr.set(item.outlineShader.adj2AttrLoc);
        }, "Cube");
        this.controls.addFloat("Ambient", function(value) {
            item.sketchShader.use();
            item.sketchShader.setAmbient(value);
        }, 0.0, 1.0, 0.3);
        this.controls.addFloat("Diffuse", function(value) {
            item.sketchShader.use();
            item.sketchShader.setDiffuse(value);
        }, 0.0, 1.0, 0.5);
        this.controls.addFloat("Thickness", function(value) {
            item.outlineShader.use();
            item.outlineShader.setThickness(value);
        }, 0.0, 0.1, 0.01);
        
        this.txt2D = new Txt2D(gl);
        this.txt2D.index = 0;
        this.txt2D.loadFromFile('./data/textures/sketch.jpg');
        
        // Initialize movers.
        this.projMover = new ProjMover();
        this.objMover = new ObjMover();
        this.projMover.start(gl);
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
        this.objMover.update();
        
        // Clear color buffer.
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

        // Draw sketch.
        this.sketchShader.use();
        this.sketchShader.setProjMat(this.projMover.matrix());
        this.sketchShader.setViewMat(Matrix.identity());
        this.sketchShader.setObjMat(this.objMover.matrix());
        this.txt2D.bind();
        this.shape.draw();

        // Draw outline.
        this.outlineShader.use();
        gl.disable(gl.CULL_FACE);
        this.outlineShader.setProjMat(this.projMover.matrix());
        this.outlineShader.setViewMat(Matrix.identity());
        this.outlineShader.setObjMat(this.objMover.matrix());
        this.degenShape.draw();
        gl.enable(gl.CULL_FACE);
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
    
    /**
     * TODO: Comment
     * @param  {Shape} shape  The shape
     * @return {[type]} [description]
     */
    Item.prototype._createAdjunctShape = function(shape) {
        // Collect all edges in the shape.
        var edges = new Buffers.EdgeIndexSet();
        for (var i = shape.indices.length - 1; i >= 0; i--) {
            shape.indices[i].eachTri(function(i1, i2, i3) {
                edges.insert(i1, i2, i3);
            });
        };
        
        // Foreach edge create a quad with the first and second copy.
        var builder = new ShapeBuilder();
        var index = 0;
        edges.foreach(function(i1, i2, adjs) {
            var i3 = adjs[0][0];
            var sign3 = adjs[0][1];
            var i4 = i3;
            var sign4 = -sign3;
            if (adjs.length > 1) {
                i4 = adjs[1][0];
                sign4 = adjs[1][1];
            }
            
            // Calculate the face normals.
            var pos1 = shape.pos.get(i1);
            var pos2 = shape.pos.get(i2);
            var pos3 = shape.pos.get(i3);
            var pos4 = shape.pos.get(i4);
            var dpos2 = Vector.sub(pos2, pos1);
            var dpos3 = Vector.scale(Vector.sub(pos3, pos1), -sign3);
            var dpos4 = Vector.scale(Vector.sub(pos4, pos1), -sign4);
            var norm1 = Vector.normal(shape.norm.get(i1));
            var norm2 = Vector.normal(shape.norm.get(i2));
            var norm3 = Vector.normal(Vector.cross(dpos2, dpos3));
            var norm4 = Vector.normal(Vector.cross(dpos2, dpos4));
            
            //console.log("("+i1+"), ("+i2+"), ("+i3+":"+sign3+"), ("+i4+":"+sign4+") : ("+
            //    pos1+"), ("+pos2+"), ("+norm1+"), ("+norm2+"), ("+norm3+"), ("+norm4+")");
            
            if (!Vector.eq(norm3, norm4)) {    
                builder.pos.add(pos1);
                builder.norm.add(norm1);
                builder.adj1.add(norm3);
                builder.adj2.add(norm4);
                builder.wght.add(0.0);
                
                builder.pos.add(pos2);
                builder.norm.add(norm2);
                builder.adj1.add(norm3);
                builder.adj2.add(norm4);
                builder.wght.add(0.0);
                
                builder.pos.add(pos2);
                builder.norm.add(norm2);
                builder.adj1.add(norm3);
                builder.adj2.add(norm4);
                builder.wght.add(1.0);
                
                builder.pos.add(pos1);
                builder.norm.add(norm1);
                builder.adj1.add(norm3);
                builder.adj2.add(norm4);
                builder.wght.add(1.0);
            
                builder.quads.add(index, index+1, index+2, index+3);
                index += 4;
            }
        });
        return builder;
    };
    
    return Item;
});
