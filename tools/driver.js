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

        /// The set menu item.
        this.menuItem = null;
        
        /// The update count.
        this.updateCount = 0;
        
        /// The start time in milliseconds.
        this.startTime = (new Date()).getTime();
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

        var driver = this;
        var innerResize = function() {
            driver.resize();
        };
        window.addEventListener('resize', innerResize);
        innerResize();
        
        // Start update loop
        this.update();
    };

    /**
     * This resizes the canvas.
     */
    Driver.prototype.resize = function() {
        var width  = window.innerWidth;
        var height = window.innerHeight;
        if ((this.canvas.width !== width) || (this.canvas.height !== height)) {
            this.canvas.width  = width;
            this.canvas.height = height;
            this.gl.viewport(0, 0, width, height);
        }
    };

    /**
     * This sets the menu item.
     * @param  {Object} item  The menu item to set.
     */
    Driver.prototype.setMenuItem = function(item) {
        this.menuItem = item;
    };

    /**
     * This runs the set menu item.
     */
    Driver.prototype.gotoMenu = function() {
        this.run(this.menuItem);
    };
    
    /**
     * This starts running an item. Any previous item is stopped.
     * @param  {Object} item  The item to start running.
     * @return  {Boolean}  True on success, false otherwise.
     */
    Driver.prototype.run = function(item) {
        // Stop old item.
        if (this.item !== null) {
            this.item.stop(this.gl);
            this.item = null;
        }

        // Set some graphics defaults.
        this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
        this.gl.clearDepth(1.0);
        this.gl.disable(this.gl.CULL_FACE);
        this.gl.enable(this.gl.DEPTH_TEST);
        this.gl.depthFunc(this.gl.LESS);

        // Start new item.
        this.item = item;
        if (this.item !== null) {
            if (!this.item.start(this.gl, this)) {
                return false;
            }
            this.updateCount = 0;
            this.startTime = (new Date()).getTime();
        }
        return true;
    };

    /**
     * This updates the rendering and continues updating the rendering
     * until the selected item stops the update.
     */
    Driver.prototype.update = function() {
        if (this.item) {
            this.updateCount++;
            var curTime = (new Date()).getTime();
            var dt = (curTime - this.startTime)/1000;

            if (!this.item.update(this.gl, this.updateCount/dt)) {
                this.run(null);
            }

            if (dt > 10.0) {
                this.updateCount = 0;
                this.startTime = (new Date()).getTime();
            }
        }

        var driver = this;
        var innerUpdate = function() {
            driver.update();
        };
        requestAnimationFrame(innerUpdate);
    };
 
    return Driver;
});
