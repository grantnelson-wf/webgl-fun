define(function(require) {

    var Graphics = require("tools/graphics")

    /**
     * Creates the graphical driver.
     */
    function Driver() {
    
        /// The canvas element.
        this.canvas = null;
        
        /// The graphical object.
        this.gfx = null;
        
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
            var gl = this.canvas.getContext("webgl");
            gl.viewportWidth = this.canvas.width;
            gl.viewportHeight = this.canvas.height;
        }
        catch(ex) {
           console.log('Error getting WebGL context: '+err.message);
        }

        if (!gl) {
           console.log('Failed to get the rendering context for WebGL.');
        }

        this.gfx = new Graphics(gl);
    }
    
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
            this.item.stop(this.gfx);
            this.item = null;
        }
        this.item = item;
        if (this.item) {
            if (!this.item.start(this.gfx)) {
                return false;
            }
        
            var driver = this;
            this.timer = setInterval(function() {
                    if (!driver.item.update(driver.gfx)) {
                        driver.run(null);
                    }
                }, 10);
        }
        return true;
    };
 
    return Driver;
});
