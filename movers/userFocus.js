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
    };

    /**
     * Updates the mover.
     */
    UserFocus.prototype.update = function() {
        var mat = Matrix.rotateY(-this._yaw);
        mat = Matrix.mul(mat, Matrix.rotateX(-this._pitch));
        mat = Matrix.mul(mat, Matrix.lookat(0, 0, 0, 0, -1, 0, 0, 0, -2));
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
        document.onmouseup    = null;
        document.onmousemove  = null;
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

            var halfPi =  Math.PI * 0.5;
            if (this._pitch > halfPi) {
                this._pitch = halfPi;
            }
            else if (this._pitch < -halfPi) {
                this._pitch = -halfPi;
            }

        }
    };

    return UserFocus;
});
