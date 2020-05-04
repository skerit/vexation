/**
 * The Node Class
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Vexation.Vexation}   vexation
 */
const Node = Fn.inherits('Vexation.Base', 'Vexation.Node', function Node(vexation) {

	// Create the computed cache
	this.computed = {
		width  : 0,
		height : 0,
	};

	// Store the parent vexation instance
	this.vexation = vexation;

	// Child nodes
	this.children = [];

	// The parent node
	this.parent = null;

	// The surface buffer of this node
	this.buffer = new Vexation.Surface(vexation);

	// Is this node dirty?
	// Meaning: does it need to be re-rendered to the buffer?
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
Node.computedProperty(function width(new_width, old_width) {
	this.dirty = true;
	this.buffer.width = new_width;
	return new_width;
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
Node.computedProperty(function height(new_height, old_height) {
	this.dirty = true;
	this.buffer.height = new_height;
	return new_height;
});

/**
 * Get the absolute X coordinate
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Number}
 */
Node.setProperty(function absolute_x() {

	var result = this.x || 0;

	if (this.parent) {
		result += this.parent.absolute_x;
	}

	return result;
});

/**
 * Get the absolute Y coordinate
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Number}
 */
Node.setProperty(function absolute_y() {
	return this.y || 0;
});

/**
 * Append an node
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Node.setMethod(function append(node) {
	this.children.push(node);
	node.parent = this;
});

/**
 * Render this node to its own surface buffer.
 * All child nodes will also be rendered to their own surface buffers
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Node.setMethod(function render() {

	if (!this.dirty) {
		return;
	}

	let computed = this.computed,
	    content_x = 0,
	    buffer = this.buffer,
	    line,
	    cell,
	    x,
	    y;

	for (y = 0; y < computed.height; y++) {

		// Get the Vexation.Line object for this Y-coordinate
		line = this.buffer.getLine(y);

		// Now we'll iterate over all the cells
		for (x = 0; x < computed.width; x++, content_x++) {
			cell = line.getCell(x);

			if (this.bg) {
				cell.bg_color = this.bg;
			}

			if (this.content && this.content[content_x]) {
				cell.char = this.content[content_x];
			} else {
				cell.char = ' '
			}
		}
	}

	this.dirty = false;

	// If there are children, tell them to render too
	if (this.children && this.children.length) {
		let i;

		for (i = 0; i < this.children.length; i++) {
			this.children[i].render();
		}
	}
});

/**
 * Render this node to its own buffer
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Node.setMethod(function old_render() {

	if (!this.dirty) {
		return;
	}

	let buffer = this.buffer,
	    char,
	    cmd,
	    y,
	    x,
	    con_y = 0,
	    con_x = 0;

	for (y = 0; y < this.height; y++, con_y++) {
		for (x = 0; x < this.width; x++, con_x++) {
			cmd = '';
			char = '';

			if (this.bg) {
				cmd = this.vexation.terminal.backgroundCommand(...this.bg);
			}

			if (this.content && this.content[con_x]) {
				char = this.content[con_x];
			}

			// Reset per cell is stupid, but it's just a test
			//cmd += '\x1b[0m';

			buffer.put(x, y, cmd, char);
		}
	}

	this.dirty = false;

	// If there are children, tell them to render too
	if (this.children && this.children.length) {
		let i;

		for (i = 0; i < this.children.length; i++) {
			this.children[i].render();
		}
	}
});

/**
 * Get the node at the given coordinates
 * (Can be itself or a child)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Number}   x   The X position
 * @param    {Number}   y   The Y position
 */
Node.setMethod(function getNodeAt(x, y) {

	let computed = this.computed;

	if (x < 0 || y < 0 || x >= computed.width || y >= computed.height) {
		return null;
	}

	let child_count = this.children.length;

	if (!child_count) {
		return this;
	}

	let result = this,
	    child,
	    end_x,
	    end_y,
	    i;

	for (i = 0; i < child_count; i++) {
		child = this.children[i];

		// Does the child start at or after the X & Y coordinates?
		if (x >= child.x && y >= child.y) {
			end_x = child.x + child.computed.width;
			end_y = child.y + child.computed.height;

			if (x <= end_x && y <= end_y) {
				result = child;
			}
		}
	}

	return result;
});

/**
 * Draw this node (and its children) to the given surface
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Vexation.Surface}   surface    The target surface buffer
 * @param    {Number}             offset_x   The starting X position
 * @param    {Number}             offset_y   The starting Y position
 */
Node.setMethod(function drawToSurface(surface, offset_x, offset_y) {

	var x = offset_x + this.x,
	    y = offset_y + this.y;

	// Copy this surface to the given one,
	// but do it with a check to skip occluded pieces (because of children)
	this.buffer.copyToWithCheck(this, surface, x, y);

	// If there are children, tell them to render too
	if (this.children && this.children.length) {
		let i;

		for (i = 0; i < this.children.length; i++) {
			this.children[i].drawToSurface(surface, x, y);
		}
	}

});