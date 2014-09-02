define(function(require) {

    var Const = require("tools/const")
    var Common = require("tools/common")

    /**
     * A graphical shape object.
     * @param  {Number} vertexType  The vertex type.
     * @param  {Number} vertexSize  The vertex size.
     * @param  {Object} vertexBuf   The vertex buffer.
     * @param  {Array} indexObjs    The index information.
     */
    function Shape(vertexType, vertexSize, vertexBuf, indexObjs) {
    
        /**
         * The vertex type.
         * @type {Number}
         */
        this.vertexType = vertexType;
        
        /**
         * The vertex size.
         * @type {Number}
         */
        this._vertexSize = vertexSize;
        
        /**
         * The vertex buffer.
         * @type {Object}
         */
        this._vertexBuf  = vertexBuf;
        
        /**
         * The index information.
         * @type {Array}
         */
        this._indexObjs  = indexObjs;
    }

    /**
     * Draws the shape to the graphical object.
     * @param  {Graphics} gfx     The graphical object to render.
     * @param  {Object} posAttr   The position attribute handle or null.
     * @param  {Object} clrAttr   The color attribute handle or null.
     * @param  {Object} normAttr  The normal attribute handle or null.
     * @param  {Object} txtAttr   The texture coordinate attribute handle or null.
     */
    Shape.prototype.draw = function(gfx, posAttr, clrAttr, normAttr, txtAttr) {
        var gl = gfx.gl;
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this._vertexBuf);
        var stride = this._vertexSize*Float32Array.BYTES_PER_ELEMENT;
        var offset = 0;

        if ((posAttr !== null) && (this.vertexType&Const.POS)) {
            gl.enableVertexAttribArray(posAttr);
            gl.vertexAttribPointer(posAttr, 3, gl.FLOAT, false, stride, 0);
            offset += 3*Float32Array.BYTES_PER_ELEMENT;
        }

        if ((clrAttr !== null) && (this.vertexType&Const.CLR)) {
            gl.enableVertexAttribArray(clrAttr);
            gl.vertexAttribPointer(clrAttr, 3, gl.FLOAT, false, stride, offset);
            offset += 3*Float32Array.BYTES_PER_ELEMENT;
        }

        if ((normAttr !== null) && (this.vertexType&Const.NORM)) {
            gl.enableVertexAttribArray(normAttr);
            gl.vertexAttribPointer(normAttr, 3, gl.FLOAT, false, stride, offset);
            offset += 3*Float32Array.BYTES_PER_ELEMENT;
        }

        if ((txtAttr !== null) && (this.vertexType&Const.TXT)) {
            gl.enableVertexAttribArray(txtAttr);
            gl.vertexAttribPointer(txtAttr, 2, gl.FLOAT, false, stride, offset);
        }

        var objCount = this._indexObjs.length;
        for (var i = 0; i < objCount; i++) {
            var indexObj = this._indexObjs[i];
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexObj.buffer);
            gl.drawElements(indexObj.type, indexObj.count, gl.UNSIGNED_SHORT, 0);
        }
    };

    //======================================================================

    /**
     * An object used to create a shape.
     */
    function ShapeBuilder() {

        /**
         * The list of x, y, z in-line triplets of vertex position data.
         * @type {Array}
         */
        this._pos = [];

        /**
         * The list of r, g, b in-line triplets of vertex color data.
         * @type {Array}
         */
        this._clr = [];

        /**
         * The list of x, y, z in-line triplets of vertex normal data.
         * @type {Array}
         */
        this._norm = [];

        /**
         * The list of u, v in-line tuple of vertex color data.
         * @type {Array}
         */
        this._txt = [];
        
        /**
         * The list of indices for points.
         * Each index is a point.
         * @type {Array}
         */
        this._indicesPoints = [];
        
        /**
         * The list of index pairs for lines.
         * Each pair is a line.
         * @type {Array}
         */
        this._indicesLines = [];
        
        /**
         * The current line strip indices being worked on.
         * Each point is connected to the previous to create lines,
         * with the exception of the first and last points.
         * @type {Array}
         */
        this._curLineStrips = null;
        
        /**
         * The list of line strip indices.
         * @type {Array}
         */
        this._indicesLineStrips = [];
        
        /**
         * The current line loop indices being worked on.
         * Each point is connected to the previous to create lines,
         * and the last point is connected to the first to make a loop.
         * @type {Array}
         */
        this._curLineLoops = null;
        
        /**
         * The list of line loop indices.
         * @type {Array}
         */
        this._indicesLineLoops = [];

        /**
         * The list of triangle indices.
         * @type {Array}
         */
        this._indicesTris = [];

        /**
         * The list of quadrilateral indices.
         * @type {Array}
         */
        this._indicesQuads = [];
        
        /**
         * The current triangle strip indices being worked on.
         * @type {Array}
         */
        this._curTriStrips = null;
        
        /**
         * The list of triangle strip indices.
         * @type {Array}
         */
        this._indicesTriStrips = [];
        
        /**
         * This current triangle fan indices being worked on.
         * @type {Array}
         */
        this._curTriFans = null;
        
        /**
         * The list of triangle fan indices.
         * @type {Array}
         */
        this._indicesTriFans = [];
    }

    //======================================================================

    /**
     * Adds a position to the shape.
     * @param  {Number} px  The x component of the position.
     * @param  {Number} py  The y component of the position.
     * @param  {Number} pz  The z component of the position.
     */
    ShapeBuilder.prototype.addPos = function(px, py, pz) {
        this._pos.push(Number(px), Number(py), Number(pz));
    };

    /**
     * Finds the the position in the shape.
     * @param  {Number} px       The x component of the position.
     * @param  {Number} py       The y component of the position.
     * @param  {Number} pz       The z component of the position.
     * @param  {Number} epsilon  The epsilon comparison.
     * @return  {Number}  The index found or -1 if not found.
     */
    ShapeBuilder.prototype.findPos = function(px, py, pz, epsilon) {
        for (var i = 0; i < this._pos.length; i += 3) {
            if (Common.eq(this._pos[i  ], px, epsilon) &&
                Common.eq(this._pos[i+1], py, epsilon) &&
                Common.eq(this._pos[i+2], pz, epsilon)) {
                return i/3;
            }
        }
        return -1;
    };

    /**
     * Sets a position to the shape.
     * @param  {Number} index  The index to set.
     * @param  {Number} px     The x component of the position.
     * @param  {Number} py     The y component of the position.
     * @param  {Number} pz     The z component of the position.
     */
    ShapeBuilder.prototype.setPos = function(index, px, py, pz) {
        this._pos[index*3  ] = Number(px);
        this._pos[index*3+1] = Number(py);
        this._pos[index*3+2] = Number(pz);
    };

    /**
     * Gets a position from the shape.
     * @param  {Number} index  The index to get.
     * @returns  {Array}  The position from the shape.
     */
    ShapeBuilder.prototype.getPos = function(index) {
        return [ this._pos[index*3], this._pos[index*3+1], this._pos[index*3+2] ];
    };

    /**
     * Gets the current number of positions are in the shape builder.
     * @returns  {Number}  The count of positions.
     */
    ShapeBuilder.prototype.posCount = function() {
        return this._pos.length/3;
    };

    //======================================================================

    /**
     * Adds a color to the shape.
     * @param  {Number} r  The red component of the color.
     * @param  {Number} g  The green component of the color.
     * @param  {Number} b  The blue component of the color.
     */
    ShapeBuilder.prototype.addClr = function(r, g, b) {
        this._clr.push(Number(r), Number(g), Number(b))
    };

    /**
     * Finds the the color in the shape.
     * @param  {Number} r        The red of the color.
     * @param  {Number} g        The green of the color.
     * @param  {Number} b        The blue of the color.
     * @param  {Number} epsilon  The epsilon comparison.
     * @return  {Number}  The index found or -1 if not found.
     */
    ShapeBuilder.prototype.findClr = function(r, g, b, epsilon) {
        for (var i = 0; i < this._clr.length; i += 3) {
            if (Common.eq(this._clr[i  ], px, epsilon) &&
                Common.eq(this._clr[i+1], py, epsilon) &&
                Common.eq(this._clr[i+2], pz, epsilon)) {
                return i/3;
            }
        }
        return -1;
    };

    /**
     * Sets a color to the shape.
     * @param  {Number} index  The index to set.
     * @param  {Number} r      The red of the color.
     * @param  {Number} g      The green of the color.
     * @param  {Number} b      The blue of the color.
     */
    ShapeBuilder.prototype.setClr = function(index, r, g, b) {
        this._clr[index*3  ] = Number(r);
        this._clr[index*3+1] = Number(g);
        this._clr[index*3+2] = Number(b);
    };

    /**
     * Gets a color from the shape.
     * @param  {Number} index  The index to get.
     * @returns  {Array}  The color from the shape.
     */
    ShapeBuilder.prototype.getClr = function(index) {
        return [ this._clr[index*3], this._clr[index*3+1], this._clr[index*3+2] ];
    };

    /**
     * Gets the current number of colors are in the shape builder.
     * @returns  {Number}  The count of colors.
     */
    ShapeBuilder.prototype.clrCount = function() {
        return this._clr.length/3;
    };

    //======================================================================

    /**
     * Adds a normal to the shape.
     * @param  {Number} nx  The x component of the normal.
     * @param  {Number} ny  The y component of the normal.
     * @param  {Number} nz  The z component of the normal.
     */
    ShapeBuilder.prototype.addNorm = function(nx, ny, nz) {
        this._norm.push(Number(nx), Number(ny), Number(nz))
    };

    /**
     * Finds the the normal in the shape.
     * @param  {Number} nx       The x component of the normal.
     * @param  {Number} ny       The y component of the normal.
     * @param  {Number} nz       The z component of the normal.
     * @param  {Number} epsilon  The epsilon comparison.
     * @return  {Number}  The index found or -1 if not found.
     */
    ShapeBuilder.prototype.findNorm = function(nx, ny, nz, epsilon) {
        for (var i = 0; i < this._norm.length; i += 3) {
            if (Common.eq(this._norm[i  ], nx, epsilon) &&
                Common.eq(this._norm[i+1], ny, epsilon) &&
                Common.eq(this._norm[i+2], nz, epsilon)) {
                return i/3;
            }
        }
        return -1;
    };

    /**
     * Sets a normal to the shape.
     * @param  {Number} index  The index to set.
     * @param  {Number} nx     The x component of the normal.
     * @param  {Number} ny     The y component of the normal.
     * @param  {Number} nz     The z component of the normal.
     */
    ShapeBuilder.prototype.setNorm = function(index, nx, ny, nz) {
        this._norm[index*3  ] = Number(nx);
        this._norm[index*3+1] = Number(ny);
        this._norm[index*3+2] = Number(nz);
    };

    /**
     * Gets a normal from the shape.
     * @param  {Number} index  The index to get.
     * @returns  {Array}  The normal from the shape.
     */
    ShapeBuilder.prototype.getNorm = function(index) {
        return [ this._norm[index*3], this._norm[index*3+1], this._norm[index*3+2] ];
    };

    /**
     * Gets the current number of normals are in the shape builder.
     * @returns  {Number}  The count of normals.
     */
    ShapeBuilder.prototype.normCount = function() {
        return this._norm.length/3;
    };

    //======================================================================

    /**
     * Adds a texture coordinate to the shape.
     * @param  {Number} tu  The u component of the texture coordinate.
     * @param  {Number} tv  The v component of the texture coordinate.
     */
    ShapeBuilder.prototype.addTxt = function(tu, tv) {
        this._txt.push(Number(tu), Number(tv))
    };

    /**
     * Finds the the texture coordinate. in the shape.
     * @param  {Number} tu       The u component of the texture coordinate.
     * @param  {Number} tv       The v component of the texture coordinate.
     * @param  {Number} epsilon  The epsilon comparison.
     * @return  {Number}  The index found or -1 if not found.
     */
    ShapeBuilder.prototype.findTxt = function(tu, tv, epsilon) {
        for (var i = 0; i < this._txt.length; i += 2) {
            if (Common.eq(this._txt[i  ], tu, epsilon) &&
                Common.eq(this._txt[i+1], tv, epsilon)) {
                return i/2;
            }
        }
        return -1;
    };

    /**
     * Sets a texture coordinate. to the shape.
     * @param  {Number} index  The index to set.
     * @param  {Number} tu     The u component of the texture coordinate.
     * @param  {Number} tv     The v component of the texture coordinate.
     */
    ShapeBuilder.prototype.setTxt = function(index, tu, tv) {
        this._txt[index*2  ] = Number(tu);
        this._txt[index*2+1] = Number(tv);
    };

    /**
     * Gets a texture coordinate. from the shape.
     * @param  {Number} index  The index to get.
     * @returns  {Array}  The texture coordinate. from the shape.
     */
    ShapeBuilder.prototype.getTxt = function(index) {
        return [ this._txt[index*2], this._txt[index*2+1] ];
    };

    /**
     * Gets the current number of texture coordinates are in the shape builder.
     * @returns  {Number}  The count of texture coordinates.
     */
    ShapeBuilder.prototype.txtCount = function() {
        return this._txt.length/2;
    };

    //======================================================================
    
    /**
     * Adds a point index or point indices to the shape.
     * This appends any number of point indices.
     */
    ShapeBuilder.prototype.addPointIndex = function() {
        for (var i = 0; i < arguments.length; i++) {
            this._indicesPoints.push(Number(arguments[i]));
        }
    };
    
    /**
     * Adds line indices to the shape.
     * @param  {Number} i  The first index to add.
     * @param  {Number} j  The second index to add.
     */
    ShapeBuilder.prototype.addLineIndices = function(i, j) {
        this._indicesLines.push(Number(i), Number(j));
    };
    
    /**
     * Starts a new line strip and adds line strip indices to the shape.
     * This may also append any number of line strip indices.
     */
    ShapeBuilder.prototype.startLineStrip = function() {
        if ((this._curLineStrips === null) || (this._curLineStrips.length > 0)) {
            this._curLineStrips = [];
            this._indicesLineStrips.push(this._curLineStrips);
            for (var i = 0; i < arguments.length; i++) {
                this._curLineStrips.push(Number(arguments[i]));
            }
        }
    };
    
    /**
     * Adds line strip indices to the shape.
     * startLineStrip must be called before any strips can be added to.
     * This may also append any number of line strip indices.
     */
    ShapeBuilder.prototype.addToLineStrip = function() {
        if (this._curLineStrips === null) {
            throw "Error: Must start a line strip before adding to it.";
        }
        for (var i = 0; i < arguments.length; i++) {
            this._curLineStrips.push(Number(arguments[i]));
        }
    };
    
    /**
     * Starts a new line loop and adds line loop indices to the shape.
     * This may also append any number of line loop indices.
     */
    ShapeBuilder.prototype.startLineLoop = function() {
        if ((this._curLineLoops === null) || (this._curLineLoops.length > 0)) {
            this._curLineLoops = [];
            this._indicesLineLoops.push(this._curLineLoops);
            for (var i = 0; i < arguments.length; i++) {
                this._curLineLoops.push(Number(arguments[i]));
            }
        }
    };
    
    /**
     * Adds line loop indices to the shape.
     * startLineLoop must be called before any strips can be added to.
     * This may also append any number of line loop indices.
     */
    ShapeBuilder.prototype.addToLineLoop = function() {
        if (this._curLineLoops === null) {
            throw "Error: Must start a line loop before adding to it.";
        }
        for (var i = 0; i < arguments.length; i++) {
            this._curLineLoops.push(Number(arguments[i]));
        }
    };
    
    /**
     * Adds triangle indices to the shape.
     * @param  {Number} i  The first index to add.
     * @param  {Number} j  The second index to add.
     * @param  {Number} k  The third index to add.
     */
    ShapeBuilder.prototype.addTriIndices = function(i, j, k) {
        this._indicesTris.push(Number(i), Number(j), Number(k));
    };

    /**
     * Adds quadrilateral indices to the shape.
     * @param  {Number} i  The first index to add.
     * @param  {Number} j  The second index to add.
     * @param  {Number} k  The third index to add.
     * @param  {Number} l  The forth index to add.
     */
    ShapeBuilder.prototype.addQuadIndices = function(i, j, k, l) {
        this._indicesQuads.push(Number(i), Number(j), Number(k), Number(l));
    };

    /**
     * Starts a new triangle strip and adds triangle strip indices to the shape.
     * This may also append any number of triangle strip indices.
     */
    ShapeBuilder.prototype.startTriStrip = function() {
        if ((this._curTriStrips === null) || (this._curTriStrips.length > 0)) {
            this._curTriStrips = [];
            this._indicesTriStrips.push(this._curTriStrips);
            for (var i = 0; i < arguments.length; i++) {
                this._curTriStrips.push(Number(arguments[i]));
            }
        }
    };
    
    /**
     * Adds triangle strip indices to the shape.
     * startTriStrip must be called before any strips can be added to.
     * This may also append any number of triangle strip indices.
     */
    ShapeBuilder.prototype.addToTriStrip = function() {
        if (this._curTriStrips === null) {
            throw "Error: Must start a triangle strip before adding to it.";
        }
        for (var i = 0; i < arguments.length; i++) {
            this._curTriStrips.push(Number(arguments[i]));
        }
    };
    
    /**
     * Starts a new triangle fan and adds triangle fan indices to the shape.
     * This may also append any number of triangle fan indices.
     */
    ShapeBuilder.prototype.startTriFan = function() {
        if ((this._curTriFans === null) || (this._curTriFans.length > 0)) {
            this._curTriFans = [];
            this._indicesTriFans.push(this._curTriFans);
            for (var i = 0; i < arguments.length; i++) {
                this._curTriFans.push(Number(arguments[i]));
            }
        }
    };
    
    /**
     * Adds triangle fan indices to the shape.
     * startTriFan must be called before any strips can be added to.
     * This may also append any number of triangle fan indices.
     */
    ShapeBuilder.prototype.addToTriFan = function() {
        if (this._curTriFans === null) {
            throw "Error: Must start a triangle fan before adding to it.";
        }
        for (var i = 0; i < arguments.length; i++) {
            this._curTriFans.push(Number(arguments[i]));
        }
    };
    
    //======================================================================
    
    
    
    
        /*
        this._indicesTris
        this._indicesQuads
        this._indicesTriStrips
        this._indicesTriFans
        */
    
    
    
    
    //======================================================================
    
    /**
     * Build a shape with the set data.
     * @param  {Graphics} gfx         The graphical object to build the shape for.
     * @param  {Number} [vertexType]  The vertex type to build.
     *                                If not provided, all the defined types are used.
     * @returns  {Shape}  The built shape for the graphical object.
     */
    ShapeBuilder.prototype.build = function(gfx, vertexType) {
        var gl = gfx.gl;
        var vertices = this._buildVertices(gl, vertexType);
        var indexObjs = this._buildIndices(gl, vertices.length);
        return new Shape(vertices.type, vertices.size, vertices.buffer, indexObjs);
    };
    
    /**
     * Builds the vertices for a shape.
     * @param  {Graphics} gl          The graphical object to build the shape for.
     * @param  {Number} [vertexType]  The vertex type to build.
     *                                If not provided, all the defined types are used.
     * @returns  {Object} The buffer, buffer length, vertex type, and vertex size.
     */
    ShapeBuilder.prototype._buildVertices = function(gl, vertexType) {
        vertexType = vertexType || (Const.POS|Const.CLR|Const.NORM|Const.TXT);

        // Collect information about the vertex arrays.
        var newVertexType = Const.POS;
        var vertexSize = 3;
        var hasClr = false;
        var hasNorm = false;
        var hasTxt = false;
        var len = this.posCount();
        if (!(vertexType&Const.POS)) {
            throw "Error: Must have at least the positional vertex type.";
        }
        if (len <= 0) {
            throw "Error: Must have at least one vertex.";
        }
        if ((vertexType&Const.CLR) && (this.clrCount() > 0)) {
            if (this.clrCount() != len) {
                throw "Error: The color count, "+this.clrCount()+", must match the vertex count, "+len+".";
            }
            newVertexType |= Const.CLR;
            vertexSize += 3;
            hasClr = true;
        }
        if ((vertexType&Const.NORM) && (this.normCount() > 0)) {
            if (this.normCount() != len) {
                throw "Error: The normal count, "+this.normCount()+", must match the vertex count, "+len+".";
            }
            newVertexType |= Const.NORM;
            vertexSize += 3;
            hasNorm = true;
        }
        if ((vertexType&Const.TXT) && (this.txtCount() > 0)) {
            if (this.txtCount() != len) {
                throw "Error: The texture coordinate count, "+this.txtCount()+", must match the vertex count, "+len+".";
            }
            newVertexType |= Const.TXT;
            vertexSize += 2;
            hasTxt = true;
        }

        // Pack the vertices.
        var vertices = [];
        for (var i = 0, k = 0; i < len; i++) {
            var i3 = i*3
            vertices[k++] = this._pos[i3];
            vertices[k++] = this._pos[i3+1];
            vertices[k++] = this._pos[i3+2];

            if (hasClr) {
                vertices[k++] = this._clr[i3];
                vertices[k++] = this._clr[i3+1];
                vertices[k++] = this._clr[i3+2];
            }

            if (hasNorm) {
                vertices[k++] = this._norm[i3];
                vertices[k++] = this._norm[i3+1];
                vertices[k++] = this._norm[i3+2];
            }

            if (hasTxt) {
                vertices[k++] = this._txt[i*2];
                vertices[k++] = this._txt[i*2+1];
            }
        };
        
        // Create vertex buffer.
        var vertexBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        
        return {
            buffer: vertexBuf,
            type: newVertexType,
            size: vertexSize,
            length: len
        };
    };
    
    /**
     * Build the indices for the shape.
     * @param  {Graphics} gl          The graphical object to build the shape for.
     * @param  {Number} [vertexType]  The vertex type to build.
     *                                If not provided, all the defined types are used.
     * @returns  {Array}  The list of index objects.
     */
    ShapeBuilder.prototype._buildIndices = function(gl, len) {
        var indices = [];
        var indexObjs = [];
        var addIndexObj = function(type) {
            var indexBuf  = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuf);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);
            indexObjs.push({
                type:   type,
                count:  indices.length,
                buffer: indexBuf
            });
            indices = [];
        };
        
        // Copy the point indices and check the indices range.
        if (this._indicesPoints.length > 0) {
            for (var i = 0; i < this._indicesPoints.length; i++) {
                index = this._indicesPoints[i];
                if ((index < 0) || (index >= len)) {
                    throw "Error: The point index, "+index+", at "+i+" was not in [0.."+len+").";
                }
                indices.push(index);
            };
            addIndexObj(gl.POINTS);
        }
        
        // Copy the line indices and check the indices range.
        if (this._indicesLines.length > 0) {
            if (lineStrip.length%2 !== 0) {
                throw "Error: The lines must be in groups of two, it has "+lineStrip.length+".";
            }
            for (var i = 0; i < this._indicesLines.length; i++) {
                index = this._indicesLines[i];
                if ((index < 0) || (index >= len)) {
                    throw "Error: The line index, "+index+", at "+i+" was not in [0.."+len+").";
                }
                indices.push(index);
            };
            addIndexObj(gl.LINES);
        }
        
        // Copy the line strips indices and check the indices range.
        for (var i = 0; i < this._indicesLineStrips.length; i++) {
            var lineStrip = this._indicesLineStrips[i];
            if (lineStrip.length < 2) {
                throw "Error: The line loop at "+i+" must have at least two indices.";
            }
            for (var j = 0; j < lineStrip.length; j++) {
                index = lineStrip[j];
                if ((index < 0) || (index >= len)) {
                    throw "Error: The line strip index, "+index+", at "+j+" in "+i+" was not in [0.."+len+").";
                }
                indices.push(index);
            };
            addIndexObj(gl.LINE_STRIP);
        };
        
        // Copy the line loops indices and check the indices range.
        if (this._indicesLineLoops.length > 0) {
            for (var i = 0; i < this._indicesLineLoops.length; i++) {
                var lineLoop = this._indicesLineLoops[i];
                if (lineLoop.length < 3) {
                    throw "Error: The line loop at "+i+" must have at least three indices.";
                }
                for (var j = 0; j < lineLoop.length; j++) {
                    index = lineLoop[j];
                    if ((index < 0) || (index >= len)) {
                        throw "Error: The line loop index, "+index+", at "+j+" in "+i+" was not in [0.."+len+").";
                    }
                    indices.push(index);
                };
                addIndexObj(gl.LINE_LOOP);
            };
        }
        
        // Copy the triangles and check the indices range.
        if (this._indicesTris.length > 0) {
            if (this._indicesTris.length%3 !== 0) {
                throw "Error: The triangles must be in groups of three, it has "+this._indicesTris.length+".";
            }
            for (var i = 0; i < this._indicesTris.length; i++) {
                index = this._indicesTris[i];
                if ((index < 0) || (index >= len)) {
                    throw "Error: The triangle index, "+index+", at "+i+" was not in [0.."+len+").";
                }
                indices.push(index);
            };
            addIndexObj(gl.TRIANGLES);
        }
        
        // Copy the quads and check the indices range.
        if (this._indicesQuads.length > 0) {
            if (this._indicesQuads.length%4 !== 0) {
                throw "Error: The quadrilaterals must be in groups of four, it has "+this._indicesQuads.length+".";
            }
            for (var i = 0; i < this._indicesQuads.length; i += 4) {
                for (var j = 0; j < 4; j++) {
                    index = this._indicesQuads[i+j];
                    if ((index < 0) || (index >= len)) {
                        throw "Error: The quads index, "+index+", at "+j+" in "+i+" was not in [0.."+len+").";
                    }
                    indices.push(index);
                };
                addIndexObj(gl.TRIANGLE_FAN);
            };
        }
        
        // Copy the triangle strips indices and check the indices range.
        for (var i = 0; i < this._indicesTriStrips.length; i++) {
            var triStrip = this._indicesTriStrips[i];
            if (triStrip.length < 3) {
                throw "Error: The triangle strip at "+i+" must have at least three indices.";
            }
            for (var j = 0; j < triStrip.length; j++) {
                index = triStrip[j];
                if ((index < 0) || (index >= len)) {
                    throw "Error: The triangle strip index, "+index+", at "+j+" in "+i+" was not in [0.."+len+").";
                }
                indices.push(index);
            };
            addIndexObj(gl.TRIANGLE_STRIP);
        };
        
        // Copy the triangle fan indices and check the indices range.
        for (var i = 0; i < this._indicesTriFans.length; i++) {
            var triFan = this._indicesTriFans[i];
            if (triFan.length < 3) {
                throw "Error: The triangle fan at "+i+" must have at least three indices.";
            }
            for (var j = 0; j < triFan.length; j++) {
                index = triFan[j];
                if ((index < 0) || (index >= len)) {
                    throw "Error: The triangle fan index, "+index+", at "+j+" in "+i+" was not in [0.."+len+").";
                }
                indices.push(index);
            };
            addIndexObj(gl.TRIANGLE_FAN);
        };
        
        if (indexObjs.length < 1) {
            throw "Error: Must have at least one index object.";
        }
        return indexObjs;
    };

    return ShapeBuilder;
});
