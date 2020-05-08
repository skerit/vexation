/**
 * The Text Node Class:
 * The dimensions of a text node are completely dependent of the parent.
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Vexation.Vexation}   vexation
 */
const Text = Fn.inherits('Vexation.Node.Polygon', function Text(vexation) {
	Text.super.call(this, vexation);
});

/**
 * The textual content of this node
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @type     {String}
 */
Text.computedProperty(function content(new_value, old_value) {

	// Split the string into an array of its characters
	let characters = Blast.Bound.String.splitCharacters(new_value);

	this.computed.characters = characters;

	this.reflow(characters);

	return characters;
});

/**
 * Reflow the text
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Array}   characters   The text split up into its individual chars
 */
Text.setMethod(function reflow(characters) {

	// Ignore reflows when there is no parent
	if (!this.parent) {
		return;
	}

	let first_row_offset = 0,
	    parent = this.parent,
	    sx = 0,
	    sy = 0,
	    dx,
	    dy,
	    y;

	// Where we can start putting stuff in the parent
	// (This will mostly be 0,0 unless there are paddings & borders)
	let parent_sx = parent.computed.inner_start_x,
	    parent_sy = parent.computed.inner_start_y;

	// Is there some padding on the right? (Use border + padding)
	let right_padding = parent.computed.padding_right + parent.computed.border_right;

	// Is there some padding on the bottom?
	let bottom_padding = parent.computed.padding_bottom + parent.computed.border_bottom;

	if (!characters) {
		characters = this.computed.characters;
	}

	first_row_offset = this.computed.x;

	let parent_rows = this.parent.buffer.rows,
	    char_index = 0,
	    line_index = 0,
	    definition = [],
	    cur_width = 0,
	    row_width = 0,
	    max_row = parent_rows.length - bottom_padding,
	    length = characters.length,
	    index = 0,
	    char,
	    row,
	    x;

	// The first row will probably skip some characters
	index = sx + first_row_offset;

	for (y = sy; y < max_row; y++) {
		row = parent_rows[y];
		row_width = row.computed.width - right_padding;

		for (x = sx; index < row_width; x++, index++) {
			char = characters[char_index++];

			// If it's a newline, go to the next line
			if (char == '\n') {
				break;
			}

			cur_width++;

			if (char_index >= length) {
				break;
			}
		}


		if (line_index > 0) {
			sx = sx - first_row_offset;
		}

		definition.push([sx, cur_width]);

		line_index++;
		cur_width = 0;
		index = parent_sx;
		sx = parent_sx;

		if (char_index >= length) {
			break;
		}
	}

	this.lines = definition;
	char_index = 0;

	// Now put the text in
	for (y = 0; y < this.buffer.computed.height; y++) {
		row = this.buffer.rows[y];

		for (x = 0; x < row.computed.width; x++) {
			char = characters[char_index++];

			if (char == '\n') {
				char = ' ';
			}

			row.getCellByIndex(x).char = char;
		}
	}

	console.log(this.lines, this.x)

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
Text.setMethod(function getCellContent(x, y, cell_nr) {

	if (this.content) {
		return this.content[cell_nr] || ' ';
	}

	return ' ';
});

/**
 * Recalculate the positions
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Text.setMethod(function recalculate() {

	recalculate.super.call(this);
	this.reflow();

});