// ArgumentString parses arguments from a given string
// Command name parsing it not performed here, that is done by the handler itself
class ArgumentString {
	constructor(commandHandler, rawString) {
		// The commandHandler that instantiated this ArgumentString
		this.commandHandler = commandHandler;
		this.client = commandHandler.client;

		// The raw message content with the prefix and command removed
		this.rawString = rawString;

		// The arguments we have parsed
		this.args = [];
	}

	// Parse the raw string, storing results in this.args
	parse() {

	}
}

module.exports = ArgumentString;

