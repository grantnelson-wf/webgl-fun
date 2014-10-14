define(function(require) {

    var ddmax = 0.00001;
    var dmax  = 0.001;
    
    function clamp(val, min, max) {
        if (val < min) {
            return min;
        } else if (val > max) {
            return max;
        } else {
            return val;
        }
    }

    /**
     * The data for drawing a fire fly.
     */
    function FireFly() {
        this.cx = Math.random()*20.0 - 10.0;
        this.cy = Math.random()* 9.9 +  0.1;
        this.cz = Math.random()*20.0 - 10.0;
        this.x  = Math.random()*20.0 - 10.0;
        this.y  = Math.random()*10.0;
        this.z  = Math.random()*20.0 - 10.0;
        this.dx = (Math.random()*2.0 - 1.0)*dmax;
        this.dy = (Math.random()*2.0 - 1.0)*dmax;
        this.dz = (Math.random()*2.0 - 1.0)*dmax;
        this.brightness = 1;
    }
    
    FireFly.prototype.update = function(dt) {
        var ddx = (Math.random()*2.0 - 1.0 + (this.cx-this.x)*0.1)*ddmax;
        var ddy = (Math.random()*2.0 - 1.0 + (this.cy-this.y)*0.1)*ddmax;
        var ddz = (Math.random()*2.0 - 1.0 + (this.cz-this.z)*0.1)*ddmax;
        this.dx = clamp(this.dx + dt*ddx, -dmax, dmax);
        this.dy = clamp(this.dy + dt*ddy, -dmax, dmax);
        this.dz = clamp(this.dz + dt*ddz, -dmax, dmax);
        this.x  = clamp(this.x  + dt*this.dx, -10.0, 10.0);
        this.y  = clamp(this.y  + dt*this.dy,   0.1,  9.9);
        this.z  = clamp(this.z  + dt*this.dz, -10.0, 10.0);
    }
   
    return FireFly;
});