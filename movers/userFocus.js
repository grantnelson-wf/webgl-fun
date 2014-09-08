define(function(require) {

    var Matrix = require('tools/matrix');

    /**
     * TODO:: Comment
     */
    function UserFocus() {

        /**
         * TODO:: Comment
         */
        this.mouseXScalar = 0.01;

        /**
         * TODO:: Comment
         */
        this.mouseYScalar = 0.01;

        /**
         * TODO:: Comment
         */
        this._yaw = 0;
        
        /**
         * TODO:: Comment
         */
        this._pitch = 0;
        
        /**
         * TODO:: Comment
         */
        this._mouseDown = false;
        
        /**
         * TODO:: Comment
         */
        this._lastMouseX = 0;
        
        /**
         * TODO:: Comment
         */
        this._lastMouseY = 0;
        
        /**
         * TODO:: Comment
         */
        this._lastYaw = 0;
        
        /**
         * TODO:: Comment
         */
        this._lastPitch = 0;
        
        /**
         * TODO:: Comment
         */
        this._mat = Matrix.identity();
    }
    
    /**
     * TODO:: Comment
     */
    UserFocus.prototype.start = function(gl) {
        this._mouseDown = false;
        var self = this;
        gl.canvas.onmousedown = function(event) {
            self._handleMouseDown(event);
        }
        document.onmouseup = function(event) {
            self._handleMouseUp(event);
        }
        document.onmousemove = function(event) {
            self._handleMouseMove(event);
        }
    };

    /**
     * TODO:: Comment
     */
    UserFocus.prototype.update = function() {
        var mat = Matrix.rotateY(-this._yaw);
        mat = Matrix.mul(mat, Matrix.rotateX(-this._pitch));
        mat = Matrix.mul(mat, Matrix.lookat(0, 0, 0, 0, 1, 0, 0, 0, -2));
        this._mat = mat;
    };
    
    /**
     * TODO:: Comment
     */
    UserFocus.prototype.matrix = function() {
        return this._mat;
    };

    /**
     * TODO:: Comment
     */
    UserFocus.prototype.stop = function(gl) {
        gl.canvas.onmousedown = null;
        document.onmouseup    = null;
        document.onmousemove  = null;
    };
    
    /**
     * TODO:: Comment
     */
    UserFocus.prototype._handleMouseDown = function(event) {
        this._mouseDown  = true;
        this._lastMouseX = event.clientX;
        this._lastMouseY = event.clientY;
        this._lastYaw    = this._yaw;
        this._lastPitch  = this._pitch;
    };
    
    /**
     * TODO:: Comment
     */
    UserFocus.prototype._handleMouseUp = function(event) {
        this._mouseDown = false;
    };
    
    /**
     * TODO:: Comment
     */
    UserFocus.prototype._handleMouseMove = function(event) {
        if (this._mouseDown) {
            this._yaw   = this._lastYaw   + (event.clientX - this._lastMouseX)*this.mouseXScalar;
            this._pitch = this._lastPitch + (event.clientY - this._lastMouseY)*this.mouseYScalar;
        }
    };

    return UserFocus;
});
