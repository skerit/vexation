/**
 * The Buffer Class
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Vexation.Vexation}   vexation   The main vexation instance
 */
const Surface = Fn.inherits('Vexation.Base', function Surface(vexation) {

	// Create the computed cache
	this.computed = {
		width  : 0,
		height : 0,
		rows   : [],
	};

	this.vexation = vexation;

	// Is this buffer dirty?
	// Meaning: does it need to be drawn to the screen again?
	this.dirty = false;
});

/**
 * The width property
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Number}
 */
Surface.computedProperty(function width(new_width, old_width) {
	this.rows = this._createRowsBuffer(this.computed.height);
	return new_width || 0;
});

/**
 * The height property
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Number}
 */
Surface.computedProperty(function height(new_height, old_height) {
	this.rows = this._createRowsBuffer(new_height || 0);
	return new_height || 0;
});

/**
 * The command_rows property
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Array}
 */
Surface.computedProperty(function rows(new_rows, old_rows) {

	if (new_rows == null) {
		new_rows = this.createRowsBuffer();
	}

	return new_rows;
});

/**
 * Create a line buffer
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Surface.setMethod(function createRowsBuffer() {
	return this._createRowsBuffer(this.computed.height);
});

/**
 * Create a line buffer with the given size
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Surface.setMethod(function _createRowsBuffer(height) {

	let result = [],
	    line,
	    x,
	    y;

	// We mainly use x,y coordinates in our methods,
	// but things are actually stored per line
	for (y = 0; y < height; y++) {
		result.push(new Vexation.Line(this));
	}

	return result;
});

/**
 * Get the line at the given Y coordinate
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Number}   y  The Y coordinate (line) in this buffer
 *
 * @return   {Vexation.Line}
 */
Surface.setMethod(function getLine(y) {
	return this.computed.rows[y];
});

/**
 * Get a specific cell
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Number}   x   The X coordinate (column) on this surface
 * @param    {Number}   y   The Y coordinate (line) on this surface
 *
 * @return   {Vexation.Cell}
 */
Surface.setMethod(function getCell(x, y) {
	return this.computed.rows[y].getCell(x);
});

/**
 * Put some data at the given coordinates
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Number}         x      The X coordinate (column) in this buffer
 * @param    {Number}         y      The Y coordinate (line) in this buffer
 * @param    {Vexation.Cell}  cell   The cell to *copy* in there
 */
Surface.setMethod(function put(x, y, cell) {

	// Ignore null cells
	// (probably because of the double-increment in copyToWithCheck)
	if (!cell) {
		return;
	}

	let original_cell = this.getCell(x, y);

	// Ignore out-of-bounds
	if (!original_cell) {
		return;
	}

	let changed = original_cell.overwrite(cell);

	if (changed) {
		//console.log('CELL', x, y, 'changed')
		this.dirty = true;
	}
});

/**
 * Copy this surface to the given surface at the given coordinates
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Vexation.Surface}  surface   Target surface
 * @param    {Number}            x         The X coordinate (column) to copy to
 * @param    {Number}            y         The Y coordinate (line) to copy to
 */
Surface.setMethod(function copyTo(surface, x, y) {

	var height = this.computed.height,
	    width = this.computed.width,
	    sx, // Source X
	    sy, // Source Y
	    dx, // Destination X
	    dy; // Destination Y

	for (sy = 0; sy < height; sy++) {
		dy = sy + y;

		for (sx = 0; sx < width; sx++) {
			dx = sx + x;

			surface.put(dx, dy, this.getCell(sx, sy));
		}
	}
});

/**
 * Copy this surface to the given surface at the given coordinates
 * Ignore if it occludes with the given element's children
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Vexation.Node}     node      Source node
 * @param    {Vexation.Surface}  surface   Target surface
 * @param    {Number}            x         The X coordinate (column) to copy to
 * @param    {Number}            y         The Y coordinate (line) to copy to
 */
Surface.setMethod(function copyToWithCheck(node, surface, x, y) {

	var height = this.computed.height,
	    width = this.computed.width,
	    found,
	    line,
	    sx, // Source X
	    sy, // Source Y
	    dx, // Destination X
	    dy; // Destination Y

	for (sy = 0; sy < height; sy++) {
		dy = sy + y;
		line = this.getLine(sy);

		// Doing two cells in one loop gives a slight speed advantage
		for (sx = 0; sx < width; sx++) {

			dx = sx + x;

			found = node.getNodeAt(sx, sy);

			if (!found || found === node) {
				surface.put(dx, dy, line.getCell(sx));
			}

			// Increment already
			sx++;

			dx = sx + x;

			found = node.getNodeAt(sx, sy);

			if (!found || found === node) {
				surface.put(dx, dy, line.getCell(sx));
			}
		}
	}

});

/**
 * Create draw command
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {String}
 */
Surface.setMethod(function createDrawCommand() {

	var result = '';

	let previous_cell,
	    rows = this.computed.rows,
	    move_template = this.lookup('cursor_address'),
	    move,
	    line,
	    cell,
	    x = 0,
	    y = 0;

	for (y = 0; y < rows.length; y++) {
		line = rows[y];

		if (!line.dirty) {
			continue;
		}

		previous_cell = null;
		line.dirty = false;

		for (x = 0; x < line.computed.width; x++) {
			cell = line.getCell(x);

			move = move_template.replace('%i%p1%d', y);
			move = move.replace('%p2%d',   x);

			result += move;

			result += cell.createDrawCommand();

			previous_cell = cell;
		}
	}

	return result;
});