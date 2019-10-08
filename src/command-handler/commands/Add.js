// Add adds two numbers
// This is a test and will be removed later
const Command = require('../Command');

class AddCommand extends Command {
	constructor(client) {
		super(client, 'add', {
			description: 'Adds two numbers',
			module: 'util',
			args: [
				{
					name: 'a',
					type: 'integer',
				},
				{
					name: 'b',
					type: 'integer',
				},
			],
		});
	}

	// Run the command
	run(msg, { a, b }) {
		msg.resolve(a + b);
	}
}

module.exports = AddCommand;

