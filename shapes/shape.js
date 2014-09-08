define(function(require) {

    var Const = require('tools/const');
    var Common = require('tools/common');

    /**
     * A graphical shape object.
     * @param  {Number} vertexType  The vertex type.
     * @param  {Number} vertexSize  The vertex size.
     * @param  {Object} vertexBuf   The vertex buffer.
     * @param  {Array} indexObjs    The index information.
     */
    function Shape(gl, vertexType, vertexSize, vertexBuf, indexObjs) {
    
        /**
         * The graphical object.
         * @private
         * @type {Object}
         */
        this._gl = gl;

        /**
         * The vertex type.
         * @private
         * @type {Number}
         */
        this._vertexType = vertexType;
        
        /**
         * The vertex size.
         * @private
         * @type {Number}
         */
        this._vertexSize = vertexSize;
        
        /**
         * The vertex buffer.
         * @private
         * @type {Object}
         */
        this._vertexBuf  = vertexBuf;
        
        /**
         * The index information.
         * @private
         * @type {Array}
         */
        this._indexObjs  = indexObjs;

        /**
         * The position attribute handle or null.
         * @type {Object}
         */
        this.posAttr = null;

        /**
         * The RGB color attribute handle or null.
         * @type {Object}
         */
        this.clr3Attr = null;

        /**
         * The RGBA color attribute handle or null.
         * @type {Object}
         */
        this.clr4Attr = null;
        
        /**
         * The normal attribute handle or null.
         * @type {Object}
         */
        this.normAttr = null;

        /**
         * The 2D texture coordinate attribute handle or null.
         * @type {Object}
         */
        this.txtAttr = null;

        /**
         * The Cube texture coordinate attribute handle or null.
         * @type {Object}
         */
        this.cubeAttr = null;
    }

    /**
     * Gets the vertex type.
     * @type {Number}
     */
    Shape.prototype.vertexType = function() {
        return this._vertexType;
    };
        
    /**
     * Gets the vertex size.
     * @type {Number}
     */
    Shape.prototype.vertexSize = function() {
        return this._vertexSize;
    };

    /**
     * Sets the attribute for the vertex before a draw.
     * @private
     * @param {Number} type   The type of vertex data to set the attribute for.
     * @param {Number} size   The number of floats in the vertex type.
     * @param {Object} attr   [description]
     * @param {Number} offset [description]
     */
    Shape.prototype._setAttr = function(type, size, attr, offset) {
        if (this._vertexType&type) {
            if (attr !== null) {
                var stride = this._vertexSize*Float32Array.BYTES_PER_ELEMENT;
                this._gl.enableVertexAttribArray(attr);
                this._gl.vertexAttribPointer(attr, size, this._gl.FLOAT, false, stride, offset);
            }
            offset += size*Float32Array.BYTES_PER_ELEMENT;
        }
        return offset;
    };

    /**
     * Draws the shape to the graphical object.
     */
    Shape.prototype.draw = function() {
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vertexBuf);

        var offset = 0;
        // TODO:: Need to base off of an object not specific list.
        offset = this._setAttr(Const.POS,  3, this.posAttr,  offset);
        offset = this._setAttr(Const.CLR3, 3, this.clr3Attr, offset);
        offset = this._setAttr(Const.CLR4, 4, this.clr4Attr, offset);
        offset = this._setAttr(Const.NORM, 3, this.normAttr, offset);
        offset = this._setAttr(Const.TXT,  2, this.txtAttr,  offset);
        offset = this._setAttr(Const.CUBE, 3, this.cubeAttr, offset);

        var objCount = this._indexObjs.length;
        for (var i = 0; i < objCount; i++) {
            var indexObj = this._indexObjs[i];
            this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, indexObj.buffer);
            this._gl.drawElements(indexObj.type, indexObj.count, this._gl.UNSIGNED_SHORT, 0);
        }

        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
    };

    //======================================================================

    /**
     * A 2 value vertex buffer for building the shape.
     * @param  {Number} type  The type of the buffer this is.
     */
    function Vertex2DataBuffer(type, name) {

        /**
         * The list of x, y in-line tuples for vertex data.
         * @type {Array}
         */
        this.data = [];

        /**
         * The type of vertex this data is for.
         * @type {Number}
         */
        this.type = type;
    }

    /**
     * The size of the vertex buffer data in number of floats.
     * @return  {Number}  The number of floats per vertex.
     */
    Vertex2DataBuffer.prototype.size = function() {
        return 2;
    };

    /**
     * Adds a vertex data to the shape.
     * @param  {Number} x  The x component of this vertex data.
     * @param  {Number} y  The y component of this vertex data.
     */
    Vertex2DataBuffer.prototype.add = function(x, y) {
        this.data.push(Number(x), Number(y));
    };

    /**
     * Finds the the vertex data in the shape.
     * @param  {Number} x          The x component of this vertex data.
     * @param  {Number} y          The y component of this vertex data.
     * @param  {Number} [epsilon]  The epsilon comparison.
     * @return  {Number}  The index found or -1 if not found.
     */
    Vertex2DataBuffer.prototype.find = function(x, y, epsilon) {
        epsilon = epsilon || 0.000001;
        for (var i = 0; i < this.data.length; i += 2) {
            if (Common.eq(this.data[i  ], x, epsilon) &&
                Common.eq(this.data[i+1], y, epsilon)) {
                return i/2;
            }
        }
        return -1;
    };

    /**
     * Sets vertex data to the shape.
     * @param  {Number} index  The index to set.
     * @param  {Number} x      The x component of this vertex data.
     * @param  {Number} y      The y component of this vertex data.
     */
    Vertex2DataBuffer.prototype.set = function(index, x, y) {
        this.data[index*2  ] = Number(x);
        this.data[index*2+1] = Number(y);
    };

    /**
     * Gets vertex data from the shape.
     * @param  {Number} index  The index to get.
     * @returns  {Array}  The data from the shape.
     */
    Vertex2DataBuffer.prototype.get = function(index) {
        return [ this.data[index*2], this.data[index*2+1] ];
    };

    /**
     * Gets the current number of datum.
     * @returns  {Number}  The count of datum.
     */
    Vertex2DataBuffer.prototype.count = function() {
        return this.data.length/2;
    };

    //======================================================================

    /**
     * A 3 value vertex buffer for building the shape.
     * @param  {Number} type  The type of the buffer this is.
     */
    function Vertex3DataBuffer(type, name) {

        /**
         * The list of x, y, z in-line triplets for vertex data.
         * @type {Array}
         */
        this.data = [];

        /**
         * The type of vertex this data is for.
         * @type {Number}
         */
        this.type = type;
    }

    /**
     * The size of the vertex buffer data in number of floats.
     * @return  {Number}  The number of floats per vertex.
     */
    Vertex3DataBuffer.prototype.size = function() {
        return 3;
    };

    /**
     * Adds a vertex data to the shape.
     * @param  {Number} x  The x component of this vertex data.
     * @param  {Number} y  The y component of this vertex data.
     * @param  {Number} z  The z component of this vertex data.
     */
    Vertex3DataBuffer.prototype.add = function(x, y, z) {
        this.data.push(Number(x), Number(y), Number(z));
    };

    /**
     * Finds the the vertex data in the shape.
     * @param  {Number} x          The x component of this vertex data.
     * @param  {Number} y          The y component of this vertex data.
     * @param  {Number} z          The z component of this vertex data.
     * @param  {Number} [epsilon]  The epsilon comparison.
     * @return  {Number}  The index found or -1 if not found.
     */
    Vertex3DataBuffer.prototype.find = function(x, y, z, epsilon) {
        epsilon = epsilon || 0.000001;
        for (var i = 0; i < this.data.length; i += 3) {
            if (Common.eq(this.data[i  ], x, epsilon) &&
                Common.eq(this.data[i+1], y, epsilon) &&
                Common.eq(this.data[i+2], z, epsilon)) {
                return i/3;
            }
        }
        return -1;
    };

    /**
     * Sets vertex data to the shape.
     * @param  {Number} index  The index to set.
     * @param  {Number} x      The x component of this vertex data.
     * @param  {Number} y      The y component of this vertex data.
     * @param  {Number} z      The z component of this vertex data.
     */
    Vertex3DataBuffer.prototype.set = function(index, x, y, z) {
        this.data[index*3  ] = Number(x);
        this.data[index*3+1] = Number(y);
        this.data[index*3+2] = Number(z);
    };

    /**
     * Gets vertex data from the shape.
     * @param  {Number} index  The index to get.
     * @returns  {Array}  The data from the shape.
     */
    Vertex3DataBuffer.prototype.get = function(index) {
        return [ this.data[index*3], this.data[index*3+1], this.data[index*3+2] ];
    };

    /**
     * Gets the current number of datum.
     * @returns  {Number}  The count of datum.
     */
    Vertex3DataBuffer.prototype.count = function() {
        return this.data.length/3;
    };

    //======================================================================

    /**
     * A 4 value vertex buffer for building the shape.
     * @param  {Number} type  The type of the buffer this is.
     */
    function Vertex4DataBuffer(type, name) {

        /**
         * The list of x, y, z, w in-line tuple for vertex data.
         * @type {Array}
         */
        this.data = [];

        /**
         * The type of vertex this data is for.
         * @type {Number}
         */
        this.type = type;
    }

    /**
     * The size of the vertex buffer data in number of floats.
     * @return  {Number}  The number of floats per vertex.
     */
    Vertex4DataBuffer.prototype.size = function() {
        return 4;
    };

    /**
     * Adds a vertex data to the shape.
     * @param  {Number} x  The x component of this vertex data.
     * @param  {Number} y  The y component of this vertex data.
     * @param  {Number} z  The z component of this vertex data.
     * @param  {Number} w  The w component of this vertex data.
     */
    Vertex4DataBuffer.prototype.add = function(x, y, z, w) {
        this.data.push(Number(x), Number(y), Number(z), Number(w));
    };

    /**
     * Finds the the vertex data in the shape.
     * @param  {Number} x          The x component of this vertex data.
     * @param  {Number} y          The y component of this vertex data.
     * @param  {Number} z          The z component of this vertex data.
     * @param  {Number} w          The w component of this vertex data.
     * @param  {Number} [epsilon]  The epsilon comparison.
     * @return  {Number}  The index found or -1 if not found.
     */
    Vertex4DataBuffer.prototype.find = function(x, y, z, w, epsilon) {
        epsilon = epsilon || 0.000001;
        for (var i = 0; i < this.data.length; i += 4) {
            if (Common.eq(this.data[i  ], x, epsilon) &&
                Common.eq(this.data[i+1], y, epsilon) &&
                Common.eq(this.data[i+2], z, epsilon) &&
                Common.eq(this.data[i+3], w, epsilon)) {
                return i/4;
            }
        }
        return -1;
    };

    /**
     * Sets vertex data to the shape.
     * @param  {Number} index  The index to set.
     * @param  {Number} x      The x component of this vertex data.
     * @param  {Number} y      The y component of this vertex data.
     * @param  {Number} z      The z component of this vertex data.
     * @param  {Number} w      The w component of this vertex data.
     */
    Vertex4DataBuffer.prototype.set = function(index, x, y, z, w) {
        this.data[index*4  ] = Number(x);
        this.data[index*4+1] = Number(y);
        this.data[index*4+2] = Number(z);
        this.data[index*4+3] = Number(z);
    };

    /**
     * Gets vertex data from the shape.
     * @param  {Number} index  The index to get.
     * @returns  {Array}  The data from the shape.
     */
    Vertex4DataBuffer.prototype.get = function(index) {
        return [ this.data[index*4], this.data[index*4+1], this.data[index*4+2], this.data[index*4+3] ];
    };

    /**
     * Gets the current number of datum.
     * @returns  {Number}  The count of datum.
     */
    Vertex4DataBuffer.prototype.count = function() {
        return this.data.length/4;
    };

    //======================================================================

    /**
     * An object used to create a shape.
     */
    function ShapeBuilder() {

        /**
         * The buffer of x, y, z in-line triplets of vertex position data.
         * @type {Array}
         */
        this.pos = new Vertex3DataBuffer(Const.POS);

        /**
         * The buffer of r, g, b in-line triplets of vertex color data.
         * @type {Array}
         */
        this.clr3 = new Vertex3DataBuffer(Const.CLR3);

        /**
         * The buffer of r, g, b, a in-line triplets of vertex color data.
         * @type {Array}
         */
        this.clr4 = new Vertex4DataBuffer(Const.CLR4);

        /**
         * The buffer of x, y, z in-line triplets of vertex normal data.
         * @type {Array}
         */
        this.norm = new Vertex3DataBuffer(Const.NORM);

        /**
         * The buffer of u, v in-line tuple of vertex color data.
         * @type {Array}
         */
        this.txt = new Vertex2DataBuffer(Const.TXT);

        /**
         * The buffer of u, v, w in-line tuple of vertex color data.
         * @type {Array}
         */
        this.cube = new Vertex3DataBuffer(Const.CUBE);

        /**
         * The list of all vertex data buffers.
         * @type {Array}
         */
        this.data = [ this.pos, this.clr3, this.clr4, this.norm, this.txt, this.cube ];
        
        /**
         * The list of indices for points.
         * Each index is a point.
         * @private
         * @type {Array}
         */
        this._indicesPoints = [];
        
        /**
         * The list of index pairs for lines.
         * Each pair is a line.
         * @private
         * @type {Array}
         */
        this._indicesLines = [];
        
        /**
         * The current line strip indices being worked on.
         * Each point is connected to the previous to create lines,
         * with the exception of the first and last points.
         * @private
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
         * @private
         * @type {Array}
         */
        this._curLineLoops = null;
        
        /**
         * The list of line loop indices.
         * @private
         * @type {Array}
         */
        this._indicesLineLoops = [];

        /**
         * The list of triangle indices.
         * @private
         * @type {Array}
         */
        this._indicesTris = [];

        /**
         * The list of quadrilateral indices.
         * @private
         * @type {Array}
         */
        this._indicesQuads = [];
        
        /**
         * The current triangle strip indices being worked on.
         * @private
         * @type {Array}
         */
        this._curTriStrips = null;
        
        /**
         * The list of triangle strip indices.
         * @private
         * @type {Array}
         */
        this._indicesTriStrips = [];
        
        /**
         * This current triangle fan indices being worked on.
         * @private
         * @type {Array}
         */
        this._curTriFans = null;
        
        /**
         * The list of triangle fan indices.
         * @private
         * @type {Array}
         */
        this._indicesTriFans = [];
    }

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
            throw 'Error: Must start a line strip before adding to it.';
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
            throw 'Error: Must start a line loop before adding to it.';
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
            throw 'Error: Must start a triangle strip before adding to it.';
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
            throw 'Error: Must start a triangle fan before adding to it.';
        }
        for (var i = 0; i < arguments.length; i++) {
            this._curTriFans.push(Number(arguments[i]));
        }
    };
    
    //======================================================================
    
    /**
     * Build a shape with the set data.
     * @param  {WebGLRenderingContext} gl  The graphical object to build the shape for.
     * @param  {Number} [vertexType]  The vertex type to build.
     *                                If not provided, all the defined types are used.
     * @returns  {Shape}  The built shape for the graphical object.
     */
    ShapeBuilder.prototype.build = function(gl, vertexType) {
        var vertices = this._buildVertices(gl, vertexType);
        var indexObjs = this._buildIndices(gl, vertices.length);
        return new Shape(gl, vertices.type, vertices.size, vertices.buffer, indexObjs);
    };
    
    /**
     * Builds the vertices for a shape.
     * @param  {WebGLRenderingContext} gl  The graphical object to build the shape for.
     * @param  {Number} [vertexType]  The vertex type to build.
     *                                If not provided, all the defined types are used.
     * @returns  {Object} The buffer, buffer length, vertex type, and vertex size.
     */
    ShapeBuilder.prototype._buildVertices = function(gl, vertexType) {
        vertexType = vertexType || (Const.POS|Const.CLR3|Const.CLR4|Const.NORM|Const.TXT|Const.CUBE);
        if (!(vertexType&Const.POS)) {
            throw 'Error: Must have at least the positional vertex type.';
        }

        // Collect information about the vertex arrays.
        var newVertexType = Const.NONE;
        var vertexSize = 0;
        var len = this.pos.count();
        if (len <= 0) {
            throw 'Error: Must have at least one vertex.';
        }

        // Determine prepared types.
        var i, datum;
        var hasData = new Array(this.data.length);
        for (i = 0; i < this.data.length; i++) {
            datum = this.data[i];
            hasData[i] = false;
            if ((vertexType&datum.type) && (datum.count() > 0)) {
                if (datum.count() !== len) {
                    throw 'Error: The '+Common.typeString(datum.type)+
                    ' count, '+datum.count()+', must match the vertex count, '+len+'.';
                }
                newVertexType |= datum.type;
                vertexSize += datum.size();
                hasData[i] = true;
            }
        }

        // Pack the vertices.
        var vertices = new Array(len*vertexSize);
        for (i = 0, j = 0; i < len; i++) {
            for (var k = 0; k < this.data.length; k++) {
                if (hasData[k]) {
                    datum = this.data[k];
                    vec = datum.get(i);
                    for (var l = 0; l < datum.size(); l++) {
                        vertices[j++] = vec[l];
                    }
                }
            }
        }
        
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
     * @param  {WebGLRenderingContext} gl  The graphical object to build the shape for.
     * @param  {Number} [vertexType]  The vertex type to build.
     *                                If not provided, all the defined types are used.
     * @returns  {Array}  The list of index objects.
     */
    ShapeBuilder.prototype._buildIndices = function(gl, len) {
        var i, j;
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
            for (i = 0; i < this._indicesPoints.length; i++) {
                index = this._indicesPoints[i];
                if ((index < 0) || (index >= len)) {
                    throw 'Error: The point index, '+index+', at '+i+' was not in [0..'+len+').';
                }
                indices.push(index);
            }
            addIndexObj(gl.POINTS);
        }
        
        // Copy the line indices and check the indices range.
        if (this._indicesLines.length > 0) {
            if (lineStrip.length%2 !== 0) {
                throw 'Error: The lines must be in groups of two, it has '+lineStrip.length+'.';
            }
            for (i = 0; i < this._indicesLines.length; i++) {
                index = this._indicesLines[i];
                if ((index < 0) || (index >= len)) {
                    throw 'Error: The line index, '+index+', at '+i+' was not in [0..'+len+').';
                }
                indices.push(index);
            }
            addIndexObj(gl.LINES);
        }
        
        // Copy the line strips indices and check the indices range.
        for (i = 0; i < this._indicesLineStrips.length; i++) {
            var lineStrip = this._indicesLineStrips[i];
            if (lineStrip.length < 2) {
                throw 'Error: The line loop at '+i+' must have at least two indices.';
            }
            for (j = 0; j < lineStrip.length; j++) {
                index = lineStrip[j];
                if ((index < 0) || (index >= len)) {
                    throw 'Error: The line strip index, '+index+', at '+j+' in '+i+' was not in [0..'+len+').';
                }
                indices.push(index);
            }
            addIndexObj(gl.LINE_STRIP);
        }
        
        // Copy the line loops indices and check the indices range.
        if (this._indicesLineLoops.length > 0) {
            for (i = 0; i < this._indicesLineLoops.length; i++) {
                var lineLoop = this._indicesLineLoops[i];
                if (lineLoop.length < 3) {
                    throw 'Error: The line loop at '+i+' must have at least three indices.';
                }
                for (j = 0; j < lineLoop.length; j++) {
                    index = lineLoop[j];
                    if ((index < 0) || (index >= len)) {
                        throw 'Error: The line loop index, '+index+', at '+j+' in '+i+' was not in [0..'+len+').';
                    }
                    indices.push(index);
                }
                addIndexObj(gl.LINE_LOOP);
            }
        }
        
        // Copy the triangles and check the indices range.
        if (this._indicesTris.length > 0) {
            if (this._indicesTris.length%3 !== 0) {
                throw 'Error: The triangles must be in groups of three, it has '+this._indicesTris.length+'.';
            }
            for (i = 0; i < this._indicesTris.length; i++) {
                index = this._indicesTris[i];
                if ((index < 0) || (index >= len)) {
                    throw 'Error: The triangle index, '+index+', at '+i+' was not in [0..'+len+').';
                }
                indices.push(index);
            }
            addIndexObj(gl.TRIANGLES);
        }
        
        // Copy the quads and check the indices range.
        if (this._indicesQuads.length > 0) {
            if (this._indicesQuads.length%4 !== 0) {
                throw 'Error: The quadrilaterals must be in groups of four, it has '+this._indicesQuads.length+'.';
            }
            for (i = 0; i < this._indicesQuads.length; i += 4) {
                for (j = 0; j < 4; j++) {
                    index = this._indicesQuads[i+j];
                    if ((index < 0) || (index >= len)) {
                        throw 'Error: The quads index, '+index+', at '+j+' in '+i+' was not in [0..'+len+').';
                    }
                    indices.push(index);
                }
                addIndexObj(gl.TRIANGLE_FAN);
            }
        }
        
        // Copy the triangle strips indices and check the indices range.
        for (i = 0; i < this._indicesTriStrips.length; i++) {
            var triStrip = this._indicesTriStrips[i];
            if (triStrip.length < 3) {
                throw 'Error: The triangle strip at '+i+' must have at least three indices.';
            }
            for (j = 0; j < triStrip.length; j++) {
                index = triStrip[j];
                if ((index < 0) || (index >= len)) {
                    throw 'Error: The triangle strip index, '+index+', at '+j+' in '+i+' was not in [0..'+len+').';
                }
                indices.push(index);
            }
            addIndexObj(gl.TRIANGLE_STRIP);
        }
        
        // Copy the triangle fan indices and check the indices range.
        for (i = 0; i < this._indicesTriFans.length; i++) {
            var triFan = this._indicesTriFans[i];
            if (triFan.length < 3) {
                throw 'Error: The triangle fan at '+i+' must have at least three indices.';
            }
            for (j = 0; j < triFan.length; j++) {
                index = triFan[j];
                if ((index < 0) || (index >= len)) {
                    throw 'Error: The triangle fan index, '+index+', at '+j+' in '+i+' was not in [0..'+len+').';
                }
                indices.push(index);
            }
            addIndexObj(gl.TRIANGLE_FAN);
        }
        
        if (indexObjs.length < 1) {
            throw 'Error: Must have at least one index object.';
        }
        return indexObjs;
    };

    return ShapeBuilder;
});
