const VexationNS = Vexation,
      os         = require('os'),
      fs         = require('fs');

/**
 * The main Vexation Class
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
const Vex = Fn.inherits('Vexation.Base', function Vexation() {

	// Create the tput instance:
	// it gets terminal information
	this.tput = new VexationNS.Tput(this);

	this.tput.parse(this.tput.getTerminfo());

	// Create the cursor instance
	this.cursor = new VexationNS.Cursor(this);

	process.stdin.on('data', function onData(chunk) {
		//console.log('Received data: "' + chunk + '"', chunk);

		// Catch ctrl+c
		if (chunk.length == 1 && chunk[0] == 3) {
			process.exit();
		}
	})

	//this.openFiles();

	process.stdin.setRawMode(true);

	this.terminal = new VexationNS.Terminal(this);
});

/**
 * Open the file handlers
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Vex.setMethod(function openFiles() {

	// Only on windows can you directly use this fd property,
	// because it is asynchronous on Linux & Max
	this.fd = process.stdin.fd;

	// So try getting the stdin synchronously.
	// This will fail on windows, but that's ok
	try {
		this.fd = fs.openSync('/dev/stdin', 'rs');
		this.using_device = true;
	} catch (e) {};

});

/**
 * Read from the input
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Number}   bytes
 */
Vex.setMethod(function readIn(bytes) {
	return process.stdin.read(bytes);
});

/**
 * Enable/disable alternate screen
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Boolean}   enable
 */
Vex.setMethod(function useAlternateScreen(enable) {

	var cmd;

	if (enable == null) {
		enable = true;
	}

	if (enable) {
		cmd = this.lookup('enter_ca_mode');
	} else {
		cmd = this.lookup('exit_ca_mode');
	}

	this.writeOut(cmd);
});

/**
 * Set a specific mode
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Vex.setMethod(function setMode(...args) {
	var param = args.join(';');
	return this.writeOut('\x1b[' + (param || '') + 'h');
});

/**
 * Render
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Vex.setMethod(function render() {

	if (!this.document) {
		return;
	}

	let surface = this.terminal.buffer;

	// Render all the contents
	this.document.render();

	// Copy everything to the buffer
	this.document.drawToTerminal(surface);

	// Create the draw command
	let command = surface.createDrawCommand();

	command = this.lookup('cursor_invisible') + command;

	//console.log('DRAW:', JSON.stringify(command))
	//return

	this.writeOut(command);

	return;

	// console.log('Terminal buffer:', surface)

	 //return

	let rows = surface.rows,
	    line,
	    cell,
	    x = 0,
	    y = 0;

	for (y = 0; y < rows.length; y++) {
		line = rows[y];

		// console.log(line)
		// break

		if (!line.dirty) {
			//continue;
		}

		line.dirty = false;

		for (x = 0; x < line.width; x++) {
			cell = line.getCell(x);

			this.cursor.moveTo(x,y);

			// if (line[x]) {
			// 	this.writeOut(line[x]);
			// }

			this.writeCell(cell.char);

		}
	}
});