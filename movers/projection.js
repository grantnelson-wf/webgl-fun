define(function(require) {

    var Matrix = require('tools/matrix');

    /**
     * The projection mover creates a projection frustum matrix
     * that is horizontally and vertically proportional regardless the buffer size.
     */
    function Projection() {   
        
        /**
         * The angle in radians for the vertical field of view.
         * @type {Number}
         */
        this.fovAngle = Math.PI/3.0;
        
        /**
         * The near side of the frustum.
         * @type {Number}
         */
        this.near = 1.0;
        
        /**
         * The far side of the frustum.
         * @type {Number}
         */
        this.far = -1.0;

        /**
         * The graphical object being used.
         * @type {WebGLRenderingContext}
         */
        this._gl = null;
        
        /**
         * The matrix for this mover's projection.
         * @type {Array}
         */
        this._mat = Matrix.identity();
    }
    
    /**
     * This starts the mover.
     * @param  {WebGLRenderingContext} gl  The graphical object to start with.
     */
    Projection.prototype.start = function(gl) {
        this._gl = gl;
    };

    /**
     * Updates the mover.
     */
    Projection.prototype.update = function() {
        // Calculate the aspect ratio of horizontal over vertical.
        var aspect = this._gl.drawingBufferWidth / this._gl.drawingBufferHeight;
        this._mat = Matrix.perspective(this.fovAngle, aspect, this.near, this.far);
    };
    
    /**
     * Gets the matrix describing the mover's projection.
     * @note  The mover must be updated before this is valid.
     * @return  {Array}  The matrix for this mover.
     */
    Projection.prototype.matrix = function() {
        return this._mat;
    };

    /**
     * This stops the mover.
     */
    Projection.prototype.stop = function(gl) {
        // Do Nothing
    };

    return Projection;
});
