define(function(require) {

    /**
     * Creates the graphical driver.
     */
    function Driver() {
    
        /// The canvas element.
        this.canvas = null;
        
        /// The graphical object.
        this.gl = null;
        
        /// The item being run.
        this.item = null;
        
        /// The update timer.
        this.timer = null;
    }
    
    /**
     * Sets up the driver.
     * @param  {String} canvasId  The element id for the canvas to draw on.
     */
    Driver.prototype.setup = function(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.log('Failed to retrieve the <canvas> element.');
            return;
        }

        try {
            this.gl = this.canvas.getContext('webgl');
            this.gl.viewportWidth = this.canvas.width;
            this.gl.viewportHeight = this.canvas.height;
        }
        catch(ex) {
           console.log('Error getting WebGL context: '+err.message);
        }

        if (!this.gl) {
           console.log('Failed to get the rendering context for WebGL.');
        }

        // Initialize the graphics.
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LESS);
    };
    
    /**
     * This starts running an item. Any previous item is stopped.
     * @param  {Object} item  The item to start running.
     * @return  {Boolean}  True on success, false otherwise.
     */
    Driver.prototype.run = function(item) {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        if (this.item) {
            this.item.stop(this.gl);
            this.item = null;
        }
        this.item = item;
        if (this.item) {
            if (!this.item.start(this.gl)) {
                return false;
            }
        
            var driver = this;
            // TODO:: Need to improve event loop.
            this.timer = setInterval(function() {
                    if (!driver.item.update(driver.gl)) {
                        driver.run(null);
                    }
                }, 10);
        }
        return true;
    };
 
    return Driver;
});
