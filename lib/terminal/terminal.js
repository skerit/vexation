const env = process.env;

/**
 * The Terminal Class
 *
 * @constructor
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Vexation.Vexation}   vexation
 */
const Terminal = Fn.inherits('Vexation.Base', function Terminal(vexation) {

	// Store the parent vexation instance
	this.vexation = vexation;

	this.identify();
	this.createBuffer();
});

/**
 * Get the width of the terminal
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {Number}
 */
Terminal.setProperty(function width() {
	return process.stdout.columns;
});

/**
 * Get the height of the terminal
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {Number}
 */
Terminal.setProperty(function height() {
	return process.stdout.rows;
});

/**
 * Create the buffer
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 */
Terminal.setMethod(function createBuffer() {

	var line,
	    x,
	    y;

	if (!this.buffer) {
		this.buffer = [];
		this.char_buffer = [];
	} else {
		this.buffer.length = 0;
		this.char_buffer.length = 0;
	}

	for (y = 0; y < this.height; y++) {
		line = new Array(this.width);

		this.buffer.push(line);
		this.char_buffer.push(new Array(this.width));
	}
});

/**
 * Identify this terminal
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @return   {Object}
 */
Terminal.setMethod(function identify() {

	var term = env.TERM || '',
	    prog = env.TERM_PROGRAM || '',
	    desk = env.GIO_LAUNCHED_DESKTOP_FILE || '';

	if (!term) {
		if (process.platform == 'win32') {
			term = 'windows-ansi';
		} else {
			term = 'xterm';
		}
	}

	// The name of the type of terminal
	this.name = term;

	// Is this over ssh?
	this.is_over_ssh = !!env.SSH_CONNECTION;

	// When it's over ssh we can't correctly identify the temrinal
	if (this.is_over_ssh) {
		return;
	}

	// MacOS terminals
	this.is_macos_terminal = prog === 'Apple_Terminal';
	this.is_iterm_terminal = prog === 'iTerm.app' || !!env.ITERM_SESSION_ID;

	// Specific terminal emulators
	this.is_terminator = !!env.TERMINATOR_UUID;
	this.is_konsole = !!env.KONSOLE_PROFILE_NAME;
	this.is_terminology = !!env.TERMINOLOGY;

	// Some lookups by .desktop file
	this.is_xfce_terminal = desk.indexOf('xfce4-terminal') > -1;
	this.is_lxde_terminal = desk.indexOf('lxterminal') > -1;

	// Does this support truecolor?
	this.supports_truecolor = env.COLORTERM == 'truecolor';

	if (this.supports_truecolor && !this.is_terminator && !this.is_konsole && !this.is_terminology) {
		// The QSG_RENDER_LOOP env is a QT specific setting,
		// it can be used for many things, but retro-cool-term is the only terminal
		// emulator I know that actually forces it on
		if (env.QSG_RENDER_LOOP && env.COLORFGBG) {
			this.is_retro_cool_term = true;
		}
	}

	// Is this a VTE based terminal?
	this.is_vte_terminal = !!process.env.VTE_VERSION
		|| this.is_xfce_terminal
		|| this.is_terminator
		|| this.is_lxde_terminal
		|| this.is_konsole;

	this.is_xterm = !!env.XTERM_VERSION;

	this.is_tmux = !!env.TMUX;
});

/**
 * Get foreground color command
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Number}   red
 * @param    {Number}   green
 * @param    {Number}   blue
 *
 * @return   {String}
 */
Terminal.setMethod(function foregroundCommand(red, green, blue) {
	return '\x1b[38;2;' + red + ';' + green + ';' + blue + 'm';
});

/**
 * Get background color command
 *
 * @author   Jelle De Loecker   <jelle@develry.be>
 * @since    0.1.0
 * @version  0.1.0
 *
 * @param    {Number}   red
 * @param    {Number}   green
 * @param    {Number}   blue
 *
 * @return   {String}
 */
Terminal.setMethod(function backgroundCommand(red, green, blue) {
	return '\x1b[48;2;' + red + ';' + green + ';' + blue + 'm';
});