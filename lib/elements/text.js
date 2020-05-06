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
const Text = Fn.inherits('Vexation.Node', function Text(vexation) {

	Text.super.call(this, vexation);

});
return
/**
 * Render this node to its own surface buffer.
 * All child nodes will also be rendered to their own surface buffers
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Text.setMethod(function render() {

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