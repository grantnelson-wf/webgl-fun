define(function(require) {

    var Const = require('tools/const');
    var ShapeBuilder = require('shapes/shape');

    /**
     * Creates the Workiva logo.
     */
    function WLogoBuilder() {
        // Do Nothing
    }
    
    /**
     * The name of this shape.
     * @type {String}
     */
    WLogoBuilder.prototype.name = 'Workiva';
    
    /**
     * The supported vertex types.
     * @type {Number}
     */
    WLogoBuilder.prototype.supportedTypes = Const.POS|Const.CLR3|Const.CLR4|
                                 Const.NORM|Const.TXT|Const.CUBE|Const.BINM;
    
    /**
     * Adds a vertex to the shape.
     * @param  {ShapeBuilder} shape  The shape builder.
     * @param  {Number} vertexType   The type of the vertex to create.
     * @param  {Number} px           The x component of the position.
     * @param  {Number} py           The y component of the position.
     * @param  {Number} pz           The z component of the position.
     * @param  {Number} nx           The x component of the normal.
     * @param  {Number} ny           The y component of the normal.
     * @param  {Number} nz           The z component of the normal.
     * @param  {Number} bix          The x component of the binormal.
     * @param  {Number} biy          The y component of the binormal.
     * @param  {Number} biz          The z component of the binormal.
     */
    WLogoBuilder.prototype._addVec = function(shape, vertexType, px, py, pz, nx, ny, nz, bix, biy, biz) {
        var scalar = 1/133;
        px = px*scalar-0.5;
        py = py*scalar-0.5;
        pz = pz*scalar-0.5;
        shape.pos.add(px, py, pz);
        if (vertexType&Const.CLR3) {
            shape.clr3.add(0x70/0xFF, 0xC4/0xFF, 0x0A/0xFF);
        }
        if (vertexType&Const.CLR4) {
            shape.clr4.add(0x70/0xFF, 0xC4/0xFF, 0x0A/0xFF, 1);
        }
        if (vertexType&Const.NORM) {
            shape.norm.add(nx, ny, nz);
        }
        if (vertexType&Const.BINM) {
            shape.binm.add(bix, biy, biz);
        }
        if (vertexType&Const.TXT) {
            shape.txt.add(px+0.5, py+0.5);
        }
        if (vertexType&Const.CUBE) {
            var len = Math.sqrt(px*px + py*py + pz*pz);
            shape.cube.add(px/len, py/len, pz/len);
        }
    };
    
    /**
     * Created an extended polygon and adds it to the shape builder.
     * Expects the polygon to be fan-able fill at the first point.
     * @param  {ShapeBuilder} shape  The shape builder.
     * @param  {Number} vertexType   The type of the vertex to create.
     * @param  {Array} poly          The x, y tuples for the polygon to add and extend.
     */
    WLogoBuilder.prototype._addPoly = function(shape, vertexType, poly) {
        var i, index;
        var count = poly.length/2;
        if (count < 3) {
            throw 'Error: Must have at least 3 vertices in the polygon.';
        }

        // Add front face (uses fan for triangles).
        index = shape.pos.count();
        this._addVec(shape, vertexType, poly[0], poly[1], 77, 0, 0, 1, 0, 1, 0);
        shape.triFans.start(index);
        for (i = 1, j = count - 1; i < count; i++, j--) {
            this._addVec(shape, vertexType, poly[j*2], poly[j*2+1], 77, 0, 0, 1, 0, 1, 0);
            shape.triFans.add(index+i);
        }

        // Add back face (uses fan for triangles).
        index = shape.pos.count();
        shape.triFans.start();
        for (i = 0; i < count; i++) {
            this._addVec(shape, vertexType, poly[i*2], poly[i*2+1], 55, 0, 0, -1, 0, -1, 0);
            shape.triFans.add(index+i);
        }

        // Add joining faces.
        var x1 = poly[count*2-2], y1 = poly[count*2-1];
        for (i = 0; i < count; i++) {
            var x2 = poly[i*2],   y2 = poly[i*2+1];
            var dx = x2-x1,       dy = y2-y1;
            var len = Math.sqrt(dx*dx + dy*dy);
            var nx = dy/len, ny = -dx/len;

            index = shape.pos.count();
            this._addVec(shape, vertexType, x1, y1, 77, nx, ny, 0, 0, nx, -ny);
            this._addVec(shape, vertexType, x2, y2, 77, nx, ny, 0, 0, nx, -ny);
            this._addVec(shape, vertexType, x2, y2, 55, nx, ny, 0, 0, nx, -ny);
            this._addVec(shape, vertexType, x1, y1, 55, nx, ny, 0, 0, nx, -ny);
            shape.quads.add(index, index+1, index+2, index+3);

            x1 = x2;
            y1 = y2;
        }
    };
    
    /**
     * Prepares a shape builder for a Workiva logo shape.
     * @param  {ShapeBuilder} shape  The shape builder to prepare.
     * @param  {Number} vertexType  The vertex type to build.
     */
    WLogoBuilder.prototype.prepare = function(shape, vertexType) {
        //                              I___J
        //                              |   |
        //                             |   |
        //                            |   |
        //  F___G         M___N      |   |
        //  |   |         |   |     |   |
        //   |   |   |B    |   |   |   |
        //    |   | | |     |   | |   |
        //     |  A'   |C    |  H'   |
        //      |_____|       |_____|
        //      E     D       L     K
        this._addPoly(shape, vertexType, [
            36, 83, 46, 57, 57, 90, 48, 115, // A, B, C, D
            24, 115, 0, 47, 22,47, ]); // E, F, G
        this._addPoly(shape, vertexType, [
            82, 83, 111, 0, 133, 0, 95, 115, // H, I, J, K
            72, 115, 48, 47, 70, 47 ]); // L, M, N
    };
    
    /**
     * Creates the Workiva logo shape.
     * @param  {WebGLRenderingContext} gl  The graphical object.
     * @param  {Number} vertexType  The type of the vertex to create.
     * @returns  {Shape}  The created shape.
     */
    WLogoBuilder.prototype.build = function(gl, vertexType) {
        var shape = new ShapeBuilder();
        this.prepare(shape, vertexType);
        return shape.build(gl, vertexType);
    };

    return WLogoBuilder;
});
