define(function(require) {

    var Common = require('tools/common');
    
    /**
     * A 1 value vertex buffer for building the shape.
     * @param  {Number} type  The type of the buffer this is.
     */
    function Vertex1(type) {

        /**
         * The list of x in-line tuples for vertex data.
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
    Vertex1.prototype.size = function() {
        return 1;
    };

    /**
     * Adds a vertex data to the shape.
     * @param  {Number} x  The x component of this vertex data.
     *                     Or a single element array with the x component.
     */
    Vertex1.prototype.add = function(x) {
        if (Common.isArray(x)) {
            x = x[0];
        }
        this.data.push(Number(x));
    };

    /**
     * Finds the the vertex data in the shape.
     * @param  {Number} x          The x component of this vertex data.
     *                             Or a single element array with the x component.
     * @param  {Number} [epsilon]  The epsilon comparison.
     * @return  {Number}  The index found or -1 if not found.
     */
    Vertex1.prototype.find = function(x, epsilon) {
        if (Common.isArray(x)) {
            x = x[0];
        }
        epsilon = epsilon || 0.000001;
        for (var i = 0; i < this.data.length; i++) {
            if (Common.eq(this.data[i], x, epsilon)) {
                return i;
            }
        }
        return -1;
    };

    /**
     * Sets vertex data to the shape.
     * @param  {Number} index  The index to set.
     * @param  {Number} x      The x component of this vertex data.
     *                         Or a single element array with the x component.
     */
    Vertex1.prototype.set = function(index, x) {
        if (Common.isArray(x)) {
            x = x[0];
        }
        this.data[index] = Number(x);
    };

    /**
     * Gets vertex data from the shape.
     * @param  {Number} index  The index to get.
     * @returns  {Array}  The data from the shape.
     */
    Vertex1.prototype.get = function(index) {
        return [ this.data[index] ];
    };

    /**
     * Gets the current number of datum.
     * @returns  {Number}  The count of datum.
     */
    Vertex1.prototype.count = function() {
        return this.data.length;
    };

    //======================================================================

    /**
     * A 2 value vertex buffer for building the shape.
     * @param  {Number} type  The type of the buffer this is.
     */
    function Vertex2(type) {

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
    Vertex2.prototype.size = function() {
        return 2;
    };

    /**
     * Adds a vertex data to the shape.
     * @param  {Number} x  The x component of this vertex data.
     *                     Or a two element array with the x and y component.
     * @param  {Number} y  The y component of this vertex data.
     */
    Vertex2.prototype.add = function(x, y) {
        if (Common.isArray(x)) {
            y = x[1];
            x = x[0];
        }
        this.data.push(Number(x), Number(y));
    };

    /**
     * Finds the the vertex data in the shape.
     * @param  {Number} x          The x component of this vertex data.
     *                             Or a two element array with the x and y component.
     * @param  {Number} y          The y component of this vertex data.
     *                             Or if first parameter was an array then this is the epsilon.
     * @param  {Number} [epsilon]  The epsilon comparison.
     * @return  {Number}  The index found or -1 if not found.
     */
    Vertex2.prototype.find = function(x, y, epsilon) {
        if (Common.isArray(x)) {
            epsilon = y;
            y = x[1];
            x = x[0];
        }
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
     *                         Or a two element array with the x and y component.
     * @param  {Number} y      The y component of this vertex data.
     */
    Vertex2.prototype.set = function(index, x, y) {
        if (Common.isArray(x)) {
            y = x[1];
            x = x[0];
        }
        this.data[index*2  ] = Number(x);
        this.data[index*2+1] = Number(y);
    };

    /**
     * Gets vertex data from the shape.
     * @param  {Number} index  The index to get.
     * @returns  {Array}  The data from the shape.
     */
    Vertex2.prototype.get = function(index) {
        return [ this.data[index*2], this.data[index*2+1] ];
    };

    /**
     * Gets the current number of datum.
     * @returns  {Number}  The count of datum.
     */
    Vertex2.prototype.count = function() {
        return this.data.length/2;
    };

    //======================================================================

    /**
     * A 3 value vertex buffer for building the shape.
     * @param  {Number} type  The type of the buffer this is.
     */
    function Vertex3(type) {

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
    Vertex3.prototype.size = function() {
        return 3;
    };

    /**
     * Adds a vertex data to the shape.
     * @param  {Number} x  The x component of this vertex data.
     *                     Or a two element array with the x, y, and z component.
     * @param  {Number} y  The y component of this vertex data.
     * @param  {Number} z  The z component of this vertex data.
     */
    Vertex3.prototype.add = function(x, y, z) {
        if (Common.isArray(x)) {
            z = x[2];
            y = x[1];
            x = x[0];
        }
        this.data.push(Number(x), Number(y), Number(z));
    };

    /**
     * Finds the the vertex data in the shape.
     * @param  {Number} x          The x component of this vertex data.
     *                             Or a two element array with the x, y, and z component.
     * @param  {Number} y          The y component of this vertex data.
     *                             Or if first parameter was an array then this is the epsilon.
     * @param  {Number} z          The z component of this vertex data.
     * @param  {Number} [epsilon]  The epsilon comparison.
     * @return  {Number}  The index found or -1 if not found.
     */
    Vertex3.prototype.find = function(x, y, z, epsilon) {
        if (Common.isArray(x)) {
            epsilon = y;
            z = x[2];
            y = x[1];
            x = x[0];
        }
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
     *                         Or a two element array with the x, y, and z component.
     * @param  {Number} y      The y component of this vertex data.
     * @param  {Number} z      The z component of this vertex data.
     */
    Vertex3.prototype.set = function(index, x, y, z) {
        if (Common.isArray(x)) {
            z = x[2];
            y = x[1];
            x = x[0];
        }
        this.data[index*3  ] = Number(x);
        this.data[index*3+1] = Number(y);
        this.data[index*3+2] = Number(z);
    };

    /**
     * Gets vertex data from the shape.
     * @param  {Number} index  The index to get.
     * @returns  {Array}  The data from the shape.
     */
    Vertex3.prototype.get = function(index) {
        return [ this.data[index*3], this.data[index*3+1], this.data[index*3+2] ];
    };

    /**
     * Gets the current number of datum.
     * @returns  {Number}  The count of datum.
     */
    Vertex3.prototype.count = function() {
        return this.data.length/3;
    };

    //======================================================================

    /**
     * A 4 value vertex buffer for building the shape.
     * @param  {Number} type  The type of the buffer this is.
     */
    function Vertex4(type) {

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
    Vertex4.prototype.size = function() {
        return 4;
    };

    /**
     * Adds a vertex data to the shape.
     * @param  {Number} x  The x component of this vertex data.
     *                     Or a two element array with the x, y, z, and w component.
     * @param  {Number} y  The y component of this vertex data.
     * @param  {Number} z  The z component of this vertex data.
     * @param  {Number} w  The w component of this vertex data.
     */
    Vertex4.prototype.add = function(x, y, z, w) {
        if (Common.isArray(x)) {
            w = x[3];
            z = x[2];
            y = x[1];
            x = x[0];
        }
        this.data.push(Number(x), Number(y), Number(z), Number(w));
    };

    /**
     * Finds the the vertex data in the shape.
     * @param  {Number} x          The x component of this vertex data.
     *                             Or a two element array with the x, y, z, and w component.
     * @param  {Number} y          The y component of this vertex data.
     *                             Or if first parameter was an array then this is the epsilon.
     * @param  {Number} z          The z component of this vertex data.
     * @param  {Number} w          The w component of this vertex data.
     * @param  {Number} [epsilon]  The epsilon comparison.
     * @return  {Number}  The index found or -1 if not found.
     */
    Vertex4.prototype.find = function(x, y, z, w, epsilon) {
        if (Common.isArray(x)) {
            epsilon = y;
            w = x[3];
            z = x[2];
            y = x[1];
            x = x[0];
        }
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
     *                         Or a two element array with the x, y, z, and w component.
     * @param  {Number} y      The y component of this vertex data.
     * @param  {Number} z      The z component of this vertex data.
     * @param  {Number} w      The w component of this vertex data.
     */
    Vertex4.prototype.set = function(index, x, y, z, w) {
        if (Common.isArray(x)) {
            w = x[3];
            z = x[2];
            y = x[1];
            x = x[0];
        }
        this.data[index*4  ] = Number(x);
        this.data[index*4+1] = Number(y);
        this.data[index*4+2] = Number(z);
        this.data[index*4+3] = Number(w);
    };

    /**
     * Gets vertex data from the shape.
     * @param  {Number} index  The index to get.
     * @returns  {Array}  The data from the shape.
     */
    Vertex4.prototype.get = function(index) {
        return [ this.data[index*4], this.data[index*4+1], this.data[index*4+2], this.data[index*4+3] ];
    };

    /**
     * Gets the current number of datum.
     * @returns  {Number}  The count of datum.
     */
    Vertex4.prototype.count = function() {
        return this.data.length/4;
    };

    //======================================================================

    /**
     * Creates an index builder.
     */
    function IndicesBuilder() {
        this._indices = [];
        this._indexObjs = [];
    }

    /**
     * This pushes an index into the builder.
     * @param  {Number} index  The index to push.
     */
    IndicesBuilder.prototype.push = function(index) {
        if (index === undefined) {
            throw 'Error: The point index, '+index+', was undefined.';
        } else if (isNaN(index)) {
            throw 'Error: The point index, '+index+', was NAN.';
        } else {
            this._indices.push(Number(index));
        }
    };

    /**
     * This packs all the currently pushed indices into a buffer.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {Number} type  The type elements in the buffer.
     */
    IndicesBuilder.prototype.pack = function(gl, type) {
        var indexBuf  = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuf);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this._indices), gl.STATIC_DRAW);
        this._indexObjs.push({
            type:   type,
            count:  this._indices.length,
            buffer: indexBuf
        });
        this._indices = [];
    };

    /**
     * All the packed index objects.
     * @return  {Array}  The array of index objects.
     */
    IndicesBuilder.prototype.objs = function() {
        return this._indexObjs;
    };

    //======================================================================
    
    /**
     * Creates a container for point list indices.
     */
    function PointIndices() {

        /**
         * The list of indices for points.
         * Each index is a point.
         * @private
         * @type {Array}
         */
        this._indicesPoints = [];
    }

    /**
     * Determines if the indices are empty.
     * @return  {Boolean}  True if empty, false if not.
     */
    PointIndices.prototype.empty = function() {
        return this._indicesPoints.length <= 0;
    };

    /**
     * Adds a point index or point indices to the shape.
     * This appends any number of point indices.
     */
    PointIndices.prototype.add = function() {
        for (var i = 0; i < arguments.length; i++) {
            this._indicesPoints.push(Number(arguments[i]));
        }
    };

    /**
     * Validates the indices and range.
     * @param  {Number} len  The expected length.
     */
    PointIndices.prototype.validate = function(len) {
        if (this._indicesPoints.length > 0) {
            for (var i = 0; i < this._indicesPoints.length; i++) {
                index = this._indicesPoints[i];
                if ((index < 0) || (index >= len)) {
                    throw 'Error: The point index, '+index+', at '+i+' was not in [0..'+len+').';
                }
            }
        }
    };

    /**
     * This copies the indices into the given builder.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {IndicesBuilder} builder  The builder to add to.
     */
    PointIndices.prototype.build = function(gl, builder) {        
        if (this._indicesPoints.length > 0) {
            for (var i = 0; i < this._indicesPoints.length; i++) {
                builder.push(this._indicesPoints[i]);
            }
            builder.pack(gl, gl.POINTS);
        }
    };

    /**
     * This calls back all the point indices.
     * @param  {Function} callBack  The call back function.
     */
    PointIndices.prototype.eachPoint = function(callBack) {
        for (var i = 0; i < this._indicesPoints.length; i++) {
            callBack(this._indicesPoints[i]);
        }
    };

    /**
     * This calls back all the lines indices.
     * @param  {Function} callBack  The call back function.
     */
    PointIndices.prototype.eachLine = function(callBack) {
        // Do Nothing
    };

    /**
     * This calls back all the triangles indices.
     * @param  {Function} callBack  The call back function.
     */
    PointIndices.prototype.eachTri = function(callBack) {
        // Do Nothing
    };

    //======================================================================

    /**
     * Creates a container for line list indices.
     */
    function LineIndices() {

        /**
         * The list of index pairs for lines.
         * Each pair is a line.
         * @private
         * @type {Array}
         */
        this._indicesLines = [];
    }

    /**
     * Determines if the indices are empty.
     * @return  {Boolean}  True if empty, false if not.
     */
    LineIndices.prototype.empty = function() {
        return this._indicesLines.length <= 0;
    };

    /**
     * Adds line indices to the shape.
     * @param  {Number} i  The first index to add.
     * @param  {Number} j  The second index to add.
     */
    LineIndices.prototype.add = function(i, j) {
        this._indicesLines.push(Number(i), Number(j));
    };

    /**
     * Validates the indices and range.
     * @param  {Number} len  The expected length.
     */
    LineIndices.prototype.validate = function(len) {
        if (this._indicesLines.length > 0) {
            if (this._indicesLines.length%2 !== 0) {
                throw 'Error: The lines must be in groups of two, it has '+this._indicesLines.length+'.';
            }
            for (var i = 0; i < this._indicesLines.length; i++) {
                index = this._indicesLines[i];
                if ((index < 0) || (index >= len)) {
                    throw 'Error: The line index, '+index+', at '+i+' was not in [0..'+len+').';
                }
            }
        }
    };

    /**
     * This copies the indices into the given builder.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {IndicesBuilder} builder  The builder to add to.
     */
    LineIndices.prototype.build = function(gl, builder) {  
        if (this._indicesLines.length > 0) {
            for (var i = 0; i < this._indicesLines.length; i++) {
                builder.push(this._indicesLines[i]);
            }
            builder.pack(gl, gl.LINES);
        } 
    };

    /**
     * This calls back all the point indices.
     * @param  {Function} callBack  The call back function.
     */
    LineIndices.prototype.eachPoint = function(callBack) {
        for (var i = 0; i < this._indicesLines.length; i++) {
            callBack(this._indicesLines[i]);
        }
    };

    /**
     * This calls back all the lines indices.
     * @param  {Function} callBack  The call back function.
     */
    LineIndices.prototype.eachLine = function(callBack) {
        for (var i = 0; i < this._indicesLines.length; i += 2) {
            callBack(this._indicesLines[i], this._indicesLines[i+1]);
        }
    };

    /**
     * This calls back all the triangles indices.
     * @param  {Function} callBack  The call back function.
     */
    LineIndices.prototype.eachTri = function(callBack) {
        // Do Nothing
    };

    //======================================================================

    /**
     * Creates a container for line strip indices.
     */
    function LineStripIndices() {
        
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
    }

    /**
     * Determines if the indices are empty.
     * @return  {Boolean}  True if empty, false if not.
     */
    LineStripIndices.prototype.empty = function() {
        return ((!this._curLineStrips) || (this._curLineStrips.length <= 0)) &&
            (this._indicesLineStrips.length <= 0);
    };


    /**
     * Starts a new line strip and adds line strip indices to the shape.
     * This may also append any number of line strip indices.
     */
    LineStripIndices.prototype.start = function() {
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
    LineStripIndices.prototype.add = function() {
        if (this._curLineStrips === null) {
            throw 'Error: Must start a line strip before adding to it.';
        }
        for (var i = 0; i < arguments.length; i++) {
            this._curLineStrips.push(Number(arguments[i]));
        }
    };
    
    /**
     * Validates the indices and range.
     * @param  {Number} len  The expected length.
     */
    LineStripIndices.prototype.validate = function(len) {
        for (var i = 0; i < this._indicesLineStrips.length; i++) {
            var lineStrip = this._indicesLineStrips[i];
            if (lineStrip.length < 2) {
                throw 'Error: The line loop at '+i+' must have at least two indices.';
            }
            for (var j = 0; j < lineStrip.length; j++) {
                index = lineStrip[j];
                if ((index < 0) || (index >= len)) {
                    throw 'Error: The line strip index, '+index+', at '+j+' in '+i+' was not in [0..'+len+').';
                }
            }
        }
    };

    /**
     * This copies the indices into the given builder.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {IndicesBuilder} builder  The builder to add to.
     */
    LineStripIndices.prototype.build = function(gl, builder) {
        for (var i = 0; i < this._indicesLineStrips.length; i++) {
            var lineStrip = this._indicesLineStrips[i];
            for (var j = 0; j < lineStrip.length; j++) {
                builder.push(lineStrip[j]);
            }
            builder.pack(gl, gl.LINE_STRIP);
        }
    };

    /**
     * This calls back all the point indices.
     * @param  {Function} callBack  The call back function.
     */
    LineStripIndices.prototype.eachPoint = function(callBack) {
        for (var i = 0; i < this._indicesLineStrips.length; i++) {
            var lineStrip = this._indicesLineStrips[i];
            for (var j = 0; j < lineStrip.length; j++) {
                callBack(lineStrip[j]);
            }
        }
    };

    /**
     * This calls back all the lines indices.
     * @param  {Function} callBack  The call back function.
     */
    LineStripIndices.prototype.eachLine = function(callBack) {
        for (var i = 0; i < this._indicesLineStrips.length; i++) {
            var lineStrip = this._indicesLineStrips[i];
            for (var j = 0; j < lineStrip.length; j += 2) {
                callBack(lineStrip[j], lineStrip[j+1]);
            }
        }
    };

    /**
     * This calls back all the triangles indices.
     * @param  {Function} callBack  The call back function.
     */
    LineStripIndices.prototype.eachTri = function(callBack) {
        // Do Nothing
    };

    //======================================================================

    /**
     * Creates a container for line loop indices.
     */
    function LineLoopIndices() {

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
    }

    /**
     * Determines if the indices are empty.
     * @return  {Boolean}  True if empty, false if not.
     */
    LineLoopIndices.prototype.empty = function() {
        return ((!this._curLineLoops) || (this._curLineLoops.length <= 0)) &&
            (this._indicesLineLoops.length <= 0);
    };

    /**
     * Starts a new line loop and adds line loop indices to the shape.
     * This may also append any number of line loop indices.
     */
    LineLoopIndices.prototype.start = function() {
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
    LineLoopIndices.prototype.add = function() {
        if (this._curLineLoops === null) {
            throw 'Error: Must start a line loop before adding to it.';
        }
        for (var i = 0; i < arguments.length; i++) {
            this._curLineLoops.push(Number(arguments[i]));
        }
    };
        
    /**
     * Validates the indices and range.
     * @param  {Number} len  The expected length.
     */
    LineLoopIndices.prototype.validate = function(len) {
        if (this._indicesLineLoops.length > 0) {
            for (var i = 0; i < this._indicesLineLoops.length; i++) {
                var lineLoop = this._indicesLineLoops[i];
                if (lineLoop.length < 3) {
                    throw 'Error: The line loop at '+i+' must have at least three indices.';
                }
                for (var j = 0; j < lineLoop.length; j++) {
                    index = lineLoop[j];
                    if ((index < 0) || (index >= len)) {
                        throw 'Error: The line loop index, '+index+', at '+j+' in '+i+' was not in [0..'+len+').';
                    }
                }
            }
        }
    };

    /**
     * This copies the indices into the given builder.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {IndicesBuilder} builder  The builder to add to.
     */
    LineLoopIndices.prototype.build = function(gl, builder) {
        if (this._indicesLineLoops.length > 0) {
            for (var i = 0; i < this._indicesLineLoops.length; i++) {
                var lineLoop = this._indicesLineLoops[i];
                for (var j = 0; j < lineLoop.length; j++) {
                    builder.push(lineLoop[j]);
                }
                builder.pack(gl, gl.LINE_LOOP);
            }
        }
    };

    /**
     * This calls back all the point indices.
     * @param  {Function} callBack  The call back function.
     */
    LineLoopIndices.prototype.eachPoint = function(callBack) {
        for (var i = 0; i < this._indicesLineLoops.length; i++) {
            var lineLoop = this._indicesLineLoops[i];
            for (var j = 0; j < lineLoop.length; j++) {
                callBack(lineLoop[j]);
            }
        }
    };

    /**
     * This calls back all the lines indices.
     * @param  {Function} callBack  The call back function.
     */
    LineLoopIndices.prototype.eachLine = function(callBack) {
        for (var i = 0; i < this._indicesLineLoops.length; i++) {
            var lineLoop = this._indicesLineLoops[i];
            for (var j = 0; j < lineLoop.length; j += 2) {
                callBack(lineLoop[j], lineLoop[j+1]);
            }
            callBack(lineLoop[lineLoop.length-1], lineLoop[0]);
        }
    };

    /**
     * This calls back all the triangles indices.
     * @param  {Function} callBack  The call back function.
     */
    LineLoopIndices.prototype.eachTri = function(callBack) {
        // Do Nothing
    };
    
    //======================================================================

    /**
     * Creates a container for triangle list indices.
     */
    function TriIndices() {

        /**
         * The list of triangle indices.
         * @private
         * @type {Array}
         */
        this._indicesTris = [];
    }

    /**
     * Determines if the indices are empty.
     * @return  {Boolean}  True if empty, false if not.
     */
    TriIndices.prototype.empty = function() {
        return this._indicesTris.length <= 0;
    };

    /**
     * Adds triangle indices to the shape.
     * @param  {Number} i  The first index to add.
     * @param  {Number} j  The second index to add.
     * @param  {Number} k  The third index to add.
     */
    TriIndices.prototype.add = function(i, j, k) {
        this._indicesTris.push(Number(i), Number(j), Number(k));
    };
        
    /**
     * Validates the indices and range.
     * @param  {Number} len  The expected length.
     */
    TriIndices.prototype.validate = function(len) {
        if (this._indicesTris.length > 0) {
            if (this._indicesTris.length%3 !== 0) {
                throw 'Error: The triangles must be in groups of three, it has '+this._indicesTris.length+'.';
            }
            for (var i = 0; i < this._indicesTris.length; i++) {
                index = this._indicesTris[i];
                if ((index < 0) || (index >= len)) {
                    throw 'Error: The triangle index, '+index+', at '+i+' was not in [0..'+len+').';
                }
            }
        }
    };

    /**
     * This copies the indices into the given builder.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {IndicesBuilder} builder  The builder to add to.
     */
    TriIndices.prototype.build = function(gl, builder) {
        if (this._indicesTris.length > 0) {
            for (var i = 0; i < this._indicesTris.length; i++) {
                builder.push(this._indicesTris[i]);
            }
            builder.pack(gl, gl.TRIANGLES);
        }
    };

    /**
     * This calls back all the point indices.
     * @param  {Function} callBack  The call back function.
     */
    TriIndices.prototype.eachPoint = function(callBack) {
        for (var i = 0; i < this._indicesTris.length; i++) {
            callBack(this._indicesTris[i]);
        }
    };

    /**
     * This calls back all the lines indices.
     * @param  {Function} callBack  The call back function.
     */
    TriIndices.prototype.eachLine = function(callBack) {
        for (var i = 0; i < this._indicesTris.length; i += 3) {
            callBack(this._indicesTris[i  ], this._indicesTris[i+1]);
            callBack(this._indicesTris[i+1], this._indicesTris[i+2]);
            callBack(this._indicesTris[i+2], this._indicesTris[i  ]);
        }
    };

    /**
     * This calls back all the triangles indices.
     * @param  {Function} callBack  The call back function.
     */
    TriIndices.prototype.eachTri = function(callBack) {
        for (var i = 0; i < this._indicesTris.length; i += 3) {
            callBack(this._indicesTris[i], this._indicesTris[i+1], this._indicesTris[i+2]);
        }
    };

    //======================================================================

    /**
     * Creates a container for quad list indices.
     */
    function QuadIndices() {

        /**
         * The list of quadrilateral indices.
         * @private
         * @type {Array}
         */
        this._indicesQuads = [];
    }

    /**
     * Determines if the indices are empty.
     * @return  {Boolean}  True if empty, false if not.
     */
    QuadIndices.prototype.empty = function() {
        return this._indicesQuads.length <= 0;
    };

    /**
     * Adds quadrilateral indices to the shape.
     * @param  {Number} i  The first index to add.
     * @param  {Number} j  The second index to add.
     * @param  {Number} k  The third index to add.
     * @param  {Number} l  The forth index to add.
     */
    QuadIndices.prototype.add = function(i, j, k, l) {
        this._indicesQuads.push(Number(i), Number(j), Number(k), Number(l));
    };
        
    /**
     * Validates the indices and range.
     * @param  {Number} len  The expected length.
     */
    QuadIndices.prototype.validate = function(len) {
        if (this._indicesQuads.length > 0) {
            if (this._indicesQuads.length%4 !== 0) {
                throw 'Error: The quadrilaterals must be in groups of four, it has '+this._indicesQuads.length+'.';
            }
            for (var i = 0; i < this._indicesQuads.length; i += 4) {
                for (var j = 0; j < 4; j++) {
                    index = this._indicesQuads[i+j];
                    if ((index < 0) || (index >= len)) {
                        throw 'Error: The quads index, '+index+', at '+j+' in '+i+' was not in [0..'+len+').';
                    }
                }
            }
        }
    };

    /**
     * This copies the indices into the given builder.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {IndicesBuilder} builder  The builder to add to.
     */
    QuadIndices.prototype.build = function(gl, builder) {
        if (this._indicesQuads.length > 0) {
            for (var i = 0; i < this._indicesQuads.length; i += 4) {
                for (var j = 0; j < 4; j++) {
                    builder.push(this._indicesQuads[i+j]);
                }
                builder.pack(gl, gl.TRIANGLE_FAN);
            }
        }
    };

    /**
     * This calls back all the point indices.
     * @param  {Function} callBack  The call back function.
     */
    QuadIndices.prototype.eachPoint = function(callBack) {
        for (var i = 0; i < this._indicesQuads.length; i += 4) {
            for (var j = 0; j < 4; j++) {
                callBack(this._indicesQuads[i+j]);
            }
        }
    };

    /**
     * This calls back all the lines indices.
     * @param  {Function} callBack  The call back function.
     */
    QuadIndices.prototype.eachLine = function(callBack) {
        for (var i = 0; i < this._indicesQuads.length; i += 4) {
            callBack(this._indicesQuads[i  ], this._indicesQuads[i+1]);
            callBack(this._indicesQuads[i+1], this._indicesQuads[i+2]);
            callBack(this._indicesQuads[i+2], this._indicesQuads[i+3]);
            callBack(this._indicesQuads[i+3], this._indicesQuads[i  ]);
        }
    };

    /**
     * This calls back all the triangles indices.
     * @param  {Function} callBack  The call back function.
     */
    QuadIndices.prototype.eachTri = function(callBack) {
        for (var i = 0; i < this._indicesQuads.length; i += 4) {
            callBack(this._indicesQuads[i  ], this._indicesQuads[i+1], this._indicesQuads[i+2]);
            callBack(this._indicesQuads[i  ], this._indicesQuads[i+2], this._indicesQuads[i+3]);
        }
    };

    //======================================================================

    /**
     * Creates a container for triangle strip indices.
     */
    function TriStripIndices() {

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
    }

    /**
     * Determines if the indices are empty.
     * @return  {Boolean}  True if empty, false if not.
     */
    TriStripIndices.prototype.empty = function() {
        return ((!this._curTriStrips) || (this._curTriStrips.length <= 0)) &&
            (this._indicesTriStrips.length <= 0);
    };

    /**
     * Starts a new triangle strip and adds triangle strip indices to the shape.
     * This may also append any number of triangle strip indices.
     */
    TriStripIndices.prototype.start = function() {
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
    TriStripIndices.prototype.add = function() {
        if (this._curTriStrips === null) {
            throw 'Error: Must start a triangle strip before adding to it.';
        }
        for (var i = 0; i < arguments.length; i++) {
            this._curTriStrips.push(Number(arguments[i]));
        }
    };
        
    /**
     * Validates the indices and range.
     * @param  {Number} len  The expected length.
     */
    TriStripIndices.prototype.validate = function(len) {
        for (var i = 0; i < this._indicesTriStrips.length; i++) {
            var triStrip = this._indicesTriStrips[i];
            if (triStrip.length < 3) {
                throw 'Error: The triangle strip at '+i+' must have at least three indices.';
            }
            for (var j = 0; j < triStrip.length; j++) {
                index = triStrip[j];
                if ((index < 0) || (index >= len)) {
                    throw 'Error: The triangle strip index, '+index+', at '+j+' in '+i+' was not in [0..'+len+').';
                }
            }
        }
    };

    /**
     * This copies the indices into the given builder.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {IndicesBuilder} builder  The builder to add to.
     */
    TriStripIndices.prototype.build = function(gl, builder) {
        for (var i = 0; i < this._indicesTriStrips.length; i++) {
            var triStrip = this._indicesTriStrips[i];
            for (var j = 0; j < triStrip.length; j++) {
                builder.push(triStrip[j]);
            }
            builder.pack(gl, gl.TRIANGLE_STRIP);
        }
    };

    /**
     * This calls back all the point indices.
     * @param  {Function} callBack  The call back function.
     */
    TriStripIndices.prototype.eachPoint = function(callBack) {
        for (var i = 0; i < this._indicesTriStrips.length; i++) {
            var triStrip = this._indicesTriStrips[i];
            for (var j = 0; j < triStrip.length; j++) {
                callBack(triStrip[j]);
            }
        }
    };

    /**
     * This calls back all the lines indices.
     * @param  {Function} callBack  The call back function.
     */
    TriStripIndices.prototype.eachLine = function(callBack) {
        for (var i = 0; i < this._indicesTriStrips.length; i++) {
            var triStrip = this._indicesTriStrips[i];
            callBack(triStrip[0], triStrip[1]);
            for (var j = 2; j < triStrip.length; j++) {
                callBack(triStrip[j-1], triStrip[j]);
                callBack(triStrip[j-2], triStrip[j]);
            }
        }
    };

    /**
     * This calls back all the triangles indices.
     * @param  {Function} callBack  The call back function.
     */
    TriStripIndices.prototype.eachTri = function(callBack) {
        for (var i = 0; i < this._indicesTriStrips.length; i++) {
            var triStrip = this._indicesTriStrips[i];
            var flip = false;
            for (var j = 2; j < triStrip.length; j++) {
                if (flip) {
                    callBack(triStrip[j-1], triStrip[j-2], triStrip[j]);
                } else {
                    callBack(triStrip[j-2], triStrip[j-1], triStrip[j]);
                }
                flip = !flip;
            }
        }
    };

    //======================================================================

    /**
     * Creates a container for triangle fan indices.
     */
    function TriFanIndices() {
        
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

    /**
     * Determines if the indices are empty.
     * @return  {Boolean}  True if empty, false if not.
     */
    TriFanIndices.prototype.empty = function() {
        return ((!this._curTriFans) || (this._curTriFans.length <= 0)) &&
            (this._indicesTriFans.length <= 0);
    };

    /**
     * Starts a new triangle fan and adds triangle fan indices to the shape.
     * This may also append any number of triangle fan indices.
     */
    TriFanIndices.prototype.start = function() {
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
    TriFanIndices.prototype.add = function() {
        if (this._curTriFans === null) {
            throw 'Error: Must start a triangle fan before adding to it.';
        }
        for (var i = 0; i < arguments.length; i++) {
            this._curTriFans.push(Number(arguments[i]));
        }
    };
        
    /**
     * Validates the indices and range.
     * @param  {Number} len  The expected length.
     */
    TriFanIndices.prototype.validate = function(len) {
        for (var i = 0; i < this._indicesTriFans.length; i++) {
            var triFan = this._indicesTriFans[i];
            if (triFan.length < 3) {
                throw 'Error: The triangle fan at '+i+' must have at least three indices.';
            }
            for (var j = 0; j < triFan.length; j++) {
                index = triFan[j];
                if ((index < 0) || (index >= len)) {
                    throw 'Error: The triangle fan index, '+index+', at '+j+' in '+i+' was not in [0..'+len+').';
                }
            }
        }
    };

    /**
     * This copies the indices into the given builder.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {IndicesBuilder} builder  The builder to add to.
     */
    TriFanIndices.prototype.build = function(gl, builder) {
        for (var i = 0; i < this._indicesTriFans.length; i++) {
            var triFan = this._indicesTriFans[i];
            for (var j = 0; j < triFan.length; j++) {
                builder.push(triFan[j]);
            }
            builder.pack(gl, gl.TRIANGLE_FAN);
        }
    };

    /**
     * This calls back all the point indices.
     * @param  {Function} callBack  The call back function.
     */
    TriFanIndices.prototype.eachPoint = function(callBack) {
        for (var i = 0; i < this._indicesTriFans.length; i++) {
            var triFan = this._indicesTriFans[i];
            for (var j = 0; j < triFan.length; j++) {
                callBack(triFan[j]);
            }
        }
    };

    /**
     * This calls back all the lines indices.
     * @param  {Function} callBack  The call back function.
     */
    TriFanIndices.prototype.eachLine = function(callBack) {
        for (var i = 0; i < this._indicesTriFans.length; i++) {
            var triFan = this._indicesTriFans[i];
            callBack(triFan[0], triFan[1]);
            for (var j = 2; j < triFan.length; j++) {
                callBack(triFan[j-1], triFan[j]);
                callBack(triFan[0], triFan[j]);
            }
        }
    };

    /**
     * This calls back all the triangles indices.
     * @param  {Function} callBack  The call back function.
     */
    TriFanIndices.prototype.eachTri = function(callBack) {
        for (var i = 0; i < this._indicesTriFans.length; i++) {
            var triFan = this._indicesTriFans[i];
            for (var j = 2; j < triFan.length; j++) {
                callBack(triFan[0], triFan[j-1], triFan[j]);
            }
        }
    };

    //======================================================================

    /**
     * Creates a set for unique indices of points.
     */
    function PointIndexSet() {
        this._set = {};
    }
    
    /**
     * This inserts a new index into this set.
     * @param  {Number} index  The point index to insert.
     */
    PointIndexSet.prototype.insert = function(index) {
        this._set[Number(index)] = true;
    };
    
    /**
     * This calls the given function for each point.
     * @param  {Function} callBack  The function to send each point index into.
     */
    PointIndexSet.prototype.eachPoint = function(callBack) {
        for (var index in this._set) {
            callBack(Number(index));
        }
    };

    //======================================================================

    /**
     * Creates a set for unique indices of lines.
     */
    function LineIndexSet() {
        this._set = {};
    }
    
    /**
     * This inserts a new index into this set.
     * @param  {Number} index1  The first point index to insert.
     * @param  {Number} index2  The second point index to insert.
     */
    LineIndexSet.prototype.insert = function(index1, index2) {
        index1 = Number(index1);
        index2 = Number(index2);

        if (index1 > index2) {
            var temp = index1;
            index1 = index2;
            index2 = temp;
        }
        
        var lines = this._set[index1];
        if (!lines) {
            lines = {};
        }
        lines[index2] = true;
        this._set[index1] = lines;
    };
    
    /**
     * This calls the given function for each line.
     * @param  {Function} callBack  The function to send each line indices into.
     */
    LineIndexSet.prototype.eachLine = function(callBack) {
        for (var index1 in this._set) {
            var lines = this._set[index1];
            for (var index2 in lines) {
                callBack(Number(index1), Number(index2));
            }
        }
    };
    
    //======================================================================
    
    /**
     * This is the container of buffer object types.
     * @type {Object}
     */
    var Buffers = {
        Vertex1:          Vertex1,
        Vertex2:          Vertex2,
        Vertex3:          Vertex3,
        Vertex4:          Vertex4,
        IndicesBuilder:   IndicesBuilder,
        PointIndices:     PointIndices,
        LineIndices:      LineIndices,
        LineStripIndices: LineStripIndices,
        LineLoopIndices:  LineLoopIndices,
        TriIndices:       TriIndices,
        QuadIndices:      QuadIndices,
        TriStripIndices:  TriStripIndices,
        TriFanIndices:    TriFanIndices,
        PointIndexSet:    PointIndexSet,
        LineIndexSet:     LineIndexSet
    };
    
    return Buffers;
});
