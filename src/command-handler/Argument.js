// Argument is the base class for all argument types
// It provides methods to validate and parse relevant arguments
class Argument {
	constructor(commandHandler, name) {
		// The commandHandler that instantiated this argument
		this.commandHandler = commandHandler;

		// The name of the argument
		this.name = name;
	}

	// Check if an argument can be parsed from the given string
	// Takes a string and a command's arg options
	// Returns a boolean or a string error message
	validate() {
		throw new Error('Argument has no validate function');
	}

	// Parses an argument from the given string
	// Only takes a string
	// Returns the parsed value
	parse() {
		throw new Error('Argument has no parse function');
	}
}

module.exports = Argument;

