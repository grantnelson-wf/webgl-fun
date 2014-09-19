define(function(require) {

    /**
     * Creates the graphical driver.
     */
    function Driver() {
    
        /// The canvas element.
        this.canvas = null;
        
        /// The graphical object.
        this.gl = null;

        /// The control layout object.
        this.layout = null;
        
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
        }
        catch(ex) {
           console.log('Error getting WebGL context: '+err.message);
        }

        if (!this.gl) {
           console.log('Failed to get the rendering context for WebGL.');
        }

        window.addEventListener('resize', this.resize);
        this.resize();

        // Initialize the graphics.
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clearDepth(1.0);
        this.gl.enable(this.gl.CULL_FACE);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LESS);
    };

    /**
     * This resizes the canvas.
     */
    Driver.prototype.resize = function() {
        var width  = this.canvas.width;
        var height = this.canvas.height;
        if ((this.canvas.clientWidth !== width) || (this.canvas.clientHeight !== height)) {
            this.canvas.clientWidth  = width;
            this.canvas.clientHeight = height;
            this.gl.viewportWidth  = width;
            this.gl.viewportHeight = height;
        }
    };

    /**
     * This sets the layout object for the controls.
     * @param  {Layout} layout  The control layout object.
     */
    Driver.prototype.setLayout = function(layout) {
        this.layout = layout;
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
            this.layout.reset();
        }
        this.item = item;
        if (this.item) {
            if (!this.item.start(this.gl, this.layout)) {
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
