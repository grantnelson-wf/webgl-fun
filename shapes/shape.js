define(function(require) {

    var Const = require("tools/const")

    /**
     * A graphical shape object.
     * @param  {Number} vertexType  The vertex type.
     * @param  {Number} vertexSize  The vertex size.
     * @param  {Number} indexCount  The number of indices.
     * @param  {Object} vertexBuf  The vertex buffer.
     * @param  {Object} indexBuf  The index buffer.
     */
    function Shape(vertexType, vertexSize, indexCount, vertexBuf, indexBuf) {
        this.vertexType = vertexType;
        this.vertexSize = vertexSize;
        this.indexCount = indexCount;
        this.vertexBuf  = vertexBuf;
        this.indexBuf   = indexBuf;
    }

    /**
     * Draws the shape to the graphical object.
     * @param  {Graphics} gfx  The graphical object to render.
     * @param  {Object} posAttr  The position attribute handle or null.
     * @param  {Object} clrAttr  The color attribute handle or null.
     * @param  {Object} normAttr  The normal attribute handle or null.
     * @param  {Object} txtAttr  The texture coordinate attribute handle or null.
     */
    Shape.prototype.draw = function(gfx, posAttr, clrAttr, normAttr, txtAttr) {
        var gl = gfx.gl;
        
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuf);
        var stride = this.vertexSize*Float32Array.BYTES_PER_ELEMENT;
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

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuf);
        gl.drawElements(gl.TRIANGLES, this.indexCount, gl.UNSIGNED_SHORT, 0);
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
         * This list of indices to create triangles.
         * @type {Array}
         */
        this._indices = [];
    }

    /**
     * This checks is the two values are equal.
     * @param  {Number} a  The first value.
     * @param  {Number} b  The second value.
     * @param  {Number} epsilon  The epsilon comparer.
     * @return  {Boolean}  True if they are equal, false otherwise.
     */
    ShapeBuilder.prototype._eq = function(a, b, epsilon) {
        return Math.abs(a - b) <= epsilon
    };

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
     * @param  {Number} px  The x component of the position.
     * @param  {Number} py  The y component of the position.
     * @param  {Number} pz  The z component of the position.
     * @param  {Number} epsilon  The epsilon comparison.
     * @return  {Number}  The index found or -1 if not found.
     */
    ShapeBuilder.prototype.findPos = function(px, py, pz, epsilon) {
        for (var i = 0; i < this._pos.length; i += 3) {
            if (this._eq(this._pos[i  ], px, epsilon) &&
                this._eq(this._pos[i+1], py, epsilon) &&
                this._eq(this._pos[i+2], pz, epsilon)) {
                return i/3;
            }
        }
        return -1;
    };

    /**
     * Sets a position to the shape.
     * @param  {Number} index  The index to set.
     * @param  {Number} px  The x component of the position.
     * @param  {Number} py  The y component of the position.
     * @param  {Number} pz  The z component of the position.
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
     * @param  {Number} r  The red of the color.
     * @param  {Number} g  The green of the color.
     * @param  {Number} b  The blue of the color.
     * @param  {Number} epsilon  The epsilon comparison.
     * @return  {Number}  The index found or -1 if not found.
     */
    ShapeBuilder.prototype.findClr = function(r, g, b, epsilon) {
        for (var i = 0; i < this._clr.length; i += 3) {
            if (this._eq(this._clr[i  ], px, epsilon) &&
                this._eq(this._clr[i+1], py, epsilon) &&
                this._eq(this._clr[i+2], pz, epsilon)) {
                return i/3;
            }
        }
        return -1;
    };

    /**
     * Sets a color to the shape.
     * @param  {Number} index  The index to set.
     * @param  {Number} r  The red of the color.
     * @param  {Number} g  The green of the color.
     * @param  {Number} b  The blue of the color.
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
     * @param  {Number} nx  The x component of the normal.
     * @param  {Number} ny  The y component of the normal.
     * @param  {Number} nz  The z component of the normal.
     * @param  {Number} epsilon  The epsilon comparison.
     * @return  {Number}  The index found or -1 if not found.
     */
    ShapeBuilder.prototype.findNorm = function(nx, ny, nz, epsilon) {
        for (var i = 0; i < this._norm.length; i += 3) {
            if (this._eq(this._norm[i  ], nx, epsilon) &&
                this._eq(this._norm[i+1], ny, epsilon) &&
                this._eq(this._norm[i+2], nz, epsilon)) {
                return i/3;
            }
        }
        return -1;
    };

    /**
     * Sets a normal to the shape.
     * @param  {Number} index  The index to set.
     * @param  {Number} nx  The x component of the normal.
     * @param  {Number} ny  The y component of the normal.
     * @param  {Number} nz  The z component of the normal.
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
     * @param  {Number} tu  The u component of the texture coordinate.
     * @param  {Number} tv  The v component of the texture coordinate.
     * @param  {Number} epsilon  The epsilon comparison.
     * @return  {Number}  The index found or -1 if not found.
     */
    ShapeBuilder.prototype.findTxt = function(tu, tv, epsilon) {
        for (var i = 0; i < this._txt.length; i += 2) {
            if (this._eq(this._txt[i  ], tu, epsilon) &&
                this._eq(this._txt[i+1], tv, epsilon)) {
                return i/2;
            }
        }
        return -1;
    };

    /**
     * Sets a texture coordinate. to the shape.
     * @param  {Number} index  The index to set.
     * @param  {Number} tu  The u component of the texture coordinate.
     * @param  {Number} tv  The v component of the texture coordinate.
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
     * Adds triangle indices to the shape.
     * @param  {Number} i1  The first index to add.
     * @param  {Number} i2  The second index to add.
     * @param  {Number} i3  The third index to add.
     */
    ShapeBuilder.prototype.addTriIndex = function(i1, i2, i3) {
        this._indices.push(Number(i1), Number(i2), Number(i3));
    };

    /**
     * Adds triangle indices to the shape.
     * @param  {Number} i1  The first index to add.
     * @param  {Number} i2  The second index to add.
     * @param  {Number} i3  The third index to add.
     * @param  {Number} i4  The third index to add.
     */
    ShapeBuilder.prototype.addQuadIndex = function(i1, i2, i3, i4) {
        this._indices.push(Number(i1), Number(i2), Number(i3),
                           Number(i2), Number(i4), Number(i3));
    };

    /**
     * Gets the current number of indices in the shape builder.
     * @returns  {Number}  The count of indices.
     */
    ShapeBuilder.prototype.indexCount = function() {
        return this._indices.length;
    };

    /**
     * Build a shape with the given data.
     * @param  {Graphics} gfx  The graphical object to build the shape for.
     * @param  {Number} [vertexType]  The vertex type to build.
     *                                If not provided, all the defined types are used.
     * @returns  {Shape}  The built shape for the graphical object.
     */
    ShapeBuilder.prototype.build = function(gfx, vertexType) {
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

        // Copy the indices and check the indices range.
        var indices = []
        for (var i = this.indexCount() - 1; i >= 0; i--) {
            index = this._indices[i];
            if ((index < 0) || (index >= len)) {
                throw "Error: The index, "+index+", at "+i+" was not in [0.."+len+")."
            }
            indices[i] = index;
        };

        // Create graphical buffers.
        var gl = gfx.gl;
        var vertexBuf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

        var indexBuf  = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuf);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

        // Create shape object.
        return new Shape(newVertexType, vertexSize, this.indexCount(), vertexBuf, indexBuf);
    };

    return ShapeBuilder;
});
