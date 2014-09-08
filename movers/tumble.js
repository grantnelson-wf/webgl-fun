define(function() {

    var Matrix = require('tools/matrix');

    /**
     * TODO:: Comment
     */
    function Tumble() {

        /**
         * TODO:: Comment
         */
        this.initYaw = 0;
        
        /**
         * TODO:: Comment
         */
        this.initPitch = 0;
        
        /**
         * TODO:: Comment
         */
        this.initRoll = 0; 
        
        /**
         * TODO:: Comment
         */
        this.deltaYaw = 0.4;
        
        /**
         * TODO:: Comment
         */
        this.deltaPitch = 0.5;
        
        /**
         * TODO:: Comment
         */
        this.deltaRoll = 0.6;
        
        /**
         * TODO:: Comment
         */
        this.startTime = (new Date()).getTime();

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
        this._roll = 0; 
        
        /**
         * TODO:: Comment
         */
        this._mat = Matrix.identity();
    }
    
    /**
     * TODO:: Comment
     */
    Tumble.prototype.start = function() {
        // Do Nothing
    };

    /**
     * TODO:: Comment
     */
    Tumble.prototype.update = function() {
        var curTime = (new Date()).getTime();
        var dt = (curTime - this.startTime)/1000;
        this._yaw   = this.initYaw   + dt*this.deltaYaw;
        this._pitch = this.initPitch + dt*this.deltaPitch;
        this._roll  = this.initRoll  + dt*this.deltaRoll;
        this._mat = Matrix.euler(this._yaw, this._pitch, this._roll);
    };
    
    /**
     * TODO:: Comment
     */
    Tumble.prototype.matrix = function() {
        return this._mat;
    };

    /**
     * TODO:: Comment
     */
    Tumble.prototype.stop = function() {
        // Do Nothing
    };

    return Tumble;
});
