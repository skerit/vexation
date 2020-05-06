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

	this.computed = {
		lines  : [],
		width  : 0,
		height : 0,
		bg     : null,
		fg     : null,
	};
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

/**
 * Render this node to its own surface buffer.
 * All child nodes will also be rendered to their own surface buffers
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Polygon.setMethod(function blarender() {

	if (this.rendered) {
		return;
	}

	let computed = this.computed,
	    content_x = 0,
	    buffer = this.buffer,
	    cell,
	    row,
	    x,
	    y;

	for (y = 0; y < computed.height; y++) {

		// Get the Vexation.Row object for this Y-coordinate
		row = this.buffer.getRow(y);

		// Now we'll iterate over all the cells
		for (x = 0; x < computed.width; x++, content_x++) {
			cell = row.getCell(x);

			if (this.bg) {
				cell.bg_color = this.bg;
			}

			if (this.content && this.content[content_x]) {
				cell.char = this.content[content_x];
			} else {
				cell.char = ''
			}
		}
	}

	this.rendered = true;

	// If there are children, tell them to render too
	if (this.children && this.children.length) {
		let i;

		for (i = 0; i < this.children.length; i++) {
			this.children[i].render();
		}
	}
});