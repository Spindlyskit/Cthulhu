// Test echos the text given in the argument
const Command = require('../Command');

class TestCommand extends Command {
	constructor(client) {
		super(client, 'test', {
			description: 'Output a message to the channel',
			module: 'util',
		});
	}

	// Run the command
	run(msg) {
		msg.resolve('Hello, World!');
	}
}

module.exports = TestCommand;

