const libpath    = require('path'),
      os         = require('os'),
      fs         = require('fs');

/**
 * The Cursor Class
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Vexation.Vexation}   vexation
 */
const Cursor = Fn.inherits('Vexation.Base', function Cursor(vexation) {

	// Store the parent vexation instance
	this.vexation = vexation;

	// And the tput instance
	this.tput = vexation.tput;

	// The current position of the cursor
	this.current_x = -1;
	this.current_y = -1;
});

/**
 * Get the current position of the cursor
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {Object}
 */
Cursor.setMethod(function getPosition() {

	var user_7 = this.lookup('user7');

	if (!user_7) {
		return {
			x: 0,
			y: 0
		};
	}

	process.stdout._handle.setBlocking(true);

	console.log('Writing', JSON.stringify(user_7));

	this.writeOut(user_7);

	console.log('In:', this.vexation.readIn(10))


});

/**
 * Move the cursor to the given coordinates
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Number}   x
 * @param    {Number}   y
 */
Cursor.setMethod(function moveTo(x, y) {

	if (this.current_x == x && this.current_y == y) {
		//return;
	}

	let command = this.lookup('cursor_address');

	command = command.replace('%i%p1%d', y);
	command = command.replace('%p2%d',   x);

	this.current_x = x;
	this.current_y = y;

	this.writeOut(command);
});