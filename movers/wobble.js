define(function(require) {

    var Matrix = require('tools/matrix');

    /**
     * The wobble mover rotates at a rate with a cosine multiplier.
     */
    function Wobble() {
        
        /**
         * The yaw speed in radians.
         * @type {Number}
         */
        this.yawSpeed = 0.3;
        
        /**
         * The pitch speed in radians.
         * @type {Number}
         */
        this.pitchSpeed = 0.4;
        
        /**
         * The roll speed in radians.
         * @type {Number}
         */
        this.rollSpeed = 0.5;
        
        /**
         * The yaw offset in radians.
         * @type {Number}
         */
        this.yawOffset = 0.0;
        
        /**
         * The pitch offset in radians.
         * @type {Number}
         */
        this.pitchOffset = 0.0;
        
        /**
         * The roll offset in radians.
         * @type {Number}
         */
        this.rollOffset = 0.0;
        
        /**
         * The maximum yaw in radians.
         * @type {Number}
         */
        this.deltaYaw = 0.1;
        
        /**
         * The maximum pitch in radians.
         * @type {Number}
         */
        this.deltaPitch = 0.2;
        
        /**
         * The maximum roll in radians.
         * @type {Number}
         */
        this.deltaRoll = 0.1;
        
        /**
         * The initial yaw in radians.
         * @type {Number}
         */
        this.initYaw = Math.PI;
        
        /**
         * The initial pitch in radians.
         * @type {Number}
         */
        this.initPitch = 0.0;
        
        /**
         * The initial roll in radians.
         * @type {Number}
         */
        this.initRoll = 0.0;
        
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
    Wobble.prototype.start = function(gl) {
        // Do Nothing
    };

    /**
     * Updates the mover.
     */
    Wobble.prototype.update = function() {
        var curTime = (new Date()).getTime();
        var dt = (curTime - this.startTime)/1000;
        var yaw   = Math.cos(dt*this.yawSpeed   + this.yawOffset)  *this.deltaYaw   + this.initYaw;
        var pitch = Math.cos(dt*this.pitchSpeed + this.pitchOffset)*this.deltaPitch + this.initPitch;
        var roll  = Math.cos(dt*this.rollSpeed  + this.rollOffset) *this.deltaRoll  + this.initRoll;
        this._mat = Matrix.euler(yaw, pitch, roll);
    };
    
    /**
     * Gets the matrix describing the mover's position.
     * @note  The mover must be updated before this is valid.
     * @return  {Array}  The matrix for this mover.
     */
    Wobble.prototype.matrix = function() {
        return this._mat;
    };

    /**
     * This stops the mover.
     */
    Wobble.prototype.stop = function() {
        // Do Nothing
    };

    return Wobble;
});
