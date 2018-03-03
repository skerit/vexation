'use strict';

var VexationNS,
    Vexation,
    Blast      = __Protoblast,
    os         = require('os'),
    fs         = require('fs'),
    Fn         = Blast.Bound.Function;

// Get the Vexation namespace
VexationNS = Fn.getNamespace('Vexation');

/**
 * The Cursor Class
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Vexation = Fn.inherits('Informer', 'Vexation', function Vexation() {

	// Create the tput instance:
	// it gets terminal information
	this.tput = new VexationNS.Tput(this);

	this.tput.parse(this.tput.getTerminfo());

	// Create the cursor instance
	this.cursor = new VexationNS.Cursor(this);

	process.stdin.on('data', function onData(chunk) {
		console.log('Received data: "' + chunk + '"');
	})

	//this.openFiles();

});

/**
 * Open the file handlers
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Vexation.setMethod(function openFiles() {

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
 * Write to the output
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {String}   str
 */
Vexation.setMethod(function writeOut(str) {
	process.stdout.write(str);
});

/**
 * Read from the input
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Number}   byes
 */
Vexation.setMethod(function readIn(bytes) {

});