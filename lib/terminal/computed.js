/**
 * The Computed Class:
 * All computed values can be stored in here
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Vexation.Row}   row   The parent row this cell is in
 */
const Computed = Fn.inherits('Vexation.Base', function Computed() {});

/**
 * Set all possible properties to their default values
 *
 * @author   Jelle De Loecker   <jelle@elevenways.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Computed.setProperty({
	width    : 0,
	height   : 0,
	bg       : null,
	fg       : null,
	rendered : false,
	drawn    : false,
	x        : 0,
	y        : 0,
	lines    : null,
	margin_top    : 0,
	margin_right  : 0,
	margin_bottom : 0,
	margin_left   : 0,
	padding_top   : 0,
	padding_right : 0,
	padding_bottom: 0,
	padding_left  : 0,
	border_top    : 0,
	border_right  : 0,
	border_bottom : 0,
	border_left   : 0,
	content       : '',
	characters    : null,
	inner_start_x : 0,
	inner_start_y : 0,
	inner_end_x   : 0,
	inner_end_y   : 0,
	inner_width   : 0,
	inner_height  : 0,
});
