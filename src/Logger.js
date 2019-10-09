// Logger provides utility methods for logging
// This will be used to send error logs to discord channels later
require('colors');

module.exports = class Logger {
	constructor(prefix) {
		// The log prefix
		this.prefix = prefix.toString();

		// Sets the message types that will be logged
		//  0 - Trace logs
		//  1 - Debug logs
		//  2 - Info logs
		//  3 - Warning logs
		//  4 - Error logs
		//  >4 - Fatal logs
		this.logLevel = process.env.LOG_LEVEL || 2;
	}

	// Log a fatal error and kill the process
	fatal(message, error) {
		console.log(`${this.prefix} ${'ERROR:'.bold.red} ${message}`);
		console.error(error);
		process.exit(1);
	}

	// Log a non fatal error message
	error(message, error) {
		if (this.logLevel > 4) return;
		console.log(`${this.prefix} ${'ERROR:'.red} ${message}`);
		console.error(error);
	}

	// Log a warning message
	warn(message) {
		if (this.logLevel > 3) return;
		console.log(`${this.prefix} ${'WARN:'.yellow} ${message}`);
	}

	// Log a normal information message
	info(message) {
		if (this.logLevel > 2) return;
		console.log(`${this.prefix} ${'INFO:'.blue} ${message}`);
	}

	// Log a debug note
	debug(message) {
		if (this.logLevel > 1) return;
		console.log(`${this.prefix} ${'DEBUG:'.cyan} ${message}`);
	}

	// Log low level information such as an object dump
	trace(message) {
		if (this.logLevel > 0) return;
		console.log(`${this.prefix} ${'TRACE:'.white} ${message}`);
	}
};

