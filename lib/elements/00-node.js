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
	this.computed = new Vexation.Computed();

	// Store the parent vexation instance
	this.vexation = vexation;

	// Child nodes
	this.children = [];

	// The parent node
	this.parent = null;

	// The surface buffer of this node
	this.buffer = this._createSurface();

	// Are we recalculating?
	this._recalculating = false;
});

/**
 * Border tilesets
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Object}
 */
Node.tilesets = {
	default : ['┌', '─', '┐', '│', '│', '└', '─', '┘'],
	outline : ['▛', '▀', '▜', '▌', '▐', '▙', '▄', '▟'],
};

/**
 * Has this node been drawn to its parent?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Boolean}
 */
Node.computedProperty(function drawn(new_value) {

	if (this.parent && !new_value) {

		// When this needs a redraw, the parent does too
		this.parent.drawn = false;
	}

	return new_value;
});

/**
 * Has this node been rendered?
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Boolean}
 */
Node.computedProperty(function rendered(new_value) {

	// If it needs a render, it'll also need a redraw
	if (!new_value) {
		this.drawn = false;
	}

	return new_value;
});

/**
 * The X coordinates of this node inside its parent
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Number}
 */
Node.computedProperty(function x(new_value, old_value) {

	if (new_value !== old_value) {
		this.drawn = false;
		this.informParentSurface(new_value, this.computed.y);
	}

	return new_value;
});

/**
 * The Y coordinates of this node inside its parent
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Number}
 */
Node.computedProperty(function y(new_value, old_value) {

	if (new_value !== old_value) {
		this.drawn = false;
		this.informParentSurface(this.computed.x, old_value);
		this.informParentSurface(this.computed.x, new_value);
	}

	return new_value;
});

/**
 * Margins, paddings & borders
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Number}
 */
Node.addNumericComputedProperty([
	'margin_top',
	'margin_right',
	'margin_bottom',
	'margin_left',
	'padding_top',
	'padding_right',
	'padding_bottom',
	'padding_left',
	'border_top',
	'border_right',
	'border_bottom',
	'border_left'
]);

/**
 * Values that can only be gotten, not set
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Number}
 */
Node.setComputedPropertyGetter([
	'inner_start_x',
	'inner_start_y'
]);

/**
 * The width property
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Number}
 */
Node.addNumericComputedProperty(function width(new_width, old_width) {

	this.rendered = false;

	if (this.allow_setting_buffer_dimensions) {
		this.buffer.width = new_width;
	}

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
Node.addNumericComputedProperty(function height(new_height, old_height) {

	this.rendered = false;

	if (this.allow_setting_buffer_dimensions) {
		this.buffer.height = new_height;
	}

	return new_height;
});

/**
 * The inner_width property
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Number}
 */
Node.addNumericComputedProperty(function inner_width(new_width, old_width) {

	let difference = old_width - new_width;

	this.width += difference;

	return new_width;
});

/**
 * The inner_height property
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Number}
 */
Node.addNumericComputedProperty(function inner_height(new_height, old_height) {
	let difference = old_height - new_height;

	this.height += difference;

	return new_height;
});

/**
 * Get the background color
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Vexation.Color}
 */
Node.computedProperty(function bg(new_color) {
	// @TODO: rerender on change
	return Vexation.Color.from(new_color);
});

/**
 * Get the foreground color
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Vexation.Color}
 */
Node.computedProperty(function fg(new_color) {
	// @TODO: rerender on change
	return Vexation.Color.from(new_color);
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
Node.setProperty('allow_setting_buffer_dimensions', true);

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
 * Get the X coordinate of the last used cell
 * (This is not necesarily the bounding box, for example on polygons!)
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Number}
 */
Node.setProperty(function end_x() {
	return this.computed.x + this.computed.width - 1;
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
Node.setProperty(function end_y() {
	return this.computed.y + this.computed.height - 1;
});

/**
 * Get the previous sibling node if it exists
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Node}
 */
Node.setProperty(function previous_sibling() {
	return this.getSibling(-1);
});

/**
 * Get the next sibling node if it exists
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {Node}
 */
Node.setProperty(function next_sibling() {
	return this.getSibling(1);
});

/**
 * Create a surface
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Node.setMethod(function _createSurface() {
	return new Vexation.Surface(this.vexation);
});

/**
 * Get a sibling
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Number}   direction
 *
 * @return   {Node}
 */
Node.setMethod(function getSibling(direction) {

	if (!this.parent) {
		return null;
	}

	let i = this.parent.children.indexOf(this);

	return this.parent.children[i + direction] || null;
});


/**
 * Recalculate the positions
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Node.setMethod(function recalculate() {

	if (this._recalculating) {
		return;
	}

	this._recalculating = true;

	let computed = this.computed,
	    parent = this.parent,
	    sibling = this.previous_sibling,
	    parent_sx = 0,
	    parent_sy = 0;

	if (parent) {
		parent_sx = parent.computed.inner_start_x;
		parent_sy = parent.computed.inner_start_y;
	}

	let x = parent_sx,
	    y = parent_sy;

	if (this.position != 'absolute') {
		if (sibling) {
			x = sibling.end_x + 1;
			y = sibling.end_y;

			// Don't let the element start out-of-bounds
			if (x >= parent.computed.inner_width) {
				x = parent_sx;
				y++;
			}
		}

		this.x = x;
		this.y = y;
	} else {
		x = this.x;
		y = this.y;
	}

	computed.inner_width = computed.width - computed.padding_left - computed.padding_right - computed.border_left - computed.border_right;
	computed.inner_height = computed.height - computed.padding_top - computed.padding_bottom - computed.border_top - computed.border_bottom;

	if (computed.padding_top || computed.border_top) {
		computed.inner_start_y = 0 + computed.padding_top + computed.border_top;
	} else {
		computed.inner_start_y = 0;
	}

	computed.inner_end_y = computed.inner_start_y + computed.inner_height - 1;

	if (computed.padding_left || computed.border_left) {
		computed.inner_start_x = 0 + computed.padding_left + computed.border_left;
	} else {
		computed.inner_start_x = 0;
	}

	computed.inner_end_x = computed.inner_start_x + computed.inner_width - 1;

	this._recalculating = false;
});

/**
 * Append an node
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Node.setMethod(function append(node) {

	if (typeof node == 'string') {
		let content = node;
		node = new Vexation.Node.Text(this.vexation);
		node.bg = [0,80,0]
		node.content = content;
	}

	this.children.push(node);
	node.parent = this;

	node.recalculate();

	return node;
});

/**
 * Inform the parent surface of our changes,
 * marking the required rows as dirty
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Number}   x   The X start position to mark dirty (ignored, as we're row based)
 * @param    {Number}   y   The Y start position to mark dirty
 */
Node.setMethod(function informParentSurface(x, y) {

	if (this.parent == null) {
		return;
	}

	let sy = y,
	    dy = y + this.computed.height;

	this.parent.markDirtyRows(sy, dy);
});

/**
 * Mark dirty rows on our surface
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Number}   sy   The Y start position to mark dirty
 * @param    {Number}   dy   The Y end position
 */
Node.setMethod(function markDirtyRows(sy, dy) {

	this.buffer.markDirtyRows(sy, dy);

	let parent_sy = sy + this.computed.y,
	    parent_dy = dy + this.computed.y;

	if (this.parent) {
		this.parent.markDirtyRows(parent_sy, parent_dy);
	} else {
		this.vexation.terminal.buffer.markDirtyRows(parent_sy, parent_dy);
	}
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

	const computed = this.computed;

	if (computed.rendered) {
		return;
	}

	let content_x = 0,
	    buffer = this.buffer,
	    index = 0,
	    width,
	    char,
	    cell,
	    row,
	    x,
	    y;

	for (y = 0; y < computed.height; y++) {

		// Get the Vexation.Row object for this Y-coordinate
		row = this.buffer.getRow(y);

		if (!row) {
			continue;
		}

		row.dirty = true;

		width = row.width;
		index = 0;

		// Now we'll iterate over all the cells
		for (x = row.x; index < width; x++, content_x++, index++) {
			cell = row.getCell(x);

			if (this.bg) {
				cell.bg_color = this.bg;
			}

			char = this.getCellContent(x, y, content_x);

			cell.char = char;
		}
	}

	computed.rendered = true;

	// If there are children, tell them to render too
	if (this.children && this.children.length) {
		let i;

		for (i = 0; i < this.children.length; i++) {
			this.children[i].render();
		}
	}
});

/**
 * Get the border tileset
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {Array}
 */
Node.setMethod(function getBorderTileset() {
	return Node.tilesets.outline;
});

/**
 * Get the content of this cell
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Number}   x
 * @param    {Number}   y
 *
 * @return   {String}
 */
Node.setMethod(function getCellContent(x, y, cell_nr) {

	// @TODO: use BCE instead of spaces
	var computed = this.computed,
	    char = ' ';

	if (!computed.border_top && !computed.border_left && !computed.border_right && !computed.border_bottom) {
		return char;
	}

	let tileset = this.getBorderTileset();

	if (computed.border_top > y) {
		if (computed.border_left > x) {
			// Top left
			char = tileset[0];
		} else if (computed.width - computed.border_right == x) {
			// Top right
			char = tileset[2];
		} else {
			// Top middle
			char = tileset[1];
		}
	} else if (computed.border_bottom && computed.height - computed.border_bottom == y) {
		if (computed.border_left > x) {
			// Bottom left
			char = tileset[5];
		} else if (computed.width - computed.border_right == x) {
			// Bottom right
			char = tileset[7];
		} else {
			// Bottom middle
			char = tileset[6];
		}
	} else if (computed.border_left && computed.border_left > x) {
		// Middle left
		char = tileset[3];
	} else if (computed.border_right && computed.width - computed.border_right == x) {
		// Middle right
		char = tileset[4];
	}

	return char;
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

	const computed = this.computed;

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
	    cc,
	    i;

	for (i = 0; i < child_count; i++) {
		child = this.children[i];
		cc = child.computed;

		// Does the child start at or after the X & Y coordinates?
		if (x >= cc.x && y >= cc.y) {
			end_x = cc.x + cc.width;
			end_y = cc.y + cc.height;

			if (x <= end_x && y <= end_y) {
				result = child;
			}
		}
	}

	return result;
});

/**
 * Draw this root node to the terminal
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Node.setMethod(function drawToTerminal() {

	if (this.computed.drawn) {
		return false;
	}

	let surface = this.vexation.terminal.buffer;

	this.drawn = true;

	this.drawToSurface(surface, 0, 0);
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

	let x = offset_x + this.x,
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