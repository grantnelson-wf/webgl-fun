define(function(require) {

    var Const = require('tools/const');
    var Common = require('tools/common');
    var Buffers = require('shapes/buffers')

    /**
     * A graphical shape object.
     * @param  {Number} vertexType  The vertex type.
     * @param  {Number} vertexSize  The vertex size.
     * @param  {Object} vertexBuf   The vertex buffer.
     * @param  {Array} indexObjs    The index information.
     */
    function ShapeAttr(gl, type, offset, stride) {
        this._gl     = gl;
        this._type   = type;
        this._offset = offset;
        this._stride = stride;
        this._size   = Common.typeSize(this._type);
        this._attr   = null;
    }

    /**
     * Gets the attribute type.
     * @type {Number}
     */
    Shape.prototype.type = function() {
        return this._type;
    };

    /**
     * TODO: Comment
     * @param {[type]} attr [description]
     */
    ShapeAttr.prototype.set = function(attr) {
        this._attr = attr;
    }

    /**
     * Binds the attribute for the vertex before a draw.
     * @note  Should only be called by the shape object.
     */
    ShapeAttr.prototype.bind = function() {
        if ((this._attr === null) || (this._attr === undefined)) {
            throw 'Must set the attribute for '+Common.typeString(this._type)+' before calling draw.'; 
        } else {
            this._gl.enableVertexAttribArray(this._attr);
            this._gl.vertexAttribPointer(this._attr, this._size, this._gl.FLOAT, false, this._stride, this._offset);
        }
    };

    /**
     * Unbinds the attribute for the vertex before a draw.
     * @note  Should only be called by the shape object.
     */
    ShapeAttr.prototype.unbind = function() {
        this._gl.disableVertexAttribArray(this._attr);
    };

    //======================================================================

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
         * TODO: Comment
         * @private
         * @type {Array}
         */
        this._attrs = [];

        /**
         * Sets the attribute for the vertex before a draw.
         * @private
         * @param {Number} type    The type of vertex data to set the attribute for.
         * @param {Number} size    The number of floats in the vertex type.
         * @param {Object} attr    The attribute for the vertex to draw.
         * @param {Number} offset  The offset into the vertex to read from.
         * @return  {Number}  The adjusted offset.
         */
        var setAttr = function(shape, name, type, offset) {
            if (shape._vertexType&type) {
                var stride = shape._vertexSize*Float32Array.BYTES_PER_ELEMENT;
                var attr = new ShapeAttr(shape._gl, type, offset, stride);
                shape[name] = attr;
                shape._attrs.push(attr);
                offset += Common.typeSize(type)*Float32Array.BYTES_PER_ELEMENT;
            }
            return offset;
        };

        // Setup all attribute members.
        var offset = 0;
        offset = setAttr(this, 'posAttr',  Const.POS,  offset);
        offset = setAttr(this, 'clr3Attr', Const.CLR3, offset);
        offset = setAttr(this, 'clr4Attr', Const.CLR4, offset);
        offset = setAttr(this, 'normAttr', Const.NORM, offset);
        offset = setAttr(this, 'txtAttr',  Const.TXT,  offset);
        offset = setAttr(this, 'cubeAttr', Const.CUBE, offset);
        offset = setAttr(this, 'binmAttr', Const.BINM, offset);
        offset = setAttr(this, 'wghtAttr', Const.WGHT, offset);
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
     * Draws the shape to the graphical object.
     */
    Shape.prototype.draw = function() {
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, this._vertexBuf);

        for (var i = this._attrs.length - 1; i >= 0; i--) {
            this._attrs[i].bind();
        }

        var objCount = this._indexObjs.length;
        for (var i = 0; i < objCount; i++) {
            var indexObj = this._indexObjs[i];
            this._gl.bindBuffer(this._gl.ELEMENT_ARRAY_BUFFER, indexObj.buffer);
            this._gl.drawElements(indexObj.type, indexObj.count, this._gl.UNSIGNED_SHORT, 0);
        }

        for (var i = this._attrs.length - 1; i >= 0; i--) {
            this._attrs[i].unbind();
        }
        this._gl.bindBuffer(this._gl.ARRAY_BUFFER, null);
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
        this.pos = new Buffers.Vertex3(Const.POS);

        /**
         * The buffer of r, g, b in-line triplets of vertex color data.
         * @type {Array}
         */
        this.clr3 = new Buffers.Vertex3(Const.CLR3);

        /**
         * The buffer of r, g, b, a in-line triplets of vertex color data.
         * @type {Array}
         */
        this.clr4 = new Buffers.Vertex4(Const.CLR4);

        /**
         * The buffer of x, y, z in-line triplets of vertex normal data.
         * @type {Array}
         */
        this.norm = new Buffers.Vertex3(Const.NORM);

        /**
         * The buffer of u, v in-line tuple of vertex color data.
         * @type {Array}
         */
        this.txt = new Buffers.Vertex2(Const.TXT);

        /**
         * The buffer of u, v, w in-line triplets of vertex color data.
         * @type {Array}
         */
        this.cube = new Buffers.Vertex3(Const.CUBE);

        /**
         * The buffer of x, y, z in-line triplets of vertex binormal data.
         * @type {Array}
         */
        this.binm = new Buffers.Vertex3(Const.BINM);

        /**
         * The buffer of x in-line value of vertex weight data.
         * @type {Array}
         */
        this.wght = new Buffers.Vertex1(Const.WGHT);

        /**
         * The list of all vertex data buffers.
         * @type {Array}
         */
        this.data = [ this.pos, this.clr3, this.clr4, this.norm, this.txt, this.cube, this.binm, this.wght ];
        
        /**
         * The list of indices for points.
         * Each index is a point.
         * @type {Array}
         */
        this.points = new Buffers.PointIndices();
        
        /**
         * The list of index pairs for lines.
         * Each pair is a line.
         * @type {Array}
         */
        this.lines = new Buffers.LineIndices();
        
        /**
         * The list of line strip indices.
         * @type {Array}
         */
        this.lineStrips = new Buffers.LineStripIndices();
        
        /**
         * The list of line loop indices.
         * @type {Array}
         */
        this.lineLoops = new Buffers.LineLoopIndices();

        /**
         * The list of triangle indices.
         * @type {Array}
         */
        this.tris = new Buffers.TriIndices();

        /**
         * The list of quadrilateral indices.
         * @type {Array}
         */
        this.quads = new Buffers.QuadIndices();
        
        /**
         * The list of triangle strip indices.
         * @type {Array}
         */
        this.triStrips = new Buffers.TriStripIndices();
        
        /**
         * The list of triangle fan indices.
         * @type {Array}
         */
        this.triFans = new Buffers.TriFanIndices();

        /**
         * The list of all index buffers.
         * @type {Array}
         */
        this.indices = [ this.points, this.lines, this.lineStrips, this.lineLoops, this.tris, this.quads, this.triStrips, this.triFans ];
    }
    
    //======================================================================
    
    /**
     * Build a shape with the set data.
     * @param  {WebGLRenderingContext} gl  The graphical object to build the shape for.
     * @param  {Number} [vertexType]  The vertex type to build.
     *                                If not provided, all the defined types are used.
     * @returns  {Shape}  The built shape for the graphical object.
     */
    ShapeBuilder.prototype.build = function(gl, vertexType) {
        var vertexData = this._validateVertices(vertexType);
        this._validateIndices(vertexData.length);
        var vertexBuf = this._buildVertices(gl, vertexData);
        var indexObjs = this._buildIndices(gl);
        return new Shape(gl, vertexData.type, vertexData.size, vertexBuf, indexObjs);
    };
    
    /**
     * TODO: Comment
     * Builds the vertices for a shape.
     * @param  {Number} [vertexType]  The vertex type to build.
     *                                If not provided, all the defined types are used.
     * @returns  {Object}  The buffer length, vertex type, and vertex size.
     */
    ShapeBuilder.prototype._validateVertices = function(vertexType) {
        vertexType = vertexType || (Const.POS|Const.CLR3|Const.CLR4|Const.NORM|Const.TXT|Const.CUBE|Const.BINM|Const.WGHT);
        if (vertexType === undefined) {
            if (this.data.length) {
                vertexType = this.data[0].type;
                for (var i = this.data.length - 1; i >= 1; i--) {
                    vertexType |= this.data[i].type;
                }
            }
        }
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
        for (i = this.data.length - 1; i >= 0; i--) {
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
        
        return {
            type: newVertexType,
            size: vertexSize,
            length: len,
            hasData: hasData
        };
    };
    
    /**
     * TODO: Comment
     * Build the indices for the shape.
     */
    ShapeBuilder.prototype._validateIndices = function(len) {
        var hasIndexObjs = false;
        for (var i = 0; i < this.indices.length; i++) {
            var indices = this.indices[i];
            indices.validate(len);
            if (!indices.empty()) {
                hasIndexObjs = true;
            }
        }
        if (!hasIndexObjs) {
            throw 'Error: Must have at least one index object.';
        }
    };
    
    /**
     * Builds the vertices for a shape.
     * @param  {Number} [vertexData]  The vertex data used to build the vertices.
     * @returns  {Object}  The vertex buffer.
     */
    ShapeBuilder.prototype._buildVertices = function(gl, vertexData) {     
        // Pack the vertices.
        var vertices = new Array(vertexData.length*vertexData.size);
        for (var i = 0, j = 0; i < vertexData.length; i++) {
            for (var k = 0; k < this.data.length; k++) {
                if (vertexData.hasData[k]) {
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
        return vertexBuf;
    };
    
    /**
     * Build the indices for the shape.
     * @param  {WebGLRenderingContext} gl  The graphical object to build the shape for.
     * @returns  {Array}  The list of index objects.
     */
    ShapeBuilder.prototype._buildIndices = function(gl) {
        builder = new Buffers.IndicesBuilder();
        for (var i = 0; i < this.indices.length; i++) {
            this.indices[i].build(gl, builder);
        }
        return builder.objs();
    };
    
    //======================================================================
    
    // TODO: Create to points, to lines, to degenerate points, to degenerate lines.

    return ShapeBuilder;
});
