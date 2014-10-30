define(function(require) {

    var Const = require('tools/const');
    var Matrix = require('tools/matrix');
    var Vector = require('tools/vector');
    var ProjMover = require('movers/projection');
    var ObjMover = require('movers/userFocus');
    var CartoonBuilder = require('shaders/cartoon');
    var OutlineBuilder = require('shaders/outliner');
    var Txt2DBuilder = require('shaders/texture2d');
    var Controls = require('tools/controls');
    var ShapeBuilder = require('shapes/shape');
    
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
        var cartoonBuilder = new CartoonBuilder();
        this.cartoonBuilder = cartoonBuilder.build(gl);
        if (!this.cartoonBuilder) {
            return false;
        }
        this.cartoonBuilder.use();
        this.cartoonBuilder.setLightVec(-0.5, 0.5, -1.0);
        this.cartoonBuilder.setLightClr(1.0, 0.5, 1.0);
        this.cartoonBuilder.setDarkClr(0.25, 0.0, 0.25);
        this.cartoonBuilder.setSlices(3);

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
            shapeBuilder.prepare(builder, item.cartoonBuilder.requiredType|item.outlineShader.requiredType);
            var degenBuilder = item._createAdjunctShape(builder);

            item.shape = builder.build(gl, item.cartoonBuilder.requiredType);
            item.shape.posAttr.set(item.cartoonBuilder.posAttrLoc);
            item.shape.normAttr.set(item.cartoonBuilder.normAttrLoc);

            item.degenShape = degenBuilder.build(gl, item.outlineShader.requiredType);
            item.degenShape.posAttr.set(item.outlineShader.posAttrLoc);
            item.degenShape.normAttr.set(item.outlineShader.normAttrLoc);
            item.degenShape.wghtAttr.set(item.outlineShader.wghtAttrLoc);
            item.degenShape.adj1Attr.set(item.outlineShader.adj1AttrLoc);
            item.degenShape.adj2Attr.set(item.outlineShader.adj2AttrLoc);
        }, "Cube");
        this.controls.addFloat("Ambient", function(value) {
            item.cartoonBuilder.use();
            item.cartoonBuilder.setAmbient(value);
        }, 0.0, 1.0, 0.3);
        this.controls.addFloat("Diffuse", function(value) {
            item.cartoonBuilder.use();
            item.cartoonBuilder.setDiffuse(value);
        }, 0.0, 1.0, 0.5);
        this.controls.addFloat("Thickness", function(value) {
            item.outlineShader.use();
            item.outlineShader.setThickness(value);
        }, 0.0, 0.1, 0.01);
        
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
        this.cartoonBuilder.use();
        this.cartoonBuilder.setProjMat(this.projMover.matrix());
        this.cartoonBuilder.setViewMat(Matrix.identity());
        this.cartoonBuilder.setObjMat(this.objMover.matrix());
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
        var edges = new AdjSet();
        for (var i = shape.indices.length - 1; i >= 0; i--) {
            shape.indices[i].eachTri(function(i1, i2, i3) {
                edges.insert(shape.pos.get(i1), shape.norm.get(i1),
                             shape.pos.get(i2), shape.norm.get(i2),
                             shape.pos.get(i3), shape.norm.get(i3));
            });
        };
        
        // Foreach edge create a quad with the first and second copy.
        var builder = new ShapeBuilder();
        var index = 0;
        edges.foreach(function(pos1, norm1, pos2, norm2, faces) {
            var faceNorm1 = faces[0];
            var faceNorm2 = Vector.neg(faceNorm1);
            if (faces.length > 1) {
                faceNorm2 = faces[1];
            }
        
            if (!Vector.eq(faceNorm1, faceNorm2)) {
                norm1 = Vector.normal(norm1);
                norm2 = Vector.normal(norm2);
            
                //console.log("("+pos1+") ("+pos2+") ("+faceNorm1+") ("+faceNorm2+")");
        
                builder.pos.add(pos1);
                builder.norm.add(norm1);
                builder.adj1.add(faceNorm1);
                builder.adj2.add(faceNorm2);
                builder.wght.add(0.0);
                
                builder.pos.add(pos2);
                builder.norm.add(norm2);
                builder.adj1.add(faceNorm1);
                builder.adj2.add(faceNorm2);
                builder.wght.add(0.0);
                
                builder.pos.add(pos2);
                builder.norm.add(norm2);
                builder.adj1.add(faceNorm1);
                builder.adj2.add(faceNorm2);
                builder.wght.add(1.0);
                
                builder.pos.add(pos1);
                builder.norm.add(norm1);
                builder.adj1.add(faceNorm1);
                builder.adj2.add(faceNorm2);
                builder.wght.add(1.0);
            
                builder.quads.add(index, index+1, index+2, index+3);
                index += 4;
            }
        });
        return builder;
    };
    
    //======================================================================
    
    /**
     * TODO: Comment
     */
    function AdjPoint(pos, norm) {
        this.pos = pos;
        this.norm = norm;
    }
    
    /**
     * TODO: Comment
     */
    AdjPoint.prototype.merge = function(other, epsilon) {
        if (Vector.eq(this.pos, other.pos, epsilon)) {
            this.norm = Vector.add(this.norm, other.norm);
            return true;
        }
        return false;
    };
    
    /**
     * TODO: Comment
     */
    function AdjEdge(index1, index2, faceNorm) {
        this.index1 = index1;
        this.index2 = index2;
        this.faces = [ faceNorm ];
    }
    
    /**
     * TODO: Comment
     */
    AdjEdge.prototype.merge = function(other) {
        if (this.index1 === other.index1) {
            if (this.index2 === other.index2) {
                for (var i = 0; i < other.faces.length; i++) {
                    this.faces.push(other.faces[i]);
                }
                return true;
            }
        } else if (this.index1 === other.index2) {
            if (this.index2 === other.index1) {
                for (var i = 0; i < other.faces.length; i++) {
                    this.faces.push(other.faces[i]);
                }
                return true;
            }
        }
        return false;
    };
    
    /**
     * TODO: Comment
     */
    function AdjSet() {
        this._points = [];
        this._edges = [];
    }
    
    /**
     * TODO: Comment
     */
    AdjSet.prototype.insert = function(pos1, norm1, pos2, norm2, pos3, norm3) {
        norm1 = Vector.normal(norm1);
        norm2 = Vector.normal(norm2);
        norm3 = Vector.normal(norm3);
        var dpos2 = Vector.sub(pos1, pos2);
        var dpos3 = Vector.sub(pos3, pos2);
        var faceNorm = Vector.normal(Vector.cross(dpos2, dpos3));
        var index1 = this._insertPoint(pos1, norm1);
        var index2 = this._insertPoint(pos2, norm2);
        var index3 = this._insertPoint(pos3, norm3);
        this._insertEdge(index1, index2, faceNorm);
        this._insertEdge(index2, index3, faceNorm);
        this._insertEdge(index3, index1, faceNorm);
    };
    
    /**
     * TODO: Comment
     */
    AdjSet.prototype._insertPoint = function(pos, norm) {
        var adj = new AdjPoint(pos, norm);
        for (var i = 0; i < this._points.length; i++) {
            if (this._points[i].merge(adj)) {
                return i;
            }
        }
        this._points.push(adj);
        return this._points.length-1;
    };
    
    /**
     * TODO: Comment
     */
    AdjSet.prototype._insertEdge = function(index1, index2, faceNorm) {
        var adj = new AdjEdge(index1, index2, faceNorm);
        for (var i = 0; i < this._edges.length; i++) {
            if (this._edges[i].merge(adj)) {
                return i;
            }
        }
        this._edges.push(adj);
        return this._points.length-1;
    };
    
    /**
     * TODO: Comment
     */
    AdjSet.prototype.foreach = function(callBack) {
        for (var i = 0; i < this._edges.length; i++) {
            var edge = this._edges[i];
            var pnt1 = this._points[edge.index1];
            var pnt2 = this._points[edge.index2];
            callBack(pnt1.pos, pnt1.norm, pnt2.pos, pnt2.norm, edge.faces);
        }
    };
   
    return Item;
});
