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

	this.computed = {
		characters : [],
		content    : '',
		lines      : [],
		width      : 0,
		height     : 0,
		bg         : null,
		fg         : null,
		x          : 0,
		y          : 0,
	};
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

	let first_row_offset = 0,
	    sx = 0,
	    sy = 0,
	    dx,
	    dy,
	    y;

	first_row_offset = this.computed.x;

	if (!this.parent) {
		return;
	}

	if (!characters) {
		characters = this.computed.characters;
	}

	let parent_rows = this.parent.buffer.rows,
	    char_index = 0,
	    line_index = 0,
	    definition = [],
	    cur_width = 0,
	    length = characters.length,
	    index = 0,
	    char,
	    row,
	    x;

	// The first row will probably skip some characters
	index = sx + first_row_offset;

	for (y = sy; y < parent_rows.length; y++) {
		row = parent_rows[y];

		for (x = sx; index < row.computed.width; x++, index++) {
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
		index = 0;
		sx = 0;

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