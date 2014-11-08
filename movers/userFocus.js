define(function(require) {

    var Matrix = require('tools/matrix');

    /**
     * The user focus mover will rotate around the origin
     * using the user's mouse movements.
     */
    function UserFocus() {

        /**
         * The scalar to apply to the mouse movements in the x axis.
         * @type {Number}
         */
        this.mouseXScalar = 0.005;

        /**
         * The scalar to apply to the mouse movements in the y axis.
         * @type {Number}
         */
        this.mouseYScalar = 0.005;

        /**
         * The scalar to apply to the mouse wheel in the y axis.
         * @type {Number}
         */
        this.wheelYScalar = 0.005;

        /**
         * The target of the camera pre-rotation.
         * @type {Array}
         */
        this.target = [0, 0, 0];

        /**
         * The upward direction of the camera pre-rotation.
         * @type {Array}
         */
        this.up = [0, -1, 0];

        /**
         * The location of the camera pre-rotation.
         * @type {Array}
         */
        this.location = [0, 0, -2];
        
        /**
         * The maximum allowed pitch rotation in radians.
         * @type {Number}
         */
        this.maxPitch = Math.PI * 0.5;
        
        /**
         * The minimum allowed pitch rotation in radians.
         * @type {Number}
         */
        this.minPitch = -Math.PI * 0.5;
        
        /**
         * The maximum allowed scalar.
         * @type {Number}
         */
        this.maxScalar = 10.0;
        
        /**
         * The minimum allowed scalar.
         * @type {Number}
         */
        this.minScalar = 0.1;

        /**
         * The graphical object being used.
         * @type {WebGLRenderingContext}
         */
        this._gl = null;

        /**
         * The yaw rotation in radians.
         * @type {Number}
         */
        this._yaw = 0;
        
        /**
         * The pitch rotation in radians.
         * @type {Number}
         */
        this._pitch = 0;
        
        /**
         * The scalar for zooming the world.
         * @type {Number}
         */
        this._scalar = 1.0;
        
        /**
         * Indicates a mouse button is pressed.
         * @type {Boolean}
         */
        this._mouseDown = false;
        
        /**
         * The mouse x location when the button was pressed.
         * @type {Number}
         */
        this._lastMouseX = 0;
        
        /**
         * The mouse y location when the button was pressed.
         * @type {Number}
         */
        this._lastMouseY = 0;
        
        /**
         * The yaw rotation in radians when the button was pressed.
         * @type {Number}
         */
        this._lastYaw = 0;
        
        /**
         * The pitch rotation in radians when the button was pressed.
         * @type {Number}
         */
        this._lastPitch = 0;
        
        /**
         * The matrix describing the mover's position.
         * @type {Array}
         */
        this._mat = Matrix.identity();
    }
    
    /**
     * This starts the mover.
     * @note  This sets the on mouse down and up events used by the mover.
     * @param  {WebGLRenderingContext} gl  The graphical object to start with.
     */
    UserFocus.prototype.start = function(gl) {
        this._gl = gl;
        this._mouseDown = false;
        var self = this;
        gl.canvas.onmousedown = function(event) {
            self._handleMouseDown(event);
        };
        document.onmouseup = function(event) {
            self._handleMouseUp(event);
        };
        document.onmousemove = function(event) {
            self._handleMouseMove(event);
        };
        document.onwheel = function(event) {
            self._handleMouseWheel(event);
        };
    };

    /**
     * Updates the mover.
     */
    UserFocus.prototype.update = function() {
        var mat = Matrix.scalar(this._scalar, this._scalar, this._scalar, 1.0);
        mat = Matrix.mul(mat, Matrix.rotateY(-this._yaw));
        mat = Matrix.mul(mat, Matrix.rotateX(-this._pitch));
        mat = Matrix.mul(mat, Matrix.lookat(
            this.target[0],   this.target[1],   this.target[2],
            this.up[0],       this.up[1],       this.up[2],
            this.location[0], this.location[1], this.location[2]));
        this._mat = mat;
    };
    
    /**
     * Gets the matrix describing the mover's position.
     * @note  The mover must be updated before this is valid.
     * @return  {Array}  The matrix for this mover.
     */
    UserFocus.prototype.matrix = function() {
        return this._mat;
    };

    /**
     * This stops the mover.
     */
    UserFocus.prototype.stop = function() {
        this._gl.canvas.onmousedown = null;
        document.onmouseup = null;
        document.onmousemove = null;
        document.onwheel = null;
        this._gl = null;
    };
    
    /**
     * This handles the mouse button being pressed.
     * @param  {Object} event  The mouse button event.
     */
    UserFocus.prototype._handleMouseDown = function(event) {
        this._mouseDown  = true;
        this._lastMouseX = event.clientX;
        this._lastMouseY = event.clientY;
        this._lastYaw    = this._yaw;
        this._lastPitch  = this._pitch;
    };
    
    /**
     * This handles the mouse button being released.
     * @param  {Object} event  The mouse button event.
     */
    UserFocus.prototype._handleMouseUp = function(event) {
        this._mouseDown = false;
    };
    
    /**
     * This handles the mouse button being moved.
     * @param  {Object} event  The mouse button event.
     */
    UserFocus.prototype._handleMouseMove = function(event) {
        if (this._mouseDown) {
            this._yaw   = this._lastYaw   + (event.clientX - this._lastMouseX)*this.mouseXScalar;
            this._pitch = this._lastPitch - (event.clientY - this._lastMouseY)*this.mouseYScalar;

            this._yaw = this._yaw % (Math.PI * 2);
            if (this._yaw < 0) this._yaw = this._yaw + Math.PI * 2;

            if (this._pitch > this.maxPitch) {
                this._pitch = this.maxPitch;
            }
            else if (this._pitch < this.minPitch) {
                this._pitch = this.minPitch;
            }
        }
    };
    
    /**
     * This handles the mouse wheel being moved.
     * @param  {Object} event  The mouse wheel event.
     */
    UserFocus.prototype._handleMouseWheel = function(event) {
        var delta = Number(event.deltaY)*this.wheelYScalar;
        this._scalar += delta;
        if (this._scalar > this.maxScalar) {
            this._scalar = this.maxScalar;
        }
        else if (this._scalar < this.minScalar) {
            this._scalar = this.minScalar;
        }
    };

    return UserFocus;
});
