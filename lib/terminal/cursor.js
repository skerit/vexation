'use strict';

var VexationNS,
    libpath    = require('path'),
    Cursor,
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
 *
 * @param    {Vexation.Vexation}   vexation
 */
Cursor = Fn.inherits('Informer', 'Vexation', function Cursor(vexation) {

	// Store the parent vexation instance
	this.vexation = vexation;

	// And the tput instance
	this.tput = vexation.tput;
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

	var user_7 = this.tput.get('user7');

	if (!user_7) {
		return {
			x: 0,
			y: 0
		};
	}

	this.vexation.writeOut(user_7);

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





});