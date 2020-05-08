/**
 * The Polygon Node Class:
 * Nodes with weird dimensions.
 * These are actually Rectilinear Polygons
 * (All edges intersect at right angles)
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Vexation.Vexation}   vexation
 */
const Polygon = Fn.inherits('Vexation.Node', function Polygon(vexation) {
	Polygon.super.call(this, vexation);
});

/**
 * Allow setting the buffer dimensions automatically
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Number}
 */
Polygon.setProperty('allow_setting_buffer_dimensions', false);

/**
 * The lines property
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Array}
 */
Polygon.computedProperty(function lines(new_lines, old_lines) {

	let new_width = 0,
	    min_x = 0,
	    max_x = 0,
	    end_x,
	    line,
	    i;

	this.rendered = false;

	for (i = 0; i < new_lines.length; i++) {
		line = new_lines[i];

		// First entry is the start X, second is the width,
		// so to get the end X just sum them
		end_x = line[0] + line[1];

		if (line[0] < min_x) {
			min_x = line[0];
		}

		if (end_x > max_x) {
			max_x = line[1];
		}
	}

	// Get the total "bounding box" width of this element
	new_width = max_x - min_x;

	this.width = new_width;
	this.height = new_lines.length;
	this.buffer = this._createSurface(new_lines);

	return new_lines;
});

/**
 * Get the X coordinate of the last used cell
 * (This is not necesarily the bounding box, for example on polygons!)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Number}
 */
Polygon.setProperty(function end_x() {

	let start_x = this.computed.x,
	    lines = this.computed.lines;

	if (!lines.length) {
		return start_x;
	}

	let last = lines[lines.length - 1];

	return start_x + last[0] + last[1] - 1;
});

/**
 * Get the X coordinate of the last used cell
 * (This is not necesarily the bounding box, for example on polygons!)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Number}
 */
Polygon.setProperty(function end_y() {

	let lines = this.computed.lines,
	    y = this.computed.y;

	if (!lines.length) {
		return y;
	}

	y += lines.length - 1;

	return y;
});

/**
 * Create a surface
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Polygon.setMethod(function _createSurface(lines) {

	var surface = new Vexation.Surface(this.vexation);

	surface.is_polygon = true;

	if (lines == null) {
		lines = this.lines;
	}

	if (lines && lines.length) {
		surface.setPolygonRows(lines);
	}

	return surface;
});