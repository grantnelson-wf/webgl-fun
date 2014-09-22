define(function(require) {

    var Matrix = require('tools/matrix');

    /**
     * The tumble mover rotates at a regular rate.
     */
    function Tumble() {
        
        /**
         * The yaw radians to rotate in one second.
         * @type {Number}
         */
        this.deltaYaw = 0.4;
        
        /**
         * The pitch radians to rotate in one second.
         * @type {Number}
         */
        this.deltaPitch = 0.5;
        
        /**
         * The roll radians to rotate in one second.
         * @type {Number}
         */
        this.deltaRoll = 0.6;
        
        /**
         * The start time in milliseconds.
         * @type {Number}
         */
        this.startTime = (new Date()).getTime();
        
        /**
         * The matrix for this mover's rotation.
         * @type {Array}
         */
        this._mat = Matrix.identity();
    }
    
    /**
     * This starts the mover.
     * @param  {WebGLRenderingContext} gl  The graphical object to start with.
     */
    Tumble.prototype.start = function(gl) {
        // Do Nothing
    };

    /**
     * Updates the mover.
     */
    Tumble.prototype.update = function() {
        var curTime = (new Date()).getTime();
        var dt = (curTime - this.startTime)/1000;
        var yaw   = dt*this.deltaYaw;
        var pitch = dt*this.deltaPitch;
        var roll  = dt*this.deltaRoll;
        this._mat = Matrix.euler(yaw, pitch, roll);
    };
    
    /**
     * Gets the matrix describing the mover's position.
     * @note  The mover must be updated before this is valid.
     * @return  {Array}  The matrix for this mover.
     */
    Tumble.prototype.matrix = function() {
        return this._mat;
    };

    /**
     * This stops the mover.
     */
    Tumble.prototype.stop = function() {
        // Do Nothing
    };

    return Tumble;
});
