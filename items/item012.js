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
        this.cartoonShader = cartoonBuilder.build(gl);
        if (!this.cartoonShader) {
            return false;
        }
        this.cartoonShader.use();
        this.cartoonShader.setLightVec(-0.5, 0.5, -1.0);

        var outlineBuilder = new OutlineBuilder();
        this.outlineShader = outlineBuilder.build(gl);
        if (!this.outlineShader) {
            return false;
        }
        this.outlineShader.use();
        this.outlineShader.setEdgeLimit(0.0001);

        // Setup controls.
        item = this;
        this.controls = new Controls();
        this.controls.addButton("Menu", function() {
            driver.gotoMenu();
        });
        this.controls.setFps(0.0);
        this.controls.addShapeSelect("Shape", function(shapeBuilder) {
            var builder = new ShapeBuilder();
            shapeBuilder.prepare(builder, item.cartoonShader.requiredType|item.outlineShader.requiredType);
            var degenBuilder = item._createAdjunctShape(builder);

            item.shape = builder.build(gl, item.cartoonShader.requiredType);
            item.shape.posAttr.set(item.cartoonShader.posAttrLoc);
            item.shape.normAttr.set(item.cartoonShader.normAttrLoc);

            item.degenShape = degenBuilder.build(gl, item.outlineShader.requiredType);
            item.degenShape.posAttr.set(item.outlineShader.posAttrLoc);
            item.degenShape.normAttr.set(item.outlineShader.normAttrLoc);
            item.degenShape.wghtAttr.set(item.outlineShader.wghtAttrLoc);
            item.degenShape.adj1Attr.set(item.outlineShader.adj1AttrLoc);
            item.degenShape.adj2Attr.set(item.outlineShader.adj2AttrLoc);
        }, "Cube");
        this.controls.addFloat("Ambient", function(value) {
            item.cartoonShader.use();
            item.cartoonShader.setAmbient(value);
        }, 0.0, 1.0, 0.3);
        this.controls.addFloat("Diffuse", function(value) {
            item.cartoonShader.use();
            item.cartoonShader.setDiffuse(value);
        }, 0.0, 1.0, 0.5);
        this.controls.addInt("Slices", function(value) {
            item.cartoonShader.use();
            item.cartoonShader.setSlices(value);
        }, 1, 50, 3);
        this.controls.addRGB("Light Color", function(r, g, b) {
            item.cartoonShader.use();
            item.cartoonShader.setLightClr(r, g, b);
        }, 0.5, 1.0, 1.0);
        this.controls.addRGB("Dark Color", function(r, g, b) {
            item.cartoonShader.use();
            item.cartoonShader.setDarkClr(r, g, b);
        }, 0.0, 0.25, 0.25);
        this.controls.addFloat("Thickness", function(value) {
            item.outlineShader.use();
            item.outlineShader.setThickness(value);
        }, 0.0, 0.1, 0.01);
        this.controls.addRGB("Outline", function(r, g, b) {
            item.outlineShader.use();
            item.outlineShader.setColor(r, g, b);
        }, 0.0, 0.0, 0.0);
        
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
        this.cartoonShader.use();
        this.cartoonShader.setProjMat(this.projMover.matrix());
        this.cartoonShader.setViewMat(Matrix.identity());
        this.cartoonShader.setObjMat(this.objMover.matrix());
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
        for (var i = shape.pos.count() - 1; i >= 0; i--) {
            edges.insertPoint(shape.pos.get(i), shape.norm.get(i));
        };
        for (var i = shape.indices.length - 1; i >= 0; i--) {
            shape.indices[i].eachTri(function(i1, i2, i3) {
                edges.insertTri(shape.pos.get(i1), shape.pos.get(i2), shape.pos.get(i3));
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
    AdjSet.prototype.insertPoint = function(pos, norm, epsilon) {
        norm = Vector.normal(norm);
        var i = this._findPoint(pos, epsilon);
        if (i < 0) {
            var adj = new AdjPoint(pos, norm);
            this._points.push(adj);
        } else {
            var adj = this._points[i];
            adj.norm = Vector.add(adj.norm, norm);
            this._points[i] = adj;
        }
    };
    
    /**
     * TODO: Comment
     */
    AdjSet.prototype.insertTri = function(pos1, pos2, pos3, epsilon) {
        var dpos2 = Vector.sub(pos1, pos2);
        var dpos3 = Vector.sub(pos3, pos2);
        var faceNorm = Vector.normal(Vector.cross(dpos2, dpos3));
        var index1 = this._findPoint(pos1, epsilon);
        var index2 = this._findPoint(pos2, epsilon);
        var index3 = this._findPoint(pos3, epsilon);
        this._insertEdge(index1, index2, faceNorm);
        this._insertEdge(index2, index3, faceNorm);
        this._insertEdge(index3, index1, faceNorm);
    };
    
    /**
     * TODO: Comment
     */
    AdjSet.prototype._findPoint = function(pos, epsilon) {
        for (var i = 0; i < this._points.length; i++) {
            if (Vector.eq(this._points[i].pos, pos, epsilon)) {
                return i;
            }
        }
        return -1;
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
